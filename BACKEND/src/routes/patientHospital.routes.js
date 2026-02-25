const express = require("express");
const {
  getHospitalsForPatients,
} = require("../controllers/patientHospital.controller");

const router = express.Router();

/**
 * ✅ PATIENT FILTER SEARCH API
 * GET /api/patient/hospitals
 */
router.get("/hospitals", getHospitalsForPatients);

module.exports = router;
