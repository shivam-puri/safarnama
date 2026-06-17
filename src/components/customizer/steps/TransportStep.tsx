import { useCustomizerStore } from '../../../store/customizerStore';
import { formatIndianCurrency } from '../../../lib/pricing-engine';
import { Users, Check, Bus } from 'lucide-react';

export function TransportStep() {
  const { pricingData, transportOptionId, setTransport } = useCustomizerStore();

  if (!pricingData) return null;

  const itinerary = pricingData.itinerary;
  const config = itinerary.customizationConfig;
  const days = itinerary.duration?.days ?? 1;

  const availableTransportOptionIds: string[] = (config?.availableTransportOptionIds ?? []).map((x: any) => x?._id ?? x);
  const defaultTransportOptionId: string = config?.defaultTransportOptionId?._id ?? config?.defaultTransportOptionId ?? '';

  const availableOptions = pricingData.transportOptions.filter((t: any) =>
    availableTransportOptionIds.includes(t._id ?? t.id)
  );
  const defaultOption = pricingData.transportOptions.find((t: any) =>
    (t._id ?? t.id) === defaultTransportOptionId
  );

  const calcCost = (transport: any) => {
    switch (transport.priceType) {
      case 'per_day_flat': return transport.basePrice * days;
      case 'per_trip_flat': return transport.basePrice;
      default: return transport.basePrice * days;
    }
  };

  const defaultCost = defaultOption ? calcCost(defaultOption) : 0;

  return (
    <div>
      <h3 className="text-base font-semibold mb-1" style={{ color: '#3D2C2C' }}>Select Your Transport</h3>
      <p className="text-xs mb-4" style={{ color: '#B5A090' }}>For {days} days. Price shown is cost adjustment vs default ({defaultOption?.name}).</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {availableOptions.map((option: any) => {
          const optId = option._id ?? option.id;
          const cost = calcCost(option);
          const diff = cost - defaultCost;
          const isSelected = transportOptionId === optId;
          const isDefault = optId === defaultTransportOptionId;

          return (
            <button
              key={optId}
              onClick={() => setTransport(optId)}
              className="relative text-left rounded-2xl overflow-hidden transition-all"
              style={isSelected
                ? { border: '1.5px solid #5B7FA6' }
                : { border: '1.5px solid #E8D5C4' }
              }
            >
              <div className="h-36 overflow-hidden relative">
                <img src={option.image} alt={option.name} className="w-full h-full object-cover" />
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#5B7FA6' }}>
                    <Check size={14} className="text-white" />
                  </div>
                )}
                {isDefault && (
                  <div className="absolute top-3 left-3 text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: '#6BAE8E' }}>
                    Default
                  </div>
                )}
              </div>
              <div className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Bus size={14} style={{ color: isSelected ? '#5B7FA6' : '#A08070' }} />
                  <span className="font-semibold text-sm" style={{ color: '#3D2C2C' }}>{option.name}</span>
                </div>
                <p className="text-xs mb-2" style={{ color: '#8A7060' }}>{option.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs" style={{ color: '#8A7060' }}>
                    <Users size={11} /> Up to {option.capacity} pax
                  </div>
                  <div className="text-xs font-medium">
                    {diff === 0 ? (
                      <span style={{ color: '#6BAE8E' }}>Included</span>
                    ) : diff > 0 ? (
                      <span style={{ color: '#E8643C' }}>+{formatIndianCurrency(diff)}</span>
                    ) : (
                      <span style={{ color: '#6BAE8E' }}>-{formatIndianCurrency(Math.abs(diff))}</span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
