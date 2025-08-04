"use strict";
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const employeeAllowances = [
      {
        id: "4b6c8e9f-2d1e-4f3a-b5c6-7a8e9d0c1b2f",
        // Ganti dengan employee_id yang valid
        employee_id: "6a5cf7cf-7348-4240-86ac-e15457a558bb",
        // Ganti dengan allowance_id yang valid
        allowance_id: "1c3a7f8e-4b2d-4e6f-b8c7-9a0e1f4b2d9c",
        amount: 500000,
        effective_date: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    await queryInterface.bulkInsert(
      "employee_allowances",
      employeeAllowances,
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("employee_allowances", null, {});
  },
};
