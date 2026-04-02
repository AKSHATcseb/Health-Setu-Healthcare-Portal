import React from "react";
import { MapPin, Phone, Clock, Droplet, Edit2, Wallet2 } from "lucide-react";
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
        {/* Registration Number */}
        <div className="flex items-start gap-3 pb-3 border-b border-gray-200">
          <MapPin size={18} className="text-red-600 flex-shrink-0 mt-1" />
          <div>
            <p className="text-xs text-gray-600 font-semibold mb-1">Registration Number</p>
            <p className="text-sm text-gray-900">{hospitalInfo.registrationNumber}</p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start gap-3 pb-3 border-b border-gray-200">
          <MapPin size={18} className="text-red-600 flex-shrink-0 mt-1" />
          <div>
            <p className="text-xs text-gray-600 font-semibold mb-1">Address</p>
            <p className="text-sm text-gray-900">{hospitalInfo.address}</p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start gap-3 pb-3 border-b border-gray-200">
          <Phone size={18} className="text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <p className="text-xs text-gray-600 font-semibold mb-1">Email</p>
            <p className="text-sm text-gray-900">{hospitalInfo.email}</p>
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

        <div className="flex items-start gap-3">
          <Droplet size={18} className="text-red-600 flex-shrink-0 mt-1" />
          <div>
            <p className="text-xs text-gray-600 font-semibold mb-1">Dialysis Seats</p>
            <p className="text-sm text-gray-900">
              {hospitalInfo.dialysisType} 
            </p>
          </div>
        </div>

        {/* Operating Status */}
        <div className="flex items-start gap-3 pb-3 border-b border-gray-200">
          <Clock size={18} className="text-green-600 flex-shrink-0 mt-1" />
          <div>
            <p className="text-xs text-gray-600 font-semibold mb-1">Operating Hours</p>
            <div className="text-sm text-gray-900">
              {/* 4 Hour Slots */}
              <div>
                <p className="font-semibold">4 Hour Slots:</p>
                {hospitalInfo.slots.slots4h.length > 0 ? (
                  hospitalInfo.slots.slots4h.map((slot, index) => (
                    <p key={index}>
                      {slot.start} - {slot.end}
                    </p>
                  ))
                ) : (
                  <p className="text-gray-400">No 4-hour slots available</p>
                )}
              </div>

              {/* 6 Hour Slots */}
              <div className="mt-2">
                <p className="font-semibold">6 Hour Slots:</p>
                {hospitalInfo.slots.slots6h.length > 0 ? (
                  hospitalInfo.slots.slots6h.map((slot, index) => (
                    <p key={index}>
                      {slot.start} - {slot.end}
                    </p>
                  ))
                ) : (
                  <p className="text-gray-400">No 6-hour slots available</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Prices */}
        <div className="flex items-start gap-3 pb-3 border-b border-gray-200">
          <Droplet size={18} className="text-red-600 flex-shrink-0 mt-1" />
          <div>
            <p className="text-xs text-gray-600 font-semibold mb-1">Dialysis Seats</p>
              {hospitalInfo.priceFor4Hrs && (
                <p>4 Hour Slot Price: ₹{hospitalInfo.priceFor4Hrs}</p>
              )}
              {hospitalInfo.priceFor6Hrs && (
                <p>6 Hour Slot Price: ₹{hospitalInfo.priceFor6Hrs}</p>
              )}
              {hospitalInfo.priceForPD && (
                <p>Price for Peritoneal Dialysis: ₹{hospitalInfo.priceForPD}</p>
              )}
          </div>
        </div>

        {/* Dialysis Seats */}
        <div className="flex items-start gap-3 pb-3 border-b border-gray-200">
          <Droplet size={18} className="text-red-600 flex-shrink-0 mt-1" />
          <div>
            <p className="text-xs text-gray-600 font-semibold mb-1">Dialysis Seats</p>
            <p className="text-sm text-gray-900">
              {hospitalInfo.dialysisSeats} seats available
            </p>
          </div>
        </div>

        {/* Account Holder details */}
        <div className="flex items-start gap-3 pb-3 border-b border-gray-200">
          <Wallet2 size={18} className="text-sky-800 flex-shrink-0 mt-1" />
          <div>
            <p className="text-xs text-gray-600 font-semibold mb-1">Account Holder</p>
            <p className="text-sm text-gray-900">
              {hospitalInfo.accountHolderName}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 pb-3 border-b border-gray-200">
          <Wallet2 size={18} className="text-sky-800 flex-shrink-0 mt-1" />
          <div>
            <p className="text-xs text-gray-600 font-semibold mb-1">Bank Name</p>
            <p className="text-sm text-gray-900">
              {hospitalInfo.bankName}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 pb-3 border-b border-gray-200">
          <Wallet2 size={18} className="text-sky-800 flex-shrink-0 mt-1" />
          <div>
            <p className="text-xs text-gray-600 font-semibold mb-1">Account Number</p>
            <p className="text-sm text-gray-900">
              {hospitalInfo.accountNumber}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 pb-3 border-b border-gray-200">
          <Wallet2 size={18} className="text-sky-800 flex-shrink-0 mt-1" />
          <div>
            <p className="text-xs text-gray-600 font-semibold mb-1">IFSC Code</p>
            <p className="text-sm text-gray-900">
              {hospitalInfo.ifscCode}
            </p>
          </div>
        </div>


      </div>
    </div>
  );
}