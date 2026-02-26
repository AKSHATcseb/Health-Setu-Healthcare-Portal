import React from "react";
import { Calendar, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EmptyState({ filter }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-300 p-8 shadow-md text-center">
      <div className="mb-4 flex justify-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <Calendar size={32} className="text-blue-600" />
        </div>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-2">
        {filter === "all"
          ? "No Appointments Yet"
          : `No ${filter.charAt(0).toUpperCase() + filter.slice(1)} Appointments`}
      </h3>

      <p className="text-sm text-gray-600 mb-6 max-w-sm mx-auto">
        {filter === "all"
          ? "You haven't booked any appointments yet. Start booking your dialysis appointment today!"
          : `You don't have any ${filter} appointments at the moment.`}
      </p>

      {filter === "all" && (
        <button
          onClick={() => navigate("/book-appointment")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:shadow-md transition-all duration-300 hover:scale-105 text-sm"
        >
          <Plus size={16} />
          Book Now
        </button>
      )}
    </div>
  );
}