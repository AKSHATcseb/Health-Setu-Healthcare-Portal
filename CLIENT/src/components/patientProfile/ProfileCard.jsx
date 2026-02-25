export default function ProfileCard({ email, phone, age, gender, weight, address }) {
  return (
    <div className="bg-white rounded-3xl p-7 shadow-md space-y-5">

      {/* <h3 className="text-xl font-semibold text-slate-800 mb-2">
        Personal Details
      </h3> */}
      <Info label="Email" value={email} />
      <Info label="Phone" value={phone} />
      <Info label="Age" value={age} />
      <Info label="Gender" value={gender} />
      <Info label="Weight" value={weight} />
      <Info
        label="Address"
        value={
          address
            ? `${address.street || ""}, ${address.city || ""}, ${address.state || ""} - ${address.pincode || ""}`
            : "-"
        }
      />

    </div>
  );

}

function Info({ label, value }) {
  return (
    <div className="flex justify-between items-center pb-2 last:border-none">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-800 text-right max-w-[60%]">
        {value || "-"}
      </span>
    </div>
  );
}

