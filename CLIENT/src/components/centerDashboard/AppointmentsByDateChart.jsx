import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function AppointmentsByDateChart({ data }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-300 p-6 shadow-md hover:shadow-lg hover:border-blue-300 transition-all duration-300">
      <h2 className="text-lg font-bold text-gray-900 mb-4">
        Appointments This Week
      </h2>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="booked" fill="#3b82f6" name="Booked" />
            <Bar dataKey="completed" fill="#10b981" name="Completed" />
            <Bar dataKey="cancelled" fill="#ef4444" name="Cancelled" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}