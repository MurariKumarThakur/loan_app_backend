const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema(
  {
    borrowerName: { type: String, required: true },
    phone: { type: String, required: true },
    amount: { type: Number, required: true },
    interestRate: { type: Number, required: true },
    duration: { type: Date, required: true },
    status: { type: String, default: "Active" },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// ✅ virtual link to transactions
loanSchema.virtual("transactions", {
  ref: "Transaction",
  localField: "_id",
  foreignField: "loanId",
});

loanSchema.set("toObject", { virtuals: true });
loanSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Loan", loanSchema);
