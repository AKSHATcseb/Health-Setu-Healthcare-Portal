import React, { useEffect, useState } from "react";
import { Calendar, Clock, User, Phone, CheckCircle, X } from "lucide-react";
import api from "../../services/api";

export default function UpcomingAppointmentsCard({
  appointments,
  onApprove,
  onCancel,
}) {
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
    <div className="bg-white rounded-2xl border-2 border-gray-300 p-6 shadow-md">
      <h2 className="text-lg font-bold text-gray-900 mb-4">
        Upcoming Appointments
      </h2>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {appointments?.length > 0 ? (
          appointments.map((appointment) => {
            const patient = patientsMap[appointment.patientId] || {};
            const patientInfo = patient.patientFromPatientModel || {};
            console.log("Patient Info:", patientInfo);

            return (
              <div
                key={appointment._id}
                className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg p-4 border-2 border-blue-200"
              >
                {/* Header */}
                <div className="flex justify-between mb-3">
                  <div>
                    <p className="font-bold text-sm">

                      {patientInfo.fullName || "Loading..."}
                    </p>
                    <p className="text-xs text-gray-600">
                      ID: {appointment._id.slice(-6)}
                    </p>
                  </div>

                  <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                    {appointment.status}
                  </span>
                </div>

                {/* Info */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="flex gap-2 items-center">
                    <Calendar size={14} />
                    {formatDate(appointment.appointmentDate)}
                  </div>

                  <div className="flex gap-2 items-center">
                    <Clock size={14} />
                    {appointment.slot?.slot}
                  </div>

                  <div className="flex gap-2 items-center">
                    <User size={14} />
                    {patientInfo.age || "-"} yrs
                  </div>

                  <div className="flex gap-2 items-center">
                    <Phone size={14} />
                    {patientInfo.phone || "-"}
                  </div>
                </div>

                {/* Actions */}
                {appointment.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => onApprove(appointment._id)}
                      className="flex-1 bg-green-100 text-green-700 rounded px-3 py-2 text-xs"
                    >
                      <CheckCircle size={14} /> Approve
                    </button>

                    <button
                      onClick={() => onCancel(appointment._id)}
                      className="flex-1 bg-red-100 text-red-700 rounded px-3 py-2 text-xs"
                    >
                      <X size={14} /> Reject
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