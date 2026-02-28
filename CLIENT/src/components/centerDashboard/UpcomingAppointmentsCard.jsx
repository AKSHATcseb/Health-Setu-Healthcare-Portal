import React from "react";
import { Calendar, Clock, User, Phone, CheckCircle, X } from "lucide-react";

export default function UpcomingAppointmentsCard({
  appointments,
  onApprove,
  onCancel,
}) {
  const formatTime = (time) => {
    return new Date(`2024-01-01 ${time}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-300 p-6 shadow-md hover:shadow-lg hover:border-blue-300 transition-all duration-300">
      <h2 className="text-lg font-bold text-gray-900 mb-4">
        Upcoming Appointments
      </h2>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {appointments && appointments.length > 0 ? (
          appointments.map((appointment, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg p-4 border-2 border-blue-200 hover:border-blue-300 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-sm">
                    {appointment.patientName}
                  </p>
                  <p className="text-xs text-gray-600">
                    ID: {appointment.appointmentId}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                  appointment.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-blue-100 text-blue-700"
                }`}>
                  {appointment.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-blue-600" />
                  <span className="text-gray-700">
                    {formatDate(appointment.date)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-green-600" />
                  <span className="text-gray-700">
                    {formatTime(appointment.time)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={14} className="text-purple-600" />
                  <span className="text-gray-700">{appointment.age} years</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-orange-600" />
                  <span className="text-gray-700">{appointment.phone}</span>
                </div>
              </div>

              {appointment.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => onApprove(appointment.id)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 font-semibold rounded-lg transition text-xs"
                  >
                    <CheckCircle size={14} />
                    Approve
                  </button>
                  <button
                    onClick={() => onCancel(appointment.id)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-lg transition text-xs"
                  >
                    <X size={14} />
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-gray-50 rounded-lg p-6 text-center border-2 border-gray-200">
            <p className="text-sm text-gray-600">No upcoming appointments</p>
          </div>
        )}
      </div>
    </div>
  );
}