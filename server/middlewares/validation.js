const { body, validationResult } = require("express-validator");

const validateOtp = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("otp").isNumeric().withMessage("OTP must be a number"),
];

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateAddUser = [
  body("username").trim().notEmpty().withMessage("Username is required."),
  body("email").isEmail().withMessage("Invalid email format."),
  body("tel").notEmpty().withMessage("Phone number is required."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
  body("password_confirm")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateRegister = [
  body("name").trim().notEmpty().withMessage("Name is required."),

  body("email").isEmail().withMessage("Invalid email format.").normalizeEmail(),

  body("tel")
    .optional()
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage(
      "Invalid phone number format. Use international format, e.g. +6281234567890."
    ),
];

const validateLogin = [
  body("email").isEmail().withMessage("Invalid email format.").normalizeEmail(),
];

module.exports = {
  validateOtp,
  validateRequest,
  validateAddUser,
  validateRegister,
  validateLogin,
};
