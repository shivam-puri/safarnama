export function TermsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFBF5' }}>
      <div className="text-white py-14 px-4" style={{ backgroundColor: '#3D2C2C' }}>
        <div className="max-w-4xl mx-auto">
          <p className="journal-label mb-2" style={{ color: '#F4A261' }}>Legal</p>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Caveat, cursive' }}>Terms & Conditions</h1>
          <p className="mt-2 text-sm" style={{ color: '#C4A898' }}>Last updated: June 2026</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        {[
          { title: '1. Acceptance of Terms', body: "By accessing or using Window Seat's website and services, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services." },
          { title: '2. Booking and Payment', body: 'All prices displayed on our website are indicative and subject to confirmation by our team. A booking is only confirmed upon receipt of a deposit and written confirmation from Window Seat. The deposit amount (typically 25% of total cost) is non-refundable unless the booking is cancelled by us.' },
          { title: '3. Price Accuracy', body: 'While we strive to maintain accurate prices, all prices shown are indicative and may vary based on availability, seasonality, and other factors. The confirmed price will be communicated after your enquiry is reviewed by our team. Prices include GST at 5%.' },
          { title: '4. Modifications to Itinerary', body: 'We reserve the right to modify itineraries due to unforeseen circumstances including but not limited to weather conditions, political situations, road closures, or force majeure events. Alternative arrangements of comparable value will be provided.' },
          { title: '5. Traveller Responsibility', body: 'Travellers are responsible for obtaining valid travel documents, visas (if applicable), and travel insurance. Window Seat shall not be liable for any loss, damage, or inconvenience arising from failure to obtain proper documentation.' },
          { title: '6. Limitation of Liability', body: 'Window Seat acts as an agent for hotels, transport providers, and activity operators. We are not liable for any injury, loss, or damage resulting from the services of third-party providers. Our maximum liability in any event shall not exceed the amount paid for the specific package.' },
          { title: '7. Privacy Policy', body: 'Your personal information is collected solely for the purpose of processing your travel enquiry and booking. We do not share your information with third parties except as required to fulfill your booking.' },
          { title: '8. Contact', body: null },
        ].map((section, idx) => (
          <div key={idx} className="journal-card p-5">
            <h2 className="font-bold mb-2" style={{ color: '#3D2C2C', fontFamily: 'Caveat, cursive', fontSize: '1.2rem' }}>{section.title}</h2>
            {section.body ? (
              <p className="leading-relaxed text-sm" style={{ color: '#5C4A3A' }}>{section.body}</p>
            ) : (
              <p className="leading-relaxed text-sm" style={{ color: '#5C4A3A' }}>
                For any questions regarding these terms, please contact us at{' '}
                <a href="mailto:window.seat.trails@gmail.com" className="hover:underline" style={{ color: '#5B7FA6' }}>window.seat.trails@gmail.com.</a>.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
