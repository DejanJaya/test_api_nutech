const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { getBalance } = require("../controllers/balanceController");

router.get("/balance", authMiddleware, getBalance);

module.exports = router;
