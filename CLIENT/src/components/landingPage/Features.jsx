import React, { useState } from "react";
import { HeartPulse, Accessibility, Stethoscope, ArrowRight } from "lucide-react";

const features = [
  {
    id: 1,
    icon: HeartPulse,
    title: "AI Health Monitoring",
    desc: "Real-time health tracking with AI-powered insights, predictive alerts, and personalized health recommendations.",
  },
  {
    id: 2,
    icon: Accessibility,
    title: "Senior-Friendly Design",
    desc: "Intuitive interface with large text, high contrast, and voice support designed for all ages.",
  },
  {
    id: 3,
    icon: Stethoscope,
    title: "Clinician-Backed",
    desc: "Protocols and care plans developed with leading nephrologists and health specialists.",
  },
];

export default function Features() {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section id="features" className="w-full px-4 sm:px-6 lg:px-12 py-16 sm:py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <p className="text-teal-600 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3">
            Why HealthSetu
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Powerful Features for Better Care
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Comprehensive tools designed to simplify healthcare management and improve patient outcomes.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            const isHovered = hoveredId === feature.id;

            return (
              <div
                key={feature.id}
                onMouseEnter={() => setHoveredId(feature.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group h-full cursor-pointer"
              >
                <div className={`h-full flex flex-col p-8 sm:p-10 rounded-2xl border-2 transition-all duration-300 ${
                  isHovered
                    ? "border-teal-500 bg-gradient-to-br from-teal-50 to-blue-50 shadow-xl shadow-teal-100 scale-105"
                    : "border-gray-200 bg-white shadow-lg hover:shadow-xl hover:border-gray-300"
                }`}>
                  
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 ${
                    isHovered
                      ? "bg-gradient-to-br from-blue-600 to-teal-500 text-white shadow-lg shadow-blue-200"
                      : "bg-blue-100 text-blue-600"
                  }`}>
                    <Icon size={32} />
                  </div>

                  {/* Title */}
                  <h3 className={`text-xl sm:text-2xl font-bold mb-3 transition-colors duration-300 ${
                    isHovered ? "text-teal-600" : "text-gray-900"
                  }`}>
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed flex-1 mb-6">
                    {feature.desc}
                  </p>

                  {/* Link */}
                  <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm sm:text-base group-hover:gap-3 transition-all duration-300">
                    Learn More
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}