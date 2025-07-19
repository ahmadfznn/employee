import 'package:flutter/material.dart';
import 'dart:async';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:mobile/attendance.dart';
import 'package:mobile/home.dart';
import 'package:mobile/leave.dart';
import 'package:mobile/payroll.dart';
import 'package:mobile/profile.dart';

final List<Widget> _widgetOptions = <Widget>[
  const Home(),
  const Attendance(),
  const Leave(),
  const Payroll(),
  const Profile(),
];

enum AppPage { home, attendance, leave, payroll, profile }

class Layout extends StatefulWidget {
  const Layout({super.key});

  @override
  State<Layout> createState() => _LayoutState();
}

class _LayoutState extends State<Layout> {
  DateTime _currentTime = DateTime.now();
  late Timer _timer;
  int _selectedIndex = 0;
  late PageController _pageController;

  @override
  void initState() {
    super.initState();
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor:
          Colors.transparent, // Background handled by the container
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFFF8FAFC), Color(0xFFEEF2FF)],
          ),
        ),
        child: Column(
          children: [
            // Header: You can decide where to put your header.
            // If you want it on top of *every* page and fixed, keep it here.
            // If it should scroll with each page's content, put it inside each page's widget.
            // For now, I'll assume you want a fixed header on top of the swipeable pages.
            // However, your provided code comments out the header.
            // If you want to use the header you commented out, uncomment it here:
            // Container(
            //   padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
            //   decoration: BoxDecoration(
            //     color: Colors.white.withOpacity(0.8),
            //     border: Border(bottom: BorderSide(color: Colors.blueGrey[50]!)),
            //     boxShadow: [
            //       BoxShadow(
            //         color: Colors.black.withOpacity(0.05),
            //         blurRadius: 4,
            //         offset: const Offset(0, 2),
            //       ),
            //     ],
            //   ),
            //   child: SafeArea(
            //     child: Row(
            //       mainAxisAlignment: MainAxisAlignment.spaceBetween,
            //       children: [
            //         Column(
            //           crossAxisAlignment: CrossAxisAlignment.start,
            //           children: [
            //             const Text(
            //               'Attendance', // This would need to be dynamic based on current page
            //               style: TextStyle(
            //                 fontSize: 20,
            //                 fontWeight: FontWeight.bold,
            //                 color: Color(0xFF1E293B),
            //               ),
            //             ),
            //             Text(
            //               _currentTime.toLocaleDateString('en-US',
            //                   weekday: 'long', month: 'long', day: 'numeric'),
            //               style: TextStyle(
            //                 fontSize: 13,
            //                 color: Colors.blueGrey[500],
            //                 fontWeight: FontWeight.w500,
            //               ),
            //             ),
            //           ],
            //         ),
            //         Column(
            //           crossAxisAlignment: CrossAxisAlignment.end,
            //           children: [
            //             Text(
            //               _currentTime.toLocaleTimeString('en-US', hour: '2-digit', minute: '2-digit'),
            //               style: TextStyle(
            //                 fontSize: 24,
            //                 fontFamily: 'monospace',
            //                 fontWeight: FontWeight.bold,
            //                 color: Colors.blueGrey[700],
            //               ),
            //             ),
            //             Row(
            //               children: [
            //                 Icon(Icons.location_on, size: 12, color: Colors.blueGrey[500]),
            //                 const SizedBox(width: 4),
            //                 Text(
            //                   'Office Building A', // This would also need to be dynamic
            //                   style: TextStyle(
            //                     fontSize: 12,
            //                     color: Colors.blueGrey[500],
            //                     fontWeight: FontWeight.w500,
            //                   ),
            //                 ),
            //               ],
            //             ),
            //           ],
            //         ),
            //       ],
            //     ),
            //   ),
            // ),
            Expanded(
              child: PageView(
                controller: _pageController,
                onPageChanged:
                    _onPageChanged, // Listen for page changes via swipe
                children: _widgetOptions, // Your list of pages
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: _buildBottomNavBar(context),
    );
  }

  Widget _buildBottomNavBar(BuildContext context) {
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
    int index, // New parameter to pass the index of the item
  ) {
    final bool isActive = _selectedIndex == index;

    return Expanded(
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () {
            // Call _onItemTapped which will update _selectedIndex and animate PageView
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
    String dateStr = '';
    if (weekday == 'long') {
      dateStr += '${_getWeekday(this.weekday)}, ';
    }
    if (month == 'long') {
      dateStr += '${_getMonth(this.month)} ';
    } else if (month == 'short') {
      dateStr += '${_getMonth(this.month, short: true)} ';
    }
    if (day == 'numeric') {
      dateStr += this.day.toString();
    }
    return dateStr.trim();
  }

  String toLocaleTimeString(String locale, {String? hour, String? minute}) {
    String period = this.hour < 12 ? 'AM' : 'PM';
    int displayHour = this.hour % 12;
    if (displayHour == 0) displayHour = 12;

    String minuteStr = this.minute.toString().padLeft(2, '0');

    if (hour == '2-digit' && minute == '2-digit') {
      return '$displayHour:$minuteStr $period';
    }
    return '${this.hour.toString().padLeft(2, '0')}:$minuteStr';
  }

  String _getWeekday(int day) {
    switch (day) {
      case 1:
        return 'Monday';
      case 2:
        return 'Tuesday';
      case 3:
        return 'Wednesday';
      case 4:
        return 'Thursday';
      case 5:
        return 'Friday';
      case 6:
        return 'Saturday';
      case 7:
        return 'Sunday';
      default:
        return '';
    }
  }

  String _getMonth(int month, {bool short = false}) {
    const List<String> longMonths = [
      '',
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const List<String> shortMonths = [
      '',
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return short ? shortMonths[month] : longMonths[month];
  }
}
