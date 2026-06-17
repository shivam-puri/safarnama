import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { adminApi } from '../../../lib/api';
import { useAsync } from '../../../hooks/useAsync';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { AdminCard } from '../../../components/admin/ui/AdminCard';
import { StatusBadge } from '../../../components/admin/ui/StatusBadge';

const STATUSES = ['new', 'contacted', 'qualified', 'converted', 'lost', 'spam'] as const;

export function LeadsListPage() {
  const [filterStatus, setFilterStatus] = useState('');

  const { data: result, loading } = useAsync(() => adminApi.getLeads(), []);
  const allLeads = result?.data ?? [];

  const filtered = [...(allLeads as any[])]
    .filter((l: any) => !filterStatus || l.status === filterStatus)
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div>
      <PageHeader title="Leads / Enquiries" subtitle={`${(allLeads as any[]).length} total leads`} />

      <AdminCard>
        <div className="px-4 py-3 border-b border-slate-100">
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-center text-slate-500 text-sm py-10">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-slate-500 text-sm py-10">No leads found.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Lead #</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Itinerary</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Travelers</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((lead: any, idx: number) => (
                  <tr key={lead.id} className={idx % 2 === 1 ? 'bg-slate-50' : 'bg-white'}>
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono text-slate-600">{lead.leadNumber}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900 text-sm">{lead.customer?.name}</p>
                      <p className="text-xs text-slate-500">{lead.customer?.city}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-slate-700">{lead.itinerarySnapshot?.title}</p>
                      <p className="text-xs text-slate-500">{lead.itinerarySnapshot?.destinationName}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{lead.customization?.travelerCount}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">₹{lead.priceBreakdown?.totalAmount?.toLocaleString()}</td>
                    <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/admin/leads/${lead.id}`} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg inline-flex">
                        <Eye size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </AdminCard>
    </div>
  );
}
