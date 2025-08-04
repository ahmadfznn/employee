"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "notifications",
      [
        {
          id: Sequelize.literal("gen_random_uuid()"),
          employee_id: "6a5cf7cf-7348-4240-86ac-e15457a558bb",
          title: "Gaji Bulan Juli Sudah Cair!",
          message:
            "Gaji pokok dan bonus Anda untuk periode Juli 2025 telah ditransfer ke rekening. Silakan cek detail di menu Payroll.",
          type: "salary",
          is_read: false,
          created_at: new Date(),
        },
        {
          id: Sequelize.literal("gen_random_uuid()"),
          employee_id: "6a5cf7cf-7348-4240-86ac-e15457a558bb",
          title: "Permohonan Cuti Disetujui",
          message:
            "Permohonan cuti tahunan Anda dari 1 Agustus hingga 5 Agustus 2025 telah disetujui. Selamat menikmati liburan!",
          type: "leave",
          is_read: false,
          created_at: new Date(),
        },
        {
          id: Sequelize.literal("gen_random_uuid()"),
          employee_id: "6a5cf7cf-7348-4240-86ac-e15457a558bb",
          title: "Pengumuman Penting: Evaluasi Kinerja",
          message:
            "Mohon siapkan laporan kinerja Anda untuk evaluasi triwulan pada tanggal 25 Juli 2025.",
          type: "general",
          is_read: true,
          created_at: new Date(),
        },
        {
          id: Sequelize.literal("gen_random_uuid()"),
          employee_id: "6a5cf7cf-7348-4240-86ac-e15457a558bb",
          title: "Reminder: Absen Harian",
          message:
            "Jangan lupa untuk melakukan check-in dan check-out harian Anda.",
          type: "general",
          is_read: false,
          created_at: new Date(),
        },
        {
          id: Sequelize.literal("gen_random_uuid()"),
          employee_id: "6a5cf7cf-7348-4240-86ac-e15457a558bb",
          title: "Permohonan Cuti Ditolak",
          message:
            "Permohonan cuti Anda untuk tanggal 21 Juli 2025 ditolak. Mohon hubungi HR untuk detail lebih lanjut.",
          type: "leave",
          is_read: false,
          created_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("notifications", null, {});
  },
};
