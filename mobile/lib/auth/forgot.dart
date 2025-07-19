// forgot_password_screen.dart
import 'package:flutter/material.dart';
import 'dart:math' as math;

import 'package:flutter/services.dart';

class ForgotPassword extends StatefulWidget {
  const ForgotPassword({super.key});

  @override
  State<ForgotPassword> createState() => _ForgotPasswordState();
}

class _ForgotPasswordState extends State<ForgotPassword>
    with TickerProviderStateMixin {
  final TextEditingController _emailController = TextEditingController();
  bool _isSendingResetLink = false;

  late AnimationController _animationController;
  late List<Animation<Offset>> _floatingAnimations;
  late List<Animation<double>> _rotationAnimations;

  // For parallax effect
  Offset _mousePosition = Offset.zero;

  @override
  void initState() {
    super.initState();

    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 8),
    )..repeat(reverse: true);

    _floatingAnimations = List.generate(3, (index) {
      return Tween<Offset>(
        begin: Offset.zero,
        end: const Offset(0, -20),
      ).animate(
        CurvedAnimation(
          parent: _animationController,
          curve: Interval((index * 0.2), 1.0, curve: Curves.easeInOut),
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
    super.dispose();
  }

  void _handleResetPassword() {
    if (_emailController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter your email address!')),
      );
      return;
    }

    setState(() {
      _isSendingResetLink = true;
    });

    // Simulate sending reset link
    Future.delayed(const Duration(milliseconds: 2000), () {
      if (mounted) {
        setState(() {
          _isSendingResetLink = false;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Reset link sent to ${_emailController.text}!'),
          ),
        );
        // Optionally navigate back to login or a success screen
        // Navigator.pop(context);
      }
    });
  }

  void _onPointerHover(PointerHoverEvent event) {
    if (mounted) {
      setState(() {
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
        onPointerHover: _onPointerHover,
        child: Container(
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
              // Floating Shapes (Same as Login Screen)
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
                          color: Colors.white60,
                          offset: Offset(0, 1),
                        ),
                      ],
                    ),
                    child: ClipRRect(
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
                                    Color(0x4DBBEEFF),
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
                                              Color(0xFF3B82F6),
                                              Color(0xFF06B6D4),
                                              Color(0xFF10B981),
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
                                            Container(
                                              margin: const EdgeInsets.all(2),
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
                                                    offset: Offset(0, 2),
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

                                // Welcome Text (Adapted for Forgot Password)
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
                                          'Forgot Password? 🤔',
                                          textAlign: TextAlign.center,
                                          style: TextStyle(
                                            fontSize: 28,
                                            fontWeight: FontWeight.w700,
                                            color: Colors.white,
                                          ),
                                        ),
                                      ),
                                      const SizedBox(height: 8),
                                      const Text(
                                        'Enter your email to receive a password reset link.',
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
                                const SizedBox(height: 32), // Adjusted spacing
                                // Send Reset Link Button
                                ElevatedButton(
                                  onPressed: _isSendingResetLink
                                      ? null
                                      : _handleResetPassword,
                                  style: ElevatedButton.styleFrom(
                                    minimumSize: const Size(
                                      double.infinity,
                                      58,
                                    ),
                                    padding: EdgeInsets.zero,
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(16),
                                    ),
                                    elevation: 0,
                                    backgroundColor: Colors.transparent,
                                    shadowColor: Colors.transparent,
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
                                          Color(0xFF3B82F6),
                                          Color(0xFF06B6D4),
                                          Color(0xFF10B981),
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
                                        AnimatedOpacity(
                                          opacity: _isSendingResetLink
                                              ? 1.0
                                              : 0.0,
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
                                        if (_isSendingResetLink)
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
                                                'Sending Link... 📧',
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
                                            'Send Reset Link ✨',
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
                                const SizedBox(
                                  height: 24,
                                ), // Add some space below the button
                                // Back to Login
                                GestureDetector(
                                  onTap: () {
                                    Navigator.pop(
                                      context,
                                    ); // Go back to the previous screen (Login)
                                  },
                                  child: const Text(
                                    'Remember your password? Back to Login',
                                    style: TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w600,
                                      color: Color(0xFF3B82F6),
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

  // --- Helper Widgets (Same as Login Screen) ---

  Widget _buildInputField({
    required TextEditingController controller,
    required String hintText,
    TextInputType keyboardType = TextInputType.text,
    bool obscureText = false,
  }) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeOut,
      transform: Matrix4.translationValues(
        0,
        _emailController.text.isNotEmpty || controller.text.isNotEmpty
            ? -1
            : 0, // Simple focus effect logic
        0,
      ),
      child: TextField(
        controller: controller,
        keyboardType: keyboardType,
        obscureText: obscureText,
        style: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w500,
          color: Color(0xFF1E293B),
        ),
        decoration: InputDecoration(
          hintText: hintText,
          hintStyle: const TextStyle(
            color: Color(0xFF94A3B8),
            fontWeight: FontWeight.w400,
          ),
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 20,
            vertical: 18,
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide(
              color: const Color(0xFFE2E8F0).withOpacity(0.8),
              width: 2,
            ),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: const BorderSide(color: Color(0xFF3B82F6), width: 2),
          ),
          filled: true,
          fillColor: Colors.white.withOpacity(0.8),
        ),
        onTap: () {
          setState(() {});
        },
        onChanged: (text) {
          setState(() {});
        },
      ),
    );
  }

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
    final double parallaxX = _mousePosition.dx * speed * 10;
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
            offset: animation.value + Offset(parallaxX, parallaxY),
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
