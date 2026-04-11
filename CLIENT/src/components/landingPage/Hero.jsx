import React from "react";

export default function Hero() {
  return (
    <section className="relative w-full px-4 sm:px-6 lg:px-12 py-16 sm:py-20 md:py-28 lg:py-32 bg-slate-200 overflow-hidden">

      <div className="relative max-w-4xl mx-auto text-center flex flex-col items-center justify-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-300 text-blue-700 px-4 py-2 rounded-full mb-6 sm:mb-8 font-semibold text-xs sm:text-sm">
          <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
          Powered by Care-AI & Experts
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-950 leading-tight mb-6">
          Personalized Healthcare
          <br />
          <span className="text-transparent bg-clip-text bg-sky-900">
            At Your Fingertips
          </span>
        </h1>

        {/* Description */}
        <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed mb-10 max-w-2xl">
          Empowering patients and families with AI-driven monitoring, expert care coordination, and round-the-clock support. Healthcare made simple, accessible, and human-centered.
        </p>

      </div>
    </section>
  );
}