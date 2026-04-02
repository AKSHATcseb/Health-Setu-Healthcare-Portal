import React from "react";
import { User, Mail, Phone, FileText } from "lucide-react";

export default function PatientInfo({ patientData }) {
  // console.log("Received patient data in PatientInfo:", patientData);

  return (
    <div className="rounded-xl p-7 mb-4 shadow-md">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <User size={22} className="text-blue-600" />
        Patient Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <p className="text-sm text-gray-600 font-semibold mb-1">Full Name</p>
          <p className="text-lg font-semibold text-gray-900">{patientData.fullName}</p>
        </div>

        {/* Age */}
        <div>
          <p className="text-sm text-gray-600 font-semibold mb-1">Age</p>
          <p className="text-lg font-semibold text-gray-900">{patientData.age} years</p>
        </div>

        {/* Email */}
        <div>
          <p className="text-sm text-gray-600 font-semibold mb-1 flex items-center gap-2">
            <Mail size={16} /> Email
          </p>
          <p className="text-lg font-semibold text-gray-900">{patientData.email}</p>
        </div>

        {/* Phone */}
        <div>
          <p className="text-sm text-gray-600 font-semibold mb-1 flex items-center gap-2">
            <Phone size={16} /> Phone
          </p>
          <p className="text-lg font-semibold text-gray-900">{patientData.mobileNumber}</p>
        </div>
      </div>
    </div>
  );
}