import 'dart:convert';
import 'package:equatable/equatable.dart';

class LocationData extends Equatable {
  final double latitude;
  final double longitude;
  final String? address;

  const LocationData({
    required this.latitude,
    required this.longitude,
    this.address,
  });

  factory LocationData.fromJson(Map<String, dynamic> json) {
    return LocationData(
      latitude: (json['latitude'] as num).toDouble(),
      longitude: (json['longitude'] as num).toDouble(),
      address: json['address'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {'latitude': latitude, 'longitude': longitude, 'address': address};
  }

  @override
  List<Object?> get props => [latitude, longitude, address];
}

class Attendance extends Equatable {
  final String id;
  final String employeeId;
  final DateTime date;
  final DateTime? checkIn;
  final DateTime? checkOut;
  final LocationData? locationCheckIn;
  final LocationData? locationCheckOut;
  final String status;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  const Attendance({
    required this.id,
    required this.employeeId,
    required this.date,
    this.checkIn,
    this.checkOut,
    this.locationCheckIn,
    this.locationCheckOut,
    required this.status,
    this.createdAt,
    this.updatedAt,
  });

  factory Attendance.fromJson(Map<String, dynamic> json) {
    DateTime? _parseDateTime(dynamic value) {
      if (value == null) {
        return null;
      }
      if (value is String && value.isEmpty) {
        return null;
      }
      try {
        return DateTime.parse(value as String);
      } catch (e) {
        print('Error parsing date: $value - $e');
        return null;
      }
    }

    LocationData? _parseLocationData(dynamic value) {
      if (value == null) {
        return null;
      }
      if (value is String) {
        try {
          final decoded = jsonDecode(value);
          if (decoded is Map<String, dynamic>) {
            return LocationData.fromJson(decoded);
          }
        } catch (e) {
          print('Error decoding location JSON string: $value - $e');
          return null;
        }
      } else if (value is Map<String, dynamic>) {
        return LocationData.fromJson(value);
      }
      return null;
    }

    return Attendance(
      id: json['id'] as String,
      employeeId: json['employee_id'] as String,

      date: DateTime.parse(json['date'] as String),
      checkIn: _parseDateTime(json['check_in']),
      checkOut: _parseDateTime(json['check_out']),
      locationCheckIn: _parseLocationData(json['location_check_in']),
      locationCheckOut: _parseLocationData(json['location_check_out']),
      status: json['status'] as String,
      createdAt: _parseDateTime(json['created_at']),
      updatedAt: _parseDateTime(json['updated_at']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'employee_id': employeeId,
      'date': date.toIso8601String().split('T')[0],
      'check_in': checkIn?.toIso8601String(),
      'check_out': checkOut?.toIso8601String(),
      'location_check_in': locationCheckIn?.toJson(),
      'location_check_out': locationCheckOut?.toJson(),
      'status': status,
      'created_at': createdAt?.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
    };
  }

  @override
  List<Object?> get props => [
    id,
    employeeId,
    date,
    checkIn,
    checkOut,
    locationCheckIn,
    locationCheckOut,
    status,
    createdAt,
    updatedAt,
  ];
}
