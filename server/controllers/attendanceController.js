const { Attendance, Employee } = require("../models");

const OFFICE_LATITUDE = -7.24574;
const OFFICE_LONGITUDE = 108.170245;

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRadians = (degree) => (degree * Math.PI) / 180;
  const R = 6371 * 1000;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

exports.createAttendance = async (req, res) => {
  try {
    const {
      employee_id,
      date,
      status,
      check_in,
      check_out,
      location_check_in,
      location_check_out,
    } = req.body;

    if (
      !location_check_in ||
      !location_check_in.latitude ||
      !location_check_in.longitude
    ) {
      return res.status(400).json({ message: "Location check-in is required" });
    }

    const employee = await Employee.findByPk(employee_id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const distance = calculateDistance(
      OFFICE_LATITUDE,
      OFFICE_LONGITUDE,
      location_check_in.latitude,
      location_check_in.longitude
    );

    if (distance > 50) {
      return res.status(400).json({
        message: "You must be within 50 meters of the office to check-in",
      });
    }

    const attendance = await Attendance.create({
      employee_id,
      date,
      status,
      check_in,
      check_out,
      location_check_in,
      location_check_out,
    });

    return res.status(201).json({ message: "Attendance created", attendance });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { check_out, location_check_out, status } = req.body;

    const attendance = await Attendance.findByPk(id);
    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    attendance.check_out = check_out;
    attendance.location_check_out = location_check_out;
    attendance.status = status || attendance.status;

    await attendance.save();

    return res.status(200).json({ message: "Attendance updated", attendance });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAttendanceByEmployee = async (req, res) => {
  try {
    const { employee_id } = req.params;

    const attendances = await Attendance.findAll({
      where: { employee_id },
      include: [
        {
          model: Employee,
          attributes: ["name", "email", "position"],
          as: "employee",
        },
      ],
    });

    if (attendances.length === 0) {
      return res
        .status(404)
        .json({ message: "No attendance records found for this employee" });
    }

    return res.status(200).json({ attendances });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.params;

    const attendances = await Attendance.findAll({
      where: { date },
      include: [
        {
          model: Employee,
          as: "employee",
          attributes: ["id", "name", "email", "position"],
        },
      ],
    });

    if (attendances.length === 0) {
      return res
        .status(404)
        .json({ message: "No attendance records found for this date" });
    }

    return res.status(200).json({ data: attendances });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const attendance = await Attendance.findByPk(id);
    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    await attendance.destroy();

    return res.status(200).json({ message: "Attendance deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
