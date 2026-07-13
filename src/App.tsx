import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import { useSiteSettingsStore } from './store/siteSettingsStore';
import { useRouteTransition } from './hooks/useRouteTransition';
import { ScrollToTop } from './components/common/ScrollToTop';
import { RouteTransitionOverlay } from './components/common/RouteTransitionOverlay';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { DestinationsPage } from './pages/DestinationsPage';
import { DestinationDetailPage } from './pages/DestinationDetailPage';
import { ItineraryDetailPage } from './pages/ItineraryDetailPage';
import { CategoryTripsPage } from './pages/CategoryTripsPage';
import { CustomizePage } from './pages/CustomizePage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { TermsPage } from './pages/TermsPage';
import { CancellationPage } from './pages/CancellationPage';

// Admin imports
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { DashboardPage } from './pages/admin/DashboardPage';
import { DestinationsListPage } from './pages/admin/destinations/DestinationsListPage';
import { DestinationFormPage } from './pages/admin/destinations/DestinationFormPage';
import { ItinerariesListPage } from './pages/admin/itineraries/ItinerariesListPage';
import { ItineraryFormPage } from './pages/admin/itineraries/ItineraryFormPage';
import { ActivitiesListPage } from './pages/admin/activities/ActivitiesListPage';
import { ActivityFormPage } from './pages/admin/activities/ActivityFormPage';
import { HotelCategoriesListPage } from './pages/admin/hotel-categories/HotelCategoriesListPage';
import { HotelCategoryFormPage } from './pages/admin/hotel-categories/HotelCategoryFormPage';
import { TransportOptionsListPage } from './pages/admin/transport-options/TransportOptionsListPage';
import { TransportOptionFormPage } from './pages/admin/transport-options/TransportOptionFormPage';
import { LeadsListPage } from './pages/admin/leads/LeadsListPage';
import { LeadDetailPage } from './pages/admin/leads/LeadDetailPage';
import { ReviewsPage } from './pages/admin/reviews/ReviewsPage';
import { CmsPage } from './pages/admin/cms/CmsPage';
import { SettingsPage } from './pages/admin/settings/SettingsPage';

// Standard layout with Navbar + Footer (non-transparent navbar)
function CustomerLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

// Layout without Footer (for customize page — PriceBar occupies the bottom)
function CustomizeLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

// Homepage has its own transparent Navbar (managed inside HomePage)
function HomeLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

const router = createBrowserRouter([
  // ── Customer Routes ────────────────────────────────────────────────────────
  {
    path: '/',
    element: <HomeLayout />,
    children: [
      { index: true, element: <HomePage /> },
    ],
  },
  {
    path: '/destinations',
    element: <CustomerLayout />,
    children: [
      { index: true, element: <DestinationsPage /> },
      { path: ':slug', element: <DestinationDetailPage /> },
      { path: ':destSlug/:itinerarySlug', element: <ItineraryDetailPage /> },
    ],
  },
  {
    path: '/trips',
    element: <CustomerLayout />,
    children: [
      { path: ':category', element: <CategoryTripsPage /> },
    ],
  },
  {
    path: '/customize',
    element: <CustomizeLayout />,
    children: [
      { path: ':itineraryId', element: <CustomizePage /> },
    ],
  },
  {
    path: '/',
    element: <CustomerLayout />,
    children: [
      { path: 'enquiry-confirmed/:leadNumber', element: <ConfirmationPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: 'cancellation-policy', element: <CancellationPage /> },
    ],
  },

  // ── Admin Routes ──────────────────────────────────────────────────────────
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'destinations', element: <DestinationsListPage /> },
      { path: 'destinations/new', element: <DestinationFormPage /> },
      { path: 'destinations/:id/edit', element: <DestinationFormPage /> },
      { path: 'itineraries', element: <ItinerariesListPage /> },
      { path: 'itineraries/new', element: <ItineraryFormPage /> },
      { path: 'itineraries/:id/edit', element: <ItineraryFormPage /> },
      { path: 'activities', element: <ActivitiesListPage /> },
      { path: 'activities/new', element: <ActivityFormPage /> },
      { path: 'activities/:id/edit', element: <ActivityFormPage /> },
      { path: 'hotel-categories', element: <HotelCategoriesListPage /> },
      { path: 'hotel-categories/new', element: <HotelCategoryFormPage /> },
      { path: 'hotel-categories/:id/edit', element: <HotelCategoryFormPage /> },
      { path: 'transport-options', element: <TransportOptionsListPage /> },
      { path: 'transport-options/new', element: <TransportOptionFormPage /> },
      { path: 'transport-options/:id/edit', element: <TransportOptionFormPage /> },
      { path: 'leads', element: <LeadsListPage /> },
      { path: 'leads/:id', element: <LeadDetailPage /> },
      { path: 'reviews', element: <ReviewsPage /> },
      { path: 'cms', element: <CmsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
]);

export default function App() {
  const transitioning = useRouteTransition(router, 2000);

  useEffect(() => {
    useSiteSettingsStore.getState().fetch();
  }, []);

  return (
    <>
      <RouteTransitionOverlay visible={transitioning} />
      <RouterProvider router={router} />
    </>
  );
}
