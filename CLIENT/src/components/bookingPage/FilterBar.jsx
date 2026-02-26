import React from "react";
import { Calendar, Clock, MapPin, DollarSign, Star, Filter, Zap, ChevronDown } from "lucide-react";

export default function FilterBar({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  distanceFilter,
  setDistanceFilter,
  priceFilter,
  setPriceFilter,
  ratingFilter,
  setRatingFilter,
  showAdvancedFilter,
  setShowAdvancedFilter,
  timeSlots,
}) {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-12 py-8 bg-white border-b-2 border-gray-300">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Primary Filters - Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Date Selection */}
          <div className="flex flex-col">
            <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Calendar size={18} className="text-blue-600" />
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-3 rounded-xl border-2 border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-semibold text-gray-900 placeholder-gray-400 transition-all duration-300 hover:border-blue-400"
            />
          </div>

          {/* Time Selection */}
          <div className="flex flex-col">
            <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Clock size={18} className="text-teal-600" />
              Select Time
            </label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="px-4 py-3 rounded-xl border-2 border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-semibold text-gray-900 transition-all duration-300 hover:border-blue-400 appearance-none cursor-pointer"
            >
              <option value="">Choose a time slot</option>
              {timeSlots.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>

          {/* Distance Filter */}
          <div className="flex flex-col">
            <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
              <MapPin size={18} className="text-orange-600" />
              Max Distance
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="50"
                value={distanceFilter.max}
                onChange={(e) => setDistanceFilter({ ...distanceFilter, max: parseInt(e.target.value) })}
                className="flex-1 h-3 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />
              <span className="font-bold text-gray-900 whitespace-nowrap text-sm">{distanceFilter.max} km</span>
            </div>
          </div>

          {/* Price Filter */}
          <div className="flex flex-col">
            <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
              <DollarSign size={18} className="text-green-600" />
              Max Price
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="5000"
                value={priceFilter.max}
                onChange={(e) => setPriceFilter({ ...priceFilter, max: parseInt(e.target.value) })}
                className="flex-1 h-3 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
              <span className="font-bold text-gray-900 whitespace-nowrap text-sm">₹{priceFilter.max}</span>
            </div>
          </div>
        </div>

        {/* Secondary Filters - Rating & Advanced */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          
          {/* Rating Filter */}
          <div className="flex flex-col w-full lg:w-auto">
            <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Star size={18} className="text-yellow-500" />
              Minimum Rating
            </label>
            <div className="flex gap-2 flex-wrap">
              {[0, 3.5, 4, 4.5, 4.8].map(rating => (
                <button
                  key={rating}
                  onClick={() => setRatingFilter(rating)}
                  className={`px-4 py-2 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 ${
                    ratingFilter === rating
                      ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {rating === 0 ? "All" : `${rating}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Filter Button */}
          <button
            onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
            className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-teal-500 hover:shadow-xl hover:shadow-blue-300 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            <Zap size={18} />
            {showAdvancedFilter ? "Hide Advanced" : "Advanced Filters"}
            <ChevronDown size={18} className={`transition-transform ${showAdvancedFilter ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Advanced Filters - Expandable */}
        {showAdvancedFilter && (
          <div className="bg-blue-50 rounded-2xl border-2 border-blue-300 p-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Advanced Filters</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <label className="flex items-center gap-3 cursor-pointer hover:bg-blue-100 p-3 rounded-lg transition-colors border-2 border-gray-300 hover:border-blue-400">
                <input type="checkbox" className="w-5 h-5 rounded accent-blue-600 cursor-pointer" />
                <span className="text-sm font-semibold text-gray-800">Government Hospital</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer hover:bg-blue-100 p-3 rounded-lg transition-colors border-2 border-gray-300 hover:border-blue-400">
                <input type="checkbox" className="w-5 h-5 rounded accent-blue-600 cursor-pointer" />
                <span className="text-sm font-semibold text-gray-800">Emergency Services</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer hover:bg-blue-100 p-3 rounded-lg transition-colors border-2 border-gray-300 hover:border-blue-400">
                <input type="checkbox" className="w-5 h-5 rounded accent-blue-600 cursor-pointer" />
                <span className="text-sm font-semibold text-gray-800">Experienced Staff</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer hover:bg-blue-100 p-3 rounded-lg transition-colors border-2 border-gray-300 hover:border-blue-400">
                <input type="checkbox" className="w-5 h-5 rounded accent-blue-600 cursor-pointer" />
                <span className="text-sm font-semibold text-gray-800">New Equipment</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer hover:bg-blue-100 p-3 rounded-lg transition-colors border-2 border-gray-300 hover:border-blue-400">
                <input type="checkbox" className="w-5 h-5 rounded accent-blue-600 cursor-pointer" />
                <span className="text-sm font-semibold text-gray-800">Insurance Accepted</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer hover:bg-blue-100 p-3 rounded-lg transition-colors border-2 border-gray-300 hover:border-blue-400">
                <input type="checkbox" className="w-5 h-5 rounded accent-blue-600 cursor-pointer" />
                <span className="text-sm font-semibold text-gray-800">Nutritionist Available</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}