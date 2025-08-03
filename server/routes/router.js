const express = require("express");
const employeeRouter = require("./employeeRoutes");
const authRouter = require("./authRoutes");
const verifyToken = require("../middlewares/authMiddleware");
const attendanceRouter = require("./attendanceRoutes");
const payrollRouter = require("./payrollRoutes");
const leaveRequestRouter = require("./leaveRequestRoutes");
const notificationRouter = require("./notificationRoutes");
const companyRouter = require("./companyRoutes");
const roleRouter = require("./roleRoutes");
const departmentRouter = require("./departmentRoutes");
const allowanceRouter = require("./allowanceRoutes");
const employeeAllowanceRouter = require("./employeeAllowanceRoutes");
const companySettingRouter = require("./companySettingRoutes");
const holidayRouter = require("./holidayRoutes");

const router = express.Router();

router.use("/auth", authRouter);
router.use("/company", verifyToken, companyRouter);
router.use("/employee", verifyToken, employeeRouter);
router.use("/attendance", verifyToken, attendanceRouter);
router.use("/payroll", verifyToken, payrollRouter);
router.use("/leave-request", verifyToken, leaveRequestRouter);
router.use("/notification", verifyToken, notificationRouter);
router.use("/role", verifyToken, roleRouter);
router.use("/department", verifyToken, departmentRouter);
router.use("/allowance", verifyToken, allowanceRouter);
router.use("/employeeAllowance", verifyToken, employeeAllowanceRouter);
router.use("/companySetting", verifyToken, companySettingRouter);
router.use("/holiday", verifyToken, holidayRouter);

module.exports = router;
