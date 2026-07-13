import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Search } from 'lucide-react';
import { adminApi } from '../../../lib/api';
import { useAsync } from '../../../hooks/useAsync';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { AdminCard } from '../../../components/admin/ui/AdminCard';
import { StatusBadge } from '../../../components/admin/ui/StatusBadge';
import { ConfirmDialog } from '../../../components/admin/ui/ConfirmDialog';
import { ToastContainer } from '../../../components/admin/ui/Toast';
import { useToast } from '../../../components/admin/ui/useToast';
import { TableSkeleton } from '../../../components/common/LoadingSkeleton';

export function DestinationsListPage() {
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toasts, addToast, removeToast } = useToast();
  const { data: result, loading, refetch } = useAsync(() => adminApi.getDestinations(), []);

  const destinations = result?.data ?? [];
  const filtered = destinations.filter((d: any) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.slug.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(id: string) {
    try {
      await adminApi.deleteDestination(id);
      setDeleteId(null);
      addToast('Destination deleted', 'success');
      refetch();
    } catch {
      addToast('Delete failed', 'error');
    }
  }

  async function handleToggleActive(id: string, current: boolean | undefined) {
    try {
      await adminApi.updateDestination(id, { isActive: !current });
      addToast('Status updated', 'success');
      refetch();
    } catch {
      addToast('Update failed', 'error');
    }
  }

  async function handleToggleComingSoon(id: string, current: boolean | undefined) {
    try {
      await adminApi.updateDestination(id, { isComingSoon: !current });
      addToast('Status updated', 'success');
      refetch();
    } catch {
      addToast('Update failed', 'error');
    }
  }

  const deleteTarget = destinations.find((d: any) => d.id === deleteId);

  return (
    <div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <PageHeader title="Destinations" subtitle="Manage all travel destinations" actionLabel="Add Destination" actionTo="/admin/destinations/new" />

      <AdminCard>
        {/* Search */}
        <div className="px-4 py-3 border-b border-slate-100">
          <div className="relative max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search destinations..."
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <TableSkeleton rows={6} cols={5} />
          ) : filtered.length === 0 ? (
            <p className="text-center text-slate-500 text-sm py-10">No destinations found.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Destination</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Slug</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Coming Soon</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((dest: any, idx: number) => {
                  const primaryImg = dest.images?.find((i: any) => i.isPrimary) ?? dest.images?.[0];
                  return (
                    <tr key={dest.id} className={idx % 2 === 1 ? 'bg-slate-50' : 'bg-white'}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {primaryImg ? (
                            <img src={primaryImg.url} alt={primaryImg.alt} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-10 h-10 bg-slate-200 rounded-lg flex-shrink-0" />
                          )}
                          <div>
                            <p className="font-medium text-slate-900 text-sm">{dest.name}</p>
                            <p className="text-xs text-slate-500">{dest.location?.state}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-slate-500">{dest.slug}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleToggleActive(dest.id, dest.isActive)}>
                          <StatusBadge status={dest.isActive !== false ? 'active' : 'inactive'} />
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleComingSoon(dest.id, dest.isComingSoon)}
                          className={`text-xs px-2 py-0.5 rounded-full ${dest.isComingSoon ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}
                        >
                          {dest.isComingSoon ? 'Coming Soon' : 'No'}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/destinations/${dest.id}/edit`}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit size={14} />
                          </Link>
                          <button
                            onClick={() => setDeleteId(dest.id)}
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </AdminCard>

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Delete Destination"
        message={`Are you sure you want to delete "${(deleteTarget as any)?.name}"? This cannot be undone.`}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
