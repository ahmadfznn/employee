// holidayRoutes.js

const express = require("express");
const holidayRouter = express.Router();
const holidayController = require("../controllers/holidayController");

// GET /api/holidays
holidayRouter.get("/", holidayController.getAllHolidays);

// Route untuk mendapatkan data hari libur berdasarkan ID
// GET /api/holidays/:id
holidayRouter.get("/:id", holidayController.getHolidayById);

// Route untuk membuat data hari libur baru
// POST /api/holidays
holidayRouter.post("/", holidayController.createHoliday);

// Route untuk memperbarui data hari libur berdasarkan ID
// PUT /api/holidays/:id
holidayRouter.put("/:id", holidayController.updateHoliday);

// Route untuk menghapus data hari libur berdasarkan ID
// DELETE /api/holidays/:id
holidayRouter.delete("/:id", holidayController.deleteHoliday);

module.exports = holidayRouter;
