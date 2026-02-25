import { useState } from "react";
import RoleSelector from "../../components/loginSignup/RoleSelector";

export default function RoleSelectorPage() {
  const [role, setRole] = useState(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-teal-50 to-slate-100">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Select Your Role
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Choose how you want to use HealthSetu
        </p>

        <RoleSelector role={role} setRole={setRole} />
      </div>
    </div>
  );
}

