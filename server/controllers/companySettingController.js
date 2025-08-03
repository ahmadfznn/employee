// companySettingsController.js

const companySettings = require("../models");

/**
 * @description Mendapatkan data pengaturan perusahaan tunggal.
 * @route GET /api/company-settings
 * @access Private
 */
exports.getCompanySettings = async (req, res) => {
  try {
    const settings = await companySettings.findOne();
    if (!settings) {
      return res.status(404).json({ message: "Company settings not found" });
    }
    res.status(200).json({ data: settings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Membuat data pengaturan perusahaan baru.
 * @route POST /api/company-settings
 * @access Private
 */
exports.createCompanySettings = async (req, res) => {
  try {
    const existingSettings = await companySettings.findOne();
    if (existingSettings) {
      return res.status(400).json({
        message: "Company settings already exist. You can only update it.",
      });
    }

    const {
      standard_work_hours_per_day,
      standard_work_days_per_week,
      start_work_time,
      end_work_time,
      overtime_rate_multiplier,
    } = req.body;

    await companySettings.create({
      standard_work_hours_per_day,
      standard_work_days_per_week,
      start_work_time,
      end_work_time,
      overtime_rate_multiplier,
    });
    res.status(201).json({ message: "Company settings created successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Memperbarui data pengaturan perusahaan tunggal.
 * @route PUT /api/company-settings
 * @access Private
 */
exports.updateCompanySettings = async (req, res) => {
  try {
    const settings = await companySettings.findOne();
    if (!settings) {
      return res.status(404).json({ message: "Company settings not found" });
    }

    const updates = {};
    const allowedFields = [
      "standard_work_hours_per_day",
      "standard_work_days_per_week",
      "start_work_time",
      "end_work_time",
      "overtime_rate_multiplier",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    await settings.update(updates);

    res.status(200).json({ message: "Company settings updated successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
