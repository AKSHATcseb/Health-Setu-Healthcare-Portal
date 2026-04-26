/**
 * Hybrid RAG pipeline orchestrator.
 *
 * Two modes per query:
 *   1. API Mode — intent has apiAction → call backend tools → LLM summarizes
 *   2. RAG Mode — intent is knowledge-only → retrieve docs → LLM answers
 *
 * Flow:
 *   User Query → Intent Detection
 *     ├─ apiAction → executeTool() → API prompt → Gemini → Structured Output
 *     └─ no apiAction → Vector Retrieval → RAG prompt → Gemini → Structured Output
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");
const { classifyIntent } = require("./intentClassifier");
const { retrieveDocuments } = require("./retriever");
const { executeTool } = require("./apiTools");
const {
  buildPrompt,
  buildApiPrompt,
  formatHistory,
  AUTH_REQUIRED_RESPONSE,
} = require("../utils/prompt");

/**
 * Model fallback chain — tries each model in order.
 * If GEMINI_MODEL is set in env, it is used as the sole model (no chain).
 */
const MODEL_CHAIN = process.env.GEMINI_MODEL
  ? [process.env.GEMINI_MODEL]
  : ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-2.0-flash", "gemini-2.0-flash-lite"];

const GENERATION_CONFIG = {
  temperature: 0.3,
  topP: 0.8,
  topK: 40,
  maxOutputTokens: 1024,
};

let genAI = null;

function getClient() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in environment variables.");
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

/**
 * Fallback response when no relevant context is found.
 */
const FALLBACK_RESPONSE = {
  type: "info",
  answer:
    "I don't have enough information about that based on my current knowledge. Please try rephrasing your question or ask about HealthSetu features like booking dialysis appointments, hospital search, authentication, payments, or profile management.",
  data: null,
  steps: [],
  api_called: null,
};

/**
 * Runs the complete hybrid pipeline for a user query.
 *
 * @param {string} query - User's question
 * @param {Array<{ role: string, content: string }>} history - Conversation history
 * @param {{ userId?: string, role?: string, email?: string }|null} user - Authenticated user (from JWT) or null
 * @param {{ lat?: number, lng?: number, date?: string }} location - Optional location/date from frontend
 * @returns {Promise<Object>} Structured response
 */
async function runPipeline(query, history = [], user = null, location = {}) {
  // Step 1: Intent Classification
  const intent = classifyIntent(query);
  console.log(`🎯 Intent: ${intent.intent} (confidence: ${intent.confidence})`);
  console.log(`📂 Modules: [${intent.modules.join(", ")}]`);
  console.log(`🔧 API Action: ${intent.apiAction || "none (RAG)"}`);

  // Step 2: Format conversation history
  const historyText = formatHistory(history);

  // ──────────── API MODE ────────────
  if (intent.apiAction) {
    return handleApiIntent(intent, query, historyText, user, location);
  }

  // ──────────── RAG MODE ────────────
  return handleRagIntent(intent, query, historyText);
}

/* ═══════════════════════════════════════════════════════
   API Mode Handler
   ═══════════════════════════════════════════════════════ */

async function handleApiIntent(intent, query, historyText, user, location) {
  // Check auth if required
  if (intent.requiresAuth && !user?.userId) {
    console.log("🔒 Auth required but no token — returning login prompt.");
    return {
      ...AUTH_REQUIRED_RESPONSE,
      intent: intent.intent,
      docsUsed: 0,
    };
  }

  // Execute the API tool
  console.log(`📡 Calling API tool: ${intent.apiAction}...`);
  const toolResult = await executeTool(intent.apiAction, {
    userId: user?.userId,
    lat: location.lat,
    lng: location.lng,
    date: location.date,
    query, // pass raw query for hospital_details fuzzy matching
  });

  if (!toolResult.success) {
    console.warn(`⚠️ API tool failed: ${toolResult.error}`);
    return {
      type: "info",
      answer: "I couldn't retrieve that information right now. Please try again later.",
      data: null,
      steps: [],
      api_called: toolResult.api_called || null,
      intent: intent.intent,
      docsUsed: 0,
    };
  }

  console.log(`✅ API tool success: ${toolResult.api_called}`);

  // Build API prompt and call LLM for natural summarization
  const prompt = buildApiPrompt(
    toolResult.data,
    toolResult.api_called,
    query,
    historyText
  );

  const llmResponse = await callGemini(prompt);

  // For API prompts, the LLM returns plain text — use it directly
  const answer = llmResponse.trim();

  return {
    type: "action",
    answer,
    data: toolResult.data,
    steps: [],
    api_called: toolResult.api_called,
    intent: intent.intent,
    docsUsed: 0,
  };
}

