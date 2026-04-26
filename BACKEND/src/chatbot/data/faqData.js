/**
 * FAQ knowledge entries covering common user issues.
 * Derived from actual error responses and business logic in the codebase.
 */

const faqDocuments = [
  // ────────────────── BOOKING FAQs ──────────────────
  {
    type: "faq",
    module: "booking",
    question: "Why is my booking failing with 'Slot is fully booked'?",
    answer:
      "This error occurs when all dialysis seats at the hospital are occupied for your chosen date and time slot. Each hospital has a fixed number of dialysis seats (dialysisSeats). When the number of active appointments for a slot equals the seat count, no more bookings are accepted. Try selecting a different time slot or date, or search for another nearby hospital with availability.",
    relatedApi: "POST /api/appointment/confirm",
  },
  {
    type: "faq",
    module: "booking",
    question: "Why does it say 'You already booked this slot'?",
    answer:
      "The system prevents duplicate active bookings. If you already have an active appointment at the same hospital, for the same date and time slot, you cannot book it again. Check your existing appointments via your patient dashboard. If you need to rebook, cancel the existing appointment first.",
    relatedApi: "POST /api/appointment/confirm",
  },
  {
    type: "faq",
    module: "booking",
    question: "What are the available dialysis session durations?",
    answer:
      "HealthSetu supports two session durations: 4-hour sessions and 6-hour sessions. The pricing differs by duration — hospitals set separate prices for priceFor4Hrs and priceFor6Hrs. When searching for available hospitals, slots are categorized as 4h slots and 6h slots with their respective time windows.",
    relatedApi: "GET /api/patient/available-hospitals",
  },
  {
    type: "faq",
    module: "booking",
    question: "How do I view my past and upcoming appointments?",
    answer:
      "You can view all your appointments (active, completed, and cancelled) through the patient dashboard. The system fetches all your appointments sorted by newest first, with hospital name and address included. Use the endpoint GET /api/appointment/all/:patientId with your patient ID.",
    relatedApi: "GET /api/appointment/all/:patientId",
  },
  {
    type: "faq",
    module: "booking",
    question: "What information do I need to book a dialysis appointment?",
    answer:
      "To book an appointment, you need: your patient ID, the hospital ID, the appointment date, the duration (4 or 6 hours), a slot object with start and end times, and the amount. First search for available hospitals on your desired date, select a hospital and slot, complete UPI payment, then confirm the booking.",
    relatedApi: "POST /api/appointment/confirm",
  },

  // ────────────────── AUTH / OTP FAQs ──────────────────
  {
    type: "faq",
    module: "auth",
    question: "My OTP is not working. What should I do?",
    answer:
      "OTPs can fail for several reasons: (1) The OTP has expired — OTPs have a time limit. Request a new one. (2) You entered the wrong OTP — double-check the code from your email. (3) Too many failed attempts — after multiple wrong entries, you'll get a 429 error and must request a new OTP. (4) OTP not received — check your spam folder. The email is sent from healthsetu.noreply@gmail.com.",
    relatedApi: "POST /api/auth/verify-otp",
  },
  {
    type: "faq",
    module: "auth",
    question: "I get 'Too many attempts' when verifying OTP. What now?",
    answer:
      "This is a rate-limiting protection. After too many incorrect OTP entries, the system blocks further attempts with a 429 status. You need to request a new OTP by re-registering with the same email (or through a resend OTP flow). Wait a few minutes before trying again.",
    relatedApi: "POST /api/auth/verify-otp",
  },
  {
    type: "faq",
    module: "auth",
    question: "Can I login without verifying my email?",
    answer:
      "Yes. The current HealthSetu login controller does not block login when email verification is incomplete. However, it is strongly recommended to verify your email for full platform access and security. You will receive a JWT token upon successful login regardless of verification status.",
    relatedApi: "POST /api/auth/login",
  },
  {
    type: "faq",
    module: "auth",
    question: "What are the password requirements for registration?",
    answer:
      "Your password must be at least 6 characters long. There are no additional complexity requirements (uppercase, special chars, etc.) in the current system. The password is securely hashed using bcrypt before being stored.",
    relatedApi: "POST /api/auth/register",
  },
  {
    type: "faq",
    module: "auth",
    question: "I get 'User already exists with this email'. What should I do?",
    answer:
      "This 409 error means an account with your email already exists. Try logging in instead of registering. If you forgot your password, you may need to contact support as there is no password reset flow currently implemented in the system.",
    relatedApi: "POST /api/auth/register",
  },
  {
    type: "faq",
    module: "auth",
    question: "What does 'Unauthorized: Invalid token' mean?",
    answer:
      "This error occurs when the JWT token sent in the Authorization header is expired, malformed, or tampered with. To fix: (1) Log in again to get a fresh token. (2) Ensure the header format is exactly 'Bearer <your_token>'. (3) Check that you're using the token from the most recent login.",
    relatedApi: "POST /api/auth/login",
  },

  // ────────────────── SEARCH FAQs ──────────────────
  {
    type: "faq",
    module: "search",
    question: "How does the hospital distance filter work?",
    answer:
      "When searching for available hospitals, you can provide your current location (lat/lng coordinates) and a maximum distance in km (default 50 km). The system calculates the distance between your location and each hospital's registered coordinates, then filters results to show only hospitals within your specified range. Distance is shown in km in the results.",
    relatedApi: "GET /api/patient/available-hospitals",
  },
  {
    type: "faq",
    module: "search",
    question: "How does the price filter work when searching hospitals?",
    answer:
      "You can set minPrice (default 0) and maxPrice (default 50000) query parameters. The system filters hospitals based on their dialysis session pricing (priceFor4Hrs and priceFor6Hrs). Only hospitals with prices within your range are returned. Set applyFilters=true to activate filtering.",
    relatedApi: "GET /api/patient/available-hospitals",
  },
  {
    type: "faq",
    module: "search",
    question: "Why are no hospitals showing up in my search?",
    answer:
      "No results can occur for several reasons: (1) No hospitals have available slots on your chosen date. (2) Your distance filter is too restrictive — try increasing maxDistance. (3) Your price filter is too narrow — try widening the min/max range. (4) No hospitals are verified and active in your area yet. (5) The date parameter is missing or invalid — ensure format is YYYY-MM-DD.",
    relatedApi: "GET /api/patient/available-hospitals",
  },

  // ────────────────── PROFILE FAQs ──────────────────
  {
    type: "faq",
    module: "profile",
    question: "What fields are required for my patient profile?",
    answer:
      "Required fields: mobileNumber, age (positive number), gender, bloodGroup, address, latitude, and longitude. Optional fields: fullName (defaults from registration), profileCompleted flag. Your email is automatically taken from your authenticated account, not from the form.",
    relatedApi: "POST /api/patient/details",
  },
  {
    type: "faq",
    module: "profile",
    question: "What fields are required for hospital registration?",
    answer:
      "Required fields: hospitalName, registrationNumber (exactly 10 digits), phone, dialysisSeats, dialysisType (hemodialysis, peritoneal dialysis, or both), address, latitude, longitude, accountHolderName, and upiID. Price fields depend on dialysis type: priceFor4Hrs and priceFor6Hrs for hemodialysis/both, priceForPD for peritoneal dialysis/both.",
    relatedApi: "POST /api/hospital/details",
  },

  // ────────────────── PAYMENT FAQs ──────────────────
  {
    type: "faq",
    module: "payment",
    question: "How does the payment process work?",
    answer:
      "HealthSetu uses UPI-based payments. When you book an appointment: (1) The system generates a UPI payment URL with the hospital's UPI ID, name, and amount. (2) A QR code is generated as a base64 PNG image. (3) You scan the QR code with any UPI-enabled app (Google Pay, PhonePe, Paytm, etc.). (4) After payment, the appointment is confirmed. The QR code contains the UPI deep link in format: upi://pay?pa=<upiID>&pn=<name>&am=<amount>&cu=INR.",
    relatedApi: "POST /api/payment",
  },
  {
    type: "faq",
    module: "payment",
    question: "How is the appointment amount calculated?",
    answer:
      "The amount depends on the session duration and hospital pricing. For a 4-hour session, the amount is the hospital's priceFor4Hrs. For a 6-hour session, it's priceFor6Hrs. For peritoneal dialysis, it's priceForPD. The amount is sent as part of the booking confirmation request.",
    relatedApi: "POST /api/appointment/confirm",
  },

  // ────────────────── ADMIN FAQs ──────────────────
  {
    type: "faq",
    module: "admin",
    question: "How does hospital approval work?",
    answer:
      "Hospital onboarding follows this flow: (1) Hospital admin registers and submits a request via POST /api/hospital/request-add. (2) Request gets status 'pending'. (3) System admin views pending requests and reviews details. (4) Admin updates status to 'accepted', 'rejected', or 'changes_requested'. (5) If accepted, the system automatically creates the hospital record, generates dialysis machine entries with slot configurations, and sends an approval email. (6) If rejected, a rejection email is sent with an optional note.",
    relatedApi: "PATCH /api/admin/requests/:id/status",
  },
  {
    type: "faq",
    module: "admin",
    question: "What happens when a hospital request is accepted?",
    answer:
      "When an admin accepts a hospital request: (1) The hospital record is created in the Hospital collection with all submitted details. (2) Dialysis machines are auto-generated based on the number of seats. (3) Time slots are configured based on the submitted slot structure (4hr and 6hr sessions). (4) A confirmation email is sent to the hospital's registered email address. (5) The request status changes to 'accepted'.",
    relatedApi: "PATCH /api/admin/requests/:id/status",
  },

  // ────────────────── GENERAL FAQs ──────────────────
  {
    type: "faq",
    module: "general",
    question: "What is HealthSetu?",
    answer:
      "HealthSetu is a digital platform designed to bridge the gap between kidney disease patients and hospitals providing dialysis services. It offers a centralized solution to find, book, and manage dialysis appointments in real-time based on location and availability. Key features include: smart hospital search with distance/price filters, online appointment booking, UPI-based payments, Renal Function Test analysis, admin-controlled hospital verification, and secure OTP-based authentication.",
    relatedApi: null,
  },
  {
    type: "faq",
    module: "general",
    question: "What types of dialysis does HealthSetu support?",
    answer:
      "HealthSetu supports three dialysis configurations: (1) Hemodialysis — with 4-hour and 6-hour sessions. (2) Peritoneal Dialysis — with its own pricing (priceForPD). (3) Both — hospitals offering both types have separate pricing for each. When searching for hospitals, the dialysis type is shown in the results.",
    relatedApi: null,
  },
  {
    type: "faq",
    module: "general",
    question: "What user roles exist in HealthSetu?",
    answer:
      "HealthSetu has three user roles: (1) Patient — can search for hospitals, book and manage dialysis appointments, view their profile, and upload medical reports. (2) Hospital Admin — can register and manage hospital profiles, view appointments at their hospital, and submit onboarding requests. (3) Admin — can review and approve/reject hospital onboarding requests, monitor system activity, and manage the verification process.",
    relatedApi: "POST /api/auth/register",
  },
];

module.exports = { faqDocuments };
