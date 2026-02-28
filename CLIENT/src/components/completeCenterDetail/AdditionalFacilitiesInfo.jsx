import React from "react";
import { Zap, CheckCircle } from "lucide-react";

export default function AdditionalFacilitiesInfo({ facilities }) {
  const facilityDetails = {
    wifi: { icon: "📡", label: "Free WiFi", description: "High-speed internet available" },
    parking: { icon: "🅿️", label: "Parking", description: "Free parking for patients" },
    cafeteria: { icon: "☕", label: "Cafeteria", description: "Food and beverages available" },
    pharmacy: { icon: "💊", label: "Pharmacy", description: "In-house pharmacy" },
    ccuicu: { icon: "🏥", label: "ICU/CCU", description: "Critical care facilities" },
    physiotherapy: { icon: "🏃", label: "Physiotherapy", description: "Rehabilitation services" },
    counseling: { icon: "💬", label: "Counseling", description: "Mental health support" },
    transport: { icon: "🚑", label: "Transport", description: "Patient transport service" },
  };

  const availableFacilities = facilities.filter((f) => f !== null && f !== undefined);

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-300 p-6 shadow-md hover:shadow-lg hover:border-blue-300 transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <Zap size={20} className="text-purple-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Additional Facilities</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {availableFacilities.length > 0 ? (
          availableFacilities.map((facilityId, index) => {
            const facility = facilityDetails[facilityId];
            return (
              <div
                key={index}
                className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border-2 border-purple-200 hover:shadow-md transition text-center"
              >
                <div className="text-3xl mb-2">{facility.icon}</div>
                <p className="text-xs font-bold text-purple-900 mb-1">
                  {facility.label}
                </p>
                <p className="text-xs text-purple-700">
                  {facility.description}
                </p>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 sm:col-span-3 md:col-span-4 text-center py-6">
            <p className="text-sm text-gray-600">No additional facilities listed</p>
          </div>
        )}
      </div>
    </div>
  );
}