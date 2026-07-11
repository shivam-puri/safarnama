import { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { CustomizerWizard } from '../components/customizer/CustomizerWizard';
import { useCustomizerStore } from '../store/customizerStore';
import { WizardSkeleton } from '../components/common/LoadingSkeleton';

export function CustomizePage() {
  const { itineraryId } = useParams<{ itineraryId: string }>();
  const store = useCustomizerStore();

  useEffect(() => {
    if (itineraryId) store.initializeFromItinerary(itineraryId);
  }, [itineraryId]);

  if (!itineraryId) return <Navigate to="/destinations" replace />;

  if (store.loading) {
    return (
      <div>
        <Navbar />
        <WizardSkeleton />
      </div>
    );
  }

  if (store.error) {
    return (
      <div>
        <Navbar />
        <div className="pt-16 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error: {store.error}</p>
            <a href="/destinations" className="text-[#0F4C81] hover:underline">← Back to Destinations</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="pt-16">
        <CustomizerWizard itineraryId={itineraryId} />
      </div>
    </div>
  );
}
