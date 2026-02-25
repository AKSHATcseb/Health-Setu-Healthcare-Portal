const PricingCard = ({ cost4h, cost6h, emergencyCost }) => {
  return (
    <div className="bg-gray-100 rounded-xl p-5 space-y-4">
      <h3 className="font-semibold">Pricing Management</h3>

      {/* ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* 4 hour cost */}
        <div>
          <p className="text-xs text-slate-500">Cost - 4h</p>
          <input
            value={cost4h ? `₹${cost4h}.00` : ""}
            className="mt-1 border rounded-lg px-3 py-2 w-full bg-gray-200 border-gray-200"
            readOnly
          />
        </div>

        {/* 6 hour cost */}
        <div>
          <p className="text-xs text-slate-500">Cost - 6h</p>
          <input
            value={cost6h ? `₹${cost6h}.00` : ""}
            className="mt-1 border rounded-lg px-3 py-2 w-full bg-gray-200 border-gray-200"
            readOnly
          />
        </div>

        {/* Emergency cost */}
        <div>
          <p className="text-xs text-slate-500">Emergency Cost</p>

          {emergencyCost ? (
            <input
              value={`₹${emergencyCost}.00`}
              className="mt-1 border rounded-lg px-3 py-2 w-full bg-gray-200 border-gray-200"
              readOnly
            />
          ) : (
            <p className="mt-2 text-sm text-red-500 font-medium">
              Emergency not available
            </p>
          )}
        </div>

      </div>

      <p className="text-xs text-slate-400">
        Last price updated by Admin
      </p>
    </div>
  );
};

export default PricingCard;
