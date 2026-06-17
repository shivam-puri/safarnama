import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { adminApi } from '../../../lib/api';
import { useAsync } from '../../../hooks/useAsync';
import { AdminCard } from '../../../components/admin/ui/AdminCard';
import { StatusBadge } from '../../../components/admin/ui/StatusBadge';
import { ToastContainer } from '../../../components/admin/ui/Toast';
import { useToast } from '../../../components/admin/ui/useToast';

const STATUSES = ['new', 'contacted', 'qualified', 'converted', 'lost', 'spam'] as const;
type LeadStatus = typeof STATUSES[number];

export function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();
  const [noteText, setNoteText] = useState('');
  const [newStatus, setNewStatus] = useState<LeadStatus | ''>('');

  const { data: result, loading, refetch } = useAsync(() => adminApi.getLead(id!), [id]);
  const lead = result?.data ?? result;

  if (loading) {
    return <p className="text-center text-slate-500 py-20">Loading...</p>;
  }

  if (!lead) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Lead not found.</p>
        <Link to="/admin/leads" className="text-blue-600 hover:underline text-sm mt-2 inline-block">← Back to Leads</Link>
      </div>
    );
  }

  async function handleStatusChange() {
    if (!newStatus || !id) return;
    try {
      await adminApi.updateLeadStatus(id, newStatus);
      addToast('Status updated', 'success');
      setNewStatus('');
      refetch();
    } catch {
      addToast('Update failed', 'error');
    }
  }

  async function handleAddNote() {
    if (!noteText.trim() || !id) return;
    try {
      await adminApi.addLeadNote(id, noteText.trim());
      addToast('Note added', 'success');
      setNoteText('');
      refetch();
    } catch {
      addToast('Failed to add note', 'error');
    }
  }

  const inputCls = "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="mb-6 flex items-center gap-3">
        <button onClick={() => navigate('/admin/leads')} className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">{lead.leadNumber}</h1>
          <p className="text-sm text-slate-500">Lead Detail</p>
        </div>
        <StatusBadge status={lead.status} className="ml-2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <AdminCard title="Customer Information">
            <div className="p-6 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Name</p>
                <p className="text-sm font-medium text-slate-900">{lead.customer?.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Email</p>
                <p className="text-sm text-slate-700">{lead.customer?.email}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Phone</p>
                <p className="text-sm text-slate-700">{lead.customer?.phone}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">City</p>
                <p className="text-sm text-slate-700">{lead.customer?.city}</p>
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Trip Customization">
            <div className="p-6 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Itinerary</p>
                <p className="text-sm font-medium text-slate-900">{lead.itinerarySnapshot?.title}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Destination</p>
                <p className="text-sm text-slate-700">{lead.itinerarySnapshot?.destinationName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Travelers</p>
                <p className="text-sm text-slate-700">{lead.customization?.travelerCount}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Travel Month</p>
                <p className="text-sm text-slate-700">{lead.customization?.travelMonth}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Hotel</p>
                <p className="text-sm text-slate-700">{lead.customization?.hotelCategoryName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Room Sharing</p>
                <p className="text-sm text-slate-700">{lead.customization?.roomSharingType} ({lead.customization?.numberOfRooms} rooms)</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Transport</p>
                <p className="text-sm text-slate-700">{lead.customization?.transportOptionName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Duration</p>
                <p className="text-sm text-slate-700">{lead.itinerarySnapshot?.duration?.days}D / {lead.itinerarySnapshot?.duration?.nights}N</p>
              </div>
            </div>
            {lead.customization?.selectedActivities?.length > 0 && (
              <div className="px-6 pb-4">
                <p className="text-xs text-slate-500 mb-2">Selected Activities</p>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">Activity</th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-slate-500">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {lead.customization.selectedActivities.map((act: any, i: number) => (
                      <tr key={i}>
                        <td className="px-3 py-2 text-slate-700">{act.activityName}</td>
                        <td className="px-3 py-2 text-right text-slate-700">₹{act.price?.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </AdminCard>

          <AdminCard title="Notes">
            <div className="p-6 space-y-4">
              {(lead.notes ?? []).length === 0 ? (
                <p className="text-sm text-slate-400">No notes yet.</p>
              ) : (
                <div className="space-y-3">
                  {(lead.notes ?? []).map((note: any, i: number) => (
                    <div key={i} className="bg-slate-50 rounded-lg p-3">
                      <p className="text-sm text-slate-700">{note.text}</p>
                      <p className="text-xs text-slate-400 mt-1">{new Date(note.addedAt).toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>
              )}
              <div className="pt-2">
                <textarea
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  rows={3}
                  className={inputCls}
                  placeholder="Add a note..."
                />
                <button onClick={handleAddNote} className="mt-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
                  Add Note
                </button>
              </div>
            </div>
          </AdminCard>
        </div>

        <div className="space-y-5">
          <AdminCard title="Price Breakdown">
            <div className="p-6">
              <div className="space-y-2 text-sm">
                {lead.priceBreakdown?.basePrice !== undefined && (
                  <div className="flex justify-between text-slate-600">
                    <span>Base Price</span>
                    <span>₹{lead.priceBreakdown.basePrice?.toLocaleString()}</span>
                  </div>
                )}
                {lead.priceBreakdown?.hotelUpgrade !== undefined && lead.priceBreakdown.hotelUpgrade !== 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Hotel Upgrade</span>
                    <span className={lead.priceBreakdown.hotelUpgrade < 0 ? 'text-green-600' : ''}>
                      {lead.priceBreakdown.hotelUpgrade < 0 ? '-' : '+'}₹{Math.abs(lead.priceBreakdown.hotelUpgrade).toLocaleString()}
                    </span>
                  </div>
                )}
                {lead.priceBreakdown?.transportCost !== undefined && (
                  <div className="flex justify-between text-slate-600">
                    <span>Transport</span>
                    <span>₹{lead.priceBreakdown.transportCost?.toLocaleString()}</span>
                  </div>
                )}
                {lead.priceBreakdown?.activitiesTotal !== undefined && lead.priceBreakdown.activitiesTotal !== 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Activities</span>
                    <span>₹{lead.priceBreakdown.activitiesTotal?.toLocaleString()}</span>
                  </div>
                )}
                {lead.priceBreakdown?.subtotal !== undefined && (
                  <div className="flex justify-between text-slate-700 font-medium border-t border-slate-100 pt-2 mt-2">
                    <span>Subtotal</span>
                    <span>₹{lead.priceBreakdown.subtotal?.toLocaleString()}</span>
                  </div>
                )}
                {lead.priceBreakdown?.gstAmount !== undefined && (
                  <div className="flex justify-between text-slate-600">
                    <span>GST ({lead.priceBreakdown.gstPercent ?? 5}%)</span>
                    <span>₹{lead.priceBreakdown.gstAmount?.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-900 font-bold border-t border-slate-200 pt-2 mt-2 text-base">
                  <span>Total</span>
                  <span>₹{lead.priceBreakdown?.totalAmount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-xs">
                  <span>Per Person</span>
                  <span>₹{lead.priceBreakdown?.pricePerPerson?.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-3 bg-amber-50 text-amber-700 text-xs px-3 py-2 rounded-lg">
                Indicative price — not confirmed
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Change Status">
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">Current:</span>
                <StatusBadge status={lead.status} />
              </div>
              <select value={newStatus} onChange={e => setNewStatus(e.target.value as LeadStatus)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select new status...</option>
                {STATUSES.filter(s => s !== lead.status).map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
              <button onClick={handleStatusChange} disabled={!newStatus} className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg">
                Update Status
              </button>
            </div>
          </AdminCard>

          <AdminCard title="Lead Metadata">
            <div className="p-6 space-y-3 text-sm">
              <div>
                <p className="text-xs text-slate-500">Lead Number</p>
                <p className="font-mono text-slate-700">{lead.leadNumber}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Created</p>
                <p className="text-slate-700">{new Date(lead.createdAt).toLocaleString('en-IN')}</p>
              </div>
              {lead.source && (
                <div>
                  <p className="text-xs text-slate-500">Source</p>
                  <p className="text-slate-700">{lead.source}</p>
                </div>
              )}
            </div>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
