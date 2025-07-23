import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:mobile/models/payroll_model.dart';
import 'package:mobile/service/auth_service.dart';

class PayrollService {
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

  Future<Map<String, dynamic>> getPayrollsByEmployee(String employeeId) async {
    final url = Uri.parse('$_baseUrl/payroll/employee/$employeeId');
    final headers = await _getAuthHeaders();

    try {
      final response = await http.get(url, headers: headers);

      if (response.statusCode == 200) {
        final responseBody = json.decode(response.body);
        print(responseBody);
        List<Payroll> payrolls = (responseBody['payrolls'] as List)
            .map((json) => Payroll.fromJson(json))
            .toList();

        return {'success': true, 'payrolls': payrolls};
      } else if (response.statusCode == 404) {
        return {
          'success': true,
          'message': 'No payrolls found for this employee.',
          'payrolls': <Payroll>[],
        };
      } else {
        final errorBody = json.decode(response.body);
        String errorMessage =
            errorBody['message'] ?? 'Failed to fetch payrolls.';
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
