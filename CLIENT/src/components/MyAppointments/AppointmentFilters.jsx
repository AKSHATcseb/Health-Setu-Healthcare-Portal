import React from "react";
import { Filter, X } from "lucide-react";

export default function AppointmentFilters({
  appointmentData,
  activeFilter,
  setActiveFilter,
  onClearFilters,
}) {
  const filterOptions = [
    { id: "all", label: "All", count: appointmentData.length },
    { id: "upcoming", label: "Upcoming", count: appointmentData.filter((a) => a.status === "upcoming").length, color: "from-blue-500 to-cyan-500" },
    { id: "completed", label: "Completed", count: appointmentData.filter((a) => a.status === "completed").length, color: "from-green-500 to-emerald-500" },
    { id: "cancelled", label: "Cancelled", count: appointmentData.filter((a) => a.status === "cancelled").length, color: "from-red-500 to-pink-500" },
  ];


  return (
    <div className=" py-4 mb-6 ">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Filter size={16} className="text-slate-800" />
          Filter
        </h3>
        {activeFilter !== "all" && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
          >
            <X size={14} />
            Clear
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2">
        {filterOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setActiveFilter(option.id)}
            className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 p-2.5 rounded-lg text-center ${
              activeFilter === option.id
                ? option.id === "all"
                  ? "bg-slate-800 text-white shadow-md"
                  : `bg-slate-800 text-white shadow-md`
                : " text-gray-800 hover:bg-gray-200 "
            }`}
          >
            <p className="text-xs font-bold truncate">{option.label}</p>
            <p className={`text-xs mt-0.5 ${
              activeFilter === option.id
                ? "text-white/80"
                : "text-gray-600"
            }`}>
              {option.count}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}