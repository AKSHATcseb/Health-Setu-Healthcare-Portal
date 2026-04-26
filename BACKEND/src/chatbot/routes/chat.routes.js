/**
 * Chat API route — POST /api/chat
 *
 * Hybrid chatbot: RAG knowledge + live API data.
 * Optionally accepts JWT for personalized responses.
 */

const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { runPipeline } = require("../services/ragPipeline");

/**
 * POST /api/chat
 *
 * Body:
 *   {
 *     "query": "string (required)",
 *     "history": [{ "role": "user"|"assistant", "content": "string" }] (optional),
 *     "lat": number (optional, for hospital search),
 *     "lng": number (optional, for hospital search),
 *     "date": "YYYY-MM-DD" (optional, for hospital search)
 *   }
 *
 * Headers:
 *   Authorization: Bearer <token> (optional — enables personalized responses)
 *
 * Response:
 *   {
 *     "type": "info" | "action",
 *     "answer": "string",
 *     "data": {} | null,
 *     "steps": ["string", ...],
 *     "api_called": "string" | null,
 *     "intent": "string",
 *     "docsUsed": number
 *   }
 */
router.post("/", async (req, res) => {
  try {
    const { query, history, lat, lng, date } = req.body;

    // ── Validate query ──
    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return res.status(400).json({
        error: "query is required and must be a non-empty string.",
      });
    }

    if (history && !Array.isArray(history)) {
      return res.status(400).json({
        error: "history must be an array of { role, content } objects.",
      });
    }

    const trimmedQuery = query.trim();

    if (trimmedQuery.length > 2000) {
      return res.status(400).json({
        error: "Query is too long. Maximum 2000 characters allowed.",
      });
    }

    // ── Optional JWT extraction (non-blocking) ──
    let user = null;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user = {
          userId: decoded.userId,
          role: decoded.role,
          email: decoded.email,
        };
        console.log(`🔐 Authenticated user: ${user.email} (${user.role})`);
      } catch (tokenError) {
        // Invalid/expired token — proceed without auth (RAG-only)
        console.log("🔓 Invalid token — proceeding in RAG-only mode.");
      }
    } else {
      console.log("🔓 No auth token — RAG-only mode.");
    }

    // ── Location data ──
    const location = {};
    if (lat !== undefined && lng !== undefined) {
      location.lat = parseFloat(lat);
      location.lng = parseFloat(lng);
    }
    if (date) {
      location.date = String(date).split("T")[0];
    }

    console.log(`\n💬 Chat query: "${trimmedQuery}"`);

    // ── Run hybrid pipeline ──
    const result = await runPipeline(
      trimmedQuery,
      history || [],
      user,
      location
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ Chat error:", error);

    return res.status(500).json({
      type: "info",
      answer: "An error occurred while processing your query. Please try again.",
      data: null,
      steps: [],
      api_called: null,
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

module.exports = router;
