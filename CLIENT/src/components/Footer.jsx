import React from "react";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 border-t border-gray-800 text-gray-300 px-4 sm:px-6 lg:px-12 py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-12 sm:mb-16">
          
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-500 rounded-full flex items-center justify-center">
                <Heart size={20} className="text-white fill-white" />
              </div>
              <span className="font-bold text-xl text-white">HealthSetu</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Empowering patients and families with AI-driven healthcare solutions for a healthier tomorrow.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blue-600/50 transition-colors duration-300">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blue-600/50 transition-colors duration-300">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blue-600/50 transition-colors duration-300">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-bold text-lg text-white mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#features" className="hover:text-blue-400 transition-colors duration-300">Features</a></li>
              <li><a href="#howitworks" className="hover:text-blue-400 transition-colors duration-300">How It Works</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Pricing</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Security</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-lg text-white mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">About</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Blog</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Careers</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Press</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg text-white mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3 text-gray-400 hover:text-blue-400 transition-colors duration-300">
                <Mail size={18} className="flex-shrink-0" />
                <a href="mailto:support@healthsetu.com">support@healthsetu.com</a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 hover:text-blue-400 transition-colors duration-300">
                <Phone size={18} className="flex-shrink-0" />
                <a href="tel:+1234567890">+1 (234) 567-890</a>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin size={18} className="flex-shrink-0 mt-1" />
                <span>123 Health Street, Medical City, MC 12345</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mb-12 sm:mb-16 pb-12 sm:pb-16 border-t border-gray-800">
          <h4 className="font-bold text-lg text-white mb-4">Newsletter</h4>
          <p className="text-gray-400 text-sm mb-4">Subscribe for health tips, product updates, and expert insights.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm"
            />
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-full font-bold text-sm hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-6 text-gray-400 text-xs sm:text-sm">
          <p>&copy; 2024 HealthSetu. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-blue-400 transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="hover:text-blue-400 transition-colors duration-300">Terms of Service</a>
            <a href="#" className="hover:text-blue-400 transition-colors duration-300">HIPAA Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
}