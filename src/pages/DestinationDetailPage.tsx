import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { DestinationGallery } from '../components/destination/DestinationGallery';
import { ItineraryCard } from '../components/itinerary/ItineraryCard';
import { ReviewCard } from '../components/common/ReviewCard';
import { Badge } from '../components/common/Badge';
import { useAsync } from '../hooks/useAsync';
import { publicApi } from '../lib/api';

export function DestinationDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'itineraries' | 'reviews'>('overview');

  const { data: destData, loading } = useAsync(() => publicApi.getDestinationBySlug(slug!), [slug]);
  const { data: reviews } = useAsync(() => publicApi.getReviewsByDestination(slug!), [slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center" style={{ color: '#B5A090' }}>Loading...</div>;
  }

  if (!destData) return <Navigate to="/destinations" replace />;

  // API returns { destination: {...}, itineraries: [...] }
  const destination = destData.destination ?? destData;
  const itineraries = destData.itineraries ?? destination.itineraries ?? [];
  const reviewList = reviews ?? [];
  const startingPrice = itineraries.length > 0
    ? Math.min(...itineraries.map((i: any) => i.basePricePerPerson).filter(Boolean))
    : null;

  const tabs = [
    { id: 'overview' as const, label: 'Overview' },
    { id: 'itineraries' as const, label: `Itineraries (${itineraries.length})` },
    { id: 'reviews' as const, label: `Reviews (${reviewList.length})` },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFBF5' }}>
      {/* Gallery */}
      <div style={{ backgroundColor: '#3D2C2C' }}>
        <div className="max-w-7xl mx-auto px-4 pt-20 pb-4">
          <DestinationGallery images={destination.images} altPrefix={destination.name} />
        </div>
      </div>

      {/* Destination header */}
      <div style={{ backgroundColor: '#FFFBF5', borderBottom: '1.5px solid #E8D5C4' }}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold" style={{ color: '#3D2C2C', fontFamily: 'Caveat, cursive' }}>{destination.name}</h1>
              <div className="flex items-center gap-1.5 text-sm mt-1" style={{ color: '#8A7060' }}>
                <MapPin size={14} />
                <span>{[destination.location?.state, destination.location?.country].filter(Boolean).join(', ')}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {(destination.tags ?? []).map((tag: string) => (
                  <Badge key={tag} variant="default" size="sm">{tag}</Badge>
                ))}
              </div>
            </div>
            {itineraries[0]?.slug && (
              <Link
                to={`/destinations/${destination.slug}/${itineraries[0]?.slug}`}
                className="stamp-btn shrink-0 px-5 py-2.5"
              >
                Explore Packages <ArrowRight size={14} />
              </Link>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-6 mt-5 -mb-px">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="journal-tab pb-3"
                data-active={activeTab === tab.id ? 'true' : undefined}
                style={activeTab === tab.id ? { borderBottomColor: '#E8643C', color: '#E8643C' } : { color: '#8A7060' }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-3" style={{ color: '#3D2C2C', fontFamily: 'Caveat, cursive', fontSize: '1.5rem' }}>About {destination.name}</h2>
                <p className="leading-relaxed" style={{ color: '#5C4A3A' }}>{destination.description}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-3" style={{ color: '#3D2C2C' }}>Highlights</h3>
                <div className="flex flex-wrap gap-2">
                  {(destination.tags ?? []).map((tag: string) => (
                    <span key={tag} className="px-3 py-1.5 text-sm rounded-full capitalize" style={{ backgroundColor: '#D6E4F0', color: '#3D6089' }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div className="journal-card p-5">
                <h3 className="font-semibold mb-3" style={{ color: '#3D2C2C' }}>Quick Info</h3>
                <div className="space-y-2 text-sm">
                  {destination.location?.state && (
                    <div className="flex justify-between">
                      <span style={{ color: '#8A7060' }}>State</span>
                      <span className="font-medium" style={{ color: '#3D2C2C' }}>{destination.location.state}</span>
                    </div>
                  )}
                  {destination.location?.country && (
                    <div className="flex justify-between">
                      <span style={{ color: '#8A7060' }}>Country</span>
                      <span className="font-medium" style={{ color: '#3D2C2C' }}>{destination.location.country}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span style={{ color: '#8A7060' }}>Packages</span>
                    <span className="font-medium" style={{ color: '#3D2C2C' }}>{itineraries.length} itineraries</span>
                  </div>
                  {startingPrice && (
                    <div className="flex justify-between">
                      <span style={{ color: '#8A7060' }}>Starting from</span>
                      <span className="font-bold" style={{ color: '#5B7FA6' }}>₹{startingPrice.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setActiveTab('itineraries')}
                  className="stamp-btn block text-center w-full mt-4 px-4 py-2 text-sm"
                >
                  View All Packages
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'itineraries' && (
          <div>
            <h2 className="text-xl font-bold mb-6" style={{ color: '#3D2C2C', fontFamily: 'Caveat, cursive', fontSize: '1.5rem' }}>{itineraries.length} Packages Available</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {itineraries.map((itn: any) => (
                <ItineraryCard key={itn._id ?? itn.id} itinerary={itn} showCustomizeButton />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            <h2 className="text-xl font-bold mb-6" style={{ color: '#3D2C2C', fontFamily: 'Caveat, cursive', fontSize: '1.5rem' }}>{reviewList.length} Reviews</h2>
            {reviewList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {reviewList.map((review: any) => (
                  <ReviewCard key={review._id ?? review.id} review={review} />
                ))}
              </div>
            ) : (
              <p className="text-center py-8" style={{ color: '#B5A090' }}>No reviews yet for this destination.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
