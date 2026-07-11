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
import { TableSkeleton } from '../../../components/common/LoadingSkeleton';

export function HotelCategoriesListPage() {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toasts, addToast, removeToast } = useToast();

  const { data: result, loading, refetch } = useAsync(() => adminApi.getHotelCategories(), []);
  const categories = [...(result?.data ?? [])].sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  const deleteTarget = categories.find((c: any) => c.id === deleteId);

  async function handleDelete(id: string) {
    try {
      await adminApi.deleteHotelCategory(id);
      setDeleteId(null);
      addToast('Hotel category deleted', 'success');
      refetch();
    } catch {
      addToast('Delete failed', 'error');
    }
  }

  async function handleToggle(id: string, current: boolean) {
    try {
      await adminApi.updateHotelCategory(id, { isActive: !current });
      refetch();
    } catch {
      addToast('Update failed', 'error');
    }
  }

  return (
    <div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <PageHeader title="Hotel Categories" subtitle="Manage hotel tiers and pricing" actionLabel="Add Category" actionTo="/admin/hotel-categories/new" />

      <AdminCard>
        <div className="overflow-x-auto">
          {loading ? (
            <TableSkeleton rows={5} cols={6} />
          ) : categories.length === 0 ? (
            <p className="text-center text-slate-500 text-sm py-10">No hotel categories found.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Order</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Display Label</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Pricing Tiers</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((cat: any, idx: number) => (
                  <tr key={cat.id} className={idx % 2 === 1 ? 'bg-slate-50' : 'bg-white'}>
                    <td className="px-4 py-3 text-sm font-medium text-slate-500">{cat.sortOrder}</td>
                    <td className="px-4 py-3 font-medium text-slate-900 text-sm">{cat.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{cat.displayLabel}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{cat.pricingTiers?.length ?? 0} tier{(cat.pricingTiers?.length ?? 0) !== 1 ? 's' : ''}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleToggle(cat.id, cat.isActive)}>
                        <StatusBadge status={cat.isActive ? 'active' : 'inactive'} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link to={`/admin/hotel-categories/${cat.id}/edit`} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={14} /></Link>
                        <button onClick={() => setDeleteId(cat.id)} className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
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
        title="Delete Hotel Category"
        message={`Are you sure you want to delete "${(deleteTarget as any)?.name}"?`}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
