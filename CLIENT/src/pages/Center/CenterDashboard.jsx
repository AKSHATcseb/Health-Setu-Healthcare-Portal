import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HospitalDashboardHeader from "../../components/centerDashboard/HospitalDashboardHeader";
import QuickStatsComponent from "../../components/centerDashboard/QuickStatsComponent";
import AppointmentStatusOverview from "../../components/centerDashboard/AppointmentStatusOverview";
import AppointmentsByDateChart from "../../components/centerDashboard/AppointmentsByDateChart";
import UpcomingAppointmentsCard from "../../components/centerDashboard/UpcomingAppointmentsCard";
import RecentActivityComponent from "../../components/centerDashboard/RecentActivityComponent";
import HospitalInfoCard from "../../components/centerDashboard/HospitalInfoCard";
import DialysisSeatsOccupancy from "../../components/centerDashboard/DialysisSeatsOccupancy";
import PatientsListComponent from "../../components/centerDashboard/PatientsListComponent";
import api, { setAuthToken } from "../../services/api";

export default function HospitalDashboard() {
  const navigate = useNavigate();
  const { id } = useParams(); // hospital id from URL: /center/dashboard/:id or similar

  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);

  // Derive a "user" object used by header (prefer hospital data)
  const userFromHospital = hospital
    ? { name: hospital.hospitalName || hospital.name || "Hospital", email: hospital.email || "" }
    : null;

  const userFallback = { name: "Center", email: "" };

  useEffect(() => {
    const init = async () => {
      await fetchHospital();
      await fetchAppointments(); // 👈 ADD THIS
    };

    init();
  }, [id, navigate]);

  useEffect(() => {
  console.log("Appointments actually updated:", appointments);
}, [appointments]);

  const fetchHospital = async () => {
    setLoading(true);
    setError("");
    try {
      // prefer session token (non-persistent) then local token
      const token = sessionStorage.getItem("token") || localStorage.getItem("token") || null;
      console.log("Token found (session/local):", !!token);
      if (token) {
        setAuthToken(token);
      } else {
        setAuthToken(null);
      }

      if (!id) {
        setError("Invalid URL: missing hospital id");
        setLoading(false);
        return;
      }

      console.log("Calling GET /api/hospital/" + id);
      const res = await api.get(`/api/hospital/${id}`);
      const hospitalDetails = res.data.hospitalFromHospitalModel ?? null;
      console.log("hospitalDetails fetched:", res.data.hospitalFromHospitalModel);
      setHospital(hospitalDetails);
    } catch (err) {
      console.error("Error fetching hospital:", err);
      if (err.response) {
        console.error("Response status:", err.response.status, "data:", err.response.data);
        if (err.response.status === 400) {
          // invalid id or bad request -> redirect to center details form to re-create/complete
          navigate("/center/detailsForm");
          return;
        }
        if (err.response.status === 404) {
          // not found -> redirect to details form to create
          navigate("/center/detailsForm");
          return;
        } else if (err.response.status === 401) {
          setError("Unauthorized. Please login again.");
          // clear stored token and auth header
          sessionStorage.removeItem("token");
          localStorage.removeItem("token");
          setAuthToken(null);
          navigate("/login", { replace: true });
          return;
        } else if (err.response.status === 403) {
          setError("Forbidden. You don't have access to this hospital.");
        } else {
          setError(err.response.data?.message || "Unable to load hospital data. Please try again later.");
        }
      } else if (err.request) {
        console.error("No response received. Request:", err.request);
        setError("No response from server. Check network or CORS.");
      } else {
        console.error("Request setup error:", err.message);
        setError(err.message || "Error fetching hospital data.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    if (!id) return;

    setAppointmentsLoading(true);
    try {
      const token =
        sessionStorage.getItem("token") ||
        localStorage.getItem("token") ||
        null;

      if (token) {
        setAuthToken(token);
      }

      console.log("Fetching appointments for hospital:", id);

      const res = await api.get(`/api/hospital/appointments/${id}`);

      // adjust based on your backend response structure
      const appointmentsData =
        res.data.appointments || res.data.data || [];

      console.log("Appointments fetched:", appointmentsData);

      setAppointments(appointmentsData);
      console.log("Appointments state updated:", appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setAppointmentsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      setAuthToken(null);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleEditPatient = (patientId) => {
    console.log("Edit patient:", patientId);
    navigate(`/patient-details/${patientId}`);
  };

  const handleDeletePatient = (patientId) => {
    console.log("Delete patient:", patientId);
    alert("Patient deleted!");
  };

  const handleApproveAppointment = (appointmentId) => {
    console.log("Approved appointment:", appointmentId);
    alert("Appointment approved!");
  };

  const handleCancelAppointment = (appointmentId) => {
    console.log("Cancelled appointment:", appointmentId);
    alert("Appointment cancelled!");
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="max-w-xl text-center p-6 bg-white rounded-xl shadow">
          <h2 className="text-lg font-semibold text-red-600">Error</h2>
          <p className="mt-2 text-sm text-gray-600">{error}</p>
          <div className="mt-4">
            <button onClick={() => navigate("/")} className="px-4 py-2 bg-blue-600 text-white rounded">
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Build display data - fallback to sensible values if some fields missing
  const hospitalData = {
    name: hospital?.hospitalName || hospital?.name || "City Dialysis Center",
    address: hospital?.address || "123 Medical Plaza, Healthcare District, City, State 12345",
    phone: hospital?.phone || "+1 (555) 123-4567",
    is24x7: !!hospital?.is24x7,
    hours: hospital?.is24x7 ? "Open 24x7" : hospital?.operatingHours?.Monday ? `${hospital.operatingHours.Monday.open} - ${hospital.operatingHours.Monday.close}` : "7:00 AM - 9:00 PM",
    dialysisSeats: hospital?.dialysisSeats ?? hospital?.totalMachines ?? 20,
  };

  // quick stats and lists can be derived or mocked until you add real endpoints
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

  const appointmentStatusData = {
    upcoming: 12,
    completed: 124,
    pending: 15,
    cancelled: 5,
    noShow: 0,
  };

  const appointmentsByDate = [
    { date: "Mon", booked: 8, completed: 6, cancelled: 1 },
    { date: "Tue", booked: 12, completed: 10, cancelled: 1 },
    { date: "Wed", booked: 10, completed: 9, cancelled: 0 },
    { date: "Thu", booked: 14, completed: 13, cancelled: 1 },
    { date: "Fri", booked: 11, completed: 10, cancelled: 0 },
    { date: "Sat", booked: 7, completed: 6, cancelled: 1 },
    { date: "Sun", booked: 5, completed: 4, cancelled: 0 },
  ];

  const upcomingAppointments = appointments.filter(
    (appt) => appt.status === "pending" || appt.status === "approved" || appt.status === "active"
  );

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

  const totalSeats = hospitalData.dialysisSeats;
  const occupiedSeats = Math.min(totalSeats, 15); // example

  const userToShow = userFromHospital || userFallback;
  console.log("HospitalDashboard rendering with user:", userToShow, "hospital:", hospital);

  return (
    <div className="min-h-screen bg-slate-100">
      <HospitalDashboardHeader hospitalName={hospital.hospitalName
      } unreadNotifications={3} onLogout={handleLogout} />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Quick Stats */}
          <QuickStatsComponent appointments={appointments} />

          {/* Info Cards */}
          <div className="space-y-6">
            <div className="max-h-100 overflow-y-auto">
              <HospitalInfoCard hospitalInfo={hospital} />
            </div>
            <DialysisSeatsOccupancy totalSeats={totalSeats} occupiedSeats={occupiedSeats} />
          </div>

          <div className="lg:col-span-2">
            <UpcomingAppointmentsCard
              appointments={upcomingAppointments}
              onApprove={handleApproveAppointment}
              onCancel={handleCancelAppointment}
            />
          </div>
        </div>
      </div>
    </div>
  );
}