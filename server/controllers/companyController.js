// companyController.js

const company = require("../models/company");

/**
 * @description Mendapatkan data perusahaan tunggal.
 * @route GET /api/company
 * @access Private
 */
exports.getCompany = async (req, res) => {
  try {
    const company = await company.findOne(); // Mengambil satu data perusahaan saja
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.status(200).json({ data: company });
  } catch (error) {
    // Menangani error server
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Membuat data perusahaan tunggal.
 * @route POST /api/company
 * @access Private
 */
exports.createCompany = async (req, res) => {
  try {
    const existingCompany = await company.findOne(); // Memeriksa apakah perusahaan sudah ada
    if (existingCompany) {
      return res.status(400).json({
        message: "Company already exists. You can only have one company.",
      });
    }

    const { name, address, phone, email, website } = req.body;

    // Pastikan semua data yang dibutuhkan ada
    if (!name || !address) {
      return res.status(400).json({ message: "Name and address are required" });
    }

    await company.create({ name, address, phone, email, website });
    res.status(201).json({ message: "Company added successfully." });
  } catch (error) {
    // Menangani error server
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Memperbarui data perusahaan tunggal.
 * @route PUT /api/company
 * @access Private
 */
exports.updateCompany = async (req, res) => {
  try {
    const company = await company.findOne(); // Mengambil satu data perusahaan saja
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const updates = {};
    const allowedFields = ["name", "address", "phone", "email", "website"];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    await company.update(updates);

    res.status(200).json({ message: "Company updated successfully." });
  } catch (error) {
    // Menangani error server
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Menghapus data perusahaan tunggal.
 * @route DELETE /api/company
 * @access Private
 */
exports.deleteCompany = async (req, res) => {
  try {
    const company = await company.findOne(); // Mengambil satu data perusahaan saja

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    await company.destroy();
    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    // Menangani error server
    res.status(500).json({ message: error.message });
  }
};
