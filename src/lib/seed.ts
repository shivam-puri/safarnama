import { destinations, itineraries, activities, hotelCategories, roomConfigs, transportOptions, reviews } from '../data/mock';
import { STORAGE_KEYS, initializeIfEmpty } from './storage';
import type { StoredReview, CmsContentItem, SiteSetting } from './data-store';
import type { Lead } from '../types/lead.types';

const mockLeads: Lead[] = [
  {
    id: 'lead1',
    leadNumber: 'TRP-2026-00001',
    customer: { name: 'Rahul Sharma', email: 'rahul@example.com', phone: '+91 98765 43210', city: 'Delhi' },
    itineraryId: 'itn1',
    itinerarySnapshot: { title: 'Budget Kashmir 4D/3N', duration: { days: 4, nights: 3 }, destinationName: 'Kashmir' },
    customization: {
      travelerCount: 4,
      travelMonth: 'October 2026',
      hotelCategoryName: '3 Star Hotel',
      roomSharingType: 'double',
      numberOfRooms: 2,
      transportOptionName: 'Innova Crysta',
      selectedActivities: [{ activityName: 'Shikara Ride', price: 500 }, { activityName: 'Gulmarg Gondola', price: 1200 }],
      removedActivities: [],
    },
    priceBreakdown: {
      basePrice: 51996,
      hotelUpgrade: 7200,
      roomSharingAdjustment: 0,
      transportCost: 10500,
      activitiesTotal: 6800,
      subtotal: 76496,
      gstPercent: 5,
      gstAmount: 3825,
      totalAmount: 80321,
      pricePerPerson: 20080,
      isFinalPrice: false,
    },
    status: 'new',
    notes: [],
    createdAt: '2026-06-10T10:30:00Z',
  },
  {
    id: 'lead2',
    leadNumber: 'TRP-2026-00002',
    customer: { name: 'Priya Mehta', email: 'priya@example.com', phone: '+91 87654 32109', city: 'Mumbai' },
    itineraryId: 'itn7',
    itinerarySnapshot: { title: 'Classic Kerala 5D/4N', duration: { days: 5, nights: 4 }, destinationName: 'Kerala' },
    customization: {
      travelerCount: 2,
      travelMonth: 'November 2026',
      hotelCategoryName: 'Moderate (2 Star)',
      roomSharingType: 'double',
      numberOfRooms: 1,
      transportOptionName: 'Sedan',
      selectedActivities: [{ activityName: 'Alleppey Houseboat Stay', price: 8000 }],
      removedActivities: [],
    },
    priceBreakdown: {
      basePrice: 22998,
      hotelUpgrade: 0,
      roomSharingAdjustment: 0,
      transportCost: 12500,
      activitiesTotal: 8000,
      subtotal: 43498,
      gstPercent: 5,
      gstAmount: 2175,
      totalAmount: 45673,
      pricePerPerson: 22836,
      isFinalPrice: false,
    },
    status: 'contacted',
    notes: [{ text: 'Customer called back, interested in upgrading hotel', addedAt: '2026-06-11T14:00:00Z' }],
    createdAt: '2026-06-08T09:15:00Z',
  },
  {
    id: 'lead3',
    leadNumber: 'TRP-2026-00003',
    customer: { name: 'Vikram Singh', email: 'vikram@example.com', phone: '+91 76543 21098', city: 'Bangalore' },
    itineraryId: 'itn5',
    itinerarySnapshot: { title: 'Adventure Manali 5D/4N', duration: { days: 5, nights: 4 }, destinationName: 'Manali' },
    customization: {
      travelerCount: 6,
      travelMonth: 'September 2026',
      hotelCategoryName: '3 Star Hotel',
      roomSharingType: 'triple',
      numberOfRooms: 2,
      transportOptionName: 'Tempo Traveller',
      selectedActivities: [{ activityName: 'Paragliding', price: 2500 }, { activityName: 'River Rafting', price: 900 }],
      removedActivities: [],
    },
    priceBreakdown: {
      basePrice: 101994,
      hotelUpgrade: 14400,
      roomSharingAdjustment: -3060,
      transportCost: 27500,
      activitiesTotal: 20400,
      subtotal: 161234,
      gstPercent: 5,
      gstAmount: 8062,
      totalAmount: 169296,
      pricePerPerson: 28216,
      isFinalPrice: false,
    },
    status: 'qualified',
    notes: [{ text: 'Group of college friends, budget is flexible', addedAt: '2026-06-09T11:00:00Z' }],
    createdAt: '2026-06-07T16:45:00Z',
  },
  {
    id: 'lead4',
    leadNumber: 'TRP-2026-00004',
    customer: { name: 'Anjali Patel', email: 'anjali@example.com', phone: '+91 65432 10987', city: 'Ahmedabad' },
    itineraryId: 'itn8',
    itinerarySnapshot: { title: 'Kerala Honeymoon 6D/5N', duration: { days: 6, nights: 5 }, destinationName: 'Kerala' },
    customization: {
      travelerCount: 2,
      travelMonth: 'December 2026',
      hotelCategoryName: '5 Star Hotel',
      roomSharingType: 'single',
      numberOfRooms: 1,
      transportOptionName: 'Sedan',
      selectedActivities: [{ activityName: 'Alleppey Houseboat Stay', price: 8000 }, { activityName: 'Kathakali Show', price: 600 }],
      removedActivities: [],
    },
    priceBreakdown: {
      basePrice: 49998,
      hotelUpgrade: 31000,
      roomSharingAdjustment: 6400,
      transportCost: 12500,
      activitiesTotal: 17200,
      subtotal: 117098,
      gstPercent: 5,
      gstAmount: 5855,
      totalAmount: 122953,
      pricePerPerson: 61476,
      isFinalPrice: false,
    },
    status: 'converted',
    notes: [
      { text: 'Confirmed honeymoon package. Advance paid.', addedAt: '2026-06-05T10:30:00Z' },
    ],
    createdAt: '2026-06-01T12:00:00Z',
  },
  {
    id: 'lead5',
    leadNumber: 'TRP-2026-00005',
    customer: { name: 'Suresh Kumar', email: 'suresh@example.com', phone: '+91 54321 09876', city: 'Chennai' },
    itineraryId: 'itn2',
    itinerarySnapshot: { title: 'Family Kashmir 5D/4N', duration: { days: 5, nights: 4 }, destinationName: 'Kashmir' },
    customization: {
      travelerCount: 5,
      travelMonth: 'July 2026',
      hotelCategoryName: '3 Star Hotel',
      roomSharingType: 'double',
      numberOfRooms: 3,
      transportOptionName: 'Innova Crysta',
      selectedActivities: [{ activityName: 'Shikara Ride', price: 500 }, { activityName: 'Mughal Garden Visit', price: 1500 }],
      removedActivities: [],
    },
    priceBreakdown: {
      basePrice: 94995,
      hotelUpgrade: 10500,
      roomSharingAdjustment: 0,
      transportCost: 17500,
      activitiesTotal: 4000,
      subtotal: 126995,
      gstPercent: 5,
      gstAmount: 6350,
      totalAmount: 133345,
      pricePerPerson: 26669,
      isFinalPrice: false,
    },
    status: 'new',
    notes: [],
    createdAt: '2026-06-14T08:20:00Z',
  },
];

