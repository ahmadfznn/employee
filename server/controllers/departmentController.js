// departmentsController.js

const { Department } = require("../models");

/**
 * @description Mendapatkan semua data departemen.
 * @route GET /api/departments
 * @access Private
 */
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll();
    res.status(200).json({ data: departments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Mendapatkan data departemen berdasarkan ID.
 * @route GET /api/departments/:id
 * @access Private
 */
exports.getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) {
      return res.status(404).json({ message: "department not found" });
    }
    res.status(200).json({ data: department });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Membuat data departemen baru.
 * @route POST /api/departments
 * @access Private
 */
exports.createDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;
    await Department.create({ name, description });
    res.status(201).json({ message: "department created successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Memperbarui data departemen berdasarkan ID.
 * @route PUT /api/departments/:id
 * @access Private
 */
exports.updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) {
      return res.status(404).json({ message: "department not found" });
    }

    const { name, description } = req.body;
    await Department.update({ name, description });

    res.status(200).json({ message: "department updated successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Menghapus data departemen berdasarkan ID.
 * @route DELETE /api/departments/:id
 * @access Private
 */
exports.deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) {
      return res.status(404).json({ message: "department not found" });
    }
    await Department.destroy();
    res.status(200).json({ message: "department deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
