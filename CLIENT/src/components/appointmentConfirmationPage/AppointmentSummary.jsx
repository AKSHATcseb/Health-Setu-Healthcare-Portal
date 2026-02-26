import React from "react";
import { Calendar, Clock, MapPin, Stethoscope } from "lucide-react";

export default function AppointmentSummary({ appointment }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <section className="bg-gradient-to-r from-blue-600 via-teal-500 to-blue-700 rounded-3xl p-8 mb-8 shadow-xl relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header with Icon */}
        <div className="flex items-start gap-4 mb-8">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/30 hover:bg-white/30 transition-all duration-300 flex-shrink-0">
            <Stethoscope size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Appointment Summary</h2>
            <p className="text-white/90 font-medium">Review your booking details</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Date */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 group">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 flex-shrink-0">
                <Calendar size={20} className="text-white" />
              </div>
              <div>
                <p className="text-white/70 text-sm font-semibold mb-1">Date</p>
                <p className="font-bold text-white text-base">{formatDate(appointment.date)}</p>
              </div>
            </div>
          </div>

          {/* Time */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 group">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 flex-shrink-0">
                <Clock size={20} className="text-white" />
              </div>
              <div>
                <p className="text-white/70 text-sm font-semibold mb-1">Time Slot</p>
                <p className="font-bold text-white text-base">{appointment.timeSlot}</p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 group">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 flex-shrink-0">
                <MapPin size={20} className="text-white" />
              </div>
              <div>
                <p className="text-white/70 text-sm font-semibold mb-1">Hospital</p>
                <p className="font-bold text-white text-base">{appointment.hospitalName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Badge */}
        <div className="mt-6 px-4 py-3 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 flex items-start gap-3">
          <span className="text-2xl mt-0.5">ℹ️</span>
          <p className="text-white/90 text-sm">
            <span className="font-semibold">Note:</span> Please arrive 15 minutes before your appointment time. Bring your insurance card and medical records.
          </p>
        </div>
      </div>
    </section>
  );
}