import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2 } from 'lucide-react';
import { adminApi } from '../../../lib/api';
import { useAsync } from '../../../hooks/useAsync';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { AdminCard } from '../../../components/admin/ui/AdminCard';
import { StatusBadge } from '../../../components/admin/ui/StatusBadge';
import { ConfirmDialog } from '../../../components/admin/ui/ConfirmDialog';
import { ToastContainer } from '../../../components/admin/ui/Toast';
import { useToast } from '../../../components/admin/ui/useToast';

export function ActivitiesListPage() {
  const [filterDest, setFilterDest] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toasts, addToast, removeToast } = useToast();

  const { data: actResult, loading, refetch } = useAsync(() => adminApi.getActivities(), []);
  const { data: destResult } = useAsync(() => adminApi.getDestinations(), []);
  const activities = actResult?.data ?? [];
  const destinations = destResult?.data ?? [];

  const filtered = (activities as any[]).filter((a: any) => !filterDest || a.destinationId === filterDest);
  const deleteTarget = (activities as any[]).find((a: any) => a.id === deleteId);
  const getDestName = (id: string) => (destinations as any[]).find((d: any) => d.id === id)?.name ?? id;

  async function handleDelete(id: string) {
    try {
      await adminApi.deleteActivity(id);
      setDeleteId(null);
      addToast('Activity deleted', 'success');
      refetch();
    } catch {
      addToast('Delete failed', 'error');
    }
  }

  async function handleToggleActive(id: string, current: boolean) {
    try {
      await adminApi.updateActivity(id, { isActive: !current });
      refetch();
    } catch {
      addToast('Update failed', 'error');
    }
  }

  return (
    <div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <PageHeader title="Activities" subtitle="Manage all activities" actionLabel="Add Activity" actionTo="/admin/activities/new" />

      <AdminCard>
        <div className="px-4 py-3 border-b border-slate-100">
          <select value={filterDest} onChange={e => setFilterDest(e.target.value)} className="text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Destinations</option>
            {(destinations as any[]).map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-center text-slate-500 text-sm py-10">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-slate-500 text-sm py-10">No activities found.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Destination</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Price Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Base Price</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Duration</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((act: any, idx: number) => (
                  <tr key={act.id} className={idx % 2 === 1 ? 'bg-slate-50' : 'bg-white'}>
                    <td className="px-4 py-3 font-medium text-slate-900 text-sm">{act.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{getDestName(act.destinationId)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${act.priceType === 'per_person' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
                        {act.priceType === 'per_person' ? 'Per Person' : 'Per Group'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">₹{act.basePrice?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{act.duration}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleToggleActive(act.id, act.isActive)}>
                        <StatusBadge status={act.isActive ? 'active' : 'inactive'} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link to={`/admin/activities/${act.id}/edit`} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={14} /></Link>
                        <button onClick={() => setDeleteId(act.id)} className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </AdminCard>

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Delete Activity"
        message={`Are you sure you want to delete "${(deleteTarget as any)?.name}"?`}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
