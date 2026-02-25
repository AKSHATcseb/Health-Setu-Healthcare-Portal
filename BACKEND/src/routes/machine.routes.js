const express = require("express");
const verifyFirebaseToken = require("../middleware/auth.middleware");
const { isHospitalAdmin } = require("../middleware/role.middleware");

const Machine = require("../models/Machine");
const Hospital = require("../models/Hospital");

const router = express.Router();

/**
 * ✅ ADD MACHINE (Hospital Admin only)
 * POST /api/machines/:hospitalId
 */
router.post(
  "/:hospitalId",
  verifyFirebaseToken,
  isHospitalAdmin,
  async (req, res) => {
    try {
      const { hospitalId } = req.params;
      const { machineNumber, lastServicedOn } = req.body;

      if (!machineNumber) {
        return res.status(400).json({ message: "Machine number is required" });
      }

      // Check hospital ownership
      const hospital = await Hospital.findOne({
        _id: hospitalId,
        adminUid: req.user.uid,
      });

      if (!hospital) {
        return res.status(403).json({ message: "Unauthorized hospital access" });
      }

      // Prevent duplicate machine number
      const exists = await Machine.findOne({ hospitalId, machineNumber });

      if (exists) {
        return res
          .status(400)
          .json({ message: "Machine number already exists in this hospital" });
      }

      // Create machine
      const machine = await Machine.create({
        hospitalId,
        machineNumber,
        lastServicedOn,
      });

      // Update hospital counts
      hospital.totalMachines += 1;
      hospital.availableMachines += 1;
      await hospital.save();

      res.status(201).json({
        message: "Machine added successfully",
        machine,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

/**
 * ✅ GET MACHINES OF A HOSPITAL (Public)
 * GET /api/machines/:hospitalId
 */
router.get("/:hospitalId", async (req, res) => {
  try {
    const machines = await Machine.find({
      hospitalId: req.params.hospitalId,
    });

    res.json(machines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * ✅ UPDATE MACHINE STATUS (Admin only)
 * PUT /api/machines/:machineId/status
 */
router.put(
  "/:machineId/status",
  verifyFirebaseToken,
  isHospitalAdmin,
  async (req, res) => {
    try {
      const { status } = req.body;

      const validStatuses = ["available", "in_use", "maintenance"];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid status value",
        });
      }

      const machine = await Machine.findById(req.params.machineId);

      if (!machine) {
        return res.status(404).json({ message: "Machine not found" });
      }

      // Ownership check
      const hospital = await Hospital.findOne({
        _id: machine.hospitalId,
        adminUid: req.user.uid,
      });

      if (!hospital) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      // Adjust available machine count
      if (machine.status === "available" && status !== "available") {
        hospital.availableMachines -= 1;
      }

      if (machine.status !== "available" && status === "available") {
        hospital.availableMachines += 1;
      }

      // Update status
      machine.status = status;
      await machine.save();
      await hospital.save();

      res.json({
        message: "Machine status updated",
        machine,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

/**
 * ✅ DELETE MACHINE (Admin only)
 * DELETE /api/machines/:machineId
 */
router.delete(
  "/:machineId",
  verifyFirebaseToken,
  isHospitalAdmin,
  async (req, res) => {
    try {
      const machine = await Machine.findById(req.params.machineId);

      if (!machine) {
        return res.status(404).json({ message: "Machine not found" });
      }

      const hospital = await Hospital.findOne({
        _id: machine.hospitalId,
        adminUid: req.user.uid,
      });

      if (!hospital) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      // Adjust hospital counts
      if (machine.status === "available") {
        hospital.availableMachines -= 1;
      }

      hospital.totalMachines -= 1;

      await machine.deleteOne();
      await hospital.save();

      res.json({ message: "Machine deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
