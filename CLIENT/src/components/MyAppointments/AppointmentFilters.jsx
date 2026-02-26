import React from "react";
import { Filter, X } from "lucide-react";

export default function AppointmentFilters({
  activeFilter,
  setActiveFilter,
  onClearFilters,
}) {
  const filterOptions = [
    { id: "all", label: "All", count: 12 },
    { id: "pending", label: "Pending", count: 3, color: "from-yellow-500 to-orange-500" },
    { id: "upcoming", label: "Upcoming", count: 5, color: "from-blue-500 to-cyan-500" },
    { id: "completed", label: "Completed", count: 3, color: "from-green-500 to-emerald-500" },
    { id: "cancelled", label: "Cancelled", count: 1, color: "from-red-500 to-pink-500" },
  ];

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-300 p-4 mb-6 shadow-md hover:shadow-lg hover:border-blue-300 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Filter size={16} className="text-blue-600" />
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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {filterOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setActiveFilter(option.id)}
            className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 p-2.5 rounded-lg border-2 text-center ${
              activeFilter === option.id
                ? option.id === "all"
                  ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white border-blue-600 shadow-md"
                  : `bg-gradient-to-r ${option.color} text-white border-opacity-0 shadow-md`
                : "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-400 hover:border-blue-400"
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