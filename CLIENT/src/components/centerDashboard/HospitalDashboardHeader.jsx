import React from "react";
import { LogOut, CircleUser } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HospitalDashboardHeader({ hospitalName, unreadNotifications = 0 }) {
  const navigate = useNavigate();

  return (
    <section className="w-full px-5 sm:px-6 lg:px-8 py-10 bg-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center justify-between ">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              {hospitalName}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Logout */}
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to logout?")) {
                  navigate("/login");
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