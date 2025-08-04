const express = require("express");
const companyRouter = express.Router();
const companyController = require("../controllers/companyController");

companyRouter.get("/", companyController.getCompany);

companyRouter.post("/", companyController.createCompany);

companyRouter.put("/", companyController.updateCompany);

companyRouter.delete("/", companyController.deleteCompany);

module.exports = companyRouter;
