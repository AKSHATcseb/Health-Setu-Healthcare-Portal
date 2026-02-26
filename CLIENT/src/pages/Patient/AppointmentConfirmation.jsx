import React, { useState } from "react";
import AppointmentSummary from "../../components/appointmentConfirmationPage/AppointmentSummary";
import PatientInfo from "../../components/appointmentConfirmationPage/PatientInfo";
import HospitalDetails from "../../components/appointmentConfirmationPage/HospitalDetails";
import PaymentBreakdown from "../../components/appointmentConfirmationPage/PaymentBreakdown";
import PaymentMethod from "../../components/appointmentConfirmationPage/PaymentMethod";
import ConfirmationButtons from "../../components/appointmentConfirmationPage/ConfirmationButtons";
import { CheckCircle } from "lucide-react";

export default function AppointmentConfirmation() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationStep, setConfirmationStep] = useState("review"); // review, success

  // Sample data - Replace with actual data from your state/props
  const appointmentData = {
    date: "2026-03-15",
    timeSlot: "10:00 AM - 10:30 AM",
    hospitalName: "City Dialysis Center",
  };

  const patientData = {
    fullName: "John Doe",
    age: 45,
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    medicalNotes: "Regular dialysis patient. No allergies. Prefers morning appointments.",
  };

  const hospitalData = {
    name: "City Dialysis Center",
    rating: 4.8,
    address: "123 Medical Plaza, Healthcare District, City, State 12345",
    phone: "+1 (555) 987-6543",
    hours: "Monday - Friday: 7:00 AM - 7:00 PM | Saturday: 8:00 AM - 4:00 PM",
    description:
      "State-of-the-art dialysis facility with experienced nephrologists and modern equipment. Specialized in chronic and acute dialysis treatments.",
  };

  const pricingData = {
    baseFee: 150,
    serviceFee: 25,
    discountPercent: 10,
    taxes: 17.5,
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Here you would call your payment API
      console.log("Appointment confirmed with payment method:", selectedPaymentMethod);
      setConfirmationStep("success");
    } catch (error) {
      console.error("Error confirming appointment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Navigate back to previous page
    console.log("Appointment cancelled");
    window.history.back();
  };

  if (confirmationStep === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl border-2 border-green-300 p-8 shadow-2xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-4 animate-bounce">
                <CheckCircle size={48} className="text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Appointment Confirmed!
            </h2>
            <p className="text-gray-600 mb-6">
              Your appointment has been successfully booked and payment processed.
            </p>

            <div className="bg-blue-50 rounded-2xl p-6 mb-6 text-left border border-blue-200">
              <p className="text-sm text-gray-600 mb-2">Confirmation Number</p>
              <p className="text-2xl font-bold text-blue-600">APT-2026-03-15-001</p>
            </div>

            <p className="text-gray-700 mb-6">
              Check your email for the full appointment details and receipt.
            </p>

            <button className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Confirm Your Appointment
          </h1>
          <p className="text-gray-600">Review all details before making the payment</p>
        </div>

        {/* Components */}
        <AppointmentSummary appointment={appointmentData} />
        <PatientInfo patient={patientData} />
        <HospitalDetails hospital={hospitalData} />
        <PaymentBreakdown pricing={pricingData} />
        <PaymentMethod
          selectedMethod={selectedPaymentMethod}
          setSelectedMethod={setSelectedPaymentMethod}
        />
        <ConfirmationButtons
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          isLoading={isLoading}
          agreeToTerms={agreeToTerms}
          setAgreeToTerms={setAgreeToTerms}
        />
      </div>
    </div>
  );
}