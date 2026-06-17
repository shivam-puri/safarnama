import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X, Plus } from 'lucide-react';
import { adminApi } from '../../../lib/api';
import { useAsync } from '../../../hooks/useAsync';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { AdminCard } from '../../../components/admin/ui/AdminCard';
import { ToastContainer } from '../../../components/admin/ui/Toast';
import { useToast } from '../../../components/admin/ui/useToast';

type FormState = {
  name: string; description: string; destinationId: string;
  priceType: 'per_person' | 'per_group'; basePrice: number; duration: string;
  tags: string[]; tagInput: string;
  images: string[]; isActive: boolean;
};

const defaultForm: FormState = {
  name: '', description: '', destinationId: '', priceType: 'per_person',
  basePrice: 0, duration: '2 hours', tags: [], tagInput: '', images: [''], isActive: true,
};

export function ActivityFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();
  const isEdit = Boolean(id);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [saving, setSaving] = useState(false);

  const { data: destResult } = useAsync(() => adminApi.getDestinations(), []);
  const destinations = destResult?.data ?? [];

  useEffect(() => {
    if (id) {
      adminApi.getActivity(id).then((result: any) => {
        const act = result?.data ?? result;
        if (act) {
          setForm({
            name: act.name, description: act.description, destinationId: act.destinationId,
            priceType: act.priceType, basePrice: act.basePrice, duration: act.duration,
            tags: act.tags ?? [], tagInput: '',
            images: act.image ? [act.image] : [''], isActive: act.isActive,
          });
        }
      }).catch(() => addToast('Failed to load activity', 'error'));
    }
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.destinationId) {
      addToast('Name and destination are required', 'error');
      return;
    }
    const actData = {
      name: form.name, description: form.description, destinationId: form.destinationId,
      priceType: form.priceType, basePrice: form.basePrice, duration: form.duration,
      tags: form.tags, image: form.images[0] || undefined, isActive: form.isActive,
    };
    setSaving(true);
    try {
      if (isEdit && id) {
        await adminApi.updateActivity(id, actData);
        addToast('Activity updated', 'success');
      } else {
        await adminApi.createActivity(actData);
        addToast('Activity created', 'success');
      }
      setTimeout(() => navigate('/admin/activities'), 1000);
    } catch {
      addToast('Save failed', 'error');
    } finally {
      setSaving(false);
    }
  }

  function addTag() {
    const tag = form.tagInput.trim();
    if (tag && !form.tags.includes(tag)) setForm(f => ({ ...f, tags: [...f.tags, tag], tagInput: '' }));
  }

  const inputCls = "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelCls = "block text-sm font-medium text-slate-700 mb-1.5";

  return (
    <div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <PageHeader title={isEdit ? 'Edit Activity' : 'New Activity'} />
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AdminCard>
            <div className="p-6 space-y-4">
              <div>
                <label className={labelCls}>Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Destination *</label>
                <select value={form.destinationId} onChange={e => setForm(f => ({ ...f, destinationId: e.target.value }))} className={inputCls}>
                  <option value="">Select destination...</option>
                  {(destinations as any[]).map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Price Type</label>
                <div className="flex gap-4">
                  {(['per_person', 'per_group'] as const).map(pt => (
                    <label key={pt} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="priceType" value={pt} checked={form.priceType === pt} onChange={() => setForm(f => ({ ...f, priceType: pt }))} />
                      <span className="text-sm text-slate-700">{pt === 'per_person' ? 'Per Person' : 'Per Group'}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Base Price (INR)</label>
                  <input type="number" value={form.basePrice} onChange={e => setForm(f => ({ ...f, basePrice: Number(e.target.value) }))} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Duration</label>
                  <input value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} className={inputCls} placeholder="2 hours" />
                </div>
              </div>
              <div>
                <label className={labelCls}>Tags</label>
                <div className="flex gap-2">
                  <input value={form.tagInput} onChange={e => setForm(f => ({ ...f, tagInput: e.target.value }))} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} className={inputCls + ' flex-1'} placeholder="adventure, scenic..." />
                  <button type="button" onClick={addTag} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm">Add</button>
                </div>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {form.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full">
                        {tag}
                        <button type="button" onClick={() => setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }))}><X size={10} /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </AdminCard>
          <AdminCard>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 text-sm">Images (up to 3)</h3>
                {form.images.length < 3 && (
                  <button type="button" onClick={() => setForm(f => ({ ...f, images: [...f.images, ''] }))} className="text-xs text-blue-600 flex items-center gap-1"><Plus size={12} /> Add</button>
                )}
              </div>
              {form.images.map((img, idx) => (
                <div key={idx} className="flex gap-2">
                  <input value={img} onChange={e => setForm(f => { const imgs = [...f.images]; imgs[idx] = e.target.value; return { ...f, images: imgs }; })} className={inputCls} placeholder="https://..." />
                  <button type="button" onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))} className="text-slate-400 hover:text-red-500"><X size={14} /></button>
                </div>
              ))}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} />
                  <span className="text-sm font-medium text-slate-700">Active</span>
                </label>
              </div>
            </div>
          </AdminCard>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <button type="button" onClick={() => navigate('/admin/activities')} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
          <button type="submit" disabled={saving} className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-lg">{isEdit ? 'Update Activity' : 'Create Activity'}</button>
        </div>
      </form>
    </div>
  );
}
