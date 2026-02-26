import React from "react";
import { User, Mail, Phone, MapPin, Calendar } from "lucide-react";

export default function PersonalInfoSection({ personalInfo }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-300 p-6 shadow-md hover:shadow-lg hover:border-blue-300 transition-all duration-300">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <User size={20} className="text-blue-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-xs text-gray-600 font-semibold mb-1">Full Name</p>
          <p className="text-sm font-bold text-gray-900">{personalInfo.fullName}</p>
        </div>

        {/* Email */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <Mail size={14} className="text-gray-600" />
            <p className="text-xs text-gray-600 font-semibold">Email</p>
          </div>
          <p className="text-sm font-bold text-gray-900 truncate">
            {personalInfo.email}
          </p>
        </div>

        {/* Mobile Number */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <Phone size={14} className="text-gray-600" />
            <p className="text-xs text-gray-600 font-semibold">Mobile Number</p>
          </div>
          <p className="text-sm font-bold text-gray-900">{personalInfo.mobileNumber}</p>
        </div>

        {/* Date of Birth */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <Calendar size={14} className="text-gray-600" />
            <p className="text-xs text-gray-600 font-semibold">Date of Birth</p>
          </div>
          <p className="text-sm font-bold text-gray-900">{personalInfo.dateOfBirth}</p>
        </div>
      </div>
    </div>
  );
}