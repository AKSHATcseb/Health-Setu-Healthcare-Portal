import React from "react";
import { ArrowRight, CheckCircle, Play } from "lucide-react";

export default function Hero() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-12 py-16 sm:py-20 md:py-28 lg:py-32 bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          
          {/* Left Content */}
          <div className="flex flex-col justify-center order-2 lg:order-1">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 w-fit bg-blue-100 border border-blue-300 text-blue-700 px-4 py-2 rounded-full mb-6 sm:mb-8 font-semibold text-xs sm:text-sm">
              <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
              Powered by Care-AI & Experts
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight sm:leading-tight md:leading-tight mb-6">
              Personalized Healthcare
              <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                At Your Fingertips
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-8 sm:mb-10 max-w-2xl">
              Empowering patients and families with AI-driven monitoring, expert care coordination, and round-the-clock support. Healthcare made simple, accessible, and human-centered.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-8 sm:mb-10">
              <button className="group flex items-center justify-center sm:justify-start gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-full font-bold text-base sm:text-lg hover:shadow-xl hover:shadow-blue-200 hover:scale-105 transition-all duration-300 active:scale-95">
                Start Free Trial
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </button>
              <button className="group flex items-center justify-center sm:justify-start gap-2 px-8 py-4 bg-gray-100 border border-gray-300 text-gray-700 rounded-full font-bold text-base sm:text-lg hover:bg-gray-200 hover:border-gray-400 transition-all duration-300">
                <Play size={20} className="fill-current" />
                Watch Demo
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-teal-500" />
                <span className="text-sm text-gray-700 font-medium">HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-teal-500" />
                <span className="text-sm text-gray-700 font-medium">7-Day Free Trial</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <CheckCircle size={20} className="text-teal-500" />
                <span className="text-sm text-gray-700 font-medium">24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="order-1 lg:order-2">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200/40 to-teal-200/40 rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80"
                alt="Healthcare Professional with Tablet"
                className="relative rounded-3xl shadow-2xl shadow-blue-100 w-full h-full object-cover border border-blue-200 group-hover:scale-105 transition-transform duration-300 bg-white"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 sm:mt-20 md:mt-28 pt-12 sm:pt-16 border-t border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="text-center">
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">50K+</p>
            <p className="text-gray-600 text-xs sm:text-sm mt-2 font-medium">Active Users</p>
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600">4.9★</p>
            <p className="text-gray-600 text-xs sm:text-sm mt-2 font-medium">App Rating</p>
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">99.9%</p>
            <p className="text-gray-600 text-xs sm:text-sm mt-2 font-medium">Uptime</p>
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600">24/7</p>
            <p className="text-gray-600 text-xs sm:text-sm mt-2 font-medium">Expert Support</p>
          </div>
        </div>
      </div>
    </section>
  );
}