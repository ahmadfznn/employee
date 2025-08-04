const express = require("express");
const departmentRouter = express.Router();
const departmentController = require("../controllers/departmentController");

departmentRouter.get("/", departmentController.getAllDepartments);
departmentRouter.get("/:id", departmentController.getDepartmentById);
departmentRouter.post("/", departmentController.createDepartment);
departmentRouter.put("/:id", departmentController.updateDepartment);
departmentRouter.delete("/:id", departmentController.deleteDepartment);

module.exports = departmentRouter;
