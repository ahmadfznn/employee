import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:mobile/service/auth_service.dart';
import 'dart:async';

import 'package:mobile/setting.dart';

class AppIcons {
  static const IconData home = Icons.home_rounded;
  static const IconData clock = Icons.access_time_rounded;
  static const IconData calendar = Icons.calendar_month_rounded;
  static const IconData dollarSign = Icons.attach_money_rounded;
  static const IconData user = Icons.person_rounded;
  static const IconData settings = Icons.settings_rounded;
  static const IconData edit = Icons.edit_rounded;
  static const IconData mapPin = Icons.location_on_rounded;
  static const IconData phone = Icons.phone_rounded;
  static const IconData mail = Icons.mail_rounded;
  static const IconData building = Icons.business_rounded;
  static const IconData creditCard = Icons.credit_card_rounded;
  static const IconData save = Icons.save_rounded;
  static const IconData close = Icons.close_rounded;
  static const IconData camera = Icons.camera_alt_rounded;
}

class Profile extends StatefulWidget {
  const Profile({super.key});

  @override
  State<Profile> createState() => _Profile();
}

Route _goPage(Widget page) {
  return PageRouteBuilder(
    pageBuilder: (context, animation, secondaryAnimation) => page,
    transitionDuration: const Duration(milliseconds: 500),
    reverseTransitionDuration: const Duration(milliseconds: 500),
    opaque: false,
    transitionsBuilder: (context, animation, secondaryAnimation, child) {
      const begin = Offset(0.0, 1.0);
      const end = Offset.zero;
      final tween = Tween(
        begin: begin,
        end: end,
      ).chain(CurveTween(curve: Curves.easeInOutExpo));
      final offsetAnimation = animation.drive(tween);
      return SlideTransition(position: offsetAnimation, child: child);
    },
  );
}

class _Profile extends State<Profile> {
  DateTime _currentTime = DateTime.now();
  bool _isEditing = false;
  String? _editingField;
  bool _isLoading = true;

  Map<String, dynamic> _profileData = {
    'name': 'Alexander Rodriguez',
    'position': 'Senior Software Engineer',
    'role': 'Engineering',
    'joinDate': '2022-03-15',
    'email': 'alex.rodriguez@company.com',
    'phone': '+1 (555) 123-4567',
    'address': '123 Tech Street, San Francisco, CA 94105',
    'photoUrl':
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
  };

  late Map<String, dynamic> _tempData;

  late Timer _timer;
  final AuthService _authService = AuthService();

