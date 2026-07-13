export interface ActivityRef {
  // The API returns activityId populated with the full Activity object; it may
  // also be a plain id string when unpopulated (e.g. freshly built in the admin form).
  activityId: string | Activity;
  isMandatory: boolean;
  isIncluded: boolean;
  customPrice?: number;
}

export interface Day {
  dayNumber: number;
  title: string;
  description: string;
  activities: ActivityRef[];
}

export interface CustomizationConfig {
  isCustomizable: boolean;
  allowHotelChange: boolean;
  allowTransportChange: boolean;
  allowActivityChange: boolean;
  allowRoomSharingChange: boolean;
  allowTravelerCountChange: boolean;
  defaultHotelCategoryId: string;
  defaultTransportOptionId: string;
  defaultRoomSharingType: string;
  availableHotelCategoryIds: string[];
  availableTransportOptionIds: string[];
}

export interface Itinerary {
  id: string;
  destinationId: string;
  destinationSlug: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  duration: { days: number; nights: number };
  images: Array<{ url: string; alt: string; isPrimary?: boolean }>;
  category: 'budget' | 'family' | 'luxury' | 'adventure' | 'honeymoon' | 'school_trip' | 'corporate' | 'senior_citizen' | 'solo';
  minTravelers: number;
  maxTravelers: number;
  basePricePerPerson: number;
  days: Day[];
  customizationConfig: CustomizationConfig;
  inclusions: string[];
  exclusions: string[];
  highlights: string[];
  isActive: boolean;
  isFeatured: boolean;
  featuredOnHomepage?: boolean;
}

export interface HotelCategory {
  id: string;
  name: string;
  displayLabel: string;
  description: string;
  sortOrder: number;
  pricingTiers: Array<{
    minTravelers: number;
    maxTravelers: number;
    pricePerPersonPerNight: number;
  }>;
  isActive: boolean;
}

export interface RoomConfig {
  id: string;
  sharingType: 'single' | 'double' | 'triple';
  label: string;
  multiplier: number;
  description: string;
  isActive: boolean;
}

export interface TransportOption {
  id: string;
  name: string;
  description: string;
  capacity: number;
  priceType: 'per_trip_flat' | 'per_person_per_day' | 'per_day_flat';
  basePrice: number;
  image: string;
  isActive: boolean;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  destinationId: string;
  priceType: 'per_person' | 'per_group';
  basePrice: number;
  duration: string;
  tags: string[];
  image?: string;
  isActive: boolean;
}
