import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FileText, Calendar, BarChart3, ArrowRight } from "lucide-react";

/**
 * QuickActions — redesigned dark/charcoal cards
 * - Preserves behavior: resolves :id in links and navigates
 * - Accessible buttons (keyboard + aria)
 * - Responsive: 1 col mobile, 2 md, 3 lg
 */

const actions = [
  {
    id: 1,
    title: "Report Analysis",
    description: "View and analyze your health reports and test results",
    icon: BarChart3,
    accent: "linear-gradient(90deg,#0ea5e9,#0369a1)", // blue
    link: "/patient/:id/reports",
  },
  {
    id: 2,
    title: "Appointment History",
    description: "Check your past appointments and medical history",
    icon: Calendar,
    accent: "linear-gradient(90deg,#06b6d4,#0ea5e9)", // teal -> blue
    link: "/patient/:id/medicalhistory",
  },
  {
    id: 3,
    title: "Book Appointment",
    description: "Schedule a new appointment with healthcare providers",
    icon: FileText,
    accent: "linear-gradient(90deg,#10b981,#06b6d4)", // green
    link: "/patient/:id/bookappointment",
  },
];

export default function QuickActions() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [hoveredId, setHoveredId] = useState(null);

  const handleNavigate = (templateLink) => {
    if (!id) {
      console.error("Missing patient id in URL — cannot navigate to", templateLink);
      return;
    }
    const resolvedLink = templateLink.replace(":id", id);
    navigate(resolvedLink);
  };

  const handleKey = (e, link) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleNavigate(link);
    }
  };

  return (
    <section aria-label="Quick actions" className="w-full px-4 sm:px-6 lg:px-12 py-6 bg-slate-200">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">Quick Actions</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {actions.map((action) => {
            const Icon = action.icon;
            const isHovered = hoveredId === action.id;

            return (
              <button
                key={action.id}
                type="button"
                onMouseEnter={() => setHoveredId(action.id)}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => setHoveredId(action.id)}
                onBlur={() => setHoveredId(null)}
                onClick={() => handleNavigate(action.link)}
                onKeyDown={(e) => handleKey(e, action.link)}
                aria-label={`${action.title}. ${action.description}`}
                className={`group w-full text-left rounded-2xl p-5 sm:p-6 transform transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sky-600`}
                style={{
                  background: "linear-gradient(180deg,#0b1220,#111827)",
                  border: "1px solid rgba(255,255,255,0.04)",
                  boxShadow: isHovered ? "0 14px 40px rgba(2,6,23,0.6)" : "0 8px 24px rgba(2,6,23,0.45)",
                  cursor: "pointer",
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-14 h-14 rounded-lg grid place-items-center shadow-md"
                    aria-hidden="true"
                    style={{
                      background: action.accent,
                      transition: "transform .25s ease, box-shadow .25s ease",
                      transform: isHovered ? "translateY(-6px) scale(1.04)" : "none",
                    }}
                  >
                    <Icon size={28} className="text-white" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{action.title}</h3>
                    <p className="text-sm text-slate-300 mb-5 leading-relaxed">{action.description}</p>

                    <div className="flex items-center gap-2 text-sm font-semibold text-sky-300 group-hover:text-sky-200">
                      <span>Explore Now</span>
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}