  @override
  void initState() {
    super.initState();
    _loadUserData();
    _tempData = Map.from(_profileData);
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

  Future<void> _loadUserData() async {
    try {
      final userData = await _authService.getUserData();
      if (mounted) {
        setState(() {
          _isLoading = false;
          if (userData != null) {
            _profileData['id'] = userData['id'];
            _profileData['name'] = userData['name'] ?? 'Guest User';
            _profileData['email'] = userData['email'] ?? 'guest@example.com';
            _profileData['phone'] = userData['phone'] ?? '+1 (000) 000-0000';
            _profileData['position'] = userData['position'] ?? 'Employee';
            _profileData['role'] = userData['role'] ?? 'User';
            _profileData['salary'] = userData['salary'];
            _profileData['photoUrl'] =
                userData['photo_url'] ??
                'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face';
            _profileData['address'] = userData['address'] ?? 'N/A';
            _profileData['status'] = userData['status'] ?? true;
            _profileData['joinDate'] = userData['created_at'] ?? '2022-03-15';
          } else {
            print('No user data found in SharedPreferences.');
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('No user data found. Please login again.'),
              ),
            );
          }
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isLoading = false;
          _profileData['name'] = 'Error loading name';
          _profileData['email'] = 'Error loading email';
          _profileData['id'] = null;
        });
        print('Error loading user data: $e');
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Failed to load user data: $e')));
      }
    }
  }

  void _handleEdit(String field) {
    setState(() {
      _editingField = field;
      _isEditing = true;
    });
  }

  void _handleSave() {
    setState(() {
      _profileData = Map.from(_tempData);
      _isEditing = false;
      _editingField = null;
    });
  }

  void _handleCancel() {
    setState(() {
      _tempData = Map.from(_profileData);
      _isEditing = false;
      _editingField = null;
    });
  }

  String _formatDate(String dateString) {
    final date = DateTime.parse(dateString);
    return DateFormat.yMMMd().format(date);
  }

  String _getYearsOfService() {
    final joinDate = DateTime.parse(_profileData['joinDate']);
    final today = DateTime.now();
    int years = today.year - joinDate.year;
    int months = today.month - joinDate.month;
    if (today.day < joinDate.day) {
      months--;
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    return '$years years, $months months';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAF5FF),
      body: SafeArea(
        child: Column(
          children: [
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
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Stack(
                        children: [
                          Container(
                            width: 48,
                            height: 48,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(color: Colors.white, width: 3),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.2),
                                  blurRadius: 4,
                                  offset: const Offset(0, 2),
                                ),
                              ],
                              image: DecorationImage(
                                image: NetworkImage(_profileData['photoUrl']),
                                fit: BoxFit.cover,
                              ),
                            ),
                          ),
                          Positioned(
                            bottom: -4,
                            right: -4,
                            child: Container(
                              width: 20,
                              height: 20,
                              decoration: BoxDecoration(
                                color: Colors.green.shade500,
                                shape: BoxShape.circle,
                                border: Border.all(
                                  color: Colors.white,
                                  width: 2,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(width: 16),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'My Profile 👤',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: Colors.blueGrey.shade800,
                            ),
                          ),
                          Text(
                            DateFormat.yMMMd().format(_currentTime),
                            style: TextStyle(
                              fontSize: 13,
                              color: Colors.blueGrey.shade500,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  InkWell(
                    onTap: () {
                      Navigator.push(context, _goPage(Settings()));
                    },
                    borderRadius: BorderRadius.circular(99),
                    child: Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            Colors.blueGrey.shade100,
                            Colors.blueGrey.shade200,
                          ],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        AppIcons.settings,
                        color: Colors.blueGrey.shade700,
                        size: 20,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            Colors.purple.shade400,
                            Colors.pink.shade400,
                            Colors.blue.shade400,
                          ],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(24),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.2),
                            blurRadius: 10,
                            offset: const Offset(0, 5),
                          ),
                        ],
                      ),
                      padding: const EdgeInsets.all(32),
                      child: Stack(
                        children: [
                          Positioned(
                            top: -64,
                            right: -64,
                            child: Container(
                              width: 128,
                              height: 128,
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.1),
                                shape: BoxShape.circle,
                              ),
                            ),
                          ),
                          Positioned(
                            bottom: -40,
                            left: -40,
                            child: Container(
                              width: 80,
                              height: 80,
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.1),
                                shape: BoxShape.circle,
                              ),
                            ),
                          ),
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Stack(
                                children: [
                                  Container(
                                    width: 96,
                                    height: 96,
                                    decoration: BoxDecoration(
                                      borderRadius: BorderRadius.circular(24),
                                      border: Border.all(
                                        color: Colors.white.withOpacity(0.3),
                                        width: 4,
                                      ),
                                      boxShadow: [
                                        BoxShadow(
                                          color: Colors.black.withOpacity(0.4),
                                          blurRadius: 16,
                                          offset: const Offset(0, 8),
                                        ),
                                      ],
                                      image: DecorationImage(
                                        image: NetworkImage(
                                          _profileData['photoUrl'],
                                        ),
                                        fit: BoxFit.cover,
                                      ),
                                    ),
                                  ),
                                  Positioned(
                                    bottom: -8,
                                    right: -8,
                                    child: InkWell(
                                      onTap: () {},
                                      borderRadius: BorderRadius.circular(99),
                                      child: Container(
                                        width: 32,
                                        height: 32,
                                        decoration: BoxDecoration(
                                          color: Colors.white,
                                          shape: BoxShape.circle,
                                          boxShadow: [
                                            BoxShadow(
                                              color: Colors.black.withOpacity(
                                                0.2,
                                              ),
                                              blurRadius: 8,
                                              offset: const Offset(0, 4),
                                            ),
                                          ],
                                        ),
                                        child: Icon(
                                          AppIcons.camera,
                                          color: Colors.purple.shade600,
                                          size: 16,
                                        ),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(width: 24),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      _profileData['name'],
                                      style: const TextStyle(
                                        fontSize: 24,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.white,
                                      ),
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      _profileData['position'],
                                      style: TextStyle(
                                        color: Colors.purple.shade100,
                                        fontSize: 18,
                                      ),
                                    ),
                                    Text(
                                      _profileData['role'],
                                      style: TextStyle(
                                        color: Colors.purple.shade100
                                            .withOpacity(0.8),
                                        fontSize: 16,
                                      ),
                                    ),
                                    const SizedBox(height: 12),
                                    Row(
                                      children: [
                                        Icon(
                                          AppIcons.calendar,
                                          color: Colors.purple.shade200,
                                          size: 16,
                                        ),
                                        const SizedBox(width: 8),
                                        Text(
                                          _getYearsOfService(),
                                          style: TextStyle(
                                            color: Colors.purple.shade100,
                                            fontSize: 14,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),

                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(
                              AppIcons.phone,
                              color: Colors.purple.shade600,
                              size: 20,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              'Contact Information',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w600,
                                color: Colors.blueGrey.shade800,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        _buildInfoCard(
                          icon: AppIcons.mail,
                          title: 'Email Address',
                          value: _profileData['email'],
                          field: 'email',
                          editable: true,
                          type: TextInputType.emailAddress,
                        ),
                        const SizedBox(height: 16),
                        _buildInfoCard(
                          icon: AppIcons.phone,
                          title: 'Phone Number',
                          value: _profileData['phone'],
                          field: 'phone',
                          editable: true,
                          type: TextInputType.phone,
                        ),
                        const SizedBox(height: 16),
                        _buildInfoCard(
                          icon: AppIcons.mapPin,
                          title: 'Address',
                          value: _profileData['address'],
                          field: 'address',
                          editable: true,
                          type: TextInputType.multiline,
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),

                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(
                              AppIcons.building,
                              color: Colors.blue.shade600,
                              size: 20,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              'Work Information',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w600,
                                color: Colors.blueGrey.shade800,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        _buildInfoCard(
                          icon: AppIcons.user,
                          title: 'Job Title',
                          value: _profileData['position'],
                          field: 'position',
                          editable: true,
                        ),
                        const SizedBox(height: 16),
                        _buildInfoCard(
                          icon: AppIcons.building,
                          title: 'Department',
                          value: _profileData['role'],
                          field: 'role',
                          editable: true,
                        ),
                        const SizedBox(height: 16),
                        _buildInfoCard(
                          icon: AppIcons.calendar,
                          title: 'Join Date',
                          value: _formatDate(_profileData['joinDate']),
                          field: 'joinDate',
                          editable: false,
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),

                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(
                              AppIcons.creditCard,
                              color: Colors.green.shade600,
                              size: 20,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              'Government ID',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w600,
                                color: Colors.blueGrey.shade800,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        // _buildInfoCard(
                        //   icon: AppIcons.creditCard,
                        //   title: 'NIK (National ID)',
                        //   value: _profileData['nik'].replaceAllMapped(
                        //     RegExp(r'(\d{4})(\d{4})(\d{4})(\d{4})'),
                        //     (Match m) => '${m[1]} ${m[2]} ${m[3]} ${m[4]}',
                        //   ),
                        //   field: 'nik',
                        //   editable: true,
                        //   type: TextInputType.number,
                        // ),
                      ],
                    ),
                    const SizedBox(height: 24),

                    Container(
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.7),
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.05),
                            blurRadius: 4,
                            offset: const Offset(0, 2),
                          ),
                        ],
                        border: Border.all(
                          color: Colors.white.withOpacity(0.2),
                        ),
                      ),
                      padding: const EdgeInsets.all(24),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Quick Stats',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w600,
                              color: Colors.blueGrey.shade800,
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
                                        Colors.green.shade100,
                                        Colors.teal.shade100,
                                      ],
                                      begin: Alignment.topLeft,
                                      end: Alignment.bottomRight,
                                    ),
                                    borderRadius: BorderRadius.circular(16),
                                  ),
                                  child: Column(
                                    children: [
                                      Icon(
                                        AppIcons.calendar,
                                        color: Colors.green.shade600,
                                        size: 32,
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        '${(_currentTime.difference(DateTime.parse(_profileData['joinDate'])).inDays / 365.25).floor()}',
                                        style: TextStyle(
                                          fontSize: 18,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.green.shade700,
                                        ),
                                      ),
                                      Text(
                                        'Years',
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
                                        Colors.blue.shade100,
                                        Colors.purple.shade100,
                                      ],
                                      begin: Alignment.topLeft,
                                      end: Alignment.bottomRight,
                                    ),
                                    borderRadius: BorderRadius.circular(16),
                                  ),
                                  child: Column(
                                    children: [
                                      Icon(
                                        AppIcons.building,
                                        color: Colors.blue.shade600,
                                        size: 32,
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        '95%',
                                        style: TextStyle(
                                          fontSize: 18,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.blue.shade700,
                                        ),
                                      ),
                                      Text(
                                        'Attendance',
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
                    const SizedBox(height: 24),

                    if (!_isEditing)
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: () {
                            setState(() {
                              _isEditing = true;
                            });
                          },
                          style:
                              ElevatedButton.styleFrom(
                                backgroundColor: Colors.transparent,
                                foregroundColor: Colors.white,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(24),
                                ),
                                padding: const EdgeInsets.symmetric(
                                  vertical: 20,
                                ),
                                elevation: 8,
                                shadowColor: Colors.purple.shade300.withOpacity(
                                  0.5,
                                ),
                              ).copyWith(
                                overlayColor: MaterialStateProperty.all(
                                  Colors.white.withOpacity(0.1),
                                ),
                              ),
                          child: Ink(
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: [
                                  Colors.purple.shade500,
                                  Colors.pink.shade500,
                                ],
                                begin: Alignment.centerLeft,
                                end: Alignment.centerRight,
                              ),
                              borderRadius: BorderRadius.circular(24),
                            ),
                            child: Container(
                              alignment: Alignment.center,
                              constraints: const BoxConstraints(minHeight: 60),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(AppIcons.edit, size: 20),
                                  const SizedBox(width: 8),
                                  Text(
                                    'Edit Profile',
                                    style: const TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w600,
                                      color: Colors.white,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ),
                    const SizedBox(height: 80),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoCard({
    required IconData icon,
    required String title,
    required String value,
    required String field,
    bool editable = false,
    TextInputType type = TextInputType.text,
  }) {
    TextEditingController controller = TextEditingController(
      text: _tempData[field].toString(),
    );

    controller.addListener(() {
      _tempData[field] = controller.text;
    });

    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.7),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
        border: Border.all(
          color: _editingField == field
              ? Colors.purple.shade300
              : Colors.white.withOpacity(0.2),
          width: _editingField == field ? 2 : 1,
        ),
      ),
      transform: _editingField == field
          ? (Matrix4.identity()..scale(1.02))
          : Matrix4.identity(),
      padding: const EdgeInsets.all(20),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [Colors.purple.shade100, Colors.pink.shade100],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: Colors.purple.shade600, size: 24),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: Colors.blueGrey.shade600,
                  ),
                ),
                const SizedBox(height: 4),
                _editingField == field
                    ? Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          TextField(
                            controller: controller,
                            keyboardType: type,
                            maxLines: type == TextInputType.multiline ? 3 : 1,
                            autofocus: true,
                            decoration: InputDecoration(
                              isDense: true,
                              contentPadding: const EdgeInsets.symmetric(
                                horizontal: 16,
                                vertical: 12,
                              ),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: BorderSide(
                                  color: Colors.purple.shade200,
                                ),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: BorderSide(
                                  color: Colors.purple.shade300,
                                  width: 2,
                                ),
                              ),
                              filled: true,
                              fillColor: Colors.white.withOpacity(0.8),
                            ),
                            style: TextStyle(
                              fontSize: 16,
                              color: Colors.blueGrey.shade800,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          const SizedBox(height: 12),
                          Row(
                            children: [
                              ElevatedButton.icon(
                                onPressed: _handleSave,
                                style:
                                    ElevatedButton.styleFrom(
                                      backgroundColor: Colors.transparent,
                                      foregroundColor: Colors.white,
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 12,
                                        vertical: 8,
                                      ),
                                      elevation: 0,
                                    ).copyWith(
                                      overlayColor: MaterialStateProperty.all(
                                        Colors.white.withOpacity(0.1),
                                      ),
                                    ),
                                icon: Icon(AppIcons.save, size: 12),
                                label: Ink(
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      colors: [
                                        Colors.green.shade400,
                                        Colors.teal.shade500,
                                      ],
                                      begin: Alignment.centerLeft,
                                      end: Alignment.centerRight,
                                    ),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 0,
                                      vertical: 0,
                                    ),
                                    child: const Text(
                                      'Save',
                                      style: TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 8),
                              ElevatedButton.icon(
                                onPressed: _handleCancel,
                                style:
                                    ElevatedButton.styleFrom(
                                      backgroundColor: Colors.transparent,
                                      foregroundColor: Colors.white,
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 12,
                                        vertical: 8,
                                      ),
                                      elevation: 0,
                                    ).copyWith(
                                      overlayColor: MaterialStateProperty.all(
                                        Colors.white.withOpacity(0.1),
                                      ),
                                    ),
                                icon: Icon(AppIcons.close, size: 12),
                                label: Ink(
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      colors: [
                                        Colors.blueGrey.shade400,
                                        Colors.blueGrey.shade500,
                                      ],
                                      begin: Alignment.centerLeft,
                                      end: Alignment.centerRight,
                                    ),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 0,
                                      vertical: 0,
                                    ),
                                    child: const Text(
                                      'Cancel',
                                      style: TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      )
                    : Text(
                        value,
                        style: TextStyle(
                          color: Colors.blueGrey.shade800,
                          fontWeight: FontWeight.w500,
                          fontSize: 16,
                          height: 1.5,
                        ),
                      ),
              ],
            ),
          ),
          if (editable && _editingField != field)
            InkWell(
              onTap: () => _handleEdit(field),
              borderRadius: BorderRadius.circular(99),
              child: Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Colors.blue.shade100, Colors.purple.shade100],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  AppIcons.edit,
                  color: Colors.purple.shade600,
                  size: 16,
                ),
              ),
            ),
        ],
      ),
    );
  }
}
