// rolesController.js

const role = require("../models");

/**
 * @description Mendapatkan semua data role.
 * @route GET /api/roles
 * @access Private
 */
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await role.findAll();
    res.status(200).json({ data: roles });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Mendapatkan data role berdasarkan ID.
 * @route GET /api/roles/:id
 * @access Private
 */
exports.getRoleById = async (req, res) => {
  try {
    const role = await role.findByPk(req.params.id);
    if (!role) {
      return res.status(404).json({ message: "role not found" });
    }
    res.status(200).json({ data: role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Membuat data role baru.
 * @route POST /api/roles
 * @access Private
 */
exports.createRole = async (req, res) => {
  try {
    const { name, base_salary, description } = req.body;
    await role.create({ name, base_salary, description });
    res.status(201).json({ message: "role created successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Memperbarui data role berdasarkan ID.
 * @route PUT /api/roles/:id
 * @access Private
 */
exports.updateRole = async (req, res) => {
  try {
    const role = await role.findByPk(req.params.id);
    if (!role) {
      return res.status(404).json({ message: "role not found" });
    }

    const { name, base_salary, description } = req.body;
    await role.update({ name, base_salary, description });

    res.status(200).json({ message: "role updated successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Menghapus data role berdasarkan ID.
 * @route DELETE /api/roles/:id
 * @access Private
 */
exports.deleteRole = async (req, res) => {
  try {
    const role = await role.findByPk(req.params.id);
    if (!role) {
      return res.status(404).json({ message: "role not found" });
    }
    await role.destroy();
    res.status(200).json({ message: "role deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
