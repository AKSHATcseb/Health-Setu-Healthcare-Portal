export default function MedicalInfoCard({ bloodGroup, dialysisType }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">

      <h3 className="font-semibold text-lg mb-4 text-gray-900">
        Medical Information
      </h3>

      <div className="grid sm:grid-cols-2 gap-6 text-sm">

        <div>
          <p className="text-gray-500">Blood Group</p>
          <p className="font-medium">{bloodGroup || "-"}</p>
        </div>

        <div>
          <p className="text-gray-500">Dialysis Type</p>
          <p className="font-medium capitalize">
            {dialysisType || "-"}
          </p>
        </div>

      </div>
    </div>
  );
}
