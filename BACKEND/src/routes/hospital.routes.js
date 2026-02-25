const express = require("express");
const verifyFirebaseToken = require("../middleware/auth.middleware");
const { isHospitalAdmin } = require("../middleware/role.middleware");
const Hospital = require("../models/Hospital");
const Machine = require("../models/Machine");
const Appointment = require("../models/Appointment");
const { timeToMinutes, calculateEndTime } = require("../utils/time.util");


const router = express.Router();

/**
 * CREATE Hospital
 */
router.post("/", verifyFirebaseToken, isHospitalAdmin, async (req, res) => {
  try {
    const { totalMachines } = req.body;

    // ✅ Step 1: Create Hospital
    const hospital = await Hospital.create({
      ...req.body,
      adminUid: req.user.uid,

      // Ensure availableMachines starts correctly
      availableMachines: totalMachines,
    });

    // ✅ Step 2: Auto Create Machines
    if (totalMachines > 0) {
      let machinesArray = [];

      for (let i = 1; i <= totalMachines; i++) {
        machinesArray.push({
          hospitalId: hospital._id,
          machineNumber: `M-${i}`, // Machine naming format
          status: "available",
        });
      }

      await Machine.insertMany(machinesArray);
    }

    // ✅ Step 3: Return Response
    res.status(201).json({
      message: "Hospital registered successfully with machines created",
      hospital,
    });

  } catch (err) {
    res.status(500).json({
      message: "Hospital registration failed",
      error: err.message,
    });
  }
});


/**
 * GET Hospital by admin
 */
router.get("/my", verifyFirebaseToken, isHospitalAdmin, async (req, res) => {
  const hospital = await Hospital.findOne({ adminUid: req.user.uid });

  res.json(hospital);
});

/**
 * ✅ GET AVAILABLE HOSPITALS FOR A GIVEN SLOT
 * /api/hospitals/available-slot?date=2026-02-08&startTime=09:00&duration=4
 */
router.get("/available-slot", async (req, res) => {
  try {
    const { date, startTime, duration } = req.query;

    if (!date || !startTime || !duration) {
      return res.status(400).json({
        message: "date, startTime, duration required",
      });
    }

    const durationHours = Number(duration);

    if (![4, 6].includes(durationHours)) {
      return res.status(400).json({
        message: "Duration must be 4 or 6",
      });
    }

    // ✅ Requested slot
    const newStart = timeToMinutes(startTime);
    const endTime = calculateEndTime(startTime, durationHours);
    const newEnd = timeToMinutes(endTime);

    // ✅ Date range (Full day safe)
    const dayStart = new Date(date + "T00:00:00.000Z");
    const dayEnd = new Date(date + "T23:59:59.999Z");

    // ✅ Fetch hospitals
    const hospitals = await Hospital.find({ isActive: true });

    let availableHospitals = [];

    for (let hospital of hospitals) {
      if (hospital.totalMachines === 0) continue;

      // ✅ Fetch appointments in full day range
      const appointments = await Appointment.find({
        hospitalId: hospital._id,
        appointmentDate: { $gte: dayStart, $lte: dayEnd },
        status: { $in: ["reserved", "active"] },
      });

      // ✅ Busy machines set
      let busyMachines = new Set();

      for (let appt of appointments) {
        // Overlap check
        if (newStart < appt.endMinutes && newEnd > appt.startMinutes) {
          busyMachines.add(appt.machineId.toString());
        }
      }

      // ✅ Free machines count
      const freeMachines = hospital.totalMachines - busyMachines.size;

      if (freeMachines > 0) {
        availableHospitals.push({
          _id: hospital._id,
          name: hospital.name,
          address: hospital.address,
          upiId: hospital.upiId,
          availableMachines: freeMachines,
          cost:
            durationHours === 4
              ? hospital.costPerSession4h
              : hospital.costPerSession6h,
        });
      }
    }

    return res.json({
      success: true,
      total: availableHospitals.length,
      hospitals: availableHospitals,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Slot availability failed",
      error: err.message,
    });
  }
});



/**
 * get particular hospital by user
 */

// GET /api/hospitals/:id
router.get("/:id", async (req, res) => {
  try {
    const hospitalId = req.params.id;

    const hospital = await Hospital.findById(hospitalId);

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    res.status(200).json(hospital);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch hospital details",
      error: error.message,
    });
  }
});


/**
 * GET All Hospitals (Patient Search)
 */
router.get("/", async (req, res) => {
  const hospitals = await Hospital.find({ isActive: true });
  res.json(hospitals);
});

/**
 * UPDATE Hospital
 */
router.put("/:id", verifyFirebaseToken, isHospitalAdmin, async (req, res) => {
  const hospital = await Hospital.findOneAndUpdate(
    { _id: req.params.id, adminUid: req.user.uid },
    req.body,
    { new: true }
  );

  res.json(hospital);
});

/**
 * DELETE Hospital
 */
router.delete("/:id", verifyFirebaseToken, isHospitalAdmin, async (req, res) => {
  await Hospital.findOneAndDelete({
    _id: req.params.id,
    adminUid: req.user.uid,
  });

  res.json({ message: "Hospital deleted" });
});


module.exports = router;