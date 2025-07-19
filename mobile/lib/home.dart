import 'package:flutter/material.dart';
import 'dart:async';
import 'package:intl/intl.dart';

class Home extends StatefulWidget {
  const Home({super.key});

  @override
  // ignore: library_private_types_in_public_api
  _HomeState createState() => _HomeState();
}

class _HomeState extends State<Home> {
  late Timer _timeTimer;
  late Timer _announcementTimer;
  DateTime currentTime = DateTime.now();
  int announcementIndex = 0;

  final List<Map<String, String>> announcements = [
    {
      'icon': '🎉',
      'text': 'Team building event this Friday at 3 PM - Conference Room A',
    },
    {
      'icon': '💼',
      'text': 'Q3 performance reviews start next Monday - Check your calendar',
    },
    {
      'icon': '🏖️',
      'text': 'Summer vacation policy updates available in HR portal',
    },
    {
      'icon': '📚',
      'text': 'New training modules released - Complete by month end',
    },
  ];

  final List<Map<String, dynamic>> quickActions = [
    {'icon': Icons.access_time, 'label': 'Clock In/Out', 'color': Colors.green},
    {
      'icon': Icons.calendar_today,
      'label': 'Request Leave',
      'color': Colors.blue,
    },
    {
      'icon': Icons.attach_money,
      'label': 'View Payslip',
      'color': Colors.purple,
    },
    {
      'icon': Icons.notifications,
      'label': 'Notifications',
      'color': Colors.orange,
    },
  ];

  @override
  void initState() {
    super.initState();
    _timeTimer = Timer.periodic(Duration(seconds: 1), (timer) {
      setState(() {
        currentTime = DateTime.now();
      });
    });

    _announcementTimer = Timer.periodic(Duration(seconds: 4), (timer) {
      setState(() {
        announcementIndex = (announcementIndex + 1) % announcements.length;
      });
    });
  }

