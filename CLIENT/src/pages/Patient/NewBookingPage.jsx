import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import SlotSelector from "../../components/bookingConfirmation/SlotSelector";
import FiltersSidebar from "../../components/bookingPage/FiltersSidebar";
import Navbar from "../../components/patientDashboard/Navbar";
import { getMe } from "../../services/userApi";

export default function SearchAppointments() {

  const navigate = useNavigate();

  const [filters, setFilters] = useState(null);

  const [bookingData, setBookingData] = useState({
    appointmentDate: "",
    durationHours: null,
    startTime: "",
    endTime: "",
    isEmergency: false,
  });

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMe();
        setUser(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleFiltersChange = (data) => {
    setFilters(data);
    setBookingData((prev) => ({
      ...prev,
      appointmentDate: data.date,
    }));
  };

  const handleSlotSelect = ({
    durationHours,
    isEmergency,
    startTime,
    endTime,
  }) => {
    setBookingData((prev) => ({
      ...prev,
      durationHours,
      startTime,
      endTime,
      isEmergency,
    }));
  };

  const canSearch =
    bookingData.appointmentDate &&
    bookingData.durationHours &&
    bookingData.startTime;

  const handleSearch = () => {

    // ✅ Persist for refresh
    localStorage.setItem(
      "filters",
      JSON.stringify(filters)
    );

    localStorage.setItem(
      "bookingData",
      JSON.stringify(bookingData)
    );

    navigate("/patient/bookappointment/searchresults", {
      state: { filters, bookingData },
    });
  };

  if (loading) {
    return (
      <>
        <Navbar user={user} />
        <div className="min-h-screen flex items-center justify-center bg-teal-50">
          Loading profile...
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar user={user} />

      <div className="min-h-screen bg-teal-50 px-4 md:px-10 py-6">

        <div className="grid lg:grid-cols-4 gap-6">

          <div className="lg:col-span-1">
            <FiltersSidebar onChange={handleFiltersChange} />
          </div>

          <div className="lg:col-span-3 space-y-6">

            <div
              className={`transition ${!bookingData.appointmentDate
                  ? "opacity-40 pointer-events-none"
                  : ""
                }`}
            >
              <SlotSelector
                openingTime="09:00"
                closingTime="22:00"
                slotDuration={60}
                onSelect={handleSlotSelect}
              />
            </div>

            {!bookingData.appointmentDate && (
              <p className="text-sm text-gray-500 text-center">
                Please select a date to view available slots
              </p>
            )}


            <button
              disabled={!canSearch}
              onClick={handleSearch}
              className={`w-full py-4 rounded-2xl font-semibold transition
                ${canSearch
                  ? "bg-teal-600 text-white hover:bg-teal-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }
              `}
            >
              Search Available Centers
            </button>

          </div>
        </div>
      </div>
    </>
  );
}
