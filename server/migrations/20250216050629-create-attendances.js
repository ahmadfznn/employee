"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("attendances", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      employee_id: {
        type: Sequelize.UUID,
        references: {
          model: "employees",
          key: "id",
        },
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      check_in: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      check_out: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      location_check_in: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      location_check_out: {
        type: Sequelize.JSON,
        allowNull: true,
      },

      status: {
        type: Sequelize.ENUM("present", "absent", "late", "leave"),
        allowNull: false,
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
    await queryInterface.dropTable("attendances");
  },
};
