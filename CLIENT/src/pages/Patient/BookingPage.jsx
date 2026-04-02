import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import api, { setAuthToken } from "../../services/api";

import Footer from "../../components/Footer";
import Header from "../../components/bookingPage/Header";
import FilterBar from "../../components/bookingPage/FilterBar";
import SortOptions from "../../components/bookingPage/SortOptions";
// import HospitalList from "../../components/bookingPage/HospitalList";
import HospitalCard from "../../components/bookingPage/HospitalCard";

export default function BookAppointment() {
  const navigate = useNavigate();

  const { id } = useParams(); // patient id from URL: /patient/:id/bookappointment


  const [user] = useState({
    name: "John Doe",
    email: "john@example.com",
    location: { lat: 28.7041, lng: 77.1025 },
  });

  /* ---------------- FILTER STATES ---------------- */
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const [distanceFilter, setDistanceFilter] = useState({ min: 0, max: 50 });
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: 5000 });

  const [ratingFilter, setRatingFilter] = useState(0); // ignored for now
  const [sortBy, setSortBy] = useState("closest");
  const [filtersEnabled, setFiltersEnabled] = useState(false);

  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

  /* 🔥 NEW STATE FOR BACKEND DATA */
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);

  // const formatDate = (dateStr) => {
  //   const [dd, mm, yyyy] = dateStr.split("-");
  //   return `${yyyy}-${mm}-${dd}`;
  // };

  /* ---------------- FETCH FROM BACKEND ---------------- */
  useEffect(() => {
    if (!selectedDate) return;

    const fetchHospitals = async () => {
      try {
        setLoading(true);

        console.log("📤 Sending date to backend:", selectedDate);
        const res = await api.get(
          "http://localhost:8080/api/patient/available-hospitals",
          {
            params: {
              date: selectedDate,
              lat: user.location.lat,
              lng: user.location.lng,
              maxDistance: distanceFilter.max,
              minPrice: priceFilter.min,
              maxPrice: priceFilter.max,
              applyFilters: filtersEnabled
            },
          }
        );
        setHospitals(res.data.data);
        console.log("Fetched hospitals:", res.data.data);
      } catch (err) {
        console.error("Error fetching hospitals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, [selectedDate, distanceFilter, priceFilter]);

  /* ---------------- SORTING ---------------- */
  const filteredHospitals = [...hospitals].sort((a, b) => {
    if (sortBy === "closest") return (a.distance || 0) - (b.distance || 0);
    if (sortBy === "cheapest")
      return (a.priceFor4Hrs || 0) - (b.priceFor4Hrs || 0);
    return 0;
  });

  const timeSlots = [
    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-blue-50 via-white to-teal-50 flex flex-col">
      <div className="flex-1">
        <Header />

        {/* FILTER BAR */}
        <FilterBar
          filtersEnabled={filtersEnabled}
          setFiltersEnabled={setFiltersEnabled}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          distanceFilter={distanceFilter}
          setDistanceFilter={setDistanceFilter}
          priceFilter={priceFilter}
          setPriceFilter={setPriceFilter}
          ratingFilter={ratingFilter}
          setRatingFilter={setRatingFilter}
          showAdvancedFilter={showAdvancedFilter}
          setShowAdvancedFilter={setShowAdvancedFilter}
          timeSlots={timeSlots}

        />

        {/* MAIN CONTENT */}
        <section className="w-full px-4 sm:px-6 lg:px-12 py-12 bg-slate-200">
          <div className="max-w-7xl mx-auto">

            <SortOptions sortBy={sortBy} setSortBy={setSortBy} />

            {/* 🔥 CONTENT STATE HANDLING */}
            {loading ? (
              <p className="text-center text-gray-600 mt-6">
                Loading hospitals...
              </p>
            ) : !selectedDate ? (
              <p className="text-center text-gray-500 mt-6">
                Please select a date to view available hospitals.
              </p>
            ) : filteredHospitals.length === 0 ? (
              <p className="text-center text-red-500 mt-6">
                No hospitals available for the selected date.
              </p>
            ) : (
              <div className="">
                {filteredHospitals.map((hospital) => (
                  <HospitalCard
                    key={hospital._id}
                    hospital={hospital}
                    pId={id}
                    selectedDate={selectedDate}
                  />
                ))}
              </div>
            )}

          </div>
        </section>

      </div>

      <Footer />
    </div>
  );
}