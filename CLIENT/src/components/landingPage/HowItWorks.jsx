import React from "react";
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
  return (
    <section id="howitworks" className="w-full px-4 sm:px-6 lg:px-12 py-16 sm:py-20 md:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <p className="text-teal-600 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3">
            Simple Process
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Get started in three simple steps and experience better healthcare management.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
          
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden md:block absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-teal-500 to-blue-600 -z-10"></div>

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div key={step.id} className="relative">
                
                {/* Step Card */}
                <div className="bg-white border border-gray-200 p-8 sm:p-10 rounded-2xl shadow-lg hover:shadow-xl hover:border-teal-300 transition-all duration-300 group">
                  
                  {/* Step Number */}
                  <div className="absolute -top-5 -left-5 w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-100 transition-colors duration-300">
                    <Icon size={32} className="text-blue-600" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
                    {step.desc}
                  </p>

                  {/* Check Mark */}
                  <div className="flex items-center gap-2 text-teal-600 font-semibold text-sm">
                    <Check size={20} className="bg-teal-100 rounded-full p-1" />
                    Ready to go
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 sm:mt-16 md:mt-20 text-center">
          <p className="text-gray-600 text-sm sm:text-base mb-6">
            Ready to experience better healthcare?
          </p>
          <button className="px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-full font-bold text-base sm:text-lg hover:shadow-xl hover:shadow-blue-200 hover:scale-105 transition-all duration-300">
            Get Started Free
          </button>
        </div>
      </div>
    </section>
  );
}