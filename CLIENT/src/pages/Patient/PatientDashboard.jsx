import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/patientDashboard/Navbar";
import Hero from "../../components/patientDashboard/Hero";
import QuickActions from "../../components/patientDashboard/QuickActions";
import RecentAppointments from "../../components/patientDashboard/RecentAppointments";
import HealthOverview from "../../components/patientDashboard/HealthOverview";
import Footer from "../../components/Footer";
import api, { setAuthToken } from "../../services/api";

export default function PatientDashboard() {
  const navigate = useNavigate();
  const { id } = useParams(); // patient id from URL: /patient/dashboard/:id

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Build a "user" object used by Navbar/Hero (prefer patient data)
  const userFromPatient = patient
    ? { name: patient.fullName || `${patient.firstName || ""} ${patient.lastName || ""}`.trim(), email: patient.email }
    : null;

  // Fallback user if patient data not available yet
  const userFallback = { name: "Patient", email: "" };

// (snippet to replace the existing useEffect block in PatientDashboard)
useEffect(() => {
  console.log("PatientDashboard page loaded");
  const fetchPatient = async () => {
    setLoading(true);
    setError("");
    try {
      // prefer session token (non-persistent) then local token
      const token = sessionStorage.getItem("token") || localStorage.getItem("token") || null;
      console.log("Token found (session/local):", token);
      if (token) {
        setAuthToken(token);
      } else {
        // ensure no stale auth header remains
        setAuthToken(null);
      }

      if (!id) {
        setError("Invalid URL: missing patient id");
        setLoading(false);
        return;
      }

      // call backend
      console.log("Calling GET /api/patient/" + id);
      const res = await api.get(`/api/patient/${id}`);
      // console.log("GET /api/patient/:id response:", res.data);
      setPatient(res.data?.patientFromPatientModel ?? res.data ?? null);
      // console.log("Patient data set in state:", res.data.patientFromPatientModel ?? null);
    } catch (err) {
      // Detailed debug logging
      console.error("Error fetching patient:", err);
      if (err.response) {
        // server responded with a status code
        console.error("Response status:", err.response.status, "data:", err.response.data);
        if(err.response.status === 400) {
          navigate("/patient/detailsForm"); // redirect to dashboard without id, which should show error and prompt to complete profile
          return;
        }
        if (err.response.status === 404) {
          navigate("/patient/detailsForm"); // redirect to dashboard without id, which should show error and prompt to complete profile
        } else if (err.response.status === 401) {
          setError("Unauthorized. Please login again.");
          // clear stored token and auth header
          sessionStorage.removeItem("token");
          localStorage.removeItem("token");
          setAuthToken(null);
          navigate("/login", { replace: true });
        } else if (err.response.status === 403) {
          setError("Forbidden. You don't have access to this patient.");
        } else {
          setError(err.response.data?.message || "Unable to load patient data. Please try again later.");
        }
      } else if (err.request) {
        // request made but no response (network / CORS issue)
        console.error("No response received (possible network/CORS issue). Request:", err.request);
        setError("No response from server. Check network or CORS.");
      } else {
        // something else
        console.error("Request setup error:", err.message);
        setError(err.message || "Error fetching patient data.");
      }
    } finally {
      setLoading(false);
    }
  };

  fetchPatient();
}, [id, navigate]);

  const handleLogout = async () => {
    try {
      // Clear auth token and redirect to login
      localStorage.removeItem("token");
      setAuthToken(null);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Navigate to profile edit/complete page.
  const handleUpdateProfile = () => {
    navigate(`/patient/detailsForm/${id}`);
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
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Use patient data if available, otherwise fallback
  const userToShow = userFromPatient || userFallback;
  console.log("PatientDashboard rendering with user:", userToShow, "patient:", patient);

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col">
      <Navbar
        user={userToShow}
        onLogout={handleLogout}
        onUpdateProfile={handleUpdateProfile}
      />

      <div className="flex-1">
        <Hero user={userToShow} patient={patient} />
        <QuickActions patient={patient} />
        <HealthOverview patient={patient} />
        <RecentAppointments patient={patient} />
      </div>

      <Footer />
    </div>
  );
}