import React, { useState } from "react";
import { useParams } from "react-router-dom";
import HospitalDetailsHeader from "../../components/completeCenterDetail/HospitalDetailsHeader";
import HospitalImageGallery from "../../components/completeCenterDetail/HospitalImageGallery";
import HospitalBasicInfo from "../../components/completeCenterDetail/HospitalBasicInfo";
import DialysisFacilitiesInfo from "../../components/completeCenterDetail/DialysisFacilitiesInfo";
import AdditionalFacilitiesInfo from "../../components/completeCenterDetail/AdditionalFacilitiesInfo";
import HospitalLocationMap from "../../components/completeCenterDetail/HospitalLocationMap";
import OperatingHoursInfo from "../../components/completeCenterDetail/OperatingHoursInfo";
import ReviewsSection from "../../components/completeCenterDetail/ReviewsSection";
import BookAppointmentCTA from "../../components/completeCenterDetail/BookAppointmentCTA";

export default function CompleteCenterDetail() {
  const { hospitalId } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);

  // Sample hospital data - Replace with API call
  const hospitalData = {
    id: 1,
    name: "City Dialysis Center",
    rating: 4.8,
    reviews: 156,
    address: "123 Medical Plaza, Healthcare District, City, State 12345",
    phone: "+1 (555) 123-4567",
    website: "https://citydialysiscenter.com",
    is24x7: false,
    hours: "7:00 AM - 9:00 PM",
    images: [
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=800&fit=crop",
    ],
    latitude: 29.9571,
    longitude: 77.5244,
    dialysisInfo: {
      seats: 20,
      type: "Both",
      emergencyServices: true,
      homeCollection: true,
      labTests: true,
    },
    facilities: ["wifi", "parking", "cafeteria", "pharmacy", "ccuicu", "physiotherapy"],
    operatingHours: {
      Monday: { open: "07:00", close: "21:00", closed: false },
      Tuesday: { open: "07:00", close: "21:00", closed: false },
      Wednesday: { open: "07:00", close: "21:00", closed: false },
      Thursday: { open: "07:00", close: "21:00", closed: false },
      Friday: { open: "07:00", close: "21:00", closed: false },
      Saturday: { open: "08:00", close: "18:00", closed: false },
      Sunday: { open: "08:00", close: "18:00", closed: false },
    },
    reviews: [
      {
        patientName: "John Doe",
        rating: 5,
        comment:
          "Excellent service and very professional staff. The facility is clean and well-maintained. Highly recommend!",
        date: "2026-02-28",
        helpful: 45,
      },
      {
        patientName: "Jane Smith",
        rating: 4,
        comment:
          "Good experience overall. The doctors are knowledgeable and attentive. Parking could be better.",
        date: "2026-02-27",
        helpful: 32,
      },
      {
        patientName: "Robert Wilson",
        rating: 5,
        comment:
          "Best dialysis center in the area. The treatment rooms are comfortable and the staff is very caring.",
        date: "2026-02-26",
        helpful: 28,
      },
      {
        patientName: "Sarah Johnson",
        rating: 4,
        comment:
          "Great facilities and professional team. Waiting time could be reduced.",
        date: "2026-02-25",
        helpful: 18,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 pb-32">
      <HospitalDetailsHeader
        hospitalName={hospitalData.name}
        rating={hospitalData.rating}
        isFavorite={isFavorite}
        onToggleFavorite={() => setIsFavorite(!isFavorite)}
      />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Image Gallery */}
          <HospitalImageGallery images={hospitalData.images} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <HospitalBasicInfo hospital={hospitalData} />

              {/* Dialysis Facilities */}
              <DialysisFacilitiesInfo dialysisInfo={hospitalData.dialysisInfo} />

              {/* Operating Hours */}
              <OperatingHoursInfo
                operatingHours={hospitalData.operatingHours}
                is24x7={hospitalData.is24x7}
              />

              {/* Reviews */}
              <ReviewsSection
                reviews={hospitalData.reviews}
                hospitalRating={hospitalData.rating}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Additional Facilities */}
              <AdditionalFacilitiesInfo facilities={hospitalData.facilities} />

              {/* Location Map */}
              <HospitalLocationMap hospital={hospitalData} />
            </div>
          </div>
        </div>
      </div>

      {/* Book Appointment CTA */}
      <BookAppointmentCTA
        hospitalId={hospitalData.id}
        hospitalName={hospitalData.name}
      />
    </div>
  );
}