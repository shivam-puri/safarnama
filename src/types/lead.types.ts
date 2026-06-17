export interface Lead {
  id: string;
  leadNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    city: string;
    message?: string;
  };
  itineraryId: string;
  itinerarySnapshot: {
    title: string;
    duration: { days: number; nights: number };
    destinationName: string;
  };
  customization: {
    travelerCount: number;
    travelMonth: string;
    hotelCategoryName: string;
    roomSharingType: string;
    numberOfRooms: number;
    transportOptionName: string;
    selectedActivities?: Array<{ activityName: string; price: number }>;
    removedActivities?: string[];
  };
  priceBreakdown: {
    basePrice?: number;
    hotelUpgrade?: number;
    roomSharingAdjustment?: number;
    transportCost?: number;
    activitiesTotal?: number;
    subtotal?: number;
    gstPercent?: number;
    gstAmount?: number;
    totalAmount: number;
    pricePerPerson: number;
    isFinalPrice: boolean;
  };
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost' | 'spam';
  notes?: Array<{ text: string; addedAt: string }>;
  source?: string;
  createdAt: string;
  updatedAt?: string;
}