const storedReviews: StoredReview[] = reviews.map(r => ({
  ...r,
  status: 'approved' as const,
  createdAt: new Date().toISOString(),
}));

// Add a couple of pending reviews
storedReviews.push(
  {
    id: 'rev7',
    itineraryId: 'itn3',
    destinationId: '1',
    reviewer: { name: 'Deepak Nair', city: 'Kochi' },
    rating: 4,
    title: 'Luxury Kashmir worth every rupee',
    body: 'The houseboat stay on Dal Lake was beyond expectations. Service was impeccable and the Wazwan dinner was a highlight. Would book again.',
    travelMonth: 'May 2026',
    status: 'pending',
    isFeatured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rev8',
    itineraryId: 'itn9',
    destinationId: '3',
    reviewer: { name: 'Meera Pillai', city: 'Trivandrum' },
    rating: 5,
    title: 'The Ayurveda retreat changed my life',
    body: 'The 7-day wellness package was transformative. The Panchakarma treatments were authentic and the resort staff were incredibly attentive. Kerala is magical.',
    travelMonth: 'June 2026',
    status: 'pending',
    isFeatured: false,
    createdAt: new Date().toISOString(),
  }
);

const defaultCmsContent: CmsContentItem[] = [
  {
    key: 'terms_and_conditions',
    title: 'Terms & Conditions',
    content: `<h2>Terms and Conditions</h2>
<p>Welcome to Window Seat. By booking with us, you agree to the following terms and conditions.</p>

<h3>1. Booking Policy</h3>
<p>All bookings are subject to availability. A minimum deposit of 25% is required to confirm any booking.</p>

<h3>2. Payment Policy</h3>
<p>Full payment must be received at least 30 days before departure. For bookings made within 30 days of departure, full payment is required immediately.</p>

<h3>3. Price Policy</h3>
<p>All prices shown are indicative and subject to confirmation. Final prices will be communicated upon booking confirmation.</p>

<h3>4. Liability</h3>
<p>Window Seat acts as an agent for transportation and hotel companies. We are not responsible for any injury, damage, loss, or delay caused by the negligence of service providers.</p>`,
    updatedAt: new Date().toISOString(),
  },
  {
    key: 'cancellation_policy',
    title: 'Cancellation Policy',
    content: `<h2>Cancellation Policy</h2>
<p>We understand that plans can change. Here is our cancellation policy:</p>

<h3>Cancellation Charges</h3>
<ul>
  <li>30+ days before departure: 10% of total package cost</li>
  <li>15-29 days before departure: 25% of total package cost</li>
  <li>7-14 days before departure: 50% of total package cost</li>
  <li>Less than 7 days: No refund</li>
</ul>

<h3>Refund Process</h3>
<p>Refunds are processed within 7-10 working days after receiving written cancellation notice.</p>`,
    updatedAt: new Date().toISOString(),
  },
  {
    key: 'privacy_policy',
    title: 'Privacy Policy',
    content: `<h2>Privacy Policy</h2>
<p>At Window Seat, we are committed to protecting your personal information.</p>

<h3>Information We Collect</h3>
<p>We collect information you provide directly to us, such as your name, email, phone number, and travel preferences.</p>

<h3>How We Use Your Information</h3>
<p>We use your information to process bookings, send confirmations, and improve our services. We do not sell your personal information to third parties.</p>`,
    updatedAt: new Date().toISOString(),
  },
  {
    key: 'about_us',
    title: 'About Us',
    content: `<h2>About Window Seat</h2>
<p>Window Seat is a premium travel company specializing in customized itineraries across India's most beautiful destinations.</p>

<p>Founded with a passion for authentic travel experiences, we believe every journey should be as unique as the traveler. Our team of experienced travel designers crafts personalized itineraries that blend adventure, culture, and comfort.</p>

<h3>Our Promise</h3>
<p>We promise transparent pricing, responsive support, and carefully curated experiences that create memories to last a lifetime.</p>`,
    updatedAt: new Date().toISOString(),
  },
  {
    key: 'contact_info',
    title: 'Contact Information',
    content: `<h2>Contact Us</h2>
<p>We'd love to hear from you. Reach out to us through any of the following channels:</p>

<p><strong>Phone:</strong> +91 98765 43210</p>
<p><strong>Email:</strong> window.seat.trails@gmail.com</p>
<p><strong>Address:</strong> 123 Travel House, Connaught Place, New Delhi - 110001</p>

<p><strong>Office Hours:</strong> Monday to Saturday, 9 AM - 7 PM IST</p>`,
    updatedAt: new Date().toISOString(),
  },
];

