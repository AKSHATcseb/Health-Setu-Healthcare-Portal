/**
 * Hybrid intent classifier for the HealthSetu chatbot.
 *
 * Classifies queries into two categories:
 *   1. API-backed intents — require calling real backend APIs for live data
 *   2. RAG intents — answered from the knowledge base
 *
 * Fast, zero-cost, deterministic.
 */

const INTENT_RULES = {
  /* ──────────── API-BACKED INTENTS ──────────── */

  my_profile: {
    keywords: [
      "my profile", "about me", "my details", "who am i",
      "my info", "my information", "my data", "my account",
      "show my profile", "view my profile", "personal details",
      "my blood group", "my age", "my name", "my email",
      "my mobile", "my phone", "my address",
    ],
    modules: ["profile"],
    requiresAuth: true,
    apiAction: "fetch_profile",
  },

  my_appointments: {
    keywords: [
      "my appointments", "my bookings", "my booking",
      "upcoming appointments", "past appointments",
      "show my appointments", "view my appointments",
      "my sessions", "my dialysis sessions",
      "appointment history", "booking history",
      "do i have appointments", "when is my appointment",
      "my next appointment", "my schedule",
    ],
    modules: ["booking"],
    requiresAuth: true,
    apiAction: "fetch_appointments",
  },

  hospital_search: {
    keywords: [
      "nearest hospital", "near me", "hospitals nearby",
      "closest center", "closest hospital",
      "find hospital", "find center", "find dialysis",
      "hospitals around", "nearby dialysis",
      "search hospital", "hospitals available today",
    ],
    modules: ["search"],
    requiresAuth: false,
    apiAction: "search_hospitals",
  },

  hospital_list: {
    keywords: [
      "list hospitals", "all hospitals", "show hospitals",
      "available hospitals", "hospital list",
      "show all hospitals", "show me hospitals",
      "which hospitals", "what hospitals",
      "hospitals available", "list centers",
      "all centers", "show centers",
      "dialysis centers", "list dialysis",
    ],
    modules: ["search"],
    requiresAuth: false,
    apiAction: "list_hospitals",
  },

  hospital_details: {
    keywords: [
      "tell me about", "details of", "info about",
      "information about", "what is", "about hospital",
      "hospital details", "center details",
      "describe hospital", "describe center",
      "which hospital", "know about",
    ],
    modules: ["search"],
    requiresAuth: false,
    apiAction: "fetch_hospital_details",
  },

  /* ──────────── RAG-ONLY INTENTS ──────────── */

  auth: {
    keywords: [
      "login", "log in", "signin", "sign in",
      "register", "signup", "sign up", "registration",
      "otp", "verify", "verification", "verified",
      "password", "token", "jwt", "authenticate", "authentication",
      "unauthorized", "credentials", "email verify", "account",
    ],
    modules: ["auth"],
    requiresAuth: false,
    apiAction: null,
  },

  booking: {
    keywords: [
      "book", "booking", "appointment",
      "slot", "slots", "schedule", "scheduled",
      "cancel", "cancelled", "confirm", "confirmed",
      "dialysis session",
      "duration", "4 hour", "6 hour", "4hr", "6hr",
      "fully booked", "duplicate booking",
      "how to book", "how do i book",
    ],
    modules: ["booking"],
    requiresAuth: false,
    apiAction: null,
  },

  search: {
    keywords: [
      "filter", "distance",
      "availability", "hemodialysis", "peritoneal",
      "price", "pricing", "cost", "cheap", "affordable",
      "seats", "machine",
    ],
    modules: ["search"],
    requiresAuth: false,
    apiAction: null,
  },

  profile: {
    keywords: [
      "profile", "details",
      "update profile", "edit profile",
      "patient profile", "hospital profile",
      "blood group", "age", "gender", "mobile",
      "phone number", "address",
      "full name", "personal",
      "registration number",
    ],
    modules: ["profile"],
    requiresAuth: false,
    apiAction: null,
  },

  admin: {
    keywords: [
      "admin", "approve", "reject", "approval",
      "rejection", "request", "pending",
      "onboarding", "hospital request",
      "changes requested", "accepted",
      "moderation", "verify hospital",
    ],
    modules: ["admin"],
    requiresAuth: false,
    apiAction: null,
  },

  payment: {
    keywords: [
      "payment", "pay", "upi", "qr", "qr code",
      "amount", "charge", "charges",
      "rupees", "inr", "transaction",
      "google pay", "phonepe", "paytm",
    ],
    modules: ["payment"],
    requiresAuth: false,
    apiAction: null,
  },
};

/**
 * Classifies a user query into an intent category.
 *
 * @param {string} query - User's query text
 * @returns {{
 *   intent: string,
 *   confidence: number,
 *   modules: string[],
 *   requiresAuth: boolean,
 *   apiAction: string|null
 * }}
 */
function classifyIntent(query) {
  const normalized = query.toLowerCase().trim();

  const scores = {};

  for (const [intent, rule] of Object.entries(INTENT_RULES)) {
    let matchCount = 0;

    for (const keyword of rule.keywords) {
      if (normalized.includes(keyword)) {
        matchCount++;
      }
    }

    if (matchCount > 0) {
      // API-backed intents get 1.5x score boost — they're more specific
      const adjustedScore = rule.apiAction ? matchCount * 1.5 : matchCount;

      scores[intent] = {
        score: adjustedScore,
        confidence: Math.min(matchCount / 3, 1.0),
        modules: rule.modules,
        requiresAuth: rule.requiresAuth,
        apiAction: rule.apiAction,
      };
    }
  }

  const entries = Object.entries(scores);

  if (entries.length === 0) {
    return {
      intent: "general",
      confidence: 0.0,
      modules: [],
      requiresAuth: false,
      apiAction: null,
    };
  }

  // Sort by score descending; prioritize API-backed intents on tie
  entries.sort((a, b) => {
    if (b[1].score !== a[1].score) return b[1].score - a[1].score;
    // Prefer API-backed intents when scores are equal
    return (b[1].apiAction ? 1 : 0) - (a[1].apiAction ? 1 : 0);
  });

  const [bestIntent, bestData] = entries[0];

  // Collect modules from similarly-scored intents
  const topModules = new Set(bestData.modules);
  for (const [, data] of entries) {
    if (data.score >= bestData.score * 0.5) {
      data.modules.forEach((m) => topModules.add(m));
    }
  }

  return {
    intent: bestIntent,
    confidence: bestData.confidence,
    modules: Array.from(topModules),
    requiresAuth: bestData.requiresAuth,
    apiAction: bestData.apiAction,
  };
}

module.exports = { classifyIntent, INTENT_RULES };
