import React, { useState, useRef, useEffect } from "react";
import { Menu, X, LogOut, User, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * Navbar (dark / charcoal redesign)
 *
 * - Preserves props: user, onLogout, onUpdateProfile
 * - No logic changes; only styling/markup updated for a professional dark look
 * - Responsive: compact mobile menu, full desktop menu with account dropdown
 */
export default function Navbar({ user = { name: "Patient", email: "" }, onLogout, onUpdateProfile }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdown, setAccountDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // close dropdown on outside click
  useEffect(() => {
    function handleOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setAccountDropdown(false);
      }
    }
    window.addEventListener("mousedown", handleOutside);
    return () => window.removeEventListener("mousedown", handleOutside);
  }, []);

  const initial = (user?.name && user.name.length > 0) ? user.name.charAt(0).toUpperCase() : "P";

  return (
    <nav
      className="w-full sticky top-0 z-50 bg-slate-200 py-2"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between py-3">
          {/* Logo / Brand */}
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-500 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:shadow-blue-200 transition-all duration-300">
              <Heart size={20} className="text-white fill-white" />
            </div>
            <h1 className="font-bold text-lg sm:text-2xl bg-gradient-to-r from-blue-700 to-teal-600 bg-clip-text text-transparent">
              HealthSetu
            </h1>
          </div>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-8">
            <a href="#appointments" className="text-slate-600 font-medium hover:text-blue-950 transition-colors duration-300">
              Appointments
            </a>
            <a href="#history" className="text-slate-600 font-medium hover:text-blue-950 transition-colors duration-300">
              History
            </a>
            <a href="#reports" className="text-slate-600 font-medium hover:text-blue-950 transition-colors duration-300">
              Reports
            </a>
            <a href="#payments" className="text-slate-600 font-medium hover:text-blue-950 transition-colors duration-300">
              Payments
            </a>
          </div>

          {/* Right: account / actions */}
          <div className="flex items-center gap-3">
            {/* Desktop account */}
            <div className="hidden lg:block relative" ref={dropdownRef}>
              <button
                onClick={() => setAccountDropdown((v) => !v)}
                aria-expanded={accountDropdown}
                aria-haspopup="menu"
                className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 transition"
                title="Account menu"
              >
                <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-white font-semibold">
                  {initial}
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-slate-900 leading-none">{user?.name || "Patient"}</div>
                  <div className="text-xs text-slate-900 leading-none">{user?.email || ""}</div>
                </div>
              </button>

              {accountDropdown && (
                <div
                  className="absolute right-0 mt-3 w-64 bg-[#0b1220] border border-white/6 rounded-lg shadow-2xl overflow-hidden z-50"
                  role="menu"
                >
                  <div className="px-4 py-3 border-b border-white/6">
                    <p className="text-sm font-semibold text-white">{user?.name || "Patient"}</p>
                    <p className="text-xs text-white/60 truncate">{user?.email || ""}</p>
                  </div>

                  <button
                    onClick={() => {
                      onUpdateProfile && onUpdateProfile();
                      setAccountDropdown(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-white/6 transition flex items-center gap-3 text-white"
                    role="menuitem"
                  >
                    <User size={16} className="text-white/80" />
                    Update profile
                  </button>

                  <button
                    onClick={() => {
                      onLogout && onLogout();
                      setAccountDropdown(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-red-700/20 transition flex items-center gap-3 text-rose-300 border-t border-white/6"
                    role="menuitem"
                  >
                    <LogOut size={16} className="text-rose-300" />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile account / menu */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen((v) => !v)}
                aria-label="Toggle menu"
                className="p-2 rounded-md bg-white/6 hover:bg-white/10 transition"
              >
                {mobileMenuOpen ? <X size={20} className="text-white" /> : <Menu size={20} className="text-white" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 pb-4 border-t border-white/6">
            <div className="py-3 grid gap-2">
              <a href="#appointments" className="block px-3 py-2 rounded-md text-white hover:bg-white/6">Appointments</a>
              <a href="#history" className="block px-3 py-2 rounded-md text-white/80 hover:bg-white/6">History</a>
              <a href="#reports" className="block px-3 py-2 rounded-md text-white/80 hover:bg-white/6">Reports</a>
              <a href="#payments" className="block px-3 py-2 rounded-md text-white/80 hover:bg-white/6">Payments</a>

              <div className="mt-2 border-t border-white/6 pt-3">
                <button
                  onClick={() => {
                    onUpdateProfile && onUpdateProfile();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-white hover:bg-white/6 flex items-center gap-3"
                >
                  <User size={16} className="text-white/80" /> Update profile
                </button>

                <button
                  onClick={() => {
                    onLogout && onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left mt-2 px-3 py-2 rounded-md text-rose-300 hover:bg-rose-900/10 flex items-center gap-3"
                >
                  <LogOut size={16} className="text-rose-300" /> Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}