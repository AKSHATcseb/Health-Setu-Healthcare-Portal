import { useEffect, useState } from "react";
import AppointmentsTable from "../../components/centerDashboard/AppointmentsTable";
import MachineTable from "../../components/centerDashboard/MachineTable";
import PricingCard from "../../components/centerDashboard/PricingCard";
import Sidebar from "../../components/centerDashboard/Sidebar";
import StatsCard from "../../components/centerDashboard/StatsCard";
import TopBar from "../../components/centerDashboard/TopBar";
import { getMyHospital } from "../../services/hospitalApi";
import { getHospitalAppointments } from "../../services/appointmentApi";

const Dashboard = () => {

  const [hospital, setHospital] = useState(null);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hospitalRes = await getMyHospital();
        setHospital(hospitalRes.data);

        const apptRes = await getHospitalAppointments(hospitalRes.data._id);
        setAppointments(apptRes.data.appointments);

      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  /* ================= STATS CALCULATIONS ================= */

  const pendingCount = appointments.filter(
    a => a.status === "reserved"
  ).length;

  const completedCount = appointments.filter(
    a => a.status === "completed"
  ).length;

  const completedToday = appointments.filter(a => {
    const today = new Date().toDateString();
    const date = new Date(a.appointmentDate).toDateString();
    return a.status === "completed" && today === date;
  }).length;

  /* ===================================================== */

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <main className="flex-1 p-6 space-y-6">

        <TopBar
          hospitalName={hospital?.name}
          email={hospital?.email}
          phone={hospital?.phone}
          street={hospital?.address?.street}
          city={hospital?.address?.city}
          state={hospital?.address?.state}
          pincode={hospital?.address?.pincode}
          upiId={hospital?.upiId}
        />

        {/* ================= STATS ================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <StatsCard
            title="Total Dialysis Machines"
            value={hospital?.totalMachines}
          />

          <StatsCard
            title="Available Machines"
            value={hospital?.availableMachines}
            highlight="green"
          />

          <StatsCard
            title="Pending Requests"
            value={pendingCount}
            highlight="yellow"
          />

          <StatsCard
            title="Completed Sessions"
            value={completedCount}   // use completedToday if you prefer daily
            highlight="blue"
          />

        </div>

        {/* ================= PRICING ================= */}

        <PricingCard 
          cost4h={hospital?.costPerSession4h}
          cost6h={hospital?.costPerSession6h} 
          emergencyCost={hospital?.emergencyCostPerSession}
        />

        {/* ================= TABLES ================= */}

        <AppointmentsTable hospitalId={hospital?._id} />
        {/* <MachineTable hospitalId={hospital?._id} /> */}

      </main>
    </div>
  );
};

export default Dashboard;
