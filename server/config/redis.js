const Redis = require("ioredis");

const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || null,
  tls: process.env.REDIS_TLS === "true" ? {} : undefined,
});

redis.on("connect", () => console.log("Redis Connected!"));
redis.on("error", (err) => console.error("Redis Error:", err));

module.exports = redis;
