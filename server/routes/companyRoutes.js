const express = require("express");
const companyRouter = express.Router();
const companyController = require("../controllers/companyController");

companyRouter.get("/", companyController.getCompanyAndSettings);

companyRouter.post("/", companyController.createCompanyAndSettings);

companyRouter.put("/", companyController.updateCompanyAndSettings);

companyRouter.delete("/", companyController.deleteCompanyAndSettings);

module.exports = companyRouter;
