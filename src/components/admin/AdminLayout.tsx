import { useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  Map,
  Zap,
  Hotel,
  Truck,
  FileText,
  Star,
  BookOpen,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAdminAuthStore } from '../../store/adminAuthStore';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

function NavItem({ to, icon, label }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? 'bg-blue-600 text-white'
            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
        }`
      }
    >
      <span className="flex-shrink-0">{icon}</span>
      {label}
    </NavLink>
  );
}

function NavGroup({ label }: { label: string }) {
  return (
    <div className="px-4 pt-4 pb-1">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
    </div>
  );
}

export function AdminLayout() {
  const { logout } = useAdminAuthStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [pathname]);

  function handleLogout() {
    logout();
    navigate('/admin/login');
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden" style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Sidebar */}
      <aside className="w-60 bg-slate-800 flex flex-col flex-shrink-0 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-700">
          <img src="/logo.png" alt="Window Seat" className="w-8 h-8 object-contain" />
          <div>
            <p className="text-white font-bold text-sm">Window Seat</p>
            <p className="text-slate-400 text-xs">Admin Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 space-y-0.5">
          <NavItem to="/admin/dashboard" icon={<LayoutDashboard size={16} />} label="Dashboard" />

          <NavGroup label="Content Management" />
          <NavItem to="/admin/destinations" icon={<MapPin size={16} />} label="Destinations" />
          <NavItem to="/admin/itineraries" icon={<Map size={16} />} label="Itineraries" />
          <NavItem to="/admin/activities" icon={<Zap size={16} />} label="Activities" />

          <NavGroup label="Pricing & Options" />
          <NavItem to="/admin/hotel-categories" icon={<Hotel size={16} />} label="Hotel Categories" />
          <NavItem to="/admin/transport-options" icon={<Truck size={16} />} label="Transport Options" />

          <NavGroup label="Customer" />
          <NavItem to="/admin/leads" icon={<FileText size={16} />} label="Leads / Enquiries" />
          <NavItem to="/admin/reviews" icon={<Star size={16} />} label="Reviews" />

          <NavGroup label="Configuration" />
          <NavItem to="/admin/cms" icon={<BookOpen size={16} />} label="CMS Content" />
          <NavItem to="/admin/settings" icon={<Settings size={16} />} label="Site Settings" />
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="font-medium text-slate-900">Admin Panel</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-1.5">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">A</div>
              <span className="text-sm font-medium text-slate-700">Admin</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-slate-500 hover:text-slate-700 px-2 py-1.5"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main ref={mainRef} className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
