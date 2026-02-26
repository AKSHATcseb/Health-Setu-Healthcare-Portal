import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Edit2 } from "lucide-react";

export default function ProfilePageHeader({ patientName, onEdit }) {
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

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            {/* Profile Avatar */}
            <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/30 hover:bg-white/30 transition-all duration-300 flex-shrink-0">
              <User size={32} className="text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">
                {patientName}
              </h1>
              <p className="text-white/90 text-sm sm:text-base font-medium">
                Patient Profile
              </p>
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/20 backdrop-blur-lg rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-300 text-white font-semibold text-sm"
          >
            <Edit2 size={16} />
            Edit Profile
          </button>
        </div>
      </div>
    </section>
  );
}