import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin
} from "lucide-react";

import logo from "../assets/images/logo.svg";

export default function Footer() {
  return (
    <footer className="
    w-full 
    bg-slate-900
    border-t border-slate-700
    text-slate-300
    px-4 sm:px-6 lg:px-12 
    py-16
    ">
      <div className="max-w-7xl mx-auto">

        {/* Top */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={logo}
                alt="HealthSetu"
                className="w-12 h-12"
              />
              <span className="
              font-semibold 
              text-xl
              text-white">
                HealthSetu
              </span>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed mb-6">
              Connecting dialysis patients with trusted centers.
              AI powered care coordination for better outcomes.
            </p>

            <div className="flex gap-3">
              <a className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition">
                <Facebook size={18} />
              </a>

              <a className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition">
                <Twitter size={18} />
              </a>

              <a className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-white mb-4">
              Product
            </h4>

            <ul className="space-y-3 text-sm">
              <li className="hover:text-white cursor-pointer">Features</li>
              <li className="hover:text-white cursor-pointer">How it works</li>
              <li className="hover:text-white cursor-pointer">Pricing</li>
              <li className="hover:text-white cursor-pointer">Security</li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">
              Company
            </h4>

            <ul className="space-y-3 text-sm">
              <li className="hover:text-white cursor-pointer">About</li>
              <li className="hover:text-white cursor-pointer">Blog</li>
              <li className="hover:text-white cursor-pointer">Careers</li>
              <li className="hover:text-white cursor-pointer">Press</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">
              Contact
            </h4>

            <div className="space-y-4 text-sm">

              <div className="flex gap-3">
                <Mail size={18} />
                support@healthsetu.com
              </div>

              <div className="flex gap-3">
                <Phone size={18} />
                +91 98765 43210
              </div>

              <div className="flex gap-3">
                <MapPin size={18} />
                Delhi, India
              </div>

            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="
        bg-slate-800
        rounded-2xl 
        p-8 
        border border-slate-700
        mb-12
        ">
          <div className="flex flex-col lg:flex-row justify-between gap-6">

            <div>
              <h4 className="font-semibold text-white text-lg">
                Get dialysis updates
              </h4>
              <p className="text-sm text-slate-400">
                Tips, alerts, and center availability
              </p>
            </div>

            <div className="flex gap-3 w-full lg:w-auto">
              <input
                placeholder="Enter your email"
                className="
                px-4 py-3 
                rounded-full 
                border border-slate-600
                bg-slate-900
                text-white
                w-full lg:w-72
                outline-none
                focus:ring-2 focus:ring-blue-500
                "
              />

              <button className="
              px-6 py-3 
              rounded-full
              text-slate-950
              bg-gradient-to-r from-slate-300 via-slate-400 to-slate-500
              hover:shadow-lg
              transition
              ">
                Subscribe
              </button>
            </div>

          </div>
        </div>

        {/* Bottom */}
        <div className="
        border-t border-slate-700
        pt-6
        flex flex-col sm:flex-row
        justify-between items-center
        gap-4
        text-sm text-slate-400
        ">

          <p>© 2026 HealthSetu. All rights reserved.</p>

          <div className="flex gap-6">
            <span className="hover:text-white cursor-pointer">
              Privacy
            </span>

            <span className="hover:text-white cursor-pointer">
              Terms
            </span>

            <span className="hover:text-white cursor-pointer">
              Medical Disclaimer
            </span>
          </div>

        </div>
      </div>
    </footer>
  );
}