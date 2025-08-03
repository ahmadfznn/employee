// companySettingsRoutes.js

const express = require("express");
const companySettingRouter = express.Router();
const companySettingController = require("../controllers/companySettingController");
const verifyToken = require("../middleware/verifyToken");

// Route untuk mendapatkan data pengaturan perusahaan tunggal
// GET /api/company-settings
companySettingRouter.get(
  "/",
  verifyToken,
  companySettingController.getCompanySettings
);

// Route untuk membuat data pengaturan perusahaan baru
// POST /api/company-settings
// Hanya bisa dipanggil sekali untuk inisialisasi awal
companySettingRouter.post(
  "/",
  verifyToken,
  companySettingController.createCompanySettings
);

// Route untuk memperbarui data pengaturan perusahaan tunggal
// PUT /api/company-settings
companySettingRouter.put(
  "/",
  verifyToken,
  companySettingController.updateCompanySettings
);

module.exports = companySettingRouter;
