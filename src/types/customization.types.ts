export interface CustomizationState {
  itineraryId: string;
  travelerCount: number;
  travelMonth: string;
  hotelCategoryId: string;
  roomSharingType: string;
  numberOfRooms: number;
  transportOptionId: string;
  selectedActivityIds: string[];
  removedActivityIds: string[];
}

export interface PriceBreakdown {
  basePrice: number;
  hotelUpgrade: number;
  roomSharingAdjustment: number;
  transportCost: number;
  activitiesTotal: number;
  subtotal: number;
  gstPercent: number;
  gstAmount: number;
  totalAmount: number;
  pricePerPerson: number;
  isFinalPrice: boolean;
}
