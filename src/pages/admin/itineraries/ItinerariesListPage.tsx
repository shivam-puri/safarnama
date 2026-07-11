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

export function ItinerariesListPage() {
  const [filterDest, setFilterDest] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toasts, addToast, removeToast } = useToast();

  const { data: itnResult, loading, refetch } = useAsync(() => adminApi.getItineraries(), []);
  const itineraries = itnResult?.data ?? [];

  // Build unique destination list from populated destinationId objects
  const destinations = Array.from(
    new Map(
      itineraries
        .filter((i: any) => i.destinationId?._id)
        .map((i: any) => [i.destinationId._id, { id: i.destinationId._id, name: i.destinationId.name }])
    ).values()
  );

  // destinationId comes populated as an object { _id, name, slug } from the backend
  const getDestId = (d: any) => d?.destinationId?._id ?? d?.destinationId ?? ''
  const getDestName = (d: any) => d?.destinationId?.name ?? d?.destinationId ?? '—'

  const filtered = itineraries.filter((i: any) => {
    const destMatch = !filterDest || getDestId(i) === filterDest;
    const catMatch = !filterCat || i.category === filterCat;
    return destMatch && catMatch;
  });

  async function handleDelete(id: string) {
    try {
      await adminApi.deleteItinerary(id);
      setDeleteId(null);
      addToast('Itinerary deleted', 'success');
      refetch();
    } catch {
      addToast('Delete failed', 'error');
    }
  }

  async function handleToggle(id: string, field: 'isActive' | 'isFeatured', val: boolean) {
    try {
      await adminApi.updateItinerary(id, { [field]: !val });
      refetch();
    } catch {
      addToast('Update failed', 'error');
    }
  }

  const deleteTarget = itineraries.find((i: any) => i._id === deleteId || i.id === deleteId);

  return (
    <div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <PageHeader title="Itineraries" subtitle="Manage all travel itineraries" actionLabel="Add Itinerary" actionTo="/admin/itineraries/new" />

      <AdminCard>
        <div className="px-4 py-3 border-b border-slate-100 flex gap-3 flex-wrap">
          <select value={filterDest} onChange={e => setFilterDest(e.target.value)} className="text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Destinations</option>
            {destinations.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Categories</option>
            {['budget', 'family', 'luxury', 'adventure', 'honeymoon'].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <TableSkeleton rows={6} cols={8} />
          ) : filtered.length === 0 ? (
            <p className="text-center text-slate-500 text-sm py-10">No itineraries found.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Destination</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Duration</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Base Price</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Active</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Featured</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((itn: any, idx: number) => (
                  <tr key={itn.id} className={idx % 2 === 1 ? 'bg-slate-50' : 'bg-white'}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900 text-sm">{itn.title}</p>
                      <p className="text-xs text-slate-400 font-mono">{itn.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{getDestName(itn)}</td>
                    <td className="px-4 py-3"><StatusBadge status={itn.category} /></td>
                    <td className="px-4 py-3 text-sm text-slate-600">{itn.duration?.days}D/{itn.duration?.nights}N</td>
                    <td className="px-4 py-3 text-sm text-slate-600">₹{itn.basePricePerPerson?.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleToggle(itn.id, 'isActive', itn.isActive)}>
                        <StatusBadge status={itn.isActive ? 'active' : 'inactive'} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggle(itn.id, 'isFeatured', itn.isFeatured)}
                        className={`text-xs px-2 py-0.5 rounded-full ${itn.isFeatured ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}
                      >
                        {itn.isFeatured ? 'Featured' : 'Normal'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link to={`/admin/itineraries/${itn.id}/edit`} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={14} /></Link>
                        <button onClick={() => setDeleteId(itn.id)} className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
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
        title="Delete Itinerary"
        message={`Are you sure you want to delete "${(deleteTarget as any)?.title}"?`}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
