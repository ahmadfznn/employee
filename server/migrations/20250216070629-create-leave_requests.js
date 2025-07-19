"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("leave_requests", {
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
      leave_type: {
        type: Sequelize.ENUM("annual", "sick", "unpaid", "maternity", "other"),
        allowNull: false,
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      reason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("pending", "approved", "rejected"),
        allowNull: false,
      },
      approved_by: {
        type: Sequelize.UUID,
        references: {
          model: "employees",
          key: "id",
        },
        allowNull: true,
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
    await queryInterface.dropTable("leave_requests");
  },
};
