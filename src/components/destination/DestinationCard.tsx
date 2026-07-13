import { Link } from 'react-router-dom';
import { MapPin, Calendar, TrendingUp, Clock } from 'lucide-react';
import type { Destination } from '../../types/destination.types';
import { Badge } from '../common/Badge';
import { useSiteSettingsStore } from '../../store/siteSettingsStore';

interface DestinationCardProps {
  destination: Destination;
}

function formatIndianCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function DestinationCard({ destination }: DestinationCardProps) {
  const showPrices = useSiteSettingsStore(s => s.showPrices);
  const primaryImage = destination.images.find(img => img.isPrimary) || destination.images[0];
  const isComingSoon = Boolean(destination.isComingSoon);

  const content = (
    <div className={`journal-card overflow-hidden ${isComingSoon ? 'opacity-75 grayscale' : ''}`}>
      {/* Image */}
      <div className="relative overflow-hidden h-52">
        <img
          src={primaryImage?.url}
          alt={primaryImage?.alt || destination.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${!isComingSoon ? 'group-hover:scale-105' : ''}`}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap">
          {destination.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="default" size="sm" className="bg-[#FFFBF5]/90 backdrop-blur-sm">
              {tag}
            </Badge>
          ))}
        </div>
        {isComingSoon && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-slate-800/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            <Clock size={11} /> Coming Soon
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className={`text-lg font-bold transition-colors ${!isComingSoon ? 'group-hover:text-[#5B7FA6]' : ''}`} style={{ color: '#3D2C2C' }}>
            {destination.name}
          </h3>
        </div>

        <div className="flex items-center gap-1 text-xs mb-3" style={{ color: '#8A7060' }}>
          <MapPin size={12} />
          <span>{[destination.location?.state, destination.location?.country].filter(Boolean).join(', ')}</span>
        </div>

        <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: '#5C4A3A' }}>
          {destination.shortDescription}
        </p>

        <div className="flex items-center justify-between pt-3" style={{ borderTop: '1.5px solid #E8D5C4' }}>
          <div className="flex items-center gap-1 text-xs" style={{ color: '#8A7060' }}>
            <Calendar size={12} />
            <span>{destination.itineraryCount} itineraries</span>
          </div>
          {showPrices && !isComingSoon && destination.startingPrice > 0 && (
            <div className="flex items-center gap-1">
              <TrendingUp size={12} style={{ color: '#6BAE8E' }} />
              <span className="text-xs" style={{ color: '#8A7060' }}>from </span>
              <span className="text-sm font-bold" style={{ color: '#5B7FA6' }}>{formatIndianCurrency(destination.startingPrice)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isComingSoon) {
    return <div className="group block cursor-not-allowed" aria-disabled="true">{content}</div>;
  }

  return (
    <Link to={`/destinations/${destination.slug}`} className="group block">
      {content}
    </Link>
  );
}
