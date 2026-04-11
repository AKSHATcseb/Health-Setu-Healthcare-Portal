import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";

/**
 * ProfileHeader
 *
 * Redesigned to match the dark/charcoal site palette:
 * - Dark tile gradient background (#0b1220 -> #07101a)
 * - Subtle decorative radial highlights
 * - Clean, professional typography and spacing
 * - Responsive: stacks on small screens, horizontal layout on larger
 * - Accessible back button (aria-label) and semantic structure
 *
 * No logic changes — only UI/styling.
 */
export default function ProfileHeader() {
  const navigate = useNavigate();

  return (
    <header
      className="w-full px-4 sm:px-6 lg:px-8 py-8 bg-slate-200"
      aria-labelledby="profile-heading"
    >
      {/* Decorative radial highlights */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-10">
        <div
          className="absolute right-6 top-6 rounded-full blur-3xl"
          style={{ width: 360, height: 360, background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.06), transparent 25%)" }}
        />
        <div
          className="absolute left-6 bottom-6 rounded-full blur-3xl"
          style={{ width: 320, height: 320, background: "radial-gradient(circle at 70% 70%, rgba(255,255,255,0.04), transparent 25%)" }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 ">
            <button
              onClick={() => navigate(-1)}
              aria-label="Go back"
              className="flex items-center gap-2 text-slate-800 hover:text-white transition-transform transform hover:-translate-x-1"
            >
              <ArrowLeft size={18} />
              <span className="sr-only">Back</span>
            </button>

            <div className="flex items-start sm:items-center gap-3">
              <div
                className="shrink-0 w-14 h-14 rounded-xl grid place-items-center bg-slate-800"
                style={{
                  border: "1px solid rgba(255,255,255,0.06)",
                  boxShadow: "0 6px 20px rgba(2,6,23,0.35)",
                }}
                aria-hidden="true"
              >
                <User size={28} className="text-white" />
              </div>

              <div>
                <h1 id="profile-heading" className="text-2xl sm:text-3xl font-extrabold text-gray-800 leading-tight">
                  Complete Your Profile
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}