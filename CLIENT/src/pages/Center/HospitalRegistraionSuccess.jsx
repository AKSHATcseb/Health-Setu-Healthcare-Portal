import React from "react";
import { CheckCircle, ArrowRight, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HospitalRegistrationSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl border-2 border-green-300 p-8 shadow-2xl text-center">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-4 animate-bounce">
              <CheckCircle size={48} className="text-white" />
            </div>
          </div>

          {/* Success Message */}
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Registration Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Your hospital has been successfully registered. Our team will verify your details
            within 24-48 hours.
          </p>

          {/* Verification Info */}
          <div className="bg-blue-50 rounded-xl border-2 border-blue-200 p-4 mb-6 text-left">
            <div className="flex items-start gap-3">
              <Mail size={18} className="text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-semibold text-blue-900 mb-1">
                  Verification Email Sent
                </p>
                <p className="text-xs text-blue-800">
                  Check your email for verification instructions and registration confirmation.
                </p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-green-50 rounded-xl border-2 border-green-200 p-4 mb-6 text-left">
            <p className="text-xs font-semibold text-green-900 mb-3">Next Steps:</p>
            <ul className="space-y-2 text-sm text-green-800">
              <li className="flex items-center gap-2">
                <span className="text-lg">1</span> Verify your email address
              </li>
              <li className="flex items-center gap-2">
                <span className="text-lg">2</span> Complete KYC verification
              </li>
              <li className="flex items-center gap-2">
                <span className="text-lg">3</span> Start accepting patient appointments
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate("/center/dashboard")}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Go to Dashboard
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg border-2 border-gray-300 hover:bg-gray-200 transition-all duration-300"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}