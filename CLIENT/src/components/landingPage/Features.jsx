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
    title: "Easy Appointment Booking",
    desc: "Book appointments with ease through our intuitive scheduling system.",
  },
];

export default function Features() {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section id="features" className="w-full px-4 sm:px-6 lg:px-12 py-16 sm:py-20 md:py-28 bg-slate-200">
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
                <div className={`h-full flex flex-col p-8 sm:p-10 rounded-2xl transition-all duration-300 ${isHovered
                    ? " bg-gray-900 shadow-lg hover:shadow-xl hover:border-gray-300"
                    : "bg-white shadow-lg hover:shadow-xl hover:border-gray-300"
                  }`}>

                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 ${isHovered
                      ? "bg-white text-slate-900 shadow-lg shadow-blue-200"
                      : "bg-slate-900 text-white"
                    }`}>
                    <Icon size={32} />
                  </div>

                  {/* Title */}
                  <h3 className={`text-xl sm:text-2xl font-bold mb-3 transition-colors duration-300 ${isHovered ? "text-gray-100" : "text-gray-900"
                    }`}>
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className={`text-sm sm:text-base leading-relaxed mb-6 transition-colors duration-300 ${isHovered ? "text-gray-400" : "text-gray-700"
                    }`}>
                    {feature.desc}
                  </p>

                  {/* Link */}
                  {/* <div className="flex items-center gap-2 text-gray-400 font-semibold text-sm sm:text-base group-hover:gap-3 transition-all duration-300">
                    Learn More
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </div> */}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}