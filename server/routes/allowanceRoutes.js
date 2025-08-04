// allowanceRoutes.js

const express = require("express");
const allowanceRouter = express.Router();
const allowanceController = require("../controllers/allowanceController");

allowanceRouter.get("/", allowanceController.getAllAllowances);
allowanceRouter.get("/:id", allowanceController.getAllowanceById);
allowanceRouter.post("/", allowanceController.createAllowance);
allowanceRouter.put("/:id", allowanceController.updateAllowance);
allowanceRouter.delete("/:id", allowanceController.deleteAllowance);

module.exports = allowanceRouter;
