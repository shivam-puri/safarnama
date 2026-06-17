import { useCustomizerStore } from '../../../store/customizerStore';
import { Minus, Plus } from 'lucide-react';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function TravelDetailsStep() {
  const { pricingData, travelerCount, travelMonth, setTravelerCount, setTravelMonth } = useCustomizerStore();
  const itinerary = pricingData?.itinerary;

  if (!itinerary) return null;

  const minTravelers = itinerary.minTravelers ?? 1;
  const maxTravelers = itinerary.maxTravelers ?? 20;

  return (
    <div className="space-y-8">
      {/* Traveler Count */}
      <div>
        <h3 className="text-base font-semibold mb-4" style={{ color: '#3D2C2C' }}>Number of Travellers</h3>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setTravelerCount(Math.max(minTravelers, travelerCount - 1))}
            disabled={travelerCount <= minTravelers}
            className="w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            style={{ border: '1.5px solid #E8D5C4', color: '#8A7060' }}
          >
            <Minus size={16} />
          </button>
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: '#5B7FA6', fontFamily: 'Caveat, cursive' }}>{travelerCount}</p>
            <p className="text-xs" style={{ color: '#B5A090' }}>travellers</p>
          </div>
          <button
            onClick={() => setTravelerCount(Math.min(maxTravelers, travelerCount + 1))}
            disabled={travelerCount >= maxTravelers}
            className="w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            style={{ border: '1.5px solid #E8D5C4', color: '#8A7060' }}
          >
            <Plus size={16} />
          </button>
        </div>
        <p className="text-xs mt-2" style={{ color: '#B5A090' }}>Min: {minTravelers} · Max: {maxTravelers} travellers</p>
      </div>

      {/* Travel Month */}
      <div>
        <h3 className="text-base font-semibold mb-4" style={{ color: '#3D2C2C' }}>When are you planning to travel?</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {MONTHS.map(month => (
            <button
              key={month}
              onClick={() => setTravelMonth(month)}
              className="px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={travelMonth === month
                ? { border: '1.5px solid #5B7FA6', backgroundColor: '#5B7FA6', color: '#fff' }
                : { border: '1.5px solid #E8D5C4', color: '#8A7060', backgroundColor: 'transparent' }
              }
            >
              {month.slice(0, 3)}
            </button>
          ))}
        </div>
        {!travelMonth && (
          <p className="text-xs mt-2" style={{ color: '#A06020' }}>Please select a travel month to help us plan better.</p>
        )}
      </div>
    </div>
  );
}
