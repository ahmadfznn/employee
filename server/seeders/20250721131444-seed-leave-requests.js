'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('leave_requests', [
      {
        id: Sequelize.literal('gen_random_uuid()'), 
        employee_id: '6a5cf7cf-7348-4240-86ac-e15457a558bb',
        leave_type: 'annual',
        start_date: '2025-08-01',
        end_date: '2025-08-05',
        reason: 'Annual leave to visit family out of town.',
        status: 'approved',
        approved_by: 'afd7f849-7288-4744-8f45-7f33c5ada675',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: Sequelize.literal('gen_random_uuid()'),
        employee_id: 'ac09aab7-0053-4292-8974-fe7f1c504cf0', 
        leave_type: 'sick',
        start_date: '2025-07-20',
        end_date: '2025-07-20',
        reason: 'High fever and flu symptoms.',
        status: 'pending', 
        approved_by: null, 
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: Sequelize.literal('gen_random_uuid()'),
        employee_id: '6a5cf7cf-7348-4240-86ac-e15457a558bb',
        leave_type: 'unpaid',
        start_date: '2025-09-10',
        end_date: '2025-09-12',
        reason: 'Personal matters, urgent family event.',
        status: 'rejected',
        approved_by: 'afd7f849-7288-4744-8f45-7f33c5ada675',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: Sequelize.literal('gen_random_uuid()'),
        employee_id: 'ac09aab7-0053-4292-8974-fe7f1c504cf0',
        leave_type: 'maternity',
        start_date: '2025-10-01',
        end_date: '2026-01-01',
        reason: 'Maternity leave for childbirth and recovery.',
        status: 'approved',
        approved_by: 'afd7f849-7288-4744-8f45-7f33c5ada675',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('leave_requests', null, {}); 
  }
};