"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("employees", "role_id", {
      type: Sequelize.UUID,
      references: {
        model: "roles", // Nama tabel roles
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addColumn("employees", "department_id", {
      type: Sequelize.UUID,
      references: {
        model: "departments", // Nama tabel departments
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("employees", "role_id");
    await queryInterface.removeColumn("employees", "department_id");
  },
};
