interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  // Lead statuses
  new: { label: 'New', className: 'bg-blue-100 text-blue-700' },
  contacted: { label: 'Contacted', className: 'bg-yellow-100 text-yellow-700' },
  qualified: { label: 'Qualified', className: 'bg-purple-100 text-purple-700' },
  converted: { label: 'Converted', className: 'bg-green-100 text-green-700' },
  lost: { label: 'Lost', className: 'bg-red-100 text-red-700' },
  spam: { label: 'Spam', className: 'bg-gray-100 text-gray-500' },
  // Review statuses
  pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700' },
  approved: { label: 'Approved', className: 'bg-green-100 text-green-700' },
  rejected: { label: 'Rejected', className: 'bg-red-100 text-red-700' },
  // Active / Inactive
  active: { label: 'Active', className: 'bg-green-100 text-green-700' },
  inactive: { label: 'Inactive', className: 'bg-gray-100 text-gray-500' },
  // Category
  budget: { label: 'Budget', className: 'bg-emerald-100 text-emerald-700' },
  family: { label: 'Family', className: 'bg-blue-100 text-blue-700' },
  luxury: { label: 'Luxury', className: 'bg-amber-100 text-amber-700' },
  adventure: { label: 'Adventure', className: 'bg-orange-100 text-orange-700' },
  honeymoon: { label: 'Honeymoon', className: 'bg-pink-100 text-pink-700' },
};

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config = statusConfig[status.toLowerCase()] ?? { label: status, className: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className} ${className}`}>
      {config.label}
    </span>
  );
}
