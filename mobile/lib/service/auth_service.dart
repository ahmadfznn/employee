import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  final String _baseUrl = 'http://192.168.1.9:4000/api/auth';

  static const String _authTokenKey = 'authToken';
  static const String _userDataKey = 'userData';

  Future<void> _saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_authTokenKey, token);
  }

  Future<void> _saveUserData(Map<String, dynamic> userData) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_userDataKey, json.encode(userData));
  }

  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_authTokenKey);
  }

  Future<Map<String, dynamic>?> getUserData() async {
    final prefs = await SharedPreferences.getInstance();
    final userDataString = prefs.getString(_userDataKey);
    if (userDataString != null) {
      return json.decode(userDataString) as Map<String, dynamic>;
    }
    return null;
  }

  Future<void> deleteAuthData() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_authTokenKey);
    await prefs.remove(_userDataKey);
  }

  Future<Map<String, dynamic>> login(String email, String password) async {
    final url = Uri.parse('$_baseUrl/login');

    try {
      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          'x-client-type': 'mobile',
        },
        body: json.encode({'email': email, 'password': password}),
      );

      if (response.statusCode == 200) {
        final responseBody = json.decode(response.body);
        final token = responseBody['token'];
        final userData = responseBody['user'];

        if (token != null && userData != null) {
          await _saveToken(token);
          await _saveUserData(userData);

          return {
            'success': true,
            'message': responseBody['message'],
            'token': token,
            'user': userData,
          };
        } else {
          return {
            'success': false,
            'message': 'Login successful, but token or user data not received.',
          };
        }
      } else if (response.statusCode == 400 || response.statusCode == 401) {
        final errorBody = json.decode(response.body);
        String errorMessage = errorBody['message'] ?? 'Unknown error occurred';

        if (errorBody['errors'] != null && errorBody['errors'] is List) {
          errorMessage = (errorBody['errors'] as List)
              .map((e) => e['msg'].toString())
              .join(', ');
        }

        return {'success': false, 'message': errorMessage};
      } else {
        return {
          'success': false,
          'message': 'Failed to login: Server error ${response.statusCode}',
        };
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
