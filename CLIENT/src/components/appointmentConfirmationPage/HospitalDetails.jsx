import React from "react";
import { MapPin, Phone, Clock, Award } from "lucide-react";

export default function HospitalDetails({ hospital }) {
  return (
    <div className="bg-white rounded-3xl border-2 border-gray-300 p-7 mb-8 shadow-xl hover:shadow-2xl transition-all duration-300">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Award size={22} className="text-green-600" />
        Hospital Information
      </h3>

      <div className="space-y-4">
        {/* Hospital Name and Rating */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-green-600 font-semibold mb-1">Hospital Name</p>
              <p className="text-2xl font-bold text-gray-900">{hospital.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Rating</p>
              <div className="flex items-center justify-end gap-1">
                <span className="text-2xl font-bold text-yellow-500">★</span>
                <p className="text-xl font-bold text-gray-900">{hospital.rating}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="flex gap-4 items-start">
          <MapPin size={20} className="text-red-500 flex-shrink-0 mt-1" />
          <div>
            <p className="text-sm text-gray-600 font-semibold mb-1">Address</p>
            <p className="text-gray-700">{hospital.address}</p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex gap-4 items-start">
          <Phone size={20} className="text-blue-500 flex-shrink-0 mt-1" />
          <div>
            <p className="text-sm text-gray-600 font-semibold mb-1">Contact</p>
            <p className="text-gray-700">{hospital.phone}</p>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="flex gap-4 items-start">
          <Clock size={20} className="text-orange-500 flex-shrink-0 mt-1" />
          <div>
            <p className="text-sm text-gray-600 font-semibold mb-1">Operating Hours</p>
            <p className="text-gray-700">{hospital.hours}</p>
          </div>
        </div>

        {/* Description */}
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200 mt-4">
          <p className="text-sm text-blue-900">{hospital.description}</p>
        </div>
      </div>
    </div>
  );
}