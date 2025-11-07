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
const holidayRouter = require("./holidayRoutes");

const router = express.Router();

router.use("/auth", authRouter);
router.use("/company", companyRouter);
router.use("/employee", employeeRouter);
router.use("/attendance", attendanceRouter);
router.use("/payroll", payrollRouter);
router.use("/leave-request", leaveRequestRouter);
router.use("/notification", notificationRouter);
router.use("/role", roleRouter);
router.use("/department", departmentRouter);
router.use("/allowance", allowanceRouter);
router.use("/employeeAllowance", employeeAllowanceRouter);
router.use("/holiday", holidayRouter);

module.exports = router;
