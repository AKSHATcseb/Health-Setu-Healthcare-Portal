import { useState } from "react";

export default function FiltersSidebar({ onChange }) {

  // 📅 Today
  const today = new Date();

  const defaultDate = (() => {
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  })();

  const [filters, setFilters] = useState({
    date: defaultDate,
    useAdvancedFilters: false,   // OFF by default
    distance: null,             // null = no preference
    price: null,
  });

  // 🔁 Update handler
  const update = (key, value) => {

    let updated = { ...filters, [key]: value };

    // 🚫 When advanced filters OFF → remove preferences
    if (!updated.useAdvancedFilters) {
      updated.distance = null;
      updated.price = null;
    }

    setFilters(updated);
    onChange?.(updated);
  };

  const dateChosen = Boolean(filters.date);

  return (
    <aside className="w-full lg:w-80 rounded-3xl sticky top-24">

      {/* 📅 Calendar */}
      <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm border-2 border-teal-500">

        <p className="font-medium text-gray-800 mb-1">
          Select Appointment Date *
        </p>

        <p className="text-sm text-gray-500 mb-3 font-medium">
          Next 15 Days
        </p>

        <div className="grid grid-cols-7 gap-2 text-xs text-center">

          {[...Array(16)].map((_, i) => {

            const dateObj = new Date();
            dateObj.setDate(today.getDate() + i);

            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, "0");
            const day = String(dateObj.getDate()).padStart(2, "0");

            const fullDate = `${year}-${month}-${day}`;

            const selected = filters.date === fullDate;
            const isToday = i === 0;

            return (
              <button
                key={fullDate}
                onClick={() => update("date", fullDate)}
                className={`w-8 h-8 rounded-full text-sm transition
                  ${
                    selected
                      ? "bg-teal-600 text-white"
                      : isToday
                      ? "border border-teal-600 text-teal-600"
                      : "text-gray-600 hover:bg-teal-50"
                  }
                `}
              >
                {dateObj.getDate()}
              </button>
            );
          })}

        </div>

        <p className="text-xs text-gray-400 mt-2">
          You can book appointments within the next 15 days only.
        </p>
      </div>

      {/* 🔘 ADVANCED FILTER TOGGLE */}
      <div
        className={`bg-white rounded-2xl p-4 mb-4 shadow-sm transition
          ${!dateChosen ? "opacity-40 pointer-events-none" : ""}
        `}
      >
        <div className="flex justify-between items-center">

          <div>
            <p className="font-medium text-gray-800">
              Advanced Filters
            </p>
            <p className="text-xs text-gray-400">
              Enable price & distance filters
            </p>
          </div>

          <button
            onClick={() =>
              update("useAdvancedFilters", !filters.useAdvancedFilters)
            }
            className={`w-12 h-7 rounded-full transition
              ${filters.useAdvancedFilters ? "bg-teal-600" : "bg-gray-300"}
            `}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full transition-transform
                ${
                  filters.useAdvancedFilters
                    ? "translate-x-6"
                    : "translate-x-1"
                }
              `}
            />
          </button>

        </div>
      </div>

      {/* 📍 Distance */}
      <div
        className={`bg-white rounded-2xl p-4 mb-4 shadow-sm transition
          ${
            !dateChosen || !filters.useAdvancedFilters
              ? "opacity-40 pointer-events-none"
              : ""
          }
        `}
      >
        <div className="flex justify-between mb-2">
          <p className="font-medium text-gray-800">
            Max Distance
          </p>

          <span className="text-sm bg-teal-50 text-teal-700 px-2 rounded-lg">
            {filters.distance ?? "No preference"}
          </span>
        </div>

        <input
          type="range"
          min="1"
          max="50"
          value={filters.distance ?? 1}
          onChange={(e) =>
            update("distance", Number(e.target.value))
          }
          className="w-full accent-teal-600"
        />
      </div>

      {/* 💰 Price */}
      <div
        className={`bg-white rounded-2xl p-4 shadow-sm transition
          ${
            !dateChosen || !filters.useAdvancedFilters
              ? "opacity-40 pointer-events-none"
              : ""
          }
        `}
      >
        <div className="flex justify-between mb-2">
          <p className="font-medium text-gray-800">
            Max Price
          </p>

          <span className="text-sm bg-teal-50 text-teal-700 px-2 rounded-lg">
            ₹{filters.price ?? "No preference"}
          </span>
        </div>

        <input
          type="range"
          min="500"
          max="5000"
          step="100"
          value={filters.price ?? 500}
          onChange={(e) =>
            update("price", Number(e.target.value))
          }
          className="w-full accent-teal-600"
        />
      </div>

    </aside>
  );
}
