const express = require("express");
const companyRouter = express.Router();
const companyController = require("../controllers/companyController");
const verifyToken = require("../middleware/verifyToken");

companyRouter.get("/", verifyToken, companyController.getCompany);

companyRouter.post("/", verifyToken, companyController.createCompany);

companyRouter.put("/", verifyToken, companyController.updateCompany);

companyRouter.delete("/", verifyToken, companyController.deleteCompany);

module.exports = companyRouter;
