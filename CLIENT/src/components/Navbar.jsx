import React, { useState } from "react";
import { Menu, X, Heart } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/images/logo.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id) => {
    // If already on landing page
    if (location.pathname === "/") {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Navigate first, then scroll
      navigate("/");

      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
    }

    setOpen(false); // close mobile menu
  };

  return (
    <nav className="w-full py-2 sticky top-0 z-50 bg-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-4">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <div
      onClick={() => navigate("/")}
      className="flex items-center gap-2 cursor-pointer"
    >
      <div className="w-10 h-10 rounded-full overflow-hidden bg-white">
        <img
          src={logo}
          alt="HealthSetu"
          className="w-full h-full object-contain"
        />
      </div>

      <h1 className="font-bold text-lg sm:text-2xl text-blue-700">
        HealthSetu
      </h1>
    </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-12">
            <button onClick={() => scrollToSection("features")}>
              Features
            </button>
            <button onClick={() => scrollToSection("howitworks")}>
              How It Works
            </button>
            <button onClick={() => scrollToSection("contact")}>
              Contact
            </button>
          </div>

          {/* Buttons */}
          <div className="hidden lg:flex gap-4">
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 bg-slate-800 text-white rounded-full hover:bg-slate-950 cursor-pointer transition"
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
          <div className="lg:hidden mt-4 space-y-3 border-b-2 border-slate-300 pb-4">
            <button
              onClick={() => scrollToSection("features")}
              className="block w-full text-center hover:text-slate-500"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("howitworks")}
              className="block w-full text-center"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="block w-full text-center"
            >
              Contact
            </button>

            <div className="flex flex-col gap-3 pt-3"> 
              <button className="w-full px-6 py-2 bg-slate-900 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-blue-200 hover:scale-105 transition-all duration-300"> 
                Sign In 
              </button> 
            </div>

          </div>

        )}
      </div>
    </nav>
  );
}