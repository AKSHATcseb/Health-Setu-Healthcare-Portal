import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Calendar, BarChart3, ArrowRight } from "lucide-react";

const actions = [
  {
    id: 1,
    title: "Report Analysis",
    description: "View and analyze your health reports and test results",
    icon: BarChart3,
    bgColor: "from-blue-600 to-blue-500",
    borderColor: "border-blue-600",
    link: "/patient/reports",
  },
  {
    id: 2,
    title: "Appointment History",
    description: "Check your past appointments and medical history",
    icon: Calendar,
    bgColor: "from-teal-600 to-teal-500",
    borderColor: "border-teal-600",
    link: "/patient/history",
  },
  {
    id: 3,
    title: "Book Appointment",
    description: "Schedule a new appointment with healthcare providers",
    icon: FileText,
    bgColor: "from-green-600 to-green-500",
    borderColor: "border-green-600",
    link: "/patient/bookingpage",
  },
];

export default function QuickActions() {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section className="w-full px-4 sm:px-6 lg:px-12 py-8 sm:py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto">
        
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Quick Actions</h2>
        {/* <p className="text-gray-700 font-medium mb-8">Choose an action to get started</p> */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {actions.map((action) => {
            const Icon = action.icon;
            const isHovered = hoveredId === action.id;

            return (
              <div
                key={action.id}
                onMouseEnter={() => setHoveredId(action.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => navigate(action.link)}
                className="group cursor-pointer"
              >
                <div className={`h-full bg-white rounded-2xl p-8 border-2 ${action.borderColor} shadow-lg hover:shadow-2xl transition-all duration-300 ${isHovered ? "scale-105" : ""}`}>
                  
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${action.bgColor} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={32} className="text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                    {action.title}
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base mb-6 leading-relaxed font-medium">
                    {action.description}
                  </p>

                  {/* Link */}
                  <div className="flex items-center gap-2 text-blue-700 font-bold group-hover:gap-3 transition-all duration-300">
                    Explore Now
                    <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
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