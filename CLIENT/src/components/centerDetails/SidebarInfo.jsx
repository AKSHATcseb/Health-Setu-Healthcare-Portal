export default function SidebarInfo({ hospital }) {
  return (
    <div className="space-y-6 sticky top-24">

      {/* Contact */}
      <div className="bg-white rounded-3xl p-6 shadow-sm">

        <h3 className="font-semibold text-lg mb-4">
          📞 Contact Details
        </h3>

        <div className="space-y-2 text-gray-700">

          <p>
            📧 <span className="text-teal-600 font-medium">
              {hospital.email}
            </span>
          </p>

          <p>
            📱 <span className="text-teal-600 font-medium">
              {hospital.phone}
            </span>
          </p>

        </div>

      </div>

      {/* Payment */}
      <div className="bg-white rounded-3xl p-6 shadow-sm">

        <h3 className="font-semibold text-lg mb-4">
          💳 Payment Info
        </h3>

        <p className="text-gray-600 mb-1">
          UPI ID
        </p>

        <p className="font-semibold text-gray-900">
          {hospital.upiId}
        </p>

      </div>

    </div>
  );
}
