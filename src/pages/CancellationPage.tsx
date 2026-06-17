export function CancellationPage() {
  const policies = [
    { days: '30+ days before departure', refund: '90% refund', bg: '#E4F4EC', border: '#B8DFC8', text: '#3D8B60' },
    { days: '21–29 days before departure', refund: '75% refund', bg: '#E4F4EC', border: '#B8DFC8', text: '#3D8B60' },
    { days: '14–20 days before departure', refund: '50% refund', bg: '#FEF3E8', border: '#F4CEAD', text: '#A06020' },
    { days: '7–13 days before departure', refund: '25% refund', bg: '#FDEAE3', border: '#F4C4B0', text: '#C44D27' },
    { days: 'Less than 7 days', refund: 'No refund', bg: '#FDE8E8', border: '#F4B8B8', text: '#A03030' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFBF5' }}>
      <div className="text-white py-14 px-4" style={{ backgroundColor: '#3D2C2C' }}>
        <div className="max-w-4xl mx-auto">
          <p className="journal-label mb-2" style={{ color: '#F4A261' }}>Policy</p>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Caveat, cursive' }}>Cancellation Policy</h1>
          <p className="mt-2 text-sm" style={{ color: '#C4A898' }}>Last updated: June 2026</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="rounded-2xl p-4 mb-8" style={{ backgroundColor: '#FEF3E8', border: '1.5px solid #F4CEAD' }}>
          <p className="text-sm leading-relaxed" style={{ color: '#A06020' }}>
            <strong>Important:</strong> All cancellations must be submitted in writing to{' '}
            <a href="mailto:bookings@safarnama.com" className="underline" style={{ color: '#A06020' }}>bookings@safarnama.com</a>.
            Cancellation is effective from the date we receive written confirmation.
          </p>
        </div>

        <h2 className="font-bold mb-4" style={{ color: '#3D2C2C', fontFamily: 'Caveat, cursive', fontSize: '1.4rem' }}>Cancellation Refund Schedule</h2>
        <div className="space-y-3 mb-8">
          {policies.map((policy, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 rounded-2xl" style={{ backgroundColor: '#FFFBF5', border: '1.5px solid #E8D5C4' }}>
              <span className="text-sm font-medium" style={{ color: '#3D2C2C' }}>{policy.days}</span>
              <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: policy.bg, border: `1.5px solid ${policy.border}`, color: policy.text }}>{policy.refund}</span>
            </div>
          ))}
        </div>

        <div className="space-y-6 text-sm" style={{ color: '#5C4A3A' }}>
          <div className="journal-card p-5">
            <h3 className="font-bold mb-3" style={{ color: '#3D2C2C' }}>Special Conditions</h3>
            <ul className="space-y-2 list-disc list-inside leading-relaxed">
              <li>Deposits (25% of total) are non-refundable under all circumstances.</li>
              <li>Honeymoon and luxury packages have a separate 48-hour cancellation window after booking confirmation with full refund (excluding card processing fees).</li>
              <li>In case of natural disasters, political unrest, or pandemic-related travel restrictions, we offer full credit valid for 12 months.</li>
              <li>Airfare and train tickets are subject to the respective airline/railway cancellation policies and are not covered by this policy.</li>
              <li>No-shows (failure to appear on travel date) are treated as last-minute cancellations with no refund.</li>
              <li>Amendments to booking dates are subject to availability and may incur additional charges.</li>
            </ul>
          </div>

          <div className="journal-card p-5">
            <h3 className="font-bold mb-2" style={{ color: '#3D2C2C' }}>Cancellation by Safarnama</h3>
            <p className="leading-relaxed">In the rare event that we must cancel a confirmed booking, you will receive a full refund within 7 business days, or the option to rebook at no additional cost. We will make every effort to notify you at least 14 days in advance.</p>
          </div>

          <div className="journal-card p-5">
            <h3 className="font-bold mb-2" style={{ color: '#3D2C2C' }}>How to Cancel</h3>
            <ol className="space-y-1 list-decimal list-inside leading-relaxed">
              <li>Email your booking reference number and cancellation request to{' '}
                <a href="mailto:bookings@safarnama.com" className="hover:underline" style={{ color: '#5B7FA6' }}>bookings@safarnama.com</a>
              </li>
              <li>Our team will acknowledge your request within 4 business hours.</li>
              <li>Refund will be processed to the original payment method within 7–10 business days.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
