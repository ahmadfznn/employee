const { Employee } = require("../models");
const fs = require("fs");
const path = require("path");

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll();
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
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const updates = {};
    const allowedFields = [
      "name",
      "email",
      "phone",
      "password",
      "position",
      "role",
      "salary",
      "addres",
      "status",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (req.file) {
      updates.photo_url = req.file.filename;
    }

    await employee.update(updates);

    res.status(200).json({ message: "Employee updated successfully." });
  } catch (error) {
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
