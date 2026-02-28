import React, { useState } from "react";
import { Star, User, ThumbsUp, MessageCircle } from "lucide-react";

export default function ReviewsSection({ reviews, hospitalRating }) {
  const [sortBy, setSortBy] = useState("recent");

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.date) - new Date(a.date);
    } else if (sortBy === "helpful") {
      return b.helpful - a.helpful;
    } else if (sortBy === "rating") {
      return b.rating - a.rating;
    }
    return 0;
  });

  const formatDate = (date) => {
    const now = new Date();
    const reviewDate = new Date(date);
    const diffDays = Math.floor((now - reviewDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-300 p-6 shadow-md hover:shadow-lg hover:border-blue-300 transition-all duration-300">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Patient Reviews</h2>

      {/* Rating Summary */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-6 border-2 border-yellow-200 mb-6">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-4xl font-bold text-yellow-900">
              {hospitalRating}
            </p>
            <div className="flex justify-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={
                    i < Math.floor(hospitalRating)
                      ? "#f59e0b"
                      : "#e5e7eb"
                  }
                  className={
                    i < Math.floor(hospitalRating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-yellow-900">
              Based on {reviews.length} patient reviews
            </p>
          </div>
        </div>
      </div>

      {/* Sort Options */}
      <div className="mb-4">
        <label className="text-sm font-semibold text-gray-700 mr-3">
          Sort by:
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
        >
          <option value="recent">Most Recent</option>
          <option value="helpful">Most Helpful</option>
          <option value="rating">Highest Rating</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {sortedReviews.length > 0 ? (
          sortedReviews.map((review, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 hover:border-blue-200 transition"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {review.patientName}
                    </p>
                    <p className="text-xs text-gray-600">
                      {formatDate(review.date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill={
                        i < review.rating ? "#f59e0b" : "#e5e7eb"
                      }
                      className={
                        i < review.rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
              </div>

              {/* Review Content */}
              <p className="text-sm text-gray-800 mb-3 leading-relaxed">
                {review.comment}
              </p>

              {/* Review Actions */}
              <div className="flex items-center gap-4 pt-3 border-t border-gray-200">
                <button className="flex items-center gap-2 text-xs text-gray-600 hover:text-blue-600 transition">
                  <ThumbsUp size={14} />
                  Helpful ({review.helpful})
                </button>
                <button className="flex items-center gap-2 text-xs text-gray-600 hover:text-blue-600 transition">
                  <MessageCircle size={14} />
                  Reply
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-gray-50 rounded-lg p-6 text-center border-2 border-gray-200">
            <p className="text-sm text-gray-600">No reviews yet</p>
          </div>
        )}
      </div>
    </div>
  );
}