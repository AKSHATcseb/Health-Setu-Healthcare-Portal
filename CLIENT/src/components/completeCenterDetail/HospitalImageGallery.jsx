import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HospitalImageGallery({ images }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-300 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 mb-6">
      {/* Main Image */}
      <div className="relative w-full bg-gray-900 aspect-video">
        <img
          src={images[currentImageIndex]}
          alt={`Hospital view ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
        />

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full transition z-10"
            >
              <ChevronLeft size={24} className="text-gray-900" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full transition z-10"
            >
              <ChevronRight size={24} className="text-gray-900" />
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/50 text-white text-xs font-bold rounded-full">
          {currentImageIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="p-4 bg-gray-50 flex gap-3 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentImageIndex
                  ? "border-blue-500 scale-105"
                  : "border-gray-300 hover:border-blue-400"
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}