import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import Navbar from "../../components/patientDashboard/Navbar";
import Hero from "../../components/patientDashboard/Hero";
import QuickActions from "../../components/patientDashboard/QuickActions";
import RecentAppointments from "../../components/patientDashboard/RecentAppointments";
import HealthOverview from "../../components/patientDashboard/HealthOverview";
import Footer from "../../components/Footer";

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [user] = useState({
    name: auth.currentUser?.displayName || "John Doe",
    email: auth.currentUser?.email || "john@example.com",
  });

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col">
      <Navbar 
        user={user} 
        onLogout={handleLogout}
        onUpdateProfile={() => navigate("/patient/details")}
      />

      <div className="flex-1">
        <Hero user={user} />
        <QuickActions />
        <HealthOverview />
        <RecentAppointments />
      </div>

      <Footer />
    </div>
  );
}