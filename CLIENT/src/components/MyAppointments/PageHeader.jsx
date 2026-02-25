import { motion } from "framer-motion";
import { useState } from "react";

const filters = [
  { key: "upcoming", label: "Upcoming" },
  { key: "completed", label: "Completed" },
  { key: "pending", label: "Pending" },
];

export default function PageHeader({ onFilterChange, hasAppointments }) {
  const [activeFilter, setActiveFilter] = useState("upcoming");

  const handleFilter = (filter) => {
    setActiveFilter(filter);
    onFilterChange?.(filter);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col gap-4 py-5 px-5 font-Raleway"
    >
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <h1 className="text-4xl font-bold text-gray-900">
          My Appointments
        </h1>

        {/* 👉 SHOW FILTERS ONLY IF APPOINTMENTS EXIST */}
        {hasAppointments && (
          <div className="flex gap-3 flex-wrap rounded-full bg-teal-600 p-1">

            {filters.map((filter) => {
              const isActive = activeFilter === filter.key;

              return (
                <motion.button
                  key={filter.key}
                  onClick={() => handleFilter(filter.key)}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    px-5 py-2 rounded-full text-sm font-medium transition-all
                    ${isActive
                      ? "bg-white text-teal-600 shadow"
                      : "text-white hover:bg-white hover:text-teal-600"}
                  `}
                >
                  {filter.label}
                </motion.button>
              );
            })}

          </div>
        )}

      </div>
    </motion.div>
  );
}
