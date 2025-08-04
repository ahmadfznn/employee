"use strict";
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    const employees = [];
    const passwordHash = await bcrypt.hash("password123", 10);
    const companyId = "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d"; // Hardcode company ID
    const hardcodedEmployeeId = "6a5cf7cf-7348-4240-86ac-e15457a558bb"; // Hardcode employee ID

    // Karyawan pertama dengan ID yang di-hardcode
    employees.push({
      id: hardcodedEmployeeId,
      name: "Ahmad Fauzan",
      email: "ahmad@company.com",
      phone: "081234567890",
      password: passwordHash,
      position: "Software Engineer",
      role: "admin",
      department: "IT",
      salary: 8000000,
      photo_url: null,
      address: "Jl. Ahmad Fauzan No. 1, Jakarta",
      status: "active",
      company_id: companyId, // Menggunakan company_id yang di-hardcode
      created_at: new Date(),
      updated_at: new Date(),
    });

    const employeeNames = [
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

    // Sisanya menggunakan UUID acak
    for (let i = 0; i < 19; i++) {
      employees.push({
        id: uuidv4(),
        name: employeeNames[i],
        email: `employee${i + 1}@company.com`,
        phone: `081234567${(i % 10) + 1}`,
        password: passwordHash,
        position: positions[i],
        role: "employee",
        department: "IT",
        salary: 5000000,
        photo_url: null,
        address: `Jl. ${employeeNames[i]} No. ${i + 1}, Jakarta`,
        status: "active",
        company_id: companyId,
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
        department: "IT",
        salary: 6000000,
        photo_url: null,
        address: `Jl. ${adminNames[i]} No. ${i + 21}, Jakarta`,
        status: "active",
        company_id: companyId,
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
      department: "IT",
      salary: 10000000,
      photo_url: null,
      address: "Jl. Rudi Hartanto No. 23, Jakarta",
      status: "active",
      company_id: companyId,
      created_at: new Date(),
      updated_at: new Date(),
    });

    await queryInterface.bulkInsert("employees", employees, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("employees", null, {});
  },
};
