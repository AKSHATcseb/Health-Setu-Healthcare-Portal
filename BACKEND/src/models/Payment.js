const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  patientId: String,
  amount: Number,
  upiId: String,
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Payment", paymentSchema);