import React from "react";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProfileSuccess() {
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
            Profile Complete!
          </h2>
          <p className="text-gray-600 mb-8">
            Your profile has been successfully created. You're all set to book appointments.
          </p>

          {/* Features List */}
          <div className="bg-blue-50 rounded-xl border-2 border-blue-200 p-4 mb-6 text-left">
            <p className="text-xs font-semibold text-blue-900 mb-3">You can now:</p>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-center gap-2">
                <span className="text-lg">✓</span> Book dialysis appointments
              </li>
              <li className="flex items-center gap-2">
                <span className="text-lg">✓</span> Manage your appointments
              </li>
              <li className="flex items-center gap-2">
                <span className="text-lg">✓</span> View appointment history
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate("/book-appointment")}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Book Appointment
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate("/appointments")}
              className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg border-2 border-gray-300 hover:bg-gray-200 transition-all duration-300"
            >
              View My Appointments
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}