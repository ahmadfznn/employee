const express = require("express");
const payrollController = require("../controllers/payrollController");

const payrollRouter = express.Router();

payrollRouter.post("/", payrollController.createPayroll);
payrollRouter.post("/:id/approve", payrollController.approvePayroll);

payrollRouter.put("/:id", payrollController.updatePayrollStatus);

payrollRouter.get("/:id", payrollController.getPayrollById);

payrollRouter.get(
  "/employee/:employee_id",
  payrollController.getPayrollByEmployee
);

payrollRouter.get("/month/:month", payrollController.getPayrollByMonth);

payrollRouter.get("/", payrollController.getAllPayroll);

payrollRouter.delete("/:id", payrollController.deletePayroll);

module.exports = payrollRouter;
