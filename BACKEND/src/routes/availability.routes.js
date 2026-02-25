const express = require("express");

const Appointment = require("../models/Appointment");
const Hospital = require("../models/Hospital");
const Machine = require("../models/Machine");

const { calculateEndTime, timeToMinutes } = require("../utils/time.util");

const router = express.Router();

/**
 * ==========================================================
 * ✅ CHECK SLOT AVAILABILITY OF ONE HOSPITAL
 * GET /api/hospitals/:hospitalId/availability
 * ==========================================================
 */
router.get("/:hospitalId/availability", async (req, res) => {
  try {
    const { date, startTime, durationHours } = req.query;
    const hospitalId = req.params.hospitalId;

    if (!date || !startTime || !durationHours) {
      return res.status(400).json({
        message: "date, startTime, durationHours required",
      });
    }

    const hospital = await Hospital.findById(hospitalId);

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    // ✅ Time Range
    const endTime = calculateEndTime(startTime, Number(durationHours));

    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    // ✅ Total Machines
    const machines = await Machine.find({
      hospitalId,
      status: "available",
    });

    // ✅ Check booked machines in this slot
    const bookedAppointments = await Appointment.find({
      hospitalId,
      appointmentDate: new Date(date),
      status: { $in: ["reserved", "active"] },

      // Overlap condition
      startMinutes: { $lt: endMinutes },
      endMinutes: { $gt: startMinutes },
    });

    // Machines booked
    const bookedMachineIds = bookedAppointments.map((a) =>
      a.machineId.toString()
    );

    // Machines free
    const freeMachines = machines.filter(
      (m) => !bookedMachineIds.includes(m._id.toString())
    );

    return res.json({
      hospital: hospital.name,
      date,
      slot: {
        startTime,
        endTime,
        durationHours,
      },
      totalMachines: machines.length,
      bookedMachines: bookedMachineIds.length,
      availableMachines: freeMachines.length,
      available: freeMachines.length > 0,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Availability check failed",
      error: err.message,
    });
  }
});

module.exports = router;