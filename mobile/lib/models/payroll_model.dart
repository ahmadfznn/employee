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
    return Payroll(
      id: json['id'] as String,
      employeeId: json['employee_id'] as String,
      month: json['month'] as String,
      baseSalary: (json['base_salary'] as num).toDouble(),
      bonus: (json['bonus'] as num).toDouble(),
      deductions: (json['deductions'] as num).toDouble(),
      totalSalary: (json['total_salary'] as num).toDouble(),
      status: json['status'] as String,
      paymentDate: json['payment_date'] != null
          ? DateTime.parse(json['payment_date'] as String)
          : null,
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
