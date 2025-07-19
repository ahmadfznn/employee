const express = require("express");
const attendanceController = require("../controllers/attendanceController");

const attendanceRouter = express.Router();

attendanceRouter.post("/", attendanceController.createAttendance);

attendanceRouter.put("/:id", attendanceController.updateAttendance);

attendanceRouter.get(
  "/employee/:employee_id",
  attendanceController.getAttendanceByEmployee
);

attendanceRouter.get("/date/:date", attendanceController.getAttendanceByDate);

attendanceRouter.delete("/:id", attendanceController.deleteAttendance);

module.exports = attendanceRouter;
