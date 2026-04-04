"use client";

import React from "react";
import { Star, StarHalf } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  className?: string;
  showText?: boolean;
  count?: number;
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = 14,
  className = "",
  showText = false,
  count,
}: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            size={size}
            className="fill-brand-primary text-brand-primary"
            strokeWidth={1}
          />
        ))}
        {hasHalfStar && (
          <StarHalf
            size={size}
            className="fill-brand-primary text-brand-primary"
            strokeWidth={1}
          />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star
            key={`empty-${i}`}
            size={size}
            className="text-gray-200"
            strokeWidth={1}
          />
        ))}
      </div>
      {showText && (
        <span className="text-[10px] uppercase tracking-[0.1em] text-gray-500 font-medium">
          {rating.toFixed(1)} {count !== undefined && `(${count})`}
        </span>
      )}
    </div>
  );
}
