const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Appointment = require("../models/Appointment");
const Hospital = require("../models/HospitalDetails");

// 🔥 Confirm Booking Controller
const confirmAppointment = async (req, res) => {
  try {
    const {
      patientId,
      hospitalId,
      appointmentDate,
      durationHours,
      slot,
      amount,
    } = req.body;

    // ✅ 1. Basic validation
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

    // ✅ 2. Fetch hospital
    const hospital = await Hospital.findById(hospitalId);

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found",
      });
    }

    // ✅ 3. 🚫 PREVENT SAME USER DOUBLE BOOKING
    const alreadyBooked = await Appointment.findOne({
      patientId,
      hospitalId, // 🔥 include this also (important)
      appointmentDate: new Date(appointmentDate),
      slot,
      status: "active",
    });

    if (alreadyBooked) {
      return res.status(400).json({
        success: false,
        message: "You already booked this slot",
      });
    }

    // ✅ 4. Slot capacity check
    const totalMachines = hospital.numberOfMachines;

    const existingBookings = await Appointment.countDocuments({
      hospitalId,
      appointmentDate: new Date(appointmentDate),
      slot,
      status: "active",
    });

    if (existingBookings >= totalMachines) {
      return res.status(400).json({
        success: false,
        message: "Slot is fully booked",
      });
    }

    // ✅ 5. Price calculation
    const pricePerHour = hospital.pricePerHour || 500;

    // ✅ 6. Create appointment
    const newAppointment = await Appointment.create({
      patientId,
      hospitalId,
      appointmentDate,
      durationHours,
      slot,
      amount,
    });

    return res.status(201).json({
      success: true,
      message: "Appointment confirmed",
      appointment: newAppointment,
    });

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