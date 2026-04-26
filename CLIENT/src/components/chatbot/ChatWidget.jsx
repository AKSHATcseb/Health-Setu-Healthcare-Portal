import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  Loader2,
  Sparkles,
  ArrowRight,
  MapPin,
  User,
  Calendar,
  Hospital,
  Shield,
} from "lucide-react";
import { sendChatMessage } from "../../services/chatAPI";

/* ──────────────────── suggested chips ──────────────────── */
const SUGGESTIONS = [
  "Show my profile",
  "My appointments",
  "Hospitals near me",
  "List all hospitals",
  "How do I book an appointment?",
];

/* ──────────────────── geolocation helper ──────────────────── */
function getUserLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { timeout: 8000, maximumAge: 300000 }
    );
  });
}

/* ──────────────────── needs location check ──────────────────── */
const LOCATION_KEYWORDS = [
  "near me",
  "nearby",
  "nearest",
  "closest",
  "around me",
  "hospitals near",
  "find hospital",
];

function queryNeedsLocation(query) {
  const lower = query.toLowerCase();
  return LOCATION_KEYWORDS.some((kw) => lower.includes(kw));
}

/* ──────────────────── component ──────────────────── */
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // focus input when opened
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  /* ── build history for API (last 3 exchanges = 6 msgs) ── */
  const buildHistory = useCallback(
    () =>
      messages.slice(-6).map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: typeof m.text === "string" ? m.text : m.text?.answer || "",
      })),
    [messages]
  );

  /* ── send message ── */
  const handleSend = async (text) => {
    const query = (text || input).trim();
    if (!query || loading) return;

    setInput("");
    setShowSuggestions(false);

    const userMsg = { id: Date.now(), sender: "user", text: query };
    setMessages((p) => [...p, userMsg]);
    setLoading(true);

    try {
      const history = buildHistory();
      const location = {};

      // Request geolocation for "near me" queries
      if (queryNeedsLocation(query)) {
        const loc = await getUserLocation();
        if (loc) {
          location.lat = loc.lat;
          location.lng = loc.lng;
        }
      }

      const data = await sendChatMessage(query, history, location);

      setMessages((p) => [
        ...p,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: data.answer,
          type: data.type || "info",
          data: data.data || null,
          steps: data.steps || [],
          api_called: data.api_called || null,
          intent: data.intent,
        },
      ]);
    } catch (err) {
      const errMsg =
        err?.response?.data?.answer ||
        err?.response?.data?.error ||
        "Sorry, something went wrong. Please try again.";
      setMessages((p) => [
        ...p,
        { id: Date.now() + 1, sender: "bot", text: errMsg, isError: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /* ──────────────────── render ──────────────────── */
  return (
    <>
      {/* ═══════════ Floating Action Button ═══════════ */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-[9999]
              w-14 h-14 sm:w-16 sm:h-16
              rounded-full
              bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-600
              text-white
              shadow-lg shadow-blue-500/30
              flex items-center justify-center
              cursor-pointer
              border-0 outline-none"
            aria-label="Open chat"
            id="chatbot-fab"
          >
            <MessageCircle size={26} />
            <span className="absolute inset-0 rounded-full animate-ping bg-blue-400/30" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ═══════════ Chat Panel ═══════════ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999]
              w-[calc(100vw-2rem)] sm:w-[420px]
              h-[min(620px,calc(100vh-3rem))]
              rounded-2xl
              bg-white
              shadow-2xl shadow-slate-900/20
              border border-slate-200
              flex flex-col
              overflow-hidden"
            id="chatbot-panel"
          >
            {/* ── Header ── */}
            <div
              className="flex items-center justify-between
                px-5 py-3.5
                bg-gradient-to-r from-blue-700 via-blue-800 to-emerald-700
                text-white"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold leading-tight">
                    HealthSetu Assistant
                  </h3>
                  <p className="text-[11px] text-blue-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    AI-powered · Personalized
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-white/15 flex items-center justify-center transition
                  border-0 outline-none cursor-pointer"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* ── Messages ── */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-slate-50/80">
              {/* Welcome */}
              {messages.length === 0 && (
                <div className="text-center py-6">
                  <div
                    className="w-14 h-14 mx-auto mb-3 rounded-2xl
                      bg-gradient-to-br from-blue-100 to-emerald-100
                      flex items-center justify-center"
                  >
                    <Sparkles size={26} className="text-blue-600" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">
                    Hello! I'm your HealthSetu Assistant
                  </p>
                  <p className="text-xs text-slate-500 mt-1 max-w-[260px] mx-auto">
                    I can show your profile, appointments, find nearby hospitals, and answer questions about HealthSetu.
                  </p>
                </div>
              )}

              {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} />
              ))}

              {loading && (
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center shrink-0">
                    <Bot size={14} className="text-white" />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ── Suggestion chips ── */}
            {showSuggestions && messages.length === 0 && (
              <div className="px-4 pb-2 pt-1 flex flex-wrap gap-1.5 bg-white border-t border-slate-100">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
                    className="text-[11px] px-3 py-1.5 rounded-full
                      bg-blue-50 text-blue-700
                      hover:bg-blue-100
                      border border-blue-200/60
                      transition cursor-pointer
                      outline-none"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* ── Input ── */}
            <div className="px-3 py-3 bg-white border-t border-slate-200">
              <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-1.5">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything about HealthSetu…"
                  disabled={loading}
                  className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400
                    outline-none border-none py-1.5"
                  id="chatbot-input"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || loading}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition
                    border-0 outline-none cursor-pointer
                    ${
                      input.trim() && !loading
                        ? "bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-md hover:shadow-lg"
                        : "bg-slate-200 text-slate-400"
                    }`}
                  aria-label="Send message"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5 text-center">
                Powered by HealthSetu AI · Real-time personalized data
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   Message Bubble Component
   ═══════════════════════════════════════════════════════ */
function MessageBubble({ msg }) {
  const isUser = msg.sender === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div
          className="max-w-[80%] bg-gradient-to-r from-blue-600 to-blue-700
            text-white text-sm px-4 py-2.5 rounded-2xl rounded-br-sm shadow-sm"
        >
          {msg.text}
        </div>
      </div>
    );
  }

  // Bot message
  return (
    <div className="flex items-start gap-2">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
        <Bot size={14} className="text-white" />
      </div>

      <div className="max-w-[85%] space-y-2">
        {/* API badge */}
        {msg.api_called && (
          <div className="flex items-center gap-1">
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium border border-emerald-200">
              ⚡ Live Data
            </span>
          </div>
        )}

        {/* Main answer */}
        <div
          className={`bg-white border ${
            msg.isError ? "border-red-200" : "border-slate-200"
          } rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm`}
        >
          <p
            className={`text-sm leading-relaxed ${
              msg.isError ? "text-red-600" : "text-slate-700"
            }`}
          >
            {msg.text}
          </p>
        </div>

        {/* ── Data Cards ── */}
        {msg.data && <DataCard data={msg.data} intent={msg.intent} />}

        {/* Steps */}
        {msg.steps?.length > 0 && (
          <div className="bg-blue-50/80 border border-blue-100 rounded-xl px-4 py-3">
            <p className="text-[11px] font-semibold text-blue-700 mb-1.5 flex items-center gap-1">
              <ArrowRight size={12} /> Steps
            </p>
            <ol className="space-y-1">
              {msg.steps.map((step, i) => (
                <li
                  key={i}
                  className="text-xs text-blue-800 flex items-start gap-2"
                >
                  <span className="w-4 h-4 mt-0.5 rounded-full bg-blue-200 text-blue-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Data Card Renderer — profile, appointments, hospitals
   ═══════════════════════════════════════════════════════ */
function DataCard({ data, intent }) {
  if (!data) return null;

  // ── Profile Card ──
  if (intent === "my_profile" && data.fullName) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-slate-50 border border-blue-200 rounded-xl px-4 py-3 space-y-2">
        <div className="flex items-center gap-2 text-blue-700 font-semibold text-xs">
          <User size={14} />
          <span>Your Profile</span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
          <ProfileField label="Name" value={data.fullName} />
          <ProfileField label="Email" value={data.email} />
          <ProfileField label="Mobile" value={data.mobileNumber} />
          <ProfileField label="Age" value={data.age} />
          <ProfileField label="Gender" value={data.gender} />
          <ProfileField label="Blood Group" value={data.bloodGroup} />
          <ProfileField label="Address" value={data.address} span />
        </div>
      </div>
    );
  }

  // ── Appointments Card ──
  if (intent === "my_appointments" && data.appointments) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-slate-50 border border-indigo-200 rounded-xl px-4 py-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-700 font-semibold text-xs">
            <Calendar size={14} />
            <span>Your Appointments</span>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            {data.active > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-green-100 text-green-700">
                {data.active} active
              </span>
            )}
            {data.completed > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                {data.completed} done
              </span>
            )}
          </div>
        </div>
        <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
          {data.appointments.slice(0, 5).map((apt, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-slate-100"
            >
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-700 truncate">
                  {apt.hospitalName}
                </p>
                <p className="text-[10px] text-slate-500">
                  {apt.appointmentDate}
                  {apt.slot?.startTime ? ` · ${apt.slot.startTime}` : ""}
                </p>
              </div>
              <StatusBadge status={apt.status} />
            </div>
          ))}
          {data.appointments.length > 5 && (
            <p className="text-[10px] text-slate-400 text-center">
              +{data.appointments.length - 5} more
            </p>
          )}
        </div>
      </div>
    );
  }

  // ── Hospital Search / List Card ──
  if ((intent === "hospital_search" || intent === "hospital_list") && data.hospitals) {
    return (
      <div className="bg-gradient-to-br from-emerald-50 to-slate-50 border border-emerald-200 rounded-xl px-4 py-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs">
            <Hospital size={14} />
            <span>
              Available Hospitals{" "}
              <span className="font-normal text-[10px] text-emerald-600">
                ({data.searchDate})
              </span>
            </span>
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">
            {data.count} found
          </span>
        </div>
        <div className="space-y-1.5 max-h-[220px] overflow-y-auto">
          {data.hospitals.slice(0, 8).map((h, i) => (
            <div
              key={i}
              className="bg-white rounded-lg px-3 py-2 border border-slate-100"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-slate-700 truncate">
                  {h.name}
                </p>
                {h.distance && (
                  <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5 shrink-0 ml-2">
                    <MapPin size={10} /> {h.distance}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 truncate">{h.address}</p>
              <div className="flex items-center gap-2 mt-1">
                {h.priceFor4Hrs && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600">
                    4hr: ₹{h.priceFor4Hrs}
                  </span>
                )}
                {h.priceFor6Hrs && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600">
                    6hr: ₹{h.priceFor6Hrs}
                  </span>
                )}
                {h.availableSlots?.length > 0 && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-50 text-green-600">
                    {h.availableSlots.length} slots
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Hospital Details Card (single hospital from fuzzy match) ──
  if (intent === "hospital_details") {
    // Matched hospital
    if (data.matched && data.hospital) {
      const h = data.hospital;
      return (
        <div className="bg-gradient-to-br from-cyan-50 to-slate-50 border border-cyan-200 rounded-xl px-4 py-3 space-y-2">
          <div className="flex items-center gap-2 text-cyan-700 font-semibold text-xs">
            <Hospital size={14} />
            <span>Hospital Details</span>
            {data.matchScore && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-100 text-cyan-600 font-medium">
                {data.matchScore}% match
              </span>
            )}
          </div>
          <div className="bg-white rounded-lg px-3 py-2.5 border border-slate-100 space-y-1.5">
            <p className="text-sm font-semibold text-slate-800">{h.name}</p>
            {h.address && (
              <p className="text-[10px] text-slate-500 flex items-center gap-1">
                <MapPin size={10} /> {h.address}
                {h.city ? `, ${h.city}` : ""}
              </p>
            )}
            {h.distance && (
              <p className="text-[10px] text-emerald-600 font-medium">
                📍 {h.distance} away
              </p>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              {h.priceFor4Hrs && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600">
                  4hr session: ₹{h.priceFor4Hrs}
                </span>
              )}
              {h.priceFor6Hrs && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600">
                  6hr session: ₹{h.priceFor6Hrs}
                </span>
              )}
            </div>
            {h.availableSlots?.length > 0 && (
              <div>
                <p className="text-[10px] text-slate-500 font-medium mb-1">
                  Available Slots:
                </p>
                <div className="flex flex-wrap gap-1">
                  {h.availableSlots.map((slot, i) => (
                    <span
                      key={i}
                      className="text-[9px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200"
                    >
                      {slot}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // No match — show available hospitals list
    if (!data.matched && data.availableHospitals?.length > 0) {
      return (
        <div className="bg-gradient-to-br from-amber-50 to-slate-50 border border-amber-200 rounded-xl px-4 py-3 space-y-2">
          <div className="flex items-center gap-2 text-amber-700 font-semibold text-xs">
            <Shield size={14} />
            <span>Available Hospitals</span>
          </div>
          <div className="space-y-1">
            {data.availableHospitals.map((name, i) => (
              <p key={i} className="text-xs text-slate-600">
                • {name}
              </p>
            ))}
          </div>
          <p className="text-[10px] text-amber-600 italic">
            Try asking: "Tell me about [hospital name]"
          </p>
        </div>
      );
    }
  }

  return null;
}

/* ── Helpers ── */
function ProfileField({ label, value, span }) {
  return (
    <div className={span ? "col-span-2" : ""}>
      <p className="text-[10px] text-slate-400">{label}</p>
      <p className="text-xs text-slate-700 font-medium truncate">
        {value || "—"}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    active:
      "bg-green-100 text-green-700 border-green-200",
    completed:
      "bg-slate-100 text-slate-600 border-slate-200",
    cancelled:
      "bg-red-50 text-red-600 border-red-200",
  };
  return (
    <span
      className={`text-[9px] px-1.5 py-0.5 rounded-full border font-medium shrink-0 ${
        styles[status] || styles.active
      }`}
    >
      {status || "active"}
    </span>
  );
}
