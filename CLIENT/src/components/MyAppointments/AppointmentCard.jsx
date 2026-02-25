import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { cancelAppointment } from "../../services/appointmentApi";


const statusStyles = {
  reserved: {
    label: "Upcoming",
    badge: "bg-teal-100 text-teal-700",
    ring: "ring-teal-200",
  },
  active: {
    label: "Ongoing",
    badge: "bg-blue-100 text-blue-700",
    ring: "ring-blue-200",
  },
  completed: {
    label: "Completed",
    badge: "bg-gray-100 text-gray-700",
    ring: "ring-gray-200",
  },
  cancelled: {
    label: "Cancelled",
    badge: "bg-red-100 text-red-700",
    ring: "ring-red-200",
  },
};

export default function AppointmentCard({ appointment }) {

  const navigate = useNavigate();

  const s = statusStyles[appointment.status];

  const hospital = appointment.hospitalId;

  const date = new Date(appointment.appointmentDate).toLocaleDateString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div
        className={`
          my-5 bg-white rounded-3xl p-6
          flex flex-col lg:flex-row gap-6
          shadow-md ring-1 ${s.ring}
          hover:shadow-xl transition
        `}
      >
        {/* LEFT */}
        <div className="flex-1">

          {/* STATUS */}
          <div className="flex gap-3 mb-3">
            <span className={`px-4 py-1 rounded-full text-sm font-semibold ${s.badge}`}>
              {s.label}
            </span>

            {appointment.paymentStatus === "pending" && (
              <span className="px-3 py-1 rounded-full text-sm bg-amber-100 text-amber-700">
                Payment Pending
              </span>
            )}
          </div>

          {/* HOSPITAL */}
          <h2 className="text-xl font-bold text-gray-800">
            {hospital.name}
          </h2>

          {/* DETAILS */}
          <div className="mt-4 space-y-2 text-gray-600 text-sm">

            <div>📅 {date}</div>

            <div>
              ⏰ {appointment.startTime} - {appointment.endTime}
            </div>

            <div>
              📍 <span>{hospital.address.street}</span>
              <span>{hospital.address.city}</span>
              <span>{hospital.address.state}</span>
              <span>{hospital.address.pincode}</span>
            </div>

            <div>
              💰 ₹{appointment.amount}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="mt-6 flex gap-3 justify-end">

            {/* {appointment.paymentStatus === "pending" && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/appointment/${appointment._id}/pay`)}
                className="px-6 py-2 rounded-full bg-teal-600 text-white"
              >
                Pay Now
              </motion.button>
            )} */}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/center/${hospital._id}`)}
              className="px-6 py-2 rounded-full border border-teal-600 text-teal-600"
            >
              View Center
            </motion.button>

            {appointment.status === "reserved" && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={async () => {
                  try {
                    await cancelAppointment(appointment._id);
                    window.location.reload(); // quick refresh
                  } catch (err) {
                    alert("Failed to cancel appointment");
                  }
                }}
                className="px-6 py-2 rounded-full border border-red-500 text-red-600"
              >
                Cancel
              </motion.button>
            )}

          </div>
        </div>

        {/* MAP */}
        {/* <div className="w-full lg:w-80 h-48 rounded-2xl overflow-hidden border">
          <iframe
            title="map"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(hospital.location)}&z=15&output=embed`}
            className="w-full h-full"
          />
        </div> */}
      </div>
    </motion.div>
  );
}
