import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppointmentsHeader from "../../components/MyAppointments/AppointmentsHeader";
import AppointmentFilters from "../../components/MyAppointments/AppointmentFilters";
import StatisticsCard from "../../components/MyAppointments/StatisticsCard";
import AppointmentsList from "../../components/MyAppointments/AppointmentsList";
import api from "../../services/api";

export default function MyAppointments() {
  const navigate = useNavigate();
  const { patientId } = useParams();

  const [activeFilter, setActiveFilter] = useState("all");
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Status Mapping
  const mapStatus = (status, date) => {
    if (status === "cancelled") return "cancelled";
    if (status === "completed") return "completed";

    const today = new Date();
    const appointmentDate = new Date(date);

    if (appointmentDate < today) return "completed";

    return "upcoming";
  };

  // 🔥 Fetch Appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const res = await api.get(
          `/api/appointment/all/${patientId}`
        );

        const backendData = res.data.appointments;

        setAppointmentsData(backendData || []);
        // console.log("Fetched appointments data:", backendData);

      } catch (error) {
        console.error("Fetch appointments error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) fetchAppointments();
  }, [patientId]);

  // console.log("appintmentsData state:", appointmentsData);
  // 🔥 Statistics
  const stats = {
    total: appointmentsData.length,
    completed: appointmentsData.filter((a) => a.status === "completed").length,
    upcoming: appointmentsData.filter((a) => a.status === "upcoming").length,
    cancelled: appointmentsData.filter((a) => a.status === "cancelled").length,
  };

  // 🔥 Handlers
  const handleEdit = (appointmentId) => {
    navigate(`/reschedule-appointment/${appointmentId}`);
  };

  const handleCancel = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      await api.put(`/api/appointment/cancel/${appointmentId}`);

      // ✅ Update UI instantly
      setAppointmentsData((prev) =>
        prev.map((a) =>
          a.id === appointmentId ? { ...a, status: "cancelled" } : a
        )
      );

    } catch (error) {
      console.error("Cancel failed:", error);
      alert("Failed to cancel appointment");
    }
  };

  const handleView = (appointmentId) => {
    navigate(`/appointment-details/${appointmentId}`);
  };

  const handleClearFilters = () => {
    setActiveFilter("all");
  };

  // 🔥 Loading UI
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold">Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-200">
      <AppointmentsHeader />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">

          {/* ✅ Statistics */}
          <StatisticsCard stats={stats} />

          {/* ✅ Filters */}
          <AppointmentFilters
            appointmentData={appointmentsData}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            onClearFilters={handleClearFilters}
          />

          {/* ✅ Appointments List */}
          <AppointmentsList
            appointments={appointmentsData}
            filter={activeFilter}
            onEdit={handleEdit}
            onCancel={handleCancel}
            onView={handleView}
          />

        </div>
      </div>
    </div>
  );
}