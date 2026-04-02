import React from "react";
import { Calendar, FileText, CreditCard } from "lucide-react";

/**
 * Hero (refined redesign — dark/charcoal)
 *
 * - Matches the app's #0b1220 / #111827 tile palette with bright accent highlights.
 * - Fully responsive: stacked on small screens, two-column layout on larger screens.
 * - Keeps the same props and behavior (no backend changes).
 * - Accessible: aria labels, safe handling of missing user data.
 *
 * Props:
 * - user: { name, email, ... } (optional)
 */
export default function Hero({ user = {} }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
  const firstName = user?.name ? String(user.name).split(" ")[0] : "there";

  return (
    <section
      className="w-full px-4 sm:px-6 lg:px-12 py-10 md:py-16 bg-slate-200"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left column: Greeting, copy and CTAs */}
          <div className="lg:col-span-7">
            <div className="max-w-2xl">
              <p className="text-sm text-slate-700 mb-2">Welcome back</p>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-700 leading-tight">
                {greeting},{" "}
                <span className="bg-clip-text text-transparent bg-linear-to-r from-sky-700 to-sky-800">
                  {firstName}!
                </span>
              </h1>

              <p className="mt-4 text-slate-700 text-base sm:text-lg">
                Manage appointments, access reports, and keep your medical info up to date — all in one secure place.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {/* <button
                  onClick={() => window.location.href = "/patient/book"}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold shadow-lg hover:brightness-105 transition"
                  aria-label="Book appointment"
                >
                  Book appointment
                  <Calendar className="w-4 h-4" />
                </button> */}

                {/* <button
                  onClick={() => window.location.href = "/patient/reports"}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/6 text-white border border-white/6 hover:bg-white/10 transition"
                  aria-label="View reports"
                >
                  Reports
                  <FileText className="w-4 h-4 text-white/90" />
                </button> */}
              </div>
            </div>
          </div>

          {/* Right column: Stat tiles (stacked on small screens) */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
              <StatCard
                className="bg-white"
                label="Next appointment"
                value="—"
                accent="linear-gradient(90deg,#0ea5e9,#0369a1)"
                Icon={Calendar}
              />
              <StatCard
                label="Total appointments"
                value="12"
                accent="linear-gradient(90deg,#10b981,#06b6d4)"
                Icon={Calendar}
              />
              <StatCard
                label="Pending payments"
                value="₹2,500"
                accent="linear-gradient(90deg,#f97316,#fb7185)"
                Icon={CreditCard}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Small presentational stat card — internal to this file for cohesion */
function StatCard({ label, value, accent, Icon }) {
  return (
    <div
      className="rounded-full p-4  ">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-900 uppercase tracking-wide">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
        </div>

        <div
          className="w-12 h-12 rounded-lg grid place-items-center shadow-md"
          style={{ background: accent }}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}