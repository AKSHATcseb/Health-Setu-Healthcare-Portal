const mongoose = require("mongoose");

/* ---------------- SLOT SCHEMA ---------------- */
const SlotSchema = new mongoose.Schema(
  {
    numberOf4HrsSessionsPerDay: { type: Number, default: 0, min: 0 },
    numberOf6HrsSessionsPerDay: { type: Number, default: 0, min: 0 },

    firstStart4h: { type: String, default: "09:00" },
    firstStart6h: { type: String, default: "09:00" },

    /* ✅ FIXED STRUCTURE */
    slots4h: [
      {
        start: { type: String },
        end: { type: String },
      },
    ],
    slots6h: [
      {
        start: { type: String },
        end: { type: String },
      },
    ],
  },
  { _id: false }
);

/* ---------------- MAIN SCHEMA ---------------- */
const HospitalSchema = new mongoose.Schema(
  {
    hospitalName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },

    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{10}$/, "Must be exactly 10 digits"],
    },

    is24x7: { type: Boolean, default: false },
    operatingHours: { type: mongoose.Schema.Types.Mixed, default: {} },

    /* ✅ SLOTS */
    slots: { type: SlotSchema, default: () => ({}) },

    dialysisSeats: { type: Number, min: 0, required: true },

    dialysisType: {
      type: String,
      enum: ["hemodialysis", "peritoneal dialysis", "both"],
      required: true,
    },

    priceFor4Hrs: { type: Number, min: 0 },
    priceFor6Hrs: { type: Number, min: 0 },
    priceForPD: { type: Number, min: 0 },

    address: { type: String, required: true, trim: true },
    city: { type: String, trim: true, index: true },

    latitude: { type: Number },
    longitude: { type: Number },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
    },

    accountHolderName: { type: String, trim: true },
    upiID: { type: String, trim: true },

    documents: [
      {
        name: String,
        url: String,
      },
    ],

    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: true },

    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },

    createdFromRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RequestedHospital",
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

/* ---------------- INDEXES ---------------- */
HospitalSchema.index({ email: 1 });
HospitalSchema.index({ city: 1 });
HospitalSchema.index({ dialysisType: 1 });

/* ---------------- PRE-SAVE: GEO FORMAT ---------------- */
HospitalSchema.pre("save", function () {
  if (this.latitude && this.longitude) {
    this.location = {
      type: "Point",
      coordinates: [this.longitude, this.latitude],
    };
  }
});

module.exports = mongoose.model("Hospital", HospitalSchema);