const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/Registeration");
const EmailOtp = require("../models/EmailOTP");
const { sendOtpEmail } = require("../services/email.service");

const router = express.Router();

const ALLOWED_ROLES = ["patient", "hospital_admin", "admin"];

function generateOtp() {
  // 6-digit numeric
  return String(Math.floor(100000 + Math.random() * 900000));
}

/**
 * POST /api/auth/register
 * body: { email, password, role }
 * Creates user (unverified) and sends OTP to email.
 */
router.post("/register", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "email, password and role are required." });
    }

    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({
        message: `Invalid role. Allowed roles: ${ALLOWED_ROLES.join(", ")}`,
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: "User already exists with this email." });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      email: normalizedEmail,
      passwordHash,
      role,
      isEmailVerified: false,
    });

    // Create OTP record (invalidate previous)
    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);

    await EmailOtp.deleteMany({ email: normalizedEmail });
    await EmailOtp.create({
      email: normalizedEmail,
      otpHash,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      attempts: 0,
    });

    await sendOtpEmail(normalizedEmail, otp);

    return res.status(201).json({
      message: "Registered successfully. OTP sent to email.",
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "User already exists with this email." });
    }
    return res.status(500).json({ message: err.message });
  }
});

/**
 * POST /api/auth/verify-otp
 * body: { email, otp }
 * Verifies OTP and marks user as verified.
 */
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "email and otp are required." });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.isEmailVerified) {
      return res.json({ message: "Email already verified." });
    }

    const record = await EmailOtp.findOne({ email: normalizedEmail });
    if (!record) {
      return res.status(401).json({ message: "OTP not found or expired. Please request again." });
    }

    if (record.expiresAt < new Date()) {
      await EmailOtp.deleteMany({ email: normalizedEmail });
      return res.status(401).json({ message: "OTP expired. Please request again." });
    }

    if (record.attempts >= 5) {
      await EmailOtp.deleteMany({ email: normalizedEmail });
      return res.status(429).json({ message: "Too many attempts. Please request a new OTP." });
    }

    const ok = await bcrypt.compare(String(otp).trim(), record.otpHash);
    if (!ok) {
      record.attempts += 1;
      await record.save();
      return res.status(401).json({ message: "Invalid OTP." });
    }

    // Success: verify email and clear OTPs
    user.isEmailVerified = true;
    await user.save();
    await EmailOtp.deleteMany({ email: normalizedEmail });

    return res.json({ message: "Email verified successfully." });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

/**
 * POST /api/auth/login
 * body: { email, password }
 * Verifies credentials and returns JWT + user object.
 *
 * NOTE:
 * - This implementation allows a registered user to obtain a token when the credentials match,
 *   regardless of isEmailVerified. The response contains isEmailVerified so the frontend can
 *   decide whether to force OTP verification/profile completion before showing protected UI.
 * - If you prefer to disallow login until email is verified, uncomment the check and return 403.
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required." });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // passwordHash is typically select: false, so explicitly select it
    const user = await User.findOne({ email: normalizedEmail }).select("+passwordHash");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const requestedHospital = await RequestedHospital.findOne({ email: normalizedEmail });
    const hospital = await Hospital.findOne({ email: normalizedEmail });

    if (requestedHospital && !hospital) {
      return res.status(403).json({
        message: "Your request is under process. Please wait for approval."
      });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // If you want to require email verification before issuing tokens, uncomment:
    // if (!user.isEmailVerified) {
    //   return res.status(403).json({ message: "Email not verified. Please verify OTP first." });
    // }

    const token = jwt.sign(
      { userId: user._id.toString(), role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );



    return res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;