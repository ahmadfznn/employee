// lib/services/auth_service.dart (atau di mana pun kamu mau)
import 'dart:convert'; // Untuk encode dan decode JSON
import 'package:http/http.dart' as http; // Alias 'http' untuk kemudahan

class AuthService {
  // Ganti dengan alamat IP server kamu jika kamu jalankan di device fisik
  // atau emulator lain. Untuk Android Emulator, '10.0.2.2' mengacu ke localhost host machine.
  // Untuk iOS Simulator, 'localhost' atau '127.0.0.1' biasanya works.
  final String _baseUrl = 'http://10.0.2.2:4000/api/auth';

  Future<Map<String, dynamic>> login(String email, String password) async {
    final url = Uri.parse('$_baseUrl/login');

    try {
      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json', // Penting untuk mengirim JSON
        },
        body: json.encode({'email': email, 'password': password}),
      );

      // Check the status code
      if (response.statusCode == 200) {
        // Login Sukses
        // Server kamu kirim { message: "Login successful" }
        return {
          'success': true,
          'message': json.decode(response.body)['message'],
        };
      } else if (response.statusCode == 400 || response.statusCode == 401) {
        // Bad Request (validasi error) atau Unauthorized (email/password salah)
        final errorBody = json.decode(response.body);
        String errorMessage = errorBody['message'] ?? 'Unknown error occurred';

        // Jika ada errors array (dari express-validator)
        if (errorBody['errors'] != null && errorBody['errors'] is List) {
          errorMessage = (errorBody['errors'] as List)
              .map((e) => e['msg'].toString())
              .join(', ');
        }

        return {'success': false, 'message': errorMessage};
      } else {
        // Status code lainnya (misal 500 Internal Server Error)
        return {
          'success': false,
          'message': 'Failed to login: Server error ${response.statusCode}',
        };
      }
    } catch (e) {
      // Error jaringan atau error lain sebelum respons diterima
      return {
        'success': false,
        'message':
            'Network error: $e. Make sure your server is running and accessible.',
      };
    }
  }
}
