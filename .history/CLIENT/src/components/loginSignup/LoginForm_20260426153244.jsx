import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api, { setAuthToken } from "../../services/api";
import { HeartPulseBadge, ShieldLock } from "../CustomIcons";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const clearStoredToken = () => {
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");
    setAuthToken(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post("/api/auth/login", {
        email,
        password,
      });

      if (!data) {
        throw new Error("Invalid server response from login");
      }

      if (data?.status === "pending") {
        setInfo("Your hospital request is under process. Please wait for approval.");
        return;
      }

      // Store token
      if (data?.token) {
        const token = data.token;

        if (rememberMe) {
          localStorage.setItem("token", token);
          sessionStorage.removeItem("token");
        } else {
          sessionStorage.setItem("token", token);
          localStorage.removeItem("token");
        }

        setAuthToken(token);
      }

      const role = data?.user?.role;
      const userId = data?.user?._id || data?.user?.id;

      if (!userId) {
        throw new Error("User ID not found");
      }

      if (role === "patient") {
        navigate(`/patient/dashboard/${userId}`, { replace: true });
        return;
      }

      if (role === "hospital_admin") {
        navigate(`/center/dashboard/${userId}`, { replace: true });
        return;
      }

      if (role === "admin") {
        navigate(`/admin/dashboard/${userId}`, { replace: true });
        return;
      }

      // fallback
      navigate("/", { replace: true });
    } catch (err) {
      // 🔥 IMPORTANT: Handle 403 (pending request)
      if (err.response?.status === 403) {
        alert(err.response?.data?.message || "Your request is under process.");
        return;
      }

      // Normal errors
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    navigate("/forgot-password");
  };

  const handleGoogle = () => {
    setError("");
    setInfo("Google sign-in is not implemented yet.");
  };

  return (
    <div
      className="w-full min-h-screen flex flex-col"
    >
      {/* Header */}
      <header className="w-full px-10 py-10 bg-slate-200">
        <div className=" sm:px-6 lg:px-12 flex items-center justify-center bg-slate-200">
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-500 rounded-full flex items-center justify-center">
              <Heart size={20} className="text-white fill-white" />
            </div>
            <h1 className="font-bold text-lg sm:text-2xl text-blue-700">
              HealthSetu
            </h1>
          </div>


          {/* Mobile action: compact */}
          <div className="sm:hidden">
            <button onClick={() => navigate("/register")} className="text-sm text-slate-700 px-2 py-1">
              Sign up
            </button>
          </div>
        </div>
      </header>

      {/* Main: center the card */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-12 py-12 bg-slate-200">
        <div className="w-full max-w-lg mx-auto">
          <div
            className="rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl"
            style={{ background: "linear-gradient(180deg,#0b1220 0%, #111827 100%)", color: "#f8fafc" }}
            aria-labelledby="register-heading"
          >
            <div className="text-center mb-6">
              <div
                className="inline-flex items-center justify-center w-14 h-14 rounded-lg mx-auto mb-3"
                style={{ background: "linear-gradient(180deg,#111827,#0b1220)" }}
              >
                <ShieldLock className="w-6 h-6 text-white" />
              </div>
              <h3 id="login-heading" className="text-2xl font-extrabold">Sign in</h3>
              <p className="text-sm text-slate-300 mt-2">Enter your credentials to access your account</p>
            </div>

            {/* Info & Error (accessible) */}
            {info && (
              <div className="mb-4 p-3 rounded-md" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.04)" }} role="status" aria-live="polite">
                <p className="text-sm text-slate-200 font-medium">{info}</p>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 rounded-md" style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.14)" }} role="alert" aria-live="assertive">
                <p className="text-sm text-red-300 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-slate-200">Email</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail size={18} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/4 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600 transition"
                    aria-label="Email address"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2 text-slate-200">Password</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3 rounded-lg bg-white/4 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600 transition"
                    aria-label="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-100 transition"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember + forgot */}
              <div className="flex items-center justify-end">
                {/* <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-500 bg-white/2 text-sky-600 focus:ring-sky-500"
                    />
                    <span className="text-sm text-slate-300">Remember me</span>
                  </label> */}

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-sky-300 hover:text-sky-200 font-medium"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 md:py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-semibold text-base hover:shadow-lg transform hover:-translate-y-0.5 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                aria-label="Sign in"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm mt-5 text-slate-300">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-sky-300 hover:text-sky-200 font-semibold"
              >
                Create one
              </button>
            </p>

            <p className="text-center text-xs text-slate-500 mt-4">
              By signing in you agree to our <button className="text-slate-300 underline">Terms</button> and <button className="text-slate-300 underline">Privacy</button>.
            </p>
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