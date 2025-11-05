const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: 108,
        message: "Token tidak valid atau kadaluarsa",
        data: null,
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          status: 108,
          message: "Token tidak valid atau kadaluarsa",
          data: null,
        });
      }
      req.user = decoded; // simpan payload (id & email)
      next();
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Server error", data: null });
  }
};

module.exports = authMiddleware;
