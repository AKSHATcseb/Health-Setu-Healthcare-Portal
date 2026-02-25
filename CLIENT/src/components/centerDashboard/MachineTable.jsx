import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Cpu } from "lucide-react";
import { getHospitalMachines } from "../../services/machineApi";

const AvailabilityBadge = ({ status }) => {

  const mapStatus = {
    available: {
      label: "Available",
      bg: "bg-green-100",
      text: "text-green-700",
      icon: <CheckCircle size={14} />,
    },
    in_use: {
      label: "Not Available",
      bg: "bg-red-100",
      text: "text-red-700",
      icon: <XCircle size={14} />,
    },
    maintenance: {
      label: "Not Available",
      bg: "bg-red-100",
      text: "text-red-700",
      icon: <XCircle size={14} />,
    },
  };

  const s = mapStatus[status];

  return (
    <span
      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}
    >
      {s.icon}
      {s.label}
    </span>
  );
};

const MachineTable = ({ hospitalId }) => {

  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hospitalId) return;

    const fetchMachines = async () => {
      try {
        const res = await getHospitalMachines(hospitalId);
        setMachines(res.data);
      } catch (err) {
        console.error("Failed to fetch machines:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMachines();
  }, [hospitalId]);

  if (loading) {
    return <div className="p-4 text-gray-400">Loading machines...</div>;
  }

  return (
    <div className="w-full bg-white rounded-3xl p-6 shadow-md">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Dialysis Machines
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Live availability status of machines
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="space-y-3">

        {machines.length === 0 ? (
          <div className="text-center py-10 text-gray-400 font-medium">
            No machines added yet
          </div>
        ) : (
          machines.map((machine) => (
            <div
              key={machine._id}
              className="
                flex items-center justify-between
                bg-slate-50 rounded-2xl px-5 py-4
                hover:bg-slate-100 transition
                border-l-4
                border-l-transparent hover:border-l-teal-500
              "
            >
              {/* LEFT */}
              <div className="flex items-center gap-4">
                <div className="bg-teal-100 text-teal-700 p-2 rounded-xl">
                  <Cpu size={18} />
                </div>

                <div>
                  <p className="font-semibold text-gray-800">
                    {machine.machineNumber}
                  </p>
                  <p className="text-xs text-gray-500">
                    Dialysis Machine
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              <AvailabilityBadge status={machine.status} />
            </div>
          ))
        )}

      </div>
    </div>
  );
};

export default MachineTable;
