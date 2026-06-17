import { useState } from 'react';
import { adminApi } from '../../../lib/api';
import { useAsync } from '../../../hooks/useAsync';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { StatusBadge } from '../../../components/admin/ui/StatusBadge';
import { ToastContainer } from '../../../components/admin/ui/Toast';
import { useToast } from '../../../components/admin/ui/useToast';
import { Star } from 'lucide-react';

function RatingDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={14} className={i <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'} />
      ))}
    </div>
  );
}

export function ReviewsPage() {
  const [tab, setTab] = useState<'pending' | 'moderated'>('pending');
  const { toasts, addToast, removeToast } = useToast();

  const { data: result, refetch } = useAsync(() => adminApi.getReviews(), []);
  const reviews = result?.data ?? [];

  const pending = (reviews as any[]).filter((r: any) => r.status === 'pending');
  const moderated = (reviews as any[]).filter((r: any) => r.status !== 'pending');

  async function handleApprove(id: string) {
    try {
      await adminApi.updateReviewStatus(id, 'approved');
      addToast('Review approved', 'success');
      refetch();
    } catch {
      addToast('Failed to approve review', 'error');
    }
  }

  async function handleReject(id: string) {
    try {
      await adminApi.updateReviewStatus(id, 'rejected');
      addToast('Review rejected', 'success');
      refetch();
    } catch {
      addToast('Failed to reject review', 'error');
    }
  }

  async function handleToggleFeatured(id: string) {
    try {
      await adminApi.toggleReviewFeatured(id);
      refetch();
    } catch {
      addToast('Update failed', 'error');
    }
  }

  return (
    <div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <PageHeader title="Reviews" subtitle="Moderate customer reviews" />

      <div className="flex gap-1 mb-6 bg-white border border-slate-200 rounded-xl p-1 w-fit shadow-sm">
        {(['pending', 'moderated'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${tab === t ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}
          >
            {t === 'pending' ? `Pending (${pending.length})` : `Approved / Rejected (${moderated.length})`}
          </button>
        ))}
      </div>

      {tab === 'pending' && (
        pending.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-10 text-center text-slate-500 text-sm">
            No pending reviews. All caught up!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pending.map((review: any) => (
              <div key={review.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{review.reviewer?.name}</p>
                    <p className="text-xs text-slate-500">{review.reviewer?.city} · {review.travelMonth}</p>
                  </div>
                  <RatingDisplay rating={review.rating} />
                </div>
                <p className="font-medium text-slate-900 text-sm mb-2">{review.title}</p>
                <p className="text-sm text-slate-600 line-clamp-3">{review.body}</p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleApprove(review.id)}
                    className="flex-1 py-1.5 text-sm font-medium bg-green-50 text-green-700 hover:bg-green-100 rounded-lg"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(review.id)}
                    className="flex-1 py-1.5 text-sm font-medium bg-red-50 text-red-700 hover:bg-red-100 rounded-lg"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'moderated' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
          {moderated.length === 0 ? (
            <p className="text-center text-slate-500 text-sm py-10">No moderated reviews yet.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Reviewer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Rating</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Featured</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {moderated.map((review: any, idx: number) => (
                  <tr key={review.id} className={idx % 2 === 1 ? 'bg-slate-50' : 'bg-white'}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900 text-sm">{review.reviewer?.name}</p>
                      <p className="text-xs text-slate-500">{review.reviewer?.city}</p>
                    </td>
                    <td className="px-4 py-3"><RatingDisplay rating={review.rating} /></td>
                    <td className="px-4 py-3"><StatusBadge status={review.status} /></td>
                    <td className="px-4 py-3">
                      {review.status === 'approved' && (
                        <button
                          onClick={() => handleToggleFeatured(review.id)}
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${review.isFeatured ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}
                        >
                          {review.isFeatured ? 'Featured' : 'Set Featured'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
