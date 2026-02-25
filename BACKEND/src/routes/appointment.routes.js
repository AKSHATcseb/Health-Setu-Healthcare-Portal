const express = require("express");

const verifyFirebaseToken = require("../middleware/auth.middleware");
const { isPatient, isHospitalAdmin } = require("../middleware/role.middleware");

const Appointment = require("../models/Appointment");
const Machine = require("../models/Machine");
const Hospital = require("../models/Hospital");
const User = require("../models/User");

const {
  calculateEndTime,
  timeToMinutes,
} = require("../utils/time.util");

const router = express.Router();

/**
 * ==========================================================
 * ✅ 1. BOOK APPOINTMENT (Dynamic Time + Machine Safe)
 * POST /api/appointments/book
 * ==========================================================
 */
router.post("/book", verifyFirebaseToken, isPatient, async (req, res) => {
  try {
    const {
      hospitalId,
      appointmentDate,
      startTime,
      durationHours,
      isEmergency,
    } = req.body;

    // ---------------- VALIDATION ----------------
    if (!hospitalId || !appointmentDate || !startTime || !durationHours) {
      return res.status(400).json({
        message:
          "hospitalId, appointmentDate, startTime, durationHours are required",
      });
    }

    if (![4, 6].includes(durationHours)) {
      return res.status(400).json({
        message: "Duration must be 4 or 6 hours only",
      });
    }

    // ---------------- HOSPITAL ----------------
    const hospital = await Hospital.findById(hospitalId);

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    // ---------------- AMOUNT AUTO ----------------
    let amount =
      durationHours === 4
        ? hospital.costPerSession4h
        : hospital.costPerSession6h;

    if (isEmergency) {
      if (!hospital.emergencyServices) {
        return res.status(400).json({
          message: "Emergency dialysis not available at this hospital",
        });
      }

      amount = hospital.emergencyCostPerSession;
    }

    // ---------------- PATIENT PROFILE ----------------
    const patient = await User.findOne({ firebaseUid: req.user.uid });

    if (!patient) {
      return res.status(404).json({
        message: "Patient profile not found. Please complete registration.",
      });
    }

    // ---------------- TIME CALCULATION ----------------
    const endTime = calculateEndTime(startTime, durationHours);

    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    if (startMinutes === null || endMinutes === null) {
      return res.status(400).json({
        message: "Invalid time format. Use HH:MM (Example: 09:00)",
      });
    }

    // ---------------- MACHINES ----------------
    const machines = await Machine.find({
      hospitalId,
      status: "available",
    });

    if (!machines.length) {
      return res.status(400).json({
        message: "No machines available in this hospital",
      });
    }

    // ---------------- MACHINE ASSIGNMENT ----------------
    let bookedAppointment = null;

    for (let machine of machines) {
      // ✅ Overlap Check Query
      const conflict = await Appointment.findOne({
        machineId: machine._id,
        appointmentDate: new Date(appointmentDate),
        status: { $in: ["reserved", "active"] },

        // Overlap Condition
        startMinutes: { $lt: endMinutes },
        endMinutes: { $gt: startMinutes },
      });

      // ❌ Machine Busy
      if (conflict) continue;

      // ✅ Machine Free → Create Appointment
      bookedAppointment = await Appointment.create({
        patientId: patient._id,
        hospitalId,
        machineId: machine._id,

        appointmentDate: new Date(appointmentDate),

        startTime,
        endTime,

        startMinutes,
        endMinutes,

        durationHours,
        amount,

        isEmergency: isEmergency || false,

        status: "reserved",
        paymentStatus: "pending",
      });

      break;
    }

    // ❌ No machine free
    if (!bookedAppointment) {
      return res.status(400).json({
        message: "All machines are booked for this time slot",
      });
    }

    return res.status(201).json({
      message: "Appointment booked successfully",
      appointment: bookedAppointment,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Appointment booking failed",
      error: err.message,
    });
  }
});

