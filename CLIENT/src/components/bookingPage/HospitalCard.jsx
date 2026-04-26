import React from "react";
import { MapPin, Phone, Clock, Users, LocateIcon, HospitalIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HospitalCard({ hospital, pId, selectedDate }) {
  // console.log("Rendering HospitalCard with data:", hospital, "for patient:", pId, "and date:", selectedDate);
  const navigate = useNavigate();
  
  const handleBooking = () => {
  if (!selectedDate) {
    alert("Please select a date first");
    return;
  }

  const patientId = pId;       // from URL parameter
  const id = hospital?._id; // from hospital

  navigate(
    `/patient/${patientId}/confirmappointment/${id}`,
    {
      state: {
        hospital, // optional (for UI)
        appointment: {
          date: selectedDate,
        },
      },
    }
  );
};

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-5 border border-gray-200 w-full mb-2">

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* LEFT: IMAGE */}
        <div className="w-full h-40 md:h-full">
          <img
            src={hospital.image || "../../../public/service2.jpg"}
            alt={hospital.hospitalName}
            className="w-full h-full object-cover rounded-xl"
          />
        </div>

        {/* CENTER: DETAILS */}
        <div className="flex flex-col justify-between">

          <div className="space-y-2">

            {/* Address */}

            <div className="flex items-start gap-2 mb-4 text-gray-800 text-xl font-bold">
              <HospitalIcon size={20} className="text-orange-500 mt-1" />
              <p>{hospital.hospitalName}</p>
            </div>

            <div className="flex items-start gap-2 text-gray-800 text-sm">
              <LocateIcon size={16} className="text-orange-500 mt-1" />
              <p>{hospital.address}</p>
            </div>

            {hospital.distance && (
              <div className="flex items-start gap-2 text-gray-800 text-sm">
                <MapPin size={16} className="text-cyan-600 mt-1" />
                <p>{hospital.distance.toFixed(1)} km away</p>
              </div>
            )}

            {/* Phone */}
            <div className="flex items-center gap-2 text-gray-800 text-sm">
              <Phone size={16} className="text-blue-500" />
              <p>{hospital.phone || "N/A"}</p>
            </div>

            {/* Units */}
            <div className="flex items-center gap-2 text-gray-800 text-sm">
              <Users size={16} className="text-green-600" />
              <p>{hospital.dialysisType || "Dialysis Units"}</p>
            </div>

            {/* Timing */}
            {/* <div className="flex items-center gap-2 text-gray-700 text-sm">
              <Clock size={16} className="text-purple-500" />
              <p>{hospital.timing || "6:00 AM - 10:00 PM"}</p>
            </div> */}
          </div>

          {/* BUTTON */}
          <button className="mt-4 bg-green-100 text-green-700 font-semibold py-2 rounded-lg">
            📅 Book 24hrs ahead
          </button>
        </div>

        {/* RIGHT: STATS */}
        <div className="flex flex-col gap-4 mt-4 md:mt-0 justify-between">

          {/* 🔥 PRICE BOX */}
          <div className="border border-green-400 rounded-xl p-3 text-sm">

            {/* Hemodialysis (4h + 6h) */}
            {(hospital.dialysisType === "both" ||
              hospital.dialysisType === "hemodialysis") && (
                <>
                  <p className="text-gray-600">(4 hrs session)</p>
                  <p className="text-lg font-bold mb-2">
                    ₹{hospital.priceFor4Hrs || 0}
                  </p>

                  <p className="text-gray-600">(6 hrs session)</p>
                  <p className="text-lg font-bold mb-2">
                    ₹{hospital.priceFor6Hrs || 0}
                  </p>
                </>
              )}

            {/* Peritoneal */}
            {(hospital.dialysisType === "both" ||
              hospital.dialysisType === "peritoneal_dialysis") && (
                <>
                  <p className="text-gray-600">(Peritoneal Dialysis)</p>
                  <p className="text-lg font-bold">
                    ₹{hospital.priceForPD || 0}
                  </p>
                </>
              )}
          </div>

          {/* 🔥 STATS GRID (mobile friendly) */}
          <div className="grid grid-cols-2 gap-3">

            {/* Rating */}
            {/* <div className="border border-yellow-400 text-center rounded-xl p-3 text-sm">
      <p className="text-lg font-bold">{hospital.rating || 0}</p>
      <p>Highly Rated</p>
    </div> */}

          </div>

          {/* 🔥 BOOK BUTTON */}
          <button
            onClick={handleBooking}
            className="w-full bg-slate-800 text-white font-semibold py-2 rounded-xl hover:bg-slate-900 transition cursor-pointer"
          >
            Book Now
          </button>

        </div>

      </div>
    </div>
  );
}