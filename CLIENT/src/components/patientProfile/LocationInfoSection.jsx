import React from "react";
import { MapPin, Navigation } from "lucide-react";

export default function LocationInfoSection({ locationInfo }) {
  const openMap = () => {
    if (locationInfo.latitude && locationInfo.longitude) {
      const mapUrl = `https://maps.google.com/?q=${locationInfo.latitude},${locationInfo.longitude}`;
      window.open(mapUrl, "_blank");
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-300 p-6 shadow-md hover:shadow-lg hover:border-blue-300 transition-all duration-300">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
          <MapPin size={20} className="text-orange-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Location Information</h2>
      </div>

      <div className="space-y-4">
        {/* Address */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-xs text-gray-600 font-semibold mb-2">Address</p>
          <p className="text-sm text-gray-900 leading-relaxed">
            {locationInfo.address}
          </p>
        </div>

        {/* Coordinates */}
        {locationInfo.latitude && locationInfo.longitude && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-xs text-blue-700 font-semibold mb-1">Latitude</p>
              <p className="text-sm font-bold text-blue-900">
                {locationInfo.latitude.toFixed(6)}
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-xs text-blue-700 font-semibold mb-1">Longitude</p>
              <p className="text-sm font-bold text-blue-900">
                {locationInfo.longitude.toFixed(6)}
              </p>
            </div>
          </div>
        )}

        {/* View on Map Button */}
        {locationInfo.latitude && locationInfo.longitude && (
          <button
            onClick={openMap}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:shadow-md transition-all duration-300 hover:scale-105 text-sm"
          >
            <Navigation size={16} />
            View on Map
          </button>
        )}
      </div>
    </div>
  );
}