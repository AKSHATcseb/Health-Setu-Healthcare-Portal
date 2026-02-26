import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppointmentsHeader from "../../components/MyAppointments/AppointmentsHeader";
import AppointmentFilters from "../../components/MyAppointments/AppointmentFilters";
import StatisticsCard from "../../components/MyAppointments/StatisticsCard";
import AppointmentsList from "../../components/MyAppointments/AppointmentsList";

export default function MyAppointments() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");

  // Sample appointments data - Replace with actual API data
  const appointmentsData = [
    {
      id: 1,
      hospitalName: "City Dialysis Center",
      hospitalAddress: "123 Medical Plaza",
      doctorName: "Dr. Sarah Johnson",
      date: "2026-03-15",
      timeSlot: "10:00 AM - 10:30 AM",
      status: "upcoming",
    },
    {
      id: 2,
      hospitalName: "Advanced Nephrology Clinic",
      hospitalAddress: "456 Health Avenue",
      doctorName: "Dr. James Wilson",
      date: "2026-03-10",
      timeSlot: "2:00 PM - 2:30 PM",
      status: "pending",
    },
    {
      id: 3,
      hospitalName: "Metropolitan Hospital",
      hospitalAddress: "789 Care Street",
      doctorName: "Dr. Emily Chen",
      date: "2026-02-28",
      timeSlot: "9:30 AM - 10:00 AM",
      status: "completed",
    },
    {
      id: 4,
      hospitalName: "Riverside Medical Center",
      hospitalAddress: "321 River Road",
      doctorName: "Dr. Michael Brown",
      date: "2026-03-20",
      timeSlot: "11:00 AM - 11:30 AM",
      status: "upcoming",
    },
    {
      id: 5,
      hospitalName: "Central Health Clinic",
      hospitalAddress: "654 Central Lane",
      doctorName: "Dr. Lisa Anderson",
      date: "2026-02-15",
      timeSlot: "1:00 PM - 1:30 PM",
      status: "completed",
    },
    {
      id: 6,
      hospitalName: "Westside Nephrology",
      hospitalAddress: "987 West Way",
      doctorName: "Dr. Robert Taylor",
      date: "2026-03-05",
      timeSlot: "3:00 PM - 3:30 PM",
      status: "cancelled",
    },
    {
      id: 7,
      hospitalName: "East Coast Dialysis",
      hospitalAddress: "111 East Street",
      doctorName: "Dr. Patricia Martinez",
      date: "2026-03-12",
      timeSlot: "10:00 AM - 10:30 AM",
      status: "upcoming",
    },
    {
      id: 8,
      hospitalName: "University Hospital",
      hospitalAddress: "222 College Road",
      doctorName: "Dr. David Lee",
      date: "2026-02-20",
      timeSlot: "2:30 PM - 3:00 PM",
      status: "completed",
    },
    {
      id: 9,
      hospitalName: "Premier Care Center",
      hospitalAddress: "333 Premier Boulevard",
      doctorName: "Dr. Karen White",
      date: "2026-03-18",
      timeSlot: "4:00 PM - 4:30 PM",
      status: "pending",
    },
  ];

  // Calculate statistics
  const stats = {
    total: appointmentsData.length,
    completed: appointmentsData.filter((a) => a.status === "completed").length,
    upcoming: appointmentsData.filter((a) => a.status === "upcoming").length,
    cancelled: appointmentsData.filter((a) => a.status === "cancelled").length,
  };

  // Handler functions
  const handleEdit = (appointmentId) => {
    console.log("Edit appointment:", appointmentId);
    navigate(`/reschedule-appointment/${appointmentId}`);
  };

  const handleCancel = (appointmentId) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      console.log("Cancel appointment:", appointmentId);
      // Call API to cancel appointment
    }
  };

  const handleView = (appointmentId) => {
    console.log("View appointment:", appointmentId);
    navigate(`/appointment-details/${appointmentId}`);
  };

  const handleClearFilters = () => {
    setActiveFilter("all");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <AppointmentsHeader />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Statistics */}
          <StatisticsCard stats={stats} />

          {/* Filters */}
          <AppointmentFilters
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            onClearFilters={handleClearFilters}
          />

          {/* Appointments List */}
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