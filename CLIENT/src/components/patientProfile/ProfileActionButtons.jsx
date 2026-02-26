import React from "react";
import { Edit2, Download, LogOut } from "lucide-react";

export default function ProfileActionButtons({ onEdit, onDownload, onLogout }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-300 p-6 shadow-md">
      <h3 className="text-sm font-bold text-gray-900 mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Edit Profile */}
        <button
          onClick={onEdit}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold rounded-lg hover:shadow-md transition-all duration-300 hover:scale-105 text-sm"
        >
          <Edit2 size={16} />
          Edit Profile
        </button>

        {/* Download Records */}
        <button
          onClick={onDownload}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-md transition-all duration-300 hover:scale-105 text-sm"
        >
          <Download size={16} />
          Download Records
        </button>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:bg-gray-200 transition-all duration-300 hover:scale-105 text-sm"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}