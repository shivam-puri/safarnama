import { Link } from 'react-router-dom';
import { Clock, Users, Star, ArrowRight, MapPin } from 'lucide-react';
import type { Itinerary } from '../../types/itinerary.types';
import { Badge } from '../common/Badge';

interface ItineraryCardProps {
  itinerary: Itinerary;
  showCustomizeButton?: boolean;
}

function formatIndianCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

const categoryConfig: Record<string, { label: string; variant: 'primary' | 'accent' | 'success' | 'warning' | 'category'; gradient: string }> = {
  budget:    { label: 'Budget',    variant: 'success',  gradient: 'linear-gradient(135deg, #6BAE8E 0%, #4D9070 100%)' },
  family:    { label: 'Family',    variant: 'primary',  gradient: 'linear-gradient(135deg, #5B7FA6 0%, #3D6089 100%)' },
  luxury:    { label: 'Luxury',    variant: 'category', gradient: 'linear-gradient(135deg, #8B6FBE 0%, #614E9F 100%)' },
  adventure: { label: 'Adventure', variant: 'accent',   gradient: 'linear-gradient(135deg, #E8643C 0%, #C44D27 100%)' },
  honeymoon: { label: 'Honeymoon', variant: 'warning',  gradient: 'linear-gradient(135deg, #F4A261 0%, #E87D32 100%)' },
};

export function ItineraryCard({ itinerary, showCustomizeButton = false }: ItineraryCardProps) {
  const primaryImage = itinerary.images.find(img => img.isPrimary) || itinerary.images[0];
  const catConfig = categoryConfig[itinerary.category] || { label: itinerary.category, variant: 'default' as const };

  return (
    <div className="journal-card overflow-hidden group">
      {/* Image */}
      <div className="relative overflow-hidden h-44">
        {primaryImage?.url ? (
          <img
            src={primaryImage.url}
            alt={primaryImage.alt || itinerary.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-2 transition-transform duration-500 group-hover:scale-105"
            style={{ background: catConfig.gradient }}
          >
            <MapPin size={28} className="text-white/70" />
            <span className="text-white/90 text-sm font-semibold text-center px-4 leading-tight" style={{ fontFamily: 'Caveat, cursive', fontSize: '1.1rem' }}>
              {itinerary.title}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <Badge variant={catConfig.variant} size="sm">{catConfig.label}</Badge>
        </div>
        {itinerary.isFeatured && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-yellow-400 text-yellow-900 text-xs font-semibold px-2 py-0.5 rounded-full">
            <Star size={10} fill="currentColor" /> Featured
          </div>
        )}
        <div className="absolute bottom-3 left-3">
          <span className="text-white text-xs font-medium bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
            {itinerary.duration.days}D/{itinerary.duration.nights}N
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-base leading-tight mb-1 transition-colors group-hover:text-[#5B7FA6]" style={{ color: '#3D2C2C' }}>
          {itinerary.title}
        </h3>
        <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: '#8A7060' }}>
          {itinerary.shortDescription}
        </p>

        <div className="flex items-center gap-3 text-xs mb-3" style={{ color: '#8A7060' }}>
          <span className="flex items-center gap-1">
            <Clock size={11} /> {itinerary.duration.days} Days
          </span>
          <span className="flex items-center gap-1">
            <Users size={11} /> {itinerary.minTravelers}–{itinerary.maxTravelers} pax
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs" style={{ color: '#B5A090' }}>Starting from</p>
            <p className="text-base font-bold" style={{ color: '#5B7FA6' }}>
              {formatIndianCurrency(itinerary.basePricePerPerson)}
              <span className="text-xs font-normal" style={{ color: '#B5A090' }}>/person</span>
            </p>
          </div>
          {showCustomizeButton ? (
            <Link
              to={`/customize/${itinerary.id}`}
              className="stamp-btn text-xs px-3 py-1.5"
            >
              Customize <ArrowRight size={12} />
            </Link>
          ) : (
            <Link
              to={`/destinations/${itinerary.destinationSlug}/${itinerary.slug}`}
              className="flex items-center gap-1 text-xs font-semibold transition-colors hover:text-[#E8643C]"
              style={{ color: '#5B7FA6' }}
            >
              View Details <ArrowRight size={12} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
