"use strict";
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const settings = [
      {
        id: uuidv4(),
        standard_work_hours_per_day: 8,
        standard_work_days_per_week: 5,
        start_work_time: "09:00:00",
        end_work_time: "17:00:00",
        overtime_rate_multiplier: 1.5,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    await queryInterface.bulkInsert("company_settings", settings, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("company_settings", null, {});
  },
};
