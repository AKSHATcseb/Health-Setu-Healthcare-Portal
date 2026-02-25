const express = require("express");
const verifyFirebaseToken = require("../middleware/auth.middleware");
const User = require("../models/User");

const router = express.Router();


router.get("/me", verifyFirebaseToken, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });

    if (!user) {
      return res.status(404).json({
        message: "User profile not found",
      });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put("/me", verifyFirebaseToken, async (req, res) => {
  try {
    delete req.body.role;
    delete req.body.firebaseUid;
    delete req.body.email;

    const updatedUser = await User.findOneAndUpdate(
      { firebaseUid: req.user.uid },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found. Please login first.",
      });
    }

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/me/medical", verifyFirebaseToken, async (req, res) => {
  try {
    const { bloodGroup, dialysisType } = req.body;

    const user = await User.findOne({ firebaseUid: req.user.uid });

    if (!user) return res.status(404).json({ message: "User not found" });

    user.medicalInfo = {
      bloodGroup,
      dialysisType,
    };

    await user.save();

    res.json({
      message: "Medical info updated successfully",
      medicalInfo: user.medicalInfo,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put("/me/emergency", verifyFirebaseToken, async (req, res) => {
  try {
    const { name, phone, relation } = req.body;

    const user = await User.findOne({ firebaseUid: req.user.uid });

    if (!user) return res.status(404).json({ message: "User not found" });

    user.emergencyContact = { name, phone, relation };

    await user.save();

    res.json({
      message: "Emergency contact updated successfully",
      emergencyContact: user.emergencyContact,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/me", verifyFirebaseToken, async (req, res) => {
  try {
    await User.findOneAndDelete({ firebaseUid: req.user.uid });

    res.json({
      message: "User account deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
