import { Heart, Map, Users, Award } from 'lucide-react';
import { DoodleCompass, DoodlePlane, DoodleStar, DoodleWave } from '../components/common/Doodles';

const team = [
  { name: 'Arjun Kapoor', role: 'Founder & CEO', bio: '15+ years in travel industry. Passionate about making India accessible to every traveller.', initials: 'AK' },
  { name: 'Priya Nair', role: 'Head of Operations', bio: 'Former trekking guide turned operations expert. Ensures every trip runs smoothly.', initials: 'PN' },
  { name: 'Rahul Mathur', role: 'Lead Travel Designer', bio: 'Crafts itineraries with a personal touch. Has visited every destination we offer.', initials: 'RM' },
];

export function AboutPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFBF5' }}>
      {/* Hero */}
      <div className="text-white py-20 px-4 relative overflow-hidden" style={{ backgroundColor: '#3D2C2C' }}>
        <DoodleCompass size={110} color="#FFFBF5" className="absolute left-8 top-8 pointer-events-none hidden lg:block" opacity={0.1} />
        <DoodlePlane size={52} color="#F4A261" className="absolute right-12 top-10 hidden md:block pointer-events-none rotate-6" opacity={0.35} />
        <DoodleStar size={20} color="#F4A261" className="absolute right-32 bottom-8 hidden md:block pointer-events-none" opacity={0.5} />
        <DoodleStar size={14} color="#FFFBF5" className="absolute left-1/4 bottom-6 hidden md:block pointer-events-none" opacity={0.3} />
        <div className="max-w-4xl mx-auto text-center relative">
          <p className="journal-label mb-3" style={{ color: '#F4A261' }}>Our story</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'Caveat, cursive' }}>About Window Seat</h1>
          <div className="flex justify-center mb-4">
            <DoodleWave width={160} color="#F4A261" opacity={0.5} />
          </div>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: '#C4A898' }}>
            We believe every journey should be as unique as the traveller. Our mission is to make personalized travel planning simple, transparent, and joyful.
          </p>
        </div>
      </div>

      {/* Mission */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#3D2C2C', fontFamily: 'Caveat, cursive', fontSize: '1.75rem' }}>Our Story</h2>
              <p className="leading-relaxed mb-4" style={{ color: '#5C4A3A' }}>
                Founded in 2019, Window Seat was born from a frustration with one-size-fits-all tour packages. We wanted to offer travelers the ability to truly personalize their Indian adventures — choosing their own hotels, activities, and transport — while seeing real prices upfront.
              </p>
              <p className="leading-relaxed" style={{ color: '#5C4A3A' }}>
                Today, we've helped over 5,000 families, couples, and solo travellers experience the magic of India on their own terms. From the snow-capped peaks of Kashmir to the backwaters of Kerala, we craft journeys that reflect who you are.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <Heart size={28} style={{ color: '#E8643C' }} />, number: '5,000+', label: 'Happy Travellers' },
                { icon: <Map size={28} style={{ color: '#5B7FA6' }} />, number: '25+', label: 'Destinations' },
                { icon: <Users size={28} style={{ color: '#6BAE8E' }} />, number: '15+', label: 'Expert Guides' },
                { icon: <Award size={28} style={{ color: '#F4A261' }} />, number: '4.8/5', label: 'Average Rating' },
              ].map((stat, idx) => (
                <div key={idx} className="journal-card p-4 text-center">
                  <div className="flex justify-center mb-2">{stat.icon}</div>
                  <p className="text-xl font-bold" style={{ color: '#3D2C2C', fontFamily: 'Caveat, cursive', fontSize: '1.5rem' }}>{stat.number}</p>
                  <p className="text-xs" style={{ color: '#8A7060' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <div className="wavy-divider" style={{ marginTop: '-1px' }} />
      <section className="py-14 px-4 section-warm">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#3D2C2C', fontFamily: 'Caveat, cursive', fontSize: '1.75rem' }}>Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Transparency', description: 'No hidden costs. Every price adjustment is shown in real-time as you customize your trip.' },
              { title: 'Personalization', description: 'Your trip, your way. From hotel category to activities — you control every detail.' },
              { title: 'Reliability', description: 'Our team verifies every booking. Your confirmed quote means we stand behind it.' },
            ].map((v, idx) => (
              <div key={idx} className="journal-card p-5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: '#D6E4F0', border: '1.5px solid #B8D0E8' }}>
                  <span className="text-sm font-bold" style={{ color: '#3D6089', fontFamily: 'Caveat, cursive' }}>{idx + 1}</span>
                </div>
                <h3 className="font-bold mb-2" style={{ color: '#3D2C2C' }}>{v.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#8A7060' }}>{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <div className="wavy-divider-cream" style={{ marginTop: '-1px' }} />
      <section className="py-16 px-4" style={{ backgroundColor: '#FFFBF5' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#3D2C2C', fontFamily: 'Caveat, cursive', fontSize: '1.75rem' }}>Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member, idx) => (
              <div key={idx} className="text-center">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#3D2C2C' }}>
                  <span className="text-xl font-bold text-white" style={{ fontFamily: 'Caveat, cursive' }}>{member.initials}</span>
                </div>
                <h3 className="font-bold" style={{ color: '#3D2C2C' }}>{member.name}</h3>
                <p className="text-sm mb-2" style={{ color: '#E8643C' }}>{member.role}</p>
                <p className="text-sm leading-relaxed" style={{ color: '#8A7060' }}>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
