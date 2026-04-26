import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";

export default function AppointmentsHeader() {
  const navigate = useNavigate();

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-8 bg-slate-200 relative overflow-hidden">
      {/* Animated Background */}
      {/* <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div> */}

      <div className="max-w-7xl mx-auto relative z-10 flex items-center gap-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-800 font-semibold mb-4 hover:opacity-80 transition-opacity hover:translate-x-1 duration-300 text-sm"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center">
            <Calendar size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-1">
              My Appointments
            </h1>
            <p className="text-slate-600 text-sm sm:text-base font-medium">
              View and manage your dialysis appointments
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}