import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Download, Clock, Calendar } from 'lucide-react';
import { DoodleDotPath, DoodleStar } from '../components/common/Doodles';

export function ConfirmationPage() {
  const { leadNumber } = useParams<{ leadNumber: string }>();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ backgroundColor: '#FFFBF5' }}>
      <div className="max-w-lg w-full">
        {/* Success icon */}
        <div className="text-center mb-6">
          <div className="relative inline-block mb-4">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#E4F4EC', border: '1.5px solid #B8DFC8' }}>
              <CheckCircle2 size={40} style={{ color: '#6BAE8E' }} />
            </div>
            <DoodleStar size={20} color="#F4A261" className="absolute -top-2 -right-2" opacity={0.9} />
            <DoodleStar size={14} color="#E8643C" className="absolute -bottom-1 -left-3" opacity={0.7} />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#3D2C2C', fontFamily: 'Caveat, cursive', fontSize: '2rem' }}>Enquiry Submitted!</h1>
          <p className="leading-relaxed" style={{ color: '#8A7060' }}>Your travel enquiry has been received. Our team will review and confirm your trip within 24 hours.</p>
        </div>

        {/* Dot path doodle */}
        <div className="flex justify-center mb-4">
          <DoodleDotPath width={240} color="#C4A898" opacity={0.6} />
        </div>

        {/* Lead number */}
        <div className="rounded-2xl p-5 text-center mb-5" style={{ backgroundColor: '#3D2C2C' }}>
          <p className="text-sm mb-1" style={{ color: '#C4A898' }}>Your Enquiry Reference</p>
          <p className="text-3xl font-bold tracking-widest text-white" style={{ fontFamily: 'Caveat, cursive', fontSize: '2.2rem' }}>{leadNumber || 'TRP-2026-00001'}</p>
          <p className="text-xs mt-2" style={{ color: '#C4A898' }}>Save this number for reference</p>
        </div>

        {/* What happens next */}
        <div className="rounded-2xl p-4 mb-5" style={{ backgroundColor: '#D6E4F0', border: '1.5px solid #B8D0E8' }}>
          <h3 className="font-semibold mb-2 flex items-center gap-2" style={{ color: '#3D6089' }}>
            <Clock size={16} /> What happens next?
          </h3>
          <ul className="space-y-1.5 text-sm" style={{ color: '#3D6089' }}>
            <li>1. Our travel expert reviews your customization</li>
            <li>2. We confirm availability for your travel month</li>
            <li>3. You receive a confirmed price quote via email</li>
            <li>4. Book and confirm with a deposit</li>
          </ul>
          <div className="mt-3 flex items-center gap-2 text-xs" style={{ color: '#5B7FA6' }}>
            <Calendar size={12} /> <strong>Expected response: within 24 hours</strong>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/destinations" className="stamp-btn flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm">
            Explore More Trips <ArrowRight size={14} />
          </Link>
          <button
            disabled
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 font-semibold rounded-full text-sm cursor-not-allowed"
            style={{ border: '1.5px solid #E8D5C4', color: '#B5A090' }}
            title="Coming soon"
          >
            <Download size={14} /> Download Summary
          </button>
        </div>
      </div>
    </div>
  );
}
