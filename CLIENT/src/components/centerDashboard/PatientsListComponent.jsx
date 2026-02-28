import React from "react";
import { Mail, Phone, MapPin, Edit2, Trash2 } from "lucide-react";

export default function PatientsListComponent({ patients, onEdit, onDelete }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-300 p-6 shadow-md hover:shadow-lg hover:border-blue-300 transition-all duration-300">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Patients</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left px-4 py-3 font-bold text-gray-900">
                Patient Name
              </th>
              <th className="text-left px-4 py-3 font-bold text-gray-900">
                Contact
              </th>
              <th className="text-left px-4 py-3 font-bold text-gray-900">
                Blood Group
              </th>
              <th className="text-left px-4 py-3 font-bold text-gray-900">
                Last Visit
              </th>
              <th className="text-center px-4 py-3 font-bold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {patients && patients.length > 0 ? (
              patients.map((patient, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    {patient.name}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    <div className="flex items-center gap-1">
                      <Phone size={14} className="text-gray-600" />
                      {patient.phone}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 bg-red-100 text-red-700 font-bold rounded-full text-xs">
                      {patient.bloodGroup}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {formatDate(patient.lastVisit)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEdit(patient.id)}
                        className="p-2 hover:bg-blue-100 rounded-lg transition text-blue-600"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(patient.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-gray-600">
                  No patients found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}