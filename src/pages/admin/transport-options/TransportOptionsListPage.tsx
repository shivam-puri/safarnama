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

const priceTypeLabel: Record<string, string> = {
  per_trip_flat: 'Per Trip (Flat)',
  per_person_per_day: 'Per Person/Day',
  per_day_flat: 'Per Day (Flat)',
};

export function TransportOptionsListPage() {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toasts, addToast, removeToast } = useToast();

  const { data: result, loading, refetch } = useAsync(() => adminApi.getTransportOptions(), []);
  const options = result?.data ?? [];
  const deleteTarget = (options as any[]).find((t: any) => t.id === deleteId);

  async function handleDelete(id: string) {
    try {
      await adminApi.deleteTransportOption(id);
      setDeleteId(null);
      addToast('Transport option deleted', 'success');
      refetch();
    } catch {
      addToast('Delete failed', 'error');
    }
  }

  async function handleToggle(id: string, current: boolean) {
    try {
      await adminApi.updateTransportOption(id, { isActive: !current });
      refetch();
    } catch {
      addToast('Update failed', 'error');
    }
  }

  return (
    <div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <PageHeader title="Transport Options" subtitle="Manage vehicles and transport pricing" actionLabel="Add Transport" actionTo="/admin/transport-options/new" />

      <AdminCard>
        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-center text-slate-500 text-sm py-10">Loading...</p>
          ) : (options as any[]).length === 0 ? (
            <p className="text-center text-slate-500 text-sm py-10">No transport options found.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Capacity</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Price Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Base Price</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(options as any[]).map((opt: any, idx: number) => (
                  <tr key={opt.id} className={idx % 2 === 1 ? 'bg-slate-50' : 'bg-white'}>
                    <td className="px-4 py-3 font-medium text-slate-900 text-sm">{opt.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{opt.capacity} pax</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{priceTypeLabel[opt.priceType] ?? opt.priceType}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">₹{opt.basePrice?.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleToggle(opt.id, opt.isActive)}>
                        <StatusBadge status={opt.isActive ? 'active' : 'inactive'} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link to={`/admin/transport-options/${opt.id}/edit`} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={14} /></Link>
                        <button onClick={() => setDeleteId(opt.id)} className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
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
        title="Delete Transport Option"
        message={`Are you sure you want to delete "${(deleteTarget as any)?.name}"?`}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
