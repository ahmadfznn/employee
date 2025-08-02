import 'package:flutter/material.dart';
import 'dart:async';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:mobile/attendance.dart';
import 'package:mobile/home.dart';
import 'package:mobile/leave.dart';
import 'package:mobile/payroll.dart';
import 'package:mobile/profile.dart';
import 'package:intl/intl.dart';
import 'package:mobile/service/auth_service.dart';
import 'package:mobile/setting.dart';

final List<Widget> _widgetOptions = <Widget>[
  const Home(),
  const Attendance(),
  const Leave(),
  const Payroll(),
  const Profile(),
];

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

enum AppPage { home, attendance, leave, payroll, profile }

class Layout extends StatefulWidget {
  const Layout({super.key});

  @override
  State<Layout> createState() => _LayoutState();
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

class _LayoutState extends State<Layout> {
  DateTime _currentTime = DateTime.now();
  late Timer _timer;
  int _selectedIndex = 0;
  late PageController _pageController;
  String? _userName;
  bool _isLoading = true;
  final AuthService _authService = AuthService();

  final Map<String, dynamic> _profileData = {
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

  @override
  void initState() {
    super.initState();
    _loadUserName();
    _loadUserData();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      setState(() {
        _currentTime = DateTime.now();
      });
    });
    _pageController = PageController(initialPage: _selectedIndex);
  }

  @override
  void dispose() {
    _timer.cancel();
    _pageController.dispose();
    super.dispose();
  }

  Future<void> _loadUserName() async {
    try {
      final userData = await _authService.getUserData();
      if (mounted) {
        setState(() {
          _userName = userData?['name'];
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isLoading = false;
          _userName = 'Error loading name';
        });
        print('Error loading user name: $e');
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Failed to load user name: $e')));
      }
    }
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

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
    _pageController.animateToPage(
      index,
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeOut,
    );
    print('Navigating to index $index via Bottom Navigation');
  }

  void _onPageChanged(int index) {
    setState(() {
      _selectedIndex = index;
    });
    print('Page changed to index $index via swipe');
  }

  // --- Fungsi untuk membangun AppBar dinamis ---
  PreferredSizeWidget _buildDynamicAppBar() {
    switch (_selectedIndex) {
      case 0: // Home Page
        return _buildHomeAppBar();
      case 1: // Attendance Page
        return _buildAttendanceAppBar();
      case 2: // Leave Page
        return _buildLeaveAppBar();
      case 3: // Payroll Page
        return _buildPayrollAppBar();
      case 4: // Profile Page
        return _buildProfileAppBar();
      default:
        return AppBar(title: const Text('App')); // Fallback
    }
  }

