/**
 * Internal API tool layer for the chatbot.
 *
 * Calls Mongoose models directly (no HTTP loopback) to fetch
 * real user data. This is faster and avoids token re-verification
 * since the chat route already verified the JWT.
 *
 * STRICT RULES:
 *   - NEVER guess or fabricate data
 *   - NEVER call user-specific tools without a userId
 *   - Always return raw data — the LLM handles summarization
 */

const Patient = require("../../models/PatientDetails");
const User = require("../../models/Registeration");
const Appointment = require("../../models/Appointment");
const Hospital = require("../../models/HospitalDetails");
const Machine = require("../../models/Machine");

/* ═══════════════════════════════════════════════════════
   TOOL 1: Fetch Patient Profile
   ═══════════════════════════════════════════════════════ */

/**
 * Fetches the patient profile for a given userId.
 *
 * @param {string} userId - The authenticated user's ID
 * @returns {Promise<{ success: boolean, data?: Object, error?: string }>}
 */
async function fetchProfile(userId) {
  try {
    if (!userId) {
      return { success: false, error: "No userId provided" };
    }

    const user = await User.findById(userId)
      .select("fullName name email role")
      .lean();

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const patient = await Patient.findOne({
      $or: [{ userId }, { user: userId }],
    }).lean();

    if (!patient) {
      return {
        success: true,
        data: {
          fullName: (user.fullName || user.name || "").trim(),
          email: (user.email || "").trim(),
          role: user.role,
          profileCompleted: false,
          message: "Patient profile is not yet completed. Please complete your profile first.",
        },
      };
    }

    return {
      success: true,
      data: {
        fullName: patient.fullName || (user.fullName || user.name || "").trim(),
        email: patient.email || user.email,
        mobileNumber: patient.mobileNumber || null,
        age: patient.age || null,
        gender: patient.gender || null,
        bloodGroup: patient.bloodGroup || null,
        address: patient.address || null,
        profileCompleted: patient.profileCompleted !== false,
      },
    };
  } catch (error) {
    console.error("❌ fetchProfile error:", error.message);
    return { success: false, error: "Failed to fetch profile" };
  }
}

/* ═══════════════════════════════════════════════════════
   TOOL 2: Fetch Patient Appointments
   ═══════════════════════════════════════════════════════ */

/**
 * Fetches all appointments for a given userId.
 *
 * @param {string} userId - The authenticated user's ID
 * @returns {Promise<{ success: boolean, data?: Object, error?: string }>}
 */
async function fetchAppointments(userId) {
  try {
    if (!userId) {
      return { success: false, error: "No userId provided" };
    }

    const appointments = await Appointment.find({ patientId: userId })
      .populate("hospitalId", "hospitalName address city")
      .sort({ appointmentDate: -1, createdAt: -1 })
      .lean();

    if (!appointments || appointments.length === 0) {
      return {
        success: true,
        data: {
          count: 0,
          appointments: [],
          message: "You don't have any appointments yet.",
        },
      };
    }

    // Sanitize for the LLM — remove internal IDs, keep useful info
    const sanitized = appointments.map((apt) => ({
      hospitalName: apt.hospitalId?.hospitalName || "Unknown Hospital",
      hospitalAddress: apt.hospitalId?.address || "",
      hospitalCity: apt.hospitalId?.city || "",
      appointmentDate: apt.appointmentDate
        ? new Date(apt.appointmentDate).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "N/A",
      slot: apt.slot || {},
      durationHours: apt.durationHours || null,
      amount: apt.amount || null,
      status: apt.status || "unknown",
    }));

    // Categorize
    const active = sanitized.filter((a) => a.status === "active");
    const completed = sanitized.filter((a) => a.status === "completed");
    const cancelled = sanitized.filter((a) => a.status === "cancelled");

    return {
      success: true,
      data: {
        count: sanitized.length,
        active: active.length,
        completed: completed.length,
        cancelled: cancelled.length,
        appointments: sanitized,
      },
    };
  } catch (error) {
    console.error("❌ fetchAppointments error:", error.message);
    return { success: false, error: "Failed to fetch appointments" };
  }
}

/* ═══════════════════════════════════════════════════════
   TOOL 3: Search Available Hospitals
   ═══════════════════════════════════════════════════════ */

/**
 * Searches for hospitals with available dialysis slots.
 * Reuses the same business logic as GET /api/patient/available-hospitals.
 *
 * @param {{ date?: string, lat?: number, lng?: number }} params
 * @returns {Promise<{ success: boolean, data?: Object, error?: string }>}
 */