const defaultSettings: SiteSetting[] = [
  { key: 'company_name', label: 'Company Name', value: 'Window Seat', category: 'general' },
  { key: 'tagline', label: 'Tagline', value: 'Discover India, Your Way', category: 'general' },
  { key: 'contact_phone', label: 'Phone', value: '+91 98765 43210', category: 'contact' },
  { key: 'contact_email', label: 'Email', value: 'window.seat.trails@gmail.com', category: 'contact' },
  { key: 'contact_address', label: 'Address', value: '123 Travel House, Connaught Place, New Delhi - 110001', category: 'contact' },
  { key: 'instagram_url', label: 'Instagram URL', value: 'https://instagram.com/somiltravel', category: 'social' },
  { key: 'facebook_url', label: 'Facebook URL', value: 'https://facebook.com/somiltravel', category: 'social' },
  { key: 'twitter_url', label: 'Twitter/X URL', value: 'https://twitter.com/somiltravel', category: 'social' },
  { key: 'youtube_url', label: 'YouTube URL', value: 'https://youtube.com/somiltravel', category: 'social' },
  { key: 'gst_percent', label: 'GST Percentage', value: 5, category: 'financial' },
  { key: 'currency', label: 'Currency', value: 'INR', category: 'financial' },
];

export function seedIfEmpty(): void {
  initializeIfEmpty(STORAGE_KEYS.DESTINATIONS, destinations);
  initializeIfEmpty(STORAGE_KEYS.ITINERARIES, itineraries);
  initializeIfEmpty(STORAGE_KEYS.ACTIVITIES, activities);
  initializeIfEmpty(STORAGE_KEYS.HOTEL_CATEGORIES, hotelCategories);
  initializeIfEmpty(STORAGE_KEYS.ROOM_CONFIGS, roomConfigs);
  initializeIfEmpty(STORAGE_KEYS.TRANSPORT_OPTIONS, transportOptions);
  initializeIfEmpty(STORAGE_KEYS.LEADS, mockLeads);
  initializeIfEmpty(STORAGE_KEYS.REVIEWS, storedReviews);
  initializeIfEmpty(STORAGE_KEYS.CMS_CONTENT, defaultCmsContent);
  initializeIfEmpty(STORAGE_KEYS.SITE_SETTINGS, defaultSettings);
}
