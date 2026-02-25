import { User, Pencil, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProfileHeader({ patientName }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 bg-white rounded-3xl p-6 shadow-md">

      {/* LEFT */}
      <div className="flex items-center gap-4">

        <button
          onClick={() => navigate(`/patient/dashboard`)}
          className="p-3 rounded-xl bg-teal-100 text-teal-700 hover:bg-teal-200 transition"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-teal-600 to-emerald-500 
                      flex items-center justify-center text-white text-xl font-bold">
          {patientName?.charAt(0)}
        </div>

        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            {patientName}
          </h1>
        </div>
      </div>

      {/* EDIT */}
      <button
        onClick={() => navigate("/patient/profile/edit")}
        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-teal-600
             text-white font-medium hover:bg-teal-700 transition shadow"
      >
        <Pencil size={18} />
        Edit Profile
      </button>

    </div>
  );

}
