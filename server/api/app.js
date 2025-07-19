const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const { Server } = require("socket.io");
const helmet = require("helmet");
const http = require("http");
const router = require("../routes/router");
const cookieParser = require("cookie-parser");

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  allowEIO3: true,
});

let onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("user-online", (userId) => {
    if (!userId) return;
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} is online`);
    io.emit("update-user-status", Array.from(onlineUsers.keys()));
  });

  socket.on("disconnect", () => {
    let userId = [...onlineUsers.entries()].find(([_, id]) => id === socket.id);
    if (userId) {
      onlineUsers.delete(userId[0]);
      console.log(`User ${userId[0]} is offline`);
      io.emit("update-user-status", Array.from(onlineUsers.keys()));
    }
  });
});

app.use("/api", router);
app.use("/uploads", express.static("uploads"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.server = server;

module.exports = app;
