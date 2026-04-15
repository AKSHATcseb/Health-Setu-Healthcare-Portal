const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
// const { requireAuth  = require("../middleware/requireAuth");
const requireAuth = require("../middleware/auth.middleware");

const Patient = require("../models/PatientDetails");
const Machine = require("../models/Machine");
const User = require("../models/Registeration");

/**
 * Helper to read authenticated user id from req.user.
 * Support tokens that set req.user.id, req.user.userId or req.user._id.
 */
function getAuthUserId(req) {
  return req.user?.id || req.user?.userId || req.user?._id || null;
  console.log("getAuthUserId:", req.user, "->", userId);
}

// Haversine formula to calculate distance between two lat/lng points in km
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km

  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Normalize query that finds patient by linked user id.
 * Some schemas use `userId`, others `user`. Support both.
 */
function buildUserQuery(userId) {
  return { $or: [{ userId }, { user: userId }] };
}

/**
 * GET /api/patient/details
 * Prefill data for logged-in user (user info + existing patient profile if any)
 */
const getPatientDetails = async (req, res) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: missing user in token" });
    }

    const user = await User.findById(userId).select("fullName name email").lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const patient = await Patient.findOne(buildUserQuery(userId)).lean();

    return res.status(200).json({
      message: "Patient details fetched successfully",
      prefill: {
        fullName: (user.fullName || user.name || "").trim(),
        email: (user.email || "").trim(),
      },
      patient: patient || null,
    });
  } catch (err) {
    console.error("getPatientDetails error:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

/**
 * POST /api/patient/details
 * Create or update patient details for authenticated user.
 * Required: mobileNumber, age, gender, bloodGroup, address
 *
 * Updated behavior:
 * - Do NOT require email or fullName from the frontend.
 * - Only email must be taken from the logged-in User record.
 * - fullName may be taken from the body if provided (optional).
 * - If no patient exists for the logged-in user, create a new document using:
 *     - userId/user link fields
 *     - email from the logged-in User
 *     - other fields from request body
 * - If patient exists, update with provided fields (email remains the user's email).
 */
// Replace or insert this function in your routes/patient.routes.js file

const addPatientDetails = async (req, res) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: missing user in token" });
    }

    // Accept expected fields from body; email is NOT accepted from body (we use user's email)
    const {
      fullName, // optional
      mobileNumber,
      age,
      gender,
      bloodGroup,
      address,
      latitude = null,
      longitude = null,
      profileCompleted, // optional boolean
    } = req.body;

    // Basic validations (do not require email from client)
    if (!mobileNumber) return res.status(400).json({ message: "mobileNumber is required" });
    if (!age) return res.status(400).json({ message: "age is required" });
    if (!gender) return res.status(400).json({ message: "gender is required" });
    if (!bloodGroup) return res.status(400).json({ message: "bloodGroup is required" });
    if (!address) return res.status(400).json({ message: "address is required" });

    const ageNumber = Number(age);
    if (!Number.isFinite(ageNumber) || ageNumber <= 0) {
      return res.status(400).json({ message: "age must be a valid positive number" });
    }

    // Ensure logged-in user exists and get their email (only email will be used from User)
    const user = await User.findById(userId).select("email fullName name").lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    const fixedEmail = (user.email || "").trim().toLowerCase();
    const providedFullName = typeof fullName === "string" && fullName.trim().length ? fullName.trim() : (user.fullName || user.name || "").trim();

    // Build the data that should be stored in the Patient document.
    // NOTE: do NOT include a `user` field here unless your Patient schema defines it.
    const patientData = {
      userId, // include the canonical linking field your schema expects
      fullName: providedFullName,
      email: fixedEmail, // always from the server-side User record
      mobileNumber: String(mobileNumber).trim(),
      age: ageNumber,
      gender: String(gender).trim(),
      bloodGroup: String(bloodGroup).trim(),
      address: String(address).trim(),
      latitude: lat,
      longitude: lng,
      profileCompleted: typeof profileCompleted === "boolean" ? profileCompleted : true,
    };

    // 1) Try to find an existing patient record for this user (avoid upsert with $or)
    const existing = await Patient.findOne(buildUserQuery(userId)).lean();

    let saved;
    if (existing && existing._id) {
      // Update existing -> do not accidentally set unknown fields
      const updateFields = {
        fullName: patientData.fullName,
        email: patientData.email,
        mobileNumber: patientData.mobileNumber,
        age: patientData.age,
        gender: patientData.gender,
        bloodGroup: patientData.bloodGroup,
        address: patientData.address,
        latitude: patientData.latitude,
        longitude: patientData.longitude,
        profileCompleted: patientData.profileCompleted,
      };

      saved = await Patient.findByIdAndUpdate(
        existing._id,
        { $set: updateFields },
        { new: true, runValidators: true, setDefaultsOnInsert: true }
      ).lean();
    } else {
      // No existing patient -> create a new document
      // Note: use Patient.create so Mongoose applies schema strictly and ignores unknown fields.
      saved = await Patient.create(patientData);
      // convert to plain object for response
      saved = saved.toObject ? saved.toObject() : saved;
    }

    return res.status(200).json({
      message: "Patient profile saved successfully",
      user: {
        id: userId,
        email: fixedEmail,
      },
      patient: saved,
    });
  } catch (err) {
    console.error("addPatientDetails error:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

/**
 * GET /api/patient/profile
 * Return the patient record for the logged-in user (used after login).
 *  - 200 + { patient } when found
 *  - 404 if not found (frontend will prompt user to complete profile)
 */
const getPatientDetailsForDashboard = async (req, res) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId).select("fullName name email").lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    const patient = await Patient.findOne(buildUserQuery(userId)).lean();

    return res.status(200).json({
      message: "Patient details fetched successfully",
      prefill: {
        fullName: (user.fullName || user.name || "").trim(),
        email: (user.email || "").trim(),
      },
      patient: patient || null,
    });
  } catch (err) {
    console.error("GET /api/patient/profile error:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

/**
 * GET /api/patient/:id
 * Fetch patient by patient _id (used by dashboard route /patient/dashboard/:id)
 * - Only owner (patient.userId/user) or hospital_admin should access. requireAuth provides req.user.role and req.user.userId.
 */
const getPatientById = async (req, res) => {
  try {
    const patientId = req.params.id;
    if (!patientId || !mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ message: "Invalid or missing patient id" });
    }

    const patient = await User.findById(patientId).lean();
    const email = patient.email;
    const role = patient.role;

    const patientFromPatientModel = await Patient.findOne({ email });

    // const patient = await Patient.findById(patientId).lean();
    if (!patientFromPatientModel) return res.status(404).json({ message: "Patient not found" });

    // const userId = patientFromPatientModel.userId;
    const authUserId = getAuthUserId(req);
    const authRole = req.user?.role;

    // Allow access if requester is owner (userId or user matches) or is hospital_admin
    const isOwner =
      String(patientFromPatientModel.userId || "") === String(authUserId);
    if (!isOwner && authRole !== "hospital_admin") {
      return res.status(403).json({ message: "Forbidden: you are not allowed to access this patient record" });
    }
    return res.status(200).json({ patientFromPatientModel });
  } catch (err) {
    console.error(`GET /api/patient/${req.params.id} error:`, err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};


function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/* ---------------- ROUTE ---------------- */
// router.get("/available-hospitals", async (req, res) => {
//   try {
//     const {
//       applyFilters,
//       date,
//       lat,
//       lng,
//       maxDistance = 50,
//       minPrice = 0,
//       maxPrice = 50000,
//     } = req.query;

//     if (!date) {
//       return res.status(400).json({ error: "Date is required" });
//     }

//     const cleanDate = date.split("T")[0];
//     console.log("📅 Searching for date:", cleanDate);

//     /* 🔥 DISTANCE FUNCTION */
//     function calculateDistance(lat1, lon1, lat2, lon2) {
//       const R = 6371; // km

//       const dLat = (lat2 - lat1) * (Math.PI / 180);
//       const dLon = (lon2 - lon1) * (Math.PI / 180);

//       const a =
//         Math.sin(dLat / 2) ** 2 +
//         Math.cos(lat1 * (Math.PI / 180)) *
//           Math.cos(lat2 * (Math.PI / 180)) *
//           Math.sin(dLon / 2) ** 2;

//       const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//       return R * c;
//     }

//     /* 🔧 FETCH MACHINES */
//     const machines = await Machine.find().populate("hospitalId");
//     console.log("🔧 Total machines:", machines.length);

//     /* ✅ FILTER MACHINES WITH AVAILABLE SLOTS */
//     const validMachines = machines.filter((machine) =>
//       machine.slots.some(
//         (slot) =>
//           slot.date === cleanDate &&
//           slot.availability_status === "available"
//       )
//     );

//     console.log("✅ Machines with available slots:", validMachines.length);

//     /* 🏥 BUILD HOSPITAL MAP */
//     const hospitalMap = new Map();

//     validMachines.forEach((validMachine) => {
//       const hospital = validMachine.hospitalId;
//       if (!hospital) return;

//       const hospitalId = hospital._id.toString();

//       if (!hospitalMap.has(hospitalId)) {
//         hospitalMap.set(hospitalId, {
//           ...hospital.toObject(),
//           availableSlots: new Set(),
//         });
//       }

//       const hospitalEntry = hospitalMap.get(hospitalId);

//       validMachine.slots.forEach((slot) => {
//         if (
//           slot.date === cleanDate &&
//           slot.availability_status === "available"
//         ) {
//           const slotLabel = slot.endTime
//             ? `${slot.startTime} - ${slot.endTime}`
//             : `${slot.startTime}`;

//           hospitalEntry.availableSlots.add(slotLabel);
//         }
//       });
//     });

//     let hospitals = Array.from(hospitalMap.values());

//     console.log("🏥 Hospitals before filters:", hospitals.length);

//     /* 🔥 ADD DISTANCE (ALWAYS if lat/lng present) */
//     if (lat && lng) {
//       const userLat = parseFloat(lat);
//       const userLng = parseFloat(lng);

//       hospitals = hospitals.map((h) => {
//         let distance = null;

//         // ✅ GeoJSON case
//         if (h.location?.coordinates) {
//           const [lng2, lat2] = h.location.coordinates;

//           distance = calculateDistance(userLat, userLng, lat2, lng2);
//         }

//         // ✅ Fallback: lat/lng fields
//         else if (h.latitude && h.longitude) {
//           distance = calculateDistance(
//             userLat,
//             userLng,
//             h.latitude,
//             h.longitude
//           );
//         }

//         return {
//           ...h,
//           distance: distance ? Number(distance.toFixed(2)) : null,
//         };
//       });
//     }

//     /* 💰 PRICE FILTER */
//     if (applyFilters === "true") {
//       hospitals = hospitals.filter((h) => {
//         const price =
//           h.priceFor4Hrs ?? h.priceFor6Hrs ?? h.priceForPD ?? 0;

//         return price >= minPrice && price <= maxPrice;
//       });
//     }

//     console.log("💰 After price filter:", hospitals.length);

//     /* 📍 DISTANCE FILTER */
//     if (applyFilters === "true" && lat && lng) {
//       hospitals = hospitals.filter(
//         (h) => h.distance !== null && h.distance <= maxDistance
//       );
//     }

//     console.log("📍 After distance filter:", hospitals.length);

//     /* 🔄 FINAL FORMAT */
//     const result = hospitals.map((h) => ({
//       ...h,
//       availableSlots: Array.from(h.availableSlots),
//     }));

//     return res.json({
//       success: true,
//       count: result.length,
//       data: result,
//     });
//   } catch (err) {
//     console.error("❌ ERROR:", err);
//     return res.status(500).json({ error: "Server error" });
//   }
// });



// GET /api/patient/available-hospitals



function formatLocalDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}



const getAvailableHospitals = async (req, res) => {
  try {
    console.log("backend ");
    // Log the raw query for debugging
    // console.log("GET /api/patient/available-hospitals query:", req.query);

    const {
      applyFilters,
      date: rawDate,
      lat,
      lng,
      maxDistance = 10000,
      minPrice = 0,
      maxPrice = 150000,
    } = req.query;

    // console.log("raw date:", rawDate, "lat:", lat, "lng:", lng, "maxDistance:", maxDistance, "minPrice:", minPrice, "maxPrice:", maxPrice);
    // Normalize applyFilters to boolean
    const applyFiltersBool = String(applyFilters) === "true";

    if (!rawDate) {
      return res.status(400).json({ error: "Date is required (query param 'date')" });
    }

    const dateStr = String(rawDate).trim();

    // Accept either YYYY-MM-DD or ISO string — produce cleanDate as YYYY-MM-DD
    let cleanDate;
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      cleanDate = dateStr;
    } else {
      const parsed = new Date(dateStr);
      if (Number.isNaN(parsed.getTime())) {
        return res.status(400).json({ error: "Invalid date format. Send YYYY-MM-DD or an ISO date string." });
      }
      cleanDate = formatLocalDate(parsed);
    }
    // console.log("📅 Searching for date:", cleanDate);

    /* Fetch machines and populate hospital */
    const machines = await Machine.find().populate("hospitalId");
    console.log("🔧 Total machines:", machines.length);

    /* Filter machines that have an available slot on cleanDate */
    const validMachines = machines.filter((machine) =>
      machine.slots.some(
        (slot) =>
          slot.date === cleanDate && slot.availability_status === "available"
      )
    );

    console.log("✅ Machines with available slots:", validMachines.length);

    /* Build a map of hospitals with aggregated available slots */
    const hospitalMap = new Map();

    validMachines.forEach((validMachine) => {
      const hospital = validMachine.hospitalId;
      if (!hospital) return;

      const hospitalId = hospital._id.toString();

      if (!hospitalMap.has(hospitalId)) {
        hospitalMap.set(hospitalId, {
          ...hospital.toObject(),
          availableSlots: new Set(),
        });
      }

      const hospitalEntry = hospitalMap.get(hospitalId);

      validMachine.slots.forEach((slot) => {
        if (
          slot.date === cleanDate &&
          slot.availability_status === "available"
        ) {
          const slotLabel = slot.endTime
            ? `${slot.startTime} - ${slot.endTime}`
            : `${slot.startTime}`;

          hospitalEntry.availableSlots.add(slotLabel);
        }
      });
    });

    let hospitals = Array.from(hospitalMap.values());
    // console.log("🏥 Hospitals before filters:", hospitals.length);

    /* Add distance if lat/lng provided - uses top-level calculateDistance helper */
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);

      hospitals = hospitals.map((h) => {
        let distance = null;

        if (h.location?.coordinates) {
          const [lng2, lat2] = h.location.coordinates;
          distance = calculateDistance(userLat, userLng, lat2, lng2);
        } else if (h.latitude && h.longitude) {
          distance = calculateDistance(userLat, userLng, h.latitude, h.longitude);
        }

        return {
          ...h,
          distance: distance ? Number(distance.toFixed(2)) : null,
        };
      });
    }

    /* Price filter (only when applyFilters === "true") */
    if (applyFilters === "true") {
      hospitals = hospitals.filter((h) => {
        const price = h.priceFor4Hrs ?? h.priceFor6Hrs ?? h.priceForPD ?? 0;
        return price >= minPrice && price <= maxPrice;
      });
    }

    // console.log("💰 After price filter:", hospitals.length);

    /* Distance filter (only when applyFilters === "true" and lat/lng present) */
    if (applyFilters === "true" && lat && lng) {
      hospitals = hospitals.filter(
        (h) => h.distance !== null && h.distance <= maxDistance
      );
    }

    // console.log("📍 After distance filter:", hospitals.length);

    /* Final format: convert availableSlots sets to arrays */
    const result = hospitals.map((h) => ({
      ...h,
      availableSlots: Array.from(h.availableSlots),
    }));

    return res.json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (err) {
    console.error("❌ ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

/* Register route (replace the inline handler with the named one) */




/** Routes
 * Note: static routes (details, profile) must be defined before the param route "/:id"
 * so they are not swallowed by the parameter route.
*/

router.get("/details", requireAuth, getPatientDetails);
router.post("/details", requireAuth, addPatientDetails);
router.get("/profile", requireAuth, getPatientDetailsForDashboard);
router.get("/available-hospitals", requireAuth, getAvailableHospitals);

// 🚨 ALWAYS LAST
router.get("/:id", requireAuth, getPatientById);

module.exports = router;