import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:mobile/service/auth_service.dart';
import 'package:mobile/models/attendance_model.dart';
import 'package:geolocator/geolocator.dart';

class AttendanceService {
  final String _baseUrl = 'http://192.168.1.9:4000/api';
  final AuthService _authService = AuthService();
  static const double _officeLatitude = -7.24574;
  static const double _officeLongitude = 108.170245;
  static const double _maxDistanceMeters = 50.0;

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

  Future<Position> _getCurrentLocation() async {
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      return Future.error('Location services are disabled.');
    }

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        return Future.error('Location permissions are denied');
      }
    }

    if (permission == LocationPermission.deniedForever) {
      return Future.error(
        'Location permissions are permanently denied, we cannot request permissions.',
      );
    }

    return await Geolocator.getCurrentPosition(
      desiredAccuracy: LocationAccuracy.high,
    );
  }

  double _calculateDistance(
    double lat1,
    double lon1,
    double lat2,
    double lon2,
  ) {
    return Geolocator.distanceBetween(lat1, lon1, lat2, lon2);
  }

  Future<Map<String, dynamic>> createAttendance({
    required String employeeId,
    required String status,
    required DateTime date,
    required DateTime checkInTime,
    String? reason,
  }) async {
    final url = Uri.parse('$_baseUrl/attendance');
    final headers = await _getAuthHeaders();

    LocationData? currentLocationData;

    if (status != 'absent' && status != 'leave') {
      try {
        final position = await _getCurrentLocation();
        currentLocationData = LocationData(
          latitude: position.latitude,
          longitude: position.longitude,
        );

        final distance = _calculateDistance(
          _officeLatitude,
          _officeLongitude,
          currentLocationData.latitude,
          currentLocationData.longitude,
        );

        if (distance > _maxDistanceMeters) {
          return {
            'success': false,
            'message':
                'You must be within 50 meters of the office to check-in.',
          };
        }
      } catch (e) {
        return {'success': false, 'message': 'Failed to get location: $e'};
      }
    }

    try {
      final response = await http.post(
        url,
        headers: headers,
        body: json.encode({
          'employee_id': employeeId,
          'date': date.toIso8601String().split('T')[0],
          'check_in': checkInTime.toIso8601String(),
          'check_out': null,
          'location_check_in': currentLocationData?.toJson(),
          'location_check_out': null,
          'status': status,
          'reason': reason,
        }),
      );

      if (response.statusCode == 201) {
        final responseBody = json.decode(response.body);
        return {
          'success': true,
          'message': responseBody['message'],
          'attendance': Attendance.fromJson(responseBody['attendance']),
        };
      } else {
        final errorBody = json.decode(response.body);
        String errorMessage =
            errorBody['message'] ?? 'Failed to submit attendance.';
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

  Future<Map<String, dynamic>> updateAttendance({
    required String attendanceId,
    required DateTime checkOutTime,
    required String status,
  }) async {
    final url = Uri.parse('$_baseUrl/attendance/$attendanceId');
    final headers = await _getAuthHeaders();

    LocationData? currentLocationData;
    try {
      final position = await _getCurrentLocation();
      currentLocationData = LocationData(
        latitude: position.latitude,
        longitude: position.longitude,
      );

      final distance = _calculateDistance(
        _officeLatitude,
        _officeLongitude,
        currentLocationData.latitude,
        currentLocationData.longitude,
      );

      if (distance > _maxDistanceMeters) {
        return {
          'success': false,
          'message': 'You must be within 50 meters of the office to check-out.',
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Failed to get location: $e'};
    }

    try {
      final response = await http.put(
        url,
        headers: headers,
        body: json.encode({
          'check_out': checkOutTime.toIso8601String(),
          'location_check_out': currentLocationData?.toJson(),
          'status': status,
        }),
      );

      if (response.statusCode == 200) {
        final responseBody = json.decode(response.body);
        return {
          'success': true,
          'message': responseBody['message'],
          'attendance': Attendance.fromJson(responseBody['attendance']),
        };
      } else {
        final errorBody = json.decode(response.body);
        String errorMessage =
            errorBody['message'] ?? 'Failed to update attendance.';
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

  Future<Map<String, dynamic>> getAttendanceByEmployee(
    String employeeId,
  ) async {
    final url = Uri.parse('$_baseUrl/attendance/employee/$employeeId');
    final headers = await _getAuthHeaders();

    try {
      final response = await http.get(url, headers: headers);

      if (response.statusCode == 200) {
        final responseBody = json.decode(response.body);

        List<Attendance> attendances = (responseBody['attendances'] as List)
            .map((json) => Attendance.fromJson(json))
            .toList();

        return {'success': true, 'attendances': attendances};
      } else if (response.statusCode == 404) {
        return {
          'success': true,
          'message': 'No attendance records found for this employee.',
          'attendances': <Attendance>[],
        };
      } else {
        final errorBody = json.decode(response.body);
        String errorMessage =
            errorBody['message'] ?? 'Failed to fetch attendance records.';
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

  Future<Map<String, dynamic>> getAttendanceByDate(DateTime date) async {
    final formattedDate = date.toIso8601String().split('T')[0];
    final url = Uri.parse('$_baseUrl/attendance/date/$formattedDate');
    final headers = await _getAuthHeaders();
    try {
      final response = await http.get(url, headers: headers);

      if (response.statusCode == 200) {
        final responseBody = json.decode(response.body);
        List<Attendance> attendances = (responseBody['data'] as List)
            .map((json) => Attendance.fromJson(json))
            .toList();

        return {'success': true, 'attendances': attendances};
      } else if (response.statusCode == 404) {
        return {
          'success': true,
          'message': 'No attendance records found for this date.',
          'attendances': <Attendance>[],
        };
      } else {
        final errorBody = json.decode(response.body);
        String errorMessage =
            errorBody['message'] ??
            'Failed to fetch attendance records by date.';
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
