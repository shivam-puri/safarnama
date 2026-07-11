import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Sliders, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { DestinationCard } from '../components/destination/DestinationCard';
import { ItineraryCard } from '../components/itinerary/ItineraryCard';
import { DoodlePlane, DoodleMountain, DoodleCompass, DoodleStar, DoodlePalmTree, DoodleDotPath } from '../components/common/Doodles';
import { CardSkeletonGrid } from '../components/common/LoadingSkeleton';
import { useAsync } from '../hooks/useAsync';
import { publicApi, adminApi } from '../lib/api';

const HERO_IMAGES = [
  { url: 'https://i.pinimg.com/1200x/5d/c2/d3/5dc2d359af5a622136b87f2fd5eba5a5.jpg', alt: 'Travel Journal 1' },
  { url: 'https://i.pinimg.com/736x/8f/0f/11/8f0f1192a8053845768339b1cc9f7cef.jpg', alt: 'Travel Journal 2' },
  { url: 'https://i.pinimg.com/736x/51/28/58/512858f1b0248ac4dd78aebd1efc199c.jpg', alt: 'Travel Journal 3' },
];

const HERO_IMAGES_MOBILE = [
  { url: 'https://i.pinimg.com/736x/ea/4f/ef/ea4fefc570cffe5bd558a5c4b1be386a.jpg', alt: 'Travel Journal Mobile 1' },
  { url: 'https://i.pinimg.com/1200x/d5/34/5a/d5345ab7004ef4f87f058c344fda1fef.jpg', alt: 'Travel Journal Mobile 2' },
  { url: 'https://i.pinimg.com/736x/45/9f/fc/459ffcb383e7d9df1166b6b7aeaa5ec0.jpg', alt: 'Travel Journal Mobile 3' },
];

