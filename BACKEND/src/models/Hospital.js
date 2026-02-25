const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema(
  {
    adminUid: {
      type: String,
      required: true, // Firebase UID of hospital admin
    },

    name: {
      type: String,
      required: true,
    },

    //regisration number of hospital
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
    },

    //type of hospital
    type: {
      type: String,
      enum: ["private", "government", "trust"],
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },

    totalMachines: { type: Number, default: 0 },

    availableMachines: { type: Number, default: 0 },

    costPerSession4h: {
      type: Number,
      required: true,
    },

    costPerSession6h: {
      type: Number,
      required: true,
    },

    //emergency services available or not
    emergencyServices: {
      type: Boolean,
      default: false,
    },

    //emergency cost per session
    emergencyCostPerSession: {
      type: Number,
      default: null,
    },

    //hospital 24/7 or specific working hours
    is24x7: {
      type: Boolean,
      default: false,
    },

    //if not 24/7, then specify working hours
    //open days and close days
    workingDays: {
      type: [String],
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    },

    workingHours: {
      open: String, // "08:00"
      close: String, // "20:00"
    },

    rating: { type: Number, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },

    isActive: {
      type: Boolean,
      default: true,
    },

    // upi payment id for hospital payments
    upiId: {
      type: String,
      default: null,
    },

    //is verified by admin
    isVerified: {
      type: Boolean,
      default: true,
    },

  },
  { timestamps: true }
);

// Geo index for nearest search
hospitalSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Hospital", hospitalSchema);
