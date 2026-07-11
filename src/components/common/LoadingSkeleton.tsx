export function LoadingSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  );
}

export function CardSkeletonGrid({ count = 6, className = '' }: { count?: number; className?: string }) {
  return (
    <div className={className || 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 6, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <table className="w-full">
      <tbody className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, r) => (
          <tr key={r} className={r % 2 === 1 ? 'bg-slate-50' : 'bg-white'}>
            {Array.from({ length: cols }).map((_, c) => (
              <td key={c} className="px-4 py-3">
                <div
                  className="h-4 bg-slate-200 rounded animate-pulse"
                  style={{ width: c === 0 ? '85%' : `${55 + ((r + c) % 3) * 10}%` }}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 animate-pulse">
      <div className="w-10 h-10 bg-slate-200 rounded-lg mb-3" />
      <div className="h-7 bg-slate-200 rounded w-16 mb-2" />
      <div className="h-4 bg-slate-200 rounded w-28" />
    </div>
  );
}

export function ListRowsSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="divide-y divide-slate-100">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="px-4 py-3 animate-pulse flex items-center gap-4">
          <div className="h-4 bg-slate-200 rounded w-1/5" />
          <div className="h-4 bg-slate-200 rounded w-1/3" />
          <div className="h-4 bg-slate-200 rounded w-1/6 ml-auto" />
        </div>
      ))}
    </div>
  );
}

export function DetailPageSkeleton() {
  return (
    <div className="min-h-screen animate-pulse" style={{ backgroundColor: '#FFFBF5' }}>
      <div className="h-64 md:h-80" style={{ backgroundColor: '#E8D5C4' }} />
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="h-8 rounded w-1/3" style={{ backgroundColor: '#E8D5C4' }} />
        <div className="h-4 rounded w-1/4" style={{ backgroundColor: '#E8D5C4' }} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
          <div className="lg:col-span-2 space-y-3">
            <div className="h-4 rounded w-full" style={{ backgroundColor: '#E8D5C4' }} />
            <div className="h-4 rounded w-full" style={{ backgroundColor: '#E8D5C4' }} />
            <div className="h-4 rounded w-2/3" style={{ backgroundColor: '#E8D5C4' }} />
          </div>
          <div className="h-44 rounded-xl" style={{ backgroundColor: '#E8D5C4' }} />
        </div>
      </div>
    </div>
  );
}

export function AdminDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-5 bg-slate-200 rounded w-32" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
            <div className="h-5 bg-slate-200 rounded w-1/3" />
            <div className="h-4 bg-slate-200 rounded w-full" />
            <div className="h-4 bg-slate-200 rounded w-2/3" />
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
            <div className="h-5 bg-slate-200 rounded w-1/4" />
            <div className="h-4 bg-slate-200 rounded w-full" />
            <div className="h-4 bg-slate-200 rounded w-1/2" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 h-fit">
          <div className="h-5 bg-slate-200 rounded w-1/2" />
          <div className="h-4 bg-slate-200 rounded w-full" />
          <div className="h-4 bg-slate-200 rounded w-full" />
          <div className="h-9 bg-slate-200 rounded w-full mt-2" />
        </div>
      </div>
    </div>
  );
}

export function WizardSkeleton() {
  return (
    <div className="pt-16 min-h-screen animate-pulse" style={{ backgroundColor: '#FFFBF5' }}>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="h-6 rounded w-1/2" style={{ backgroundColor: '#E8D5C4' }} />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 rounded-xl" style={{ backgroundColor: '#E8D5C4' }} />
          ))}
        </div>
        <div className="h-40 rounded-xl" style={{ backgroundColor: '#E8D5C4' }} />
        <div className="h-14 rounded-xl" style={{ backgroundColor: '#E8D5C4' }} />
      </div>
    </div>
  );
}
