/**
 * Structured knowledge extracted from api-docs.md and features.md
 * ONLY active endpoints (mounted in app.js) are included.
 * Inactive routes: user.routes.js, machine.routes.js, appointment.routes.js,
 *                  availability.routes.js, patientHospital.routes.js
 */

const apiDocuments = [
  // ────────────────── AUTH MODULE ──────────────────
  {
    type: "api",
    module: "auth",
    route: "POST /api/auth/register",
    description:
      "Registers a new user with role patient, hospital_admin, or admin. Stores a hashed password, creates an email OTP, and sends that OTP to the user's email address.",
    input: {
      email: "string, required",
      password: "string, required, minimum 6 characters",
      role: "patient | hospital_admin | admin",
    },
    output: {
      message: "Registered successfully. OTP sent to email.",
      user: {
        _id: "string",
        email: "string",
        role: "string",
        isEmailVerified: false,
      },
    },
    errors: [
      "400 — email, password and role are required.",
      "400 — Invalid role. Allowed roles: patient, hospital_admin, admin",
      "400 — Password must be at least 6 characters long.",
      "409 — User already exists with this email.",
      "500 — Internal server error",
    ],
    auth: "none",
  },
  {
    type: "api",
    module: "auth",
    route: "POST /api/auth/verify-otp",
    description:
      "Verifies the OTP sent during registration and marks the user's email as verified.",
    input: {
      email: "string, required",
      otp: "string, required",
    },
    output: { message: "Email verified successfully." },
    errors: [
      "400 — email and otp are required.",
      "404 — User not found.",
      "401 — OTP not found or expired. Please request again.",
      "401 — OTP expired. Please request again.",
      "401 — Invalid OTP.",
      "429 — Too many attempts. Please request a new OTP.",
      "500 — Internal server error",
    ],
    auth: "none",
  },
  {
    type: "api",
    module: "auth",
    route: "POST /api/auth/login",
    description:
      "Authenticates a registered user with email and password, then returns a JWT and user summary. The current controller does not block login when email verification is incomplete.",
    input: {
      email: "string, required",
      password: "string, required",
    },
    output: {
      message: "Login successful",
      token: "jwt_token",
      user: {
        _id: "string",
        email: "string",
        role: "string",
        isEmailVerified: "boolean",
      },
    },
    errors: [
      "400 — email and password are required.",
      "401 — Invalid email or password.",
      "500 — Internal server error",
    ],
    auth: "none",
  },

  // ────────────────── PATIENT MODULE ──────────────────
  {
    type: "api",
    module: "search",
    route: "GET /api/patient/available-hospitals",
    description:
      "Returns hospitals that have at least one machine with an available slot on the requested date. Optional filters can restrict results by price and distance. Does not require authentication.",
    input: {
      date: "string, required, YYYY-MM-DD or ISO date (query param)",
      applyFilters: "string, optional, 'true' to apply filters (query param)",
      lat: "number, optional (query param)",
      lng: "number, optional (query param)",
      maxDistance: "number, optional, default 50 km (query param)",
      minPrice: "number, optional, default 0 (query param)",
      maxPrice: "number, optional, default 50000 (query param)",
    },
    output: {
      success: true,
      count: "number",
      data: [
        {
          _id: "string",
          hospitalName: "string",
          email: "string",
          phone: "string",
          dialysisSeats: "number",
          dialysisType: "string",
          priceFor4Hrs: "number",
          priceFor6Hrs: "number",
          address: "string",
          distance: "number (km)",
          availableSlots: ["09:00 - 13:00"],
        },
      ],
    },
    errors: [
      "400 — Date is required",
      "500 — Server error",
    ],
    auth: "none",
  },
  {
    type: "api",
    module: "profile",
    route: "GET /api/patient/details",
    description:
      "Returns prefill data for the authenticated user and the existing patient profile if one exists.",
    input: {},
    output: {
      message: "Patient details fetched successfully",
      prefill: { fullName: "string", email: "string" },
      patient: "Patient object or null",
    },
    errors: [
      "401 — Unauthorized: Authorization header missing",
      "404 — User not found",
      "500 — Internal server error",
    ],
    auth: "Bearer JWT",
  },
  {
    type: "api",
    module: "profile",
    route: "POST /api/patient/details",
    description:
      "Creates or updates the authenticated user's patient profile. Email is taken from the authenticated user record, not from the request body.",
    input: {
      fullName: "string, optional",
      mobileNumber: "string, required",
      age: "number, required, positive",
      gender: "string, required",
      bloodGroup: "string, required",
      address: "string, required",
      latitude: "number or null, optional",
      longitude: "number or null, optional",
      profileCompleted: "boolean, optional",
    },
    output: {
      message: "Patient profile saved successfully",
      user: { id: "string", email: "string" },
      patient: "Patient object",
    },
    errors: [
      "400 — mobileNumber is required",
      "400 — age must be a valid positive number",
      "401 — Unauthorized: Invalid token",
      "404 — User not found",
      "500 — Internal server error",
    ],
    auth: "Bearer JWT",
  },
  {
    type: "api",
    module: "profile",
    route: "GET /api/patient/profile",
    description:
      "Returns the authenticated patient's dashboard profile data, including user prefill fields and the patient profile when present.",
    input: {},
    output: {
      message: "Patient details fetched successfully",
      prefill: { fullName: "string", email: "string" },
      patient: "Patient object or null",
    },
    errors: [
      "401 — Unauthorized",
      "404 — User not found",
      "500 — Internal server error",
    ],
    auth: "Bearer JWT",
  },
  {
    type: "api",
    module: "profile",
    route: "GET /api/patient/:id",
    description:
      "Fetches a patient profile by registration user ID. Access is intended for the profile owner or a hospital admin.",
    input: {
      id: "string, MongoDB ObjectId of the registration user (URL param)",
    },
    output: {
      patientFromPatientModel: "Patient object",
    },
    errors: [
      "400 — Invalid or missing patient id",
      "403 — Forbidden: you are not allowed to access this patient record",
      "404 — Patient not found",
      "500 — Internal server error",
    ],
    auth: "Bearer JWT",
  },

  // ────────────────── HOSPITAL MODULE ──────────────────
  {
    type: "api",
    module: "profile",
    route: "GET /api/hospital/details",
    description:
      "Returns prefill data for the authenticated hospital admin and the existing hospital profile if one exists.",
    input: {},
    output: {
      message: "Hospital details fetched successfully",
      prefill: { hospitalName: "string", email: "string" },
      hospital: "Hospital object or null",
    },
    errors: [
      "401 — Unauthorized: missing user in token",
      "404 — User not found",
      "500 — Internal server error",
    ],
    auth: "Bearer JWT",
  },
  {
    type: "api",
    module: "profile",
    route: "POST /api/hospital/details",
    description:
      "Creates or updates the authenticated hospital admin's hospital profile. Validates hospital basics, location, bank/UPI details, dialysis type, and required price fields.",
    input: {
      hospitalName: "string, required unless user name fallback exists",
      registrationNumber: "string, required, 10 digits",
      phone: "string, required",
      dialysisSeats: "number, required",
      dialysisType: "hemodialysis | peritoneal dialysis | both",
      priceFor4Hrs: "number, required for hemodialysis or both",
      priceFor6Hrs: "number, required for hemodialysis or both",
      priceForPD: "number, required for peritoneal dialysis or both",
      address: "string, required",
      latitude: "number, required",
      longitude: "number, required",
      accountHolderName: "string, required",
      upiID: "string, required",
    },
    output: {
      message: "Hospital profile saved successfully",
      user: { id: "string", email: "string" },
      hospital: "Hospital object",
    },
    errors: [
      "400 — validation errors object (phone, latitude, etc.)",
      "409 — Duplicate field error (registrationNumber)",
      "401 — Unauthorized: Invalid token",
      "404 — User not found",
      "500 — Internal server error",
    ],
    auth: "Bearer JWT",
  },
  {
    type: "api",
    module: "profile",
    route: "GET /api/hospital/profile",
    description:
      "Returns the authenticated hospital admin's dashboard profile data, including user prefill fields and the linked hospital profile when present.",
    input: {},
    output: {
      message: "Hospital details fetched successfully",
      prefill: { hospitalName: "string", email: "string" },
      hospital: "Hospital object or null",
    },
    errors: [
      "401 — Unauthorized",
      "404 — User not found",
      "500 — Internal server error",
    ],
    auth: "Bearer JWT",
  },
  {
    type: "api",
    module: "admin",
    route: "POST /api/hospital/request-add",
    description:
      "Creates or updates a pending hospital onboarding request for the authenticated hospital admin. Admins later review this request. Includes slot configuration with 4hr and 6hr sessions.",
    input: {
      hospitalName: "string",
      registrationNumber: "string, 10 digits",
      phone: "string",
      dialysisSeats: "number",
      dialysisType: "hemodialysis | peritoneal dialysis | both",
      priceFor4Hrs: "number, required for hemodialysis or both",
      priceFor6Hrs: "number, required for hemodialysis or both",
      priceForPD: "number, required for peritoneal dialysis or both",
      slots: {
        numberOf4HrsSessionsPerDay: "number",
        numberOf6HrsSessionsPerDay: "number",
        slots4h: [{ start: "string", end: "string" }],
        slots6h: [{ start: "string", end: "string" }],
      },
      address: "string",
      latitude: "number",
      longitude: "number",
      accountHolderName: "string",
      upiID: "string",
    },
    output: {
      message: "Hospital profile saved successfully",
      hospital: "HospitalRequest object with status: pending",
    },
    errors: [
      "400 — validation errors (priceFor4Hrs required, etc.)",
      "401 — Unauthorized: Invalid token",
      "404 — User not found",
      "500 — Internal server error",
    ],
    auth: "Bearer JWT",
  },
  {
    type: "api",
    module: "search",
    route: "GET /api/hospital/fetch/:id",
    description:
      "Fetches a hospital profile directly by hospital document ID.",
    input: {
      id: "string, MongoDB ObjectId of the hospital document (URL param)",
    },
    output: { hospital: "Hospital object" },
    errors: [
      "400 — Invalid or missing hospital id",
      "404 — Hospital not found",
      "500 — Internal server error",
    ],
    auth: "Bearer JWT",
  },
  {
    type: "api",
    module: "search",
    route: "GET /api/hospital/:id",
    description:
      "Fetches a hospital profile by registration user ID. The controller looks up the registration user first, then finds the hospital by that user's email.",
    input: {
      id: "string, MongoDB ObjectId of the registration user (URL param)",
    },
    output: { hospitalFromHospitalModel: "Hospital object" },
    errors: [
      "400 — Invalid or missing hospital id",
      "404 — Hospital not found",
      "500 — Internal server error",
    ],
    auth: "Bearer JWT",
  },
  {
    type: "api",
    module: "booking",
    route: "GET /api/hospital/appointments/:id",
    description:
      "Returns all appointments for a hospital admin's hospital. The id parameter is the registration user ID; the controller resolves the hospital by the user's email.",
    input: {
      id: "string, MongoDB ObjectId of the hospital admin registration user (URL param)",
    },
    output: { appointments: ["Appointment objects"] },
    errors: [
      "400 — Invalid or missing hospital id",
      "500 — Internal server error",
    ],
    auth: "Bearer JWT",
  },

  // ────────────────── ADMIN MODULE ──────────────────
  {
    type: "api",
    module: "admin",
    route: "GET /api/admin/requests",
    description:
      "Lists hospital onboarding requests, with optional status filter, text search, and pagination. Admin-only access.",
    input: {
      status: "pending | accepted | rejected | changes_requested (query, optional)",
      search: "string (query, optional)",
      page: "number, default 1 (query, optional)",
      limit: "number, default 20 (query, optional)",
    },
    output: {
      ok: true,
      data: ["HospitalRequest objects"],
      meta: { total: "number", page: "number", limit: "number" },
    },
    errors: [
      "401 — Unauthorized: token missing",
      "403 — Forbidden: admin role required",
      "500 — Failed to list requests",
    ],
    auth: "Bearer JWT (admin role)",
  },
  {
    type: "api",
    module: "admin",
    route: "GET /api/admin/requests/:id",
    description:
      "Fetches a single hospital onboarding request by request ID. Admin-only access.",
    input: {
      id: "string, MongoDB ObjectId of the hospital request (URL param)",
    },
    output: { ok: true, data: "HospitalRequest object" },
    errors: [
      "404 — Not found",
      "500 — Failed to fetch request",
    ],
    auth: "Bearer JWT (admin role)",
  },
  {
    type: "api",
    module: "admin",
    route: "PATCH /api/admin/requests/:id/status",
    description:
      "Updates a hospital onboarding request status. When accepted, the controller creates the hospital record and dialysis machines with generated slots, then sends a status email to the hospital.",
    input: {
      id: "string, MongoDB ObjectId (URL param)",
      status: "accepted | rejected | changes_requested (body)",
      note: "string, optional (body)",
    },
    output: {
      ok: true,
      data: "Updated HospitalRequest object",
      email: { to: "string", sent: true, error: null },
    },
    errors: [
      "400 — Invalid status value",
      "404 — Request not found",
      "500 — Failed to update status",
    ],
    auth: "Bearer JWT (admin role)",
  },

  // ────────────────── PAYMENT MODULE ──────────────────
  {
    type: "api",
    module: "payment",
    route: "POST /api/payment",
    description:
      "Generates a UPI payment URL and QR code data URL for a supplied amount, payee name, and UPI ID.",
    input: {
      amount: "number or string, required",
      name: "string, required",
      upiID: "string, required",
    },
    output: {
      qrCode: "data:image/png;base64,... (QR code image)",
      upiUrl: "upi://pay?pa=...&pn=...&am=...&cu=INR",
    },
    errors: ["500 — QR generation failed"],
    auth: "none",
  },

  // ────────────────── APPOINTMENT MODULE ──────────────────
  {
    type: "api",
    module: "booking",
    route: "POST /api/appointment/confirm",
    description:
      "Confirms a dialysis appointment for a patient at a hospital. Prevents duplicate active bookings for the same patient/hospital/date/slot and rejects fully booked slots. Duration must be 4 or 6 hours.",
    input: {
      patientId: "string, MongoDB ObjectId, required",
      hospitalId: "string, MongoDB ObjectId, required",
      appointmentDate: "string or date, required",
      durationHours: "number, 4 or 6, required",
      slot: "object { startTime, endTime }, required",
      amount: "number, required",
    },
    output: {
      success: true,
      message: "Appointment confirmed",
      appointment: "Appointment object with status: active",
    },
    errors: [
      "400 — Missing required fields",
      "400 — You already booked this slot",
      "400 — Slot is fully booked",
      "404 — Hospital not found",
      "500 — Server error",
    ],
    auth: "none",
  },
  {
    type: "api",
    module: "booking",
    route: "GET /api/appointment/all/:patientId",
    description:
      "Returns all appointments for a patient, with hospital name and address populated, sorted newest first.",
    input: {
      patientId: "string, MongoDB ObjectId (URL param)",
    },
    output: {
      success: true,
      count: "number",
      appointments: ["Appointment objects with populated hospitalId"],
    },
    errors: [
      "400 — Patient ID is required",
      "500 — Server error",
    ],
    auth: "none",
  },
];