/**
 * ==========================================================
 * ✅ 2. CHECK HOSPITAL AVAILABILITY
 * GET /api/appointments/:hospitalId/availability?date=YYYY-MM-DD
 * ==========================================================
 */
router.get("/:hospitalId/availability", async (req, res) => {
  try {
    const { date } = req.query;
    const hospitalId = req.params.hospitalId;

    if (!date) {
      return res.status(400).json({
        message: "Date query required (Example: ?date=2026-01-27)",
      });
    }

    const hospital = await Hospital.findById(hospitalId);

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    // ✅ All machines
    const totalMachines = await Machine.countDocuments({
      hospitalId,
      status: "available",
    });

    // ✅ Booked Appointments
    const booked = await Appointment.find({
      hospitalId,
      appointmentDate: new Date(date),
      status: { $in: ["reserved", "active"] },
    });

    return res.json({
      hospital: hospital.name,
      date,
      totalMachines,
      bookedAppointments: booked.length,
      availableMachines: totalMachines - booked.length,
      bookedSlots: booked.map((a) => ({
        machineId: a.machineId,
        start: a.startTime,
        end: a.endTime,
      })),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

/**
 * ==========================================================
 * ✅ 3. PATIENT VIEW MY APPOINTMENTS
 * GET /api/appointments/my
 * ==========================================================
 */
router.get("/my", verifyFirebaseToken, isPatient, async (req, res) => {
  try {
    const patient = await User.findOne({ firebaseUid: req.user.uid });

    const appointments = await Appointment.find({
      patientId: patient._id,
    })
      .populate("hospitalId", "name address")
      .populate("machineId", "machineNumber");

    return res.json({
      success: true,
      appointments,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch appointments",
      error: err.message,
    });
  }
});

/**
 * ==========================================================
 * ✅ 4. CANCEL APPOINTMENT
 * PUT /api/appointments/cancel/:id
 * ==========================================================
 */
router.put("/cancel/:id", verifyFirebaseToken, isPatient, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = "cancelled";
    await appointment.save();

    return res.json({
      message: "Appointment cancelled successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Cancel failed",
      error: err.message,
    });
  }
});

/**
 * ==========================================================
 * ✅ 5. ADMIN START SESSION
 * PUT /api/appointments/start/:id
 * ==========================================================
 */
router.put(
  "/start/:id",
  verifyFirebaseToken,
  isHospitalAdmin,
  async (req, res) => {
    try {
      const appointment = await Appointment.findById(req.params.id);

      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      appointment.status = "active";
      await appointment.save();

      return res.json({
        message: "Session started successfully",
        appointment,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Failed to start session",
        error: err.message,
      });
    }
  }
);

/**
 * ==========================================================
 * ✅ 6. ADMIN COMPLETE SESSION
 * PUT /api/appointments/complete/:id
 * ==========================================================
 */
router.put(
  "/complete/:id",
  verifyFirebaseToken,
  isHospitalAdmin,
  async (req, res) => {
    try {
      const appointment = await Appointment.findById(req.params.id);

      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      appointment.status = "completed";
      await appointment.save();

      return res.json({
        message: "Session completed successfully",
        appointment,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Failed to complete session",
        error: err.message,
      });
    }
  }
);

/**
 * ==========================================================
 * ✅ 7. ADMIN VIEW HOSPITAL APPOINTMENTS
 * GET /api/appointments/hospital/:hospitalId
 * ==========================================================
 */
router.get(
  "/hospital/:hospitalId",
  verifyFirebaseToken,
  isHospitalAdmin,
  async (req, res) => {
    try {
      const appointments = await Appointment.find({
        hospitalId: req.params.hospitalId,
      })
        .populate("patientId", "name email phone")
        .populate("machineId", "machineNumber");

      return res.json({
        success: true,
        appointments,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Failed to fetch hospital appointments",
        error: err.message,
      });
    }
  }
);

module.exports = router;