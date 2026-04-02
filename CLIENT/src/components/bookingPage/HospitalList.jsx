import React from "react";
import { MapPin, Clock, DollarSign } from "lucide-react";

export default function HospitalCard({ hospital, selectedDate }) {
  if (!hospital) return null;

  const {
    _id,
    hospitalName,
    address,
    distance,
    priceFor4Hrs,
    priceFor6Hrs,
    availableSlots = [],
  } = hospital;

  const name = hospitalName || "Hospital";
  const price = priceFor4Hrs || priceFor6Hrs || null;
  const distanceText = distance ? `${distance.toFixed(1)} km` : null;

  const canBook = selectedDate && availableSlots.length > 0;
  const firstSlot = availableSlots[0];

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex gap-4 items-start border border-gray-100 hover:shadow-md transition">

      {/* LEFT: INITIAL BOX */}
      <div className="w-16 h-16 rounded-lg bg-cyan-600 text-white flex items-center justify-center font-bold text-lg">
        {name.charAt(0)}
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex-1">

        {/* HEADER */}
        <h3 className="text-lg font-semibold text-gray-900">
          {name}
        </h3>

        {/* ADDRESS */}
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <MapPin size={14} className="mr-1" />
          {address || "No address"}
        </div>

        {/* DISTANCE + PRICE */}
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
          
          {distanceText && (
            <div className="flex items-center gap-1">
              <MapPin size={14} className="text-cyan-600" />
              {distanceText}
            </div>
          )}

          {price && (
            <div className="flex items-center gap-1">
              <DollarSign size={14} className="text-green-600" />
              ₹{price}
            </div>
          )}
        </div>

        {/* SLOTS */}
        <div className="mt-3 flex flex-wrap gap-2">
          {availableSlots.length > 0 ? (
            availableSlots.map((slot, index) => (
              <button
                key={index}
                className="px-3 py-1 text-xs rounded-md bg-cyan-100 text-cyan-800 hover:bg-cyan-200"
              >
                {slot}
              </button>
            ))
          ) : (
            <p className="text-red-500 text-sm">No slots available</p>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between mt-4">

          <div className="text-sm text-gray-600 flex items-center gap-1">
            <Clock size={14} />
            {availableSlots.length > 0
              ? `Next: ${firstSlot}`
              : "No appointments"}
          </div>

          <button
            disabled={!canBook}
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("hospital:book", {
                  detail: {
                    hospitalId: _id,
                    date: selectedDate,
                    time: firstSlot,
                  },
                })
              )
            }
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${
              canBook
                ? "bg-cyan-600 text-white hover:bg-cyan-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Book
          </button>
        </div>
      </div>
    </div>
  );
}