  @override
  void dispose() {
    _timeTimer.cancel();
    _announcementTimer.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Color(0xFFF8FAFC), // slate-50
              Color(0xFFEBF8FF), // blue-50
            ],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              // Header
              Container(
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.8),
                  border: Border(
                    bottom: BorderSide(
                      color: Color(0xFFE2E8F0).withOpacity(0.5),
                      width: 1,
                    ),
                  ),
                ),
                child: Padding(
                  padding: EdgeInsets.all(24),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // Profile section
                      Row(
                        children: [
                          Stack(
                            children: [
                              CircleAvatar(
                                radius: 24,
                                backgroundImage: NetworkImage(
                                  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
                                ),
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
                                    border: Border.all(
                                      color: Colors.white,
                                      width: 2,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                          SizedBox(width: 16),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Good Morning, Alex! 👋',
                                style: TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF1E293B),
                                ),
                              ),
                              Text(
                                DateFormat('EEEE, MMMM d').format(currentTime),
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w500,
                                  color: Color(0xFF64748B),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                      // Time section
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text(
                            DateFormat('HH:mm').format(currentTime),
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              fontFamily: 'monospace',
                              color: Color(0xFF374151),
                            ),
                          ),
                          Row(
                            children: [
                              Icon(
                                Icons.location_on,
                                size: 12,
                                color: Colors.green[600],
                              ),
                              SizedBox(width: 4),
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
                    ],
                  ),
                ),
              ),
              // Main Content
              Expanded(
                child: SingleChildScrollView(
                  padding: EdgeInsets.all(24),
                  child: Column(
                    children: [
                      // Attendance Status Card
                      Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [Colors.green[500]!, Colors.teal[600]!],
                          ),
                          borderRadius: BorderRadius.circular(16),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.1),
                              blurRadius: 10,
                              offset: Offset(0, 4),
                            ),
                          ],
                        ),
                        child: Padding(
                          padding: EdgeInsets.all(24),
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
                                    child: Icon(
                                      Icons.access_time,
                                      size: 28,
                                      color: Colors.white,
                                    ),
                                  ),
                                  SizedBox(width: 16),
                                  Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        "You're checked in!",
                                        style: TextStyle(
                                          fontSize: 18,
                                          fontWeight: FontWeight.w600,
                                          color: Colors.white,
                                        ),
                                      ),
                                      Text(
                                        'Started at 9:15 AM • 3h 45m working',
                                        style: TextStyle(
                                          fontSize: 14,
                                          color: Colors.green[100],
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                              Icon(
                                Icons.coffee,
                                size: 32,
                                color: Colors.green[200],
                              ),
                            ],
                          ),
                        ),
                      ),
                      SizedBox(height: 24),

                      // Announcement Banner
                      Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Color(0xFFF1F5F9)),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.05),
                              blurRadius: 10,
                              offset: Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Padding(
                          padding: EdgeInsets.all(16),
                          child: Column(
                            children: [
                              Row(
                                children: [
                                  Text(
                                    announcements[announcementIndex]['icon']!,
                                    style: TextStyle(fontSize: 24),
                                  ),
                                  SizedBox(width: 12),
                                  Expanded(
                                    child: Text(
                                      announcements[announcementIndex]['text']!,
                                      style: TextStyle(
                                        fontSize: 14,
                                        fontWeight: FontWeight.w500,
                                        color: Color(0xFF374151),
                                      ),
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                  Icon(
                                    Icons.chevron_right,
                                    size: 16,
                                    color: Color(0xFF9CA3AF),
                                  ),
                                ],
                              ),
                              SizedBox(height: 12),
                              Row(
                                children: announcements.asMap().entries.map((
                                  entry,
                                ) {
                                  return Container(
                                    width: entry.key == announcementIndex
                                        ? 24
                                        : 4,
                                    height: 4,
                                    margin: EdgeInsets.only(right: 4),
                                    decoration: BoxDecoration(
                                      color: entry.key == announcementIndex
                                          ? Colors.blue[500]
                                          : Color(0xFFE2E8F0),
                                      borderRadius: BorderRadius.circular(2),
                                    ),
                                  );
                                }).toList(),
                              ),
                            ],
                          ),
                        ),
                      ),
                      SizedBox(height: 24),

                      // Quick Stats
                      Row(
                        children: [
                          Expanded(
                            child: Container(
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: Color(0xFFF1F5F9)),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.05),
                                    blurRadius: 10,
                                    offset: Offset(0, 2),
                                  ),
                                ],
                              ),
                              child: Padding(
                                padding: EdgeInsets.all(20),
                                child: Row(
                                  children: [
                                    Container(
                                      width: 40,
                                      height: 40,
                                      decoration: BoxDecoration(
                                        color: Colors.blue[100],
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Icon(
                                        Icons.calendar_today,
                                        size: 20,
                                        color: Colors.blue[600],
                                      ),
                                    ),
                                    SizedBox(width: 12),
                                    Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          '18',
                                          style: TextStyle(
                                            fontSize: 24,
                                            fontWeight: FontWeight.bold,
                                            color: Color(0xFF1E293B),
                                          ),
                                        ),
                                        Text(
                                          'Leave days left',
                                          style: TextStyle(
                                            fontSize: 12,
                                            color: Color(0xFF64748B),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                          SizedBox(width: 16),
                          Expanded(
                            child: Container(
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: Color(0xFFF1F5F9)),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.05),
                                    blurRadius: 10,
                                    offset: Offset(0, 2),
                                  ),
                                ],
                              ),
                              child: Padding(
                                padding: EdgeInsets.all(20),
                                child: Row(
                                  children: [
                                    Container(
                                      width: 40,
                                      height: 40,
                                      decoration: BoxDecoration(
                                        color: Colors.green[100],
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Icon(
                                        Icons.attach_money,
                                        size: 20,
                                        color: Colors.green[600],
                                      ),
                                    ),
                                    SizedBox(width: 12),
                                    Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          '\$4,250',
                                          style: TextStyle(
                                            fontSize: 18,
                                            fontWeight: FontWeight.bold,
                                            color: Color(0xFF1E293B),
                                          ),
                                        ),
                                        Text(
                                          'Last salary',
                                          style: TextStyle(
                                            fontSize: 12,
                                            color: Color(0xFF64748B),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                      SizedBox(height: 24),

                      // Quick Actions
                      Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Color(0xFFF1F5F9)),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.05),
                              blurRadius: 10,
                              offset: Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Padding(
                          padding: EdgeInsets.all(20),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Quick Actions',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w600,
                                  color: Color(0xFF1E293B),
                                ),
                              ),
                              SizedBox(height: 16),
                              GridView.count(
                                shrinkWrap: true,
                                physics: NeverScrollableScrollPhysics(),
                                crossAxisCount: 2,
                                crossAxisSpacing: 12,
                                mainAxisSpacing: 12,
                                childAspectRatio: 3,
                                children: quickActions.map((action) {
                                  return InkWell(
                                    onTap: () {},
                                    borderRadius: BorderRadius.circular(12),
                                    child: Container(
                                      decoration: BoxDecoration(
                                        border: Border.all(
                                          color: Color(0xFFF1F5F9),
                                        ),
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      child: Padding(
                                        padding: EdgeInsets.all(16),
                                        child: Row(
                                          children: [
                                            Container(
                                              width: 40,
                                              height: 40,
                                              decoration: BoxDecoration(
                                                color: action['color'],
                                                borderRadius:
                                                    BorderRadius.circular(8),
                                              ),
                                              child: Icon(
                                                action['icon'],
                                                size: 20,
                                                color: Colors.white,
                                              ),
                                            ),
                                            SizedBox(width: 12),
                                            Expanded(
                                              child: Text(
                                                action['label'],
                                                style: TextStyle(
                                                  fontSize: 14,
                                                  fontWeight: FontWeight.w500,
                                                  color: Color(0xFF374151),
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ),
                                  );
                                }).toList(),
                              ),
                            ],
                          ),
                        ),
                      ),
                      SizedBox(height: 24),

                      // Recent Activity
                      Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Color(0xFFF1F5F9)),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.05),
                              blurRadius: 10,
                              offset: Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Padding(
                          padding: EdgeInsets.all(20),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Recent Activity',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w600,
                                  color: Color(0xFF1E293B),
                                ),
                              ),
                              SizedBox(height: 16),
                              Column(
                                children: [
                                  _buildActivityItem(
                                    '🏢',
                                    'Checked in',
                                    '9:15 AM',
                                  ),
                                  SizedBox(height: 12),
                                  _buildActivityItem(
                                    '✅',
                                    'Leave request approved',
                                    'Yesterday',
                                  ),
                                  SizedBox(height: 12),
                                  _buildActivityItem(
                                    '💰',
                                    'Payslip generated',
                                    '2 days ago',
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                      SizedBox(height: 100), // Bottom padding for navigation
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
      // bottomNavigationBar: Container(
      //   decoration: BoxDecoration(
      //     color: Colors.white.withOpacity(0.95),
      //     border: Border(top: BorderSide(color: Color(0xFFE2E8F0), width: 1)),
      //   ),
      //   child: Padding(
      //     padding: EdgeInsets.symmetric(vertical: 12),
      //     child: Row(
      //       mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      //       children: [
      //         _buildNavItem(Icons.home, 'Home', true),
      //         _buildNavItem(Icons.access_time, 'Attendance', false),
      //         _buildNavItem(Icons.calendar_today, 'Leave', false),
      //         _buildNavItem(Icons.attach_money, 'Payroll', false),
      //         _buildNavItem(Icons.person, 'Profile', false),
      //       ],
      //     ),
      //   ),
      // ),
    );
  }

  Widget _buildActivityItem(String icon, String action, String time) {
    return Container(
      decoration: BoxDecoration(
        color: Color(0xFFF8FAFC),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Padding(
        padding: EdgeInsets.all(12),
        child: Row(
          children: [
            Text(icon, style: TextStyle(fontSize: 18)),
            SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    action,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      color: Color(0xFF374151),
                    ),
                  ),
                  Text(
                    time,
                    style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNavItem(IconData icon, String label, bool active) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(
          icon,
          size: 20,
          color: active ? Colors.blue[600] : Color(0xFF94A3B8),
        ),
        SizedBox(height: 4),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w500,
            color: active ? Colors.blue[600] : Color(0xFF64748B),
          ),
        ),
        if (active)
          Container(
            width: 16,
            height: 2,
            margin: EdgeInsets.only(top: 4),
            decoration: BoxDecoration(
              color: Colors.blue[600],
              borderRadius: BorderRadius.circular(1),
            ),
          ),
      ],
    );
  }
}
