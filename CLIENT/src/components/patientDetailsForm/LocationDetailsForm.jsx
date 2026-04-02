import React, { useState } from "react";
import { MapPin, Loader, AlertCircle } from "lucide-react";

/*
  LocationDetailsForm (redesigned)
  - Preserves props and behavior: formData, setFormData, errors, setErrors
  - Visual overhaul to match dark/charcoal palette used across the app
  - Responsive, accessible, and keeps all existing logic (no backend changes)
*/
export default function LocationDetailsForm({ formData, setFormData, errors, setErrors }) {
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  const validateAddress = (address) => {
    return address && address.trim().length >= 10;
  };

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setFormData((p) => ({ ...p, address: value }));
    if (value && !validateAddress(value)) {
      setErrors((prev) => ({ ...prev, address: "Address must be at least 10 characters" }));
    } else {
      setErrors((prev) => ({ ...prev, address: "" }));
    }
  };

  const handleFetchLocation = () => {
    setLocationLoading(true);
    setLocationError("");

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((p) => ({
            ...p,
            latitude,
            longitude,
            // preserve user address if they already typed one; otherwise set a friendly placeholder
            address:
              p.address && p.address.trim().length >= 10
                ? p.address
                : `Latitude: ${latitude.toFixed(6)}, Longitude: ${longitude.toFixed(6)}`,
          }));
          setLocationLoading(false);
          setLocationError("");
        },
        (error) => {
          setLocationLoading(false);
          const errorMessages = {
            1: "Location access denied. Please enable location in browser settings.",
            2: "Location information is unavailable.",
            3: "The request to get location timed out.",
          };
          setLocationError(errorMessages[error.code] || "Unable to fetch location");
        },
        { timeout: 10000 }
      );
    } else {
      setLocationLoading(false);
      setLocationError("Geolocation is not supported by your browser");
    }
  };

  return (
    <section
      aria-label="Location details"
      className="rounded-2xl p-6 shadow-lg"
      style={{ background: "linear-gradient(180deg,#0b1220,#111827)", color: "#f8fafc" }}
    >
      <div className="flex items-center gap-3 mb-5">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-lg"
          style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))" }}
        >
          <MapPin className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Location details</h2>
          <p className="text-sm text-slate-300">Provide your address or use device location to autofill</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Address <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-3 top-3 text-slate-400">
              <MapPin size={16} />
            </div>
            <textarea
              placeholder="Enter your full address (street, city, state, postal code)"
              value={formData.address || ""}
              onChange={handleAddressChange}
              rows="3"
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg text-sm resize-none transition focus:outline-none
                ${errors.address ? "border-rose-500 bg-rose-900/10 focus:border-rose-500 focus:ring-rose-200" : "bg-white/6 border-transparent focus:ring-2 focus:ring-sky-600"}`}
              aria-invalid={Boolean(errors.address)}
              aria-describedby={errors.address ? "address-error" : undefined}
            />
          </div>
          {errors.address && (
            <p id="address-error" className="text-xs text-rose-300 mt-1">{errors.address}</p>
          )}
        </div>

        {/* Fetch Location Card */}
        <div className="rounded-lg p-4" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))", border: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="flex items-start gap-3 mb-3">
            <AlertCircle size={16} className="text-sky-300 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-slate-100 font-medium">Auto-fill with device location</p>
              <p className="text-xs text-slate-300 mt-1">This will populate your coordinates and a friendly address placeholder.</p>
            </div>
          </div>

          <button
            onClick={handleFetchLocation}
            disabled={locationLoading}
            className="w-full inline-flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg font-semibold text-white transition disabled:opacity-60"
            style={{ background: "linear-gradient(90deg,#0ea5e9 0%, #0369a1 100%)" }}
            aria-disabled={locationLoading}
            aria-label="Fetch device location"
          >
            {locationLoading ? (
              <>
                <Loader className="animate-spin" size={16} />
                <span className="text-sm">Fetching location...</span>
              </>
            ) : (
              <>
                <MapPin size={16} />
                <span className="text-sm">Use my device location</span>
              </>
            )}
          </button>
        </div>

        {/* Location error */}
        {locationError && (
          <div className="p-3 rounded-md" style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.14)" }}>
            <div className="flex items-start gap-2">
              <AlertCircle size={14} className="text-rose-300 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-rose-200">{locationError}</p>
            </div>
          </div>
        )}

        {/* Coordinates (if fetched) */}
        {formData.latitude && formData.longitude && (
          <div className="p-3 rounded-md" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.12)" }}>
            <p className="text-xs text-emerald-200 font-semibold mb-2">Location detected ✓</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-emerald-200">
              <div>
                <span className="font-semibold">Latitude:</span> {Number(formData.latitude).toFixed(6)}
              </div>
              <div>
                <span className="font-semibold">Longitude:</span> {Number(formData.longitude).toFixed(6)}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}