import React, { useCallback, useRef } from "react";
import { Filter, TrendingDown, Zap, Award, Check } from "lucide-react";

/**
 * SortOptions (foreground-only styling)
 * - Root preserves page background
 * - Option cards and CTAs use cyan/teal accents
 * - Keyboard navigation supported
 */
export default function SortOptions({ sortBy, setSortBy }) {
  const sortOptions = [
    { value: "closest", label: "Closest First", description: "Shorter travel time", icon: TrendingDown },
    { value: "cheapest", label: "Cheapest First", description: "Lowest cost options", icon: Zap },
    // { value: "bestrated", label: "Best Rated First", description: "Top patient reviews", icon: Award },
  ];

  const optionRefs = useRef([]);

  const focusOptionAt = useCallback((i) => optionRefs.current[i]?.focus(), []);
  const handleKeyDown = (e, idx) => {
    const last = sortOptions.length - 1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const next = idx === last ? 0 : idx + 1;
      focusOptionAt(next);
      setSortBy(sortOptions[next].value);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const prev = idx === 0 ? last : idx - 1;
      focusOptionAt(prev);
      setSortBy(sortOptions[prev].value);
    } else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      setSortBy(sortOptions[idx].value);
    }
  };

  return (
    <div className="w-full px-4 py-5">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Filter size={20} className="text-cyan-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Sort Results</h3>
              <p className="text-xs text-gray-600">Choose ordering</p>
            </div>
          </div>
        </div>

        <div role="radiogroup" aria-label="Sort results" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sortOptions.map((opt, idx) => {
            const Icon = opt.icon;
            const active = sortBy === opt.value;
            return (
              <label
                key={opt.value}
                ref={(el) => (optionRefs.current[idx] = el)}
                tabIndex={0}
                role="radio"
                aria-checked={active}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                onClick={() => setSortBy(opt.value)}
                className={`relative flex items-center gap-3 p-4 rounded-2xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-300 transition transform ${
                  active ? "bg-slate-800 text-white shadow-lg" : "bg-white/90 text-gray-900 border border-gray-200 hover:scale-[1.02]"
                }`}
              >
                <input className="sr-only" type="radio" name="sort" value={opt.value} checked={active} onChange={() => setSortBy(opt.value)} />

                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${active ? "bg-white/20" : "bg-white"}`}>
                  <Icon size={18} className={active ? "text-white" : "text-cyan-600"} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-semibold ${active ? "text-white" : "text-gray-900"}`}>{opt.label}</div>
                  <div className={`text-xs ${active ? "text-white/90" : "text-gray-600"}`}>{opt.description}</div>
                </div>

                {active && (
                  <div className="ml-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-white">
                      <Check size={16} />
                    </span>
                  </div>
                )}
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}