import React, { useEffect, useState } from "react";
import { Calendar, Clock, User, Phone, CheckCircle, X } from "lucide-react";
import api from "../../services/api";

export default function UpcomingAppointmentsCard({
  appointments,
  onApprove,
  onCancel,
}) {

  console.log("Appointments in Card:", appointments);
  const [patientsMap, setPatientsMap] = useState({});

  // ✅ Fetch patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        if (!appointments || appointments.length === 0) return;

        // Extract unique patientIds
        const uniqueIds = [
          ...new Set(appointments.map((a) => a.patientId)),
        ];

        const results = await Promise.all(
          uniqueIds.map((id) =>
            api.get(`/api/patient/${id}`).then((res) => ({
              id,
              data: res.data,
            }))
          )
        );

        const map = {};
        results.forEach((r) => {
          map[r.id] = r.data;
        });

        setPatientsMap(map);
      } catch (err) {
        console.error("Error fetching patients:", err);
      }
    };

    fetchPatients();
  }, [appointments]);

  const formatTime = (time) => {
    return new Date(`2024-01-01 ${time}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
  <div className="bg-[#F0FDFA] rounded-2xl border border-[#D1FAE5] p-6 shadow-sm">
    <h2 className="text-xl font-semibold text-[#0F766E] mb-5">
      Upcoming Appointments
    </h2>

    <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
      {appointments?.length > 0 ? (
        appointments.map((appointment) => {
          const patient = patientsMap[appointment.patientId] || {};
          const patientInfo = patient.patientFromPatientModel || {};

          return (
            <div
              key={appointment._id}
              className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition duration-200"
            >
              {/* HEADER */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-[#1ABC9C] text-white flex items-center justify-center font-bold">
                    {patientInfo.fullName
                      ? patientInfo.fullName.charAt(0).toUpperCase()
                      : "?"}
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {patientInfo.fullName || "Loading..."}
                    </p>
                    <p className="text-xs text-gray-500">
                      ID: {appointment._id.slice(-6)}
                    </p>
                  </div>
                </div>

                <span className="text-xs px-2 py-1 rounded-full bg-[#A8E6CF] text-[#0F766E] capitalize">
                  {appointment.status}
                </span>
              </div>

              {/* INFO GRID */}
              <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-[#1ABC9C]" />
                  {formatDate(appointment.appointmentDate)}
                </div>

                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-[#1ABC9C]" />
                  {appointment.slot?.slot}
                </div>

                <div className="flex items-center gap-2">
                  <User size={16} className="text-[#1ABC9C]" />
                  {patientInfo.age || "-"} yrs
                </div>

                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-[#1ABC9C]" />
                  {patientInfo.mobileNumber || "-"}
                </div>
              </div>

              {/* ACTIONS */}
              {appointment.status === "active" && (
                <div className="flex gap-3">

                  <button
                    onClick={() => onCancel(appointment._id)}
                    className="flex-1 flex items-center justify-center gap-1 bg-red-300 hover:bg-red-400 text-white rounded-lg py-2 text-sm transition"
                  >
                    <X size={16} />
                    Reject
                  </button>
                </div>
              )}
            </div>
          );
        })
      ) : (
        <p className="text-center text-sm text-gray-500">
          No upcoming appointments
        </p>
      )}
    </div>
  </div>
);
}