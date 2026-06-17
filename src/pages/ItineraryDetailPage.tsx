import { useParams, Navigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { Clock, Users, ArrowRight, Star, MapPin, CheckCircle } from 'lucide-react';
import { publicApi } from '../lib/api';
import { DayWisePlan } from '../components/itinerary/DayWisePlan';
import { InclusionsList } from '../components/itinerary/InclusionsList';
import { ReviewCard } from '../components/common/ReviewCard';
import { Badge } from '../components/common/Badge';
import { useAsync } from '../hooks/useAsync';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

const categoryConfig: Record<string, { label: string; variant: 'primary' | 'accent' | 'success' | 'warning' | 'category' }> = {
  budget: { label: 'Budget', variant: 'success' },
  family: { label: 'Family', variant: 'primary' },
  luxury: { label: 'Luxury', variant: 'category' },
  adventure: { label: 'Adventure', variant: 'accent' },
  honeymoon: { label: 'Honeymoon', variant: 'warning' },
};

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(n => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
          className="focus:outline-none"
        >
          <Star
            size={28}
            className={(hovered || value) >= n ? 'fill-yellow-400' : ''}
            style={{ color: (hovered || value) >= n ? '#FBBF24' : '#E8D5C4' }}
          />
        </button>
      ))}
    </div>
  );
}