  PreferredSizeWidget _buildHomeAppBar() {
    return AppBar(
      backgroundColor: Colors.white.withOpacity(0.8),
      elevation: 0,
      scrolledUnderElevation: 0, // No shadow when scrolled
      titleSpacing: 0, // Remove default title padding
      toolbarHeight: 90, // Sesuaikan tinggi AppBar
      flexibleSpace: Container(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.8),
          border: Border(
            bottom: BorderSide(
              color: const Color(0xFFE2E8F0).withOpacity(0.5),
              width: 1,
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
        child: SafeArea(
          // Penting untuk menghindari notch/status bar
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Row(
                  children: [
                    Stack(
                      children: [
                        const CircleAvatar(
                          radius: 24,
                          backgroundImage: AssetImage('assets/img/ahmad.png'),
                        ),
                        Positioned(
                          bottom: -2,
                          right: -2,
                          child: Container(
                            width: 20,
                            height: 20,
                            decoration: BoxDecoration(
                              color: Colors.green[500],
                              shape: BoxShape.circle,
                              border: Border.all(color: Colors.white, width: 2),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(width: 16),
                    Flexible(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Good Morning, $_userName 👋',
                            style: const TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF1E293B),
                            ),
                            overflow: TextOverflow.ellipsis,
                            maxLines: 1,
                          ),
                          Text(
                            DateFormat('EEEE, MMMM d').format(_currentTime),
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                              color: Color(0xFF64748B),
                            ),
                            overflow: TextOverflow.ellipsis,
                            maxLines: 1,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              Flexible(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      DateFormat('HH:mm').format(_currentTime),
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        fontFamily: 'monospace',
                        color: Color(0xFF374151),
                      ),
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.end, // Align to end
                      children: [
                        Icon(
                          Icons.location_on,
                          size: 12,
                          color: Colors.green[600],
                        ),
                        const SizedBox(width: 4),
                        Text(
                          'Checked In',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                            color: Colors.green[600],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  PreferredSizeWidget _buildAttendanceAppBar() {
    return AppBar(
      backgroundColor: Colors.white.withOpacity(0.8),
      elevation: 0,
      scrolledUnderElevation: 0,
      titleSpacing: 0,
      toolbarHeight: 90,
      flexibleSpace: Container(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.8),
          border: Border(bottom: BorderSide(color: Colors.blueGrey[50]!)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 4,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: SafeArea(
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Attendance', // Judul halaman Attendance
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF1E293B),
                    ),
                  ),
                  Text(
                    DateFormat('EEEE, MMMM d').format(_currentTime),
                    style: TextStyle(
                      fontSize: 13,
                      color: Colors.blueGrey[500],
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    DateFormat('HH:mm').format(_currentTime),
                    style: TextStyle(
                      fontSize: 24,
                      fontFamily: 'monospace',
                      fontWeight: FontWeight.bold,
                      color: Colors.blueGrey[700],
                    ),
                  ),
                  Row(
                    children: [
                      Icon(
                        Icons.location_on,
                        size: 12,
                        color: Colors.blueGrey[500],
                      ),
                      const SizedBox(width: 4),
                      Text(
                        'Office Building A', // Lokasi default
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.blueGrey[500],
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  PreferredSizeWidget _buildLeaveAppBar() {
    return AppBar(
      backgroundColor: Colors.white.withOpacity(0.8),
      elevation: 0,
      scrolledUnderElevation: 0,
      titleSpacing: 0,
      toolbarHeight: 90, // Sesuaikan tinggi
      flexibleSpace: Container(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.8),
          border: Border(
            bottom: BorderSide(color: Colors.blueGrey[200]!.withOpacity(0.5)),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 4,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: SafeArea(
          bottom: false,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Leave Request',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF1E293B), // slate-800
                    ),
                  ),
                  Text(
                    'Submit and manage your leave applications',
                    style: TextStyle(
                      fontSize: 13,
                      color: const Color(0xFF64748B), // slate-500
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  const Text(
                    '18 days', // TODO: Ganti dengan data sisa cuti dari API
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF059669), // emerald-600
                    ),
                  ),
                  Text(
                    'Available',
                    style: TextStyle(fontSize: 12, color: Colors.blueGrey[500]),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  PreferredSizeWidget _buildPayrollAppBar() {
    return PreferredSize(
      preferredSize: const Size.fromHeight(90),
      child: AppBar(
        backgroundColor: Colors.white.withOpacity(0.8),
        elevation: 0,
        scrolledUnderElevation: 0,
        titleSpacing: 0,
        toolbarHeight: 90,
        automaticallyImplyLeading: false,

        flexibleSpace: Container(
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
          child: SafeArea(
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Expanded(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Payroll History 💰',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Colors.blueGrey.shade800,
                        ),
                        overflow: TextOverflow.ellipsis,
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
                ),

                Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      DateFormat.jm().format(_currentTime),
                      style: TextStyle(
                        fontSize: 18,
                        fontFamily: 'RobotoMono',
                        fontWeight: FontWeight.bold,
                        color: Colors.blueGrey.shade700,
                      ),
                    ),
                    Text(
                      'YTD: \$31,280',
                      style: TextStyle(
                        fontSize: 13,
                        color: Colors.green.shade600,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  PreferredSizeWidget _buildProfileAppBar() {
    return PreferredSize(
      preferredSize: const Size.fromHeight(90),
      child: AppBar(
        backgroundColor: Colors.white.withOpacity(0.8),
        elevation: 0,
        scrolledUnderElevation: 0,
        titleSpacing: 0,
        toolbarHeight: 90,
        automaticallyImplyLeading: false,

        flexibleSpace: Container(
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
          child: SafeArea(
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Expanded(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'My Profile 👤',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Colors.blueGrey.shade800,
                        ),
                        overflow: TextOverflow.ellipsis,
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
                ),

                Align(
                  alignment: Alignment.centerRight,
                  child: InkWell(
                    onTap: () {
                      Navigator.push(context, _goPage(const Settings()));
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
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: _buildDynamicAppBar(),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFFF8FAFC), Color(0xFFEEF2FF)],
          ),
        ),
        child: PageView(
          controller: _pageController,
          onPageChanged: _onPageChanged,
          children: _widgetOptions,
        ),
      ),
      bottomNavigationBar: _buildBottomNavBar(context),
    );
  }

  Widget _buildBottomNavBar(BuildContext context) {
    // ... (kode Bottom Navigation Bar tetap sama) ...
    return Container(
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.95),
        border: Border(top: BorderSide(color: Colors.blueGrey[200]!)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 4,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            _buildNavItem(context, Icons.home, 'Home', 0),
            _buildNavItem(context, Icons.access_time, 'Attendance', 1),
            _buildNavItem(context, Icons.calendar_today, 'Leave', 2),
            _buildNavItem(context, FontAwesomeIcons.dollarSign, 'Payroll', 3),
            _buildNavItem(context, Icons.person, 'Profile', 4),
          ],
        ),
      ),
    );
  }

  Widget _buildNavItem(
    BuildContext context,
    IconData icon,
    String label,
    int index,
  ) {
    final bool isActive = _selectedIndex == index;

    return Expanded(
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () {
            _onItemTapped(index);
          },
          splashColor: Colors.blue[100],
          borderRadius: BorderRadius.circular(8),
          child: Padding(
            padding: const EdgeInsets.symmetric(
              vertical: 8.0,
              horizontal: 12.0,
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  icon,
                  size: 20,
                  color: isActive ? Colors.blue[600] : Colors.blueGrey[400],
                ),
                const SizedBox(height: 4),
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w500,
                    color: isActive ? Colors.blue[600] : Colors.blueGrey[500],
                  ),
                ),
                if (isActive)
                  Container(
                    width: 16,
                    height: 2,
                    margin: const EdgeInsets.only(top: 4),
                    decoration: BoxDecoration(
                      color: Colors.blue[600],
                      borderRadius: BorderRadius.circular(1),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// Extension DateTime is fine as is
extension DateTimeExtension on DateTime {
  String toLocaleDateString(
    String locale, {
    String? weekday,
    String? month,
    String? day,
  }) {
    String formatPattern = '';
    if (weekday != null && weekday == 'long') formatPattern += 'EEEE, ';
    if (month != null && month == 'long')
      formatPattern += 'MMMM ';
    else if (month != null && month == 'short')
      formatPattern += 'MMM ';
    if (day != null && day == 'numeric') formatPattern += 'd';
    return DateFormat(formatPattern.trim(), locale).format(this);
  }

  String toLocaleTimeString(String locale, {String? hour, String? minute}) {
    String formatPattern = '';
    if (hour != null && minute != null)
      formatPattern += 'h:mm a';
    else if (hour != null)
      formatPattern += 'h a'; // fallback jika cuma hour
    return DateFormat(formatPattern.trim(), locale).format(this);
  }
}