// ────────────────── FEATURE DOCUMENTS ──────────────────

const featureDocuments = [
  {
    type: "feature",
    module: "general",
    description:
      "HealthSetu is a digital platform designed to bridge the gap between kidney disease patients and hospitals providing dialysis services. It offers a centralized solution to find, book, and manage dialysis appointments in real-time based on location and availability.",
    steps: [],
  },
  {
    type: "feature",
    module: "auth",
    description:
      "Secure Authentication — Users register with an email, password, and role (patient, hospital_admin, or admin). An email OTP is sent during registration for verification. Users log in with email and password to receive a JWT token for authenticated access.",
    steps: [
      "User provides email, password, and role",
      "System stores hashed password and sends OTP to email",
      "User enters OTP to verify email",
      "User logs in with email + password to receive JWT",
      "JWT is included in Authorization header for protected routes",
    ],
  },
  {
    type: "feature",
    module: "search",
    description:
      "Smart Hospital Search — Patients can search for hospitals with available dialysis slots on a specific date. Filters allow narrowing results by distance (using lat/lng coordinates) and price range. Results include available slot times, dialysis types, and pricing.",
    steps: [
      "Patient selects a date for dialysis",
      "System finds hospitals with available machine slots for that date",
      "Patient can apply filters: max distance in km, min/max price",
      "Results show hospital details, available slots, distance, pricing",
      "Patient selects a hospital and slot to proceed with booking",
    ],
  },
  {
    type: "feature",
    module: "booking",
    description:
      "Appointment Booking — Patients book dialysis sessions at available hospitals. The system prevents duplicate bookings (same patient, hospital, date, slot) and rejects fully booked slots. Appointments track duration (4 or 6 hours), slot time, amount, and status (active, completed, cancelled).",
    steps: [
      "Patient searches for available hospitals on a date",
      "Patient selects a hospital and time slot (4hr or 6hr)",
      "System checks for duplicate bookings and slot availability",
      "Payment is processed via UPI QR code",
      "Appointment is confirmed with status 'active'",
      "Patient and hospital can view the appointment in their dashboards",
    ],
  },
  {
    type: "feature",
    module: "profile",
    description:
      "User & Hospital Profile Management — Patients manage their profiles including personal details (name, age, gender, blood group), contact info, and location. Hospital admins manage hospital details including name, registration number, dialysis type/pricing, slots, location, and payment info (UPI).",
    steps: [
      "Authenticated user navigates to profile/details page",
      "System prefills known fields (email, name from registration)",
      "User enters required fields (mobile, age, gender, blood group, address)",
      "Profile is saved/updated via POST endpoint",
      "Dashboard displays current profile data",
    ],
  },
  {
    type: "feature",
    module: "admin",
    description:
      "Admin Hospital Verification — Hospital admins submit onboarding requests with full facility details and slot configuration. System admins review these requests with status filter, search, and pagination. Admins can approve, reject, or request changes. On acceptance, the system automatically creates the hospital record, generates machine entries with slots, and sends notification emails.",
    steps: [
      "Hospital admin registers and creates onboarding request via POST /api/hospital/request-add",
      "Request is stored with status 'pending'",
      "System admin views pending requests via GET /api/admin/requests?status=pending",
      "Admin reviews individual request details",
      "Admin updates status to accepted/rejected/changes_requested via PATCH",
      "If accepted: hospital record + machines + slots are auto-created",
      "Status notification email is sent to the hospital",
    ],
  },
  {
    type: "feature",
    module: "payment",
    description:
      "Integrated Payment System — Payments are processed via UPI. The system generates a UPI payment URL and a QR code image for the specified amount, payee name, and UPI ID. Patients scan the QR code to complete payment before appointment confirmation.",
    steps: [
      "Patient selects a slot and sees the amount",
      "System calls POST /api/payment with amount, hospital name, and UPI ID",
      "Backend generates UPI URL and QR code (base64 PNG)",
      "Patient scans QR code with any UPI app to pay",
      "After payment, appointment confirmation is triggered",
    ],
  },
  {
    type: "feature",
    module: "general",
    description:
      "Renal Function Test Analysis — The platform supports intelligent analysis of Renal Function Tests. Patients can upload an image of their medical report or manually enter health data through the chatbot interface for conversational analysis.",
    steps: [
      "Patient navigates to the chatbot or health section",
      "Uploads medical report image (JPEG/PNG) or types health metrics",
      "System processes the data and provides a health summary",
      "Results include kidney profile insights and recommendations",
      "Chatbot is not a replacement for real medical advice",
    ],
  },
];

module.exports = { apiDocuments, featureDocuments };
