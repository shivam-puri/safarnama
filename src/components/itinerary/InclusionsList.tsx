import { CheckCircle2, XCircle } from 'lucide-react';

interface InclusionsListProps {
  inclusions: string[];
  exclusions: string[];
}

export function InclusionsList({ inclusions, exclusions }: InclusionsListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#3D2C2C' }}>
          <CheckCircle2 size={18} style={{ color: '#6BAE8E' }} />
          What's Included
        </h4>
        <ul className="space-y-2">
          {inclusions.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm" style={{ color: '#5C4A3A' }}>
              <CheckCircle2 size={14} className="mt-0.5 shrink-0" style={{ color: '#6BAE8E' }} />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#3D2C2C' }}>
          <XCircle size={18} style={{ color: '#D45050' }} />
          Not Included
        </h4>
        <ul className="space-y-2">
          {exclusions.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm" style={{ color: '#5C4A3A' }}>
              <XCircle size={14} className="mt-0.5 shrink-0" style={{ color: '#D45050' }} />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
