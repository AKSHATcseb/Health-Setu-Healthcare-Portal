import React from "react";
import { Droplet } from "lucide-react";

export default function DialysisSeatsOccupancy({ totalSeats, occupiedSeats }) {
  const occupancyPercentage = Math.round((occupiedSeats / totalSeats) * 100);
  const availableSeats = totalSeats - occupiedSeats;

  const getStatusColor = () => {
    if (occupancyPercentage >= 80) return "text-red-600";
    if (occupancyPercentage >= 60) return "text-orange-600";
    return "text-green-600";
  };

  const getProgressColor = () => {
    if (occupancyPercentage >= 80) return "from-red-500 to-red-600";
    if (occupancyPercentage >= 60) return "from-orange-500 to-orange-600";
    return "from-green-500 to-green-600";
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-300 p-6 shadow-md hover:shadow-lg hover:border-blue-300 transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
          <Droplet size={20} className="text-red-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Seat Occupancy</h2>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-blue-50 rounded-lg p-3 border-2 border-blue-200 text-center">
          <p className="text-xs text-blue-700 font-semibold mb-1">Total</p>
          <p className="text-2xl font-bold text-blue-900">{totalSeats}</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-3 border-2 border-orange-200 text-center">
          <p className="text-xs text-orange-700 font-semibold mb-1">Occupied</p>
          <p className="text-2xl font-bold text-orange-900">{occupiedSeats}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3 border-2 border-green-200 text-center">
          <p className="text-xs text-green-700 font-semibold mb-1">Available</p>
          <p className="text-2xl font-bold text-green-900">{availableSeats}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-gray-700">Occupancy Rate</p>
          <p className={`text-sm font-bold ${getStatusColor()}`}>
            {occupancyPercentage}%
          </p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`bg-gradient-to-r ${getProgressColor()} h-full rounded-full transition-all duration-500`}
            style={{ width: `${occupancyPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Status Alert */}
      <div className={`rounded-lg p-3 border-2 ${
        occupancyPercentage >= 80
          ? "bg-red-50 border-red-200 text-red-700"
          : occupancyPercentage >= 60
          ? "bg-orange-50 border-orange-200 text-orange-700"
          : "bg-green-50 border-green-200 text-green-700"
      }`}>
        <p className="text-xs font-semibold">
          {occupancyPercentage >= 80
            ? "⚠️ High occupancy. Schedule maintenance if needed."
            : occupancyPercentage >= 60
            ? "📊 Moderate occupancy."
            : "✓ Seats available for new appointments"}
        </p>
      </div>
    </div>
  );
}