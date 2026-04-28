import React, { useEffect, useRef, useState } from "react";
import { Calendar, MapPin, DollarSign, Star } from "lucide-react";

/**
 * FilterBar (foreground-only styling)
 * - Root wrapper avoids changing page background
 * - Row1: date only (today..today+7)
 * - Row2: master checkbox toggles filters (cannot enable without valid date)
 * - Row3: filters (distance, price, rating) + Reset/Apply
 */
export default function FilterBar({
  filtersEnabled,
  setFiltersEnabled,
  selectedDate,
  setSelectedDate,
  distanceFilter = { max: 0 },
  setDistanceFilter,
  priceFilter = { max: 0 },
  setPriceFilter,
  ratingFilter,
  setRatingFilter,
  onApplyFilters,
}) {
  const [dateError, setDateError] = useState("");
  const [applying, setApplying] = useState(false);
  const dateRef = useRef(null);

  const formatLocalDate = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const today = new Date();
  const minDate = formatLocalDate(today);
  const maxDateObj = new Date(today);
  maxDateObj.setDate(maxDateObj.getDate() + 7);
  const maxDate = formatLocalDate(maxDateObj);

  useEffect(() => {
    if (selectedDate && selectedDate >= minDate && selectedDate <= maxDate) {
      setDateError("");
    }
  }, [selectedDate, minDate, maxDate]);

  const isDateValid = (d) => typeof d === "string" && d >= minDate && d <= maxDate;

  const tryEnableFilters = () => {
    if (!selectedDate) {
      setDateError("Select a date before enabling filters.");
      dateRef.current?.focus();
      return false;
    }
    if (!isDateValid(selectedDate)) {
      setDateError("Select a date within the next 7 days.");
      dateRef.current?.focus();
      return false;
    }
    setFiltersEnabled(true);
    return true;
  };

  const handleMasterCheckboxChange = (checked) => {
    if (checked) tryEnableFilters();
    else setFiltersEnabled(false);
  };

  const handleDateChange = (e) => {
  const val = e.target.value;

  // console.log("📅 Selected Date:", val); 

  setSelectedDate?.(val);

  if (!val) setDateError("Please select a date.");
  else if (!isDateValid(val)) setDateError("Please select a date within the next 7 days.");
  else setDateError("");
};

  const handleApply = () => {
    if (!selectedDate || !isDateValid(selectedDate)) {
      setDateError("Please select a date within the next 7 days.");
      dateRef.current?.focus();
      return;
    }
    setApplying(true);
    onApplyFilters?.({
      date: selectedDate,
      time: selectedTime,
      distance: distanceFilter,
      price: priceFilter,
      rating: ratingFilter,
    });
    setTimeout(() => setApplying(false), 300);
  };

  const handleReset = () => {
    setDistanceFilter?.({ ...distanceFilter, max: 0 });
    setPriceFilter?.({ ...priceFilter, max: 0 });
    setRatingFilter?.(0);
  };

  return (
    // root has no bg class so page background is preserved
    <div className="w-full px-4 py-5 bg-slate-200">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Row 1: Date only */}
        <div>
          <label htmlFor="appointment-date" className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Calendar size={18} className="text-cyan-600" />
            Select Date <span className="text-red-500">*</span>
          </label>

          <input
            id="appointment-date"
            ref={dateRef}
            type="date"
            value={selectedDate ?? ""}
            onChange={handleDateChange}
            min={minDate}
            max={maxDate}
            className={`w-full md:max-w-xs px-3 py-2 rounded-lg border ${
              dateError ? "border-red-500" : "border-gray-300"
            } bg-white/90 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-300`}
            aria-required="true"
            aria-invalid={!!dateError}
          />
          <p className="mt-2 text-xs text-gray-500">Allowed: {minDate} — {maxDate}</p>
          {dateError && <p className="mt-2 text-sm text-red-600" role="alert">{dateError}</p>}
        </div>

        {/* Row 2: Master checkbox */}
        <div className="flex items-center gap-4">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filtersEnabled}
              onChange={(e) => handleMasterCheckboxChange(e.target.checked)}
              className="w-4 h-4 accent-cyan-500"
              aria-checked={filtersEnabled}
            />
            <span className="text-sm font-medium text-gray-900">Enable Filters</span>
          </label>
    </div>
        {/* Row 3: Filters (cards/controls styled as foreground) */}
        <fieldset
          className={`grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-lg ${filtersEnabled ? "bg-white/95" : "bg-white/70 opacity-60"}`}
          aria-disabled={!filtersEnabled}
        >
          <legend className="sr-only">Filters</legend>

          {/* Distance */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <MapPin size={16} className="text-cyan-600" />
              Max Distance
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="2000"
                value={distanceFilter?.max ?? 0}
                onChange={(e) => setDistanceFilter?.({ ...distanceFilter, max: parseInt(e.target.value, 10) })}
                disabled={!filtersEnabled}
                className="flex-1 h-3 accent-slate-800"
                aria-disabled={!filtersEnabled}
              />
              <span className="font-semibold text-gray-900 text-sm">{distanceFilter?.max ?? 0} km</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <DollarSign size={16} className="text-cyan-600" />
              Max Price
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="5000"
                value={priceFilter?.max ?? 0}
                onChange={(e) => setPriceFilter?.({ ...priceFilter, max: parseInt(e.target.value, 10) })}
                disabled={!filtersEnabled}
                className="flex-1 h-3 accent-slate-800"
                aria-disabled={!filtersEnabled}
              />
              <span className="font-semibold text-gray-900 text-sm">₹{priceFilter?.max ?? 0}</span>
            </div>
          </div>

          {/* Rating */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Star size={16} className="text-slate-800" />
              Minimum Rating
            </label>
            <div className="flex gap-2 flex-wrap">
              {[0, 3.5, 4, 4.5, 4.8].map((r) => {
                const active = ratingFilter === r && filtersEnabled;
                return (
                  <button
                    key={r}
                    onClick={() => { if (!filtersEnabled) return; setRatingFilter?.(r); }}
                    disabled={!filtersEnabled}
                    aria-pressed={active}
                    className={`px-3 py-2 rounded-md text-sm font-semibold transition ${
                      active ? "bg-slate-800 text-white shadow" : "bg-gray-100 text-gray-900"
                    } ${!filtersEnabled ? "opacity-60" : "hover:scale-[1.02]"}`}
                  >
                    {r === 0 ? "All" : `${r}+`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col justify-between">
            <div className="flex gap-2 justify-end mt-3">
              <button
                onClick={handleReset}
                disabled={!filtersEnabled}
                className="px-3 py-2 rounded-md bg-white text-gray-900 border border-gray-200 disabled:opacity-50"
              >
                Reset
              </button>
              <button
                onClick={handleApply}
                disabled={!isDateValid(selectedDate) || applying}
                className="px-4 py-2 rounded-md bg-slate-800 text-gray-200 font-semibold disabled:opacity-60"
              >
                {applying ? "Applying..." : filtersEnabled ? "Apply Filters" : "Apply Date"}
              </button>
            </div>
          </div>
        </fieldset>
      </div>
    </div>
  );
}