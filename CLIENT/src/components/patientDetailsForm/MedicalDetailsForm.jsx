import React from "react";
import { Heart, Calendar } from "lucide-react";

/*
  MedicalDetailsForm
  - Preserves props and behavior: formData, setFormData, errors, setErrors
  - Styling updated to the dark/charcoal professional palette used across the app
  - Responsive layout: compact on mobile, multi-column on larger screens
  - No logic/backend changes
*/
export default function MedicalDetailsForm({ formData, setFormData, errors, setErrors }) {
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const genders = ["male", "female", "other"];

  const validateAge = (age) => {
    const ageNum = Number(age);
    return age && Number.isFinite(ageNum) && ageNum >= 18 && ageNum <= 120;
  };

  const handleAgeChange = (e) => {
    const value = e.target.value;
    // allow empty string while typing
    setFormData((p) => ({ ...p, age: value }));
    if (value && !validateAge(value)) {
      setErrors((prev) => ({ ...prev, age: "Age must be between 18 and 120" }));
    } else {
      setErrors((prev) => ({ ...prev, age: "" }));
    }
  };

  const handleGenderSelect = (gender) => {
    // normalize gender to lower-case to match backend enums
    setFormData((p) => ({ ...p, gender: gender.toLowerCase() }));
    setErrors((prev) => ({ ...prev, gender: "" }));
  };

  const handleBloodGroupSelect = (group) => {
    setFormData((p) => ({ ...p, bloodGroup: group }));
    setErrors((prev) => ({ ...prev, bloodGroup: "" }));
  };

  const inputBase =
    "w-full rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-sky-600";

  return (
    <section
      className="rounded-2xl p-6 shadow-lg"
      style={{ background: "linear-gradient(180deg,#0b1220,#111827)" }}
      aria-label="Medical details"
    >
      <div className="flex items-center gap-3 mb-5">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-lg"
          style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))" }}
        >
          <Heart className="w-5 h-5 text-white" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white">Medical details</h2>
          <p className="text-sm text-slate-300">Provide basic medical information</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
        {/* Age */}
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Age <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300">
              <Calendar size={16} />
            </div>
            <input
              type="number"
              placeholder="e.g. 45"
              value={formData.age ?? ""}
              onChange={handleAgeChange}
              min="18"
              max="120"
              className={`${inputBase} pl-10 bg-white/6 border border-transparent`}
              aria-label="Age"
            />
          </div>
          {errors.age && <p className="text-xs text-rose-400 mt-1">{errors.age}</p>}
        </div>

        {/* Gender */}
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Gender <span className="text-rose-400">*</span>
          </label>

          <div className="flex gap-2">
            {genders.map((g) => {
              const active = formData.gender === g;
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => handleGenderSelect(g)}
                  className={`flex-1 py-2 rounded-full text-sm transition
                    ${active
                      ? "bg-sky-600 text-white shadow"
                      : " text-slate-200 hover:bg-white/10"}
                  `}
                  aria-pressed={active}
                >
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Blood Group */}
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Blood group <span className="text-rose-400">*</span>
          </label>

          <div className="grid grid-cols-4 gap-2">
            {bloodGroups.map((group) => {
              const active = formData.bloodGroup === group;
              return (
                <button
                  key={group}
                  type="button"
                  onClick={() => handleBloodGroupSelect(group)}
                  className={`py-2 rounded-full text-sm transition
                    ${active
                      ? "bg-sky-600 text-white shadow"
                      : "text-slate-200 hover:bg-white/10"}
                  `}
                  aria-pressed={active}
                >
                  {group}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}