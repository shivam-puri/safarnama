import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomizerStore } from '../../store/customizerStore';
import { publicApi } from '../../lib/api';
import { TravelDetailsStep } from './steps/TravelDetailsStep';
import { AccommodationStep } from './steps/AccommodationStep';
import { TransportStep } from './steps/TransportStep';
import { ActivitiesStep } from './steps/ActivitiesStep';
import { SummaryStep } from './steps/SummaryStep';
import { PriceBar } from './PriceBar';
import { CheckCircle2 } from 'lucide-react';

const STEPS = [
  { number: 1, title: 'Travel Details', shortTitle: 'Details' },
  { number: 2, title: 'Accommodation', shortTitle: 'Hotel' },
  { number: 3, title: 'Transport', shortTitle: 'Transport' },
  { number: 4, title: 'Activities', shortTitle: 'Activities' },
  { number: 5, title: 'Summary & Enquiry', shortTitle: 'Summary' },
];

interface CustomizerWizardProps {
  itineraryId: string;
}

export function CustomizerWizard({ itineraryId: _itineraryId }: CustomizerWizardProps) {
  const navigate = useNavigate();
  const store = useCustomizerStore();
  const { currentStep, setStep } = store;
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const itinerary = store.pricingData?.itinerary;

  const handleNext = () => { if (currentStep < STEPS.length) setStep(currentStep + 1); };
  const handlePrev = () => { if (currentStep > 1) setStep(currentStep - 1); };

  const handleSubmit = async (customerForm: any) => {
    try {
      setSubmitting(true);
      setSubmitError('');
      const state = useCustomizerStore.getState();
      const payload = {
        itineraryId: state.itineraryId,
        customization: {
          travelerCount: state.travelerCount,
          travelMonth: state.travelMonth,
          hotelCategoryId: state.hotelCategoryId,
          roomSharingType: state.roomSharingType,
          numberOfRooms: state.numberOfRooms,
          transportOptionId: state.transportOptionId,
          selectedActivityIds: state.selectedActivityIds,
          removedActivityIds: state.removedActivityIds,
        },
        customer: customerForm,
        clientPriceBreakdown: state.priceBreakdown
          ? { totalAmount: state.priceBreakdown.totalAmount }
          : undefined,
      };
      const result = await publicApi.createLead(payload);
      navigate(`/enquiry-confirmed/${result.leadNumber}`);
    } catch (err: unknown) {
      const msg = (err as any)?.response?.data?.error?.message || 'Failed to submit enquiry. Please try again.';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <TravelDetailsStep />;
      case 2: return <AccommodationStep />;
      case 3: return <TransportStep />;
      case 4: return <ActivitiesStep />;
      case 5: return <SummaryStep onSubmitEnquiry={handleSubmit} submitting={submitting} submitError={submitError} />;
      default: return null;
    }
  };

  if (!itinerary) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p style={{ color: '#8A7060' }}>Itinerary not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFBF5' }}>
      {/* Header */}
      <div className="sticky top-0 z-30" style={{ backgroundColor: '#FFFBF5', borderBottom: '1.5px solid #E8D5C4' }}>
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="mb-3">
            <h1 className="text-base font-semibold" style={{ color: '#3D2C2C' }}>{itinerary.title}</h1>
            <p className="text-xs" style={{ color: '#8A7060' }}>{itinerary.duration?.days}D/{itinerary.duration?.nights}N · Customize your trip</p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1">
            {STEPS.map((step, idx) => {
              const isCompleted = currentStep > step.number;
              const isCurrent = currentStep === step.number;

              return (
                <div key={step.number} className="flex items-center gap-1 sm:gap-2 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                      style={{
                        backgroundColor: isCompleted ? '#6BAE8E' : isCurrent ? '#5B7FA6' : '#E8D5C4',
                        color: isCompleted || isCurrent ? '#fff' : '#A08070',
                      }}
                    >
                      {isCompleted ? <CheckCircle2 size={14} /> : step.number}
                    </div>
                    <span className="text-xs font-medium hidden sm:block" style={{ color: isCurrent ? '#5B7FA6' : '#B5A090' }}>
                      {step.shortTitle}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className="w-4 sm:w-8 h-0.5 rounded-full" style={{ backgroundColor: isCompleted ? '#6BAE8E' : '#E8D5C4' }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="max-w-4xl mx-auto px-4 py-6 pb-32">
        <div className="journal-card p-5 sm:p-6">
          <h2 className="text-lg font-semibold mb-5" style={{ color: '#3D2C2C', fontFamily: 'Caveat, cursive', fontSize: '1.3rem' }}>
            Step {currentStep}: {STEPS[currentStep - 1].title}
          </h2>
          {renderStep()}
        </div>
      </div>

      {/* Price Bar */}
      <PriceBar
        onNext={handleNext}
        onPrev={handlePrev}
        currentStep={currentStep}
        totalSteps={STEPS.length}
        isLastStep={currentStep === STEPS.length}
        onSubmit={() => {}}
      />
    </div>
  );
}
