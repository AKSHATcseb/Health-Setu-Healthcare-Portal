import React from "react";
import { Calendar, FileText, CreditCard } from "lucide-react";

export default function Hero({ user }) {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good Morning" : currentHour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <section className="w-full px-4 sm:px-6 lg:px-12 py-8 sm:py-12 md:py-16 bg-gradient-to-b from-blue-50 to-slate-50">
      <div className="max-w-7xl mx-auto">
        
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-teal-600">{user.name.split(" ")[0]}</span>!
          </h1>
          <p className="text-gray-700 text-base sm:text-lg font-medium">
            Welcome back to your health dashboard. Manage your appointments, view reports, and track your wellness.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 shadow-lg border-2 border-blue-700 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-semibold">Next Appointment</p>
                <p className="text-3xl font-bold text-white mt-2">Dec 28</p>
              </div>
              <Calendar className="w-12 h-12 text-blue-200" />
            </div>
          </div>

          {/* <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl p-6 shadow-lg border-2 border-teal-700 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-sm font-semibold">Health Reports</p>
                <p className="text-3xl font-bold text-white mt-2">5</p>
              </div>
              <FileText className="w-12 h-12 text-teal-200" />
            </div>
          </div> */}

          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 shadow-lg border-2 border-green-700 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-semibold">Total Appointments</p>
                <p className="text-3xl font-bold text-white mt-2">12</p>
              </div>
              <Calendar className="w-12 h-12 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl p-6 shadow-lg border-2 border-orange-700 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-semibold">Pending Payments</p>
                <p className="text-3xl font-bold text-white mt-2">₹2,500</p>
              </div>
              <CreditCard className="w-12 h-12 text-orange-200" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}