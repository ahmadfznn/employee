class Payroll {
  final String id;
  final String employeeId;
  final String month;
  final double baseSalary;
  final double bonus;
  final double deductions;
  final double totalSalary;
  final String status;
  final DateTime? paymentDate;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  const Payroll({
    required this.id,
    required this.employeeId,
    required this.month,
    required this.baseSalary,
    required this.bonus,
    required this.deductions,
    required this.totalSalary,
    required this.status,
    this.paymentDate,
    this.createdAt,
    this.updatedAt,
  });

  factory Payroll.fromJson(Map<String, dynamic> json) {
    double _parseDouble(dynamic value) {
      if (value is num) {
        return value.toDouble();
      } else if (value is String) {
        return double.tryParse(value) ?? 0.0;
      }
      return 0.0;
    }

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

    return Payroll(
      id: json['id'] as String,
      employeeId: json['employee_id'] as String,
      month: json['month'] as String,
      baseSalary: _parseDouble(json['base_salary']),
      bonus: _parseDouble(json['bonus']),
      deductions: _parseDouble(json['deductions']),
      totalSalary: _parseDouble(json['total_salary']),
      status: json['status'] as String,
      paymentDate: _parseDateTime(json['payment_date']),
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'] as String)
          : null,
      updatedAt: json['updated_at'] != null
          ? DateTime.parse(json['updated_at'] as String)
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'employee_id': employeeId,
      'month': month,
      'base_salary': baseSalary,
      'bonus': bonus,
      'deductions': deductions,
      'total_salary': totalSalary,
      'status': status,
      'payment_date': paymentDate?.toIso8601String(),
      'created_at': createdAt?.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
    };
  }

  List<Object?> get props => [
    id,
    employeeId,
    month,
    baseSalary,
    bonus,
    deductions,
    totalSalary,
    status,
    paymentDate,
    createdAt,
    updatedAt,
  ];
}