async function searchHospitals({ date, lat, lng } = {}) {
  try {
    // Default to today if no date
    const searchDate = date || new Date().toISOString().split("T")[0];

    const machines = await Machine.find().populate("hospitalId");

    // Filter machines with available slots on the given date
    const validMachines = machines.filter((machine) =>
      machine.slots.some(
        (slot) =>
          slot.date === searchDate &&
          slot.availability_status === "available"
      )
    );

    // Build hospital map (dedup by hospital)
    const hospitalMap = new Map();

    validMachines.forEach((vm) => {
      const hospital = vm.hospitalId;
      if (!hospital) return;

      const hid = hospital._id.toString();

      if (!hospitalMap.has(hid)) {
        hospitalMap.set(hid, {
          name: hospital.hospitalName || "Unknown",
          address: hospital.address || "",
          city: hospital.city || "",
          priceFor4Hrs: hospital.priceFor4Hrs || null,
          priceFor6Hrs: hospital.priceFor6Hrs || null,
          latitude: hospital.latitude || hospital.location?.coordinates?.[1] || null,
          longitude: hospital.longitude || hospital.location?.coordinates?.[0] || null,
          availableSlots: new Set(),
        });
      }

      const entry = hospitalMap.get(hid);
      vm.slots.forEach((slot) => {
        if (slot.date === searchDate && slot.availability_status === "available") {
          const label = slot.endTime
            ? `${slot.startTime} - ${slot.endTime}`
            : slot.startTime;
          entry.availableSlots.add(label);
        }
      });
    });

    let hospitals = Array.from(hospitalMap.values());

    // Calculate distance if user location is provided
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);

      hospitals = hospitals.map((h) => {
        let distance = null;
        if (h.latitude && h.longitude) {
          distance = calculateDistance(userLat, userLng, h.latitude, h.longitude);
        }
        return { ...h, distance: distance ? Number(distance.toFixed(2)) : null };
      });

      // Sort by distance
      hospitals.sort((a, b) => (a.distance || 999) - (b.distance || 999));
    }

    // Format for LLM
    const result = hospitals.slice(0, 10).map((h) => ({
      name: h.name,
      address: h.address,
      city: h.city,
      priceFor4Hrs: h.priceFor4Hrs,
      priceFor6Hrs: h.priceFor6Hrs,
      distance: h.distance ? `${h.distance} km` : null,
      availableSlots: Array.from(h.availableSlots),
    }));

    return {
      success: true,
      data: {
        count: result.length,
        searchDate,
        hospitals: result,
        message: result.length === 0
          ? `No hospitals with available slots found for ${searchDate}.`
          : null,
      },
    };
  } catch (error) {
    console.error("❌ searchHospitals error:", error.message);
    return { success: false, error: "Failed to search hospitals" };
  }
}

/* ═══════════════════════════════════════════════════════
   TOOL 4: List All Hospitals (no location/distance bias)
   ═══════════════════════════════════════════════════════ */

/**
 * Lists all hospitals with available slots today.
 * Thin wrapper over searchHospitals — no location filtering.
 */
async function listHospitals({ date } = {}) {
  return searchHospitals({ date });
}

/* ═══════════════════════════════════════════════════════
   TOOL 5: Fetch Hospital Details by Name (Fuzzy Match)
   ═══════════════════════════════════════════════════════ */

/**
 * Fetches details of a specific hospital using fuzzy name matching.
 *
 * Step 1: Fetch all hospitals via searchHospitals.
 * Step 2: Extract the hospital name from the query.
 * Step 3: Fuzzy match against all hospital names.
 * Step 4: Return the best match.
 *
 * @param {{ query: string, date?: string, lat?: number, lng?: number }} params
 * @returns {Promise<{ success: boolean, data?: Object, error?: string }>}
 */
async function fetchHospitalDetails({ query, date, lat, lng } = {}) {
  try {
    if (!query || typeof query !== "string") {
      return { success: false, error: "No query provided for hospital lookup." };
    }

    // Step 1: Get all hospitals
    const allResult = await searchHospitals({ date, lat, lng });
    if (!allResult.success || !allResult.data?.hospitals?.length) {
      return {
        success: true,
        data: {
          matched: false,
          hospital: null,
          message: "I couldn't find any hospitals with available slots right now. Try selecting a different date.",
        },
      };
    }

    const hospitals = allResult.data.hospitals;

    // Step 2: Extract hospital name from query
    const searchName = extractHospitalNameFromQuery(query);

    // Step 3: Fuzzy match
    const match = fuzzyMatchHospital(searchName, hospitals);

    if (!match) {
      return {
        success: true,
        data: {
          matched: false,
          hospital: null,
          searchTerm: searchName,
          availableHospitals: hospitals.map((h) => h.name),
          message: `I couldn't find a hospital matching "${searchName}". Here are the available hospitals you can ask about.`,
        },
      };
    }

    return {
      success: true,
      data: {
        matched: true,
        hospital: match.hospital,
        matchScore: match.score,
        searchTerm: searchName,
      },
    };
  } catch (error) {
    console.error("❌ fetchHospitalDetails error:", error.message);
    return { success: false, error: "Failed to fetch hospital details" };
  }
}

