// companyController.js

// Import kedua model yang diperlukan
const { Company, CompanySettings } = require("../models");
const companySettings = require("../models/companySetting");

/**
 * @description Mendapatkan data perusahaan dan pengaturannya.
 * @route GET /api/company
 * @access Private
 */
exports.getCompanyAndSettings = async (req, res) => {
  try {
    // Ambil data perusahaan dan pengaturannya secara bersamaan
    const companyData = await Company.findOne();
    const settingsData = await CompanySettings.findOne();

    // Periksa apakah data pe rusahaan dan pengaturan ditemukan
    if (!companyData || !settingsData) {
      return res
        .status(404)
        .json({ message: "Company data or settings not found" });
    }

    // Gabungkan kedua data menjadi satu objek untuk dikirim ke client
    const combinedData = {
      company: companyData,
      settings: settingsData,
    };

    res.status(200).json({ data: combinedData });
  } catch (error) {
    // Menangani error server
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Membuat data perusahaan dan pengaturannya.
 * @route POST /api/company
 * @access Private
 */
exports.createCompanyAndSettings = async (req, res) => {
  try {
    // Periksa apakah data perusahaan dan pengaturannya sudah ada
    const existingCompany = await Company.findOne();
    const existingSettings = await CompanySettings.findOne();

    if (existingCompany || existingSettings) {
      return res.status(400).json({
        message:
          "Company and settings already exist. You can only update them.",
      });
    }

    // Field-field yang akan diambil dari body request
    const companyFields = ["name", "address", "phone", "email", "website"];
    const settingsFields = [
      "standard_work_hours_per_day",
      "standard_work_days_per_week",
      "start_work_time",
      "end_work_time",
      "overtime_rate_multiplier",
    ];

    const newCompanyData = {};
    const newSettingsData = {};

    companyFields.forEach((field) => {
      newCompanyData[field] = req.body[field];
    });

    settingsFields.forEach((field) => {
      newSettingsData[field] = req.body[field];
    });

    // Pastikan field wajib ada
    if (
      !newCompanyData.name ||
      !newCompanyData.address ||
      !newCompanyData.email
    ) {
      return res.status(400).json({
        message: "Name, address, and email are required for company.",
      });
    }

    // Pastikan field wajib ada untuk settings
    if (
      !newSettingsData.standard_work_hours_per_day ||
      !newSettingsData.standard_work_days_per_week ||
      !newSettingsData.start_work_time ||
      !newSettingsData.end_work_time ||
      !newSettingsData.overtime_rate_multiplier
    ) {
      return res
        .status(400)
        .json({ message: "All company settings fields are required." });
    }

    // Buat kedua data secara bersamaan
    await Company.create(newCompanyData);
    await CompanySettings.create(newSettingsData);

    res
      .status(201)
      .json({ message: "Company and settings created successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Memperbarui data perusahaan dan pengaturannya.
 * @route PUT /api/company
 * @access Private
 */
exports.updateCompanyAndSettings = async (req, res) => {
  try {
    const companyData = await Company.findOne();
    const settingsData = await CompanySettings.findOne();

    if (!companyData || !settingsData) {
      return res
        .status(404)
        .json({ message: "Company data or settings not found" });
    }

    const updatesCompany = {};
    const updatesSettings = {};

    const allowedCompanyFields = [
      "name",
      "address",
      "phone",
      "email",
      "website",
    ];
    const allowedSettingsFields = [
      "standard_work_hours_per_day",
      "standard_work_days_per_week",
      "start_work_time",
      "end_work_time",
      "overtime_rate_multiplier",
    ];

    // Pisahkan field dari req.body ke update object yang sesuai
    allowedCompanyFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updatesCompany[field] = req.body[field];
      }
    });

    allowedSettingsFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updatesSettings[field] = req.body[field];
      }
    });

    // Lakukan update hanya jika ada field yang dikirim
    if (Object.keys(updatesCompany).length > 0) {
      await companyData.update(updatesCompany);
    }
    if (Object.keys(updatesSettings).length > 0) {
      await settingsData.update(updatesSettings);
    }

    res
      .status(200)
      .json({ message: "Company and settings updated successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Menghapus data perusahaan dan pengaturannya.
 * @route DELETE /api/company
 * @access Private
 */
exports.deleteCompanyAndSettings = async (req, res) => {
  try {
    const companyData = await Company.findOne();
    const settingsData = await CompanySettings.findOne();

    if (!companyData || !settingsData) {
      return res
        .status(404)
        .json({ message: "Company data or settings not found" });
    }

    // Hapus kedua data secara bersamaan
    await companyData.destroy();
    await settingsData.destroy();

    res
      .status(200)
      .json({ message: "Company and settings deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
