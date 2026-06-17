import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFBF5' }}>
      <div className="text-white py-14 px-4" style={{ backgroundColor: '#3D2C2C' }}>
        <div className="max-w-7xl mx-auto">
          <p className="journal-label mb-2" style={{ color: '#F4A261' }}>Reach out</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'Caveat, cursive' }}>Contact Us</h1>
          <p style={{ color: '#C4A898' }}>Have a question? We'd love to hear from you.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Form */}
          <div className="journal-card p-6">
            <h2 className="text-xl font-bold mb-5" style={{ color: '#3D2C2C', fontFamily: 'Caveat, cursive', fontSize: '1.5rem' }}>Send Us a Message</h2>
            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle2 size={48} className="mx-auto mb-4" style={{ color: '#6BAE8E' }} />
                <h3 className="font-bold mb-2" style={{ color: '#3D2C2C' }}>Message Sent!</h3>
                <p className="text-sm" style={{ color: '#8A7060' }}>We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: '#5C4A3A' }}>Name *</label>
                    <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="journal-input" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: '#5C4A3A' }}>Email *</label>
                    <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="journal-input" placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#5C4A3A' }}>Phone</label>
                  <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="journal-input" placeholder="+91 98765 43210" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#5C4A3A' }}>Message *</label>
                  <textarea required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={4} className="journal-input resize-none" placeholder="How can we help you?" />
                </div>
                <button type="submit" className="stamp-btn flex items-center justify-center gap-2 w-full py-3">
                  <Send size={16} /> Send Message
                </button>
              </form>
            )}
          </div>

          {/* Contact info */}
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold mb-4" style={{ color: '#3D2C2C', fontFamily: 'Caveat, cursive', fontSize: '1.5rem' }}>Get in Touch</h2>
              <p className="text-sm leading-relaxed" style={{ color: '#8A7060' }}>Our team is available Monday to Saturday, 9am to 7pm IST. We typically respond to enquiries within 24 hours.</p>
            </div>
            {[
              { icon: <Phone size={18} style={{ color: '#E8643C' }} />, label: 'Call Us', value: '+91 98765 43210', href: 'tel:+919876543210' },
              { icon: <Mail size={18} style={{ color: '#E8643C' }} />, label: 'Email Us', value: 'hello@safarnama.com', href: 'mailto:hello@safarnama.com' },
              { icon: <MapPin size={18} style={{ color: '#E8643C' }} />, label: 'Visit Us', value: '123 Travel House, Connaught Place, New Delhi, 110001', href: null },
              { icon: <Clock size={18} style={{ color: '#E8643C' }} />, label: 'Working Hours', value: 'Mon–Sat: 9:00 AM – 7:00 PM IST', href: null },
            ].map((item, idx) => (
              <div key={idx} className="journal-card flex items-start gap-3 p-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#FDEAE3', border: '1.5px solid #F4C4B0' }}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: '#8A7060' }}>{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-sm font-medium transition-colors hover:text-[#E8643C]" style={{ color: '#3D2C2C' }}>{item.value}</a>
                  ) : (
                    <p className="text-sm" style={{ color: '#3D2C2C' }}>{item.value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Maps placeholder */}
            <div className="rounded-2xl h-48 flex items-center justify-center" style={{ backgroundColor: '#F0E4D7', border: '1.5px solid #E8D5C4' }}>
              <div className="text-center" style={{ color: '#B5A090' }}>
                <MapPin size={32} className="mx-auto mb-2" />
                <p className="text-sm">Google Maps Placeholder</p>
                <p className="text-xs">Connaught Place, New Delhi</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
