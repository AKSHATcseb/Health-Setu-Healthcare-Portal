import React from "react";
import { MapPin, Phone, Clock, Award } from "lucide-react";

export default function HospitalDetails({ hospitalData }) {
  // console.log("Rendering HospitalDetails with data:", hospitalData);
  return (
    <div className="rounded-xl p-7 mb-4 shadow-md">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Award size={22} className="text-green-600" />
        Hospital Information
      </h3>

      <div className="space-y-4">
        {/* Hospital Name and Rating */}
        <div >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-2xl font-bold text-gray-900">{hospitalData.hospitalName}</p>
            </div>
            <div className="text-right">
              {/* <p className="text-sm text-gray-600 mb-1">Rating</p> */}
              {/* <div className="flex items-center justify-end gap-1">
                <span className="text-2xl font-bold text-yellow-500">★</span>
                <p className="text-xl font-bold text-gray-900">{hospitalData.rating}</p>
              </div> */}
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="flex gap-4 items-start">
          <MapPin size={20} className="text-red-500 flex-shrink-0 mt-1" />
          <div>
            <p className="text-sm text-gray-600 font-semibold mb-1">Address</p>
            <p className="text-gray-700">{hospitalData.address}</p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex gap-4 items-start">
          <Phone size={20} className="text-blue-500 flex-shrink-0 mt-1" />
          <div>
            <p className="text-sm text-gray-600 font-semibold mb-1">Contact</p>
            <p className="text-gray-700">{hospitalData.phone}</p>
          </div>
        </div>

        {/* Operating Hours */}
        {/* <div className="flex gap-4 items-start">
          <Clock size={20} className="text-orange-500 flex-shrink-0 mt-1" />
          <div>
            <p className="text-sm text-gray-600 font-semibold mb-1">Operating Hours</p>
            <p className="text-gray-700">{hospitalData.hours}</p>
          </div>
        </div> */}

        {/* Description */}
        {/* <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200 mt-4">
          <p className="text-sm text-blue-900">{hospitalData.description}</p>
        </div> */}
      </div>
    </div>
  );
}