import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Menu, X } from 'lucide-react';

interface NavbarProps {
  transparent?: boolean;
}

export function Navbar({ transparent = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isTransparent = transparent && !scrolled;
  const textColor = isTransparent ? 'text-white' : 'text-[#5C4A3A]';
  const logoColor = isTransparent ? 'text-white' : 'text-[#5B7FA6]';

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
            <Compass size={28} className={`${logoColor} group-hover:rotate-45 transition-transform duration-300`} />
            <span className={`text-xl font-bold ${logoColor}`} style={{ fontFamily: 'Caveat, cursive' }}>Safarnama</span>
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
