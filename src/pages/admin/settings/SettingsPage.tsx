import { useState } from 'react';
import { adminApi } from '../../../lib/api';
import { useAsync } from '../../../hooks/useAsync';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { AdminCard } from '../../../components/admin/ui/AdminCard';
import { ToastContainer } from '../../../components/admin/ui/Toast';
import { useToast } from '../../../components/admin/ui/useToast';

function SettingsSkeleton() {
  return (
    <div className="space-y-5 max-w-2xl animate-pulse">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="h-4 bg-slate-200 rounded w-24" />
          <div className="h-9 bg-slate-100 rounded-lg" />
          <div className="h-9 bg-slate-100 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function SettingsPage() {
  const { toasts, addToast, removeToast } = useToast();
  const [edits, setEdits] = useState<Record<string, string | number>>({});
  const [saving, setSaving] = useState(false);

  const { data: result, loading, refetch } = useAsync(() => adminApi.getSettings(), []);
  const settings = result?.data ?? [];

  const getValue = (key: string) => {
    if (edits[key] !== undefined) return edits[key];
    const s = (settings as any[]).find((s: any) => s.key === key);
    return s?.value ?? '';
  };

  function handleChange(key: string, value: string | number) {
    setEdits(prev => ({ ...prev, [key]: value }));
  }

  async function handleSaveAll() {
    setSaving(true);
    try {
      await Promise.all(Object.entries(edits).map(([key, value]) => adminApi.updateSetting(key, value)));
      setEdits({});
      addToast('Settings saved', 'success');
      refetch();
    } catch {
      addToast('Save failed', 'error');
    } finally {
      setSaving(false);
    }
  }

  const byCategory = (cat: string) => (settings as any[]).filter((s: any) => s.category === cat);

  const inputCls = "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelCls = "block text-sm font-medium text-slate-700 mb-1.5";

  return (
    <div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <PageHeader title="Site Settings" subtitle="Manage global configuration" />

      {loading ? <SettingsSkeleton /> : (
      <div className="space-y-5 max-w-2xl">
        <AdminCard title="General">
          <div className="p-6 space-y-4">
            {byCategory('general').map((s: any) => (
              <div key={s.key}>
                <label className={labelCls}>{s.label}</label>
                <input
                  value={String(getValue(s.key))}
                  onChange={e => handleChange(s.key, e.target.value)}
                  className={inputCls}
                />
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard title="Contact">
          <div className="p-6 space-y-4">
            {byCategory('contact').map((s: any) => (
              <div key={s.key}>
                <label className={labelCls}>{s.label}</label>
                {s.key === 'contact_address' ? (
                  <textarea
                    value={String(getValue(s.key))}
                    onChange={e => handleChange(s.key, e.target.value)}
                    rows={2}
                    className={inputCls}
                  />
                ) : (
                  <input
                    value={String(getValue(s.key))}
                    onChange={e => handleChange(s.key, e.target.value)}
                    className={inputCls}
                  />
                )}
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard title="Social Media">
          <div className="p-6 space-y-4">
            {byCategory('social').map((s: any) => (
              <div key={s.key}>
                <label className={labelCls}>{s.label}</label>
                <input
                  value={String(getValue(s.key))}
                  onChange={e => handleChange(s.key, e.target.value)}
                  className={inputCls}
                  placeholder="https://..."
                />
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard title="Financial">
          <div className="p-6 space-y-4">
            {byCategory('financial').map((s: any) => (
              <div key={s.key}>
                <label className={labelCls}>{s.label}</label>
                <input
                  type={typeof s.value === 'number' ? 'number' : 'text'}
                  value={String(getValue(s.key))}
                  onChange={e => handleChange(s.key, typeof s.value === 'number' ? Number(e.target.value) : e.target.value)}
                  className={inputCls}
                />
              </div>
            ))}
          </div>
        </AdminCard>

        <div className="flex justify-end">
          <button onClick={handleSaveAll} disabled={saving} className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-lg">
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </div>
      )}
    </div>
  );
}
