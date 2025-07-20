import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'dart:io';
import 'package:file_picker/file_picker.dart';
import 'package:mobile/service/auth_service.dart';
import 'package:mobile/service/leave_service.dart';
import 'package:path/path.dart' as p;

class Leave extends StatefulWidget {
  const Leave({super.key});

  @override
  State<Leave> createState() => _Leave();
}

class LeaveFormData {
  String? leaveType;
  DateTime? startDate;
  DateTime? endDate;
  String reason;
  File? attachment;

  LeaveFormData({
    this.leaveType,
    this.startDate,
    this.endDate,
    this.reason = '',
    this.attachment,
  });

  // Helper to reset the form
  void reset() {
    leaveType = null;
    startDate = null;
    endDate = null;
    reason = '';
    attachment = null;
  }
}

class LeaveRequest {
  final int id;
  final String type;
  final String icon;
  final String dates;
  final int days;
  final String status; // 'approved', 'pending', 'rejected'
  final String reason;
  final DateTime submittedDate;
  final String? approvedBy;
  final String? rejectedBy;
  final String? rejectionReason;

  LeaveRequest({
    required this.id,
    required this.type,
    required this.icon,
    required this.dates,
    required this.days,
    required this.status,
    required this.reason,
    required this.submittedDate,
    this.approvedBy,
    this.rejectedBy,
    this.rejectionReason,
  });
}

class _Leave extends State<Leave> {
  LeaveFormData formData = LeaveFormData();
  bool isSubmitting = false;
  bool showSuccess = false;

  final LeaveService _leaveService = LeaveService();
  final AuthService _authService = AuthService();

  List<LeaveRequest> _leaveRequests = [];
  bool _isLoadingHistory = true;

  final List<Map<String, String>> leaveTypes = const [
    {'value': 'annual', 'label': 'Annual Leave', 'icon': '🏖️'},
    {'value': 'sick', 'label': 'Sick Leave', 'icon': '🏥'},
    {'value': 'maternity', 'label': 'Maternity Leave', 'icon': '👶'},
    {'value': 'emergency', 'label': 'Emergency Leave', 'icon': '🚨'},
    {'value': 'personal', 'label': 'Personal Leave', 'icon': '👤'},
  ];

  final List<LeaveRequest> leaveRequests = [
    LeaveRequest(
      id: 1,
      type: 'Annual Leave',
      icon: '🏖️',
      dates: 'Aug 15-19, 2024',
      days: 5,
      status: 'approved',
      reason: 'Family vacation to Bali',
      submittedDate: DateTime(2024, 7, 10),
      approvedBy: 'Sarah Johnson',
    ),
    LeaveRequest(
      id: 2,
      type: 'Sick Leave',
      icon: '🏥',
      dates: 'Jul 8, 2024',
      days: 1,
      status: 'approved',
      reason: 'Medical appointment',
      submittedDate: DateTime(2024, 7, 7),
      approvedBy: 'Sarah Johnson',
    ),
    LeaveRequest(
      id: 3,
      type: 'Personal Leave',
      icon: '👤',
      dates: 'Aug 22, 2024',
      days: 1,
      status: 'pending',
      reason: 'Moving to new apartment',
      submittedDate: DateTime(2024, 7, 18),
    ),
    LeaveRequest(
      id: 4,
      type: 'Annual Leave',
      icon: '🏖️',
      dates: 'Jun 20-22, 2024',
      days: 3,
      status: 'rejected',
      reason: 'Weekend getaway',
      submittedDate: DateTime(2024, 6, 15),
      rejectedBy: 'Sarah Johnson',
      rejectionReason: 'Insufficient annual leave balance',
    ),
  ];