export function HomePage() {
  const [heroIndex, setHeroIndex] = useState(0);
  const { data: destinations, loading: destinationsLoading } = useAsync(() => publicApi.getDestinations(), []);
  const { data: itinerariesData, loading: itinerariesLoading } = useAsync(() => adminApi.getItineraries({ isFeatured: true, limit: 6 }), []);

  const featuredItineraries = itinerariesData?.data ?? [];

  useEffect(() => {
    const timer = setInterval(() => setHeroIndex(i => (i + 1) % HERO_IMAGES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar transparent />

      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Desktop images — rotated portrait fills landscape viewport */}
        {HERO_IMAGES.map((img, idx) => (
          <div key={`d-${idx}`} className={`absolute inset-0 transition-opacity duration-1000 hidden md:block ${idx === heroIndex ? 'opacity-100' : 'opacity-0'}`}>
            <img
              src={img.url}
              alt={img.alt}
              style={{
                position: 'absolute',
                width: '100vh',
                height: '100vw',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) rotate(-90deg)',
                objectFit: 'cover',
              }}
            />
          </div>
        ))}
        {/* Mobile images — portrait fills portrait viewport naturally */}
        {HERO_IMAGES_MOBILE.map((img, idx) => (
          <div key={`m-${idx}`} className={`absolute inset-0 transition-opacity duration-1000 md:hidden ${idx === heroIndex ? 'opacity-100' : 'opacity-0'}`}>
            <img
              src={img.url}
              alt={img.alt}
              className="w-full h-full object-cover object-center"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
        {/* Doodle dot texture overlay */}
        <div className="absolute inset-0 hero-doodle-bg opacity-25 pointer-events-none" />

        {/* Floating doodles */}
        <DoodlePlane size={56} color="#FFFBF5" className="absolute top-28 right-16 hidden lg:block rotate-12" opacity={0.35} />
        <DoodlePalmTree size={64} color="#FFFBF5" className="absolute bottom-20 left-12 hidden lg:block -rotate-6" opacity={0.22} />
        <DoodleStar size={22} color="#F4A261" className="absolute top-36 left-20 hidden md:block" opacity={0.55} />
        <DoodleStar size={14} color="#FFFBF5" className="absolute top-44 right-1/3 hidden md:block" opacity={0.4} />

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <p className="journal-label mb-3" style={{ color: '#F4A261' }}>Your journey begins here</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4" style={{ fontFamily: 'Caveat, cursive' }}>
            Discover India,<br /><span style={{ color: '#F4A261' }}>Your Way</span>
          </h1>
          <p className="text-gray-200 text-base sm:text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Customize every detail of your Indian adventure — hotel, transport, activities — and get a real-time quote in minutes.
          </p>
          <div className="flex flex-col items-center sm:flex-row gap-3 justify-center">
            <Link to="/destinations" className="stamp-btn px-6 py-3 text-base">
              Explore Destinations <ArrowRight size={16} />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-full backdrop-blur-sm border transition-all"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}
            >
              How It Works
            </a>
          </div>
        </div>

        {/* Hero nav dots */}
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {HERO_IMAGES.map((_, idx) => (
            <button key={idx} onClick={() => setHeroIndex(idx)}
              className={`h-2 rounded-full transition-all ${idx === heroIndex ? 'w-6 bg-white' : 'w-2 bg-white/50'}`}
            />
          ))}
        </div>

        {/* Wavy divider at bottom of hero */}
        <div className="absolute bottom-0 left-0 right-0 wavy-divider-cream z-10" />

        <button onClick={() => setHeroIndex(i => (i - 1 + HERO_IMAGES.length) % HERO_IMAGES.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white/70 hover:text-white p-2 hidden sm:block">
          <ChevronLeft size={32} />
        </button>
        <button onClick={() => setHeroIndex(i => (i + 1) % HERO_IMAGES.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white/70 hover:text-white p-2 hidden sm:block">
          <ChevronRight size={32} />
        </button>
      </section>

      {/* Featured Destinations */}
      <section className="py-16 px-4 relative overflow-hidden" style={{ backgroundColor: '#FFFBF5' }}>
        {/* background doodle */}
        <DoodleMountain size={160} color="#E8D5C4" className="absolute -right-4 top-6 pointer-events-none" opacity={0.45} />
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-10">
            <p className="journal-label mb-2">Where to next?</p>
            <h2 className="hand-heading text-3xl sm:text-4xl mb-2">
              Explore <span className="hand-underline">Top Destinations</span>
            </h2>
            <p className="mt-3 max-w-xl mx-auto" style={{ color: '#8A7060' }}>From Himalayan heights to Kerala's backwaters — India's most breathtaking places await.</p>
          </div>
          {destinationsLoading ? (
            <CardSkeletonGrid count={6} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(destinations ?? []).map((dest: any) => (
                <DestinationCard key={dest._id ?? dest.id} destination={dest} />
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link to="/destinations" className="stamp-btn-outline px-6 py-2.5">
              View All Destinations <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>


      {/* Wavy divider */}
      <div className="wavy-divider" style={{ marginTop: '-1px' }} />

      {/* Featured Itineraries */}
      <section className="py-16 px-4 section-warm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="journal-label mb-1">Handpicked for you</p>
              <h2 className="hand-heading text-3xl">Most <span className="hand-underline">Popular Trips</span></h2>
            </div>
            <Link to="/destinations" className="hidden sm:flex items-center gap-1 text-sm font-semibold transition-colors hover:text-[#E8643C]" style={{ color: '#5B7FA6' }}>
              All Trips <ArrowRight size={14} />
            </Link>
          </div>
          {itinerariesLoading ? (
            <CardSkeletonGrid count={4} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredItineraries.slice(0, 4).map((itn: any) => (
                <ItineraryCard key={itn._id ?? itn.id} itinerary={itn} showCustomizeButton />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Wavy divider */}
      <div className="wavy-divider-cream" style={{ marginTop: '-1px' }} />

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-4 relative overflow-hidden" style={{ backgroundColor: '#FFFBF5' }}>
        {/* background compass doodle */}
        <DoodleCompass size={120} color="#E8D5C4" className="absolute -left-6 top-8 pointer-events-none hidden lg:block" opacity={0.5} />
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-4">
            <p className="journal-label mb-2">Simple & Transparent</p>
            <h2 className="hand-heading text-3xl sm:text-4xl mb-2">How It Works</h2>
            <p className="mt-2" style={{ color: '#8A7060' }}>Plan your perfect trip in 3 easy steps</p>
          </div>

          {/* Dot path travel trail */}
          <div className="flex justify-center mb-10">
            <DoodleDotPath width={280} color="#D4B8A8" opacity={0.7} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Compass size={32} style={{ color: '#5B7FA6' }} />, step: '01', title: 'Choose a Destination', description: 'Browse our curated destinations across India — from Himalayan adventures to tropical escapes.' },
              { icon: <Sliders size={32} style={{ color: '#E8643C' }} />, step: '02', title: 'Customize Your Trip', description: 'Select your hotel category, transport, activities, and group size. See prices update in real-time.' },
              { icon: <Send size={32} style={{ color: '#6BAE8E' }} />, step: '03', title: 'Get Your Quote', description: 'Submit your enquiry and our travel expert will confirm your personalized quote within 24 hours.' },
            ].map((item, idx) => (
              <div key={idx} className="text-center group">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all group-hover:shadow-md" style={{ backgroundColor: '#FFF5EC', border: '1.5px solid #E8D5C4' }}>
                  {item.icon}
                </div>
                <div className="text-4xl font-bold -mb-2" style={{ color: '#E8D5C4', fontFamily: 'Caveat, cursive' }}>{item.step}</div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#3D2C2C' }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#8A7060' }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews section */}
      <div className="wavy-divider" style={{ marginTop: '-1px' }} />
      <section className="py-16 px-4 section-warm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="journal-label mb-2">Happy Travellers</p>
            <h2 className="hand-heading text-3xl sm:text-4xl">What Our Travellers Say</h2>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4 relative overflow-hidden" style={{ backgroundColor: '#3D2C2C' }}>
        <DoodleStar size={36} color="#F4A261" className="absolute left-12 top-8 hidden md:block pointer-events-none" opacity={0.35} />
        <DoodleStar size={22} color="#FFFBF5" className="absolute right-16 bottom-10 hidden md:block pointer-events-none" opacity={0.2} />
        <DoodlePlane size={44} color="#C4A898" className="absolute right-8 top-6 hidden lg:block pointer-events-none -rotate-6" opacity={0.25} />
        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="text-3xl font-bold mb-3 text-white" style={{ fontFamily: 'Caveat, cursive', fontSize: '2.5rem' }}>Ready to plan your dream trip?</h2>
          <p className="mb-8 leading-relaxed" style={{ color: '#C4A898' }}>Join thousands of travellers who have discovered India's most beautiful destinations with us. Your adventure awaits.</p>
          <Link to="/destinations" className="stamp-btn px-8 py-3.5 text-lg">
            Start Planning <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
