import React from "react";
import { MapPin, Phone, Clock, Droplet, Edit2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HospitalInfoCard({ hospitalInfo }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-300 p-6 shadow-md hover:shadow-lg hover:border-blue-300 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Hospital Information</h2>
        <button
          onClick={() => navigate("/center/update")}
          className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-600 hover:text-blue-600"
        >
          <Edit2 size={18} />
        </button>
      </div>

      <div className="space-y-3">
        {/* Location */}
        <div className="flex items-start gap-3 pb-3 border-b border-gray-200">
          <MapPin size={18} className="text-red-600 flex-shrink-0 mt-1" />
          <div>
            <p className="text-xs text-gray-600 font-semibold mb-1">Address</p>
            <p className="text-sm text-gray-900">{hospitalInfo.address}</p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start gap-3 pb-3 border-b border-gray-200">
          <Phone size={18} className="text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <p className="text-xs text-gray-600 font-semibold mb-1">Contact</p>
            <p className="text-sm text-gray-900">{hospitalInfo.phone}</p>
          </div>
        </div>

        {/* Operating Status */}
        <div className="flex items-start gap-3 pb-3 border-b border-gray-200">
          <Clock size={18} className="text-green-600 flex-shrink-0 mt-1" />
          <div>
            <p className="text-xs text-gray-600 font-semibold mb-1">Operating</p>
            <p className="text-sm text-gray-900">
              {hospitalInfo.is24x7 ? "24/7 Service" : hospitalInfo.hours}
            </p>
          </div>
        </div>

        {/* Dialysis Seats */}
        <div className="flex items-start gap-3">
          <Droplet size={18} className="text-red-600 flex-shrink-0 mt-1" />
          <div>
            <p className="text-xs text-gray-600 font-semibold mb-1">Dialysis Seats</p>
            <p className="text-sm text-gray-900">
              {hospitalInfo.dialysisSeats} seats available
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}