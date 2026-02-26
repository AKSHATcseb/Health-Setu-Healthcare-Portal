import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Stethoscope } from "lucide-react";

export default function Header() {
  const navigate = useNavigate();

  return (
    <section className="w-full px-4 sm:px-6 lg:px-12 py-12 bg-gradient-to-r from-blue-600 via-teal-500 to-blue-700 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white font-semibold mb-6 hover:opacity-80 transition-opacity hover:translate-x-1 duration-300"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/30 hover:bg-white/30 transition-all duration-300">
            <Stethoscope size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Book Your Dialysis Appointment
            </h1>
            <p className="text-white/90 text-lg font-medium">
              Find the best dialysis center that fits your needs and schedule
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}