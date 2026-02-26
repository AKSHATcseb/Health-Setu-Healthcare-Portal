import React from "react";
import { Filter, TrendingDown, Zap, Award } from "lucide-react";

export default function SortOptions({ sortBy, setSortBy }) {
  const sortOptions = [
    { value: "closest", label: "Closest First", icon: TrendingDown, color: "from-orange-500 to-red-500" },
    { value: "cheapest", label: "Cheapest First", icon: Zap, color: "from-green-500 to-emerald-500" },
    { value: "bestrated", label: "Best Rated First", icon: Award, color: "from-yellow-500 to-orange-500" },
  ];

  return (
    <div className="bg-white rounded-3xl border-2 border-gray-300 p-7 mb-8 shadow-xl hover:shadow-2xl hover:border-blue-300 transition-all duration-300">
      <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
        <Filter size={20} className="text-blue-600" />
        Sort Results
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {sortOptions.map(option => {
          const Icon = option.icon;
          return (
            <label 
              key={option.value}
              className="relative cursor-pointer group"
            >
              <input
                type="radio"
                name="sort"
                value={option.value}
                checked={sortBy === option.value}
                onChange={(e) => setSortBy(e.target.value)}
                className="sr-only"
              />
              <div className={`p-4 rounded-2xl transition-all duration-300 border-2 transform hover:scale-105 ${
                sortBy === option.value
                  ? `bg-gradient-to-r ${option.color} text-white shadow-lg`
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-400 hover:border-blue-400"
              }`}>
                <div className="flex items-center gap-3">
                  <Icon size={20} />
                  <span className="font-semibold">{option.label}</span>
                </div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}