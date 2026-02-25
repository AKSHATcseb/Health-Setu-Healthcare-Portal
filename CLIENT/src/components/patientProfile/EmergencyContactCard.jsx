export default function EmergencyContactCard({
  emergencyName,
  emergencyRelation,
  emergencyPhone,
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">

      <h3 className="font-semibold text-lg mb-4 text-gray-900">
        Emergency Contact
      </h3>

      <div className="space-y-3 text-sm">

        <Info label="Name" value={emergencyName} />
        <Info label="Relation" value={emergencyRelation} />
        <Info label="Phone" value={emergencyPhone} />

      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value || "-"}</span>
    </div>
  );
}
