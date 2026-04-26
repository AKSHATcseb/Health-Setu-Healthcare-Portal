import React, { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Heart } from "lucide-react";
import { HeartPulseBadge, ShieldLock, CalendarCheckIcon } from "../CustomIcons";

/*
  UI changes only:
  - Centered, responsive dark card (matches the login page look)
  - Accessible info/error messages (role/status, aria-live)
  - Inputs improved with autocomplete and inputMode
  - Responsive button layout (stack on mobile, side-by-side on larger screens)
  - Preserved all original logic and API calls
*/

export default function Register() {
  const [role, setRole] = useState("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [verified, setVerified] = useState(false);

  const [newUser, setNewUser] = useState(null);

  const navigate = useNavigate();

  const goLogin = () => navigate("/login");
  const goHome = () => navigate("/");

  // Send register request (backend should create the user and send OTP)
  const handleRegister = async () => {
    if (!role || !email || !password) {
      setMessage({ type: "error", text: "Please choose a role and fill email & password." });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage({ type: "error", text: "Please enter a valid email address." });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const res = await api.post("/api/auth/register", { email, password, role });

      const createdUser = res.data?.user || null;
      setNewUser(createdUser);

      setOtpSent(true);
      setMessage({ type: "success", text: "OTP sent to your email. Enter it below to verify." });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || err.message || "Registration failed" });
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP (simple)
  const verifyOtp = async () => {
    if (!email || !otp) {
      setMessage({ type: "error", text: "Please enter email and OTP." });
      return;
    }

    if (otp.length !== 6) {
      setMessage({ type: "error", text: "OTP must be 6 digits." });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      await api.post("/api/auth/verify-otp", { email, otp });

      setVerified(true);
      setMessage({ type: "success", text: "Email verified. Registration completed." });

      setTimeout(() => navigate("/login", { replace: true }), 1200);
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || err.message || "OTP verification failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full min-h-screen flex flex-col"
      style={{
        background:
          "radial-gradient(600px 300px at 10% 10%, rgba(11,17,32,0.03), transparent 8%), linear-gradient(180deg,#fbfcfd 0%, #f6f8fa 100%)",
      }}
    >
      {/* Top bar */}
      <header className="w-full px-10 py-10 bg-slate-200">
        <div className=" sm:px-6 lg:px-12 flex items-center justify-center">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={goHome}
            role="button"
            tabIndex={0}
            aria-label="HealthSetu home"
          >
            <div className="flex items-center gap-2 sm:gap-3 cursor-pointer group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-500 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:shadow-blue-200 transition-all duration-300">
                <Heart size={20} className="text-white fill-white" />
              </div>
              <h1 className="font-bold text-lg sm:text-2xl bg-gradient-to-r from-blue-700 to-teal-600 bg-clip-text text-transparent">
                HealthSetu
              </h1>
            </div>
          </div>

          <div className="sm:hidden">
            <button onClick={goLogin} className="text-sm text-slate-700 px-2 py-1">
              Sign in
            </button>
          </div>
        </div>
      </header>

      {/* Main: centered register card */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-12 py-12 bg-slate-200">
        <div className="w-full max-w-lg mx-auto">
          <div
            className="rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl"
            style={{ background: "linear-gradient(180deg, #334155 0%, #1e293b 100%)", color: "#f8fafc" }}
            aria-labelledby="register-heading"
          >
            <div className="text-center mb-6">
              <div
                className="inline-flex items-center justify-center w-14 h-14 rounded-lg mx-auto mb-3"
                style={{ background: "linear-gradient(180deg,#111827,#0b1220)" }}
              >
                <ShieldLock className="w-6 h-6 text-white" />
              </div>
              <h2 id="register-heading" className="text-2xl font-extrabold">Create account</h2>
              <p className="text-sm text-slate-300 mt-2">Simple OTP-based registration</p>
            </div>

            {/* message area */}
            {message && (
              <div
                className={`mb-4 p-3 rounded-md text-sm ${message.type === "success" ? "bg-green-900/40 text-green-200" : "bg-red-900/40 text-red-200"}`}
                role={message.type === "success" ? "status" : "alert"}
                aria-live="polite"
              >
                {message.text}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-200">I am a</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-lg bg-white/4 text-slate-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-600"
                  aria-label="Select role"
                >
                  <option value="patient">Patient</option>
                  <option value="hospital_admin">Hospital Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-200">Email</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M2 4h20v16H2z" /></svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    inputMode="email"
                    autoComplete="email"
                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/4 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600 transition"
                    aria-label="Email address"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-200">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  className="w-full rounded-lg bg-white/4 text-slate-100 px-3 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600 transition"
                  aria-label="Password"
                />
              </div>

              {otpSent && (
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-200">OTP</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <CalendarCheckIcon className="w-4 h-4 text-slate-300" />
                    </div>
                    <input
                      type="text"
                      value={otp}
                      inputMode="numeric"
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="Enter 6-digit OTP"
                      className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/4 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600 transition"
                      aria-label="OTP code"
                    />
                  </div>
                </div>
              )}

              {/* Actions: stacked on small screens, side-by-side on md+ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                <button
                  onClick={handleRegister}
                  disabled={loading || otpSent}
                  className="w-full inline-flex items-center justify-center gap-3 px-4 py-3 rounded-lg font-semibold text-white transition disabled:opacity-50 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                  aria-label="Send OTP"
                >
                  {loading && !otpSent ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                  {otpSent ? "OTP Sent" : "Send OTP"}
                </button>

                <button
                  onClick={verifyOtp}
                  disabled={loading || !otpSent}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-[#0b1220] bg-white/90 transition disabled:opacity-50"
                  aria-label="Verify OTP"
                >
                  Verify OTP
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-5 text-center text-sm text-slate-300">
              Already registered?{" "}
              <button onClick={goLogin} className="text-sky-300 hover:text-sky-200 font-semibold">
                Sign in
              </button>
            </div>

            {/* Reflect created user (registration model) */}
            {/* {newUser && (
              <div className="mt-6 bg-white/6 border border-white/6 rounded p-3 text-xs text-slate-200">
                <div className="font-medium mb-2">Registered (pending verification):</div>
                <pre className="whitespace-pre-wrap break-words text-xs">{JSON.stringify(newUser, null, 2)}</pre>
                <div className="text-slate-400 text-xs mt-2">This shows the user object returned by the register endpoint.</div>
              </div>
            )} */}

            {verified && (
              <div className="mt-4 text-center text-sm text-green-300">Verified — redirecting to login...</div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/6 bg-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} HealthSetu. All rights reserved.
        </div>
      </footer>
    </div>
  );
}