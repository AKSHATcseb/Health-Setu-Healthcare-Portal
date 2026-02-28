import React from "react";
import { LogOut, Settings, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HospitalDashboardHeader({ hospitalName, unreadNotifications = 0 }) {
  const navigate = useNavigate();

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-6 bg-gradient-to-r from-blue-600 via-teal-500 to-blue-700 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">
              {hospitalName}
            </h1>
            <p className="text-white/90 text-sm sm:text-base font-medium">
              Hospital Management Dashboard
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="relative p-2 bg-white/20 backdrop-blur-lg rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-300 text-white">
              <Bell size={20} />
              {unreadNotifications > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {/* Settings */}
            <button
              onClick={() => navigate("/hospital-settings")}
              className="p-2 bg-white/20 backdrop-blur-lg rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-300 text-white"
            >
              <Settings size={20} />
            </button>

            {/* Logout */}
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to logout?")) {
                  navigate("/hospital-login");
                }
              }}
              className="p-2 bg-white/20 backdrop-blur-lg rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-300 text-white"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}