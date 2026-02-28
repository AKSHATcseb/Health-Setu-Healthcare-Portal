import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Building2 } from "lucide-react";

export default function HospitalHeader({ isEditMode = false }) {
  const navigate = useNavigate();

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-r from-blue-600 via-teal-500 to-blue-700 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white font-semibold mb-4 hover:opacity-80 transition-opacity hover:translate-x-1 duration-300 text-sm"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center border border-white/30 hover:bg-white/30 transition-all duration-300">
            <Building2 size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">
              {isEditMode ? "Edit Hospital Details" : "Register Your Hospital"}
            </h1>
            <p className="text-white/90 text-sm sm:text-base font-medium">
              {isEditMode
                ? "Update your hospital information"
                : "Complete registration to start accepting patient appointments"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}