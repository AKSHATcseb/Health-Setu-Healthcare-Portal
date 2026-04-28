const mongoose = require("mongoose");

/* ---------------- SLOT SUB-SCHEMA ---------------- */
const slotSchema = new mongoose.Schema(
  {
    date: {
      type: String, // format: YYYY-MM-DD
      required: true,
    },

    startTime: {
      type: String, // human-friendly like "8:00 AM" or "08:00"
      required: true,
    },

    // endTime is optional: some timing models only use a single time label
    endTime: {
      type: String,
      default: "",
    },

    availability_status: {
      type: String,
      enum: ["available", "booked", "blocked"],
      default: "available",
    },
  },
  { _id: false }
);

/* ---------------- HELPER FUNCTIONS ---------------- */

/**
 * Format a Date to local YYYY-MM-DD (uses server local timezone)
 * This avoids UTC offset issues caused by toISOString()
 */
function formatLocalDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Generate slots for next 7 days using hospital timings
async function generateInitialSlots(hospitalId) {
  const Hospital = mongoose.model("Hospital");
  const hospital = await Hospital.findById(hospitalId);

  if (!hospital) throw new Error("Hospital not found");

  const slots = [];
  const today = new Date();

  /* Merge timings (adjust to how your Hospital.slots stores them) */
  const timings = [
    ...(hospital.slots?.slots4h || []),
    ...(hospital.slots?.slots6h || []),
  ];

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const formattedDate = formatLocalDate(d);

    timings.forEach((time) => {
      // If timing is a string (startTime) we use it directly.
      // If it's an object { start, end } you may adapt here.
      const start = typeof time === "string" ? time : time.start || "";
      const end = typeof time === "string" ? "" : time.end || "";

      slots.push({
        date: formattedDate,
        startTime: start,
        endTime: end,
        availability_status: "available",
      });
    });
  }

  return slots;
}

/* ---------------- MACHINE SCHEMA ---------------- */
const machineSchema = new mongoose.Schema(
  {
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },

    machineNumber: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["available", "in_use", "maintenance"],
      default: "available",
    },

    // Core availability structure
    slots: {
      type: [slotSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

/* ---------------- AUTO SLOT GENERATION ---------------- */

// Runs only when machine is created (left commented — enable if needed)
// machineSchema.pre("save", async function () {
//   if (this.isNew && (!this.slots || this.slots.length === 0)) {
//     this.slots = await generateInitialSlots(this.hospitalId);
//   }
// });

/* ---------------- INDEXES ---------------- */

// Ensure unique machine per hospital
machineSchema.index(
  { hospitalId: 1, machineNumber: 1 },
  { unique: true }
);

// Optimize search queries for slots by date & availability
machineSchema.index({
  hospitalId: 1,
  "slots.date": 1,
  "slots.availability_status": 1,
});

// export
module.exports = mongoose.model("Machine", machineSchema);