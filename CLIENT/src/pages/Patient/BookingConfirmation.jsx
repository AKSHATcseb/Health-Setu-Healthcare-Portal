import { useState } from "react";
import BookingSummary from "../../components/bookingConfirmation/BookingSummary";
import CenterSummaryCard from "../../components/bookingConfirmation/CenterSummaryCard";
import ConsentSection from "../../components/bookingConfirmation/ConsentSection";
import PaymentSection from "../../components/bookingConfirmation/PaymentSection";
import SlotSelector from "../../components/bookingConfirmation/SlotSelector";

export default function BookAppointment() {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("PAY_AT_CENTER");
  const [consentGiven, setConsentGiven] = useState(false);

  return (
    <div className="min-h-screen bg-teal-50 px-4 md:px-10 py-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
        Confirm Dialysis Appointment
      </h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT CONTENT */}
        <div className="lg:col-span-2 space-y-6">
          <CenterSummaryCard />

          <SlotSelector
            openingTime="08:00"
            closingTime="18:00"
            onSelect={setSelectedSlot}
          />

          {/* <PreferencesForm /> */}

          <PaymentSection
            selected={paymentMethod}
            onChange={setPaymentMethod}
          />

          <ConsentSection
            value={consentGiven}
            onChange={setConsentGiven}
          />
        </div>

        {/* RIGHT SUMMARY */}
        <BookingSummary
          slot={selectedSlot}
          paymentMethod={paymentMethod}
          consentGiven={consentGiven}
        />
      </div>
    </div>
  );
}
