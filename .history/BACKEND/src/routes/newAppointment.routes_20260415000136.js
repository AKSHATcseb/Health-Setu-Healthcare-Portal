const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Appointment = require("../models/Appointment");
const Hospital = require("../models/HospitalDetails");

// 🔥 Confirm Booking Controller
const confirmAppointment = async (req, res) => {
  try {
    // const {
    //   patientId,
    //   hospitalId,
    //   appointmentDate,
    //   durationHours,
    //   slot,
    //   amount,
    // } = req.body;

    const {
      patientId,
      hospitalId,
      machineId,   // 🔥 ADD THIS
      appointmentDate,
      durationHours,
      slot,
      amount,
    } = req.body;

    if (
      !patientId ||
      !hospitalId ||
      !appointmentDate ||
      !durationHours ||
      !slot ||
      !amount
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }
    if (!machineId) {
      return res.status(400).json({
        success: false,
        message: "Machine selection is required",
      });
    }

    // Defensive model lookup
    const Hospital = mongoose.models?.Hospital || (() => {
      try { return mongoose.model("Hospital"); } catch (e) { return null; }
    })();
    const Machine = mongoose.models?.Machine || (() => {
      try { return mongoose.model("Machine"); } catch (e) { return null; }
    })();
    const Appointment = mongoose.models?.Appointment || (() => {
      try { return mongoose.model("Appointment"); } catch (e) { return null; }
    })();

    console.log("Models loaded:", {
      Hospital: !!Hospital,
      Machine: !!Machine,
      Appointment: !!Appointment,
    });

    if (!Hospital || !Machine || !Appointment) {
      console.error("Models not registered:", { Hospital: !!Hospital, Machine: !!Machine, Appointment: !!Appointment });
      return res.status(500).json({ success: false, message: "Server misconfiguration: models not registered" });
    }

    // Normalize date
    const apptDate = new Date(appointmentDate);
    if (isNaN(apptDate.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid appointmentDate" });
    }

    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ success: false, message: "Hospital not found" });
    }

    // Prevent duplicate booking by same user
    const alreadyBooked = await Appointment.findOne({
      patientId,
      hospitalId,
      appointmentDate: apptDate,
      slot,
      status: "active",
    });
    if (alreadyBooked) {
      return res.status(400).json({ success: false, message: "You already booked this slot" });
    }

    // Capacity check (soft)
    const totalMachines = hospital.numberOfMachines || 0;
    const existingBookings = await Appointment.countDocuments({
      hospitalId,
      appointmentDate: apptDate,
      slot,
      status: "active",
    });
    // if (existingBookings >= totalMachines) {
    //   return res.status(400).json({ success: false, message: "Slot is fully booked" });
    // }

    // ---- ATOMIC MACHINE ASSIGNMENT & APPOINTMENT CREATION ----
    // Parse start time from slot. Expecting slot.slot like "09:00 - 13:00"
    const startTimeStr = slot && (slot.slot || slot.startTime) ? (slot.slot || slot.startTime).split("-")[0].trim() : null;
    if (!startTimeStr) {
      return res.status(400).json({ success: false, message: "Invalid slot format" });
    }

    const timeToMinutes = (t) => {
      const [hh, mm] = t.split(":").map(Number);
      return hh * 60 + (mm || 0);
    };

    const startMinutes = timeToMinutes(startTimeStr);
    const endMinutes = startMinutes + Number(durationHours) * 60;

    // appointmentDate stored as YYYY-MM-DD string in Machine slots, ensure consistent query key
    // const appointmentDateStr = appointmentDate; // e.g., "2026-04-15"

    const formatDate = (d) => {
      const date = new Date(d);
      return date.toISOString().split("T")[0];
    };

    const appointmentDateStr = formatDate(appointmentDate);

    // Atomically find one machine with this available slot and mark the slot as booked
    const machine = await Machine.findOneAndUpdate(
      {
        _id: machineId,
        hospitalId,
        "slots.date": appointmentDateStr,
        "slots.startTime": startTimeStr,
        "slots.availability_status": "available",
      },
      {
        $set: {
          "slots.$.availability_status": "booked",
        },
      },
      { new: true }
    );

    if (!machine) {
      return res.status(400).json({
        success: false,
        message: "Slot is fully booked",
      });
    }

    if (!machine) {
      return res.status(400).json({ success: false, message: "Slot not available" });
    }


    // Create appointment referring to this machine
    let newAppointment;
    try {
      newAppointment = await Appointment.create({
        patientId,
        hospitalId,
        machineId: machine._id,
        appointmentDate: apptDate, // store as Date if schema expects Date
        durationHours,
        startMinutes,
        endMinutes,
        slot,
        amount,
        status: "active",
      });

      return res.status(201).json({
        success: true,
        message: "Appointment confirmed",
        appointment: newAppointment,
      });
    } catch (createErr) {
      // Rollback machine slot booking if appointment creation failed
      try {
        await Machine.updateOne(
          {
            _id: machine._id,
            "slots.date": appointmentDateStr,
            "slots.startTime": startTimeStr,
          },
          { $set: { "slots.$.availability_status": "available" } }
        );
      } catch (rollbackErr) {
        console.error("Rollback failed:", rollbackErr);
      }

      console.error("Appointment creation failed:", createErr);
      if (createErr.name === "ValidationError") {
        return res.status(400).json({ success: false, message: "Validation error", details: createErr.errors });
      }
      return res.status(500).json({ success: false, message: "Server error", detail: createErr.message });
    }
    // ---- END ATOMIC BLOCK ----

  } catch (error) {
    console.error("Booking Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getAppointmentsByPatient = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    console.log("Fetching appointments for patientId:", patientId);

    // ✅ Validate ID
    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "Patient ID is required",
      });
    }

    // ✅ Fetch appointments
    const appointments = await Appointment.find({
      patientId,
    })
      .populate("hospitalId", "hospitalName address")
      .sort({ appointmentDate: -1, createdAt: -1 }); // latest first

    return res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });

  } catch (error) {
    console.error("Fetch Appointments Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

router.post("/confirm", confirmAppointment);
router.get("/all/:patientId", getAppointmentsByPatient);

module.exports = router;