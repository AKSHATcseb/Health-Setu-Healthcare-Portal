import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Header from "../../components/bookingPage/Header";
import FilterBar from "../../components/bookingPage/FilterBar";
import SortOptions from "../../components/bookingPage/SortOptions";
import HospitalList from "../../components/bookingPage/HospitalList";


export default function BookAppointment() {
  const navigate = useNavigate();
  const [user] = useState({
    name: "John Doe",
    email: "john@example.com",
    location: { lat: 28.7041, lng: 77.1025 },
  });

  // Filters State
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [distanceFilter, setDistanceFilter] = useState({ min: 0, max: 50 });
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: 5000 });
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sortBy, setSortBy] = useState("closest");
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

  // Mock Hospital Data
  const hospitals = [
    {
      id: 1,
      name: "Apollo Hospitals Delhi",
      distance: 2.5,
      price: 3500,
      rating: 4.8,
      reviews: 245,
      address: "Sarita Vihar, New Delhi",
      availability: ["9:00 AM", "2:30 PM", "4:00 PM"],
      experience: "15+ years",
      dialysisUnits: 8,
      phone: "+91-11-4175-1234",
      verified: true,
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 2,
      name: "Max Healthcare Gurgaon",
      distance: 15.3,
      price: 2800,
      rating: 4.6,
      reviews: 189,
      address: "Sector 44, Gurgaon",
      availability: ["10:00 AM", "3:00 PM", "5:30 PM"],
      experience: "12+ years",
      dialysisUnits: 12,
      phone: "+91-124-4567-890",
      verified: true,
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 3,
      name: "Fortis Hospital Delhi",
      distance: 8.2,
      price: 3200,
      rating: 4.7,
      reviews: 312,
      address: "Vasant Kunj, New Delhi",
      availability: ["8:00 AM", "1:00 PM", "3:30 PM"],
      experience: "18+ years",
      dialysisUnits: 10,
      phone: "+91-11-4150-5050",
      verified: true,
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 4,
      name: "Medanta Hospital Gurgaon",
      distance: 18.5,
      price: 2500,
      rating: 4.5,
      reviews: 156,
      address: "Sector 38, Gurgaon",
      availability: ["9:30 AM", "2:00 PM", "4:30 PM"],
      experience: "14+ years",
      dialysisUnits: 6,
      phone: "+91-124-4567-123",
      verified: false,
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 5,
      name: "AIIMS New Delhi",
      distance: 5.8,
      price: 1500,
      rating: 4.9,
      reviews: 428,
      address: "Ansari Nagar, New Delhi",
      availability: ["7:00 AM", "12:00 PM", "4:00 PM"],
      experience: "25+ years",
      dialysisUnits: 15,
      phone: "+91-11-2658-8500",
      verified: true,
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&q=80",
    },
  ];

  // Filter and Sort Hospitals
  const filteredHospitals = hospitals
    .filter(h => 
      h.distance >= distanceFilter.min && 
      h.distance <= distanceFilter.max &&
      h.price >= priceFilter.min && 
      h.price <= priceFilter.max &&
      h.rating >= ratingFilter
    )
    .sort((a, b) => {
      if (sortBy === "closest") return a.distance - b.distance;
      if (sortBy === "cheapest") return a.price - b.price;
      if (sortBy === "bestrated") return b.rating - a.rating;
      return 0;
    });

  const timeSlots = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-blue-50 via-white to-teal-50 flex flex-col">
      <Navbar user={user} onLogout={() => navigate("/login")} onUpdateProfile={() => navigate("/patient/details")} />

      <div className="flex-1">
        <Header />

        {/* Filter Bar - Full Width */}
        <FilterBar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
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

        {/* Main Content - No Sidebar */}
        <section className="w-full px-4 sm:px-6 lg:px-12 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Sort Options */}
            <SortOptions sortBy={sortBy} setSortBy={setSortBy} />

            {/* Hospital List */}
            <HospitalList hospitals={filteredHospitals} selectedDate={selectedDate} selectedTime={selectedTime} />
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}