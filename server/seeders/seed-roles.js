"use strict";
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const roles = [
      {
        id: "2d1f4d92-2b63-4702-8a4e-1b3294b63e9f",
        name: "Admin",
        base_salary: 10000000,
        description: "Bertanggung jawab atas administrasi sistem",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "3e5f2a1b-9c7d-4e8f-b1a9-8d7a4f6c5e2d",
        name: "Software Engineer",
        base_salary: 8000000,
        description: "Mengembangkan aplikasi dan sistem",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "5b7a3c8e-2f9a-4d7a-b4c1-6e0a3f9e8b7c",
        name: "HR Manager",
        base_salary: 9000000,
        description: "Mengelola sumber daya manusia",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert("roles", roles, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("roles", null, {});
  },
};
