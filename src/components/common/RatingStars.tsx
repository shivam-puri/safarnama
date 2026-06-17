import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: number;
}

export function RatingStars({ rating, maxRating = 5, size = 16 }: RatingStarsProps) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxRating }, (_, i) => {
        const filled = i < Math.floor(rating);
        const partial = !filled && i < rating;
        return (
          <Star
            key={i}
            size={size}
            className={filled || partial ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
          />
        );
      })}
    </div>
  );
}
