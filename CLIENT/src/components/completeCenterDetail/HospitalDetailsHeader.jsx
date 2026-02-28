import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Share2, Heart } from "lucide-react";

export default function HospitalDetailsHeader({
  hospitalName,
  rating,
  isFavorite = false,
  onToggleFavorite,
}) {
  const navigate = useNavigate();

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-r from-blue-600 via-teal-500 to-blue-700 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white font-semibold mb-4 hover:opacity-80 transition-opacity hover:translate-x-1 duration-300 text-sm"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              {hospitalName}
            </h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="text-2xl">★</span>
                <span className="text-lg font-bold text-white">{rating}</span>
              </div>
              <span className="text-white/80 text-sm">Highly Rated</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleFavorite}
              className="p-3 bg-white/20 backdrop-blur-lg rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-300 text-white"
            >
              <Heart
                size={20}
                fill={isFavorite ? "currentColor" : "none"}
              />
            </button>
            <button className="p-3 bg-white/20 backdrop-blur-lg rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-300 text-white">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}