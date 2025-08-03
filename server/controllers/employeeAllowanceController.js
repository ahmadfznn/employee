// employeeAllowancesController.js

const employeeAllowance = require("../models");

/**
 * @description Mendapatkan semua tunjangan karyawan.
 * @route GET /api/employee-allowances
 * @access Private
 */
exports.getAllEmployeeAllowances = async (req, res) => {
  try {
    const employeeAllowances = await employeeAllowance.findAll();
    res.status(200).json({ data: employeeAllowances });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Mendapatkan tunjangan karyawan berdasarkan ID.
 * @route GET /api/employee-allowances/:id
 * @access Private
 */
exports.getEmployeeAllowanceById = async (req, res) => {
  try {
    const employeeAllowance = await employeeAllowance.findByPk(req.params.id);
    if (!employeeAllowance) {
      return res.status(404).json({ message: "Employee allowance not found" });
    }
    res.status(200).json({ data: employeeAllowance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Mendapatkan tunjangan untuk karyawan tertentu.
 * @route GET /api/employees/:employeeId/allowances
 * @access Private
 */
exports.getAllowancesByEmployee = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    const employeeAllowances = await employeeAllowance.findAll({
      where: { employee_id: employeeId },
    });
    res.status(200).json({ data: employeeAllowances });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Menambahkan tunjangan untuk karyawan.
 * @route POST /api/employee-allowances
 * @access Private
 */
exports.createEmployeeAllowance = async (req, res) => {
  try {
    const { employee_id, allowance_id, amount, effective_date } = req.body;
    await employeeAllowance.create({
      employee_id,
      allowance_id,
      amount,
      effective_date,
    });
    res
      .status(201)
      .json({ message: "Employee allowance created successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Memperbarui tunjangan karyawan berdasarkan ID.
 * @route PUT /api/employee-allowances/:id
 * @access Private
 */
exports.updateEmployeeAllowance = async (req, res) => {
  try {
    const employeeAllowance = await employeeAllowance.findByPk(req.params.id);
    if (!employeeAllowance) {
      return res.status(404).json({ message: "Employee allowance not found" });
    }

    const { employee_id, allowance_id, amount, effective_date } = req.body;
    await employeeAllowance.update({
      employee_id,
      allowance_id,
      amount,
      effective_date,
    });

    res
      .status(200)
      .json({ message: "Employee allowance updated successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Menghapus tunjangan karyawan berdasarkan ID.
 * @route DELETE /api/employee-allowances/:id
 * @access Private
 */
exports.deleteEmployeeAllowance = async (req, res) => {
  try {
    const employeeAllowance = await employeeAllowance.findByPk(req.params.id);
    if (!employeeAllowance) {
      return res.status(404).json({ message: "Employee allowance not found" });
    }
    await employeeAllowance.destroy();
    res
      .status(200)
      .json({ message: "Employee allowance deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
