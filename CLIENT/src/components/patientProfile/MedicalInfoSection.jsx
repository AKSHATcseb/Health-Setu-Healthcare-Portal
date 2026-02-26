import React from "react";
import { Heart, Droplet, Users, AlertCircle } from "lucide-react";

export default function MedicalInfoSection({ medicalInfo }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-300 p-6 shadow-md hover:shadow-lg hover:border-blue-300 transition-all duration-300">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <Heart size={20} className="text-green-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Medical Information</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Age */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-xs text-green-700 font-semibold mb-1">Age</p>
          <p className="text-xl font-bold text-green-900">{medicalInfo.age} years</p>
        </div>

        {/* Gender */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <p className="text-xs text-purple-700 font-semibold mb-1">Gender</p>
          <p className="text-lg font-bold text-purple-900">{medicalInfo.gender}</p>
        </div>

        {/* Blood Group */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <div className="flex items-center gap-2 mb-1">
            <Droplet size={14} className="text-red-600" />
            <p className="text-xs text-red-700 font-semibold">Blood Group</p>
          </div>
          <p className="text-2xl font-bold text-red-900">{medicalInfo.bloodGroup}</p>
        </div>

        {/* Dialysis Status */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-xs text-blue-700 font-semibold mb-1">Dialysis Status</p>
          <p className="text-sm font-bold text-blue-900">{medicalInfo.dialysisStatus}</p>
        </div>

        {/* Known Allergies */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200 sm:col-span-2">
          <div className="flex items-start gap-2 mb-1">
            <AlertCircle size={14} className="text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-700 font-semibold">Known Allergies</p>
          </div>
          <p className="text-sm text-yellow-900">
            {medicalInfo.allergies || "No allergies reported"}
          </p>
        </div>
      </div>
    </div>
  );
}