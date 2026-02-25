import React, { useState } from "react";
import { Menu, X, Heart } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-500 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:shadow-blue-200 transition-all duration-300">
              <Heart size={20} className="text-white fill-white" />
            </div>
            <h1 className="font-bold text-lg sm:text-2xl bg-gradient-to-r from-blue-700 to-teal-600 bg-clip-text text-transparent">
              HealthSetu
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <a href="#features" className="text-gray-700 font-medium hover:text-blue-600 transition-colors duration-300">
              Features
            </a>
            <a href="#howitworks" className="text-gray-700 font-medium hover:text-blue-600 transition-colors duration-300">
              How It Works
            </a>
            <a href="#testimonials" className="text-gray-700 font-medium hover:text-blue-600 transition-colors duration-300">
              Testimonials
            </a>
            <a href="#contact" className="text-gray-700 font-medium hover:text-blue-600 transition-colors duration-300">
              Contact
            </a>
          </div>

          {/* Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <button className="px-6 py-2 text-blue-600 font-semibold border-2 border-blue-600 rounded-full hover:bg-blue-50 transition-all duration-300">
              Sign In
            </button>
            <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-blue-200 hover:scale-105 transition-all duration-300">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {open ? <X size={24} className="text-gray-700" /> : <Menu size={24} className="text-gray-700" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <a href="#features" className="block text-gray-700 font-medium hover:text-blue-600 py-2">
              Features
            </a>
            <a href="#howitworks" className="block text-gray-700 font-medium hover:text-blue-600 py-2">
              How It Works
            </a>
            <a href="#testimonials" className="block text-gray-700 font-medium hover:text-blue-600 py-2">
              Testimonials
            </a>
            <a href="#contact" className="block text-gray-700 font-medium hover:text-blue-600 py-2">
              Contact
            </a>
            <div className="flex flex-col gap-3 pt-3">
              <button className="w-full px-6 py-2 text-blue-600 font-semibold border-2 border-blue-600 rounded-full hover:bg-blue-50">
                Sign In
              </button>
              <button className="w-full px-6 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold rounded-full hover:shadow-lg">
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}