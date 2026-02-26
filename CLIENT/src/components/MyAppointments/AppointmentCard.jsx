import React from "react";
import { Calendar, Clock, MapPin, User, ChevronRight } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function AppointmentCard({ appointment, onEdit, onCancel, onView }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatFullDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getCardBorderColor = (status) => {
    const colors = {
      pending: "border-yellow-300 hover:border-yellow-400",
      upcoming: "border-blue-300 hover:border-blue-400",
      completed: "border-green-300 hover:border-green-400",
      cancelled: "border-red-300 hover:border-red-400",
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className={`bg-white rounded-2xl border-2 ${getCardBorderColor(appointment.status)} p-4 shadow-md hover:shadow-lg transition-all duration-300`}>
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Left Section - Hospital & Status */}
        <div className="flex-1">
          <div className="mb-3">
            <h3 className="text-sm font-bold text-gray-900 truncate">
              {appointment.hospitalName}
            </h3>
            <p className="text-xs text-gray-500 truncate">
              {appointment.hospitalAddress}
            </p>
          </div>
          <StatusBadge status={appointment.status} />
        </div>

        {/* Middle Section - Details */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 sm:items-center">
          {/* Date */}
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-blue-600 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Date</p>
              <p className="text-xs font-bold text-gray-900 truncate">
                {formatFullDate(appointment.date)}
              </p>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-green-600 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Time</p>
              <p className="text-xs font-bold text-gray-900">
                {appointment.timeSlot.split(" - ")[0]}
              </p>
            </div>
          </div>

          {/* Doctor */}
          <div className="flex items-center gap-2">
            <User size={16} className="text-purple-600 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Doctor</p>
              <p className="text-xs font-bold text-gray-900 truncate">
                {appointment.doctorName.split(" ")[0]}
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex gap-2 justify-end sm:items-center">
          {(appointment.status === "pending" || appointment.status === "upcoming") && (
            <button
              onClick={() => onCancel(appointment.id)}
              className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border-2 border-red-300 rounded-lg transition-all duration-300 hover:scale-105 whitespace-nowrap"
            >
              Cancel
            </button>
          )}
          <button
            onClick={() => onView(appointment.id)}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-300 hover:scale-105 flex items-center gap-1 whitespace-nowrap"
          >
            Details
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}