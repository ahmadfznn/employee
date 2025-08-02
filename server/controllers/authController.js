const { Employee } = require("../models");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
require("dotenv").config();

const generateToken = (employee) => {
  const tokenPayload = {
    id: employee.id,
    name: employee.name,
    email: employee.email,
    phone: employee.phone,
    position: employee.position,
    role: employee.role,
    photo_url: employee.photo_url,
    address: employee.address,
  };

  return jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn: 7 * 24 * 3600,
  });
};

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, password } = req.body;

    const existingEmployee = await Employee.findOne({ where: { email } });
    if (existingEmployee) {
      return res.status(400).json({ message: "Email already exists" });
    }

    await Employee.create({ name, email, phone, password });

    res.status(201).json({ message: "Employee registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const clientType = req.headers['x-client-type']; 

    const employee = await Employee.findOne({ where: { email } });
    if (!employee || !(await employee.checkPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(employee);

    if (clientType === 'web') {
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }

    const responseBody = {
      message: "Login successful",
      user: {
        id: employee.id,
        email: employee.email,
        name: employee.name,
        phone: employee.phone,
        position: employee.position,
        role: employee.role,
        salary: employee.salary,
        photo_url: employee.photo_url,
        address: employee.address,
        status: employee.status,
        created_at: employee.created_at
      }
    };

    if (clientType === 'mobile') {
      responseBody.token = token;
    }

    res.status(200).json(responseBody);

  } catch (error) { 
    res.status(500).json({ message: error.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  res.json({ message: "Logout successful" });
};

// forgot password
exports.forgotPassword = async (req, res) => {
  try {
    // get email from body
    const { email } = req.body;

    // find employee by email
    const employee = await Employee.findOne({ where: { email } });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // generate token
    const token = jwt.sign({ id: employee.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // generate reset url
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    // send email with reset url
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      text: `Click the link to reset your password: ${resetUrl}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// reset password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // find employee by id
    const employee = await Employee.findByPk(decoded.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // update password
    employee.password = newPassword;
    await employee.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
