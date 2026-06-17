import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminApi } from '../../../lib/api';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { AdminCard } from '../../../components/admin/ui/AdminCard';
import { ToastContainer } from '../../../components/admin/ui/Toast';
import { useToast } from '../../../components/admin/ui/useToast';

type PriceType = 'per_trip_flat' | 'per_person_per_day' | 'per_day_flat';

type FormState = {
  name: string; description: string; capacity: number;
  priceType: PriceType; basePrice: number; image: string; isActive: boolean;
};

export function TransportOptionFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();
  const isEdit = Boolean(id);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<FormState>({
    name: '', description: '', capacity: 4, priceType: 'per_day_flat', basePrice: 0, image: '', isActive: true,
  });

  useEffect(() => {
    if (id) {
      adminApi.getTransportOption(id).then((result: any) => {
        const tr = result?.data ?? result;
        if (tr) {
          setForm({
            name: tr.name, description: tr.description ?? '', capacity: tr.capacity,
            priceType: tr.priceType, basePrice: tr.basePrice, image: tr.image ?? '', isActive: tr.isActive !== false,
          });
        }
      }).catch(() => addToast('Failed to load transport option', 'error'));
    }
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { addToast('Name is required', 'error'); return; }
    setSaving(true);
    try {
      if (isEdit && id) {
        await adminApi.updateTransportOption(id, form);
        addToast('Transport option updated', 'success');
      } else {
        await adminApi.createTransportOption(form);
        addToast('Transport option created', 'success');
      }
      setTimeout(() => navigate('/admin/transport-options'), 1000);
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
      <PageHeader title={isEdit ? 'Edit Transport Option' : 'New Transport Option'} />
      <form onSubmit={handleSubmit}>
        <div className="max-w-2xl">
          <AdminCard>
            <div className="p-6 space-y-4">
              <div>
                <label className={labelCls}>Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} placeholder="Innova Crysta" />
              </div>
              <div>
                <label className={labelCls}>Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Capacity (max pax)</label>
                  <input type="number" min={1} value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: Number(e.target.value) }))} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Base Price (INR)</label>
                  <input type="number" min={0} value={form.basePrice} onChange={e => setForm(f => ({ ...f, basePrice: Number(e.target.value) }))} className={inputCls} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Price Type</label>
                <select value={form.priceType} onChange={e => setForm(f => ({ ...f, priceType: e.target.value as PriceType }))} className={inputCls}>
                  <option value="per_day_flat">Per Day (Flat)</option>
                  <option value="per_trip_flat">Per Trip (Flat)</option>
                  <option value="per_person_per_day">Per Person Per Day</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Image URL</label>
                <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} className={inputCls} placeholder="https://..." />
                {form.image && <img src={form.image} alt="" className="mt-2 w-full h-32 object-cover rounded-lg" onError={e => (e.currentTarget.style.display = 'none')} />}
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} />
                <span className="text-sm font-medium text-slate-700">Active</span>
              </label>
            </div>
          </AdminCard>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <button type="button" onClick={() => navigate('/admin/transport-options')} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
          <button type="submit" disabled={saving} className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-lg">{saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}</button>
        </div>
      </form>
    </div>
  );
}
