import { useCustomizerStore } from '../../../store/customizerStore';
import { formatIndianCurrency } from '../../../lib/pricing-engine';
import { Building2, Check } from 'lucide-react';

export function AccommodationStep() {
  const { pricingData, hotelCategoryId, roomSharingType, numberOfRooms, travelerCount, setHotelCategory, setRoomSharing } = useCustomizerStore();

  if (!pricingData) return null;

  const itinerary = pricingData.itinerary;
  const config = itinerary.customizationConfig;
  const nights = itinerary.duration?.nights ?? 1;

  const availableHotelCategoryIds: string[] = (config?.availableHotelCategoryIds ?? []).map((x: any) => x?._id ?? x);
  const defaultHotelCategoryId: string = config?.defaultHotelCategoryId?._id ?? config?.defaultHotelCategoryId ?? '';

  const availableCategories = pricingData.hotelCategories.filter((h: any) =>
    availableHotelCategoryIds.includes(h._id ?? h.id)
  );
  const defaultCategory = pricingData.hotelCategories.find((h: any) =>
    (h._id ?? h.id) === defaultHotelCategoryId
  );

  const getTierPrice = (category: any) => {
    const tier = (category.pricingTiers ?? []).find((t: any) => travelerCount >= t.minTravelers && travelerCount <= t.maxTravelers)
      || (category.pricingTiers ?? [])[category.pricingTiers?.length - 1];
    return tier?.pricePerPersonPerNight ?? 0;
  };

  const defaultTierPrice = defaultCategory ? getTierPrice(defaultCategory) : 0;

  return (
    <div className="space-y-8">
      {/* Hotel Category */}
      <div>
        <h3 className="text-base font-semibold mb-1" style={{ color: '#3D2C2C' }}>Hotel Category</h3>
        <p className="text-xs mb-4" style={{ color: '#B5A090' }}>Price adjustment is per person per night vs default ({defaultCategory?.name})</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {availableCategories.map((category: any) => {
            const catId = category._id ?? category.id;
            const tierPrice = getTierPrice(category);
            const diff = (tierPrice - defaultTierPrice) * nights * travelerCount;
            const isSelected = hotelCategoryId === catId;
            const isDefault = catId === defaultHotelCategoryId;

            return (
              <button
                key={catId}
                onClick={() => setHotelCategory(catId)}
                className="relative text-left p-4 rounded-2xl transition-all"
                style={isSelected
                  ? { border: '1.5px solid #5B7FA6', backgroundColor: '#D6E4F0' + '4D' }
                  : { border: '1.5px solid #E8D5C4', backgroundColor: '#FFFFFF' }
                }
              >
                {isSelected && (
                  <span className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#5B7FA6' }}>
                    <Check size={12} className="text-white" />
                  </span>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <Building2 size={16} style={{ color: isSelected ? '#5B7FA6' : '#A08070' }} />
                  <span className="font-semibold text-sm" style={{ color: '#3D2C2C' }}>{category.displayLabel}</span>
                  {isDefault && <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#E4F4EC', color: '#3D8B60' }}>Default</span>}
                </div>
                <p className="text-xs mb-2" style={{ color: '#8A7060' }}>{category.description}</p>
                <div className="text-xs font-medium">
                  {diff === 0 ? (
                    <span style={{ color: '#6BAE8E' }}>Included in base price</span>
                  ) : diff > 0 ? (
                    <span style={{ color: '#E8643C' }}>+ {formatIndianCurrency(diff)} upgrade</span>
                  ) : (
                    <span style={{ color: '#6BAE8E' }}>- {formatIndianCurrency(Math.abs(diff))} savings</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Room Sharing */}
      <div>
        <h3 className="text-base font-semibold mb-4" style={{ color: '#3D2C2C' }}>Room Sharing</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(pricingData.roomConfigs ?? []).map((cfg: any) => {
            const isSelected = roomSharingType === cfg.sharingType;
            return (
              <button
                key={cfg._id ?? cfg.id}
                onClick={() => setRoomSharing(cfg.sharingType)}
                className="p-4 rounded-2xl text-left transition-all"
                style={isSelected
                  ? { border: '1.5px solid #5B7FA6', backgroundColor: '#D6E4F0' + '4D' }
                  : { border: '1.5px solid #E8D5C4', backgroundColor: '#FFFFFF' }
                }
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm" style={{ color: '#3D2C2C' }}>{cfg.label}</span>
                  {isSelected && <Check size={14} style={{ color: '#5B7FA6' }} />}
                </div>
                <p className="text-xs" style={{ color: '#8A7060' }}>{cfg.description}</p>
                <p className="text-xs mt-1" style={{ color: '#B5A090' }}>{cfg.multiplier}x rate</p>
              </button>
            );
          })}
        </div>
        <p className="text-xs mt-3" style={{ color: '#B5A090' }}>
          Calculated rooms: <strong style={{ color: '#5C4A3A' }}>{numberOfRooms}</strong> room{numberOfRooms > 1 ? 's' : ''} for {travelerCount} traveller{travelerCount > 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}
