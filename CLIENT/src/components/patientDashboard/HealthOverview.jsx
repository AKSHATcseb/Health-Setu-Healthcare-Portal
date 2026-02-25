import React from "react";
import { Heart, Droplets, Activity, Wind } from "lucide-react";

export default function HealthOverview() {
  const vitals = [
    {
      id: 1,
      title: "Blood Pressure",
      value: "120/80",
      unit: "mmHg",
      status: "Normal",
      icon: Heart,
      color: "text-red-600",
      bgColor: "from-red-100 to-red-50",
      borderColor: "border-red-600",
    },
    {
      id: 2,
      title: "Blood Glucose",
      value: "95",
      unit: "mg/dL",
      status: "Normal",
      icon: Droplets,
      color: "text-blue-600",
      bgColor: "from-blue-100 to-blue-50",
      borderColor: "border-blue-600",
    },
    {
      id: 3,
      title: "Heart Rate",
      value: "72",
      unit: "bpm",
      status: "Healthy",
      icon: Activity,
      color: "text-green-600",
      bgColor: "from-green-100 to-green-50",
      borderColor: "border-green-600",
    },
    {
      id: 4,
      title: "Oxygen Level",
      value: "98",
      unit: "%",
      status: "Excellent",
      icon: Wind,
      color: "text-purple-600",
      bgColor: "from-purple-100 to-purple-50",
      borderColor: "border-purple-600",
    },
  ];

  return (
    <section className="w-full px-4 sm:px-6 lg:px-12 py-8 sm:py-12 md:py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Your Health Overview</h2>
        <p className="text-gray-700 font-medium mb-8">Real-time health metrics</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {vitals.map((vital) => {
            const Icon = vital.icon;

            return (
              <div
                key={vital.id}
                className={`bg-gradient-to-br ${vital.bgColor} rounded-xl p-6 border-2 ${vital.borderColor} shadow-lg hover:shadow-xl transition-shadow duration-300`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm sm:text-base font-bold text-gray-800">{vital.title}</h3>
                  <Icon className={`w-6 h-6 ${vital.color}`} />
                </div>

                <div className="mb-3">
                  <p className="text-3xl sm:text-4xl font-bold text-gray-900">
                    {vital.value}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-700 font-semibold mt-1">{vital.unit}</p>
                </div>

                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-green-600 text-white">
                  {vital.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}