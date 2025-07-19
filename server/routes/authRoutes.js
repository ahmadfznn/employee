const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/authController");
const { loginLimit, registerLimit } = require("../middlewares/rateLimiter");
const {
  validateLogin,
  validateRegister,
} = require("../middlewares/validation");
const verifyToken = require("../middlewares/authMiddleware");

authRouter.post("/login", validateLogin, loginLimit, authController.login);
authRouter.post(
  "/register",
  validateRegister,
  registerLimit,
  authController.register
);
authRouter.post("/logout", authController.logout);
authRouter.get("/me", verifyToken, (req, res) => {
  res.json({ user: req.user });
});

module.exports = authRouter;
