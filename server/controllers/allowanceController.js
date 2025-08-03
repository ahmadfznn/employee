// allowancesController.js

const allowance = require("../models");

/**
 * @description Mendapatkan semua data tunjangan.
 * @route GET /api/allowances
 * @access Private
 */
exports.getAllAllowances = async (req, res) => {
  try {
    const allowances = await allowance.findAll();
    res.status(200).json({ data: allowances });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Mendapatkan data tunjangan berdasarkan ID.
 * @route GET /api/allowances/:id
 * @access Private
 */
exports.getAllowanceById = async (req, res) => {
  try {
    const allowance = await allowance.findByPk(req.params.id);
    if (!allowance) {
      return res.status(404).json({ message: "allowance not found" });
    }
    res.status(200).json({ data: allowance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Membuat data tunjangan baru.
 * @route POST /api/allowances
 * @access Private
 */
exports.createAllowance = async (req, res) => {
  try {
    const { name, description, default_amount, is_fixed } = req.body;
    await allowance.create({ name, description, default_amount, is_fixed });
    res.status(201).json({ message: "allowance created successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Memperbarui data tunjangan berdasarkan ID.
 * @route PUT /api/allowances/:id
 * @access Private
 */
exports.updateAllowance = async (req, res) => {
  try {
    const allowance = await allowance.findByPk(req.params.id);
    if (!allowance) {
      return res.status(404).json({ message: "allowance not found" });
    }

    const { name, description, default_amount, is_fixed } = req.body;
    await allowance.update({ name, description, default_amount, is_fixed });

    res.status(200).json({ message: "allowance updated successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Menghapus data tunjangan berdasarkan ID.
 * @route DELETE /api/allowances/:id
 * @access Private
 */
exports.deleteAllowance = async (req, res) => {
  try {
    const allowance = await allowance.findByPk(req.params.id);
    if (!allowance) {
      return res.status(404).json({ message: "allowance not found" });
    }
    await allowance.destroy();
    res.status(200).json({ message: "allowance deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
