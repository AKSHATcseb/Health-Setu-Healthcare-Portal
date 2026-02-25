const express = require("express");
const verifyFirebaseToken = require("../middleware/auth.middleware");
const User = require("../models/User");

const router = express.Router();

router.post("/login", verifyFirebaseToken, async (req, res) => {
  try {
    const { uid, email, email_verified } = req.user;

    if (email && !email_verified) {
      return res.status(403).json({
        message: "Email not verified. Please verify first.",
      });
    }

    const { role, name } = req.body;

    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        role,
        name,
        email,
      });
    }

    res.json({
      message: "Login successful",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
