import 'package:flutter/material.dart';
import 'dart:async';

// ignore: library_prefixes
import 'package:mobile/models/attendance_model.dart' as AttendanceModel;
import 'package:intl/intl.dart';
import 'package:mobile/service/attendance_service.dart';
import 'package:mobile/service/auth_service.dart';

class Attendance extends StatefulWidget {
  const Attendance({super.key});

  @override
  State<Attendance> createState() => _Attendance();
}

class _Attendance extends State<Attendance> {
  DateTime _currentTime = DateTime.now();
  AttendanceModel.Attendance? _currentAttendance;
  bool _isLoading = false;
  String? _errorMessage;

  List<AttendanceModel.Attendance> _attendanceHistory = [];

  final AttendanceService _attendanceService = AttendanceService();
  final AuthService _authService = AuthService();

  bool _isCheckedIn = true;
  bool _showCamera = false;
  String _viewMode = 'timeline';
  late Timer _timer;

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      setState(() {
        _currentTime = DateTime.now();
      });
    });

    _fetchAttendanceHistory();
    _checkCurrentAttendanceStatus();
  }

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  Future<void> _fetchAttendanceHistory() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final userData = await _authService.getUserData();
      if (userData == null) {
        throw Exception('Employee ID not found. Please log in.');
      }

      final result = await _attendanceService.getAttendanceByEmployee(
        userData['id'],
      );

      if (mounted) {
        if (result['success']) {
          setState(() {
            _attendanceHistory =
                result['attendances'] as List<AttendanceModel.Attendance>;
          });
        } else {
          setState(() {
            _errorMessage = result['message'];
            _attendanceHistory = [];
          });
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text(_errorMessage!)));
        }
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = 'Error fetching attendance history: $e';
          _attendanceHistory = [];
        });
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text(_errorMessage!)));
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _checkCurrentAttendanceStatus() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final userData = await _authService.getUserData();
      if (userData == null) {
        throw Exception('Employee ID not found. Please log in.');
      }

      final result = await _attendanceService.getAttendanceByDate(
        DateTime.now(),
      );

      if (mounted) {
        if (result['success']) {
          final todayAttendance =
              (result['attendances'] as List<AttendanceModel.Attendance>)
                  .firstWhere(
                    (att) =>
                        att.employeeId == userData['id'] &&
                        att.date.year == DateTime.now().year &&
                        att.date.month == DateTime.now().month &&
                        att.date.day == DateTime.now().day,
                    orElse: () => AttendanceModel.Attendance(
                      id: '',
                      employeeId: userData['id'],
                      date: DateTime.now(),
                      status: '',
                    ),
                  );

          if (todayAttendance.id.isNotEmpty) {
            setState(() {
              _currentAttendance = todayAttendance;

              _isCheckedIn =
                  _currentAttendance!.checkIn != null &&
                  _currentAttendance!.checkOut == null;
            });
          } else {
            setState(() {
              _currentAttendance = null;
              _isCheckedIn = false;
            });
          }
        } else {
          setState(() {
            _currentAttendance = null;
            _isCheckedIn = false;
            _errorMessage = result['message'];
          });
        }
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = 'Error checking daily attendance: $e';
          _currentAttendance = null;
          _isCheckedIn = false;
        });
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text(_errorMessage!)));
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  void _handleCheckInOut() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    final userData = await _authService.getUserData();
    if (userData == null) {
      _errorMessage = 'Employee ID not found. Cannot perform action.';
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text(_errorMessage!)));
      setState(() {
        _isLoading = false;
      });
      return;
    }

    if (!_isCheckedIn) {
      final checkInTime = DateTime.now();
      final result = await _attendanceService.createAttendance(
        employeeId: userData['id'],
        date: DateTime.now(),
        checkInTime: checkInTime,
        status: 'present',
      );

      if (mounted) {
        if (result['success']) {
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text(result['message'])));

          _currentAttendance = result['attendance'];
          _isCheckedIn = true;
          _fetchAttendanceHistory();
          _checkCurrentAttendanceStatus();
        } else {
          _errorMessage = result['message'];
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text(_errorMessage!)));
        }
        setState(() {
          _isLoading = false;
        });
      }
    } else {
      if (_currentAttendance == null || _currentAttendance!.id.isEmpty) {
        _errorMessage = 'No active check-in record found for today.';
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text(_errorMessage!)));
        setState(() {
          _isLoading = false;
        });
        return;
      }

      final checkOutTime = DateTime.now();
      final result = await _attendanceService.updateAttendance(
        attendanceId: _currentAttendance!.id,
        checkOutTime: checkOutTime,
        status: 'present',
      );

      if (mounted) {
        if (result['success']) {
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text(result['message'])));

          _currentAttendance = result['attendance'];
          _isCheckedIn = false;
          _fetchAttendanceHistory();
          _checkCurrentAttendanceStatus();
        } else {
          _errorMessage = result['message'];
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text(_errorMessage!)));
        }
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  void _handleCameraCapture() {
    setState(() {
      _showCamera = false;
    });
  }

  String _calculateHours(DateTime? checkIn, DateTime? checkOut) {
    if (checkIn == null || checkOut == null) {
      return '0h 0m';
    }
    final duration = checkOut.difference(checkIn);
    final hours = duration.inHours;
    final minutes = duration.inMinutes.remainder(60);
    return '${hours}h ${minutes}m';
  }

  Map<String, Color> _getStatusColor(String status) {
    switch (status) {
      case 'present':
        return {
          'bg': Colors.green[100]!,
          'text': Colors.green[700]!,
          'border': Colors.green[200]!,
        };
      case 'sick':
        return {
          'bg': Colors.red[100]!,
          'text': Colors.red[700]!,
          'border': Colors.red[200]!,
        };
      case 'leave':
        return {
          'bg': Colors.blue[100]!,
          'text': Colors.blue[700]!,
          'border': Colors.blue[200]!,
        };
      default:
        return {
          'bg': Colors.grey[100]!,
          'text': Colors.grey[700]!,
          'border': Colors.grey[200]!,
        };
    }
  }

  Icon _getStatusIcon(String status) {
    switch (status) {
      case 'present':
        return const Icon(Icons.check_circle, size: 16);
      case 'sick':
        return const Icon(Icons.cancel, size: 16);
      case 'leave':
        return const Icon(Icons.info, size: 16);
      default:
        return const Icon(Icons.info, size: 16);
    }
  }

  final Map<String, dynamic> _weeklyStats = {
    'present': 4,
    'total': 5,
    'percentage': 80,
    'totalHours': '34h 15m',
  };

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFFF8FAFC), Color(0xFFEEF2FF)],
          ),
        ),
        child: Stack(
          children: [
            Column(
              children: [
                Expanded(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 24.0,
                      vertical: 24.0,
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        AnimatedContainer(
                          duration: const Duration(milliseconds: 300),
                          padding: const EdgeInsets.all(24.0),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(24.0),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.1),
                                blurRadius: 10,
                                offset: const Offset(0, 5),
                              ),
                            ],
                            gradient: _isCheckedIn
                                ? LinearGradient(
                                    begin: Alignment.centerLeft,
                                    end: Alignment.centerRight,
                                    colors: [
                                      Colors.green[500]!,
                                      Colors.teal[600]!,
                                    ],
                                  )
                                : LinearGradient(
                                    begin: Alignment.centerLeft,
                                    end: Alignment.centerRight,
                                    colors: [
                                      Colors.blue[500]!,
                                      Colors.indigo[600]!,
                                    ],
                                  ),
                          ),
                          child: _isLoading
                              ? const Center(
                                  child: CircularProgressIndicator(
                                    color: Colors.white,
                                  ),
                                )
                              : Column(
                                  children: [
                                    Container(
                                      width: 80,
                                      height: 80,
                                      margin: const EdgeInsets.only(
                                        bottom: 16.0,
                                      ),
                                      decoration: BoxDecoration(
                                        shape: BoxShape.circle,
                                        color: Colors.white.withOpacity(0.2),
                                      ),
                                      child: const Icon(
                                        Icons.access_time,
                                        size: 40,
                                        color: Colors.white,
                                      ),
                                    ),
                                    Text(
                                      _isCheckedIn
                                          ? "You're Checked In!"
                                          : "Ready to Check In?",
                                      style: const TextStyle(
                                        fontSize: 24,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.white,
                                      ),
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      _isCheckedIn
                                          ? "Working for ${_currentAttendance?.checkIn != null ? DateFormat('HH:mm').format(_currentAttendance!.checkIn!) : 'N/A'}"
                                          : "Tap to start your workday",
                                      style: TextStyle(
                                        fontSize: 14,
                                        color: Colors.white.withOpacity(0.9),
                                      ),
                                    ),
                                    const SizedBox(height: 24),
                                    SizedBox(
                                      width: double.infinity,
                                      child: ElevatedButton(
                                        onPressed: _isLoading
                                            ? null
                                            : _handleCheckInOut,
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: Colors.white,
                                          padding: const EdgeInsets.symmetric(
                                            vertical: 16.0,
                                          ),
                                          shape: RoundedRectangleBorder(
                                            borderRadius: BorderRadius.circular(
                                              16.0,
                                            ),
                                          ),
                                          shadowColor: Colors.transparent,
                                        ),
                                        child: Text(
                                          _isCheckedIn
                                              ? '👋 Check Out'
                                              : '🚀 Check In',
                                          style: TextStyle(
                                            fontSize: 18,
                                            fontWeight: FontWeight.w600,
                                            color: _isCheckedIn
                                                ? Colors.green[600]
                                                : Colors.blue[600],
                                          ),
                                        ),
                                      ),
                                    ),
                                    if (_errorMessage != null)
                                      Padding(
                                        padding: const EdgeInsets.only(top: 10),
                                        child: Text(
                                          _errorMessage!,
                                          style: const TextStyle(
                                            color: Colors.white,
                                            fontSize: 12,
                                          ),
                                          textAlign: TextAlign.center,
                                        ),
                                      ),
                                  ],
                                ),
                        ),
                        const SizedBox(height: 24),

                        Container(
                          padding: const EdgeInsets.all(20.0),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(16.0),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.05),
                                blurRadius: 4,
                                offset: const Offset(0, 2),
                              ),
                            ],
                            border: Border.all(color: Colors.blueGrey[50]!),
                          ),
                          child: _isLoading
                              ? const Center(child: CircularProgressIndicator())
                              : Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Text(
                                      'This Week',
                                      style: TextStyle(
                                        fontSize: 18,
                                        fontWeight: FontWeight.w600,
                                        color: Color(0xFF1E293B),
                                      ),
                                    ),
                                    const SizedBox(height: 16),

                                    Row(
                                      children: [
                                        Expanded(
                                          child: Column(
                                            children: [
                                              Text(
                                                '${_weeklyStats['present']}/${_weeklyStats['total']}',
                                                style: TextStyle(
                                                  fontSize: 24,
                                                  fontWeight: FontWeight.bold,
                                                  color: Colors.green[600],
                                                ),
                                              ),
                                              const Text(
                                                'Days Present',
                                                style: TextStyle(
                                                  fontSize: 14,
                                                  color: Color(0xFF64748B),
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                        Expanded(
                                          child: Column(
                                            children: [
                                              Text(
                                                _weeklyStats['totalHours'],
                                                style: TextStyle(
                                                  fontSize: 24,
                                                  fontWeight: FontWeight.bold,
                                                  color: Colors.blue[600],
                                                ),
                                              ),
                                              const Text(
                                                'Total Hours',
                                                style: TextStyle(
                                                  fontSize: 14,
                                                  color: Color(0xFF64748B),
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 16),
                                    Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Row(
                                          mainAxisAlignment:
                                              MainAxisAlignment.spaceBetween,
                                          children: [
                                            Text(
                                              'Weekly Attendance',
                                              style: TextStyle(
                                                fontSize: 14,
                                                color: Colors.blueGrey[600],
                                              ),
                                            ),
                                            Text(
                                              '${_weeklyStats['percentage']}%',
                                              style: TextStyle(
                                                fontSize: 14,
                                                fontWeight: FontWeight.w600,
                                                color: Colors.blueGrey[700],
                                              ),
                                            ),
                                          ],
                                        ),
                                        const SizedBox(height: 8),
                                        ClipRRect(
                                          borderRadius: BorderRadius.circular(
                                            10.0,
                                          ),
                                          child: LinearProgressIndicator(
                                            value:
                                                _weeklyStats['percentage'] /
                                                100,
                                            backgroundColor:
                                                Colors.blueGrey[200],
                                            valueColor:
                                                const AlwaysStoppedAnimation<
                                                  Color
                                                >(Color(0xFF10B981)),
                                            minHeight: 8,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                        ),
                        const SizedBox(height: 24),

                        Container(
                          padding: const EdgeInsets.all(8.0),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(16.0),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.05),
                                blurRadius: 4,
                                offset: const Offset(0, 2),
                              ),
                            ],
                            border: Border.all(color: Colors.blueGrey[50]!),
                          ),
                          child: Row(
                            children: [
                              Expanded(
                                child: TextButton(
                                  onPressed: () {
                                    setState(() {
                                      _viewMode = 'timeline';
                                    });
                                  },
                                  style: TextButton.styleFrom(
                                    backgroundColor: _viewMode == 'timeline'
                                        ? Colors.blue[500]
                                        : Colors.transparent,
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(8.0),
                                    ),
                                    padding: const EdgeInsets.symmetric(
                                      vertical: 10.0,
                                      horizontal: 16.0,
                                    ),
                                  ),
                                  child: Text(
                                    'Timeline',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w500,
                                      color: _viewMode == 'timeline'
                                          ? Colors.white
                                          : Colors.blueGrey[600],
                                    ),
                                  ),
                                ),
                              ),
                              Expanded(
                                child: TextButton(
                                  onPressed: () {
                                    setState(() {
                                      _viewMode = 'calendar';
                                    });
                                  },
                                  style: TextButton.styleFrom(
                                    backgroundColor: _viewMode == 'calendar'
                                        ? Colors.blue[500]
                                        : Colors.transparent,
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(8.0),
                                    ),
                                  ),
                                  child: Text(
                                    'Calendar',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w500,
                                      color: _viewMode == 'calendar'
                                          ? Colors.white
                                          : Colors.blueGrey[600],
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 24),

                        Container(
                          padding: const EdgeInsets.all(20.0),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(16.0),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.05),
                                blurRadius: 4,
                                offset: const Offset(0, 2),
                              ),
                            ],
                            border: Border.all(color: Colors.blueGrey[50]!),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  const Text(
                                    'Recent Attendance',
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.w600,
                                      color: Color(0xFF1E293B),
                                    ),
                                  ),
                                  Row(
                                    children: [
                                      IconButton(
                                        onPressed: () {},
                                        icon: Icon(
                                          Icons.chevron_left,
                                          size: 24,
                                          color: Colors.blueGrey[400],
                                        ),
                                        splashRadius: 20,
                                      ),
                                      IconButton(
                                        onPressed: () {},
                                        icon: Icon(
                                          Icons.chevron_right,
                                          size: 24,
                                          color: Colors.blueGrey[400],
                                        ),
                                        splashRadius: 20,
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                              const SizedBox(height: 16),
                              _isLoading
                                  ? const Center(
                                      child: CircularProgressIndicator(),
                                    )
                                  : _attendanceHistory.isEmpty
                                  ? const Center(
                                      child: Padding(
                                        padding: EdgeInsets.all(16.0),
                                        child: Text(
                                          'No attendance records found.',
                                        ),
                                      ),
                                    )
                                  : _viewMode == 'timeline'
                                  ? Column(
                                      children: _attendanceHistory.map((
                                        record,
                                      ) {
                                        final colors = _getStatusColor(
                                          record.status,
                                        );
                                        return Container(
                                          margin: const EdgeInsets.only(
                                            bottom: 12.0,
                                          ),
                                          padding: const EdgeInsets.all(16.0),
                                          decoration: BoxDecoration(
                                            color: colors['bg'],
                                            borderRadius: BorderRadius.circular(
                                              16.0,
                                            ),
                                            border: Border.all(
                                              color: colors['border']!,
                                            ),
                                          ),
                                          child: Row(
                                            mainAxisAlignment:
                                                MainAxisAlignment.spaceBetween,
                                            children: [
                                              Row(
                                                children: [
                                                  IconTheme(
                                                    data: IconThemeData(
                                                      color: colors['text'],
                                                    ),
                                                    child: _getStatusIcon(
                                                      record.status,
                                                    ),
                                                  ),
                                                  const SizedBox(width: 12),
                                                  Column(
                                                    crossAxisAlignment:
                                                        CrossAxisAlignment
                                                            .start,
                                                    children: [
                                                      Text(
                                                        DateFormat(
                                                          'MMM d, yyyy',
                                                        ).format(record.date),
                                                        style: const TextStyle(
                                                          fontWeight:
                                                              FontWeight.w600,
                                                          color: Color(
                                                            0xFF1E293B,
                                                          ),
                                                        ),
                                                      ),
                                                      Text(
                                                        record.status,
                                                        style: TextStyle(
                                                          fontSize: 14,
                                                          color: colors['text'],
                                                          fontStyle:
                                                              FontStyle.italic,
                                                        ),
                                                      ),
                                                    ],
                                                  ),
                                                ],
                                              ),
                                              Column(
                                                crossAxisAlignment:
                                                    CrossAxisAlignment.end,
                                                children: [
                                                  Text(
                                                    '${record.checkIn != null ? DateFormat('h:mm a').format(record.checkIn!.toLocal()) : '-'} - ${record.checkOut != null ? DateFormat('h:mm a').format(record.checkOut!.toLocal()) : '-'}',
                                                    style: TextStyle(
                                                      fontSize: 14,
                                                      fontFamily: 'monospace',
                                                      color:
                                                          Colors.blueGrey[600],
                                                    ),
                                                  ),

                                                  Text(
                                                    _calculateHours(
                                                      record.checkIn,
                                                      record.checkOut,
                                                    ),
                                                    style: TextStyle(
                                                      fontSize: 12,
                                                      color:
                                                          Colors.blueGrey[500],
                                                    ),
                                                  ),
                                                ],
                                              ),
                                            ],
                                          ),
                                        );
                                      }).toList(),
                                    )
                                  : const Center(
                                      child: Padding(
                                        padding: EdgeInsets.all(16.0),
                                        child: Text(
                                          'Calendar view not implemented yet.',
                                        ),
                                      ),
                                    ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),

            if (_showCamera)
              Positioned.fill(
                child: Container(
                  color: Colors.black.withOpacity(0.5),
                  alignment: Alignment.center,
                  padding: const EdgeInsets.all(24.0),
                  child: Material(
                    color: Colors.transparent,
                    child: Container(
                      padding: const EdgeInsets.all(24.0),
                      width: double.infinity,
                      constraints: const BoxConstraints(maxWidth: 400),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(24.0),
                      ),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Text(
                            'Quick Selfie Check-in',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w600,
                              color: Color(0xFF1E293B),
                            ),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 16),
                          Container(
                            width: double.infinity,
                            height: 256,
                            decoration: BoxDecoration(
                              color: Colors.blueGrey[100],
                              borderRadius: BorderRadius.circular(12.0),
                            ),
                            child: Icon(
                              Icons.camera_alt,
                              size: 64,
                              color: Colors.blueGrey[400],
                            ),
                          ),
                          const SizedBox(height: 16),
                          Text(
                            'Optional: Take a selfie for verification',
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.blueGrey[500],
                            ),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 24),
                          Row(
                            children: [
                              Expanded(
                                child: OutlinedButton(
                                  onPressed: () {
                                    setState(() {
                                      _showCamera = false;
                                    });
                                  },
                                  style: OutlinedButton.styleFrom(
                                    padding: const EdgeInsets.symmetric(
                                      vertical: 16.0,
                                      horizontal: 16.0,
                                    ),
                                    side: BorderSide(
                                      color: Colors.blueGrey[200]!,
                                    ),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(16.0),
                                    ),
                                  ),
                                  child: Text(
                                    'Skip',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w500,
                                      color: Colors.blueGrey[600],
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: ElevatedButton(
                                  onPressed: _handleCameraCapture,
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.green[500],
                                    padding: const EdgeInsets.symmetric(
                                      vertical: 16.0,
                                      horizontal: 16.0,
                                    ),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(16.0),
                                    ),
                                    shadowColor: Colors.transparent,
                                  ),
                                  child: const Text(
                                    'Check In',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w500,
                                      color: Colors.white,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildNavItem(IconData icon, String label, bool isActive) {
    return Expanded(
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () {
            if (label == 'Attendance') {}
          },
          splashColor: Colors.blue[100],
          borderRadius: BorderRadius.circular(8),
          child: Padding(
            padding: const EdgeInsets.symmetric(
              vertical: 8.0,
              horizontal: 12.0,
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  icon,
                  size: 20,
                  color: isActive ? Colors.blue[600] : Colors.blueGrey[400],
                ),
                const SizedBox(height: 4),
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w500,
                    color: isActive ? Colors.blue[600] : Colors.blueGrey[500],
                  ),
                ),
                if (isActive)
                  Container(
                    width: 16,
                    height: 2,
                    margin: const EdgeInsets.only(top: 4),
                    decoration: BoxDecoration(
                      color: Colors.blue[600],
                      borderRadius: BorderRadius.circular(1),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

extension DateTimeExtension on DateTime {
  String toLocaleDateString(
    String locale, {
    String? weekday,
    String? month,
    String? day,
  }) {
    String dateStr = '';
    if (weekday == 'long') {
      dateStr += '${_getWeekday(this.weekday)}, ';
    }
    if (month == 'long') {
      dateStr += '${_getMonth(this.month)} ';
    } else if (month == 'short') {
      dateStr += '${_getMonth(this.month, short: true)} ';
    }
    if (day == 'numeric') {
      dateStr += this.day.toString();
    }
    return dateStr.trim();
  }

  String toLocaleTimeString(String locale, {String? hour, String? minute}) {
    String period = this.hour < 12 ? 'AM' : 'PM';
    int displayHour = this.hour % 12;
    if (displayHour == 0) displayHour = 12;

    String minuteStr = this.minute.toString().padLeft(2, '0');

    if (hour == '2-digit' && minute == '2-digit') {
      return '$displayHour:$minuteStr $period';
    }
    return '${this.hour.toString().padLeft(2, '0')}:${minuteStr}';
  }

  String _getWeekday(int day) {
    switch (day) {
      case 1:
        return 'Monday';
      case 2:
        return 'Tuesday';
      case 3:
        return 'Wednesday';
      case 4:
        return 'Thursday';
      case 5:
        return 'Friday';
      case 6:
        return 'Saturday';
      case 7:
        return 'Sunday';
      default:
        return '';
    }
  }

  String _getMonth(int month, {bool short = false}) {
    const List<String> longMonths = [
      '',
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const List<String> shortMonths = [
      '',
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return short ? shortMonths[month] : longMonths[month];
  }
}
