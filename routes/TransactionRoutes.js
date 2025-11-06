const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const Loan = require("../models/Loan");
const { protect } = require("../middleware/auth");

// ✅ Get all transactions for a loan
router.get("/:loanId", protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      loanId: req.params.loanId,
      userId: req.user._id,
    }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Add a new transaction
router.post("/", protect, async (req, res) => {
  try {
    const { loanId, amount, type, note, date } = req.body;

    if (!loanId || !amount || !type)
      return res
        .status(400)
        .json({ message: "loanId, amount and type are required" });

    const loan = await Loan.findById(loanId);
    if (!loan) return res.status(404).json({ message: "Loan not found" });

    const transaction = await Transaction.create({
      loanId,
      userId: req.user._id,
      amount,
      type,
      note,
      date,
    });

    res.status(201).json(transaction);
  } catch (err) {
    console.error("Error adding transaction:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Delete a transaction
router.delete("/:id", protect, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });

    if (transaction.userId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    await transaction.deleteOne();
    res.json({ message: "Transaction deleted successfully" });
  } catch (err) {
    console.error("Error deleting transaction:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
