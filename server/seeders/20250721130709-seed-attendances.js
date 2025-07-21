'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('attendances', [
      {
        id: Sequelize.literal('gen_random_uuid()'), 
        employee_id: '6a5cf7cf-7348-4240-86ac-e15457a558bb',
        date: '2025-07-15', 
        check_in: '2025-07-15T08:00:00Z', 
        check_out: '2025-07-15T17:00:00Z', 
        location_check_in: JSON.stringify({ latitude: -6.2088, longitude: 106.8456, address: 'Office Jakarta' }), 
        location_check_out: JSON.stringify({ latitude: -6.2088, longitude: 106.8456, address: 'Office Jakarta' }),
        status: 'present',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: Sequelize.literal('gen_random_uuid()'),
        employee_id: '6a5cf7cf-7348-4240-86ac-e15457a558bb',
        date: '2025-07-16',
        check_in: null, 
        check_out: null,
        location_check_in: null,
        location_check_out: null,
        status: 'absent', 
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: Sequelize.literal('gen_random_uuid()'),
        employee_id: '6a5cf7cf-7348-4240-86ac-e15457a558bb',
        date: '2025-07-17',
        check_in: '2025-07-17T08:05:00Z',
        check_out: '2025-07-17T17:00:00Z',
        location_check_in: JSON.stringify({ latitude: -6.2088, longitude: 106.8456, address: 'Office Jakarta' }),
        location_check_out: JSON.stringify({ latitude: -6.2088, longitude: 106.8456, address: 'Office Jakarta' }),
        status: 'present',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('attendances', null, {});
  }
};