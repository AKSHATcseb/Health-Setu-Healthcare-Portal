import React from "react";
import { Calendar, Clock, User, MapPin, Phone } from "lucide-react";

export default function RecentAppointments() {
  const appointments = [
    {
      id: 1,
      doctorName: "Dr. Rajesh Kumar",
      hospital: "Apollo Hospitals",
      date: "Dec 28, 2024",
      time: "02:30 PM",
      status: "Upcoming",
      location: "New Delhi",
      specialty: "Nephrologist",
    },
    {
      id: 2,
      doctorName: "Dr. Priya Sharma",
      hospital: "Max Healthcare",
      date: "Dec 15, 2024",
      time: "10:00 AM",
      status: "Completed",
      location: "Mumbai",
      specialty: "Cardiologist",
    },
    {
      id: 3,
      doctorName: "Dr. Amit Patel",
      hospital: "Fortis Hospital",
      date: "Nov 28, 2024",
      time: "03:00 PM",
      status: "Completed",
      location: "Bangalore",
      specialty: "General Physician",
    },
  ];

  return (
    <section className="w-full px-4 sm:px-6 lg:px-12 py-8 sm:py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto">
        
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Recent Appointments</h2>
        <p className="text-gray-700 font-medium mb-8">Your appointment history and upcoming visits</p>

        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className={`bg-white rounded-xl p-6 border-2 ${appointment.status === "Upcoming" ? "border-blue-600 bg-gradient-to-r from-blue-50 to-white" : "border-gray-400 bg-gradient-to-r from-gray-50 to-white"} shadow-lg hover:shadow-xl transition-shadow duration-300`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
                
                {/* Doctor Info */}
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${appointment.status === "Upcoming" ? "from-blue-600 to-teal-500" : "from-gray-500 to-gray-600"} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                    {appointment.doctorName.charAt(4)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{appointment.doctorName}</p>
                    <p className="text-sm text-gray-700 font-semibold mt-1">{appointment.specialty}</p>
                    <p className="text-xs text-gray-600">{appointment.hospital}</p>
                  </div>
                </div>

                {/* Date & Time */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                    <Calendar size={16} className="text-blue-700" />
                    {appointment.date}
                  </p>
                  <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Clock size={16} className="text-teal-700" />
                    {appointment.time}
                  </p>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-gray-800 font-semibold">
                  <MapPin size={18} className="text-orange-600" />
                  <span className="text-sm sm:text-base">{appointment.location}</span>
                </div>

                {/* Status */}
                <div>
                  <span className={`inline-block px-4 py-2 rounded-full text-xs sm:text-sm font-bold shadow-md ${
                    appointment.status === "Upcoming"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-500 text-white"
                  }`}>
                    {appointment.status}
                  </span>
                </div>

                {/* Action */}
                <div className="flex justify-end">
                  <button className={`px-4 py-2 rounded-lg font-bold transition-all shadow-md hover:shadow-lg text-sm ${
                    appointment.status === "Upcoming"
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-600 text-white hover:bg-gray-700"
                  }`}>
                    {appointment.status === "Upcoming" ? "Reschedule" : "View Details"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}