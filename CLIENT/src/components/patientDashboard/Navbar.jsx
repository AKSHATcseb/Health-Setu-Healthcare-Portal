import React, { useState } from "react";
import { Menu, X, LogOut, User, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ user, onLogout, onUpdateProfile }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdown, setAccountDropdown] = useState(false);

  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" 
            onClick={() => navigate("/patient/dashboard")}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-500 rounded-full flex items-center justify-center shadow-md">
              <Heart size={20} className="text-white fill-white" />
            </div>
            <h1 className="font-bold text-xl bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent hidden sm:block">
              HealthSetu
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-12">
            <a href="#appointments" className="text-gray-700 font-medium hover:text-blue-600 transition-colors">
              Appointments
            </a>
            <a href="#history" className="text-gray-700 font-medium hover:text-blue-600 transition-colors">
              History
            </a>
            <a href="#reports" className="text-gray-700 font-medium hover:text-blue-600 transition-colors">
              Reports
            </a>
            <a href="#payments" className="text-gray-700 font-medium hover:text-blue-600 transition-colors">
              Payments
            </a>
          </div>

          {/* Account Dropdown */}
          <div className="hidden lg:block relative">
            <button
              onClick={() => setAccountDropdown(!accountDropdown)}
              className="flex items-center gap-3 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {user.name.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-600">{user.email}</p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {accountDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-600">{user.email}</p>
                </div>
                
                <button
                  onClick={() => {
                    onUpdateProfile();
                    setAccountDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 flex items-center gap-3 font-medium"
                >
                  <User size={18} className="text-blue-600" />
                  Update Profile
                </button>

                <button
                  onClick={() => {
                    onLogout();
                    setAccountDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 text-red-700 hover:bg-red-50 flex items-center gap-3 font-medium border-t border-gray-200"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-gray-200 space-y-3">
            <a href="#appointments" className="block text-gray-700 font-medium hover:text-blue-600 py-2">
              Appointments
            </a>
            <a href="#history" className="block text-gray-700 font-medium hover:text-blue-600 py-2">
              History
            </a>
            <a href="#reports" className="block text-gray-700 font-medium hover:text-blue-600 py-2">
              Reports
            </a>
            <a href="#payments" className="block text-gray-700 font-medium hover:text-blue-600 py-2">
              Payments
            </a>
            <div className="border-t border-gray-200 pt-3 space-y-2">
              <button
                onClick={() => {
                  onUpdateProfile();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-lg font-medium flex items-center gap-2"
              >
                <User size={18} className="text-blue-600" />
                Update Profile
              </button>
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-red-700 hover:bg-red-50 rounded-lg font-medium flex items-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}