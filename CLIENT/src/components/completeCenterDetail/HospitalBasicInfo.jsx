import React from "react";
import { MapPin, Phone, Globe, Clock, Award } from "lucide-react";

export default function HospitalBasicInfo({ hospital }) {
  if (!hospital) {
    return (
      <div className="bg-white rounded-2xl border-2 border-gray-300 p-6 shadow-md">
        <p className="text-gray-600">Hospital information not available</p>
      </div>
    );
  }

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={`star-${i + 1}`}
            className={`text-lg ${
              i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  // Calculate review count once
  const reviewCount = hospital.reviews ? hospital.reviews.length : 0;
  const reviewLabel = reviewCount === 1 ? "review" : "reviews";

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-300 p-6 shadow-md hover:shadow-lg hover:border-blue-300 transition-all duration-300">
      <h2 className="text-lg font-bold text-gray-900 mb-5">Basic Information</h2>

      <div className="space-y-4">
        {/* Address */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <MapPin size={20} className="text-red-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-600 font-semibold mb-1">Address</p>
            <p className="text-sm text-gray-900 leading-relaxed">
              {hospital.address || "Not available"}
            </p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Phone size={20} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-600 font-semibold mb-1">
              Contact Number
            </p>
            {hospital.phone ? (
              <a
                href={`tel:${hospital.phone}`}
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold break-all"
              >
                {hospital.phone}
              </a>
            ) : (
              <p className="text-sm text-gray-600">Not available</p>
            )}
          </div>
        </div>

        {/* Website */}
        {hospital.website && (
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Globe size={20} className="text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-600 font-semibold mb-1">Website</p>
              <a
                href={hospital.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold break-all"
              >
                {hospital.website}
              </a>
            </div>
          </div>
        )}

        {/* Operating Hours */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Clock size={20} className="text-green-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-600 font-semibold mb-1">
              Operating Hours
            </p>
            <p className="text-sm text-gray-900">
              {hospital.is24x7 ? (
                <span className="font-bold text-green-600">
                  24/7 Service Available
                </span>
              ) : (
                hospital.hours || "Not specified"
              )}
            </p>
          </div>
        </div>

        {/* Rating */}
        {hospital.rating && (
          <div className="flex items-start gap-4 pt-4 border-t border-gray-200">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Award size={20} className="text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-600 font-semibold mb-1">Rating</p>
              <div className="flex items-center gap-3">
                {renderStars(hospital.rating)}
                <span className="text-sm font-bold text-gray-900 whitespace-nowrap">
                  {Number(hospital.rating).toFixed(1)}
                  <span className="text-gray-500 font-normal ml-1">
                    ({reviewCount} {reviewLabel})
                  </span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}