/* ═══════════════════════════════════════════════════════
   Haversine distance calculation
   ═══════════════════════════════════════════════════════ */

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/* ═══════════════════════════════════════════════════════
   Fuzzy Matching Utilities
   ═══════════════════════════════════════════════════════ */

/** Stop words to strip when extracting hospital name from query. */
const STOP_PHRASES = [
  "tell me about", "details of", "info about", "information about",
  "what is", "about hospital", "hospital details", "center details",
  "describe hospital", "describe center", "which hospital", "know about",
  "show me", "details for", "about the", "about",
  "hospital", "center", "clinic", "unit", "the",
];

/**
 * Extracts a probable hospital name from the raw user query
 * by removing known intent phrases and stop words.
 */
function extractHospitalNameFromQuery(query) {
  let name = query.toLowerCase().trim();

  // Remove stop phrases (longest first to avoid partial stripping)
  const sorted = [...STOP_PHRASES].sort((a, b) => b.length - a.length);
  for (const phrase of sorted) {
    name = name.replace(new RegExp(phrase, "gi"), "");
  }

  // Clean up whitespace
  return name.replace(/\s+/g, " ").trim();
}

/**
 * Levenshtein distance between two strings.
 */
function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

/**
 * Fuzzy match a search term against an array of hospital objects.
 * Uses a combination of:
 *   1. Exact substring match (highest priority)
 *   2. Word-overlap scoring
 *   3. Levenshtein distance (fallback)
 *
 * @param {string} searchTerm - Cleaned hospital name fragment
 * @param {Array<{ name: string }>} hospitals
 * @returns {{ hospital: Object, score: number } | null}
 */
function fuzzyMatchHospital(searchTerm, hospitals) {
  if (!searchTerm || !hospitals?.length) return null;

  const searchLower = searchTerm.toLowerCase();
  const searchWords = searchLower.split(/\s+/).filter(Boolean);

  let bestMatch = null;
  let bestScore = -1;

  for (const hospital of hospitals) {
    const nameLower = (hospital.name || "").toLowerCase();
    let score = 0;

    // Tier 1: Exact substring match (both directions)
    if (nameLower.includes(searchLower)) {
      score = 100;
    } else if (searchLower.includes(nameLower)) {
      score = 90;
    } else {
      // Tier 2: Word overlap — count how many search words appear in name
      const nameWords = nameLower.split(/\s+/);
      let wordMatches = 0;

      for (const sw of searchWords) {
        if (nameWords.some((nw) => nw.includes(sw) || sw.includes(nw))) {
          wordMatches++;
        }
      }

      const overlapRatio = searchWords.length > 0 ? wordMatches / searchWords.length : 0;
      score = overlapRatio * 80; // max 80 from word overlap

      // Tier 3: Levenshtein bonus (only if some overlap exists)
      if (score > 0) {
        const maxLen = Math.max(searchLower.length, nameLower.length);
        const dist = levenshtein(searchLower, nameLower);
        const similarity = maxLen > 0 ? (1 - dist / maxLen) : 0;
        score += similarity * 10; // small boost up to 10 points
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = { hospital, score: Math.round(score) };
    }
  }

  // Require a minimum match quality of 30%
  if (bestScore < 30) return null;

  return bestMatch;
}

/* ═══════════════════════════════════════════════════════
   Tool Router — called by the pipeline
   ═══════════════════════════════════════════════════════ */

/**
 * Executes an API tool based on the intent's apiAction.
 *
 * @param {string} apiAction - The action to perform
 * @param {{ userId?: string, lat?: number, lng?: number, date?: string }} params
 * @returns {Promise<{ success: boolean, data?: Object, error?: string, api_called: string }>}
 */
async function executeTool(apiAction, params = {}) {
  switch (apiAction) {
    case "fetch_profile":
      return {
        ...(await fetchProfile(params.userId)),
        api_called: "GET /api/patient/profile",
      };

    case "fetch_appointments":
      return {
        ...(await fetchAppointments(params.userId)),
        api_called: "GET /api/appointment/all/:patientId",
      };

    case "search_hospitals":
      return {
        ...(await searchHospitals({
          date: params.date,
          lat: params.lat,
          lng: params.lng,
        })),
        api_called: "GET /api/patient/available-hospitals",
      };

    case "list_hospitals":
      return {
        ...(await listHospitals({
          date: params.date,
        })),
        api_called: "GET /api/patient/available-hospitals",
      };

    case "fetch_hospital_details":
      return {
        ...(await fetchHospitalDetails({
          query: params.query,
          date: params.date,
          lat: params.lat,
          lng: params.lng,
        })),
        api_called: "GET /api/patient/available-hospitals (fuzzy match)",
      };

    default:
      return {
        success: false,
        error: `Unknown API action: ${apiAction}`,
        api_called: null,
      };
  }
}

module.exports = {
  fetchProfile,
  fetchAppointments,
  searchHospitals,
  listHospitals,
  fetchHospitalDetails,
  executeTool,
};
