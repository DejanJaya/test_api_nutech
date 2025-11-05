const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getServices } = require("../controllers/servicesController");

router.get("/services", authMiddleware, getServices);

module.exports = router;
