const mongoose = require("mongoose");

/* ---------------- SLOT SCHEMA ---------------- */
const SlotSchema = new mongoose.Schema(
  {
    numberOf4HrsSessionsPerDay: { type: Number, default: 0, min: 0 },
    numberOf6HrsSessionsPerDay: { type: Number, default: 0, min: 0 },

    firstStart4h: { type: String, default: "09:00" },
    firstStart6h: { type: String, default: "09:00" },

    slots4h: [
      {
        start: String,
        end: String
      }
    ],
    slots6h: [
      {
        start: String,
        end: String
      }
    ],
  },
  { _id: false }
);

/* ---------------- MAIN SCHEMA ---------------- */
const RequestedHospitalSchema = new mongoose.Schema(
  {
    /* ---------- BASIC INFO ---------- */
    hospitalName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },

    registrationNumber: {
      type: String,
      required: true,
      trim: true,
      match: [/^\d{10}$/, "Must be exactly 10 digits"],
    },

    /* ---------- OPERATING ---------- */
    is24x7: { type: Boolean, default: false },
    operatingHours: { type: mongoose.Schema.Types.Mixed, default: {} },

    /* ---------- SLOTS ---------- */
    slots: { type: SlotSchema, default: () => ({}) },

    /* ---------- DIALYSIS ---------- */
    dialysisSeats: { type: Number, min: 0 },

    dialysisType: {
      type: String,
      enum: ["hemodialysis", "peritoneal dialysis", "both"],
      required: true,
    },

    /* ---------- PRICING ---------- */
    priceFor4Hrs: { type: Number, min: 0, default: null },
    priceFor6Hrs: { type: Number, min: 0, default: null },
    priceForPD: { type: Number, min: 0, default: null },

    /* ---------- LOCATION ---------- */
    address: { type: String, trim: true, default: "" },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },

    /* ---------- BANK ---------- */
    accountHolderName: { type: String, trim: true, default: "" },
    upiID: { type: String, trim: true, default: "" },

    /* ---------- WORKFLOW ---------- */
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "changes_requested"],
      default: "pending",
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

/* ---------------- INDEXES ---------------- */
RequestedHospitalSchema.index({ email: 1 });
RequestedHospitalSchema.index({ registrationNumber: 1 });
RequestedHospitalSchema.index({ userId: 1 });

/* ---------------- CUSTOM VALIDATION + NORMALIZATION ---------------- */
RequestedHospitalSchema.pre("validate", function () {
  /* ---------- STEP 1: NORMALIZE INPUT ---------- */
  if (this.dialysisType) {
    const dt = this.dialysisType.toLowerCase().trim();

    if (["hemo", "hd"].includes(dt)) {
      this.dialysisType = "hemodialysis";
    } else if (["peritoneal", "pd"].includes(dt)) {
      this.dialysisType = "peritoneal dialysis";
    } else if (dt === "both") {
      this.dialysisType = "both";
    }
  }

  /* ---------- STEP 2: VALIDATION ---------- */
  const dt = (this.dialysisType || "").toLowerCase().trim();

  const isHemodialysis = dt === "hemodialysis";
  const isPeritoneal = dt === "peritoneal dialysis";
  const isBoth = dt === "both";

  const requiresHemo = isHemodialysis || isBoth;
  const requiresPD = isPeritoneal || isBoth;

  if (requiresHemo) {
    if (this.priceFor4Hrs == null || isNaN(this.priceFor4Hrs)) {
      throw new Error("priceFor4Hrs required for hemodialysis");
    }
    if (this.priceFor6Hrs == null || isNaN(this.priceFor6Hrs)) {
      throw new Error("priceFor6Hrs required for hemodialysis");
    }
  }

  if (requiresPD) {
    if (this.priceForPD == null || isNaN(this.priceForPD)) {
      throw new Error("priceForPD required for peritoneal dialysis");
    }
  }
});

module.exports = mongoose.model("RequestedHospital", RequestedHospitalSchema);