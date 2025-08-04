"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("company_settings", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      standard_work_hours_per_day: {
        type: Sequelize.INTEGER,
        defaultValue: 8,
      },
      standard_work_days_per_week: {
        type: Sequelize.INTEGER,
        defaultValue: 5,
      },
      start_work_time: {
        type: Sequelize.TIME,
        defaultValue: "09:00:00",
      },
      end_work_time: {
        type: Sequelize.TIME,
        defaultValue: "17:00:00",
      },
      overtime_rate_multiplier: {
        type: Sequelize.FLOAT,
        defaultValue: 1.5,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("company_settings");
  },
};
