const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const requireAuth = require("../middleware/auth.middleware");

const Hospital = require("../models/HospitalDetails");
const User = require("../models/Registeration");
const HospitalRequest = require("../models/HospitalRequest");
const Appointment = require("../models/Appointment");

/**
 * Helper to read authenticated user id from req.user.
 * Support tokens that set req.user.id, req.user.userId or req.user._id.
 */
function getAuthUserId(req) {
  return req.user?.id || req.user?.userId || req.user?._id || null;
}

function buildUserQuery(userId) {
  return { $or: [{ userId }, { user: userId }] };
}

const getHospitalDetails = async (req, res) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized: missing user in token" });

    const user = await User.findById(userId).select("fullName name email").lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    const hospital = await Hospital.findOne(buildUserQuery(userId)).lean();

    return res.status(200).json({
      message: "Hospital details fetched successfully",
      prefill: {
        hospitalName: "",
        email: (user.email || "").trim(),
      },
      hospital: hospital || null,
    });
  } catch (err) {
    console.error("getHospitalDetails error:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

function validateHospitalPayload(data) {
  const errors = {};

  if (!data.hospitalName || !String(data.hospitalName).trim()) errors.hospitalName = "hospitalName is required";
  if (!data.phone || !String(data.phone).trim()) errors.phone = "phone is required";
  if (!data.dialysisSeats && data.dialysisSeats !== 0) errors.dialysisSeats = "dialysisSeats is required";
  if (data.dialysisSeats !== undefined && Number.isNaN(Number(data.dialysisSeats))) errors.dialysisSeats = "dialysisSeats must be a number";
  if (!data.dialysisType || !String(data.dialysisType).trim()) errors.dialysisType = "dialysisType is required";
  if (!data.address || !String(data.address).trim()) errors.address = "address is required";

  if (data.latitude === null || data.latitude === undefined || Number.isNaN(Number(data.latitude)))
    errors.latitude = "latitude is required and must be a number";
  if (data.longitude === null || data.longitude === undefined || Number.isNaN(Number(data.longitude)))
    errors.longitude = "longitude is required and must be a number";

  if (!data.accountHolderName || !String(data.accountHolderName).trim()) errors.accountHolderName = "accountHolderName is required";
  if (!data.upiID || !String(data.upiID).trim()) errors.upiID = "upiID is required";

  return errors;
};

const addHospitalDetails = async (req, res) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized: missing user in token" });

    const raw = req.body || {};

    // If model provides normalizeFromForm, use it; otherwise build normalized object here.
    // Note: we intentionally do NOT set price fields here - they are handled conditionally below.
    const normalized = typeof Hospital.normalizeFromForm === "function"
      ? Hospital.normalizeFromForm(raw)
      : {
        userId: userId,
        hospitalName: raw.hospitalName || "",
        registrationNumber: raw.registrationNumber || "",
        phone: raw.phone || "",
        dialysisSeats: raw.dialysisSeats !== undefined && raw.dialysisSeats !== "" ? Number(raw.dialysisSeats) : 0,
        // priceFor4Hrs, priceFor6Hrs, priceForPD handled below based on dialysisType
        dialysisType: raw.dialysisType || "",
        address: raw.address || "",
        latitude: raw.latitude !== undefined && raw.latitude !== null ? Number(raw.latitude) : null,
        longitude: raw.longitude !== undefined && raw.longitude !== null ? Number(raw.longitude) : null,
        accountHolderName: raw.accountHolderName || "",
        upiID: raw.upiID || "",
        isActive: raw.isActive !== undefined ? !!raw.isActive : true,
        isVerified: raw.isVerified !== undefined ? !!raw.isVerified : false,
      };

    // Fetch authoritative user email
    const user = await User.findById(userId).select("email fullName name").lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    normalized.email = (user.email || "").trim().toLowerCase();
    // allow optional hospitalName fallback to user's name if client didn't supply
    if (!normalized.hospitalName || !String(normalized.hospitalName).trim()) {
      normalized.hospitalName = (user.fullName || user.name || "").trim();
    }

    // Decide which price fields are required / accepted based on dialysisType
    const dt = (normalized.dialysisType || "").toString().toLowerCase().trim();
    const isHemodialysis = dt === "hemodialysis" || dt === "hemo" || dt === "hd";
    const isPeritoneal = dt === "peritoneal dialysis" || dt === "peritoneal" || dt === "pd";
    const isBoth = dt === "both";

    const requiresHemodialysisPrices = isHemodialysis || isBoth;
    const requiresPDPrice = isPeritoneal || isBoth;

    // Parse and attach price fields only if applicable. If not applicable, leave undefined so we can unset on update.
    if (requiresHemodialysisPrices) {
      normalized.priceFor4Hrs = raw.priceFor4Hrs !== undefined && raw.priceFor4Hrs !== "" ? Number(raw.priceFor4Hrs) : null;
      normalized.priceFor6Hrs = raw.priceFor6Hrs !== undefined && raw.priceFor6Hrs !== "" ? Number(raw.priceFor6Hrs) : null;
    } else {
      normalized.priceFor4Hrs = undefined;
      normalized.priceFor6Hrs = undefined;
    }

    if (requiresPDPrice) {
      normalized.priceForPD = raw.priceForPD !== undefined && raw.priceForPD !== "" ? Number(raw.priceForPD) : null;
    } else {
      normalized.priceForPD = undefined;
    }

    // Controller-level validation: ensure required price fields are provided by frontend
    const errors = {};

    if (requiresHemodialysisPrices) {
      if (normalized.priceFor4Hrs === null || isNaN(normalized.priceFor4Hrs) || normalized.priceFor4Hrs < 0) {
        errors.priceFor4Hrs = "priceFor4Hrs is required for hemodialysis/both and must be a number >= 0";
      }
      if (normalized.priceFor6Hrs === null || isNaN(normalized.priceFor6Hrs) || normalized.priceFor6Hrs < 0) {
        errors.priceFor6Hrs = "priceFor6Hrs is required for hemodialysis/both and must be a number >= 0";
      }
    }

    if (requiresPDPrice) {
      if (normalized.priceForPD === null || isNaN(normalized.priceForPD) || normalized.priceForPD < 0) {
        errors.priceForPD = "priceForPD is required for peritoneal dialysis/both and must be a number >= 0";
      }
    }

    // Merge with existing payload validator errors (if any)
    const otherErrors = validateHospitalPayload ? validateHospitalPayload(normalized) : {};
    const mergedErrors = Object.assign({}, otherErrors, errors);
    if (Object.keys(mergedErrors).length > 0) {
      return res.status(400).json({ ok: false, errors: mergedErrors });
    }

    // Find existing hospital for this user (support userId or user field)
    const existing = await Hospital.findOne(buildUserQuery(userId)).lean();

    let saved;
    if (existing && existing._id) {
      // Update existing; only set allowed fields to avoid accidental overwrite
      const updateSet = {
        hospitalName: normalized.hospitalName,
        registrationNumber: normalized.registrationNumber,
        type: normalized.type,
        phone: normalized.phone,
        email: normalized.email,
        is24x7: normalized.is24x7,
        operatingHours: normalized.operatingHours,
        dialysisSeats: Number(normalized.dialysisSeats),
        dialysisType: normalized.dialysisType,
        address: normalized.address,
        latitude: normalized.latitude,
        longitude: normalized.longitude,
        accountHolderName: normalized.accountHolderName,
        upiID: normalized.upiID,
        isActive: normalized.isActive,
        isVerified: normalized.isVerified,
      };

      // Conditionally include applicable price fields into $set, and prepare $unset for non-applicable
      const unset = {};
      if (requiresHemodialysisPrices) {
        updateSet.priceFor4Hrs = Number(normalized.priceFor4Hrs);
        updateSet.priceFor6Hrs = Number(normalized.priceFor6Hrs);
      } else {
        // remove any existing hemo prices
        unset.priceFor4Hrs = "";
        unset.priceFor6Hrs = "";
      }

      if (requiresPDPrice) {
        updateSet.priceForPD = Number(normalized.priceForPD);
      } else {
        unset.priceForPD = "";
      }

      // Build update object with $set and optional $unset
      const updateObj = { $set: updateSet };
      if (Object.keys(unset).length > 0) updateObj.$unset = unset;

      saved = await Hospital.findByIdAndUpdate(
        existing._id,
        updateObj,
        { new: true, runValidators: true, setDefaultsOnInsert: true }
      ).lean();
    } else {
      // Create new hospital, ensure userId set
      normalized.userId = userId;
      // Ensure we do not include undefined price fields in the document
      if (normalized.priceFor4Hrs === undefined) delete normalized.priceFor4Hrs;
      if (normalized.priceFor6Hrs === undefined) delete normalized.priceFor6Hrs;
      if (normalized.priceForPD === undefined) delete normalized.priceForPD;

      try {
        const created = await Hospital.create(normalized);
        saved = created.toObject ? created.toObject() : created;
      } catch (err) {
        // bubble unique/index errors as 409
        if (err && err.code === 11000) {
          return res.status(409).json({ ok: false, message: "Duplicate field error", details: err.keyValue });
        }
        throw err;
      }
    }

    return res.status(200).json({
      message: "Hospital profile saved successfully",
      user: { id: userId, email: normalized.email },
      hospital: saved,
    });
  } catch (err) {
    console.error("addHospitalDetails error:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

const RequestToAddHospitalDetails = async (req, res) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId)
      return res.status(401).json({ message: "Unauthorized: missing user in token" });

    const raw = req.body || {};

    /* ---------------- NORMALIZATION ---------------- */
    const normalized =
      typeof HospitalRequest.normalizeFromForm === "function"
        ? HospitalRequest.normalizeFromForm(raw)
        : {
          userId: userId,
          status: "pending",

          hospitalName: raw.hospitalName || "",
          registrationNumber: raw.registrationNumber || "",
          phone: raw.phone || "",

          dialysisSeats:
            raw.dialysisSeats !== undefined && raw.dialysisSeats !== ""
              ? Number(raw.dialysisSeats)
              : 0,

          dialysisType: raw.dialysisType || "",

          /* ✅ SLOTS ADDED HERE */
          slots: {
            numberOf4HrsSessionsPerDay:
              raw?.slots?.numberOf4HrsSessionsPerDay || 0,

            numberOf6HrsSessionsPerDay:
              raw?.slots?.numberOf6HrsSessionsPerDay || 0,

            firstStart4h: raw?.slots?.firstStart4h || "09:00",
            firstStart6h: raw?.slots?.firstStart6h || "09:00",

            slots4h: raw?.slots?.slots4h || [],
            slots6h: raw?.slots?.slots6h || [],
          },

          address: raw.address || "",
          latitude:
            raw.latitude !== undefined && raw.latitude !== null
              ? Number(raw.latitude)
              : null,
          longitude:
            raw.longitude !== undefined && raw.longitude !== null
              ? Number(raw.longitude)
              : null,

          accountHolderName: raw.accountHolderName || "",
          upiID: raw.upiID || "",

          isActive: raw.isActive !== undefined ? !!raw.isActive : true,
          isVerified: raw.isVerified !== undefined ? !!raw.isVerified : false,
        };

    /* ---------------- USER FETCH ---------------- */
    const user = await User.findById(userId).lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    normalized.email = (user.email || "").trim().toLowerCase();

    if (!normalized.hospitalName || !String(normalized.hospitalName).trim()) {
      normalized.hospitalName = (user.fullName || user.name || "").trim();
    }

    /* ---------------- DIALYSIS LOGIC ---------------- */
    const dt = (normalized.dialysisType || "").toLowerCase().trim();

    const isHemodialysis = ["hemodialysis", "hemo", "hd"].includes(dt);
    const isPeritoneal = ["peritoneal dialysis", "peritoneal", "pd"].includes(dt);
    const isBoth = dt === "both";

    const requiresHemodialysisPrices = isHemodialysis || isBoth;
    const requiresPDPrice = isPeritoneal || isBoth;

    if (requiresHemodialysisPrices) {
      normalized.priceFor4Hrs =
        raw.priceFor4Hrs !== undefined && raw.priceFor4Hrs !== ""
          ? Number(raw.priceFor4Hrs)
          : null;

      normalized.priceFor6Hrs =
        raw.priceFor6Hrs !== undefined && raw.priceFor6Hrs !== ""
          ? Number(raw.priceFor6Hrs)
          : null;
    } else {
      normalized.priceFor4Hrs = undefined;
      normalized.priceFor6Hrs = undefined;
    }

    if (requiresPDPrice) {
      normalized.priceForPD =
        raw.priceForPD !== undefined && raw.priceForPD !== ""
          ? Number(raw.priceForPD)
          : null;
    } else {
      normalized.priceForPD = undefined;
    }

    /* ---------------- VALIDATION ---------------- */
    const errors = {};

    if (requiresHemodialysisPrices) {
      if (
        normalized.priceFor4Hrs === null ||
        isNaN(normalized.priceFor4Hrs) ||
        normalized.priceFor4Hrs < 0
      ) {
        errors.priceFor4Hrs = "priceFor4Hrs required";
      }

      if (
        normalized.priceFor6Hrs === null ||
        isNaN(normalized.priceFor6Hrs) ||
        normalized.priceFor6Hrs < 0
      ) {
        errors.priceFor6Hrs = "priceFor6Hrs required";
      }
    }

    if (requiresPDPrice) {
      if (
        normalized.priceForPD === null ||
        isNaN(normalized.priceForPD) ||
        normalized.priceForPD < 0
      ) {
        errors.priceForPD = "priceForPD required";
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ ok: false, errors });
    }

    /* ---------------- FIND EXISTING ---------------- */
    const existing = await HospitalRequest.findOne({ userId }).lean();

    let saved;

    if (existing && existing._id) {
      /* ---------------- UPDATE ---------------- */
      const updateSet = {
        status: "pending",
        hospitalName: normalized.hospitalName,
        registrationNumber: normalized.registrationNumber,
        phone: normalized.phone,
        email: normalized.email,
        dialysisSeats: Number(normalized.dialysisSeats),
        dialysisType: normalized.dialysisType,

        /* ✅ SLOTS ADDED HERE */
        slots: normalized.slots,

        address: normalized.address,
        latitude: normalized.latitude,
        longitude: normalized.longitude,
        accountHolderName: normalized.accountHolderName,
        upiID: normalized.upiID,
        isActive: normalized.isActive,
        isVerified: normalized.isVerified,
      };

      const unset = {};

      if (requiresHemodialysisPrices) {
        updateSet.priceFor4Hrs = Number(normalized.priceFor4Hrs);
        updateSet.priceFor6Hrs = Number(normalized.priceFor6Hrs);
      } else {
        unset.priceFor4Hrs = "";
        unset.priceFor6Hrs = "";
      }

      if (requiresPDPrice) {
        updateSet.priceForPD = Number(normalized.priceForPD);
      } else {
        unset.priceForPD = "";
      }

      const updateObj = { $set: updateSet };
      if (Object.keys(unset).length > 0) updateObj.$unset = unset;

      saved = await HospitalRequest.findByIdAndUpdate(existing._id, updateObj, {
        new: true,
        runValidators: true,
      }).lean();
    } else {
      /* ---------------- CREATE ---------------- */
      normalized.userId = userId;

      if (normalized.priceFor4Hrs === undefined) delete normalized.priceFor4Hrs;
      if (normalized.priceFor6Hrs === undefined) delete normalized.priceFor6Hrs;
      if (normalized.priceForPD === undefined) delete normalized.priceForPD;

      const created = await HospitalRequest.create(normalized);
      saved = created.toObject();
    }

    return res.status(200).json({
      message: "Hospital profile saved successfully",
      hospital: saved,
    });
  } catch (err) {
    console.error("addHospitalDetails error:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

const getHospitalDetailsForDashboard = async (req, res) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId).select("fullName name email").lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    const hospital = await Hospital.findOne(buildUserQuery(userId)).lean();

    return res.status(200).json({
      message: "Hospital details fetched successfully",
      prefill: {
        hospitalName: (user.fullName || user.name || "").trim(),
        email: (user.email || "").trim(),
      },
      hospital: hospital || null,
    });
  } catch (err) {
    console.error("GET /api/hospital/profile error:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

const getHospitalById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid or missing hospital id" });
    }

    // console.log("Fetching hospital by id:", id);
    const hospital = await User.findById(id).lean();
    // console.log("Hospital record from User model:", hospital);
    const email = hospital.email;
    // console.log("Hospital email from User model:", email);
    const role = hospital.role;

    const hospitalFromHospitalModel = await Hospital.findOne({ email });
    // console.log("hospitalFromHospitalModel:", hospitalFromHospitalModel);

    if (!hospitalFromHospitalModel) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    // Authorization: allow owner (matching userId/user) or hospital_admin role
    const authUserId = getAuthUserId(req);
    const authRole = req.user?.role;

    // const isOwner =
    //   String(hospitalFromHospitalModel._id || "") === String(authUserId);
    //   console.log("isOwner:", isOwner, "authUserId:", authUserId, "hospitalFromHospitalModel._id:", hospitalFromHospitalModel._id);

    // if (!isOwner && authRole !== "patient") {
    //   return res.status(403).json({ message: "Forbidden: you are not allowed to access this hospital" });
    // }

    return res.status(200).json({ hospitalFromHospitalModel });
  } catch (err) {
    console.error("getHospitalById error:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

const fetchHospitalById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid or missing hospital id" });
    }

    // console.log("Fetching hospital by id:", id);
    const hospital = await Hospital.findById(id).lean();
    console.log("Hospital record from Hospital model:", hospital);

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    // Authorization: allow owner (matching userId/user) or hospital_admin role
    const authUserId = getAuthUserId(req);
    const authRole = req.user?.role;

    return res.status(200).json({ hospital });
  } catch (err) {
    console.error("getHospitalById error:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// const getAppointmentsForHospital = async (req, res) => {
//   try {
//     const hospitalId = req.params.id;
//     if (!hospitalId || !mongoose.Types.ObjectId.isValid(hospitalId)) {
//       return res.status(400).json({ message: "Invalid or missing hospital id" });
//     }
//     console.log("getAppointmentsForHospital called with hospitalId:", hospitalId);
//     // Step 1: find user by hospitalId
//     const user = await User.findById(hospitalId).select("email").lean();

//     if (!user) {
//       throw new Error("User not found");
//     }
//     console.log("User found for hospitalId:", user);

//     // Step 2: find hospital using email
//     const hospital = await Hospital.findOne({ email: user.email })
//       .select("_id")
//       .lean();
//     console.log("Hospital found for user email:", hospital);
//     if (!hospital) {
//       throw new Error("Hospital not found");
//     }

//     // Step 3: actual hospitalId
//     const newHospitalId = hospital._id;
//     console.log("Actual hospitalId to query appointments:", newHospitalId);

//     const appointments = await Appointment.find({ hospitalId: newHospitalId }).lean();

//     return res.status(200).json({ appointments });
//   } catch (err) {
//     console.error("getAppointmentsForHospital error:", err);
//     return res.status(500).json({ message: "Internal server error", error: err.message });
//   }
// };

const getAppointmentsForHospital = async (req, res) => {
  try {
    const hospitalId = req.params.id;

    if (!hospitalId || !mongoose.Types.ObjectId.isValid(hospitalId)) {
      return res.status(400).json({ message: "Invalid or missing hospital id" });
    }

    // Step 1: Get user
    const user = await User.findById(hospitalId).select("email").lean();
    if (!user) throw new Error("User not found");

    // Step 2: Get hospital
    const hospital = await Hospital.findOne({ email: user.email })
      .select("_id")
      .lean();
    if (!hospital) throw new Error("Hospital not found");

    const newHospitalId = hospital._id;

    // ✅ Step 3: Fetch + populate patient
    const appointments = await Appointment.find({ hospitalId: newHospitalId })
      .populate("patientId", "name age phone address") // 🔥 IMPORTANT
      .sort({ appointmentDate: 1 })
      .lean();

    // ✅ Step 4: Format response for frontend
    const formattedAppointments = appointments.map((a) => ({
      _id: a._id,
      appointmentId: a._id.toString().slice(-6),

      patientName: a.patientId?.name || "Unknown",
      age: a.patientId?.age || "-",
      phone: a.patientId?.phone || "-",
      address: a.patientId?.address || "Not available",

      date: a.appointmentDate,
      time: a.slot?.slot || "-", // "15:45 - 21:45"

      status: a.status,
      amount: a.amount,
      duration: a.durationHours,
    }));

    return res.status(200).json({ appointments: formattedAppointments });

  } catch (err) {
    console.error("getAppointmentsForHospital error:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};


router.get("/details", requireAuth, getHospitalDetails);
router.post("/details", requireAuth, addHospitalDetails);
router.get("/profile", requireAuth, getHospitalDetailsForDashboard);
router.post("/request-add", requireAuth, RequestToAddHospitalDetails);
router.get("/fetch/:id", requireAuth, fetchHospitalById);
router.get("/:id", requireAuth, getHospitalById);
router.get("/appointments/:id", requireAuth, getAppointmentsForHospital);

module.exports = router;