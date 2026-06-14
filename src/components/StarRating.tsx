import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  size?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating = 0,
  interactive = false,
  onRatingChange,
  size = 24
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleClick = (value: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value: number) => {
    if (interactive) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(null);
    }
  };

  const displayRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="flex gap-1.5 items-center justify-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          className={`transition-all duration-150 transform ${interactive ? 'hover:scale-120 cursor-pointer active:scale-95' : ''} focus:outline-none`}
        >
          <Star
            size={size}
            fill={star <= displayRating ? '#FFE600' : 'transparent'}
            stroke={star <= displayRating ? '#FFE600' : '#3A3A42'}
            strokeWidth={star <= displayRating ? 1 : 2}
          />
        </button>
      ))}
    </div>
  );
};
export default StarRating;
