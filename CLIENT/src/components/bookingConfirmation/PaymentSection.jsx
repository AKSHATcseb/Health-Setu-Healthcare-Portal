export default function PaymentSection() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h2 className="font-semibold text-lg mb-4">
        Payment Method
      </h2>

      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="radio" name="payment" />
          Pay at Center
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="radio" name="payment" />
          Pay Online
        </label>
      </div>
    </div>
  );
}
