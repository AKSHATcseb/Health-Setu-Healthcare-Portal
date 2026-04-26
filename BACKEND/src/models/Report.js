const mongoose = require("mongoose");

/**
 * Individual parameter sub-document.
 * Stores value, unit, clinical status, and normal range info.
 */
const parameterSchema = new mongoose.Schema(
  {
    value: { type: Number, default: null },
    unit: { type: String, default: "mg/dL" },
    status: {
      type: String,
      enum: ["Normal", "Slightly High", "Mildly High", "Moderate", "High", "Critical", "Low", "Not Found"],
      default: "Not Found",
    },
    normalRange: { type: String, default: "" },
  },
  { _id: false }
);

/**
 * Report schema — stores extracted kidney-function parameters,
 * clinical interpretation, and the original file reference.
 */
const reportSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
      required: true,
      index: true,
    },

    // ---------- extracted parameters ----------
    parameters: {
      urea: { type: parameterSchema, default: () => ({}) },
      creatinine: { type: parameterSchema, default: () => ({}) },
      uric_acid: { type: parameterSchema, default: () => ({}) },
      sodium: { type: parameterSchema, default: () => ({}) },
      potassium: { type: parameterSchema, default: () => ({}) },
      calcium: { type: parameterSchema, default: () => ({}) },
      phosphorus: { type: parameterSchema, default: () => ({}) },
      albumin: { type: parameterSchema, default: () => ({}) },
      total_protein: { type: parameterSchema, default: () => ({}) },
    },

    // ---------- clinical interpretation ----------
    summary: { type: String, default: "" },
    dialysis_risk: {
      type: String,
      enum: ["Low", "Medium", "High", "Unknown"],
      default: "Unknown",
    },
    recommendation: { type: String, default: "" },
    note: {
      type: String,
      default: "This is not a medical diagnosis. Please consult a qualified nephrologist.",
    },
    symptom_alert: { type: String, default: "" },

    // ---------- file metadata ----------
    originalFileName: { type: String, default: "" },
    fileType: { type: String, enum: ["image", "pdf", "unknown"], default: "unknown" },
    rawExtractedText: { type: String, default: "" },

    // ---------- report date (from the report itself, or upload date) ----------
    reportDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
