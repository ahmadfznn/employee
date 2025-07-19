const express = require("express");
const employeeRouter = express.Router();
const employeeController = require("../controllers/employeeController");
const upload = require("../middlewares/upload");

employeeRouter.get("/", employeeController.getAllEmployees);
employeeRouter.get("/:id", employeeController.getEmployeeById);
employeeRouter.post(
  "/",
  upload.single("product_picture"),
  employeeController.createEmployee
);
employeeRouter.put(
  "/:id",
  upload.single("product_picture"),
  employeeController.updateEmployee
);
employeeRouter.delete("/:id", employeeController.deleteEmployee);

module.exports = employeeRouter;
