import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * setAuthToken(token)
 * - Sets or clears the Authorization header on the shared api instance.
 * - Also persists the token to localStorage when provided, and removes it when null.
 */
export function setAuthToken(token) {
  api.defaults.headers.common = api.defaults.headers.common || {};
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      localStorage.setItem("token", token);
    } catch (e) {
      // ignore storage errors
    }
  } else {
    delete api.defaults.headers.common["Authorization"];
    try {
      localStorage.removeItem("token");
    } catch (e) {
      // ignore storage errors
    }
  }
}

/**
 * getAuthToken()
 * - Convenience to read token from the axios defaults or localStorage.
 */
export function getAuthToken() {
  return (api.defaults.headers.common && api.defaults.headers.common["Authorization"])
    ? String(api.defaults.headers.common["Authorization"]).replace(/^Bearer\s+/i, "")
    : localStorage.getItem("token") || null;
}

/**
 * Optional: response interceptor to clear token on 401.
 * - Keeps behavior consistent across the app: when backend returns 401, we remove stored token.
 * - Do NOT perform navigation here (avoid coupling to router). Let components handle redirects after failures.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      try {
        setAuthToken(null);
      } catch (e) {
        // ignore
      }
    }
    return Promise.reject(error);
  }
);

// Auto-initialize Authorization header from localStorage (if available)
try {
  const existing = localStorage.getItem("token");
  if (existing) setAuthToken(existing);
} catch (e) {
  // ignore (e.g., localStorage not available)
}

export default api;