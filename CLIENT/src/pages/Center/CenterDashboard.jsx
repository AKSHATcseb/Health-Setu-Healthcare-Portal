import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HospitalDashboardHeader from "../../components/centerDashboard/HospitalDashboardHeader";
import QuickStatsComponent from "../../components/centerDashboard/QuickStatsComponent";
import AppointmentStatusOverview from "../../components/centerDashboard/AppointmentStatusOverview";
import AppointmentsByDateChart from "../../components/centerDashboard/AppointmentsByDateChart";
import UpcomingAppointmentsCard from "../../components/centerDashboard/UpcomingAppointmentsCard";
import RecentActivityComponent from "../../components/centerDashboard/RecentActivityComponent";
import HospitalInfoCard from "../../components/centerDashboard/HospitalInfoCard";
import DialysisSeatsOccupancy from "../../components/centerDashboard/DialysisSeatsOccupancy";
import PatientsListComponent from "../../components/centerDashboard/PatientsListComponent";

export default function CenterDashboard() {
  const navigate = useNavigate();

  // Sample hospital data
  const hospitalData = {
    name: "City Dialysis Center",
    address: "123 Medical Plaza, Healthcare District, City, State 12345",
    phone: "+1 (555) 123-4567",
    is24x7: false,
    hours: "7:00 AM - 9:00 PM",
    dialysisSeats: 20,
  };

  // Sample stats
  const stats = {
    totalAppointments: 156,
    completed: 124,
    pending: 15,
    upcoming: 12,
    cancelled: 5,
    noShow: 0,
    appointmentTrend: 5.2,
    completedTrend: 3.1,
    pendingTrend: -2.3,
    upcomingTrend: 1.5,
  };

  // Sample appointment status data
  const appointmentStatusData = {
    upcoming: 12,
    completed: 124,
    pending: 15,
    cancelled: 5,
    noShow: 0,
  };

  // Sample appointments by date
  const appointmentsByDate = [
    { date: "Mon", booked: 8, completed: 6, cancelled: 1 },
    { date: "Tue", booked: 12, completed: 10, cancelled: 1 },
    { date: "Wed", booked: 10, completed: 9, cancelled: 0 },
    { date: "Thu", booked: 14, completed: 13, cancelled: 1 },
    { date: "Fri", booked: 11, completed: 10, cancelled: 0 },
    { date: "Sat", booked: 7, completed: 6, cancelled: 1 },
    { date: "Sun", booked: 5, completed: 4, cancelled: 0 },
  ];

  // Sample upcoming appointments
  const upcomingAppointments = [
    {
      id: 1,
      appointmentId: "APT-001",
      patientName: "John Doe",
      date: "2026-03-01",
      time: "09:00",
      age: 45,
      phone: "555-1234",
      status: "pending",
    },
    {
      id: 2,
      appointmentId: "APT-002",
      patientName: "Jane Smith",
      date: "2026-03-01",
      time: "10:30",
      age: 38,
      phone: "555-5678",
      status: "approved",
    },
    {
      id: 3,
      appointmentId: "APT-003",
      patientName: "Robert Wilson",
      date: "2026-03-02",
      time: "14:00",
      age: 52,
      phone: "555-9012",
      status: "pending",
    },
  ];

  // Sample recent activities
  const recentActivities = [
    {
      type: "approval",
      title: "Appointment Approved",
      description: "John Doe's appointment for Mar 1 was approved",
      timestamp: new Date(Date.now() - 10 * 60000),
    },
    {
      type: "booking",
      title: "New Booking",
      description: "Jane Smith booked an appointment for Mar 1",
      timestamp: new Date(Date.now() - 30 * 60000),
    },
    {
      type: "cancellation",
      title: "Appointment Cancelled",
      description: "Michael Brown cancelled appointment",
      timestamp: new Date(Date.now() - 2 * 3600000),
    },
    {
      type: "rejection",
      title: "Appointment Rejected",
      description: "Insufficient seat availability",
      timestamp: new Date(Date.now() - 5 * 3600000),
    },
  ];

  // Sample patients
  const recentPatients = [
    {
      id: 1,
      name: "John Doe",
      phone: "+1 (555) 123-4567",
      bloodGroup: "O+",
      lastVisit: "2026-02-28",
    },
    {
      id: 2,
      name: "Jane Smith",
      phone: "+1 (555) 987-6543",
      bloodGroup: "A+",
      lastVisit: "2026-02-27",
    },
    {
      id: 3,
      name: "Robert Wilson",
      phone: "+1 (555) 456-7890",
      bloodGroup: "B+",
      lastVisit: "2026-02-26",
    },
    {
      id: 4,
      name: "Sarah Johnson",
      phone: "+1 (555) 321-0987",
      bloodGroup: "AB-",
      lastVisit: "2026-02-25",
    },
  ];

  // Dialysis seat occupancy
  const totalSeats = 20;
  const occupiedSeats = 15;

  // Handlers
  const handleApproveAppointment = (appointmentId) => {
    console.log("Approved appointment:", appointmentId);
    alert("Appointment approved!");
  };

  const handleCancelAppointment = (appointmentId) => {
    console.log("Cancelled appointment:", appointmentId);
    alert("Appointment cancelled!");
  };

  const handleEditPatient = (patientId) => {
    console.log("Edit patient:", patientId);
    navigate(`/patient-details/${patientId}`);
  };

  const handleDeletePatient = (patientId) => {
    console.log("Delete patient:", patientId);
    alert("Patient deleted!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <HospitalDashboardHeader
        hospitalName={hospitalData.name}
        unreadNotifications={3}
      />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Quick Stats */}
          <QuickStatsComponent stats={stats} />

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Left Column - Charts */}
            <div className="lg:col-span-2 space-y-6">
              {/* Appointment Status Overview */}
              <AppointmentStatusOverview data={appointmentStatusData} />

              {/* Appointments by Date */}
              <AppointmentsByDateChart data={appointmentsByDate} />
            </div>

            {/* Right Column - Info Cards */}
            <div className="space-y-6">
              {/* Hospital Info */}
              <HospitalInfoCard hospitalInfo={hospitalData} />

              {/* Dialysis Seats */}
              <DialysisSeatsOccupancy
                totalSeats={totalSeats}
                occupiedSeats={occupiedSeats}
              />
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upcoming Appointments */}
            <div className="lg:col-span-2">
              <UpcomingAppointmentsCard
                appointments={upcomingAppointments}
                onApprove={handleApproveAppointment}
                onCancel={handleCancelAppointment}
              />
            </div>

            {/* Recent Activity */}
            <RecentActivityComponent activities={recentActivities} />
          </div>

          {/* Patients Table */}
          <div className="mt-6">
            <PatientsListComponent
              patients={recentPatients}
              onEdit={handleEditPatient}
              onDelete={handleDeletePatient}
            />
          </div>
        </div>
      </div>
    </div>
  );
}