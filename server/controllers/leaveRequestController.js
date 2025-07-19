const { LeaveRequest, Employee } = require("../models");
const notificationController = require("./notificationController");

exports.createLeaveRequest = async (req, res) => {
  try {
    const { employee_id, leave_type, start_date, end_date, reason } = req.body;

    const employee = await Employee.findByPk(employee_id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const leaveRequest = await LeaveRequest.create({
      employee_id,
      leave_type,
      start_date,
      end_date,
      reason,
      status: "pending",
    });

    return res
      .status(201)
      .json({ message: "Leave request submitted", leaveRequest });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, approved_by } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const leaveRequest = await LeaveRequest.findByPk(id);
    if (!leaveRequest) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    const approver = await Employee.findByPk(approved_by);
    if (!approver || !["admin", "manager"].includes(approver.role)) {
      return res.status(403).json({
        message: "Only admin or manager can approve/reject leave requests",
      });
    }

    leaveRequest.status = status;
    leaveRequest.approved_by = approved_by;

    await leaveRequest.save();

    const employee = await Employee.findByPk(leaveRequest.employee_id);

    await notificationController.sendNotification(
      {
        body: {
          employee_id: employee.id,
          title: `Leave Request ${
            status === "approved" ? "Approved" : "Rejected"
          }`,
          message: `Your leave request from ${leaveRequest.start_date} to ${leaveRequest.end_date} has been ${status}.`,
          type: "leave",
        },
      },
      res
    );

    return res
      .status(200)
      .json({ message: `Leave request ${status}`, leaveRequest });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getLeaveRequestsByEmployee = async (req, res) => {
  try {
    const { employee_id } = req.params;

    const employee = await Employee.findByPk(employee_id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const leaveRequests = await LeaveRequest.findAll({
      where: { employee_id },
      include: [{ model: Employee, attributes: ["name", "email", "position"] }],
    });

    if (leaveRequests.length === 0) {
      return res
        .status(404)
        .json({ message: "No leave requests found for this employee" });
    }

    return res.status(200).json({ leaveRequests });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAllLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.findAll({
      include: [{ model: Employee, attributes: ["name", "email", "position"] }],
    });

    if (leaveRequests.length === 0) {
      return res.status(404).json({ message: "No leave requests found" });
    }

    return res.status(200).json({ leaveRequests });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const leaveRequest = await LeaveRequest.findByPk(id);
    if (!leaveRequest) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    await leaveRequest.destroy();

    return res.status(200).json({ message: "Leave request deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.cancelLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const leaveRequest = await LeaveRequest.findByPk(id);
    if (!leaveRequest) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    if (leaveRequest.status !== "pending") {
      return res.status(400).json({
        message: "Only pending leave requests can be cancelled",
      });
    }

    await leaveRequest.destroy();

    return res
      .status(200)
      .json({ message: "Leave request cancelled successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getLeaveRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const leaveRequest = await LeaveRequest.findByPk(id, {
      include: [{ model: Employee, attributes: ["name", "email", "position"] }],
    });

    if (!leaveRequest) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    return res.status(200).json({ leaveRequest });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
