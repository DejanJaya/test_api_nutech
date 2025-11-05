const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  topUpBalance,
  postTransaction,
  getTransactionHistory,
} = require("../controllers/transactionController");

router.post("/topup", authMiddleware, topUpBalance);
router.post("/transaction", authMiddleware, postTransaction);
router.get("/transaction/history", authMiddleware, getTransactionHistory);

module.exports = router;
