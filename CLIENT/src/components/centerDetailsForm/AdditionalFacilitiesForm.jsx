import React from "react";
import { Zap, Users, Award } from "lucide-react";

export default function AdditionalFacilitiesForm({ formData, setFormData }) {
  const facilities = [
    { id: "wifi", label: "Free WiFi", icon: "📡" },
    { id: "parking", label: "Parking Available", icon: "🅿️" },
    { id: "cafeteria", label: "Cafeteria", icon: "☕" },
    { id: "pharmacy", label: "In-house Pharmacy", icon: "💊" },
    { id: "ccuicu", label: "ICU/CCU Facilities", icon: "🏥" },
    { id: "physiotherapy", label: "Physiotherapy", icon: "🏃" },
    { id: "counseling", label: "Counseling Services", icon: "💬" },
    { id: "transport", label: "Patient Transport", icon: "🚑" },
  ];

  const toggleFacility = (facilityId) => {
    const currentFacilities = formData.facilities || [];
    if (currentFacilities.includes(facilityId)) {
      setFormData({
        ...formData,
        facilities: currentFacilities.filter((f) => f !== facilityId),
      });
    } else {
      setFormData({
        ...formData,
        facilities: [...currentFacilities, facilityId],
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-300 p-6 shadow-md hover:shadow-lg hover:border-blue-300 transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <Zap size={20} className="text-purple-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Additional Facilities</h2>
      </div>

      <p className="text-xs text-gray-600 mb-4">
        Select all the facilities available at your hospital
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {facilities.map((facility) => (
          <button
            key={facility.id}
            onClick={() => toggleFacility(facility.id)}
            className={`py-3 px-3 rounded-lg font-semibold text-xs border-2 transition-all duration-300 transform hover:scale-105 text-center ${
              formData.facilities?.includes(facility.id)
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-600 shadow-md"
                : "bg-gray-100 text-gray-800 border-gray-400 hover:bg-gray-200 hover:border-purple-400"
            }`}
          >
            <div className="text-lg mb-1">{facility.icon}</div>
            <span>{facility.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}