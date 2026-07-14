import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Share2, Users, AtSign, PlayCircle } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: '#2C1F1F', color: '#C4A898' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: About */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="Window Seat" className="h-8 w-8 object-contain" />
              <span className="text-lg" style={{ color: '#FFF5EC', fontFamily: 'Caveat, cursive', fontWeight: 700 }}>Window Seat</span>
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: '#A08070' }}>
              Crafting unforgettable journeys across India's most beautiful destinations. Personalized travel, seamless experiences.
            </p>
            <div className="flex items-center gap-3 mt-4">
              {[Share2, Users, AtSign, PlayCircle].map((Icon, i) => (
                <a key={i} href="#" className="transition-colors" style={{ color: '#A08070' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#F4A261')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#A08070')}
                  aria-label="Social link">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="mb-4 text-base" style={{ color: '#FFF5EC', fontFamily: 'Caveat, cursive', fontWeight: 600 }}>Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: '/destinations', label: 'All Destinations' },
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact Us' },
                { href: '/terms', label: 'Terms & Conditions' },
                { href: '/cancellation-policy', label: 'Cancellation Policy' },
              ].map(link => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm transition-colors" style={{ color: '#A08070' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#F4A261')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#A08070')}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Destinations */}
          <div>
            <h3 className="mb-4 text-base" style={{ color: '#FFF5EC', fontFamily: 'Caveat, cursive', fontWeight: 600 }}>Popular Destinations</h3>
            <ul className="space-y-2">
              {[
                { href: '/destinations/kashmir', label: 'Kashmir' },
                { href: '/destinations/manali', label: 'Manali' },
                { href: '/destinations/kerala', label: 'Kerala' },
              ].map(link => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm transition-colors" style={{ color: '#A08070' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#F4A261')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#A08070')}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="mb-4 text-base" style={{ color: '#FFF5EC', fontFamily: 'Caveat, cursive', fontWeight: 600 }}>Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm" style={{ color: '#A08070' }}>
                <MapPin size={16} className="mt-0.5 shrink-0" style={{ color: '#F4A261' }} />
                <span>104, Man Arch Apartment, Anoop Nagar, Indore 452011</span>
              </li>
              <li className="flex items-center gap-2 text-sm" style={{ color: '#A08070' }}>
                <Phone size={16} className="shrink-0" style={{ color: '#F4A261' }} />
                <a href="tel:+917773862111" className="transition-colors hover:text-[#F4A261]">+91 77738 62111</a>
                <a href="tel:+917773862111" className="transition-colors hover:text-[#F4A261]">+91 9301133682</a>
              </li>
              <li className="flex items-center gap-2 text-sm" style={{ color: '#A08070' }}>
                <Mail size={16} className="shrink-0" style={{ color: '#F4A261' }} />
                <a href="mailto:window.seat.trails@gmail.com" className="transition-colors hover:text-[#F4A261]">window.seat.trails@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid #3D2C2C' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs" style={{ color: '#7A6050' }}>
          <p>© {currentYear} Window Seat. All rights reserved.</p>
          <p>Prices are indicative and subject to confirmation. GST @5% applicable.</p>
        </div>
      </div>
    </footer>
  );
}
