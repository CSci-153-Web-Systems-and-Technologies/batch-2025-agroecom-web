import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: 4 | 5; 
}

export const StarRating = ({ rating, size = 4 }: StarRatingProps) => {
  const roundedRating = Math.round(rating);

  return (
    <div className="flex items-center space-x-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-${size} w-${size} transition-colors ${
            i <= roundedRating 
              ? 'text-yellow-500 fill-yellow-500'
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};