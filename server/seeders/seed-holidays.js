"use strict";
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const holidays = [
      {
        id: uuidv4(),
        date: "2025-08-17",
        name: "Hari Kemerdekaan RI",
        is_national_holiday: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        date: "2025-05-01",
        name: "Hari Buruh",
        is_national_holiday: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        date: "2025-10-24",
        name: "Cuti Bersama",
        is_national_holiday: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    await queryInterface.bulkInsert("holidays", holidays, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("holidays", null, {});
  },
};
