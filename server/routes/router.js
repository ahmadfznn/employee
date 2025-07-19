const express = require("express");
const employeeRouter = require("./employeeRoutes");
const authRouter = require("./authRoutes");
const verifyToken = require("../middlewares/authMiddleware");
const attendanceRouter = require("./attendanceRoutes");
const payrollRouter = require("./payrollRoutes");
const leaveRequestRouter = require("./leaveRequestRoutes");
const notificationRouter = require("./notificationRoutes");

const router = express.Router();

router.use("/auth", authRouter);
router.use("/employee", verifyToken, employeeRouter);
router.use("/attendance", attendanceRouter);
router.use("/payroll", verifyToken, payrollRouter);
router.use("/leave-request", verifyToken, leaveRequestRouter);
router.use("/notification", verifyToken, notificationRouter);

module.exports = router;
