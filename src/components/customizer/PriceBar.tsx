import { useState } from 'react';
import { ChevronUp, ChevronDown, ArrowRight } from 'lucide-react';
import { useCustomizerStore } from '../../store/customizerStore';
import { formatIndianCurrency } from '../../lib/pricing-engine';

interface PriceBarProps {
  onNext: () => void;
  onPrev: () => void;
  currentStep: number;
  totalSteps: number;
  isLastStep?: boolean;
  onSubmit?: () => void;
}

export function PriceBar({ onNext, onPrev, currentStep, totalSteps: _totalSteps, isLastStep, onSubmit }: PriceBarProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const priceBreakdown = useCustomizerStore(s => s.priceBreakdown);

  if (!priceBreakdown) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40" style={{ backgroundColor: '#FFFBF5', borderTop: '2px solid #E8D5C4', boxShadow: '0 -2px 0 #E8D5C4' }}>
      {/* Breakdown panel */}
      {showBreakdown && (
        <div className="px-4 py-4 max-w-4xl mx-auto" style={{ backgroundColor: '#FFF5EC', borderBottom: '1.5px solid #E8D5C4' }}>
          <h4 className="text-sm font-semibold mb-3" style={{ color: '#3D2C2C' }}>Price Breakdown</h4>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between"><span style={{ color: '#8A7060' }}>Base Price</span><span className="font-medium" style={{ color: '#3D2C2C' }}>{formatIndianCurrency(priceBreakdown.basePrice)}</span></div>
            {priceBreakdown.hotelUpgrade !== 0 && (
              <div className="flex justify-between">
                <span style={{ color: '#8A7060' }}>Hotel {priceBreakdown.hotelUpgrade > 0 ? 'Upgrade' : 'Discount'}</span>
                <span className="font-medium" style={{ color: priceBreakdown.hotelUpgrade > 0 ? '#E8643C' : '#6BAE8E' }}>{formatIndianCurrency(priceBreakdown.hotelUpgrade)}</span>
              </div>
            )}
            {priceBreakdown.roomSharingAdjustment !== 0 && (
              <div className="flex justify-between">
                <span style={{ color: '#8A7060' }}>Room Sharing</span>
                <span className="font-medium" style={{ color: priceBreakdown.roomSharingAdjustment > 0 ? '#E8643C' : '#6BAE8E' }}>{formatIndianCurrency(priceBreakdown.roomSharingAdjustment)}</span>
              </div>
            )}
            {priceBreakdown.transportCost !== 0 && (
              <div className="flex justify-between">
                <span style={{ color: '#8A7060' }}>Transport</span>
                <span className="font-medium" style={{ color: priceBreakdown.transportCost > 0 ? '#E8643C' : '#6BAE8E' }}>{formatIndianCurrency(priceBreakdown.transportCost)}</span>
              </div>
            )}
            {priceBreakdown.activitiesTotal !== 0 && (
              <div className="flex justify-between">
                <span style={{ color: '#8A7060' }}>Activities</span>
                <span className="font-medium" style={{ color: priceBreakdown.activitiesTotal > 0 ? '#E8643C' : '#6BAE8E' }}>{formatIndianCurrency(priceBreakdown.activitiesTotal)}</span>
              </div>
            )}
            <div className="flex justify-between pt-1.5" style={{ borderTop: '1.5px solid #E8D5C4' }}>
              <span style={{ color: '#8A7060' }}>Subtotal</span>
              <span className="font-medium" style={{ color: '#3D2C2C' }}>{formatIndianCurrency(priceBreakdown.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#8A7060' }}>GST ({priceBreakdown.gstPercent}%)</span>
              <span className="font-medium" style={{ color: '#3D2C2C' }}>{formatIndianCurrency(priceBreakdown.gstAmount)}</span>
            </div>
          </div>
          <p className="text-xs px-2 py-1 mt-3 rounded-lg" style={{ color: '#A06020', backgroundColor: '#FEF3E8' }}>
            ⚠ These are indicative prices. Final amount confirmed after enquiry review.
          </p>
        </div>
      )}

      {/* Main bar */}
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-xl font-bold" style={{ color: '#5B7FA6' }}>{formatIndianCurrency(priceBreakdown.totalAmount)}</span>
            <span className="text-xs" style={{ color: '#B5A090' }}>({formatIndianCurrency(priceBreakdown.pricePerPerson)}/person)</span>
          </div>
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="flex items-center gap-1 text-xs mt-0.5 transition-colors"
            style={{ color: '#E8643C' }}
          >
            {showBreakdown ? 'Hide' : 'View'} breakdown
            {showBreakdown ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
          </button>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {currentStep > 1 && (
            <button
              onClick={onPrev}
              className="px-4 py-2 text-sm font-medium rounded-full transition-colors"
              style={{ border: '1.5px solid #E8D5C4', color: '#8A7060' }}
            >
              Back
            </button>
          )}
          {isLastStep ? (
            <button onClick={onSubmit} className="stamp-btn-sage flex items-center gap-2 px-5 py-2 text-sm">
              Submit Enquiry <ArrowRight size={14} />
            </button>
          ) : (
            <button onClick={onNext} className="stamp-btn flex items-center gap-2 px-5 py-2 text-sm">
              Next <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
