export default function LogoPanel() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        className="
          w-full h-full
          bg-linear-to-br from-teal-600 to-teal-700
          rounded-3xl
          flex flex-col items-center justify-center
          text-center
          px-10
        "
      >
        <h1 className="text-4xl font-extrabold text-white mb-4">
          HealthSetu
        </h1>

        <p className="text-teal-100 text-lg max-w-md leading-relaxed">
          AI-powered dialysis care with trusted hospitals,
          faster bookings, and a truly patient-first experience.
        </p>
      </div>
    </div>
  );
}
