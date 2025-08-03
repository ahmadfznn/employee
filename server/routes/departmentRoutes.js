const express = require("express");
const departmentRouter = express.Router();
const departmentController = require("../controllers/departmentController");
const verifyToken = require("../middleware/verifyToken");

departmentRouter.get("/", verifyToken, departmentController.getAllDepartments);
departmentRouter.get(
  "/:id",
  verifyToken,
  departmentController.getDepartmentById
);
departmentRouter.post("/", verifyToken, departmentController.createDepartment);
departmentRouter.put(
  "/:id",
  verifyToken,
  departmentController.updateDepartment
);
departmentRouter.delete(
  "/:id",
  verifyToken,
  departmentController.deleteDepartment
);

module.exports = departmentRouter;
