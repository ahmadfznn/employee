const { Notification, Employee } = require("../models");
const transporter = require("../config/transporter");

exports.sendNotification = async (req, res) => {
  try {
    const { employee_id, title, message, type } = req.body;

    const employee = await Employee.findByPk(employee_id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: employee.email,
      subject: title,
      text: message,
    };

    await transporter.sendMail(mailOptions);

    const notification = await Notification.create({
      employee_id,
      title,
      message,
      type,
    });

    return res
      .status(201)
      .json({ message: "Notification sent and saved", notification });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getNotificationsByEmployee = async (req, res) => {
  try {
    const { employee_id } = req.params;

    const employee = await Employee.findByPk(employee_id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const notifications = await Notification.findAll({
      where: { employee_id },
      order: [["created_at", "DESC"]],
    });

    if (notifications.length === 0) {
      return res
        .status(404)
        .json({ message: "No notifications found for this employee" });
    }

    return res.status(200).json({ notifications });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.is_read = true;
    await notification.save();

    return res
      .status(200)
      .json({ message: "Notification marked as read", notification });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    await notification.destroy();

    return res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
