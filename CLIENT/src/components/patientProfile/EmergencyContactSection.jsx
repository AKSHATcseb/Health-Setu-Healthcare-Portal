import React from "react";
import { Phone, AlertTriangle, User } from "lucide-react";

export default function EmergencyContactSection({ emergencyContact }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-300 p-6 shadow-md hover:shadow-lg hover:border-blue-300 transition-all duration-300">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
          <AlertTriangle size={20} className="text-red-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Emergency Contact</h2>
      </div>

      <div className="bg-red-50 rounded-lg border-2 border-red-200 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Contact Name */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <User size={14} className="text-red-600" />
              <p className="text-xs text-red-700 font-semibold">Contact Name</p>
            </div>
            <p className="text-sm font-bold text-red-900">
              {emergencyContact.name || "Not provided"}
            </p>
          </div>

          {/* Relationship */}
          <div>
            <p className="text-xs text-red-700 font-semibold mb-1">Relationship</p>
            <p className="text-sm font-bold text-red-900">
              {emergencyContact.relationship || "Not provided"}
            </p>
          </div>

          {/* Phone Number */}
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2 mb-1">
              <Phone size={14} className="text-red-600" />
              <p className="text-xs text-red-700 font-semibold">Phone Number</p>
            </div>
            <p className="text-sm font-bold text-red-900">
              {emergencyContact.phone || "Not provided"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}