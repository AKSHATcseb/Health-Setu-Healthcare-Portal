import React from "react";
import { Calendar, Clock, User, Phone, MapPin, CheckCircle, X } from "lucide-react";

export default function UpcomingAppointmentsCard({
  appointments,
  onApprove,
  onCancel,
}) {
  const formatTime = (time) => {
    if (!time) return "-";
    return time; // already "15:45 - 21:45"
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-[#F0FDFA] rounded-2xl border border-[#D1FAE5] p-6 shadow-sm">
      <h2 className="text-lg font-bold text-[#0F766E] mb-4">
        Upcoming Appointments
      </h2>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {appointments?.length > 0 ? (
          appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="bg-white rounded-xl p-4 border border-[#D1FAE5] hover:shadow-md transition"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {appointment.patientName}
                  </p>
                  <p className="text-xs text-gray-500">
                    ID: {appointment.appointmentId}
                  </p>
                </div>

                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    appointment.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : appointment.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {appointment.status}
                </span>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-[#1ABC9C]" />
                  <span>{formatDate(appointment.date)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-[#0F766E]" />
                  <span>{formatTime(appointment.time)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <User size={14} className="text-[#1ABC9C]" />
                  <span>{appointment.age} yrs</span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-[#0F766E]" />
                  <span>{appointment.phone}</span>
                </div>

                {/* ✅ NEW: Address / Place */}
                <div className="flex items-center gap-2 col-span-2">
                  <MapPin size={14} className="text-red-500" />
                  <span className="text-gray-600">
                    {appointment.address}
                  </span>
                </div>
              </div>

              {/* Actions */}
              {appointment.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => onApprove(appointment._id)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 font-semibold rounded-lg text-xs"
                  >
                    <CheckCircle size={14} />
                    Approve
                  </button>

                  <button
                    onClick={() => onCancel(appointment._id)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-lg text-xs"
                  >
                    <X size={14} />
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg p-6 text-center border border-[#D1FAE5]">
            <p className="text-sm text-gray-500">
              No upcoming appointments
            </p>
          </div>
        )}
      </div>
    </div>
  );
}