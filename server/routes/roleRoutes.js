// roleRoutes.js

const express = require("express");
const roleRouter = express.Router();
const roleController = require("../controllers/roleController");

roleRouter.get("/", roleController.getAllRoles);
roleRouter.get("/:id", roleController.getRoleById);
roleRouter.post("/", roleController.createRole);
roleRouter.put("/:id", roleController.updateRole);
roleRouter.delete("/:id", roleController.deleteRole);

module.exports = roleRouter;
