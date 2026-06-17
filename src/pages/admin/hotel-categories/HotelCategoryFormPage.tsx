import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import { adminApi } from '../../../lib/api';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { AdminCard } from '../../../components/admin/ui/AdminCard';
import { ToastContainer } from '../../../components/admin/ui/Toast';
import { useToast } from '../../../components/admin/ui/useToast';

type Tier = { minTravelers: number; maxTravelers: number; pricePerPersonPerNight: number };

type FormState = {
  name: string; displayLabel: string; description: string; sortOrder: number;
  tiers: Tier[]; isActive: boolean;
};

export function HotelCategoryFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();
  const isEdit = Boolean(id);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<FormState>({
    name: '', displayLabel: '', description: '', sortOrder: 1,
    tiers: [{ minTravelers: 1, maxTravelers: 10, pricePerPersonPerNight: 1000 }],
    isActive: true,
  });

  useEffect(() => {
    if (id) {
      adminApi.getHotelCategory(id).then((result: any) => {
        const hc = result?.data ?? result;
        if (hc) {
          setForm({
            name: hc.name, displayLabel: hc.displayLabel, description: hc.description ?? '',
            sortOrder: hc.sortOrder, tiers: hc.pricingTiers ?? [], isActive: hc.isActive !== false,
          });
        }
      }).catch(() => addToast('Failed to load hotel category', 'error'));
    }
  }, [id]);

  function addTier() {
    setForm(f => ({ ...f, tiers: [...f.tiers, { minTravelers: 1, maxTravelers: 10, pricePerPersonPerNight: 0 }] }));
  }

  function updateTier(idx: number, field: keyof Tier, value: number) {
    setForm(f => {
      const tiers = [...f.tiers];
      tiers[idx] = { ...tiers[idx], [field]: value };
      return { ...f, tiers };
    });
  }

  function removeTier(idx: number) {
    setForm(f => ({ ...f, tiers: f.tiers.filter((_, i) => i !== idx) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { addToast('Name is required', 'error'); return; }
    const hcData = {
      name: form.name, displayLabel: form.displayLabel, description: form.description,
      sortOrder: form.sortOrder, pricingTiers: form.tiers, isActive: form.isActive,
    };
    setSaving(true);
    try {
      if (isEdit && id) {
        await adminApi.updateHotelCategory(id, hcData);
        addToast('Hotel category updated', 'success');
      } else {
        await adminApi.createHotelCategory(hcData);
        addToast('Hotel category created', 'success');
      }
      setTimeout(() => navigate('/admin/hotel-categories'), 1000);
    } catch {
      addToast('Save failed', 'error');
    } finally {
      setSaving(false);
    }
  }

  const inputCls = "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelCls = "block text-sm font-medium text-slate-700 mb-1.5";

  return (
    <div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <PageHeader title={isEdit ? 'Edit Hotel Category' : 'New Hotel Category'} />
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AdminCard>
            <div className="p-6 space-y-4">
              <div>
                <label className={labelCls}>Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} placeholder="3 Star" />
              </div>
              <div>
                <label className={labelCls}>Display Label</label>
                <input value={form.displayLabel} onChange={e => setForm(f => ({ ...f, displayLabel: e.target.value }))} className={inputCls} placeholder="3 Star Hotel" />
              </div>
              <div>
                <label className={labelCls}>Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Sort Order</label>
                <input type="number" min={1} value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))} className={inputCls} />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} />
                <span className="text-sm font-medium text-slate-700">Active</span>
              </label>
            </div>
          </AdminCard>

          <AdminCard>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 text-sm">Pricing Tiers</h3>
                <button type="button" onClick={addTier} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
                  <Plus size={12} /> Add Tier
                </button>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">Min Travelers</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">Max Travelers</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">Price/Person/Night</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {form.tiers.map((tier, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2">
                        <input type="number" min={1} value={tier.minTravelers} onChange={e => updateTier(idx, 'minTravelers', Number(e.target.value))} className="w-full border border-slate-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                      </td>
                      <td className="px-3 py-2">
                        <input type="number" min={1} value={tier.maxTravelers} onChange={e => updateTier(idx, 'maxTravelers', Number(e.target.value))} className="w-full border border-slate-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                      </td>
                      <td className="px-3 py-2">
                        <input type="number" min={0} value={tier.pricePerPersonPerNight} onChange={e => updateTier(idx, 'pricePerPersonPerNight', Number(e.target.value))} className="w-full border border-slate-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                      </td>
                      <td className="px-3 py-2">
                        {form.tiers.length > 1 && (
                          <button type="button" onClick={() => removeTier(idx)} className="text-slate-400 hover:text-red-500"><X size={14} /></button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AdminCard>
        </div>

        <div className="flex gap-3 mt-6 justify-end">
          <button type="button" onClick={() => navigate('/admin/hotel-categories')} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
          <button type="submit" disabled={saving} className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-lg">{saving ? 'Saving...' : isEdit ? 'Update Category' : 'Create Category'}</button>
        </div>
      </form>
    </div>
  );
}
