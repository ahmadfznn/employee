// allowanceRoutes.js

const express = require("express");
const allowanceRouter = express.Router();
const allowanceController = require("../controllers/allowanceController");
const verifyToken = require("../middleware/verifyToken");

allowanceRouter.get("/", verifyToken, allowanceController.getAllAllowances);
allowanceRouter.get("/:id", verifyToken, allowanceController.getAllowanceById);
allowanceRouter.post("/", verifyToken, allowanceController.createAllowance);
allowanceRouter.put("/:id", verifyToken, allowanceController.updateAllowance);
allowanceRouter.delete(
  "/:id",
  verifyToken,
  allowanceController.deleteAllowance
);

module.exports = allowanceRouter;
