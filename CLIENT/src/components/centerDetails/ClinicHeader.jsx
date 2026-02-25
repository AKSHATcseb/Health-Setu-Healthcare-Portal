export default function ClinicHeader({ hospital }) {
  return (
    <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg">

      {/* Cover */}
      <div className="h-56 relative">
        <img
          src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3"
          className="w-full h-full object-cover"
          alt="clinic"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">

        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            {hospital.name}
          </h1>

          <p className="text-gray-600 mt-1">
            📍 {hospital.address.street}, {hospital.address.city}, {hospital.address.state} - {hospital.address.pincode}
          </p>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-3">

          <span className="bg-teal-100 text-teal-700 px-4 py-1 rounded-full text-sm font-medium">
            {hospital.is24x7 ? "24/7 Open" : "Limited Hours"}
          </span>

          <span className={`px-4 py-1 rounded-full text-sm font-medium ${
            hospital.emergencyService
              ? "bg-red-100 text-red-600"
              : "bg-gray-100 text-gray-500"
          }`}>
            {hospital.emergencyService
              ? "Emergency Available"
              : "No Emergency"}
          </span>

          <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium">
            {hospital.type}
          </span>

        </div>

        {/* Timing */}
        <div className="text-sm text-gray-600 space-y-1">

          {hospital.is24x7 ? "" : <p>
            🗓 Working Days: {hospital.workingDays.join(", ")}
          </p>}

          

          {!hospital.is24x7 && (
            <p>
              ⏰ Timings: {hospital.workingHours.open} - {hospital.workingHours.close}
            </p>
          )}

        </div>

      </div>
    </div>
  );
}
