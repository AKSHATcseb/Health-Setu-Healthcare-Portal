import React from "react";
import { User, Mail, Phone } from "lucide-react";

/*
  PersonalDetailsForm
  - Props preserved: formData, setFormData, errors, setErrors, disableNameEmail, readOnlyEmail
  - No logic changes — only visual/styling improvements for a professional, dark/charcoal look.
*/
export default function PersonalDetailsForm({
  formData,
  setFormData,
  errors,
  setErrors,
  disableNameEmail = false,
  readOnlyEmail = false,
}) {
  const handleNameChange = (e) => {
    const value = e.target.value;
    setFormData((p) => ({ ...p, fullName: value }));
    if (!value || value.trim().length < 2) {
      setErrors((prev) => ({ ...prev, fullName: "Please enter your full name" }));
    } else {
      setErrors((prev) => ({ ...prev, fullName: "" }));
    }
  };

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 15);
    setFormData((p) => ({ ...p, mobileNumber: value }));
    if (!/^\d{10,15}$/.test(value)) {
      setErrors((prev) => ({ ...prev, mobileNumber: "Enter a valid mobile number" }));
    } else {
      setErrors((prev) => ({ ...prev, mobileNumber: "" }));
    }
  };

  const handleEmailChange = (e) => {
    if (readOnlyEmail) return;
    const value = e.target.value;
    setFormData((p) => ({ ...p, email: value }));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setErrors((prev) => ({ ...prev, email: "Please enter a valid email" }));
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const inputBase =
    "w-full rounded-lg px-4 py-3 text-slate-100 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-sky-600";

  return (
    <section
      className="rounded-2xl p-6 shadow-lg"
      style={{ background: "linear-gradient(180deg,#0b1220,#111827)" }}
      aria-label="Personal details"
    >
      <div className="flex items-center gap-3 mb-5">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-lg"
          style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))" }}
        >
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Personal details</h2>
          <p className="text-sm text-slate-300">Enter your name, email and phone number</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full name */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Full name</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300">
              <User size={16} />
            </div>
            <input
              type="text"
              value={formData.fullName || ""}
              onChange={handleNameChange}
              disabled={disableNameEmail}
              placeholder="John Doe"
              className={`${inputBase} pl-10 ${disableNameEmail ? "bg-white/6 opacity-70 cursor-not-allowed" : "bg-white/6"}`}
              aria-label="Full name"
            />
          </div>
          {errors.fullName && <p className="text-xs text-rose-400 mt-1">{errors.fullName}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Email</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300">
              <Mail size={16} />
            </div>
            <input
              type="email"
              value={formData.email || ""}
              onChange={handleEmailChange}
              placeholder="you@example.com"
              readOnly={readOnlyEmail}
              disabled={disableNameEmail}
              className={`${inputBase} pl-10 ${ (readOnlyEmail || disableNameEmail) ? "bg-white/6 opacity-70 cursor-not-allowed" : "bg-white/6" }`}
              aria-label="Email address"
            />
          </div>
          {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email}</p>}
        </div>

        {/* Mobile (full width on small screens) */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-200 mb-2">Mobile number</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300">
              <Phone size={16} />
            </div>
            <input
              type="tel"
              value={formData.mobileNumber || ""}
              onChange={handleMobileChange}
              placeholder="9999999999"
              className={`${inputBase} pl-10 bg-white/6`}
              aria-label="Mobile number"
              inputMode="tel"
            />
          </div>
          {errors.mobileNumber && <p className="text-xs text-rose-400 mt-1">{errors.mobileNumber}</p>}
        </div>
      </div>
    </section>
  );
}