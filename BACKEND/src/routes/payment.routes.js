const QRCode = require("qrcode");
// const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
// const { requireAuth } = require("../middleware/authMiddleware");

// Controller
const generateUPIQR = async (req, res) => {
  try {
    const { amount, name, upiID } = req.body;

    // 🔗 Build UPI URL
    const upiUrl = `upi://pay?pa=${upiID}&pn=${encodeURIComponent(
      name
    )}&am=${amount}&cu=INR`;

    // 🎯 Generate QR
    const qrCode = await QRCode.toDataURL(upiUrl);

    res.json({ qrCode, upiUrl });
  } catch (err) {
    res.status(500).json({ error: "QR generation failed" });
  }
};

router.post("/", generateUPIQR);

module.exports = router;