  Map<String, Color> getStatusColor(String status) {
    switch (status) {
      case 'approved':
        return {
          'bg': const Color(0xFFD1FAE5),
          'text': const Color(0xFF065F46),
          'border': const Color(0xFF6EE7B7),
        }; // emerald-100, emerald-700, emerald-200
      case 'pending':
        return {
          'bg': const Color(0xFFFFFBEB),
          'text': const Color(0xFFB45309),
          'border': const Color(0xFFFDE68A),
        }; // amber-100, amber-700, amber-200
      case 'rejected':
        return {
          'bg': const Color(0xFFFFEEEE),
          'text': const Color(0xFF991B1B),
          'border': const Color(0xFFFECACA),
        }; // red-100, red-700, red-200
      default:
        return {
          'bg': const Color(0xFFF3F4F6),
          'text': const Color(0xFF4B5563),
          'border': const Color(0xFFE5E7EB),
        }; // gray-100, gray-700, gray-200
    }
  }

  IconData getStatusIcon(String status) {
    switch (status) {
      case 'approved':
        return Icons.check;
      case 'pending':
        return Icons.error_outline; // Changed from AlertCircle
      case 'rejected':
        return Icons.close;
      default:
        return Icons.error_outline;
    }
  }

  Future<void> _selectDate(BuildContext context, bool isStartDate) async {
    DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime.now().subtract(const Duration(days: 365)),
      lastDate: DateTime.now().add(const Duration(days: 365 * 2)),
    );
    if (picked != null) {
      setState(() {
        if (isStartDate) {
          formData.startDate = picked;
          // Ensure end date is not before start date
          if (formData.endDate != null && formData.endDate!.isBefore(picked)) {
            formData.endDate = picked;
          }
        } else {
          formData.endDate = picked;
          // Ensure start date is not after end date
          if (formData.startDate != null &&
              formData.startDate!.isAfter(picked)) {
            formData.startDate = picked;
          }
        }
      });
    }
  }

  Future<void> handleFileUpload() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
    );

    if (result != null) {
      setState(() {
        formData.attachment = File(result.files.single.path!);
      });
    } else {
      // User canceled the picker
    }
  }

  int calculateDays() {
    if (formData.startDate != null && formData.endDate != null) {
      final start = formData.startDate!;
      final end = formData.endDate!;
      final diff = end.difference(start).inDays;
      return diff >= 0 ? diff + 1 : 0; // +1 to include start day
    }
    return 0;
  }

  Future<void> _fetchLeaveHistory() async {
    setState(() {
      _isLoadingHistory = true;
    });

    try {
      final userData = await _authService.getUserData();
      if (userData == null || userData['id'] == null) {
        throw Exception('User data not found. Please log in again.');
      }
      final employeeId =
          userData['id'] as int; // Ambil employee ID dari data user

      final result = await _leaveService.getLeaveRequestsByEmployee(employeeId);

      if (mounted) {
        if (result['success']) {
          setState(() {
            _leaveRequests = result['leaveRequests'];
          });
        } else {
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text(result['message'])));
          _leaveRequests = []; // Kosongkan jika gagal
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error fetching leave history: $e')),
        );
        _leaveRequests = []; // Kosongkan jika error
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoadingHistory = false;
        });
      }
    }
  }

  Future<void> handleSubmit() async {
    if (formData.leaveType == null ||
        formData.startDate == null ||
        formData.endDate == null ||
        formData.reason.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please fill all required fields.'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    setState(() {
      isSubmitting = true;
    });

    try {
      final userData = await _authService.getUserData();
      if (userData == null || userData['id'] == null) {
        throw Exception('User data not found. Please log in again.');
      }
      final employeeId = userData['id'];

      final result = await _leaveService.createLeaveRequest(
        employeeId: employeeId,
        leaveType: formData.leaveType!,
        startDate: formData.startDate!,
        endDate: formData.endDate!,
        reason: formData.reason,
      );

      if (mounted) {
        if (result['success']) {
          setState(() {
            showSuccess = true;
            formData.reset();
          });
          _fetchLeaveHistory();

          Future.delayed(const Duration(seconds: 3), () {
            if (mounted) {
              setState(() {
                showSuccess = false;
              });
            }
          });
        } else {
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text(result['message'])));
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error submitting leave request: $e')),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          isSubmitting = false;
        });
      }
    }

    setState(() {
      isSubmitting = false;
      showSuccess = true;
      // formData.reset();
    });

    Future.delayed(const Duration(seconds: 3), () {
      if (mounted) {
        setState(() {
          showSuccess = false;
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Color(0xFFF8FAFC),
              Color(0xFFEEF2FF),
            ], // Equivalent to slate-50 to blue-50 in React code
          ),
        ),
        child: Column(
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
                  bottom: BorderSide(
                    color: Colors.blueGrey[200]!.withOpacity(0.5),
                  ),
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
                bottom: false, // Don't absorb bottom safe area
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text(
                          'Leave Request',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF1E293B), // slate-800
                          ),
                        ),
                        Text(
                          'Submit and manage your leave applications',
                          style: TextStyle(
                            fontSize: 13,
                            color: Color(0xFF64748B), // slate-500
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        const Text(
                          '18 days',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF059669), // emerald-600
                          ),
                        ),
                        Text(
                          'Available',
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.blueGrey[500],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.only(
                  left: 24.0,
                  right: 24.0,
                  top: 24.0,
                  bottom: 96.0,
                ), // Added bottom padding for space above bottom nav
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Success Message
                    if (showSuccess)
                      Container(
                        margin: const EdgeInsets.only(bottom: 24.0),
                        padding: const EdgeInsets.all(16.0),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF0FDF4), // emerald-50
                          border: Border.all(
                            color: const Color(0xFFD1FAE5),
                          ), // emerald-200
                          borderRadius: BorderRadius.circular(16.0),
                        ),
                        child: Row(
                          children: [
                            Container(
                              width: 32,
                              height: 32,
                              decoration: BoxDecoration(
                                color: const Color(0xFF10B981), // emerald-500
                                borderRadius: BorderRadius.circular(
                                  999,
                                ), // rounded-full
                              ),
                              child: const Icon(
                                Icons.check,
                                color: Colors.white,
                                size: 20,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: const [
                                  Text(
                                    'Request Submitted!',
                                    style: TextStyle(
                                      fontWeight: FontWeight.w600,
                                      color: Color(0xFF065F46), // emerald-700
                                    ),
                                  ),
                                  Text(
                                    'Your leave request has been sent for approval.',
                                    style: TextStyle(
                                      fontSize: 13,
                                      color: Color(0xFF047857), // emerald-600
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),

                    // New Request Form
                    Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(24.0),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.05),
                            blurRadius: 4,
                            offset: const Offset(0, 2),
                          ),
                        ],
                        border: Border.all(
                          color: const Color(0xFFF1F5F9),
                        ), // slate-100
                      ),
                      padding: const EdgeInsets.all(24.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Container(
                                width: 48,
                                height: 48,
                                decoration: BoxDecoration(
                                  gradient: const LinearGradient(
                                    colors: [
                                      Color(0xFF3B82F6),
                                      Color(0xFF4F46E5),
                                    ], // blue-500 to indigo-600
                                    begin: Alignment.topLeft,
                                    end: Alignment.bottomRight,
                                  ),
                                  borderRadius: BorderRadius.circular(12.0),
                                ),
                                child: const Icon(
                                  Icons.add,
                                  color: Colors.white,
                                  size: 28,
                                ),
                              ),
                              const SizedBox(width: 12),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: const [
                                  Text(
                                    'New Leave Request',
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.w600,
                                      color: Color(0xFF1E293B), // slate-800
                                    ),
                                  ),
                                  Text(
                                    'Fill out the details below',
                                    style: TextStyle(
                                      fontSize: 13,
                                      color: Color(0xFF64748B), // slate-500
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          const SizedBox(height: 24),

                          // Leave Type Dropdown
                          Text(
                            'Leave Type',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                              color: Colors.blueGrey[700],
                            ),
                          ),
                          const SizedBox(height: 8),
                          DropdownButtonFormField<String>(
                            value: formData.leaveType,
                            decoration: InputDecoration(
                              filled: true,
                              fillColor: Colors.white,
                              contentPadding: const EdgeInsets.symmetric(
                                horizontal: 16.0,
                                vertical: 12.0,
                              ),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12.0),
                                borderSide: const BorderSide(
                                  color: Color(0xFFE2E8F0),
                                ), // slate-200
                              ),
                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12.0),
                                borderSide: const BorderSide(
                                  color: Color(0xFFE2E8F0),
                                ), // slate-200
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12.0),
                                borderSide: const BorderSide(
                                  color: Color(0xFF3B82F6),
                                  width: 2.0,
                                ), // blue-500 with ring effect
                              ),
                              suffixIcon: const Icon(
                                Icons.keyboard_arrow_down,
                                color: Color(0xFF94A3B8),
                              ), // slate-400
                            ),
                            hint: const Text('Select leave type'),
                            items: leaveTypes.map((type) {
                              return DropdownMenuItem(
                                value: type['value'],
                                child: Text('${type['icon']} ${type['label']}'),
                              );
                            }).toList(),
                            onChanged: (newValue) {
                              setState(() {
                                formData.leaveType = newValue;
                              });
                            },
                          ),
                          const SizedBox(height: 20),

                          // Date Range
                          Row(
                            children: [
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'Start Date',
                                      style: TextStyle(
                                        fontSize: 14,
                                        fontWeight: FontWeight.w500,
                                        color: Colors.blueGrey[700],
                                      ),
                                    ),
                                    const SizedBox(height: 8),
                                    GestureDetector(
                                      onTap: () => _selectDate(context, true),
                                      child: AbsorbPointer(
                                        child: TextField(
                                          controller: TextEditingController(
                                            text: formData.startDate == null
                                                ? ''
                                                : DateFormat(
                                                    'yyyy-MM-dd',
                                                  ).format(formData.startDate!),
                                          ),
                                          decoration: InputDecoration(
                                            contentPadding:
                                                const EdgeInsets.symmetric(
                                                  horizontal: 16.0,
                                                  vertical: 12.0,
                                                ),
                                            border: OutlineInputBorder(
                                              borderRadius:
                                                  BorderRadius.circular(12.0),
                                              borderSide: const BorderSide(
                                                color: Color(0xFFE2E8F0),
                                              ),
                                            ),
                                            enabledBorder: OutlineInputBorder(
                                              borderRadius:
                                                  BorderRadius.circular(12.0),
                                              borderSide: const BorderSide(
                                                color: Color(0xFFE2E8F0),
                                              ),
                                            ),
                                            focusedBorder: OutlineInputBorder(
                                              borderRadius:
                                                  BorderRadius.circular(12.0),
                                              borderSide: const BorderSide(
                                                color: Color(0xFF3B82F6),
                                                width: 2.0,
                                              ),
                                            ),
                                            suffixIcon: const Icon(
                                              Icons.calendar_today,
                                              color: Color(0xFF94A3B8),
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'End Date',
                                      style: TextStyle(
                                        fontSize: 14,
                                        fontWeight: FontWeight.w500,
                                        color: Colors.blueGrey[700],
                                      ),
                                    ),
                                    const SizedBox(height: 8),
                                    GestureDetector(
                                      onTap: () => _selectDate(context, false),
                                      child: AbsorbPointer(
                                        child: TextField(
                                          controller: TextEditingController(
                                            text: formData.endDate == null
                                                ? ''
                                                : DateFormat(
                                                    'yyyy-MM-dd',
                                                  ).format(formData.endDate!),
                                          ),
                                          decoration: InputDecoration(
                                            contentPadding:
                                                const EdgeInsets.symmetric(
                                                  horizontal: 16.0,
                                                  vertical: 12.0,
                                                ),
                                            border: OutlineInputBorder(
                                              borderRadius:
                                                  BorderRadius.circular(12.0),
                                              borderSide: const BorderSide(
                                                color: Color(0xFFE2E8F0),
                                              ),
                                            ),
                                            enabledBorder: OutlineInputBorder(
                                              borderRadius:
                                                  BorderRadius.circular(12.0),
                                              borderSide: const BorderSide(
                                                color: Color(0xFFE2E8F0),
                                              ),
                                            ),
                                            focusedBorder: OutlineInputBorder(
                                              borderRadius:
                                                  BorderRadius.circular(12.0),
                                              borderSide: const BorderSide(
                                                color: Color(0xFF3B82F6),
                                                width: 2.0,
                                              ),
                                            ),
                                            suffixIcon: const Icon(
                                              Icons.calendar_today,
                                              color: Color(0xFF94A3B8),
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 20),

                          // Duration Display
                          if (calculateDays() > 0)
                            Container(
                              padding: const EdgeInsets.all(16.0),
                              decoration: BoxDecoration(
                                color: const Color(0xFFEFF6FF), // blue-50
                                border: Border.all(
                                  color: const Color(0xFFBFDBFE),
                                ), // blue-200
                                borderRadius: BorderRadius.circular(12.0),
                              ),
                              child: Text.rich(
                                TextSpan(
                                  children: [
                                    TextSpan(
                                      text:
                                          '${calculateDays()} day${calculateDays() > 1 ? 's' : ''}',
                                      style: const TextStyle(
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                    const TextSpan(text: ' selected '),
                                    TextSpan(
                                      text: calculateDays() <= 18
                                          ? '✓ Available'
                                          : '⚠ Exceeds balance',
                                      style: TextStyle(
                                        color: calculateDays() <= 18
                                            ? const Color(0xFF047857)
                                            : const Color(
                                                0xFFDC2626,
                                              ), // emerald-600 vs red-600
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                  ],
                                ),
                                style: const TextStyle(
                                  fontSize: 14,
                                  color: Color(0xFF1D4ED8),
                                ), // blue-700
                              ),
                            ),
                          const SizedBox(height: 20),

                          // Reason Text Area
                          Text(
                            'Reason',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                              color: Colors.blueGrey[700],
                            ),
                          ),
                          const SizedBox(height: 8),
                          TextField(
                            maxLines: 4,
                            onChanged: (value) {
                              setState(() {
                                formData.reason = value;
                              });
                            },
                            controller: TextEditingController(
                              text: formData.reason,
                            ),
                            decoration: InputDecoration(
                              hintText:
                                  'Please provide a brief reason for your leave request...',
                              contentPadding: const EdgeInsets.all(16.0),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12.0),
                                borderSide: const BorderSide(
                                  color: Color(0xFFE2E8F0),
                                ),
                              ),
                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12.0),
                                borderSide: const BorderSide(
                                  color: Color(0xFFE2E8F0),
                                ),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12.0),
                                borderSide: const BorderSide(
                                  color: Color(0xFF3B82F6),
                                  width: 2.0,
                                ),
                              ),
                              suffixIcon: const Padding(
                                padding: EdgeInsets.all(12.0),
                                child: Icon(
                                  Icons.description_outlined,
                                  color: Color(0xFF94A3B8),
                                  size: 20,
                                ),
                              ), // file-text equivalent
                            ),
                          ),
                          const SizedBox(height: 20),

                          // File Attachment
                          Text(
                            'Supporting Document (Optional)',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                              color: Colors.blueGrey[700],
                            ),
                          ),
                          const SizedBox(height: 8),
                          GestureDetector(
                            onTap: handleFileUpload,
                            child: Container(
                              width: double.infinity,
                              padding: const EdgeInsets.all(16.0),
                              decoration: BoxDecoration(
                                border: Border.all(
                                  color: const Color(0xFFCBD5E1),
                                  width: 2.0,
                                  style: BorderStyle.solid,
                                ), // slate-300
                                borderRadius: BorderRadius.circular(12.0),
                                color: Colors.white,
                              ),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  const Icon(
                                    Icons.upload_file,
                                    color: Color(0xFF94A3B8),
                                    size: 20,
                                  ), // upload icon
                                  const SizedBox(width: 12),
                                  Flexible(
                                    child: Text(
                                      formData.attachment != null
                                          ? p.basename(
                                              formData.attachment!.path,
                                            )
                                          : 'Upload file (PDF, DOC, Image)',
                                      style: const TextStyle(
                                        color: Color(0xFF475569),
                                      ), // slate-600
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(height: 20),

                          // Submit Button
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton(
                              onPressed: (isSubmitting || calculateDays() > 18)
                                  ? null
                                  : handleSubmit,
                              style:
                                  ElevatedButton.styleFrom(
                                    foregroundColor: Colors.white,
                                    backgroundColor: const Color(
                                      0xFF3B82F6,
                                    ), // blue-500
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(12.0),
                                    ),
                                    padding: const EdgeInsets.symmetric(
                                      vertical: 16.0,
                                    ),
                                    elevation: 0,
                                    disabledBackgroundColor: const Color(
                                      0xFF3B82F6,
                                    ).withOpacity(0.5),
                                    disabledForegroundColor: Colors.white
                                        .withOpacity(0.7),
                                  ).copyWith(
                                    // Gradient hover effect needs to be manually managed or using a custom button.
                                    // For simplicity, sticking to solid color for now.
                                    overlayColor:
                                        MaterialStateProperty.resolveWith<
                                          Color?
                                        >((Set<MaterialState> states) {
                                          if (states.contains(
                                            MaterialState.pressed,
                                          )) {
                                            return const Color(
                                              0xFF4F46E5,
                                            ).withOpacity(0.2); // indigo-600
                                          }
                                          return null; // Defer to the widget's default.
                                        }),
                                  ),
                              child: isSubmitting
                                  ? Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: const [
                                        SizedBox(
                                          width: 20,
                                          height: 20,
                                          child: CircularProgressIndicator(
                                            strokeWidth: 2,
                                            valueColor:
                                                AlwaysStoppedAnimation<Color>(
                                                  Colors.white,
                                                ),
                                          ),
                                        ),
                                        SizedBox(width: 8),
                                        Text('Submitting...'),
                                      ],
                                    )
                                  : Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: const [
                                        Icon(
                                          Icons.send_outlined,
                                          size: 20,
                                        ), // send icon
                                        SizedBox(width: 8),
                                        Text('Submit Request'),
                                      ],
                                    ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Request History
                    Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(24.0),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.05),
                            blurRadius: 4,
                            offset: const Offset(0, 2),
                          ),
                        ],
                        border: Border.all(
                          color: const Color(0xFFF1F5F9),
                        ), // slate-100
                      ),
                      padding: const EdgeInsets.all(24.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Request History',
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.w600,
                                      color: Colors.blueGrey[800],
                                    ),
                                  ),
                                  Text(
                                    'Track your previous submissions',
                                    style: TextStyle(
                                      fontSize: 13,
                                      color: Colors.blueGrey[500],
                                    ),
                                  ),
                                ],
                              ),
                              Text(
                                '${leaveRequests.length} requests',
                                style: TextStyle(
                                  fontSize: 13,
                                  color: Colors.blueGrey[500],
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 24),
                          ListView.separated(
                            shrinkWrap:
                                true, // Important to allow ListView inside SingleChildScrollView
                            physics:
                                const NeverScrollableScrollPhysics(), // Disable ListView's own scrolling
                            itemCount: leaveRequests.length,
                            separatorBuilder: (context, index) =>
                                const SizedBox(height: 16),
                            itemBuilder: (context, index) {
                              final request = leaveRequests[index];
                              final colors = getStatusColor(request.status);
                              return Container(
                                decoration: BoxDecoration(
                                  border: Border.all(
                                    color: const Color(0xFFE2E8F0),
                                  ), // slate-200
                                  borderRadius: BorderRadius.circular(12.0),
                                  color: Colors.white,
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.black.withOpacity(0.03),
                                      blurRadius: 2,
                                      offset: const Offset(0, 1),
                                    ),
                                  ],
                                ),
                                padding: const EdgeInsets.all(16.0),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Row(
                                          children: [
                                            Text(
                                              request.icon,
                                              style: const TextStyle(
                                                fontSize: 24,
                                              ),
                                            ),
                                            const SizedBox(width: 12),
                                            Column(
                                              crossAxisAlignment:
                                                  CrossAxisAlignment.start,
                                              children: [
                                                Text(
                                                  request.type,
                                                  style: TextStyle(
                                                    fontWeight: FontWeight.w600,
                                                    color: Colors.blueGrey[800],
                                                  ),
                                                ),
                                                Text(
                                                  request.dates,
                                                  style: TextStyle(
                                                    fontSize: 13,
                                                    color: Colors.blueGrey[600],
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ],
                                        ),
                                        Container(
                                          padding: const EdgeInsets.symmetric(
                                            horizontal: 12,
                                            vertical: 4,
                                          ),
                                          decoration: BoxDecoration(
                                            color: colors['bg'],
                                            border: Border.all(
                                              color: colors['border']!,
                                            ),
                                            borderRadius: BorderRadius.circular(
                                              999,
                                            ), // rounded-full
                                          ),
                                          child: Row(
                                            mainAxisSize: MainAxisSize.min,
                                            children: [
                                              Icon(
                                                getStatusIcon(request.status),
                                                size: 16,
                                                color: colors['text'],
                                              ),
                                              const SizedBox(width: 8),
                                              Text(
                                                request.status
                                                    .capitalize(), // Using the extension
                                                style: TextStyle(
                                                  fontSize: 12,
                                                  fontWeight: FontWeight.w500,
                                                  color: colors['text'],
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 12),
                                    Padding(
                                      padding: const EdgeInsets.only(
                                        left: 44.0,
                                      ), // Align with text above
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            request.reason,
                                            style: TextStyle(
                                              fontSize: 14,
                                              color: Colors.blueGrey[600],
                                            ),
                                          ),
                                          const SizedBox(height: 8),
                                          Row(
                                            mainAxisAlignment:
                                                MainAxisAlignment.spaceBetween,
                                            children: [
                                              Text(
                                                '${request.days} day${request.days > 1 ? 's' : ''}',
                                                style: TextStyle(
                                                  fontSize: 12,
                                                  color: Colors.blueGrey[500],
                                                ),
                                              ),
                                              Text(
                                                'Submitted ${DateFormat('MMM d, yyyy').format(request.submittedDate)}',
                                                style: TextStyle(
                                                  fontSize: 12,
                                                  color: Colors.blueGrey[500],
                                                ),
                                              ),
                                            ],
                                          ),
                                          if (request.status == 'approved' &&
                                              request.approvedBy != null)
                                            Padding(
                                              padding: const EdgeInsets.only(
                                                top: 8.0,
                                              ),
                                              child: Text(
                                                '✓ Approved by ${request.approvedBy}',
                                                style: const TextStyle(
                                                  fontSize: 12,
                                                  color: Color(
                                                    0xFF047857,
                                                  ), // emerald-600
                                                ),
                                              ),
                                            ),
                                          if (request.status == 'rejected' &&
                                              request.rejectionReason != null)
                                            Container(
                                              margin: const EdgeInsets.only(
                                                top: 8.0,
                                              ),
                                              padding: const EdgeInsets.all(
                                                8.0,
                                              ),
                                              decoration: BoxDecoration(
                                                color: const Color(
                                                  0xFFFEF2F2,
                                                ), // red-50
                                                borderRadius:
                                                    BorderRadius.circular(8.0),
                                              ),
                                              child: Text.rich(
                                                TextSpan(
                                                  children: [
                                                    const TextSpan(
                                                      text: 'Rejected: ',
                                                      style: TextStyle(
                                                        fontWeight:
                                                            FontWeight.w500,
                                                      ),
                                                    ),
                                                    TextSpan(
                                                      text: request
                                                          .rejectionReason,
                                                    ),
                                                  ],
                                                ),
                                                style: const TextStyle(
                                                  fontSize: 12,
                                                  color: Color(
                                                    0xFF991B1B,
                                                  ), // red-700
                                                ),
                                              ),
                                            ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
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
      ),
    );
  }
}

// Extension to capitalize the first letter of a string
extension StringExtension on String {
  String capitalize() {
    if (isEmpty) {
      return this;
    }
    return '${this[0].toUpperCase()}${substring(1).toLowerCase()}';
  }
}
