"use strict";
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    const employees = [];
    const passwordHash = await bcrypt.hash("password123", 10);

    const employeeNames = [
      "Ahmad Fauzan",
      "Rizky Maulana",
      "Dewi Sartika",
      "Budi Santoso",
      "Indah Permata",
      "Dian Purnama",
      "Rina Andriana",
      "Agus Wijaya",
      "Siti Rohmah",
      "Farhan Alamsyah",
      "Nurul Hidayati",
      "Eko Prasetyo",
      "Fadli Ramadhan",
      "Rizka Amelia",
      "Hendro Kusuma",
      "Lina Marlina",
      "Bayu Saputra",
      "Dian Pertiwi",
      "Satria Wibawa",
      "Taufik Hidayat",
    ];

    const positions = [
      "Software Engineer",
      "UI/UX Designer",
      "HR Specialist",
      "Marketing Executive",
      "Accountant",
      "Data Analyst",
      "Sales Representative",
      "Customer Support",
      "IT Support",
      "Project Manager",
      "Finance Manager",
      "Legal Advisor",
      "Network Engineer",
      "System Administrator",
      "Operations Manager",
      "Copywriter",
      "Content Creator",
      "Quality Assurance",
      "Business Analyst",
      "Product Manager",
    ];

    for (let i = 0; i < 20; i++) {
      employees.push({
        id: uuidv4(),
        name: employeeNames[i],
        email: `employee${i + 1}@company.com`,
        phone: `081234567${(i % 10) + 1}`,
        password: passwordHash,
        position: positions[i],
        role: "employee",
        salary: 5000000,
        photo_url: null,
        address: `Jl. ${employeeNames[i]} No. ${i + 1}, Jakarta`,
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    const adminNames = ["Adi Wijaya", "Sarah Ananda"];
    for (let i = 0; i < 2; i++) {
      employees.push({
        id: uuidv4(),
        name: adminNames[i],
        email: `admin${i + 1}@company.com`,
        phone: `0812345678${i + 1}`,
        password: passwordHash,
        position: "Administrator",
        role: "admin",
        salary: 6000000,
        photo_url: null,
        address: `Jl. ${adminNames[i]} No. ${i + 21}, Jakarta`,
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    employees.push({
      id: uuidv4(),
      name: "Rudi Hartanto",
      email: "manager1@company.com",
      phone: "08123456789",
      password: passwordHash,
      position: "General Manager",
      role: "manager",
      salary: 10000000,
      photo_url: null,
      address: "Jl. Rudi Hartanto No. 23, Jakarta",
      status: "active",
      created_at: new Date(),
      updated_at: new Date(),
    });

    await queryInterface.bulkInsert("employees", employees, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("employees", null, {});
  },
};
