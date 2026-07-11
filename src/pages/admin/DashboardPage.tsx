import { Link } from 'react-router-dom';
import { MapPin, Map, FileText, Star } from 'lucide-react';
import { useAsync } from '../../hooks/useAsync';
import { adminApi } from '../../lib/api';
import { StatusBadge } from '../../components/admin/ui/StatusBadge';
import { useToast } from '../../components/admin/ui/useToast';
import { ToastContainer } from '../../components/admin/ui/Toast';
import { StatCardSkeleton, ListRowsSkeleton } from '../../components/common/LoadingSkeleton';

function StatCard({ label, value, icon, sub, to }: { label: string; value: number; icon: React.ReactNode; sub?: string; to: string }) {
  return (
    <Link to={to} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
          {icon}
        </div>
        {sub && <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{sub}</span>}
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-sm text-slate-500 mt-0.5">{label}</p>
    </Link>
  );
}

export function DashboardPage() {
  const { toasts, addToast, removeToast } = useToast();
  const { data: stats, loading } = useAsync(() => adminApi.getDashboardStats(), []);

  async function handleApprove(id: string) {
    try {
      await adminApi.updateReviewStatus(id, 'approved');
      addToast('Review approved', 'success');
    } catch {
      addToast('Failed to approve review', 'error');
    }
  }

  async function handleReject(id: string) {
    try {
      await adminApi.updateReviewStatus(id, 'rejected');
      addToast('Review rejected', 'success');
    } catch {
      addToast('Failed to reject review', 'error');
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Welcome back. Here's what's happening.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100">
              <div className="h-4 bg-slate-200 rounded w-28 animate-pulse" />
            </div>
            <ListRowsSkeleton rows={4} />
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100">
              <div className="h-4 bg-slate-200 rounded w-32 animate-pulse" />
            </div>
            <ListRowsSkeleton rows={4} />
          </div>
        </div>
      </div>
    );
  }

  const totalDestinations = stats?.totalDestinations ?? 0;
  const totalItineraries = stats?.totalItineraries ?? 0;
  const totalLeads = stats?.totalLeads ?? 0;
  const newLeadsToday = stats?.newLeadsToday ?? 0;
  const pendingReviews = stats?.pendingReviews ?? 0;
  const recentLeads = stats?.recentLeads ?? [];
  const pendingReviewsList = stats?.recentReviews ?? [];

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">Welcome back. Here's what's happening.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Destinations" value={totalDestinations} icon={<MapPin size={18} />} to="/admin/destinations" />
        <StatCard label="Total Itineraries" value={totalItineraries} icon={<Map size={18} />} to="/admin/itineraries" />
        <StatCard label="Total Leads" value={totalLeads} icon={<FileText size={18} />} sub={newLeadsToday > 0 ? `${newLeadsToday} today` : undefined} to="/admin/leads" />
        <StatCard label="Pending Reviews" value={pendingReviews} icon={<Star size={18} />} to="/admin/reviews" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Recent Leads</h2>
            <Link to="/admin/leads" className="text-xs text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            {recentLeads.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No leads yet</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Lead #</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Customer</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Amount</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentLeads.map((lead: any) => (
                    <tr key={lead.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <Link to={`/admin/leads/${lead.id}`} className="text-xs font-mono text-blue-600 hover:underline">{lead.leadNumber}</Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">{lead.customer?.name}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">₹{lead.priceBreakdown?.totalAmount?.toLocaleString()}</td>
                      <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Pending Reviews */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Pending Reviews</h2>
            <Link to="/admin/reviews" className="text-xs text-blue-600 hover:underline">View all</Link>
          </div>
          {pendingReviewsList.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">No pending reviews</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingReviewsList.map((review: any) => (
                <div key={review.id} className="px-6 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{review.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{review.reviewer?.name} — {'★'.repeat(review.rating)}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleApprove(review.id)}
                        className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded hover:bg-green-100"
                      >Approve</button>
                      <button
                        onClick={() => handleReject(review.id)}
                        className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded hover:bg-red-100"
                      >Reject</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
