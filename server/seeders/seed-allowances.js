"use strict";
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const allowances = [
      {
        id: "1c3a7f8e-4b2d-4e6f-b8c7-9a0e1f4b2d9c",
        name: "Tunjangan Transport",
        description: "Tunjangan untuk biaya transportasi",
        default_amount: 500000,
        is_fixed: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "3d5b9c7a-2f4e-4b8a-a1c3-6e8f1d5b9c7a",
        name: "Tunjangan Makan",
        description: "Tunjangan untuk biaya makan",
        default_amount: 300000,
        is_fixed: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    await queryInterface.bulkInsert("allowances", allowances, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("allowances", null, {});
  },
};
