// holidaysController.js

const { Holiday } = require("../models");

/**
 * @description Mendapatkan semua data hari libur.
 * @route GET /api/holidays
 * @access Private
 */
exports.getAllHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.findAll();
    res.status(200).json({ data: holidays });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Mendapatkan data hari libur berdasarkan ID.
 * @route GET /api/holidays/:id
 * @access Private
 */
exports.getHolidayById = async (req, res) => {
  try {
    const holiday = await Holiday.findByPk(req.params.id);
    if (!holiday) {
      return res.status(404).json({ message: "holiday not found" });
    }
    res.status(200).json({ data: holiday });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Membuat data hari libur baru.
 * @route POST /api/holidays
 * @access Private
 */
exports.createHoliday = async (req, res) => {
  try {
    const { date, name, is_national_holiday } = req.body;
    await Holiday.create({ date, name, is_national_holiday });
    res.status(201).json({ message: "holiday created successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Memperbarui data hari libur berdasarkan ID.
 * @route PUT /api/holidays/:id
 * @access Private
 */
exports.updateHoliday = async (req, res) => {
  try {
    const holiday = await Holiday.findByPk(req.params.id);
    if (!holiday) {
      return res.status(404).json({ message: "holiday not found" });
    }

    const { date, name, is_national_holiday } = req.body;
    await Holiday.update({ date, name, is_national_holiday });

    res.status(200).json({ message: "holiday updated successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Menghapus data hari libur berdasarkan ID.
 * @route DELETE /api/holidays/:id
 * @access Private
 */
exports.deleteHoliday = async (req, res) => {
  try {
    const holiday = await Holiday.findByPk(req.params.id);
    if (!holiday) {
      return res.status(404).json({ message: "holiday not found" });
    }
    await Holiday.destroy();
    res.status(200).json({ message: "holiday deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
