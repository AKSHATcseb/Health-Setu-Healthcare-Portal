const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["patient", "hospital_admin", "admin"], required: true },

    // OTP flow / verification
    otp: { type: String },
    otpExpiresAt: { type: Date },
    isVerified: { type: Boolean, default: false }, // set true after OTP verify
    isRegistered: { type: Boolean, default: false }, // set true after completing profile
  },
  { timestamps: true }
);

module.exports = mongoose.model("Registration", registerSchema);