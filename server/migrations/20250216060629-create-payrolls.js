"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("payrolls", {
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
      month: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      base_salary: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      bonus: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      deductions: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      total_salary: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("pending", "paid"),
        allowNull: false,
      },
      payment_date: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable("payrolls");
  },
};
