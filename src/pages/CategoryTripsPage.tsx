import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ItineraryCard } from '../components/itinerary/ItineraryCard';
import { CardSkeletonGrid } from '../components/common/LoadingSkeleton';
import { useAsync } from '../hooks/useAsync';
import { adminApi } from '../lib/api';
import { getCategoryMeta } from '../lib/categories';

export function CategoryTripsPage() {
  const { category } = useParams<{ category: string }>();
  const meta = getCategoryMeta(category ?? '');

  const { data: itinerariesData, loading } = useAsync(
    () => adminApi.getItineraries({ category, isActive: true, limit: 50 }),
    [category]
  );

  const itineraries = (itinerariesData?.data ?? []).filter((itn: any) => itn.isActive !== false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFBF5' }}>
      <div className="text-white py-16 px-4 relative overflow-hidden" style={{ background: meta.gradient }}>
        <div className="max-w-7xl mx-auto relative">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm mb-4 text-white/80 hover:text-white">
            <ArrowLeft size={14} /> Back to home
          </Link>
          <p className="journal-label mb-2 text-white/80">{meta.emoji} Category</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'Caveat, cursive' }}>{meta.label} Trips</h1>
          <p className="max-w-xl text-white/80">Handpicked {meta.label.toLowerCase()} itineraries across all our destinations.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <CardSkeletonGrid count={6} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" />
        ) : itineraries.length > 0 ? (
          <>
            <p className="text-sm mb-4" style={{ color: '#8A7060' }}>
              Showing <strong>{itineraries.length}</strong> {meta.label.toLowerCase()} itinerar{itineraries.length !== 1 ? 'ies' : 'y'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {itineraries.map((itn: any) => (
                <ItineraryCard key={itn._id ?? itn.id} itinerary={itn} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg" style={{ color: '#B5A090' }}>No {meta.label.toLowerCase()} itineraries available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
