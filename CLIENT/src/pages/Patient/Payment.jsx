import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
// import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-white px-4">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 120 }}
                    className="flex justify-center mb-6"
                >
                    <CheckCircle size={90} className="text-green-500" />
                </motion.div>

                <h1 className="text-2xl font-semibold text-gray-800 mb-2">Appointment booked Successfully</h1>
                <p className="text-gray-500 mb-6">
                    Thank you for choosing HealthSetu.
                </p>

                <div className="space-y-3">

                    <button onClick={() => navigate('/patient/myappointments')}
                        className="w-full rounded-xl py-3 text-base bg-green-600 text-white hover:bg-green-700 transition">
                        View Appointment
                    </button>

                    <button onClick={() => navigate('/patient/dashboard')}
                        className="w-full rounded-xl py-3 text-base border border-gray-300 hover:bg-gray-100 transition">
                        Go to Dashboard
                    </button>

                </div>
            </motion.div>
        </div>
    );
}
