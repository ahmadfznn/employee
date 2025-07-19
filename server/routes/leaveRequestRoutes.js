const express = require("express");
const leaveRequestController = require("../controllers/leaveRequestController");

const leaveRequestRouter = express.Router();

leaveRequestRouter.post("/", leaveRequestController.createLeaveRequest);

leaveRequestRouter.put("/:id", leaveRequestController.updateLeaveStatus);

leaveRequestRouter.get(
  "/employee/:employee_id",
  leaveRequestController.getLeaveRequestsByEmployee
);

leaveRequestRouter.get("/", leaveRequestController.getAllLeaveRequests);

leaveRequestRouter.delete("/:id", leaveRequestController.deleteLeaveRequest);
leaveRequestRouter.delete(
  "/:id/cancel",
  leaveRequestController.cancelLeaveRequest
);
leaveRequestRouter.get("/:id", leaveRequestController.getLeaveRequestById);

module.exports = leaveRequestRouter;
