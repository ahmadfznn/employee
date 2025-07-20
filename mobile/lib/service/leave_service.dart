import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:mobile/service/auth_service.dart';
import 'package:mobile/models/leave_request_model.dart';

class LeaveService {
  final String _baseUrl = 'http://192.168.1.6:4000/api';
  final AuthService _authService = AuthService();

  Future<Map<String, String>> _getAuthHeaders() async {
    final token = await _authService.getToken();
    if (token == null) {
      throw Exception('Authentication token not found. Please log in.');
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    };
  }

  Future<Map<String, dynamic>> createLeaveRequest({
    required String employeeId,
    required String leaveType,
    required DateTime startDate,
    required DateTime endDate,
    required String reason,
  }) async {
    final url = Uri.parse('$_baseUrl/leave-requests');
    final headers = await _getAuthHeaders();

    try {
      final response = await http.post(
        url,
        headers: headers,
        body: json.encode({
          'employee_id': employeeId,
          'leave_type': leaveType,
          'start_date': startDate.toIso8601String(),
          'end_date': endDate.toIso8601String(),
          'reason': reason,
        }),
      );

      if (response.statusCode == 201) {
        final responseBody = json.decode(response.body);
        return {
          'success': true,
          'message': responseBody['message'],
          'leaveRequest': LeaveRequest.fromJson(responseBody['leaveRequest']),
        };
      } else {
        final errorBody = json.decode(response.body);
        print(errorBody['message']);
        String errorMessage =
            errorBody['message'] ?? 'Failed to submit leave request.';
        return {'success': false, 'message': errorMessage};
      }
    } catch (e) {
      return {
        'success': false,
        'message':
            'Network error: $e. Make sure your server is running and accessible.',
      };
    }
  }

  Future<Map<String, dynamic>> getLeaveRequestsByEmployee(
    int employeeId,
  ) async {
    final url = Uri.parse('$_baseUrl/employees/$employeeId/leave-requests');
    final headers = await _getAuthHeaders();

    try {
      final response = await http.get(url, headers: headers);

      if (response.statusCode == 200) {
        final responseBody = json.decode(response.body);
        List<LeaveRequest> leaveRequests =
            (responseBody['leaveRequests'] as List)
                .map((json) => LeaveRequest.fromJson(json))
                .toList();

        return {'success': true, 'leaveRequests': leaveRequests};
      } else if (response.statusCode == 404) {
        return {
          'success': true,
          'message': 'No leave requests found for this employee.',
          'leaveRequests': <LeaveRequest>[],
        };
      } else {
        final errorBody = json.decode(response.body);
        String errorMessage =
            errorBody['message'] ?? 'Failed to fetch leave requests.';
        return {'success': false, 'message': errorMessage};
      }
    } catch (e) {
      return {
        'success': false,
        'message':
            'Network error: $e. Make sure your server is running and accessible.',
      };
    }
  }
}
