import { useEffect, useState } from "react";
import {
  getHospitalAppointments,
  startSession,
  completeSession
} from "../../services/appointmentApi";

const StatusBadge = ({ status }) => {

  const mapStatus = {
    reserved: "Pending Approval",
    active: "Approved",
    completed: "Completed",
    cancelled: "Cancelled",
  };


  const styles = {
    "Pending Approval": "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
    Approved: "bg-green-100 text-green-700 ring-1 ring-green-200",
    Completed: "bg-gray-100 text-gray-700 ring-1 ring-gray-200",
    Cancelled: "bg-red-100 text-red-700 ring-1 ring-red-200",
  };


  const label = mapStatus[status];

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center ${styles[label]}`}
    >
      {label}
    </span>
  );
};

const AppointmentsTable = ({ hospitalId }) => {

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hospitalId) return;

    const fetchAppointments = async () => {
      try {
        const res = await getHospitalAppointments(hospitalId);
        setAppointments(res.data.appointments);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [hospitalId]);

  if (loading) {
    return <div className="p-4 text-gray-500">Loading appointments...</div>;
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm w-full">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h3 className="font-semibold text-gray-900 text-xl">
            Appointments Management
          </h3>
          <p className="text-sm text-gray-500">
            Review and manage dialysis appointments
          </p>
        </div>

        <input
          placeholder="Search by patient or machine ID"
          className="border rounded-xl px-4 py-2 text-sm w-full sm:w-64 focus:ring-2 focus:ring-teal-500 outline-none"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-separate border-spacing-y-2">

          <thead className="text-gray-500">
            <tr>
              <th className="text-left px-4 py-2">Machine ID</th>
              <th className="text-left px-4 py-2">Patient Name</th>
              <th className="text-left px-4 py-2">Start Time</th>
              <th className="text-left px-4 py-2">End Time</th>
              <th className="text-left px-4 py-2">Price</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="text-right px-4 py-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {appointments.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-10 text-gray-400 font-medium"
                >
                  No appointments yet
                </td>
              </tr>
            ) : (
              appointments.map((a) => (
                <tr
                  key={a._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow transition"
                >
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {a.machineId?.machineNumber || "—"}
                  </td>

                  <td className="px-4 py-3">
                    {a.patientId?.name}
                  </td>

                  <td className="px-4 py-3">{a.startTime}</td>
                  <td className="px-4 py-3">{a.endTime}</td>

                  <td className="px-4 py-3 font-semibold text-teal-700">
                    ₹{a.amount}
                  </td>

                  <td className="px-4 py-3">
                    <StatusBadge status={a.status} />
                  </td>

                  <td className="px-4 py-3 text-right space-x-2">

                    {/* APPROVE */}
                    {a.status === "reserved" && (
                      <button
                        onClick={async () => {
                          try {
                            await startSession(a._id);

                            setAppointments((prev) =>
                              prev.map((x) =>
                                x._id === a._id
                                  ? { ...x, status: "active" }
                                  : x
                              )
                            );
                          } catch {
                            alert("Failed to approve appointment");
                          }
                        }}
                        className="px-4 py-1.5 text-xs rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition"
                      >
                        Approve
                      </button>
                    )}

                    {/* COMPLETE */}
                    {a.status === "active" && (
                      <button
                        onClick={async () => {
                          try {
                            await completeSession(a._id);

                            setAppointments((prev) =>
                              prev.map((x) =>
                                x._id === a._id
                                  ? { ...x, status: "completed" }
                                  : x
                              )
                            );
                          } catch {
                            alert("Failed to complete session");
                          }
                        }}
                        className="px-4 py-1.5 text-xs rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                      >
                        Complete
                      </button>
                    )}

                    {/* NO ACTION */}
                    {(a.status === "completed" || a.status === "cancelled") && (
                      <span className="text-gray-400 text-xs">—</span>
                    )}

                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default AppointmentsTable;
