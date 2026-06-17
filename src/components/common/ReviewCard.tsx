import { RatingStars } from './RatingStars';
import { Quote } from 'lucide-react';

interface ReviewCardProps {
  review: {
    id: string;
    reviewer: { name: string; city: string };
    rating: number;
    body: string;
    travelMonth: string;
    title?: string;
  };
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="journal-card p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <Quote size={24} className="opacity-60" style={{ color: '#F4A261' }} />
        <RatingStars rating={review.rating} />
      </div>
      <p className="text-sm leading-relaxed italic" style={{ color: '#5C4A3A' }}>"{review.body}"</p>
      <div className="pt-4 mt-auto" style={{ borderTop: '1.5px solid #E8D5C4' }}>
        <p className="font-semibold text-sm" style={{ color: '#3D2C2C' }}>{review.reviewer.name}</p>
        <p className="text-xs mt-0.5" style={{ color: '#8A7060' }}>{review.reviewer.city} · {review.travelMonth}</p>
      </div>
    </div>
  );
}
