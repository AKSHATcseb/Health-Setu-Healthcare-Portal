import React from "react";
import { FileText, Calendar } from "lucide-react";

export default function MedicalHistorySection({ medicalHistory }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-300 p-6 shadow-md hover:shadow-lg hover:border-blue-300 transition-all duration-300">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
          <FileText size={20} className="text-indigo-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Medical History</h2>
      </div>

      <div className="space-y-3">
        {medicalHistory && medicalHistory.length > 0 ? (
          medicalHistory.map((record, index) => (
            <div
              key={index}
              className="bg-indigo-50 rounded-lg p-4 border border-indigo-200 hover:border-indigo-300 transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-bold text-indigo-900">
                  {record.condition}
                </h3>
                <div className="flex items-center gap-1 text-xs text-indigo-700">
                  <Calendar size={12} />
                  {record.date}
                </div>
              </div>
              <p className="text-xs text-indigo-800">
                {record.description}
              </p>
            </div>
          ))
        ) : (
          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200 text-center">
            <p className="text-sm text-indigo-700">No medical history added</p>
          </div>
        )}
      </div>
    </div>
  );
}