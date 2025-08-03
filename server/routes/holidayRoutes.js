// holidayRoutes.js

const express = require("express");
const holidayRouter = express.Router();
const holidayController = require("../controllers/holidayController");
const verifyToken = require("../middleware/verifyToken");

// Route untuk mendapatkan semua data hari libur
// GET /api/holidays
holidayRouter.get("/", verifyToken, holidayController.getAllHolidays);

// Route untuk mendapatkan data hari libur berdasarkan ID
// GET /api/holidays/:id
holidayRouter.get("/:id", verifyToken, holidayController.getHolidayById);

// Route untuk membuat data hari libur baru
// POST /api/holidays
holidayRouter.post("/", verifyToken, holidayController.createHoliday);

// Route untuk memperbarui data hari libur berdasarkan ID
// PUT /api/holidays/:id
holidayRouter.put("/:id", verifyToken, holidayController.updateHoliday);

// Route untuk menghapus data hari libur berdasarkan ID
// DELETE /api/holidays/:id
holidayRouter.delete("/:id", verifyToken, holidayController.deleteHoliday);

module.exports = holidayRouter;
