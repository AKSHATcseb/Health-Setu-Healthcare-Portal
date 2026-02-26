import React from "react";
import { Filter, AlertCircle } from "lucide-react";
import HospitalCard from "./HospitalCard";

export default function HospitalList({ hospitals, selectedDate, selectedTime }) {
  if (hospitals.length === 0) {
    return (
      <div className="bg-white rounded-3xl border-2 border-gray-300 p-12 text-center shadow-xl hover:shadow-2xl transition-all duration-300">
        <Filter size={56} className="mx-auto text-blue-300 mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Hospitals Found</h3>
        <p className="text-gray-600 font-medium mb-8">Try adjusting your filters to find available hospitals</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-teal-500 hover:shadow-lg transition-all hover:scale-105"
        >
          Reset Filters
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 text-gray-700 font-semibold bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
        <AlertCircle size={20} className="text-blue-600 flex-shrink-0" />
        <span>Found <span className="text-blue-700 font-bold">{hospitals.length}</span> hospitals matching your criteria</span>
      </div>
      {hospitals.map(hospital => (
        <HospitalCard 
          key={hospital.id} 
          hospital={hospital} 
          selectedDate={selectedDate}
          selectedTime={selectedTime}
        />
      ))}
    </div>
  );
}