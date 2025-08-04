// employeeAllowanceRoutes.js

const express = require("express");
const employeeAllowanceRouter = express.Router();
const employeeAllowanceController = require("../controllers/employeeAllowanceController");

employeeAllowanceRouter.get(
  "/",
  employeeAllowanceController.getAllEmployeeAllowances
);
employeeAllowanceRouter.get(
  "/:id",
  employeeAllowanceController.getEmployeeAllowanceById
);
employeeAllowanceRouter.get(
  "/employee/:employeeId",
  employeeAllowanceController.getAllowancesByEmployee
);
employeeAllowanceRouter.post(
  "/",
  employeeAllowanceController.createEmployeeAllowance
);
employeeAllowanceRouter.put(
  "/:id",
  employeeAllowanceController.updateEmployeeAllowance
);
employeeAllowanceRouter.delete(
  "/:id",
  employeeAllowanceController.deleteEmployeeAllowance
);

module.exports = employeeAllowanceRouter;
