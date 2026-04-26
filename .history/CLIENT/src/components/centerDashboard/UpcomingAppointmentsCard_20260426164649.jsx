import React from "react";
import { Calendar, Clock, User, Phone, CheckCircle, X } from "lucide-react";

export default function UpcomingAppointmentsCard({
  appointments,
  onApprove,
  onCancel,
}) {
  const formatTime = (timeRange) => {
    if (!timeRange) return "N/A";
    return timeRange.split(" - ")[0]; // show start time only
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="bg-[#F0FDFA] rounded-2xl border border-[#D1FAE5] p-6 shadow-sm">
      <h2 className="text-lg font-bold text-[#0F766E] mb-4">
        Upcoming Appointments
      </h2>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {appointments?.length > 0 ? (
          appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="bg-white rounded-xl p-4 border border-[#D1FAE5] hover:border-[#1ABC9C] transition-all"
            >
              {/* HEADER */}
              <div className="flex justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">
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
                      : appointment.status === "active"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {appointment.status}
                </span>
              </div>

              {/* DETAILS */}
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-[#1ABC9C]" />
                  <span>{formatDate(appointment.date)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-green-500" />
                  <span>{formatTime(appointment.time)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <User size={14} className="text-purple-500" />
                  <span>{appointment.age} yrs</span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-orange-500" />
                  <span>{appointment.phone}</span>
                </div>
              </div>

              {/* ACTIONS */}
              {appointment.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => onApprove(appointment._id)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-[#A8E6CF] hover:bg-[#1ABC9C] text-[#0F766E] hover:text-white font-semibold rounded-lg transition text-xs"
                  >
                    <CheckCircle size={14} />
                    Approve
                  </button>

                  <button
                    onClick={() => onCancel(appointment._id)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-600 font-semibold rounded-lg transition text-xs"
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