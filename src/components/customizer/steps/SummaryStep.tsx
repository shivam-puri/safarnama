import { useState } from 'react';
import { useCustomizerStore } from '../../../store/customizerStore';
import { formatIndianCurrency } from '../../../lib/pricing-engine';
import { AlertTriangle, User, Mail, Phone, MapPin, MessageSquare } from 'lucide-react';

interface EnquiryForm {
  name: string;
  email: string;
  phone: string;
  city: string;
  message: string;
}

interface SummaryStepProps {
  onSubmitEnquiry: (form: EnquiryForm) => void;
  submitting?: boolean;
  submitError?: string;
}

export function SummaryStep({ onSubmitEnquiry, submitting, submitError }: SummaryStepProps) {
  const store = useCustomizerStore();
  const [form, setForm] = useState<EnquiryForm>({ name: '', email: '', phone: '', city: '', message: '' });
  const [errors, setErrors] = useState<Partial<EnquiryForm>>({});

  const { pricingData, priceBreakdown: pb } = store;
  const itinerary = pricingData?.itinerary;

  const hotel = pricingData?.hotelCategories?.find((h: any) => (h._id ?? h.id) === store.hotelCategoryId);
  const transport = pricingData?.transportOptions?.find((t: any) => (t._id ?? t.id) === store.transportOptionId);

  if (!itinerary || !pb) return null;

  const validate = () => {
    const e: Partial<EnquiryForm> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone.trim() || form.phone.length < 10) e.phone = 'Valid phone required';
    if (!form.city.trim()) e.city = 'City is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmitEnquiry(form);
  };

  const selectedActivities = store.selectedActivityIds
    .map(id => (pricingData?.activities ?? []).find((a: any) => (a._id ?? a.id) === id))
    .filter(Boolean);

  const inputClass = (field: keyof EnquiryForm) =>
    `journal-input pl-9 ${errors[field] ? 'error' : ''}`;

  return (
    <div className="space-y-6">
      {/* Indicative price warning */}
      <div className="flex items-start gap-2 p-3 rounded-2xl" style={{ backgroundColor: '#FEF3E8', border: '1.5px solid #F4C4A0' }}>
        <AlertTriangle size={16} className="mt-0.5 shrink-0" style={{ color: '#A06020' }} />
        <p className="text-xs" style={{ color: '#A06020' }}>
          <strong>Indicative Price:</strong> The price shown is an estimate. Our team will confirm the final price within 24 hours after reviewing your enquiry.
        </p>
      </div>

      {/* Trip Summary */}
      <div className="journal-card p-4">
        <h3 className="font-semibold mb-3" style={{ color: '#3D2C2C' }}>Your Trip Summary</h3>
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <span style={{ color: '#8A7060' }}>Itinerary</span>
          <span className="font-medium text-right" style={{ color: '#3D2C2C' }}>{itinerary.title}</span>
          <span style={{ color: '#8A7060' }}>Duration</span>
          <span className="font-medium text-right" style={{ color: '#3D2C2C' }}>{itinerary.duration?.days}D/{itinerary.duration?.nights}N</span>
          <span style={{ color: '#8A7060' }}>Travellers</span>
          <span className="font-medium text-right" style={{ color: '#3D2C2C' }}>{store.travelerCount}</span>
          <span style={{ color: '#8A7060' }}>Travel Month</span>
          <span className="font-medium text-right" style={{ color: '#3D2C2C' }}>{store.travelMonth || 'Not specified'}</span>
          <span style={{ color: '#8A7060' }}>Hotel</span>
          <span className="font-medium text-right" style={{ color: '#3D2C2C' }}>{hotel?.displayLabel}</span>
          <span style={{ color: '#8A7060' }}>Room Type</span>
          <span className="font-medium text-right capitalize" style={{ color: '#3D2C2C' }}>{store.roomSharingType} ({store.numberOfRooms} room{store.numberOfRooms > 1 ? 's' : ''})</span>
          <span style={{ color: '#8A7060' }}>Transport</span>
          <span className="font-medium text-right" style={{ color: '#3D2C2C' }}>{transport?.name}</span>
        </div>
        {selectedActivities.length > 0 && (
          <div className="mt-3 pt-3" style={{ borderTop: '1.5px solid #E8D5C4' }}>
            <p className="text-xs mb-1" style={{ color: '#A08070' }}>Selected Activities</p>
            <p className="text-sm font-medium" style={{ color: '#3D2C2C' }}>{selectedActivities.map((a: any) => a.name).join(', ')}</p>
          </div>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="rounded-2xl p-4" style={{ backgroundColor: '#D6E4F0' + '30', border: '1.5px solid #B8D0E8' }}>
        <h3 className="font-semibold mb-3" style={{ color: '#3D2C2C' }}>Price Breakdown</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span style={{ color: '#8A7060' }}>Base Price</span><span style={{ color: '#3D2C2C' }}>{formatIndianCurrency(pb.basePrice)}</span></div>
          {pb.hotelUpgrade !== 0 && <div className="flex justify-between"><span style={{ color: '#8A7060' }}>Hotel Adjustment</span><span style={{ color: pb.hotelUpgrade > 0 ? '#E8643C' : '#6BAE8E' }}>{formatIndianCurrency(pb.hotelUpgrade)}</span></div>}
          {pb.roomSharingAdjustment !== 0 && <div className="flex justify-between"><span style={{ color: '#8A7060' }}>Room Sharing</span><span style={{ color: pb.roomSharingAdjustment > 0 ? '#E8643C' : '#6BAE8E' }}>{formatIndianCurrency(pb.roomSharingAdjustment)}</span></div>}
          {pb.transportCost !== 0 && <div className="flex justify-between"><span style={{ color: '#8A7060' }}>Transport Adjustment</span><span style={{ color: pb.transportCost > 0 ? '#E8643C' : '#6BAE8E' }}>{formatIndianCurrency(pb.transportCost)}</span></div>}
          {pb.activitiesTotal !== 0 && <div className="flex justify-between"><span style={{ color: '#8A7060' }}>Activities</span><span style={{ color: pb.activitiesTotal > 0 ? '#E8643C' : '#6BAE8E' }}>{formatIndianCurrency(pb.activitiesTotal)}</span></div>}
          <div className="flex justify-between pt-2" style={{ borderTop: '1.5px solid #E8D5C4' }}><span style={{ color: '#8A7060' }}>Subtotal</span><span style={{ color: '#3D2C2C' }}>{formatIndianCurrency(pb.subtotal)}</span></div>
          <div className="flex justify-between"><span style={{ color: '#8A7060' }}>GST ({pb.gstPercent}%)</span><span style={{ color: '#3D2C2C' }}>{formatIndianCurrency(pb.gstAmount)}</span></div>
          <div className="flex justify-between font-bold text-base pt-2" style={{ borderTop: '1.5px solid #E8D5C4' }}>
            <span style={{ color: '#3D2C2C' }}>Total Amount</span>
            <span style={{ color: '#5B7FA6' }}>{formatIndianCurrency(pb.totalAmount)}</span>
          </div>
          <div className="flex justify-between text-xs" style={{ color: '#8A7060' }}><span>Per Person</span><span>{formatIndianCurrency(pb.pricePerPerson)}</span></div>
        </div>
      </div>

      {/* Submit error */}
      {submitError && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-xs text-red-700">{submitError}</p>
        </div>
      )}

      {/* Enquiry Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="font-semibold" style={{ color: '#3D2C2C' }}>Your Contact Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#5C4A3A' }}>Full Name *</label>
            <div className="relative">
              <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#B5A090' }} />
              <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Priya Sharma" className={inputClass('name')} />
            </div>
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#5C4A3A' }}>Email Address *</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#B5A090' }} />
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="priya@example.com" className={inputClass('email')} />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#5C4A3A' }}>Phone Number *</label>
            <div className="relative">
              <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#B5A090' }} />
              <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 98765 43210" className={inputClass('phone')} />
            </div>
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#5C4A3A' }}>Your City *</label>
            <div className="relative">
              <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#B5A090' }} />
              <input type="text" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="Mumbai" className={inputClass('city')} />
            </div>
            {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: '#5C4A3A' }}>Message (Optional)</label>
          <div className="relative">
            <MessageSquare size={14} className="absolute left-3 top-3" style={{ color: '#B5A090' }} />
            <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Any specific requirements or questions..." rows={3} className="journal-input pl-9 resize-none" />
          </div>
        </div>
        <button type="submit" disabled={submitting} className="stamp-btn w-full py-3 text-base">
          {submitting ? 'Submitting...' : 'Submit Enquiry'}
        </button>
      </form>
    </div>
  );
}
