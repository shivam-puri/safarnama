import { useState } from 'react';
import { adminApi } from '../../../lib/api';
import { useAsync } from '../../../hooks/useAsync';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { ToastContainer } from '../../../components/admin/ui/Toast';
import { useToast } from '../../../components/admin/ui/useToast';

export function CmsPage() {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const { toasts, addToast, removeToast } = useToast();
  const [editContent, setEditContent] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const { data: result, refetch } = useAsync(() => adminApi.getAllCmsContent(), []);
  const contentList = result?.data ?? [];

  const activeKey = selectedKey ?? (contentList as any[])[0]?.key;

  function getContent(key: string) {
    if (editContent[key] !== undefined) return editContent[key];
    return (contentList as any[]).find((c: any) => c.key === key)?.content ?? '';
  }

  async function handleSave() {
    if (!activeKey) return;
    setSaving(true);
    try {
      await adminApi.updateCmsContent(activeKey, getContent(activeKey));
      addToast('Content saved', 'success');
      setEditContent(prev => { const next = { ...prev }; delete next[activeKey]; return next; });
      refetch();
    } catch {
      addToast('Save failed', 'error');
    } finally {
      setSaving(false);
    }
  }

  const activeItem = (contentList as any[]).find((c: any) => c.key === activeKey);

  return (
    <div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <PageHeader title="CMS Content" subtitle="Manage static content pages" />

      <div className="flex gap-6 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" style={{ minHeight: '500px' }}>
        <div className="w-56 border-r border-slate-200 flex-shrink-0">
          <div className="p-4 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Content Blocks</p>
          </div>
          <nav className="p-2 space-y-0.5">
            {(contentList as any[]).map((item: any) => (
              <button
                key={item.key}
                onClick={() => setSelectedKey(item.key)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeKey === item.key ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                {item.title}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 p-6">
          {activeItem ? (
            <div className="space-y-4 h-full flex flex-col">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">{activeItem.title}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Last updated: {new Date(activeItem.updatedAt).toLocaleString('en-IN')}
                  </p>
                </div>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-lg"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-700">
                Rich text editor coming soon — editing plain text/HTML for now.
              </div>
              <textarea
                value={getContent(activeKey)}
                onChange={e => setEditContent(prev => ({ ...prev, [activeKey]: e.target.value }))}
                className="flex-1 w-full border border-slate-300 rounded-lg px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                style={{ minHeight: '360px' }}
              />
            </div>
          ) : (
            <p className="text-slate-500 text-sm">Select a content block to edit.</p>
          )}
        </div>
      </div>
    </div>
  );
}
