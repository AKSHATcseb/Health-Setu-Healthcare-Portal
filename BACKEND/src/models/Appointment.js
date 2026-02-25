const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    // ✅ Patient booking dialysis
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ Hospital selected
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },

    // ✅ Machine assigned
    machineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Machine",
      required: true,
    },

    // ✅ Appointment Date
    appointmentDate: {
      type: Date,
      required: true,
    },

    // ✅ Duration (4 or 6 hrs)
    durationHours: {
      type: Number,
      enum: [4, 6],
      required: true,
    },

    // ✅ Start Time (Readable)
    startTime: {
      type: String, // "09:00"
      required: true,
    },

    // ✅ End Time (Readable)
    endTime: {
      type: String, // "13:00"
      required: true,
    },

    // ✅ Minutes (Used ONLY for overlap logic)
    startMinutes: {
      type: Number,
      required: true,
    },

    endMinutes: {
      type: Number,
      required: true,
    },

    // ✅ Status
    status: {
      type: String,
      enum: ["reserved", "active", "completed", "cancelled"],
      default: "reserved",
    },

    // ✅ Payment Tracking
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "paid",
    },

    // ✅ Amount auto calculated
    amount: {
      type: Number,
      required: true,
    },

    // ✅ Emergency booking
    isEmergency: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/**
 * ✅ Prevent duplicate exact same start time on same machine
 */
appointmentSchema.index(
  { machineId: 1, appointmentDate: 1, startMinutes: 1 },
  { unique: true }
);

/**
 * ✅ Speed overlap search
 */
appointmentSchema.index({
  machineId: 1,
  appointmentDate: 1,
  startMinutes: 1,
  endMinutes: 1,
});

module.exports = mongoose.model("Appointment", appointmentSchema);