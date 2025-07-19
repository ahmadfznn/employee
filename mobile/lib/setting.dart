import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'dart:async';

class AppIcons {
  static const IconData arrowLeft = Icons.arrow_back_rounded;
  static const IconData user = Icons.person_rounded;
  static const IconData lock = Icons.lock_rounded;
  static const IconData moon = Icons.dark_mode_rounded;
  static const IconData sun = Icons.light_mode_rounded;
  static const IconData globe = Icons.language_rounded;
  static const IconData info = Icons.info_outline_rounded;
  static const IconData chevronRight = Icons.chevron_right_rounded;
  static const IconData settings = Icons.settings_rounded;
}

class Settings extends StatefulWidget {
  const Settings({super.key});

  @override
  State<Settings> createState() => _SettingsState();
}

class _SettingsState extends State<Settings> {
  DateTime _currentTime = DateTime.now();
  bool _darkMode = false;
  final String _selectedLanguage = 'English';

  late Timer _timer;

  @override
  void initState() {
    super.initState();
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

  void _toggleDarkMode() {
    setState(() {
      _darkMode = !_darkMode;
    });
  }

  // Helper widget for the custom toggle switch
  Widget _buildToggleSwitch({
    required bool enabled,
    required VoidCallback onToggle,
  }) {
    return GestureDetector(
      onTap: onToggle,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        curve: Curves.easeInOut,
        width: 44, // w-11 * 4 (Tailwind default rem to px)
        height: 24, // h-6 * 4
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(99), // rounded-full
          gradient: enabled
              ? const LinearGradient(
                  colors: [
                    Color(0xFF3B82F6),
                    Color(0xFF8B5CF6),
                  ], // from-blue-500 to-purple-500
                  begin: Alignment.centerLeft,
                  end: Alignment.centerRight,
                )
              : const LinearGradient(
                  colors: [Color(0xFFCBD5E1), Color(0xFF94A3B8)], // slate-300
                  begin: Alignment.centerLeft,
                  end: Alignment.centerRight,
                ),
        ),
        alignment: enabled ? Alignment.centerRight : Alignment.centerLeft,
        padding: const EdgeInsets.all(4), // For the inner circle padding
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          curve: Curves.easeInOut,
          width: 16, // w-4 * 4
          height: 16, // h-4 * 4
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: Colors.white,
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.2), // shadow-lg
                blurRadius: 4,
                offset: const Offset(0, 2),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    // Define settings groups directly in build method or as a class member
    final List<Map<String, dynamic>> settingsGroups = [
      {
        'title': 'Account',
        'items': [
          {
            'icon': AppIcons.user,
            'label': 'Edit Profile',
            'subtitle': 'Update your personal information',
            'type': 'navigate',
            'onTap': () {
              // Handle navigation to Edit Profile screen
              print('Navigate to Edit Profile');
            },
          },
          {
            'icon': AppIcons.lock,
            'label': 'Change Password',
            'subtitle': 'Update your security credentials',
            'type': 'navigate',
            'onTap': () {
              // Handle navigation to Change Password screen
              print('Navigate to Change Password');
            },
          },
        ],
      },
      {
        'title': 'Preferences',
        'items': [
          {
            'icon': _darkMode ? AppIcons.sun : AppIcons.moon,
            'label': 'Dark Mode',
            'subtitle': 'Switch between light and dark theme',
            'type': 'toggle',
            'value': _darkMode,
            'onToggle': _toggleDarkMode,
          },
          {
            'icon': AppIcons.globe,
            'label': 'Language',
            'subtitle': _selectedLanguage,
            'type': 'navigate',
            'onTap': () {
              // Handle navigation to Language selection screen
              print('Navigate to Language selection');
            },
          },
        ],
      },
      {
        'title': 'About',
        'items': [
          {
            'icon': AppIcons.info,
            'label': 'App Version',
            'subtitle': '2.1.4 (Build 1024)',
            'type': 'info',
          },
        ],
      },
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC), // slate-50
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
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              child: Row(
                children: [
                  InkWell(
                    onTap: () {
                      Navigator.pop(context); // Go back to the previous screen
                    },
                    borderRadius: BorderRadius.circular(99),
                    child: Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: Colors.blueGrey.shade100, // slate-100
                        borderRadius: BorderRadius.circular(99), // rounded-full
                      ),
                      child: Icon(
                        AppIcons.arrowLeft,
                        color: Colors.blueGrey.shade600,
                        size: 20,
                      ), // slate-600
                    ),
                  ),
                  const SizedBox(width: 16),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Settings ⚙️',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Colors.blueGrey.shade800, // slate-800
                        ),
                      ),
                      Text(
                        'Manage your preferences',
                        style: TextStyle(
                          fontSize: 13,
                          color: Colors.blueGrey.shade500, // slate-500
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            // Main Content
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Profile Header Card
                    Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            Colors.blue.shade500, // from-blue-500
                            Colors.purple.shade600, // to-purple-600
                          ],
                          begin: Alignment.centerLeft,
                          end: Alignment.centerRight,
                        ),
                        borderRadius: BorderRadius.circular(16), // rounded-2xl
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.1),
                            blurRadius: 8,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      padding: const EdgeInsets.all(24), // p-6
                      child: Row(
                        children: [
                          Stack(
                            children: [
                              Container(
                                width: 64, // w-16
                                height: 64, // h-16
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  border: Border.all(
                                    color: Colors.white.withOpacity(0.3),
                                    width: 3,
                                  ),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.black.withOpacity(0.1),
                                      blurRadius: 8,
                                      offset: const Offset(0, 4),
                                    ),
                                  ],
                                  image: const DecorationImage(
                                    image: NetworkImage(
                                      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
                                    ),
                                    fit: BoxFit.cover,
                                  ),
                                ),
                              ),
                              Positioned(
                                bottom: -4, // -bottom-1
                                right: -4, // -right-1
                                child: Container(
                                  width: 24, // w-6
                                  height: 24, // h-6
                                  decoration: BoxDecoration(
                                    color:
                                        Colors.green.shade400, // bg-green-400
                                    shape: BoxShape.circle,
                                    border: Border.all(
                                      color: Colors.white,
                                      width: 3,
                                    ), // border-3 border-white
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(width: 16), // space-x-4
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Alex Johnson',
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                                ),
                                Text(
                                  'alex.johnson@company.com',
                                  style: TextStyle(
                                    fontSize: 13,
                                    color: Colors.blue.shade100, // blue-100
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Row(
                                  children: [
                                    Container(
                                      width: 8,
                                      height: 8,
                                      decoration: BoxDecoration(
                                        color: Colors
                                            .green
                                            .shade400, // bg-green-400
                                        shape: BoxShape.circle,
                                      ),
                                    ),
                                    const SizedBox(width: 8), // mr-2
                                    Text(
                                      'Active now',
                                      style: TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.w500,
                                        color: Colors.blue.shade100, // blue-100
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
                    const SizedBox(height: 24), // space-y-6
                    // Settings Groups
                    ...settingsGroups.map((group) {
                      return Padding(
                        padding: const EdgeInsets.only(
                          bottom: 24.0,
                        ), // space-y-6 between groups
                        child: Container(
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(
                              16,
                            ), // rounded-2xl
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
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 20,
                                  vertical: 12,
                                ), // px-5 py-3
                                decoration: BoxDecoration(
                                  color: Colors.blueGrey.shade50!.withOpacity(
                                    0.5,
                                  ), // bg-slate-50/50
                                  border: Border(
                                    bottom: BorderSide(
                                      color: Colors.blueGrey.shade100,
                                    ),
                                  ), // border-b border-slate-100
                                ),
                                child: Text(
                                  group['title'].toUpperCase(),
                                  style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w600,
                                    color:
                                        Colors.blueGrey.shade600, // slate-600
                                    letterSpacing: 1.2, // tracking-wider
                                  ),
                                ),
                              ),
                              ListView.separated(
                                shrinkWrap: true,
                                physics:
                                    const NeverScrollableScrollPhysics(), // Disable internal scrolling
                                itemCount: group['items'].length,
                                separatorBuilder: (context, index) => Divider(
                                  height: 1,
                                  color: Colors.blueGrey.shade100,
                                ), // divide-y divide-slate-100
                                itemBuilder: (context, index) {
                                  final item = group['items'][index];
                                  return InkWell(
                                    onTap:
                                        item['type'] == 'navigate' ||
                                            item['type'] == 'toggle'
                                        ? item['onToggle'] ?? item['onTap']
                                        : null,
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 20,
                                        vertical: 16,
                                      ), // px-5 py-4
                                      color: item['type'] == 'navigate'
                                          ? Colors
                                                .transparent // hover:bg-slate-50 handled by InkWell splash
                                          : Colors.transparent,
                                      child: Row(
                                        children: [
                                          Container(
                                            width: 40,
                                            height: 40,
                                            decoration: BoxDecoration(
                                              gradient: LinearGradient(
                                                colors: [
                                                  Colors
                                                      .blueGrey
                                                      .shade100, // from-slate-100
                                                  Colors
                                                      .blueGrey
                                                      .shade200, // to-slate-200
                                                ],
                                                begin: Alignment.topLeft,
                                                end: Alignment.bottomRight,
                                              ),
                                              borderRadius:
                                                  BorderRadius.circular(
                                                    12,
                                                  ), // rounded-xl
                                            ),
                                            child: Icon(
                                              item['icon'],
                                              color: Colors.blueGrey.shade600,
                                              size: 20,
                                            ), // w-5 h-5 text-slate-600
                                          ),
                                          const SizedBox(
                                            width: 16,
                                          ), // space-x-4
                                          Expanded(
                                            child: Column(
                                              crossAxisAlignment:
                                                  CrossAxisAlignment.start,
                                              children: [
                                                Text(
                                                  item['label'],
                                                  style: TextStyle(
                                                    fontSize: 16, // base
                                                    fontWeight: FontWeight.w500,
                                                    color: Colors
                                                        .blueGrey
                                                        .shade800, // slate-800
                                                  ),
                                                ),
                                                Text(
                                                  item['subtitle'],
                                                  style: TextStyle(
                                                    fontSize: 14, // sm
                                                    color: Colors
                                                        .blueGrey
                                                        .shade500, // slate-500
                                                  ),
                                                  overflow: TextOverflow
                                                      .ellipsis, // truncate
                                                ),
                                              ],
                                            ),
                                          ),
                                          if (item['type'] == 'toggle')
                                            _buildToggleSwitch(
                                              enabled: item['value'],
                                              onToggle: item['onToggle'],
                                            ),
                                          if (item['type'] == 'navigate')
                                            Icon(
                                              AppIcons.chevronRight,
                                              color: Colors.blueGrey.shade400,
                                              size: 20,
                                            ), // w-5 h-5 text-slate-400
                                          if (item['type'] == 'info')
                                            Container(
                                              padding:
                                                  const EdgeInsets.symmetric(
                                                    horizontal: 12,
                                                    vertical: 4,
                                                  ), // px-3 py-1
                                              decoration: BoxDecoration(
                                                color: Colors
                                                    .blueGrey
                                                    .shade100, // bg-slate-100
                                                borderRadius:
                                                    BorderRadius.circular(
                                                      99,
                                                    ), // rounded-full
                                              ),
                                              child: Text(
                                                'Latest',
                                                style: TextStyle(
                                                  fontSize: 12, // xs
                                                  fontWeight: FontWeight.w500,
                                                  color: Colors
                                                      .blueGrey
                                                      .shade600, // slate-600
                                                ),
                                              ),
                                            ),
                                        ],
                                      ),
                                    ),
                                  );
                                },
                              ),
                            ],
                          ),
                        ),
                      );
                    }).toList(),

                    // Footer Info
                    Padding(
                      padding: const EdgeInsets.symmetric(
                        vertical: 16.0,
                      ), // py-4
                      child: Column(
                        children: [
                          Text(
                            'Made with 💙 by the Dev Team',
                            style: TextStyle(
                              fontSize: 12, // xs
                              color: Colors.blueGrey.shade400, // slate-400
                            ),
                          ),
                          const SizedBox(height: 4), // mt-1
                          Text(
                            'Last updated: ${DateFormat.yMMMd().format(DateTime(2025, 7, 19))}',
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.blueGrey.shade400,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(
                      height: 80,
                    ), // Padding for the bottom bar from layout.dart
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
