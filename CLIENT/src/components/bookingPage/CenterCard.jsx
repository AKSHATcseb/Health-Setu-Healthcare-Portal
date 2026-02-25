import { motion } from "framer-motion";

export default function CenterCard({ centers = [], bookingData, onSelect }) {

  return (
    <div className="space-y-8">

      {centers.map((center) => (

        <motion.div
          key={center._id}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.015 }}
          transition={{ duration: 0.35 }}
          className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition"
        >

          <div className="p-6 space-y-4">

            <h3 className="text-2xl font-bold text-gray-900">
              {center.name}
            </h3>

            <p className="text-sm text-gray-600">
              📍 {center.address.street}, {center.address.city}, {center.address.state}, {center.address.pincode}
            </p>

            <div className="flex flex-wrap gap-3">

              {bookingData.durationHours == 6 ? <span className="bg-teal-50 text-teal-700 px-4 py-2 rounded-xl text-sm">
                6 hrs • ₹{center.cost}
              </span> : <span className="bg-teal-50 text-teal-700 px-4 py-2 rounded-xl text-sm">
                4 hrs • ₹{center.cost}
              </span>}





              {center.emergencyServices && (
                <span className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm">
                  🚑 Emergency
                </span>
              )}

            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(center)}
              className="w-full py-3 bg-linear-to-r from-teal-600 to-emerald-500 text-white rounded-xl font-medium shadow hover:opacity-90"
            >
              Book Appointment
            </motion.button>

          </div>
        </motion.div>
      ))}

    </div>
  );
}
