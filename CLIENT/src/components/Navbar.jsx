import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/images/logo.svg";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id) => {
    if (location.pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
    setOpen(false);
  };

  return (
    <nav className="w-full sticky top-0 z-50 
    backdrop-blur-xl 
    bg-slate-200 
    border-b border-white/20
    shadow-sm">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <img
              src={logo}
              alt="HealthSetu"
              className="w-14 h-14 sm:w-16 sm:h-16"
            />

            <span className="
            text-2xl font-semibold
            bg-gradient-to-l from-blue-800 to-emerald-700 
            bg-clip-text text-transparent">
              HealthSetu
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-10 text-slate-700 font-medium">
            <button onClick={() => scrollToSection("features")} className="hover:text-blue-600 transition">
              Features
            </button>

            <button onClick={() => scrollToSection("howitworks")} className="hover:text-blue-600 transition">
              How it works
            </button>

            <button onClick={() => scrollToSection("contact")} className="hover:text-blue-600 transition">
              Contact
            </button>
          </div>

          {/* Sign in */}
          <div className="hidden lg:flex">
            <button
              onClick={() => navigate("/login")}
              className="
              cursor-pointer
              px-6 py-2.5
              rounded-full
              bg-gradient-to-r from-slate-600 via-slate-800 to-slate-900
              backdrop-blur-md
              border border-white/40
              hover:bg-slate-100
              text-slate-200
              font-medium
              shadow-sm
              transition
              "
            >
              Sign In
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="
          lg:hidden 
          mt-2 
          p-4 
          rounded-2xl 
          bg-slate-200
          backdrop-blur-xl 
          border border-white/30
          space-y-4">

            <button onClick={() => scrollToSection("features")} className="block w-full text-left">
              Features
            </button>

            <button onClick={() => scrollToSection("howitworks")} className="block w-full text-left">
              How it works
            </button>

            <button onClick={() => scrollToSection("contact")} className="block w-full text-left">
              Contact
            </button>

            <button
              onClick={() => navigate("/login")}
              className="cursor-pointer w-full py-3 rounded-full bg-slate-800 text-white"
            >
              Sign In
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}