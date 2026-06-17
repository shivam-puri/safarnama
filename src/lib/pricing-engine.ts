import type { CustomizationState, PriceBreakdown } from '../types/customization.types';
import type { Itinerary, HotelCategory, RoomConfig, TransportOption, Activity } from '../types/itinerary.types';

export interface PricingData {
  itinerary: Itinerary;
  hotelCategories: HotelCategory[];
  roomConfigs: RoomConfig[];
  transportOptions: TransportOption[];
  activities: Activity[];
}

function getHotelTier(category: HotelCategory, travelerCount: number) {
  const tier = category.pricingTiers.find(
    t => travelerCount >= t.minTravelers && travelerCount <= t.maxTravelers
  );
  return tier || category.pricingTiers[category.pricingTiers.length - 1];
}

export function calculatePrice(state: CustomizationState, data: PricingData): PriceBreakdown {
  const { itinerary, hotelCategories, roomConfigs, transportOptions, activities } = data;
  const nights = itinerary.duration.nights;
  const days = itinerary.duration.days;
  const travelerCount = state.travelerCount;

  // Step 1: Base price
  const basePrice = itinerary.basePricePerPerson * travelerCount;

  // Step 2: Hotel adjustment
  const selectedHotel = hotelCategories.find(h => h.id === state.hotelCategoryId);
  const defaultHotel = hotelCategories.find(h => h.id === itinerary.customizationConfig.defaultHotelCategoryId);

  let hotelUpgrade = 0;
  if (selectedHotel && defaultHotel) {
    const selectedTier = getHotelTier(selectedHotel, travelerCount);
    const defaultTier = getHotelTier(defaultHotel, travelerCount);
    hotelUpgrade = (selectedTier.pricePerPersonPerNight - defaultTier.pricePerPersonPerNight) * nights * travelerCount;
  }

  // Step 3: Room sharing adjustment
  const selectedRoomConfig = roomConfigs.find(r => r.sharingType === state.roomSharingType);
  const defaultRoomConfig = roomConfigs.find(r => r.sharingType === itinerary.customizationConfig.defaultRoomSharingType);

  let roomSharingAdjustment = 0;
  if (selectedRoomConfig && defaultRoomConfig && selectedHotel) {
    const selectedTier = getHotelTier(selectedHotel, travelerCount);
    const hotelBaseRatePerNight = selectedTier.pricePerPersonPerNight;
    roomSharingAdjustment = (selectedRoomConfig.multiplier - defaultRoomConfig.multiplier) * hotelBaseRatePerNight * nights * state.numberOfRooms;
  }

  // Step 4: Transport cost
  const selectedTransport = transportOptions.find(t => t.id === state.transportOptionId);
  const defaultTransport = transportOptions.find(t => t.id === itinerary.customizationConfig.defaultTransportOptionId);

  let transportCost = 0;
  const calcTransportCost = (transport: TransportOption): number => {
    switch (transport.priceType) {
      case 'per_person_per_day': return transport.basePrice * travelerCount * days;
      case 'per_day_flat': return transport.basePrice * days;
      case 'per_trip_flat': return transport.basePrice;
      default: return 0;
    }
  };

  if (selectedTransport) {
    const selectedCost = calcTransportCost(selectedTransport);
    const defaultCost = defaultTransport ? calcTransportCost(defaultTransport) : 0;
    transportCost = selectedCost - defaultCost;
  }

  // Step 5: Activity adjustments
  let activitiesTotal = 0;

  // Add optional activities that are now selected (not in original included set)
  const itineraryActivityIds = itinerary.days.flatMap(d =>
    d.activities.filter(a => a.isIncluded).map(a => a.activityId)
  );

  for (const activityId of state.selectedActivityIds) {
    if (!itineraryActivityIds.includes(activityId)) {
      const activity = activities.find(a => a.id === activityId);
      if (activity) {
        activitiesTotal += activity.priceType === 'per_person'
          ? activity.basePrice * travelerCount
          : activity.basePrice;
      }
    }
  }

  // Subtract activities that were included but removed
  for (const activityId of state.removedActivityIds) {
    const activityRef = itinerary.days.flatMap(d => d.activities).find(a => a.activityId === activityId);
    if (activityRef && activityRef.isIncluded && !activityRef.isMandatory) {
      const activity = activities.find(a => a.id === activityId);
      if (activity) {
        activitiesTotal -= activity.priceType === 'per_person'
          ? activity.basePrice * travelerCount
          : activity.basePrice;
      }
    }
  }

  // Step 6: GST at 5%
  const subtotal = basePrice + hotelUpgrade + roomSharingAdjustment + transportCost + activitiesTotal;
  const gstPercent = 5;
  const gstAmount = Math.round(subtotal * gstPercent / 100);

  // Step 7: Total
  const totalAmount = subtotal + gstAmount;
  const pricePerPerson = Math.round(totalAmount / travelerCount);

  return {
    basePrice,
    hotelUpgrade,
    roomSharingAdjustment,
    transportCost,
    activitiesTotal,
    subtotal,
    gstPercent,
    gstAmount,
    totalAmount,
    pricePerPerson,
    isFinalPrice: false,
  };
}

export function formatIndianCurrency(amount: number): string {
  const absAmount = Math.abs(amount);
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(absAmount);
  return amount < 0 ? `-${formatted}` : formatted;
}
