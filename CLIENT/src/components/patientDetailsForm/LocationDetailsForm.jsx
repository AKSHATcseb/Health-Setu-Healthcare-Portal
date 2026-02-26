import React, { useState } from "react";
import { MapPin, Loader, AlertCircle } from "lucide-react";

export default function LocationDetailsForm({ formData, setFormData, errors, setErrors }) {
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  const validateAddress = (address) => {
    return address && address.trim().length >= 10;
  };

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, address: value });
    if (value && !validateAddress(value)) {
      setErrors({ ...errors, address: "Address must be at least 10 characters" });
    } else {
      setErrors({ ...errors, address: "" });
    }
  };

  const handleFetchLocation = () => {
    setLocationLoading(true);
    setLocationError("");

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData({
            ...formData,
            latitude,
            longitude,
            address: `Latitude: ${latitude.toFixed(6)}, Longitude: ${longitude.toFixed(6)}`,
          });
          setLocationLoading(false);
          setLocationError("");
        },
        (error) => {
          setLocationLoading(false);
          const errorMessages = {
            PERMISSION_DENIED: "Location access denied. Please enable location in browser settings.",
            POSITION_UNAVAILABLE: "Location information is unavailable.",
            TIMEOUT: "The request to get location timed out.",
          };
          setLocationError(errorMessages[error.code] || "Unable to fetch location");
        }
      );
    } else {
      setLocationLoading(false);
      setLocationError("Geolocation is not supported by your browser");
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-300 p-6 shadow-md hover:shadow-lg hover:border-blue-300 transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
          <MapPin size={20} className="text-orange-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Location Details</h2>
      </div>

      <div className="space-y-4">
        {/* Address */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin size={18} className="absolute left-3 top-3 text-gray-400" />
            <textarea
              placeholder="Enter your full address (street, city, state, postal code)"
              value={formData.address}
              onChange={handleAddressChange}
              rows="3"
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition-all duration-300 outline-none text-sm resize-none ${
                errors.address
                  ? "border-red-500 bg-red-50 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              }`}
            />
          </div>
          {errors.address && (
            <p className="text-xs text-red-600 mt-1">{errors.address}</p>
          )}
        </div>

        {/* Fetch Location Button */}
        <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
          <div className="flex items-start gap-3 mb-3">
            <AlertCircle size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 font-medium">
              Use your device's location to auto-fill the address
            </p>
          </div>
          <button
            onClick={handleFetchLocation}
            disabled={locationLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold rounded-lg hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {locationLoading ? (
              <>
                <Loader size={16} className="animate-spin" />
                Fetching Location...
              </>
            ) : (
              <>
                <MapPin size={16} />
                Get Location
              </>
            )}
          </button>
        </div>

        {locationError && (
          <div className="bg-red-50 rounded-lg p-3 border-2 border-red-200 flex items-start gap-2">
            <AlertCircle size={14} className="text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-700">{locationError}</p>
          </div>
        )}

        {/* Coordinates (if fetched) */}
        {formData.latitude && formData.longitude && (
          <div className="bg-green-50 rounded-lg p-3 border-2 border-green-200">
            <p className="text-xs text-green-700 font-semibold mb-2">Location Detected ✓</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-green-700">
              <div>
                <span className="font-semibold">Latitude:</span> {formData.latitude.toFixed(6)}
              </div>
              <div>
                <span className="font-semibold">Longitude:</span> {formData.longitude.toFixed(6)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}