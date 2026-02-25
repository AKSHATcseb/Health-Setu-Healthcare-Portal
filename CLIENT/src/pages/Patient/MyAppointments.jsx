import { useState, useEffect } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/patientDashboard/Navbar";
import PageHeader from "../../components/MyAppointments/PageHeader";
import AppointmentCard from "../../components/MyAppointments/AppointmentCard";
import PastAppointmentCard from "../../components/MyAppointments/PastAppointmentCard";
import { getMe } from "../../services/userApi";

import { auth } from "../../firebase";

const MyAppointments = () => {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch appointments + profile safely
  useEffect(() => {

    const fetchData = async () => {
      try {
        // ----- Profile -----
        const profileRes = await getMe();
        setUser(profileRes.data);

        // ----- Appointments -----
        if (!auth.currentUser) return;

        const token = await auth.currentUser.getIdToken();

        const apptRes = await api.get(
          "/api/appointments/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAppointments(apptRes.data.appointments || []);

      } catch (err) {
        console.error(err);

        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          setError("Failed to load appointments");
        }

      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, [navigate]);

  // ------------------------------------

  if (loading) {
    return (
      <>
        <Navbar user={user} />
        <div className="px-10 py-10 text-center text-gray-600">
          Loading appointments...
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar user={user} />
        <div className="px-10 py-10 text-center text-red-500">
          {error}
        </div>
      </>
    );
  }

  // ⏰ Current time
  const now = new Date();

  // 🔮 Upcoming
  const upcomingAppointments = appointments.filter(
    (a) =>
      new Date(a.appointmentDate) >= now &&
      (a.status === "reserved" || a.status === "active")
  );

  // ⏳ Past
  const pastAppointments = appointments.filter(
    (a) =>
      new Date(a.appointmentDate) < now ||
      ["completed", "cancelled", "expired"].includes(a.status)
  );

  return (
    <>
      <Navbar user={user} />

      <div className="px-10 bg-teal-50 py-5 min-h-screen">

        <PageHeader hasAppointments={appointments.length > 0} />


        {/* 🔮 UPCOMING */}
        <section className="space-y-4 mt-6">

          {upcomingAppointments.length === 0 ? (
            <p className="text-gray-500">
              No upcoming appointments
            </p>
          ) : (
            upcomingAppointments.map((appt) => (
              <AppointmentCard
                key={appt._id}
                appointment={appt}
              />
            ))
          )}

        </section>

        {/* ⏳ PAST */}
        <section className="mt-12">

          <h2 className="font-semibold text-lg mb-5">
            ⏳ Past Appointments
          </h2>

          {pastAppointments.length === 0 ? (
            <p className="text-gray-500">
              No past appointments
            </p>
          ) : (
            <div className="space-y-4">
              {pastAppointments.map((appt) => (
                <PastAppointmentCard
                  key={appt._id}
                  name={appt.hospitalId?.name || "Unknown Center"}
                  date={new Date(appt.appointmentDate).toLocaleDateString()}
                  time={`${appt.startTime} - ${appt.endTime}`}
                  submitted={appt.status === "completed"}
                />
              ))}
            </div>
          )}

        </section>

      </div>
    </>
  );
};

export default MyAppointments;
