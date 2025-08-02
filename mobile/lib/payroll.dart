import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'dart:async';

import 'package:mobile/service/auth_service.dart';
import 'package:mobile/service/payroll_service.dart';
import 'package:mobile/models/payroll_model.dart' as PayrollModel;

class AppIcons {
  static const IconData home = Icons.home_rounded;
  static const IconData clock = Icons.access_time_rounded;
  static const IconData calendar = Icons.calendar_month_rounded;
  static const IconData dollarSign = Icons.attach_money_rounded;
  static const IconData user = Icons.person_rounded;
  static const IconData arrowLeft = Icons.arrow_back_rounded;
  static const IconData download = Icons.download_rounded;
  static const IconData eye = Icons.visibility_rounded;
  static const IconData checkCircle = Icons.check_circle_outline_rounded;
  static const IconData alertCircle = Icons.warning_rounded;
  static const IconData creditCard = Icons.credit_card_rounded;
  static const IconData trendingUp = Icons.trending_up_rounded;
  static const IconData building = Icons.apartment_rounded; // or Icons.business
  static const IconData shield = Icons.security_rounded;
  static const IconData heart = Icons.favorite_rounded;
  static const IconData car = Icons.directions_car_rounded;
}

class Payroll extends StatefulWidget {
  const Payroll({super.key});

  @override
  State<Payroll> createState() => _Payroll();
}

class _Payroll extends State<Payroll> {
  DateTime _currentTime = DateTime.now();
  String? _selectedSlipId;
  bool _isLoadingPayrolls = true;
  final AuthService _authService = AuthService();
  final PayrollService _payrollService = PayrollService();
  List<PayrollModel.Payroll> _payrollRequests = [];

  late Timer _timer;

