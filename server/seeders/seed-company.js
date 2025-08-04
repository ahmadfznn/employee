"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    // ID ini harus sama dengan company_id yang di-hardcode di seeder employee
    const companyId = "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d";

    await queryInterface.bulkInsert(
      "companies",
      [
        {
          id: companyId,
          name: "PT. Berkah Jaya Sentosa",
          address: "Jl. Merdeka No. 10, Jakarta Pusat",
          phone: "021-1234567",
          email: "contact@berkahjaya.co.id",
          website: "https://www.berkahjaya.co.id",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("companies", null, {});
  },
};
