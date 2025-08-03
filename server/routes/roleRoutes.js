// roleRoutes.js

const express = require("express");
const roleRouter = express.Router();
const roleController = require("../controllers/roleController");
const verifyToken = require("../middleware/verifyToken");

roleRouter.get("/", verifyToken, roleController.getAllRoles);
roleRouter.get("/:id", verifyToken, roleController.getRoleById);
roleRouter.post("/", verifyToken, roleController.createRole);
roleRouter.put("/:id", verifyToken, roleController.updateRole);
roleRouter.delete("/:id", verifyToken, roleController.deleteRole);

module.exports = roleRouter;
