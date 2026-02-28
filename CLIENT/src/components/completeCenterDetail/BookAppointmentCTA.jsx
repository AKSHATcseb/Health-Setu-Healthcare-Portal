import React from "react";
import { Calendar, Phone, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BookAppointmentCTA({ hospitalId, hospitalName }) {
  const navigate = useNavigate();

  const handleBookAppointment = () => {
    navigate(`/book-appointment/${hospitalId}`, { state: { hospitalName } });
  };

  const handleCallHospital = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white border-t-2 border-gray-300 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Book Appointment */}
          <button
            onClick={handleBookAppointment}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 sm:col-span-2"
          >
            <Calendar size={18} />
            Book Appointment
          </button>

          {/* Call Hospital */}
          <button
            onClick={() => handleCallHospital("+1 (555) 123-4567")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105"
          >
            <Phone size={18} />
            Call Now
          </button>
        </div>

        {/* Additional Options */}
        <div className="mt-3 grid grid-cols-2 gap-3 sm:hidden">
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition text-sm">
            <MessageCircle size={16} />
            Message
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition text-sm">
            📍 Directions
          </button>
        </div>
      </div>
    </div>
  );
}