export function ItineraryDetailPage() {
  const { itinerarySlug, destSlug } = useParams<{ destSlug: string; itinerarySlug: string }>();
  const [travelerCount, setTravelerCount] = useState(2);
  const [reviewForm, setReviewForm] = useState({ name: '', email: '', city: '', rating: 0, title: '', body: '', travelMonth: '' });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const { data: itinerary, loading } = useAsync(() => publicApi.getItineraryBySlug(itinerarySlug!), [itinerarySlug]);
  const { data: reviews } = useAsync(() => publicApi.getReviewsByDestination(destSlug!), [destSlug]);

  async function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault();
    setReviewError('');
    if (!reviewForm.rating) { setReviewError('Please select a rating.'); return; }
    if (!reviewForm.travelMonth) { setReviewError('Please select your travel month.'); return; }
    setReviewSubmitting(true);
    try {
      await publicApi.submitReview({
        itineraryId: itinerary?.id,
        destinationId: itinerary?.destinationId?._id ?? itinerary?.destinationId,
        reviewer: { name: reviewForm.name, email: reviewForm.email, city: reviewForm.city },
        rating: reviewForm.rating,
        title: reviewForm.title,
        body: reviewForm.body,
        travelMonth: reviewForm.travelMonth,
      });
      setReviewSubmitted(true);
    } catch {
      setReviewError('Something went wrong. Please try again.');
    } finally {
      setReviewSubmitting(false);
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center" style={{ color: '#B5A090' }}>Loading...</div>;
  }

  if (!itinerary) return <Navigate to="/destinations" replace />;

  const reviewList = reviews ?? [];
  const activities = itinerary.activitiesPool ?? [];
  const catConfig = categoryConfig[itinerary.category] || { label: itinerary.category, variant: 'default' as const };
  const primaryImage = (itinerary.images ?? []).find((i: any) => i.isPrimary) || itinerary.images?.[0];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFBF5' }}>
      {/* Hero */}
      <div className="relative h-64 md:h-80 overflow-hidden" style={{ backgroundColor: '#3D2C2C' }}>
        <img
          src={primaryImage?.url}
          alt={primaryImage?.alt || itinerary.title}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 pt-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant={catConfig.variant} size="md">{catConfig.label}</Badge>
              {itinerary.isFeatured && (
                <span className="inline-flex items-center gap-1 bg-yellow-400 text-yellow-900 text-xs font-semibold px-2.5 py-1 rounded-full">
                  <Star size={11} fill="currentColor" /> Featured
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: 'Caveat, cursive' }}>{itinerary.title}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-white/80 text-sm">
              <span className="flex items-center gap-1"><Clock size={13} /> {itinerary.duration.days}D/{itinerary.duration.nights}N</span>
              <span className="flex items-center gap-1"><Users size={13} /> {itinerary.minTravelers}–{itinerary.maxTravelers} pax</span>
              <span className="flex items-center gap-1"><MapPin size={13} /> {itinerary.destinationSlug}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Highlights */}
            <div className="journal-card p-5">
              <h2 className="text-lg font-bold mb-3" style={{ color: '#3D2C2C', fontFamily: 'Caveat, cursive', fontSize: '1.35rem' }}>Trip Highlights</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(itinerary.highlights ?? []).map((h: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-sm" style={{ color: '#5C4A3A' }}>
                    <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: '#E8643C' }} />
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            {/* Day-wise plan */}
            <div>
              <h2 className="text-lg font-bold mb-4" style={{ color: '#3D2C2C', fontFamily: 'Caveat, cursive', fontSize: '1.35rem' }}>Day-wise Itinerary</h2>
              <DayWisePlan days={itinerary.days ?? []} activities={activities} />
            </div>

            {/* Inclusions / Exclusions */}
            <div className="journal-card p-5">
              <h2 className="text-lg font-bold mb-4" style={{ color: '#3D2C2C', fontFamily: 'Caveat, cursive', fontSize: '1.35rem' }}>Inclusions & Exclusions</h2>
              <InclusionsList inclusions={itinerary.inclusions ?? []} exclusions={itinerary.exclusions ?? []} />
            </div>

            {/* Reviews */}
            {reviewList.length > 0 && (
              <div>
                <h2 className="text-lg font-bold mb-4" style={{ color: '#3D2C2C', fontFamily: 'Caveat, cursive', fontSize: '1.35rem' }}>Traveller Reviews</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {reviewList.slice(0, 4).map((review: any) => (
                    <ReviewCard key={review._id ?? review.id} review={review} />
                  ))}
                </div>
              </div>
            )}

            {/* Write a Review */}
            <div className="journal-card p-6">
              <h2 className="text-lg font-bold mb-1" style={{ color: '#3D2C2C', fontFamily: 'Caveat, cursive', fontSize: '1.35rem' }}>Write a Review</h2>
              <p className="text-sm mb-5" style={{ color: '#8A7060' }}>Travelled on this itinerary? Share your experience.</p>

              {reviewSubmitted ? (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                  <CheckCircle size={40} style={{ color: '#6BAE8E' }} />
                  <p className="font-semibold" style={{ color: '#3D2C2C' }}>Thank you for your review!</p>
                  <p className="text-sm" style={{ color: '#8A7060' }}>It will appear here once approved by our team.</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: '#5C4A3A' }}>Your Name *</label>
                      <input
                        required
                        value={reviewForm.name}
                        onChange={e => setReviewForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Rahul Sharma"
                        className="journal-input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: '#5C4A3A' }}>Email *</label>
                      <input
                        required
                        type="email"
                        value={reviewForm.email}
                        onChange={e => setReviewForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="rahul@example.com"
                        className="journal-input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: '#5C4A3A' }}>City</label>
                      <input
                        value={reviewForm.city}
                        onChange={e => setReviewForm(f => ({ ...f, city: e.target.value }))}
                        placeholder="Mumbai"
                        className="journal-input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: '#5C4A3A' }}>Travel Month *</label>
                      <select
                        value={reviewForm.travelMonth}
                        onChange={e => setReviewForm(f => ({ ...f, travelMonth: e.target.value }))}
                        className="journal-input"
                      >
                        <option value="">Select month</option>
                        {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-2" style={{ color: '#5C4A3A' }}>Rating *</label>
                    <StarPicker value={reviewForm.rating} onChange={v => setReviewForm(f => ({ ...f, rating: v }))} />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: '#5C4A3A' }}>Review Title</label>
                    <input
                      value={reviewForm.title}
                      onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))}
                      placeholder="Summarise your trip in one line"
                      className="journal-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: '#5C4A3A' }}>Your Review *</label>
                    <textarea
                      required
                      rows={4}
                      value={reviewForm.body}
                      onChange={e => setReviewForm(f => ({ ...f, body: e.target.value }))}
                      placeholder="Tell others what you loved about this trip..."
                      className="journal-input resize-none"
                    />
                  </div>

                  {reviewError && (
                    <p className="text-sm text-red-600">{reviewError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="stamp-btn px-6 py-2.5 disabled:opacity-50"
                  >
                    {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="journal-card p-5">
                <div className="mb-4">
                  <p className="text-xs mb-0.5" style={{ color: '#B5A090' }}>Starting from</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold" style={{ color: '#5B7FA6' }}>{formatCurrency(itinerary.basePricePerPerson)}</span>
                    <span className="text-sm" style={{ color: '#B5A090' }}>/person</span>
                  </div>
                  <p className="text-xs mt-1" style={{ color: '#A06020' }}>Indicative price — confirmed after enquiry</p>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#5C4A3A' }}>Number of Travellers</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setTravelerCount(t => Math.max(itinerary.minTravelers, t - 1))}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-colors text-sm font-bold"
                      style={{ border: '1.5px solid #E8D5C4', color: '#8A7060' }}
                    >−</button>
                    <span className="text-base font-bold w-8 text-center" style={{ color: '#3D2C2C', fontFamily: 'Caveat, cursive', fontSize: '1.2rem' }}>{travelerCount}</span>
                    <button
                      onClick={() => setTravelerCount(t => Math.min(itinerary.maxTravelers, t + 1))}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-colors text-sm font-bold"
                      style={{ border: '1.5px solid #E8D5C4', color: '#8A7060' }}
                    >+</button>
                  </div>
                  <p className="text-xs mt-1" style={{ color: '#B5A090' }}>Estimated total: {formatCurrency(itinerary.basePricePerPerson * travelerCount)}</p>
                </div>

                <Link
                  to={`/customize/${itinerary.id}`}
                  className="stamp-btn flex items-center justify-center gap-2 w-full py-3"
                >
                  Customize & Get Quote <ArrowRight size={16} />
                </Link>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs" style={{ color: '#8A7060' }}>
                  <div className="flex items-center gap-1.5">
                    <Clock size={11} /> {itinerary.duration.days} Days
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users size={11} /> {itinerary.minTravelers}–{itinerary.maxTravelers} pax
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
