const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = verifyToken;
