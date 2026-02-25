import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Mrs. Rita Sharma",
    role: "Patient's Family",
    text: "HealthSetu has been a lifesaver for our family. The 24/7 monitoring and AI insights help us manage my mother's health with confidence and peace of mind.",
    rating: 5,
    avatar: "RS",
  },
  {
    id: 2,
    name: "Dr. Ahmed Hassan",
    role: "Nephrologist",
    text: "As a healthcare provider, I appreciate how HealthSetu improves patient engagement and care coordination. The data is accurate and actionable.",
    rating: 5,
    avatar: "AH",
  },
  {
    id: 3,
    name: "John Martinez",
    role: "Patient",
    text: "The interface is so easy to use. I can track my health metrics without any hassle, and my doctor has access to real-time data.",
    rating: 5,
    avatar: "JM",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="w-full px-4 sm:px-6 lg:px-12 py-16 sm:py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <p className="text-teal-600 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3">
            Success Stories
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Loved by Patients & Doctors
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Real stories from families and healthcare professionals who trust HealthSetu.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          
          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {testimonials.map((testimonial, i) => (
              <div
                key={testimonial.id}
                className={`p-8 sm:p-10 rounded-2xl border-2 transition-all duration-300 cursor-pointer transform ${
                  i === currentIndex
                    ? "border-teal-500 bg-gradient-to-br from-teal-50 to-blue-50 shadow-xl shadow-teal-100 scale-100"
                    : "border-gray-200 bg-white shadow-md hover:shadow-lg hover:border-gray-300"
                }`}
                onClick={() => setCurrentIndex(i)}
              >
                
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star
                      key={j}
                      size={18}
                      className={i === currentIndex ? "fill-yellow-400 text-yellow-400" : "fill-gray-300 text-gray-300"}
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className={`text-sm sm:text-base leading-relaxed mb-6 ${
                  i === currentIndex ? "text-gray-800" : "text-gray-600"
                }`}>
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm text-white ${
                    i === currentIndex
                      ? "bg-gradient-to-br from-blue-600 to-teal-500"
                      : "bg-gray-300"
                  }`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${i === currentIndex ? "text-gray-900" : "text-gray-800"}`}>
                      {testimonial.name}
                    </p>
                    <p className={`text-xs ${i === currentIndex ? "text-gray-600" : "text-gray-500"}`}>
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-6">
            <button
              onClick={prev}
              className="p-3 rounded-full border-2 border-gray-300 text-gray-600 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i === currentIndex
                      ? "bg-gradient-to-r from-blue-600 to-teal-500 w-8"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="p-3 rounded-full border-2 border-gray-300 text-gray-600 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}