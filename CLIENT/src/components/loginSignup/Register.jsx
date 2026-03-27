import React, { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

/*
  Simplified registration flow (OTP-based):

  - User supplies role (patient | hospital_admin), email and password.
  - User clicks "Send OTP" -> POST /api/auth/register { email, password, role }
    Backend is expected to create a pending user (registration model) and send an OTP to email.
    The response's created user (if any) is stored in `newUser` so the newly created user is
    reflected in the registration model on the UI.
  - User enters OTP and clicks "Verify OTP" -> POST /api/auth/verify-otp { email, otp }
    On success we show a success message and the newUser info and redirect to /login.
  - This component intentionally keeps behavior minimal: no automatic login, no token handling.
*/

export default function Register() {
  const [role, setRole] = useState("patient"); // simple default
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [verified, setVerified] = useState(false);

  // store created user returned from register endpoint so UI reflects registration model
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

    try {
      setLoading(true);
      setMessage(null);

      const res = await api.post("/api/auth/register", { email, password, role });

      // If backend returns the created user, reflect it in UI (registration model)
      const createdUser = res.data?.user || null;
      setNewUser(createdUser);

      setOtpSent(true);
      setMessage({ type: "success", text: "OTP sent to your email. Enter it below to verify." });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || err.message });
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

      // Redirect to login after short delay
      setTimeout(() => navigate("/login", { replace: true }), 1200);
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold">Create account</h2>
          <p className="text-sm text-gray-600 mt-1">Simple OTP-based registration</p>
        </div>

        {message && (
          <div
            className={`mb-4 p-3 rounded text-sm ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-100"
                : "bg-red-50 text-red-700 border border-red-100"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">I am a</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded border px-3 py-2 bg-white"
            >
              <option value="patient">Patient</option>
              <option value="hospital_admin">Hospital Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="w-full rounded border px-3 py-2"
            />
          </div>

          {otpSent && (
            <div>
              <label className="block text-sm font-medium mb-1">OTP</label>
              <input
                type="text"
                value={otp}
                inputMode="numeric"
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                className="w-full rounded border px-3 py-2"
              />
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleRegister}
              disabled={loading || otpSent}
              className="flex-1 bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50"
            >
              {loading && !otpSent ? "Sending..." : "Send OTP"}
            </button>

            <button
              onClick={verifyOtp}
              disabled={loading || !otpSent}
              className="flex-1 border border-blue-600 text-blue-600 rounded px-4 py-2 disabled:opacity-50"
            >
              Verify OTP
            </button>
          </div>
        </div>

        <div className="mt-5 text-center text-sm text-gray-600">
          Already registered?{" "}
          <button onClick={goLogin} className="text-blue-600 underline">
            Sign in
          </button>
        </div>

        {/* Reflect created user (registration model) */}
        {newUser && (
          <div className="mt-6 bg-gray-50 border rounded p-3 text-xs">
            <div className="font-medium mb-2">Registered (pending verification):</div>
            <pre className="whitespace-pre-wrap wrap-break-words text-xs">{JSON.stringify(newUser, null, 2)}</pre>
            <div className="text-gray-500 text-xs mt-2">This shows the user object returned by the register endpoint.</div>
          </div>
        )}

        {verified && (
          <div className="mt-4 text-center text-sm text-green-600">Verified — redirecting to login...</div>
        )}
      </div>
    </div>
  );
}