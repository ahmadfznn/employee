const express = require("express");
const notificationController = require("../controllers/notificationController");

const notificationRouter = express.Router();

notificationRouter.post("/", notificationController.sendNotification);

notificationRouter.get(
  "/employee/:employee_id",
  notificationController.getNotificationsByEmployee
);

notificationRouter.put("/:id/read", notificationController.markAsRead);

notificationRouter.delete("/:id", notificationController.deleteNotification);

module.exports = notificationRouter;
