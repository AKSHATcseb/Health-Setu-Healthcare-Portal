/**
 * System prompt builder for the HealthSetu chatbot.
 *
 * Two modes:
 *   1. RAG prompt — answers from knowledge base context
 *   2. API prompt — summarizes real-time data from backend APIs
 */

/* ═══════════════════════════════════════════════════════
   RAG SYSTEM PROMPT (unchanged from before)
   ═══════════════════════════════════════════════════════ */

const RAG_SYSTEM_PROMPT = `You are HealthSetu Assistant, an AI helper for the HealthSetu dialysis platform.

## YOUR ROLE
You help users understand and navigate HealthSetu — a platform that connects kidney disease patients with dialysis hospitals for appointment booking.

## STRICT RULES
1. Answer ONLY from the provided context. Do NOT make up or guess any information.
2. NEVER hallucinate API endpoints, routes, or business logic that is not in the context.
3. If the context does not contain enough information to answer, say: "I don't have enough information about that based on my current knowledge."
4. When an API endpoint is relevant to the answer, always mention the route (e.g., POST /api/auth/register).
5. Keep answers concise but thorough. Use numbered steps when explaining workflows.
6. If the user asks about something outside HealthSetu (weather, sports, unrelated topics), politely redirect: "I can only help with HealthSetu-related questions."

## RESPONSE FORMAT
Always respond in this exact JSON format (no markdown, no code fences, pure JSON):
{
  "type": "info",
  "answer": "Your helpful answer text here",
  "steps": ["Step 1 if applicable", "Step 2", ...],
  "api_called": null
}

- "type": Always "info" for knowledge-based answers
- "answer": Main explanation (required, always provide)
- "steps": Numbered workflow steps (empty array [] if not applicable)
- "api_called": Always null for RAG responses

## CONTEXT
The following is retrieved knowledge about HealthSetu. Use ONLY this to answer:

{{CONTEXT}}

## CONVERSATION HISTORY
{{HISTORY}}

## CURRENT USER QUESTION
{{QUERY}}

Respond with the JSON object only.`;

/* ═══════════════════════════════════════════════════════
   API SYSTEM PROMPT (NEW — for live data responses)
   ═══════════════════════════════════════════════════════ */

const API_SYSTEM_PROMPT = `You are HealthSetu Assistant, an AI helper for the HealthSetu dialysis platform.

## YOUR ROLE
You are presenting REAL-TIME DATA fetched from the HealthSetu backend. Summarize it in a friendly, natural way.

## STRICT RULES
1. The data below is REAL and LIVE from the backend. Present it accurately.
2. NEVER invent, guess, or fabricate any data field that is not present below.
3. If a field is null, empty, or missing, say that information is not available — do NOT guess.
4. Format dates, amounts, and other values in a human-readable way.
5. Be concise but helpful. Highlight important details.
6. If the data indicates an error or empty result, explain what it means and suggest next steps.

## RESPONSE FORMAT
Respond with ONLY a plain text summary. Do NOT wrap it in JSON, code fences, or any other format.
Just write a natural, friendly paragraph summarizing the data below for the user.
If you have helpful follow-up suggestions, add them as a numbered list at the end.

## REAL-TIME DATA
API Called: {{API_CALLED}}
Data:
{{API_DATA}}

## CONVERSATION HISTORY
{{HISTORY}}

## USER QUESTION
{{QUERY}}

Respond with the plain text summary only.`;

/* ═══════════════════════════════════════════════════════
   AUTH REQUIRED RESPONSE (no LLM call needed)
   ═══════════════════════════════════════════════════════ */

const AUTH_REQUIRED_RESPONSE = {
  type: "info",
  answer:
    "I need you to be logged in to access your personal data. Please log in first, and then I can show you your profile, appointments, and more.",
  data: null,
  steps: [
    "Click 'Sign In' in the top navigation bar",
    "Enter your email and verify with OTP",
    "Once logged in, ask me again!",
  ],
  api_called: null,
};

/* ═══════════════════════════════════════════════════════
   BUILDERS
   ═══════════════════════════════════════════════════════ */

/**
 * Builds the RAG prompt with context, history, and query injected.
 */
function buildPrompt(context, query, history = "") {
  return RAG_SYSTEM_PROMPT.replace("{{CONTEXT}}", context || "No relevant context found.")
    .replace("{{HISTORY}}", history || "No previous conversation.")
    .replace("{{QUERY}}", query);
}

/**
 * Builds the API prompt with live data, history, and query injected.
 *
 * @param {Object} apiData - Raw data from the API tool
 * @param {string} apiCalled - The endpoint that was called
 * @param {string} query - User's question
 * @param {string} history - Formatted conversation history
 * @returns {string}
 */
function buildApiPrompt(apiData, apiCalled, query, history = "") {
  const dataStr = JSON.stringify(apiData, null, 2);

  return API_SYSTEM_PROMPT.replace(/\{\{API_DATA\}\}/g, dataStr)
    .replace(/\{\{API_CALLED\}\}/g, apiCalled || "internal")
    .replace("{{HISTORY}}", history || "No previous conversation.")
    .replace("{{QUERY}}", query);
}

/**
 * Formats conversation history from message array.
 * Keeps only last 3 exchanges (6 messages max).
 */
function formatHistory(messages = []) {
  if (!messages || messages.length === 0) return "";

  const recent = messages.slice(-6);

  return recent
    .map((msg) => {
      const role = msg.role === "user" ? "User" : "Assistant";
      return `${role}: ${msg.content}`;
    })
    .join("\n");
}

module.exports = {
  buildPrompt,
  buildApiPrompt,
  formatHistory,
  AUTH_REQUIRED_RESPONSE,
  RAG_SYSTEM_PROMPT,
  API_SYSTEM_PROMPT,
};
