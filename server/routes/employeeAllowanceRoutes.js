// employeeAllowanceRoutes.js

const express = require("express");
const employeeAllowanceRouter = express.Router();
const employeeAllowanceController = require("../controllers/employeeAllowanceController");
const verifyToken = require("../middleware/verifyToken");

employeeAllowanceRouter.get(
  "/",
  verifyToken,
  employeeAllowanceController.getAllEmployeeAllowances
);
employeeAllowanceRouter.get(
  "/:id",
  verifyToken,
  employeeAllowanceController.getEmployeeAllowanceById
);
employeeAllowanceRouter.get(
  "/employee/:employeeId",
  verifyToken,
  employeeAllowanceController.getAllowancesByEmployee
);
employeeAllowanceRouter.post(
  "/",
  verifyToken,
  employeeAllowanceController.createEmployeeAllowance
);
employeeAllowanceRouter.put(
  "/:id",
  verifyToken,
  employeeAllowanceController.updateEmployeeAllowance
);
employeeAllowanceRouter.delete(
  "/:id",
  verifyToken,
  employeeAllowanceController.deleteEmployeeAllowance
);

module.exports = employeeAllowanceRouter;
