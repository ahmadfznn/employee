'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('payrolls', [
      {
        id: Sequelize.literal('gen_random_uuid()'),
        employee_id: '6a5cf7cf-7348-4240-86ac-e15457a558bb', 
        month: 'June',
        base_salary: 5000000.00,
        bonus: 500000.00,
        deductions: 150000.00,
        total_salary: 5350000.00,
        status: 'paid',
        payment_date: new Date('2025-07-05T00:00:00Z'),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: Sequelize.literal('gen_random_uuid()'),
        employee_id: '6a5cf7cf-7348-4240-86ac-e15457a558bb',
        month: 'July',
        base_salary: 7500000.00,
        bonus: 1000000.00,
        deductions: 250000.00,
        total_salary: 8250000.00,
        status: 'pending',
        payment_date: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: Sequelize.literal('gen_random_uuid()'),
        employee_id: '6a5cf7cf-7348-4240-86ac-e15457a558bb',
        month: 'August',
        base_salary: 5000000.00,
        bonus: 0.00,
        deductions: 100000.00,
        total_salary: 4900000.00,
        status: 'pending',
        payment_date: null,
        created_at: new Date(),
        updated_at: new Date(),
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('payrolls', null, {}); 
  }
};