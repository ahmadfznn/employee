"use strict";
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const departments = [
      {
        id: "7a2c4e8f-1b5d-4a9c-b2e0-3f4d6e9b7c1a",
        name: "IT Department",
        description: "Menangani semua hal terkait teknologi informasi",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "9d1f5b6c-8a2e-4c7a-b3d0-5e8f1c4a9b0c",
        name: "Human Resources",
        description: "Mengelola rekrutmen dan kesejahteraan karyawan",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    await queryInterface.bulkInsert("departments", departments, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("departments", null, {});
  },
};
