import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { FEATURED_CATEGORIES } from '../../lib/categories';

interface NavbarProps {
  transparent?: boolean;
}

export function Navbar({ transparent = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tripsOpen, setTripsOpen] = useState(false);
  const [mobileTripsOpen, setMobileTripsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isTransparent = transparent && !scrolled;
  const textColor = isTransparent ? 'text-white' : 'text-[#5C4A3A]';

  const navLinks = [
    { href: '/destinations', label: 'Destinations' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isTransparent
        ? 'bg-transparent'
        : 'bg-[#FFFBF5]/97 backdrop-blur-md border-b border-[#E8D5C4]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img src={isTransparent ? '/logo.png' : '/logo2.png'} alt="Window Seat" className="h-9 w-9 object-contain transition-transform duration-300 group-hover:scale-105" />
            <span className={`text-2xl font-bold ${textColor}`} style={{ fontFamily: 'Caveat, cursive' }}>Window Seat</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-semibold transition-colors hover:text-[#E8643C] ${
                  location.pathname === link.href ? 'text-[#E8643C]' : textColor
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Trips — hover dropdown of categories */}
            <div
              className="relative"
              onMouseEnter={() => setTripsOpen(true)}
              onMouseLeave={() => setTripsOpen(false)}
            >
              <button
                type="button"
                onClick={() => setTripsOpen(o => !o)}
                className={`flex items-center gap-1 text-sm font-semibold transition-colors hover:text-[#E8643C] ${
                  location.pathname.startsWith('/trips') ? 'text-[#E8643C]' : textColor
                }`}
              >
                Trips <ChevronDown size={14} className={`transition-transform ${tripsOpen ? 'rotate-180' : ''}`} />
              </button>

              {tripsOpen && (
                <div
                  className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-72"
                  onMouseEnter={() => setTripsOpen(true)}
                  onMouseLeave={() => setTripsOpen(false)}
                >
                  <div
                    className="rounded-2xl p-3 grid grid-cols-2 gap-1"
                    style={{ backgroundColor: '#FFFBF5', border: '1.5px solid #E8D5C4', boxShadow: '4px 4px 0 #E8D5C4' }}
                  >
                    {FEATURED_CATEGORIES.map(cat => (
                      <Link
                        key={cat.value}
                        to={`/trips/${cat.value}`}
                        onClick={() => setTripsOpen(false)}
                        className="flex items-center gap-2 px-2.5 py-2 rounded-xl transition-colors hover:bg-[#FFF5EC]"
                      >
                        <span
                          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: '#FFF5EC', border: '1.5px solid #E8D5C4' }}
                        >
                          <cat.icon size={15} strokeWidth={1.75} style={{ color: cat.color }} />
                        </span>
                        <span className="text-sm font-semibold" style={{ color: '#3D2C2C' }}>{cat.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-4">
            <Link to="/destinations" className="hidden md:inline-flex stamp-btn text-sm px-4 py-2">
              Plan Your Trip
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden p-2 ${textColor}`}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 space-y-1" style={{ backgroundColor: '#FFFBF5', borderTop: '1.5px solid #E8D5C4' }}>
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors"
                style={{ color: '#5C4A3A' }}
                onMouseEnter={e => { (e.target as HTMLElement).style.color = '#E8643C'; (e.target as HTMLElement).style.backgroundColor = '#FFF5EC'; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.color = '#5C4A3A'; (e.target as HTMLElement).style.backgroundColor = 'transparent'; }}
              >
                {link.label}
              </Link>
            ))}

            {/* Trips — expandable category list */}
            <button
              type="button"
              onClick={() => setMobileTripsOpen(o => !o)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors"
              style={{ color: '#5C4A3A' }}
            >
              Trips
              <ChevronDown size={16} className={`transition-transform ${mobileTripsOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileTripsOpen && (
              <div className="px-4 pb-1 grid grid-cols-2 gap-2">
                {FEATURED_CATEGORIES.map(cat => (
                  <Link
                    key={cat.value}
                    to={`/trips/${cat.value}`}
                    onClick={() => { setMobileOpen(false); setMobileTripsOpen(false); }}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-xl transition-colors"
                    style={{ backgroundColor: '#FFF5EC' }}
                  >
                    <span
                      className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#FFFBF5', border: '1.5px solid #E8D5C4' }}
                    >
                      <cat.icon size={13} strokeWidth={1.75} style={{ color: cat.color }} />
                    </span>
                    <span className="text-xs font-semibold" style={{ color: '#3D2C2C' }}>{cat.label}</span>
                  </Link>
                ))}
              </div>
            )}

            <div className="px-4 pt-2">
              <Link
                to="/destinations"
                onClick={() => setMobileOpen(false)}
                className="stamp-btn w-full text-sm"
              >
                Plan Your Trip
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
