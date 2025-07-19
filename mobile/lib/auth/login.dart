import 'package:flutter/material.dart';
import 'dart:math' as math;

import 'package:flutter/services.dart';
import 'package:mobile/auth/forgot.dart';
import 'package:mobile/layout.dart';
import 'package:mobile/service/auth_service.dart';

class Login extends StatefulWidget {
  const Login({super.key});

  @override
  State<Login> createState() => _LoginState();
}

Route _goPage(Widget page) {
  return PageRouteBuilder(
    pageBuilder: (context, animation, secondaryAnimation) => page,
    transitionDuration: const Duration(milliseconds: 500),
    reverseTransitionDuration: const Duration(milliseconds: 500),
    opaque: false,
    transitionsBuilder: (context, animation, secondaryAnimation, child) {
      const begin = Offset(1.0, 0.0);
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

class _LoginState extends State<Login> with TickerProviderStateMixin {
  bool _rememberMe = false;
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool _isSigningIn = false;

  late AnimationController _animationController;
  late List<Animation<Offset>> _floatingAnimations;
  late List<Animation<double>> _rotationAnimations;
  final AuthService _authService = AuthService();

  // For parallax effect
  Offset _mousePosition = Offset.zero;

  @override
  void initState() {
    super.initState();

    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 8), // Match CSS animation duration
    )..repeat(reverse: true);

    _floatingAnimations = List.generate(3, (index) {
      return Tween<Offset>(
        begin: Offset.zero,
        end: const Offset(0, -20), // translateY(-20px)
      ).animate(
        CurvedAnimation(
          parent: _animationController,
          curve: Interval(
            (index * 0.2), // Simple staggering for delay
            1.0,
            curve: Curves.easeInOut,
          ),
        ),
      );
    });

    _rotationAnimations = List.generate(3, (index) {
      return Tween<double>(begin: 0, end: math.pi).animate(
        CurvedAnimation(
          parent: _animationController,
          curve: Interval((index * 0.2), 1.0, curve: Curves.easeInOut),
        ),
      );
    });
  }

  @override
  void dispose() {
    _animationController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _handleLogin() async {
    setState(() {
      _isSigningIn = true;
    });

    final email = _emailController.text;
    final password = _passwordController.text;

    try {
      final result = await _authService.login(email, password);

      if (mounted) {
        setState(() {
          _isSigningIn = false;
        });

        if (result['success']) {
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text(result['message'])));
          Navigator.pushReplacement(context, _goPage(Layout()));

          print('Login berhasil: ${result['message']}');
        } else {
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text(result['message'])));
          print('Login gagal: ${result['message']}');
        }
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isSigningIn = false;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('An unexpected error occurred: $e')),
        );
        print('Error tak terduga: $e');
      }
    }
  }

  void _onPointerHover(PointerHoverEvent event) {
    if (mounted) {
      setState(() {
        // Normalize mouse position to a range like -1 to 1 for parallax
        final RenderBox renderBox = context.findRenderObject() as RenderBox;
        final Size size = renderBox.size;
        _mousePosition = Offset(
          (event.localPosition.dx / size.width) * 2 - 1,
          (event.localPosition.dy / size.height) * 2 - 1,
        );
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Listener(
        // For mouse tracking (hover effects)
        onPointerHover: _onPointerHover,
        child: Container(
          // body background: linear-gradient(135deg, #f1f5f9 0%, #e0f2fe 50%, #f0f9ff 100%);
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Color(0xFFF1F5F9), // slate-100
                Color(0xFFE0F2FE), // light blue-100
                Color(0xFFF0F9FF), // blue-50
              ],
            ),
          ),
          child: Stack(
            children: [
              // Floating Shapes
              Positioned.fill(
                child: Stack(
                  children: [
                    _buildFloatingShape(
                      size: 80,
                      top: 0.2,
                      left: 0.1,
                      color: const Color(0xFF3B82F6), // blue-500
                      animation: _floatingAnimations[0],
                      rotation: _rotationAnimations[0],
                      speed: 0.5,
                    ),
                    _buildFloatingShape(
                      size: 120,
                      top: 0.6,
                      right: 0.15,
                      color: const Color(0xFF06B6D4), // cyan-500
                      animation: _floatingAnimations[1],
                      rotation: _rotationAnimations[1],
                      speed: 1.0,
                    ),
                    _buildFloatingShape(
                      size: 60,
                      bottom: 0.3,
                      left: 0.2,
                      color: const Color(0xFF10B981), // emerald-500
                      animation: _floatingAnimations[2],
                      rotation: _rotationAnimations[2],
                      speed: 0.75,
                    ),
                  ],
                ),
              ),
              Center(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(24.0),
                  child: Container(
                    width: math.min(
                      MediaQuery.of(context).size.width * 0.9,
                      380,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.95),
                      borderRadius: BorderRadius.circular(24.0),
                      border: Border.all(
                        color: Colors.white.withOpacity(0.3),
                        width: 1,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.08),
                          blurRadius: 40,
                          offset: const Offset(0, 20),
                        ),
                        BoxShadow(
                          color: Colors.black.withOpacity(0.04),
                          blurRadius: 16,
                          offset: const Offset(0, 8),
                        ),
                        const BoxShadow(
                          color: Colors
                              .white60, // inset 0 1px 0 rgba(255, 255, 255, 0.6)
                          offset: Offset(0, 1),
                        ),
                      ],
                    ),
                    child: ClipRRect(
                      // For the pseudo-element `::before`
                      borderRadius: BorderRadius.circular(24.0),
                      child: Stack(
                        children: [
                          Positioned(
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 1,
                            child: Container(
                              decoration: const BoxDecoration(
                                gradient: LinearGradient(
                                  colors: [
                                    Colors.transparent,
                                    Color(
                                      0x4DBBEEFF,
                                    ), // rgba(59, 130, 246, 0.3)
                                    Colors.transparent,
                                  ],
                                  begin: Alignment.centerLeft,
                                  end: Alignment.centerRight,
                                ),
                              ),
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 32.0,
                              vertical: 48.0,
                            ),
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                // Logo Container
                                Padding(
                                  padding: const EdgeInsets.only(bottom: 32.0),
                                  child: Column(
                                    children: [
                                      Container(
                                        width: 80,
                                        height: 80,
                                        decoration: BoxDecoration(
                                          borderRadius: BorderRadius.circular(
                                            20,
                                          ),
                                          gradient: const LinearGradient(
                                            colors: [
                                              Color(0xFF3B82F6), // blue-500
                                              Color(0xFF06B6D4), // cyan-500
                                              Color(0xFF10B981), // emerald-500
                                            ],
                                            begin: Alignment.topLeft,
                                            end: Alignment.bottomRight,
                                          ),
                                          boxShadow: [
                                            BoxShadow(
                                              color: const Color(
                                                0xFF3B82F6,
                                              ).withOpacity(0.25),
                                              blurRadius: 32,
                                              offset: const Offset(0, 8),
                                            ),
                                            BoxShadow(
                                              color: const Color(
                                                0xFF06B6D4,
                                              ).withOpacity(0.15),
                                              blurRadius: 16,
                                              offset: const Offset(0, 4),
                                            ),
                                          ],
                                        ),
                                        child: Stack(
                                          alignment: Alignment.center,
                                          children: [
                                            // Pseudo-element ::before for glass effect
                                            Container(
                                              margin: const EdgeInsets.all(
                                                2,
                                              ), // inset: 2px
                                              decoration: BoxDecoration(
                                                borderRadius:
                                                    BorderRadius.circular(18),
                                                gradient: LinearGradient(
                                                  colors: [
                                                    Colors.white.withOpacity(
                                                      0.4,
                                                    ),
                                                    Colors.white.withOpacity(
                                                      0.1,
                                                    ),
                                                  ],
                                                  begin: Alignment.topLeft,
                                                  end: Alignment.bottomRight,
                                                ),
                                              ),
                                            ),
                                            Text(
                                              'NX',
                                              style: TextStyle(
                                                fontSize: 28,
                                                fontWeight: FontWeight.w700,
                                                color: Colors.white,
                                                shadows: [
                                                  BoxShadow(
                                                    color: Colors.black
                                                        .withOpacity(0.2),
                                                    blurRadius: 4,
                                                    offset: const Offset(0, 2),
                                                  ),
                                                ],
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                      const SizedBox(height: 20),
                                    ],
                                  ),
                                ),

                                // Welcome Text
                                Padding(
                                  padding: const EdgeInsets.only(bottom: 40.0),
                                  child: Column(
                                    children: [
                                      ShaderMask(
                                        shaderCallback: (bounds) {
                                          return const LinearGradient(
                                            colors: [
                                              Color(0xFF1E293B), // slate-900
                                              Color(0xFF3B82F6), // blue-500
                                            ],
                                            begin: Alignment.topLeft,
                                            end: Alignment.bottomRight,
                                          ).createShader(bounds);
                                        },
                                        child: const Text(
                                          'Welcome Back! 👋',
                                          textAlign: TextAlign.center,
                                          style: TextStyle(
                                            fontSize: 28,
                                            fontWeight: FontWeight.w700,
                                            color: Colors
                                                .white, // This color is masked by the shader
                                          ),
                                        ),
                                      ),
                                      const SizedBox(height: 8),
                                      const Text(
                                        'Sign in to continue to your workspace',
                                        textAlign: TextAlign.center,
                                        style: TextStyle(
                                          fontSize: 16,
                                          color: Color(0xFF64748B), // slate-600
                                          fontWeight: FontWeight.w400,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),

                                // Email Input
                                _buildInputField(
                                  controller: _emailController,
                                  hintText: '✉️ Enter your email address',
                                  keyboardType: TextInputType.emailAddress,
                                ),
                                const SizedBox(height: 24),

                                // Password Input
                                _buildInputField(
                                  controller: _passwordController,
                                  hintText: '🔒 Enter your password',
                                  obscureText: true,
                                ),
                                const SizedBox(height: 32),

                                // Remember Me & Forgot Password
                                Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: [
                                    Row(
                                      children: [
                                        _buildToggleSwitch(),
                                        const SizedBox(width: 12),
                                        GestureDetector(
                                          onTap: () {
                                            setState(() {
                                              _rememberMe = !_rememberMe;
                                            });
                                          },
                                          child: const Text(
                                            'Remember me',
                                            style: TextStyle(
                                              fontSize: 14,
                                              fontWeight: FontWeight.w500,
                                              color: Color(
                                                0xFF475569,
                                              ), // slate-700
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                    GestureDetector(
                                      onTap: () {
                                        Navigator.push(
                                          context,
                                          _goPage(ForgotPassword()),
                                        );
                                      },
                                      child: const Text(
                                        'Forgot Password?',
                                        style: TextStyle(
                                          fontSize: 14,
                                          fontWeight: FontWeight.w600,
                                          color: Color(0xFF3B82F6), // blue-500
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 32),

                                // Login Button
                                ElevatedButton(
                                  onPressed: _isSigningIn ? null : _handleLogin,
                                  style: ElevatedButton.styleFrom(
                                    minimumSize: const Size(
                                      double.infinity,
                                      58,
                                    ), // width: 100%, padding: 18px
                                    padding: EdgeInsets
                                        .zero, // Remove default padding to control inner child
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(16),
                                    ),
                                    elevation: 0, // Handled by BoxDecoration
                                    backgroundColor: Colors
                                        .transparent, // Background handled by inner container
                                    shadowColor: Colors
                                        .transparent, // Shadow handled by inner container
                                  ),
                                  child: AnimatedContainer(
                                    duration: const Duration(milliseconds: 300),
                                    curve: Curves.easeOutCubic,
                                    height: 58,
                                    width: double.infinity,
                                    decoration: BoxDecoration(
                                      borderRadius: BorderRadius.circular(16),
                                      gradient: const LinearGradient(
                                        colors: [
                                          Color(0xFF3B82F6), // blue-500
                                          Color(0xFF06B6D4), // cyan-500
                                          Color(0xFF10B981), // emerald-500
                                        ],
                                        begin: Alignment.topLeft,
                                        end: Alignment.bottomRight,
                                      ),
                                      boxShadow: [
                                        BoxShadow(
                                          color: const Color(
                                            0xFF3B82F6,
                                          ).withOpacity(0.25),
                                          blurRadius: 24,
                                          offset: const Offset(0, 8),
                                        ),
                                        BoxShadow(
                                          color: const Color(
                                            0xFF06B6D4,
                                          ).withOpacity(0.15),
                                          blurRadius: 12,
                                          offset: const Offset(0, 4),
                                        ),
                                      ],
                                    ),
                                    child: Stack(
                                      alignment: Alignment.center,
                                      children: [
                                        // Pseudo-element ::before for hover overlay
                                        AnimatedOpacity(
                                          opacity: _isSigningIn
                                              ? 1.0
                                              : 0.0, // Control opacity for signing in state
                                          duration: const Duration(
                                            milliseconds: 300,
                                          ),
                                          child: Container(
                                            decoration: BoxDecoration(
                                              borderRadius:
                                                  BorderRadius.circular(16),
                                              gradient: LinearGradient(
                                                colors: [
                                                  Colors.white.withOpacity(0.2),
                                                  Colors.white.withOpacity(0.1),
                                                ],
                                                begin: Alignment.topLeft,
                                                end: Alignment.bottomRight,
                                              ),
                                            ),
                                          ),
                                        ),
                                        if (_isSigningIn)
                                          Row(
                                            mainAxisAlignment:
                                                MainAxisAlignment.center,
                                            children: const [
                                              SizedBox(
                                                width: 20,
                                                height: 20,
                                                child: CircularProgressIndicator(
                                                  strokeWidth: 2,
                                                  valueColor:
                                                      AlwaysStoppedAnimation<
                                                        Color
                                                      >(Colors.white),
                                                ),
                                              ),
                                              SizedBox(width: 12),
                                              Text(
                                                'Signing In... ⚡',
                                                style: TextStyle(
                                                  fontSize: 18,
                                                  fontWeight: FontWeight.w700,
                                                  color: Colors.white,
                                                ),
                                              ),
                                            ],
                                          )
                                        else
                                          const Text(
                                            'Sign In Securely 🚀',
                                            style: TextStyle(
                                              fontSize: 18,
                                              fontWeight: FontWeight.w700,
                                              color: Colors.white,
                                            ),
                                          ),
                                      ],
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // --- Helper Widgets ---

  Widget _buildInputField({
    required TextEditingController controller,
    required String hintText,
    TextInputType keyboardType = TextInputType.text,
    bool obscureText = false,
  }) {
    // For input field focus effects (transform: translateY(-1px);)
    // We'll use a local state for simplicity, or can lift it up if needed.
    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeOut,
      transform: Matrix4.translationValues(
        0,
        _emailController.text.isNotEmpty || _passwordController.text.isNotEmpty
            ? -1
            : 0,
        0,
      ), // Simple focus effect logic
      child: TextField(
        controller: controller,
        keyboardType: keyboardType,
        obscureText: obscureText,
        style: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w500,
          color: Color(0xFF1E293B), // slate-900
        ),
        decoration: InputDecoration(
          hintText: hintText,
          hintStyle: const TextStyle(
            color: Color(0xFF94A3B8), // slate-400
            fontWeight: FontWeight.w400,
          ),
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 20,
            vertical: 18,
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide(
              color: const Color(
                0xFFE2E8F0,
              ).withOpacity(0.8), // rgba(226, 232, 240, 0.8)
              width: 2,
            ),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: const BorderSide(
              color: Color(0xFF3B82F6), // blue-500
              width: 2,
            ),
          ),
          filled: true,
          fillColor: Colors.white.withOpacity(0.8), // rgba(255, 255, 255, 0.8)
          // backdrop-filter blur(10px) is complex in Flutter for TextField directly,
          // usually involves a Stack and BackdropFilter
          // but for this example, we'll keep the semi-transparent fill.
          // box-shadow is added on focus via the AnimatedContainer
          // transform: translateY(-1px) on focus is handled by the parent AnimatedContainer.
        ),
        onTap: () {
          // This ensures the AnimatedContainer parent reacts to tap/focus
          setState(() {}); // Rebuild to apply translateY
        },
        onChanged: (text) {
          setState(() {}); // Rebuild to apply translateY if text is entered
        },
      ),
    );
  }

  Widget _buildToggleSwitch() {
    return GestureDetector(
      onTap: () {
        setState(() {
          _rememberMe = !_rememberMe;
        });
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOut,
        width: 48,
        height: 24,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          gradient: _rememberMe
              ? const LinearGradient(
                  colors: [
                    Color(0xFF3B82F6), // blue-500
                    Color(0xFF06B6D4), // cyan-500
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                )
              : null, // No gradient when inactive
          color: _rememberMe ? null : const Color(0xFFE2E8F0), // slate-200
          boxShadow: _rememberMe
              ? [
                  BoxShadow(
                    color: const Color(0xFF3B82F6).withOpacity(0.3),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ]
              : null,
        ),
        alignment: _rememberMe ? Alignment.centerRight : Alignment.centerLeft,
        padding: const EdgeInsets.all(2), // top: 2px, left: 2px for the circle
        child: Container(
          width: 20,
          height: 20,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: Colors.white,
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.1),
                blurRadius: 4,
                offset: const Offset(0, 2),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // Helper for floating shapes with parallax
  Widget _buildFloatingShape({
    required double size,
    double? top,
    double? bottom,
    double? left,
    double? right,
    required Color color,
    required Animation<Offset> animation,
    required Animation<double> rotation,
    required double speed,
  }) {
    // Apply parallax based on mouse position
    final double parallaxX = _mousePosition.dx * speed * 10; // Scale the effect
    final double parallaxY = _mousePosition.dy * speed * 10;

    return Positioned(
      top: top != null ? top * MediaQuery.of(context).size.height : null,
      bottom: bottom != null
          ? bottom * MediaQuery.of(context).size.height
          : null,
      left: left != null ? left * MediaQuery.of(context).size.width : null,
      right: right != null ? right * MediaQuery.of(context).size.width : null,
      child: AnimatedBuilder(
        animation: animation,
        builder: (context, child) {
          return Transform.translate(
            offset:
                animation.value +
                Offset(parallaxX, parallaxY), // Combine float and parallax
            child: Transform.rotate(
              angle: rotation.value,
              child: Opacity(
                opacity: 0.1,
                child: Container(
                  width: size,
                  height: size,
                  decoration: BoxDecoration(
                    color: color,
                    shape: BoxShape.circle,
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
