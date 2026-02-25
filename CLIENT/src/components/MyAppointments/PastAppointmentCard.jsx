import { motion } from "framer-motion";

export default function PastAppointmentCard({
  name,
  date,
  time,
  feedback,
  submitted,
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center"
    >
      <div>
        <h4 className="font-semibold text-gray-800">{name}</h4>
        <p className="text-sm text-gray-500">
          📅 {date} • ⏰ {time}
        </p>
      </div>

      {feedback && (
        <button className="px-4 py-2 border rounded-lg hover:border-teal-600 hover:text-teal-600 transition cursor-pointer">
          ✍ Give Feedback
        </button>
      )}

      {submitted && (
        <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg">
          ✔ Feedback Submitted
        </span>
      )}
    </motion.div>
  );
}
