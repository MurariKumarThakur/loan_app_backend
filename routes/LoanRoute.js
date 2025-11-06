// routes/loanRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const Loan = require("../models/Loan");
const Transaction = require("../models/Transaction");

// 🧠 Create Loan
router.post("/", protect, async (req, res) => {
  try {
    const { borrowerName, phone, amount, interestRate, duration, status } =
      req.body;

    const loan = new Loan({
      borrowerName,
      phone,
      amount,
      interestRate,
      duration,
      status,
      userId: req.user._id, // logged in user ID
    });

    await loan.save();
    res.status(201).json(loan);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating loan", error: err.message });
  }
});

// 📋 Get all loans for logged-in user (with transaction totals)
router.get("/", protect, async (req, res) => {
  try {
    const loans = await Loan.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    // Attach transaction totals for each loan
    const enrichedLoans = await Promise.all(
      loans.map(async (loan) => {
        const transactions = await Transaction.find({ loanId: loan._id });

        const totalCredit = transactions
          .filter((t) => t.type === "Credit")
          .reduce((sum, t) => sum + t.amount, 0);

        const totalDebit = transactions
          .filter((t) => t.type === "Debit")
          .reduce((sum, t) => sum + t.amount, 0);

        return { ...loan, totalCredit, totalDebit };
      })
    );

    res.json(enrichedLoans);
  } catch (err) {
    console.error("Error fetching loans:", err);
    res
      .status(500)
      .json({ message: "Error fetching loans", error: err.message });
  }
});

// ✏️ Update loan
router.put("/:id", protect, async (req, res) => {
  try {
    const loan = await Loan.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!loan) return res.status(404).json({ message: "Loan not found" });

    Object.assign(loan, req.body);
    await loan.save();
    res.json(loan);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating loan", error: err.message });
  }
});

// ❌ Delete loan
router.delete("/:id", protect, async (req, res) => {
  try {
    const loan = await Loan.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!loan) return res.status(404).json({ message: "Loan not found" });

    // Also delete transactions linked to this loan
    await Transaction.deleteMany({ loanId: loan._id });

    res.json({ message: "Loan and related transactions deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting loan", error: err.message });
  }
});

module.exports = router;
