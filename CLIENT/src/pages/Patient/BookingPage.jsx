import { useState } from "react";
import Navbar from "../../components/patientDashboard/Navbar";
import CenterCard from "../../components/bookingPage/CenterCard";
import FiltersSidebar from "../../components/bookingPage/FiltersSidebar";

// Dummy centers data (replace with API later)
const centers = [
  {
    id: 1,
    name: "Apollo Dialysis Center",
    distance: 2.3,
    price: 1500,
    availableDates: ["2026-01-22", "2026-01-23"],
  },
  {
    id: 2,
    name: "Max Dialysis Care",
    distance: 5.1,
    price: 1200,
    availableDates: ["2026-01-22"],
  },
  {
    id: 3,
    name: "Fortis Dialysis Unit",
    distance: 8.4,
    price: 1800,
    availableDates: ["2026-01-24"],
  },
];

export default function BookingPage() {

  const [selectedCenter, setSelectedCenter] = useState(null);

  const [filters, setFilters] = useState({
    date: "",
    distance: 10,
    price: 5000,
  });

  // ❗ NO DATE SELECTED → SHOW NOTHING
  const shouldShowCenters = Boolean(filters.date);

  // ✅ Apply filters ONLY after date selected
  const filteredCenters = shouldShowCenters
    ? centers
        .filter((c) => c.availableDates.includes(filters.date))
        .filter((c) => c.distance <= filters.distance)
        .filter((c) => c.price <= filters.price)
    : [];

  return (
    <>
      <Navbar />

      <div className="grid lg:grid-cols-[320px_1fr] gap-6 bg-teal-50 min-h-screen">

        {/* LEFT FILTERS */}
        <FiltersSidebar onChange={setFilters} />

        {/* RIGHT CONTENT */}
        <div className="p-4">

          {/* NO DATE MESSAGE */}
          {!shouldShowCenters && (
            <div className="text-center mt-20 text-gray-500">
              Please select a date to view available centers
            </div>
          )}

          {/* CENTERS LIST */}
          {shouldShowCenters && (
            <section className="space-y-4">

              {filteredCenters.length > 0 ? (
                filteredCenters.map((center) => (
                  <CenterCard
                    key={center.id}
                    center={center}
                    active={selectedCenter?.id === center.id}
                    onClick={() => setSelectedCenter(center)}
                  />
                ))
              ) : (
                <p className="text-gray-500 text-sm">
                  No centers match your filters.
                </p>
              )}

            </section>
          )}

        </div>
      </div>
    </>
  );
}
