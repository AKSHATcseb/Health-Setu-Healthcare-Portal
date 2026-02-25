import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../../firebase";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Heart, ArrowRight, CheckCircle } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [verified, setVerified] = useState(false);

  const navigate = useNavigate();

  /* ------------------------------------------ */
  /* ✅ STEP 1: REGISTER + SEND VERIFICATION */
  /* ------------------------------------------ */
  const handleRegister = async () => {
    if (!name || !role || !email || !password) {
      setMessage({
        type: "error",
        text: "Please fill all fields and select role.",
      });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      // ✅ Firebase Signup
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // ✅ Send Verification Email
      await sendEmailVerification(userCred.user);

      setMessage({
        type: "success",
        text: "Verification email sent! Check your inbox and click below.",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------------------ */
  /* ✅ STEP 2: CHECK VERIFICATION + SAVE BACKEND */
  /* ------------------------------------------ */
  const checkVerification = async () => {
    if (!auth.currentUser) {
      setMessage({
        type: "error",
        text: "No user session found. Please login again.",
      });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      // ✅ Reload user from Firebase
      await auth.currentUser.reload();

      // ✅ Force refresh token from server
      const freshToken = await auth.currentUser.getIdToken(true);

      // ❌ Still not verified
      if (!auth.currentUser.emailVerified) {
        setMessage({
          type: "error",
          text: "Email still not verified. Please check your inbox and verify.",
        });
        return;
      }

      // ✅ Save user in backend MongoDB
      await api.post(
        "/api/auth/login",
        {
          role,
          name,
        },
        {
          headers: {
            Authorization: `Bearer ${freshToken}`,
          },
        }
      );

      // ✅ Verified success
      setVerified(true);

      setMessage({
        type: "success",
        text: "Email verified! Account created successfully. Redirecting...",
      });

      // ✅ Redirect after short delay
      setTimeout(() => {
        if (role === "patient") {
          navigate("/patient/details", { replace: true });
        }

        if (role === "hospital_admin") {
          navigate("/center/details", { replace: true });
        }
      }, 1200);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex flex-col">
      
      {/* Navbar */}
      <nav className="w-full bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 py-4">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" 
              onClick={() => navigate("/")}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-500 rounded-full flex items-center justify-center shadow-md">
                <Heart size={20} className="text-white fill-white" />
              </div>
              <h1 className="font-bold text-xl bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                HealthSetu
              </h1>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="text-gray-700 font-medium hover:text-blue-600 transition-colors text-sm sm:text-base"
            >
              Already have an account? Sign in
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-20 py-12 sm:py-16">
        <div className="w-full max-w-md">
          
          {/* Registration Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 sm:p-10">
            
            {/* Header */}
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Sign up to get started with HealthSetu
              </p>
            </div>

            {/* Role Selection */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-4">
                {["patient", "hospital_admin"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`py-3 px-4 rounded-lg font-semibold capitalize transition-all duration-300 border-2 ${
                      role === r
                        ? "bg-gradient-to-r from-blue-600 to-teal-500 text-white border-transparent shadow-lg"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {r === "hospital_admin" ? "Hospital Admin" : "Patient"}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Alert */}
            {message && (
              <div
                className={`mb-6 p-4 rounded-lg border text-sm font-medium ${
                  message.type === "success"
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
              >
                {message.text}
              </div>
            )}

            {!verified ? (
              <>
                {/* Form Fields */}
                <form className="space-y-5 mb-6">
                  
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-400"
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-400"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a strong password"
                        className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-400"
                      />
                    </div>
                  </div>

                </form>

                {/* Primary Button */}
                <button
                  onClick={handleRegister}
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg font-bold text-base hover:shadow-lg hover:shadow-blue-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 transition-all duration-300 flex items-center justify-center gap-2 mb-4"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending verification...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>

                {/* Secondary Button */}
                <button
                  onClick={checkVerification}
                  disabled={loading}
                  className="w-full py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-bold text-base hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  I've verified my email
                </button>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="flex justify-center mb-4">
                  <CheckCircle size={48} className="text-green-500" />
                </div>
                <p className="text-lg font-semibold text-green-600 mb-2">
                  Email Verified Successfully!
                </p>
                <p className="text-gray-600 text-sm">
                  Your account is being set up. Redirecting you shortly...
                </p>
              </div>
            )}

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-600">or</span>
              </div>
            </div>

            {/* Sign In Link */}
            <p className="text-center text-gray-600 text-sm">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-6 px-4 sm:px-6 lg:px-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-600 text-xs sm:text-sm">
          <p>&copy; 2024 HealthSetu. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Help Center</a>
          </div>
        </div>
      </footer>
    </div>
  );
}