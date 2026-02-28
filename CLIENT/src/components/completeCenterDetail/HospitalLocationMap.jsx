import React from "react";
import { MapPin, Navigation } from "lucide-react";

export default function HospitalLocationMap({ hospital }) {
  const handleOpenMap = () => {
    if (hospital.latitude && hospital.longitude) {
      const mapUrl = `https://maps.google.com/?q=${hospital.latitude},${hospital.longitude}`;
      window.open(mapUrl, "_blank");
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-300 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
      {/* Map Container */}
      <div className="relative w-full bg-gray-200 aspect-video">
        {hospital.latitude && hospital.longitude ? (
          <iframe
            title="Hospital Location"
            width="100%"
            height="100%"
            frameBorder="0"
            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d${hospital.longitude}!3d${hospital.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${hospital.latitude}%2C${hospital.longitude}!5e0!3m2!1sen!2sus!4v`}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <MapPin size={32} className="text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 text-sm">Location data not available</p>
            </div>
          </div>
        )}
      </div>

      {/* Location Details */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-600 font-semibold mb-2">
              Hospital Location
            </p>
            <p className="text-sm text-gray-900 leading-relaxed">
              {hospital.address}
            </p>
          </div>
          {hospital.latitude && hospital.longitude && (
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-gray-600 mb-1">Coordinates</p>
              <p className="text-xs font-mono text-gray-900">
                {hospital.latitude.toFixed(4)}
              </p>
              <p className="text-xs font-mono text-gray-900">
                {hospital.longitude.toFixed(4)}
              </p>
            </div>
          )}
        </div>

        {/* View on Map Button */}
        {hospital.latitude && hospital.longitude && (
          <button
            onClick={handleOpenMap}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold rounded-lg hover:shadow-md transition-all duration-300 hover:scale-105"
          >
            <Navigation size={16} />
            Open in Google Maps
          </button>
        )}
      </div>
    </div>
  );
}