/* ═══════════════════════════════════════════════════════
   RAG Mode Handler
   ═══════════════════════════════════════════════════════ */

async function handleRagIntent(intent, query, historyText) {
  // Retrieve relevant documents
  const retrievedDocs = await retrieveDocuments(query, intent.modules);
  console.log(`📄 Retrieved ${retrievedDocs.length} documents`);

  if (retrievedDocs.length === 0) {
    console.log("⚠️ No relevant documents found — returning fallback.");
    return {
      ...FALLBACK_RESPONSE,
      intent: intent.intent,
      docsUsed: 0,
    };
  }

  // Assemble context
  const context = retrievedDocs
    .map((doc, i) => {
      const header = `[Source ${i + 1} | ${doc.metadata.type} | ${doc.metadata.module}]`;
      return `${header}\n${doc.text}`;
    })
    .join("\n\n---\n\n");

  // Build RAG prompt and call LLM
  const prompt = buildPrompt(context, query, historyText);
  const llmResponse = await callGemini(prompt);
  const parsed = parseResponse(llmResponse);

  return {
    type: "info",
    answer: parsed.answer,
    data: null,
    steps: parsed.steps || [],
    api_called: null,
    intent: intent.intent,
    docsUsed: retrievedDocs.length,
  };
}

/* ═══════════════════════════════════════════════════════
   Gemini Caller with Model Fallback Chain
   ═══════════════════════════════════════════════════════ */

async function callGemini(prompt) {
  const client = getClient();
  let lastError = null;

  for (const modelName of MODEL_CHAIN) {
    const model = client.getGenerativeModel({
      model: modelName,
      generationConfig: GENERATION_CONFIG,
    });

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`🤖 Trying model: ${modelName} (attempt ${attempt})...`);
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        console.log(`✅ Success with model: ${modelName}`);
        return text;
      } catch (error) {
        lastError = error;
        const isRetryable =
          error.status === 503 || error.status === 429 || error.status === 500;

        if (isRetryable && attempt < 2) {
          console.warn(`⚠️ ${modelName} returned ${error.status}, retrying once...`);
          await new Promise((resolve) => setTimeout(resolve, 1500));
          continue;
        }

        if (isRetryable) {
          console.warn(`⚠️ ${modelName} unavailable (${error.status}), trying next model...`);
          break;
        }

        throw error;
      }
    }
  }

  throw lastError;
}

/* ═══════════════════════════════════════════════════════
   Response Parser
   ═══════════════════════════════════════════════════════ */

function parseResponse(raw) {
  let cleaned = raw.trim();

  // Remove markdown code fences if present
  if (cleaned.startsWith("```")) {
    cleaned = cleaned
      .replace(/^```(?:json)?\s*\n?/, "")
      .replace(/\n?\s*```$/, "");
  }

  try {
    const parsed = JSON.parse(cleaned);

    let answer = parsed.answer || FALLBACK_RESPONSE.answer;

    // If LLM double-wrapped (answer is itself JSON), extract the real answer
    if (typeof answer === "string" && answer.trim().startsWith("{")) {
      try {
        const nested = JSON.parse(answer);
        if (nested.answer) answer = nested.answer;
      } catch (_) {
        // not JSON, keep as-is
      }
    }

    return {
      type: parsed.type || "info",
      answer,
      steps: Array.isArray(parsed.steps) ? parsed.steps : [],
      api_called: parsed.api_called || null,
    };
  } catch (error) {
    console.warn("⚠️ Failed to parse LLM JSON response, returning raw text:", error.message);

    return {
      type: "info",
      answer: raw.trim(),
      steps: [],
      api_called: null,
    };
  }
}

module.exports = { runPipeline, FALLBACK_RESPONSE };
