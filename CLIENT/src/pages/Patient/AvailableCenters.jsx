import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { auth } from "../../firebase";

import Navbar from "../../components/patientDashboard/Navbar";
import CenterCard from "../../components/bookingPage/CenterCard";

export default function AvailableCenters() {

  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state;

  const filters =
    state?.filters || JSON.parse(localStorage.getItem("filters"));

  const bookingData =
    state?.bookingData || JSON.parse(localStorage.getItem("bookingData"));

  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);

  // ------------------------------------------------
  // ✅ Convert 12h AM/PM to 24h format
  // ------------------------------------------------
  const convertTo24Hour = (time12h) => {
    if (!time12h) return "";

    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");

    if (modifier === "PM" && hours !== "12") {
      hours = String(Number(hours) + 12);
    }

    if (modifier === "AM" && hours === "12") {
      hours = "00";
    }

    return `${hours.padStart(2, "0")}:${minutes}`;
  };

  // ---------------------------------------------
  // ✅ FETCH PATIENT PROFILE
  // ---------------------------------------------
  useEffect(() => {
    const fetchProfile = async () => {
      
      try {
        const user = auth.currentUser;
        if (!user) return navigate("/login");

        const token = await user.getIdToken();

        const res = await api.get(
          "/api/users/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPatient(res.data);
      } catch (err) {
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  // ---------------------------------------------
  // ✅ FETCH SLOT AVAILABLE HOSPITALS
  // ---------------------------------------------
  useEffect(() => {

    if (!filters || !bookingData) return;

    const fetchAvailableCenters = async () => {
      try {
        console.log( `AvailableCenters : ${centers}`);
        setLoading(true);

        // ✅ Convert startTime to 24h format
        const startTime24h = convertTo24Hour(
          bookingData.startTime
        );

        const params = {
          date: filters.date,
          startTime: startTime24h,   // ✅ CLEAN TIME
          duration: bookingData.durationHours,
        };

        console.log("📡 Slot Search Params:", params);

        const res = await api.get(
          "/api/hospitals/available-slot",
          { params }
        );

        console.log("🏥 Available Hospitals Response:", res.data);

        let hospitals = res.data.hospitals || [];

        // ---------------------------------------------
        // ✅ Apply Max Price Filter
        // ---------------------------------------------
        if (filters.useAdvancedFilters) {
          hospitals = hospitals.filter(
            (h) => h.cost <= filters.price
          );
        }

        // ---------------------------------------------
        // ✅ Sort Cheapest First
        // ---------------------------------------------
        hospitals.sort((a, b) => a.cost - b.cost);

        setCenters(hospitals);

      } catch (err) {
        console.error("❌ Slot hospital fetch failed:", err);
        setCenters([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableCenters();

  }, [filters, bookingData]);

  // ---------------------------------------------
  // ✅ SAFETY CHECK
  // ---------------------------------------------
  if (!filters || !bookingData) {
    return (
      <div className="p-10 text-center text-gray-600">
        No booking data found.
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-teal-50 px-4 md:px-10 py-6">

        {/* SUMMARY */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">

          <h2 className="text-lg font-semibold mb-4">
            Appointment Summary
          </h2>

          <div className="grid md:grid-cols-6 gap-4 text-sm text-gray-700">

            <div>
              <p className="text-gray-400">Patient</p>
              <p>{patient?.name || "Loading..."}</p>
            </div>

            <div>
              <p className="text-gray-400">Date</p>
              <p>{filters.date}</p>
            </div>

            <div>
              <p className="text-gray-400">Start Time</p>
              <p>{bookingData.startTime}</p>
            </div>

            <div>
              <p className="text-gray-400">Duration</p>
              <p>{bookingData.durationHours} Hours</p>
            </div>

            <div>
              <p className="text-gray-400">Type</p>
              <p>
                {bookingData.isEmergency ? "Emergency" : "Regular"}
              </p>
            </div>

            <div>
              <p className="text-gray-400">Max Price</p>
              <p>
                {filters.useAdvancedFilters
                  ? `₹${filters.price}`
                  : "No Preference"}
              </p>
            </div>

          </div>
        </div>

        {/* LIST */}
        <h2 className="text-lg font-semibold mb-4">
          Available Dialysis Centers
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">
            Loading centers...
          </p>
        ) : centers.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl text-center shadow">
            No hospitals available for this time slot 😔
          </div>
        ) : (
          <CenterCard
            centers={centers}
            bookingData={bookingData}
            onSelect={(center) => {

              localStorage.setItem(
                "selectedCenter",
                JSON.stringify(center)
              );

              navigate(
                "/patient/bookappointment/searchresults/confirm",
                {
                  state: {
                    filters,
                    bookingData,
                    center,
                    patient,
                  },
                }
              );
            }}
          />
        )}

      </div>
    </>
  );
}
