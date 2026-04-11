import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Stethoscope, CalendarDays } from "lucide-react";

/**
 * Dark-themed Responsive Header with responsive Back button
 *
 * Props:
 * - title, subtitle, onPrimary, onSecondary, onBack, icon
 *
 * Notes:
 * - Adds a responsive Back button:
 *   - On mobile (md:hidden) a compact icon-only back button appears at the left.
 *   - On tablet/desktop (md+) a larger "Back" button with icon + label appears.
 * - Keeps everything else unchanged; no new UI elements besides the back controls.
 */
export default function Header({
  title = "Book Your Dialysis Appointment",
  subtitle = "Find the best dialysis center that fits your needs and schedule",
  onPrimary,
  onSecondary,
  onBack,
  icon = null,
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (typeof onBack === "function") return onBack();
    navigate(-1);
  };

  return (
    <header
      role="banner"
      className="py-2 relative overflow-hidden bg-slate-200"
    >
      {/* Subtle decorative wave for depth; reduced motion aware */}
      <div className="absolute inset-0 pointer-events-none opacity-6" aria-hidden="true">
        <svg
          className="w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,96L48,96C96,96,192,96,288,117.3C384,139,480,181,576,176C672,171,768,117,864,112C960,107,1056,149,1152,149.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            fill="#ffffff"
            className="motion-safe:animate-[float_10s_ease-in-out_infinite] motion-reduce:opacity-6"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-12 py-4 sm:py-6 md:py-8 lg:py-10">
        {/* Mobile compact bar: back icon (left) | title centered | primary CTA (right) */}
        <div className="flex items-center justify-between md:hidden">
          <button
            onClick={handleBack}
            aria-label="Go back"
            className="inline-flex items-center justify-center w-10 h-10 rounded-md text-slate-800 bg-white/6 hover:bg-white/12 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 transition"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="flex-1 text-center">
            <div className="text-base font-semibold text-slate-800 leading-tight truncate">{title}</div>
            {/* <div className="text-xs text-white/80 mt-1 truncate">{subtitle}</div> */}
          </div>
        </div>

        {/* Desktop / tablet full header */}
        <div className="hidden md:flex items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            {/* Desktop back button (icon + label) */}
            {/* <button
              onClick={handleBack}
              aria-label="Go back"
              className="hidden md:inline-flex items-center gap-2 text-white bg-white/4 hover:bg-white/8 ring-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded-md px-3 py-2 transition transform hover:-translate-x-0.5"
            >
              <ArrowLeft size={18} />
              <span className="font-medium">Back</span>
            </button> */}

            <div className="flex items-center gap-4">
              {/* <div className="flex-none w-16 h-16 rounded-2xl bg-white/5 border border-white/6 flex items-center justify-center">
                {icon ? icon : <Stethoscope size={32} className="text-teal-300" />}
              </div> */}

              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 leading-tight truncate">
                  {title}
                </h1>
                <p className="mt-1 text-sm sm:text-base text-gray-600 max-w-xl truncate">
                  {subtitle}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 flex gap-3 items-center">
            {onSecondary && (
              <button
                onClick={onSecondary}
                type="button"
                className="hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white/6 text-white/90 hover:bg-white/10 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                <span className="text-sm font-medium">Action</span>
              </button>
            )}

            {onPrimary && (
              <button
                onClick={onPrimary}
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-900 font-semibold shadow-md hover:scale-[1.02] transition transform focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                <CalendarDays />
                <span className="text-sm">Book</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}