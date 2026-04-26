import React, { useState } from "react";
import { BarChart3, Calendar, Lock, Check } from "lucide-react";

const steps = [
  {
    id: 1,
    icon: BarChart3,
    title: "Monitor Health",
    desc: "Connect your wearables and devices for continuous health tracking and real-time data collection.",
  },
  {
    id: 2,
    icon: Calendar,
    title: "Manage Care",
    desc: "Schedule appointments, receive reminders, and coordinate with your healthcare team seamlessly.",
  },
  {
    id: 3,
    icon: Lock,
    title: "Stay Secure",
    desc: "Your data is encrypted, HIPAA-compliant, and accessible only to authorized caregivers.",
  },
];

export default function HowItWorks() {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section id="howitworks" className="w-full px-4 sm:px-6 lg:px-12 py-16 sm:py-20 md:py-28 bg-slate-200">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Get started in three simple steps and experience better healthcare management.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">

          {/* Connecting Line */}
          <div className="hidden md:block absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-teal-500 to-blue-600 -z-10"></div>

          {steps.map((step, index) => {
            const Icon = step.icon;
            const isHovered = hoveredId === step.id;

            return (
              <div
                key={step.id}
                onMouseEnter={() => setHoveredId(step.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="relative group cursor-pointer"
              >

                {/* Card */}
                <div
                  className={`h-full flex flex-col p-8 sm:p-10 rounded-2xl transition-all duration-300 ${isHovered
                    ? "bg-gray-900 shadow-lg hover:shadow-xl"
                    : "bg-white shadow-lg hover:shadow-xl"
                    }`}
                >

                  {/* Step Number */}
                  {/* <div className="absolute -top-5 -left-5 w-12 h-12 bg-slate-400 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg ">
                    {index + 1}
                  </div> */}

                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 ${isHovered
                      ? "bg-white text-slate-900 shadow-lg shadow-blue-200"
                      : "bg-slate-900 text-white"
                      }`}
                  >
                    <Icon size={32} />
                  </div>

                  {/* Title */}
                  <h3
                    className={`text-xl sm:text-2xl font-bold mb-3 transition-colors duration-300 ${isHovered ? "text-gray-100" : "text-gray-900"
                      }`}
                  >
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p
                    className={`text-sm sm:text-base leading-relaxed mb-6 transition-colors duration-300 ${isHovered ? "text-gray-400" : "text-gray-700"
                      }`}
                  >
                    {step.desc}
                  </p>

                  {/* Bottom Status */}
                  {/* <div
                    className={`flex items-center gap-2 font-semibold text-sm ${
                      isHovered ? "text-gray-400" : "text-teal-600"
                    }`}
                  >
                    <Check
                      size={20}
                      className={`rounded-full p-1 ${
                        isHovered ? "bg-gray-700" : "bg-teal-100"
                      }`}
                    />
                    Ready to go
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