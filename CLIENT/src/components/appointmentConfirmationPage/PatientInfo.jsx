import React from "react";
import { User, Mail, Phone, FileText } from "lucide-react";

export default function PatientInfo({ patient }) {
  return (
    <div className="bg-white rounded-3xl border-2 border-gray-300 p-7 mb-8 shadow-xl hover:shadow-2xl transition-all duration-300">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <User size={22} className="text-blue-600" />
        Patient Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
          <p className="text-sm text-gray-600 font-semibold mb-1">Full Name</p>
          <p className="text-lg font-bold text-gray-900">{patient.fullName}</p>
        </div>

        {/* Age */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
          <p className="text-sm text-gray-600 font-semibold mb-1">Age</p>
          <p className="text-lg font-bold text-gray-900">{patient.age} years</p>
        </div>

        {/* Email */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 md:col-span-2">
          <p className="text-sm text-gray-600 font-semibold mb-1 flex items-center gap-2">
            <Mail size={16} /> Email
          </p>
          <p className="text-lg font-bold text-gray-900">{patient.email}</p>
        </div>

        {/* Phone */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 md:col-span-2">
          <p className="text-sm text-gray-600 font-semibold mb-1 flex items-center gap-2">
            <Phone size={16} /> Phone
          </p>
          <p className="text-lg font-bold text-gray-900">{patient.phone}</p>
        </div>

        {/* Medical History */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 md:col-span-2">
          <p className="text-sm text-gray-600 font-semibold mb-2 flex items-center gap-2">
            <FileText size={16} /> Medical Notes
          </p>
          <p className="text-gray-700">{patient.medicalNotes || "No notes provided"}</p>
        </div>
      </div>
    </div>
  );
}