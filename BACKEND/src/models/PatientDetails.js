const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Registration", index: true, unique: true, sparse: true },

    fullName: { type: String, required: true, trim: true },
    mobileNumber: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },

    age: { type: Number, required: true, min: 0 },
    gender: { type: String, required: true },
    bloodGroup: { type: String, required: true },

    address: { type: String, required: true },
    latitude: { type: Number, default: null, required: true },
    longitude: { type: Number, default: null, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);