import api from "./api";

/**
 * Sends a chat query to the RAG chatbot backend.
 * The Authorization header is auto-attached by the axios instance
 * if the user is logged in (from localStorage token).
 *
 * @param {string} query - User's question
 * @param {Array<{ role: string, content: string }>} history - Conversation history
 * @param {{ lat?: number, lng?: number, date?: string }} location - Optional location/date
 * @returns {Promise<Object>} Structured chatbot response
 */
export async function sendChatMessage(query, history = [], location = {}) {
  const body = { query, history };

  if (location.lat !== undefined && location.lng !== undefined) {
    body.lat = location.lat;
    body.lng = location.lng;
  }

  if (location.date) {
    body.date = location.date;
  }

  const response = await api.post("/api/chat", body);
  return response.data;
}