  @override
  void initState() {
    super.initState();
    _fetchPayrolls();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (mounted) {
        setState(() {
          _currentTime = DateTime.now();
        });
      }
    });
  }

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  final List<Map<String, dynamic>> _payrollData = [
    {
      'id': 1,
      'month': 'July 2025',
      'period': 'Jul 1 - Jul 31, 2025',
      'baseSalary': 5000.0,
      'allowances': {
        'housing': 800.0,
        'transport': 300.0,
        'meal': 200.0,
        'performance': 500.0,
      },
      'deductions': {
        'tax': 650.0,
        'insurance': 150.0,
        'pension': 200.0,
        'loan': 100.0,
      },
      'netPay': 5200.0,
      'status': 'Paid',
      'paidDate': '2025-07-31',
    },
    {
      'id': 2,
      'month': 'June 2025',
      'period': 'Jun 1 - Jun 30, 2025',
      'baseSalary': 5000.0,
      'allowances': {
        'housing': 800.0,
        'transport': 300.0,
        'meal': 200.0,
        'performance': 300.0,
      },
      'deductions': {
        'tax': 630.0,
        'insurance': 150.0,
        'pension': 200.0,
        'loan': 100.0,
      },
      'netPay': 4920.0,
      'status': 'Paid',
      'paidDate': '2025-06-30',
    },
    {
      'id': 3,
      'month': 'May 2025',
      'period': 'May 1 - May 31, 2025',
      'baseSalary': 5000.0,
      'allowances': {
        'housing': 800.0,
        'transport': 300.0,
        'meal': 200.0,
        'performance': 400.0,
      },
      'deductions': {
        'tax': 640.0,
        'insurance': 150.0,
        'pension': 200.0,
        'loan': 100.0,
      },
      'netPay': 5010.0,
      'status': 'Paid',
      'paidDate': '2025-05-31',
    },
  ];

  double _calculateTotalEarnings(
    double salary,
    Map<String, dynamic> allowances,
  ) {
    return salary +
        allowances.values.cast<double>().fold(0.0, (sum, val) => sum + val);
  }

  double _calculateTotalDeductions(Map<String, dynamic> deductions) {
    return deductions.values.cast<double>().fold(0.0, (sum, val) => sum + val);
  }

  String _formatCurrency(double amount) {
    final format = NumberFormat.currency(locale: 'en_US', symbol: '\$');
    return format.format(amount);
  }

  Future<void> _fetchPayrolls() async {
    setState(() {
      _isLoadingPayrolls = true;
    });

    try {
      final userData = await _authService.getUserData();
      if (userData == null || userData['id'] == null) {
        throw Exception('User data not found. Please log in again.');
      }
      final employeeId = userData['id'];

      final result = await _payrollService.getPayrollsByEmployee(employeeId);

      if (mounted) {
        if (result['success']) {
          setState(() {
            _payrollRequests = result['payrolls'];
          });
        } else {
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text(result['message'])));
          _payrollRequests = [];
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error fetching payroll history: $e')),
        );
        _payrollRequests = [];
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoadingPayrolls = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_selectedSlipId != null) {
      final slip = _payrollData.firstWhere((p) => p['id'] == _selectedSlipId);
      final totalEarnings = _calculateTotalEarnings(
        slip['baseSalary'],
        slip['allowances'],
      );
      final totalDeductions = _calculateTotalDeductions(slip['deductions']);

      return Scaffold(
        backgroundColor: const Color(0xFFF8FAFC), // Equivalent to slate-50
        body: SafeArea(
          child: Column(
            children: [
              // Header
              Container(
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.8),
                  border: Border(
                    bottom: BorderSide(
                      color: Colors.blueGrey.shade100.withOpacity(0.5),
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
                padding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 16,
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        InkWell(
                          onTap: () {
                            setState(() {
                              _selectedSlipId = null;
                            });
                          },
                          borderRadius: BorderRadius.circular(99),
                          child: Container(
                            width: 40,
                            height: 40,
                            decoration: BoxDecoration(
                              color: Colors.blueGrey.shade100,
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(
                              AppIcons.arrowLeft,
                              color: Color(0xFF475569),
                            ), // slate-700
                          ),
                        ),
                        const SizedBox(width: 16),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Pay Slip Details 📋',
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                                color: Colors.blueGrey.shade800, // slate-800
                              ),
                            ),
                            Text(
                              slip['period'],
                              style: TextStyle(
                                fontSize: 13,
                                color: Colors.blueGrey.shade500, // slate-500
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    ElevatedButton.icon(
                      onPressed: () {
                        // Handle download PDF
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blue.shade600, // blue-600
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 10,
                        ),
                        elevation: 0,
                      ),
                      icon: const Icon(AppIcons.download, size: 16),
                      label: const Text(
                        'Download PDF',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              // Pay Slip Content
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Net Pay Summary
                      Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              Colors.green.shade500, // from-green-500
                              Colors.teal.shade600, // to-teal-600
                            ],
                            begin: Alignment.centerLeft,
                            end: Alignment.centerRight,
                          ),
                          borderRadius: BorderRadius.circular(16),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.1),
                              blurRadius: 8,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        padding: const EdgeInsets.all(24),
                        child: Column(
                          children: [
                            Text(
                              'Net Pay for ${slip['month']}',
                              style: TextStyle(
                                color: Colors.green.shade100, // green-100
                                fontSize: 14,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              _formatCurrency(slip['netPay']),
                              style: const TextStyle(
                                fontSize: 36,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                            const SizedBox(height: 16),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(
                                  AppIcons.checkCircle,
                                  color: Colors.green.shade200,
                                  size: 20,
                                ), // green-200
                                const SizedBox(width: 8),
                                Text(
                                  'Paid on ${DateFormat.yMMMd().format(DateTime.parse(slip['paidDate']))}',
                                  style: TextStyle(
                                    color: Colors.green.shade100, // green-100
                                    fontSize: 14,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Earnings Section
                      _buildSection(
                        title: 'Earnings',
                        totalAmount: totalEarnings,
                        icon: AppIcons.trendingUp,
                        iconBgColor: Colors.green.shade100, // green-100
                        iconColor: Colors.green.shade600, // green-600
                        items: [
                          _buildAllowanceItem(
                            'Base Salary',
                            slip['baseSalary'],
                            AppIcons.creditCard,
                            Colors.blueGrey.shade600,
                          ),
                          _buildAllowanceItem(
                            'Housing Allowance',
                            slip['allowances']['housing'],
                            AppIcons.building,
                            Colors.blue.shade600,
                          ),
                          _buildAllowanceItem(
                            'Transport Allowance',
                            slip['allowances']['transport'],
                            AppIcons.car,
                            Colors.purple.shade600,
                          ),
                          _buildAllowanceItem(
                            'Meal Allowance',
                            slip['allowances']['meal'],
                            AppIcons.heart,
                            Colors.orange.shade600,
                          ),
                          _buildAllowanceItem(
                            'Performance Bonus',
                            slip['allowances']['performance'],
                            AppIcons.trendingUp,
                            Colors.green.shade600,
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),

                      // Deductions Section
                      _buildSection(
                        title: 'Deductions',
                        totalAmount: totalDeductions,
                        isDeduction: true,
                        icon: AppIcons.alertCircle,
                        iconBgColor: Colors.red.shade100, // red-100
                        iconColor: Colors.red.shade600, // red-600
                        items: [
                          _buildAllowanceItem(
                            'Federal Tax',
                            slip['deductions']['tax'],
                            AppIcons.building,
                            Colors.red.shade600,
                            isDeduction: true,
                          ),
                          _buildAllowanceItem(
                            'Health Insurance',
                            slip['deductions']['insurance'],
                            AppIcons.shield,
                            Colors.red.shade600,
                            isDeduction: true,
                          ),
                          _buildAllowanceItem(
                            'Retirement Fund',
                            slip['deductions']['pension'],
                            AppIcons.creditCard,
                            Colors.red.shade600,
                            isDeduction: true,
                          ),
                          _buildAllowanceItem(
                            'Employee Loan',
                            slip['deductions']['loan'],
                            AppIcons.dollarSign,
                            Colors.red.shade600,
                            isDeduction: true,
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),

                      // Summary
                      Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              Colors.blueGrey.shade800, // from-slate-800
                              Colors.blueGrey.shade900, // to-slate-900
                            ],
                            begin: Alignment.centerLeft,
                            end: Alignment.centerRight,
                          ),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        padding: const EdgeInsets.all(24),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Payment Summary',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w600,
                                color: Colors.white,
                              ),
                            ),
                            const SizedBox(height: 16),
                            _buildSummaryRow(
                              'Gross Earnings',
                              totalEarnings,
                              Colors.blueGrey.shade300,
                              Colors.white,
                            ),
                            const SizedBox(height: 12),
                            _buildSummaryRow(
                              'Total Deductions',
                              -totalDeductions,
                              Colors.blueGrey.shade300,
                              Colors.white,
                              isDeduction: true,
                            ),
                            Container(
                              height: 1,
                              color: Colors.blueGrey.shade600, // slate-600
                              margin: const EdgeInsets.symmetric(vertical: 12),
                            ),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                const Text(
                                  'Net Pay',
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.w600,
                                    color: Colors.white,
                                  ),
                                ),
                                Text(
                                  _formatCurrency(slip['netPay']),
                                  style: TextStyle(
                                    fontSize: 24,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.green.shade400, // green-400
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 80), // Padding for the bottom
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      );
    }

    // Main Payroll History Screen
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC), // Equivalent to slate-50
      body: SafeArea(
        child: Column(
          children: [
            // Main Content
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Current Month Summary
                    Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            Colors.blue.shade600, // from-blue-600
                            Colors.purple.shade700, // to-purple-700
                          ],
                          begin: Alignment.centerLeft,
                          end: Alignment.centerRight,
                        ),
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.1),
                            blurRadius: 8,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      padding: const EdgeInsets.all(24),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Container(
                                width: 56,
                                height: 56,
                                decoration: BoxDecoration(
                                  color: Colors.white.withOpacity(0.2),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: const Icon(
                                  AppIcons.dollarSign,
                                  color: Colors.white,
                                  size: 28,
                                ),
                              ),
                              const SizedBox(width: 16),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'Latest Pay',
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.w600,
                                      color: Colors.white,
                                    ),
                                  ),
                                  Text(
                                    '${_payrollData[0]['month']} • Paid',
                                    style: TextStyle(
                                      color: Colors.blue.shade100, // blue-100
                                      fontSize: 13,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Text(
                                _formatCurrency(_payrollData[0]['netPay']),
                                style: const TextStyle(
                                  fontSize: 28,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                ),
                              ),
                              Text(
                                'Net Amount',
                                style: TextStyle(
                                  color: Colors.blue.shade200, // blue-200
                                  fontSize: 14,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Payroll Cards
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(
                              AppIcons.clock,
                              color: Colors.blueGrey.shade600,
                              size: 20,
                            ), // slate-600
                            const SizedBox(width: 8),
                            Text(
                              'Payment History',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w600,
                                color: Colors.blueGrey.shade800, // slate-800
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        ..._payrollRequests.map(
                          (payroll) => Padding(
                            padding: const EdgeInsets.only(bottom: 16),
                            child: _buildPayrollCard(payroll),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),

                    // Quick Stats
                    Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.05),
                            blurRadius: 4,
                            offset: const Offset(0, 2),
                          ),
                        ],
                        border: Border.all(
                          color: Colors.blueGrey.shade100,
                        ), // border-slate-100
                      ),
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Quick Stats',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w600,
                              color: Colors.blueGrey.shade800, // slate-800
                            ),
                          ),
                          const SizedBox(height: 16),
                          Row(
                            children: [
                              Expanded(
                                child: Container(
                                  padding: const EdgeInsets.all(16),
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      colors: [
                                        Colors.green.shade50, // from-green-50
                                        Colors.teal.shade50, // to-teal-50
                                      ],
                                      begin: Alignment.topLeft,
                                      end: Alignment.bottomRight,
                                    ),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Column(
                                    children: [
                                      Icon(
                                        AppIcons.trendingUp,
                                        color: Colors.green.shade600,
                                        size: 32,
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        '\$15,640',
                                        style: TextStyle(
                                          fontSize: 18,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.green.shade700,
                                        ),
                                      ),
                                      Text(
                                        'Average Monthly',
                                        style: TextStyle(
                                          fontSize: 14,
                                          color: Colors.green.shade600,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: Container(
                                  padding: const EdgeInsets.all(16),
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      colors: [
                                        Colors.blue.shade50, // from-blue-50
                                        Colors.purple.shade50, // to-purple-50
                                      ],
                                      begin: Alignment.topLeft,
                                      end: Alignment.bottomRight,
                                    ),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Column(
                                    children: [
                                      Icon(
                                        AppIcons.checkCircle,
                                        color: Colors.blue.shade600,
                                        size: 32,
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        '100%',
                                        style: TextStyle(
                                          fontSize: 18,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.blue.shade700,
                                        ),
                                      ),
                                      Text(
                                        'On-time Payments',
                                        style: TextStyle(
                                          fontSize: 14,
                                          color: Colors.blue.shade600,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 80), // Padding for the bottom
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Helper Widgets to keep the build method clean
  Widget _buildSection({
    required String title,
    required double totalAmount,
    required IconData icon,
    required Color iconBgColor,
    required Color iconColor,
    required List<Widget> items,
    bool isDeduction = false,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
        border: Border.all(color: Colors.blueGrey.shade100), // border-slate-100
      ),
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: iconBgColor,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, color: iconColor, size: 24),
              ),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                      color: Colors.blueGrey.shade800, // slate-800
                    ),
                  ),
                  Text(
                    'Total: ${_formatCurrency(totalAmount)}',
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.blueGrey.shade500, // slate-500
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 20),
          Column(children: items),
        ],
      ),
    );
  }

  Widget _buildAllowanceItem(
    String label,
    double amount,
    IconData icon,
    Color iconColor, {
    bool isDeduction = false,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDeduction
            ? Colors.red.shade50
            : Colors.blueGrey.shade50, // red-50 or slate-50
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Icon(icon, color: iconColor, size: 20),
              const SizedBox(width: 12),
              Text(
                label,
                style: TextStyle(
                  fontWeight: FontWeight.w500,
                  color: Colors.blueGrey.shade700, // slate-700
                ),
              ),
            ],
          ),
          Text(
            '${isDeduction ? '-' : ''}${_formatCurrency(amount)}',
            style: TextStyle(
              fontWeight: FontWeight.w600,
              color: isDeduction ? Colors.red.shade600 : iconColor,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryRow(
    String label,
    double amount,
    Color labelColor,
    Color amountColor, {
    bool isDeduction = false,
  }) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: TextStyle(color: labelColor)),
        Text(
          '${isDeduction ? '-' : ''}${_formatCurrency(amount.abs())}', // Use abs() for display if it's a negative amount
          style: TextStyle(fontWeight: FontWeight.w600, color: amountColor),
        ),
      ],
    );
  }

  Widget _buildPayrollCard(PayrollModel.Payroll payroll) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
        border: Border.all(color: Colors.blueGrey.shade100), // border-slate-100
      ),
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          Colors.green.shade400, // from-green-400
                          Colors.teal.shade500, // to-teal-500
                        ],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(
                      AppIcons.dollarSign,
                      color: Colors.white,
                      size: 24,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        payroll.month,
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Colors.blueGrey.shade800, // slate-800
                        ),
                      ),
                      Text(
                        payroll.paymentDate?.year.toString() ?? 'N/A',
                        style: TextStyle(
                          fontSize: 13,
                          color: Colors.blueGrey.shade500,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Row(
                    children: [
                      Icon(
                        AppIcons.checkCircle,
                        color: Colors.green.shade500,
                        size: 16,
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.green.shade50,
                          borderRadius: BorderRadius.circular(99),
                        ),
                        child: Text(
                          payroll.status,
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                            color: Colors.green.shade600,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Net Pay',
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.blueGrey.shade500, // slate-500
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    _formatCurrency(payroll.totalSalary),
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Colors.blueGrey.shade800, // slate-800
                    ),
                  ),
                ],
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    'Gross: ${_formatCurrency(_calculateTotalEarnings(payroll.baseSalary, {}))}',
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.blueGrey.shade500, // slate-500
                    ),
                  ),
                  Text(
                    'Deductions: -${_formatCurrency(_calculateTotalDeductions({}))}',
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.blueGrey.shade500, // slate-500
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () {
                    setState(() {
                      _selectedSlipId = payroll.id;
                    });
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue.shade600, // blue-600
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    elevation: 0,
                  ),
                  icon: const Icon(AppIcons.eye, size: 16),
                  label: const Text(
                    'View Slip',
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              InkWell(
                onTap: () {
                  // Handle download PDF
                },
                borderRadius: BorderRadius.circular(12),
                child: Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: Colors.blueGrey.shade100,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    AppIcons.download,
                    color: Colors.blueGrey.shade600,
                    size: 16,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
