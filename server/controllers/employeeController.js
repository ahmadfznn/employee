const { Employee } = require("../models");
const fs = require("fs");
const path = require("path");

exports.getAllEmployees = async (req, res) => {
  try {
    const { sortBy, order } = req.query;

    const allowedSortBy = ["name", "position", "created_at", "updated_at"];
    const sortField = allowedSortBy.includes(sortBy) ? sortBy : "updated_at";
    const sortOrder = order === "asc" ? "ASC" : "DESC";

    const sortOptions = [[sortField, sortOrder]];

    const employees = await Employee.findAll({
      order: sortOptions,
    });

    console.log(`Employee : ${employees}`);
    res.status(200).json({ data: employees });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ data: employee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      position,
      role,
      salary,
      address,
      status,
    } = req.body;
    const photo_url = req.file ? req.file.photo : null;

    await Employee.create({
      name,
      email,
      phone,
      password,
      photo_url,
      position,
      salary,
      role,
      address,
      status,
    });
    res.status(201).json({ message: "Employee added successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    console.log(req.params.id);
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const updates = {};
    const allowedFields = [
      "name",
      "email",
      "phone",
      "password", // Tambahkan password di sini untuk di-handle
      "position",
      "role",
      "photo_url",
      "address",
      "salary", // Tambahkan salary di sini jika memungkinkan untuk di-update
      "status", // Tambahkan status di sini
    ];

    allowedFields.forEach((field) => {
      // Hanya masukkan field yang ada di body request
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Jika ada password baru, hash terlebih dahulu sebelum di-update
    if (updates.password) {
      const bcrypt = require("bcrypt");
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    // Perbaikan ada di baris ini
    // Opsi `fields: Object.keys(updates)` akan membatasi validasi hanya pada field yang di-update
    await employee.update(updates, { fields: Object.keys(updates) });

    res.status(200).json({ message: "Employee updated successfully." });
  } catch (error) {
    // Tangani error validasi Sequelize secara spesifik untuk debug yang lebih mudah
    if (error.name === "SequelizeValidationError") {
      const messages = error.errors.map((err) => err.message);
      return res
        .status(400)
        .json({ message: "Validation error", errors: messages });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (employee.photo_url) {
      const filePath = path.join(__dirname, "../uploads", employee.photo_url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await employee.destroy();
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
