import 'package:flutter/material.dart';
import 'dart:async'; // For Timer

import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class Attendance extends StatefulWidget {
  const Attendance({super.key});

  @override
  State<Attendance> createState() => _Attendance();
}

class _Attendance extends State<Attendance> {
  DateTime _currentTime = DateTime.now();
  bool _isCheckedIn = true;
  bool _showCamera = false;
  // DateTime _selectedDate = DateTime.now(); // Not directly used in the current UI logic for calendar
  String _viewMode = 'timeline'; // 'timeline' or 'calendar'

  late Timer _timer;

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      setState(() {
        _currentTime = DateTime.now();
      });
    });
  }

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  void _handleCheckInOut() {
    if (!_isCheckedIn) {
      setState(() {
        _showCamera = true;
      });
    } else {
      setState(() {
        _isCheckedIn = false;
      });
    }
  }

  void _handleCameraCapture() {
    setState(() {
      _isCheckedIn = true;
      _showCamera = false;
    });
  }

  // Mock attendance data
  final List<Map<String, String>> _attendanceData = [
    {
      'date': '2024-07-19',
      'status': 'present',
      'checkIn': '9:15 AM',
      'checkOut': '6:20 PM',
      'hours': '8h 45m',
    },
    {
      'date': '2024-07-18',
      'status': 'present',
      'checkIn': '9:00 AM',
      'checkOut': '6:15 PM',
      'hours': '8h 45m',
    },
    {
      'date': '2024-07-17',
      'status': 'present',
      'checkIn': '9:30 AM',
      'checkOut': '6:30 PM',
      'hours': '8h 30m',
    },
    {
      'date': '2024-07-16',
      'status': 'sick',
      'checkIn': '-',
      'checkOut': '-',
      'hours': '0h',
    },
    {
      'date': '2024-07-15',
      'status': 'present',
      'checkIn': '8:45 AM',
      'checkOut': '6:00 PM',
      'hours': '8h 45m',
    },
    {
      'date': '2024-07-12',
      'status': 'leave',
      'checkIn': '-',
      'checkOut': '-',
      'hours': '0h',
    },
    {
      'date': '2024-07-11',
      'status': 'present',
      'checkIn': '9:10 AM',
      'checkOut': '6:25 PM',
      'hours': '8h 45m',
    },
  ];

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
      backgroundColor: Colors.transparent, // Handled by Container gradient
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Color(0xFFF8FAFC), // slate-50
              Color(0xFFEEF2FF), // blue-50
            ],
          ),
        ),
        child: Stack(
          children: [
            Column(
              children: [
                // Header
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 24.0,
                    vertical: 16.0,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.8),
                    border: Border(
                      bottom: BorderSide(color: Colors.blueGrey[50]!),
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.05),
                        blurRadius: 4,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: SafeArea(
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Attendance',
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF1E293B), // slate-800
                              ),
                            ),
                            Text(
                              _currentTime.toLocaleDateString(
                                'en-US',
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric',
                              ),
                              style: TextStyle(
                                fontSize: 13,
                                color: Colors.blueGrey[500], // slate-500
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text(
                              _currentTime.toLocaleTimeString(
                                'en-US',
                                hour: '2-digit',
                                minute: '2-digit',
                              ),
                              style: TextStyle(
                                fontSize: 24,
                                fontFamily: 'monospace',
                                fontWeight: FontWeight.bold,
                                color: Colors.blueGrey[700], // slate-700
                              ),
                            ),
                            Row(
                              children: [
                                Icon(
                                  Icons.location_on,
                                  size: 12,
                                  color: Colors.blueGrey[500],
                                ), // w-3 h-3
                                const SizedBox(width: 4),
                                Text(
                                  'Office Building A',
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: Colors.blueGrey[500],
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
                // Main Content
                Expanded(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 24.0,
                      vertical: 24.0,
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Check-in/Check-out Card
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
                                      Colors.green[500]!, // from-emerald-500
                                      Colors.teal[600]!, // to-teal-600
                                    ],
                                  )
                                : LinearGradient(
                                    begin: Alignment.centerLeft,
                                    end: Alignment.centerRight,
                                    colors: [
                                      Colors.blue[500]!, // from-blue-500
                                      Colors.indigo[600]!, // to-indigo-600
                                    ],
                                  ),
                          ),
                          child: Column(
                            children: [
                              Container(
                                width: 80,
                                height: 80,
                                margin: const EdgeInsets.only(bottom: 16.0),
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: Colors.white.withOpacity(0.2),
                                ),
                                child: const Icon(
                                  Icons.access_time,
                                  size: 40,
                                  color: Colors.white,
                                ), // w-10 h-10
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
                                    ? "Working for 3h 45m • Since 9:15 AM"
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
                                  onPressed: _handleCheckInOut,
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.white,
                                    padding: const EdgeInsets.symmetric(
                                      vertical: 16.0,
                                    ),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(16.0),
                                    ),
                                    shadowColor:
                                        Colors.transparent, // No extra shadow
                                    // React's transform hover:scale-105 is not directly mapped here but can be done with custom animations
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
                            ],
                          ),
                        ),
                        const SizedBox(height: 24),

                        // Weekly Stats
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
                              const Text(
                                'This Week',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w600,
                                  color: Color(0xFF1E293B), // slate-800
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
                                            color: Color(
                                              0xFF64748B,
                                            ), // slate-500
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
                                            color: Color(
                                              0xFF64748B,
                                            ), // slate-500
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 16),
                              // Progress Bar
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(
                                        'Weekly Attendance',
                                        style: TextStyle(
                                          fontSize: 14,
                                          color:
                                              Colors.blueGrey[600], // slate-600
                                        ),
                                      ),
                                      Text(
                                        '${_weeklyStats['percentage']}%',
                                        style: TextStyle(
                                          fontSize: 14,
                                          fontWeight: FontWeight.w600,
                                          color:
                                              Colors.blueGrey[700], // slate-700
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 8),
                                  ClipRRect(
                                    borderRadius: BorderRadius.circular(10.0),
                                    child: LinearProgressIndicator(
                                      value: _weeklyStats['percentage'] / 100,
                                      backgroundColor:
                                          Colors.blueGrey[200], // slate-200
                                      valueColor:
                                          const AlwaysStoppedAnimation<Color>(
                                            Color(
                                              0xFF10B981,
                                            ), // emerald-500, not a gradient directly here
                                          ),
                                      minHeight: 8,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 24),

                        // View Toggle
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
                                    padding: const EdgeInsets.symmetric(
                                      vertical: 10.0,
                                      horizontal: 16.0,
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

                        // Attendance History
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
                                      color: Color(0xFF1E293B), // slate-800
                                    ),
                                  ),
                                  Row(
                                    children: [
                                      IconButton(
                                        onPressed: () {
                                          // Handle previous month/week
                                        },
                                        icon: Icon(
                                          Icons.chevron_left,
                                          size: 24,
                                          color: Colors.blueGrey[400],
                                        ), // w-4 h-4
                                        splashRadius: 20,
                                      ),
                                      IconButton(
                                        onPressed: () {
                                          // Handle next month/week
                                        },
                                        icon: Icon(
                                          Icons.chevron_right,
                                          size: 24,
                                          color: Colors.blueGrey[400],
                                        ), // w-4 h-4
                                        splashRadius: 20,
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                              const SizedBox(height: 16),
                              _viewMode == 'timeline'
                                  ? Column(
                                      children: _attendanceData.map((record) {
                                        final colors = _getStatusColor(
                                          record['status']!,
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
                                                      record['status']!,
                                                    ),
                                                  ),
                                                  const SizedBox(width: 12),
                                                  Column(
                                                    crossAxisAlignment:
                                                        CrossAxisAlignment
                                                            .start,
                                                    children: [
                                                      Text(
                                                        DateTime.parse(
                                                          record['date']!,
                                                        ).toLocaleDateString(
                                                          'en-US',
                                                          month: 'short',
                                                          day: 'numeric',
                                                        ),
                                                        style: const TextStyle(
                                                          fontWeight:
                                                              FontWeight.w600,
                                                          color: Color(
                                                            0xFF1E293B,
                                                          ), // slate-800
                                                        ),
                                                      ),
                                                      Text(
                                                        record['status']!,
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
                                                    '${record['checkIn']} - ${record['checkOut']}',
                                                    style: TextStyle(
                                                      fontSize: 14,
                                                      fontFamily: 'monospace',
                                                      color: Colors
                                                          .blueGrey[600], // slate-600
                                                    ),
                                                  ),
                                                  Text(
                                                    record['hours']!,
                                                    style: TextStyle(
                                                      fontSize: 12,
                                                      color: Colors
                                                          .blueGrey[500], // slate-500
                                                    ),
                                                  ),
                                                ],
                                              ),
                                            ],
                                          ),
                                        );
                                      }).toList(),
                                    )
                                  : GridView.builder(
                                      shrinkWrap: true,
                                      physics:
                                          const NeverScrollableScrollPhysics(),
                                      gridDelegate:
                                          const SliverGridDelegateWithFixedCrossAxisCount(
                                            crossAxisCount: 7,
                                            crossAxisSpacing: 8,
                                            mainAxisSpacing: 8,
                                            childAspectRatio:
                                                1.0, // aspect-square
                                          ),
                                      itemCount:
                                          35, // Typically 5 rows of 7 days
                                      itemBuilder: (context, index) {
                                        final dayNumber =
                                            index - 5; // Offset for month start
                                        final isCurrentMonth =
                                            dayNumber > 0 && dayNumber <= 31;
                                        final hasAttendance =
                                            isCurrentMonth &&
                                            (DateTime.now().millisecond % 3) !=
                                                0; // Simplified random
                                        final status = hasAttendance
                                            ? [
                                                'present',
                                                'sick',
                                                'leave',
                                              ][dayNumber % 3]
                                            : null;
                                        final colors = status != null
                                            ? _getStatusColor(status)
                                            : {'bg': Colors.blueGrey[50]!};

                                        return Container(
                                          decoration: BoxDecoration(
                                            color: colors['bg'],
                                            borderRadius: BorderRadius.circular(
                                              8.0,
                                            ),
                                          ),
                                          alignment: Alignment.center,
                                          child: isCurrentMonth
                                              ? Text(
                                                  '$dayNumber',
                                                  style: TextStyle(
                                                    fontSize: 14,
                                                    fontWeight: FontWeight.w500,
                                                    color:
                                                        colors['text'] ??
                                                        Colors.blueGrey[700],
                                                  ),
                                                )
                                              : const SizedBox.shrink(),
                                        );
                                      },
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
            // Camera Modal (positioned above everything else)
            if (_showCamera)
              Positioned.fill(
                child: Container(
                  color: Colors.black.withOpacity(0.5),
                  alignment: Alignment.center,
                  padding: const EdgeInsets.all(24.0),
                  child: Material(
                    color: Colors
                        .transparent, // transparent to allow parent GestureDetector
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
                              color: Color(0xFF1E293B), // slate-800
                            ),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 16),
                          Container(
                            width: double.infinity,
                            height: 256, // h-64
                            decoration: BoxDecoration(
                              color: Colors.blueGrey[100], // slate-100
                              borderRadius: BorderRadius.circular(12.0),
                            ),
                            child: Icon(
                              Icons.camera_alt,
                              size: 64,
                              color: Colors.blueGrey[400],
                            ), // w-16 h-16
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
                                    ), // border-slate-200
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(16.0),
                                    ),
                                  ),
                                  child: Text(
                                    'Skip',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w500,
                                      color: Colors.blueGrey[600], // slate-600
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: ElevatedButton(
                                  onPressed: _handleCameraCapture,
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor:
                                        Colors.green[500], // bg-emerald-500
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
            // Handle navigation
            if (label == 'Attendance') {
              // It's already the active screen, maybe do nothing or refresh
            }
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

// Extension to provide toLocaleDateString and toLocaleTimeString for DateTime
extension DateTimeExtension on DateTime {
  String toLocaleDateString(
    String locale, {
    String? weekday,
    String? month,
    String? day,
  }) {
    // This is a simplified implementation. For full locale support, consider intl package.
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
    // This is a simplified implementation. For full locale support, consider intl package.
    String period = this.hour < 12 ? 'AM' : 'PM';
    int displayHour = this.hour % 12;
    if (displayHour == 0) displayHour = 12; // 12 AM/PM instead of 0 AM/PM

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
