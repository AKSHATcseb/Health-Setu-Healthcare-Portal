import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Phone, Users, Star, Clock, CheckCircle, ArrowRight, AlertCircle, Calendar } from "lucide-react";

export default function HospitalCard({ hospital, selectedDate, selectedTime }) {
  const navigate = useNavigate();
  const [bookingError, setBookingError] = useState("");

  // Time Constraints & Validation Function
  const validateBooking = () => {
    const errors = [];

    if (!selectedDate) {
      errors.push("Please select a date");
      return errors;
    }

    if (!selectedTime) {
      errors.push("Please select a time slot");
      return errors;
    }

    const selectedDateObj = new Date(selectedDate);
    const now = new Date();
    const hoursUntilAppointment = (selectedDateObj - now) / (1000 * 60 * 60);

    if (hoursUntilAppointment < 24) {
      errors.push("Book appointments at least 24 hours in advance");
    }

    if (hoursUntilAppointment > 24 * 180) {
      errors.push("Cannot book more than 6 months in advance");
    }

    if (selectedDateObj < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
      errors.push("Cannot book appointments in the past");
    }

    const [timeHour] = selectedTime.split(":").map(Number);
    const ampm = selectedTime.includes("PM") ? "PM" : "AM";
    let hour = timeHour;
    if (ampm === "PM" && timeHour !== 12) hour += 12;
    if (ampm === "AM" && timeHour === 12) hour = 0;

    if (hour < 6 || hour > 22) {
      errors.push("Hospital operates from 6:00 AM to 10:00 PM");
    }

    const sessionEndHour = hour + 4;
    if (sessionEndHour > 22) {
      errors.push("Session would extend beyond operating hours. Choose an earlier time.");
    }

    return errors;
  };

  const handleBookAppointment = () => {
    const errors = validateBooking();

    if (errors.length > 0) {
      setBookingError(errors[0]);
      return;
    }

    navigate(`/patient/confirm-appointment/${hospital.id}?date=${selectedDate}&time=${selectedTime}`);
  };

  const isBookingDisabled = !selectedDate || !selectedTime;

  return (
    <div className="group bg-white rounded-3xl border-2 border-gray-300 shadow-lg hover:shadow-2xl hover:border-blue-400 transition-all duration-300 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 lg:p-8">
        
        {/* Hospital Image */}
        <div className="md:col-span-1 relative overflow-hidden rounded-2xl">
          <img
            src={hospital.image}
            alt={hospital.name}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {hospital.verified && (
            <div className="absolute top-3 right-3 bg-green-500 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 text-white text-xs font-bold shadow-lg">
              <CheckCircle size={14} />
              Verified
            </div>
          )}
        </div>

        {/* Hospital Info */}
        <div className="md:col-span-2">
          <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">{hospital.name}</h3>
          
          <div className="space-y-2.5 mb-6">
            <p className="flex items-center gap-2 text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
              <MapPin size={18} className="text-orange-600 flex-shrink-0" />
              {hospital.address}
            </p>
            <p className="flex items-center gap-2 text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
              <Phone size={18} className="text-blue-600 flex-shrink-0" />
              {hospital.phone}
            </p>
            <p className="flex items-center gap-2 text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
              <Users size={18} className="text-teal-600 flex-shrink-0" />
              {hospital.dialysisUnits} Dialysis Units
            </p>
            <p className="flex items-center gap-2 text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
              <Clock size={18} className="text-purple-600 flex-shrink-0" />
              6:00 AM - 10:00 PM
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <span className="px-4 py-2 bg-blue-100 border border-blue-300 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-200 transition-colors">
              {hospital.experience}
            </span>
            <span className="px-4 py-2 bg-green-100 border border-green-300 text-green-700 rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-green-200 transition-colors">
              <Calendar size={14} />
              Book 24hrs ahead
            </span>
          </div>
        </div>

        {/* Right Side - Price, Rating & CTA */}
        <div className="md:col-span-1 flex flex-col justify-between">
          
          {/* Price */}
          <div className="mb-6 p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl hover:border-green-400 transition-colors">
            <p className="text-sm text-gray-600 font-semibold mb-1">Per Session (4 hrs)</p>
            <p className="text-3xl font-bold text-gray-900">
              <span className="text-lg text-gray-600">₹</span>{hospital.price}
            </p>
          </div>

          {/* Rating */}
          <div className="mb-6 p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl hover:border-yellow-400 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Star size={20} className="text-yellow-500 fill-yellow-500" />
              <span className="text-2xl font-bold text-gray-900">{hospital.rating}</span>
              <span className="text-xs text-gray-600">({hospital.reviews})</span>
            </div>
            <p className="text-xs text-gray-600 font-semibold">Highly Rated</p>
          </div>

          {/* Distance */}
          <div className="mb-6 p-4 bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-300 rounded-2xl hover:border-orange-400 transition-colors">
            <p className="text-sm text-gray-600 font-semibold mb-1">Distance</p>
            <p className="text-2xl font-bold text-gray-900">{hospital.distance} <span className="text-sm text-gray-600">km</span></p>
          </div>

          {/* Error Message */}
          {bookingError && (
            <div className="mb-4 p-3 bg-red-50 border-2 border-red-300 rounded-xl flex items-start gap-2">
              <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 font-semibold">{bookingError}</p>
            </div>
          )}

          {/* Book Button */}
          <button
            onClick={handleBookAppointment}
            disabled={isBookingDisabled}
            className="w-full px-4 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-teal-500 hover:shadow-xl hover:shadow-blue-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group"
          >
            <span>Book Now</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          {isBookingDisabled && (
            <p className="text-center text-xs text-gray-600 mt-2 font-medium">Select date & time first</p>
          )}
        </div>
      </div>
    </div>
  );
}