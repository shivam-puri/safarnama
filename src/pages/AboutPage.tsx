import { DoodleCompass, DoodlePlane, DoodleStar, DoodleWave } from '../components/common/Doodles';
import { Seo } from '../components/common/Seo';

const team = [
  {
    name: 'Somil',
    role: 'People Connector',
    bio: 'Enjoys meeting new people, building meaningful relationships, and bringing together the right partners to create memorable travel experiences.',
    initials: 'S',
  },
  {
    name: 'Rudransh',
    role: 'People Connector',
    bio: 'Loves connecting with travellers, understanding their ideas, and making sure every journey starts with the right conversation.',
    initials: 'R',
  },
  {
    name: 'Daksha',
    role: 'Trip Architect',
    bio: 'Passionate about discovering unique places and designing itineraries that balance adventure, culture, and unforgettable moments.',
    initials: 'D',
  },
  {
    name: 'Shivam',
    role: 'Tech Wizard',
    bio: 'Enjoys building simple, reliable technology that makes planning trips easier and lets travellers focus on the journey.',
    initials: 'S',
  },
];

export function AboutPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFBF5' }}>
      <Seo
        title="About Us | Window Seat Trails"
        description="Meet the team behind Window Seat Trails and learn how we design custom, hassle-free travel itineraries across India."
        path="/about"
      />
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
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
