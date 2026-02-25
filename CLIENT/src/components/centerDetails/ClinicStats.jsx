export default function ClinicStats({ hospital }) {
  return (
    <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

      <Stat
        title="Machines Available"
        value={hospital.totalMachines}
        unit="Units"
      />

      <Stat
        title="4 Hour Session"
        value={`₹${hospital.costPerSession4h}`}
      />

      <Stat
        title="6 Hour Session"
        value={`₹${hospital.costPerSession6h}`}
      />

      {hospital.emergencyService && (
        <Stat
          title="Emergency Session"
          value={`₹${hospital.emergencyCostPerSession}`}
          highlight
        />
      )}

    </div>
  );
}

function Stat({ title, value, unit, highlight }) {
  return (
    <div
      className={`p-6 rounded-3xl shadow-sm transition hover:shadow-md
        ${highlight
          ? "bg-gradient-to-r from-red-50 to-red-100"
          : "bg-white"
        }
      `}
    >
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-3xl font-bold mt-2 text-gray-900">
        {value} {unit}
      </p>
    </div>
  );
}
