const mongoose = require("mongoose");

/* ---------------- SLOT SUB-SCHEMA ---------------- */
const slotSchema = new mongoose.Schema(
  {
    date: {
      type: String, // format: YYYY-MM-DD
      required: true,
    },

    startTime: {
      type: String, // format: "HH:mm"
      required: true,
    },

    endTime: {
      type: String,
      required: true,
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

// Generate slots for next 7 days
async function generateInitialSlots(hospitalId) {
  const Hospital = mongoose.model("Hospital");

  const hospital = await Hospital.findById(hospitalId);

  if (!hospital) throw new Error("Hospital not found");

  const slots = [];
  const today = new Date();

  /* 🔥 Merge all timings */
  const timings = [
    ...(hospital.slots?.slots4h || []),
    ...(hospital.slots?.slots6h || []),
  ];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const formattedDate = date.toISOString().split("T")[0];

    timings.forEach((time) => {
      slots.push({
        date: formattedDate,
        startTime: time,
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

    // 🔥 Core availability structure
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

// Runs only when machine is created
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

// Optimize search queries (VERY IMPORTANT)
machineSchema.index({
  hospitalId: 1,
  "slots.date": 1,
  "slots.availability_status": 1,
});

module.exports = mongoose.model("Machine", machineSchema);