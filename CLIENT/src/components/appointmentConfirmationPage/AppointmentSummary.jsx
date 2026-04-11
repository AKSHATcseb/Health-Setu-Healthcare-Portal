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
    <section className="rounded-xl p-7 mb-4 shadow-md">

      <div className="relative z-10">
        {/* Details Grid */}
        <div>
          <p className="text-slate-800 text-sm font-semibold mb-1">Date</p>
          <p className="font-semibold text-slate-600 text-base">{formatDate(appointment.date)}</p>
        </div>

        {/* Info Badge */}
        {/* <div className="gap-3 flex items-center justify-center">
          <span className="text-2xl mt-0.5">ℹ️</span>
          <p className="text-gray-800 text-sm ">
            <span className="font-semibold">Note:</span> Please arrive 15 minutes before your appointment time. Bring your insurance card and medical records.
          </p>
        </div> */}
      </div>
    </section>
  );
}