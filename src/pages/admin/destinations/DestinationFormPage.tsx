import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X, Plus } from 'lucide-react';
import { adminApi } from '../../../lib/api';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { AdminCard } from '../../../components/admin/ui/AdminCard';
import { ToastContainer } from '../../../components/admin/ui/Toast';
import { useToast } from '../../../components/admin/ui/useToast';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

type ImageEntry = { url: string; alt: string; isPrimary: boolean };

const emptyForm = {
  name: '',
  slug: '',
  shortDescription: '',
  description: '',
  tags: [] as string[],
  tagInput: '',
  location: { state: '', country: 'India', coordinates: { lat: 0, lng: 0 } },
  images: [] as ImageEntry[],
  seoTitle: '',
  seoDescription: '',
  isActive: true,
  startingPrice: 0,
};

export function DestinationFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      adminApi.getDestination(id).then(dest => {
        if (dest) {
          setForm({
            name: dest.name,
            slug: dest.slug,
            shortDescription: dest.shortDescription,
            description: dest.description,
            tags: dest.tags ?? [],
            tagInput: '',
            location: { state: dest.location?.state ?? '', country: dest.location?.country ?? 'India', coordinates: dest.location?.coordinates ?? { lat: 0, lng: 0 } },
            images: (dest.images ?? []).map((img: any) => ({ url: img.url, alt: img.alt, isPrimary: img.isPrimary ?? false })),
            seoTitle: '',
            seoDescription: '',
            isActive: dest.isActive !== false,
            startingPrice: dest.startingPrice ?? 0,
          });
        }
      }).catch(() => addToast('Failed to load destination', 'error'));
    }
  }, [id]);

  function handleNameChange(name: string) {
    setForm(f => ({ ...f, name, slug: slugify(name) }));
  }

  function addTag() {
    const tag = form.tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm(f => ({ ...f, tags: [...f.tags, tag], tagInput: '' }));
    }
  }

  function removeTag(tag: string) {
    setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));
  }

  function addImage() {
    setForm(f => ({ ...f, images: [...f.images, { url: '', alt: '', isPrimary: f.images.length === 0 }] }));
  }

  function updateImage(idx: number, field: keyof ImageEntry, value: string | boolean) {
    setForm(f => {
      const imgs = [...f.images];
      imgs[idx] = { ...imgs[idx], [field]: value };
      if (field === 'isPrimary' && value === true) {
        imgs.forEach((_img, i) => { if (i !== idx) imgs[i] = { ...imgs[i], isPrimary: false }; });
      }
      return { ...f, images: imgs };
    });
  }

  function removeImage(idx: number) {
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.slug.trim()) {
      addToast('Name and slug are required', 'error');
      return;
    }
    const destData = {
      name: form.name,
      slug: form.slug,
      shortDescription: form.shortDescription,
      description: form.description,
      tags: form.tags,
      location: form.location,
      images: form.images.filter(img => img.url),
      isActive: form.isActive,
      startingPrice: form.startingPrice,
    };
    setLoading(true);
    try {
      if (isEdit && id) {
        await adminApi.updateDestination(id, destData);
        addToast('Destination updated successfully', 'success');
      } else {
        await adminApi.createDestination(destData);
        addToast('Destination created successfully', 'success');
      }
      setTimeout(() => navigate('/admin/destinations'), 1000);
    } catch {
      addToast('Save failed', 'error');
    } finally {
      setLoading(false);
    }
  }

  const inputCls = "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelCls = "block text-sm font-medium text-slate-700 mb-1.5";

  return (
    <div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <PageHeader title={isEdit ? 'Edit Destination' : 'New Destination'} />

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-5">
            <AdminCard>
              <div className="p-6 space-y-4">
                <h3 className="font-semibold text-slate-900 text-sm">Basic Information</h3>
                <div>
                  <label className={labelCls}>Name *</label>
                  <input value={form.name} onChange={e => handleNameChange(e.target.value)} className={inputCls} placeholder="Kashmir" />
                </div>
                <div>
                  <label className={labelCls}>Slug *</label>
                  <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className={inputCls} placeholder="kashmir" />
                  <p className="text-xs text-slate-400 mt-1">Preview: yourdomain.com/destinations/{form.slug || 'slug'}</p>
                </div>
                <div>
                  <label className={labelCls}>Short Description <span className="text-slate-400">({form.shortDescription.length}/160)</span></label>
                  <textarea
                    value={form.shortDescription}
                    onChange={e => setForm(f => ({ ...f, shortDescription: e.target.value.slice(0, 160) }))}
                    rows={2}
                    className={inputCls}
                    placeholder="One-line destination teaser..."
                  />
                </div>
                <div>
                  <label className={labelCls}>Description</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Tags</label>
                  <div className="flex gap-2">
                    <input
                      value={form.tagInput}
                      onChange={e => setForm(f => ({ ...f, tagInput: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className={inputCls + ' flex-1'}
                      placeholder="mountains, adventure..."
                    />
                    <button type="button" onClick={addTag} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm">Add</button>
                  </div>
                  {form.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {form.tags.map(tag => (
                        <span key={tag} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full">
                          {tag}
                          <button type="button" onClick={() => removeTag(tag)}><X size={10} /></button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>State</label>
                    <input value={form.location.state} onChange={e => setForm(f => ({ ...f, location: { ...f.location, state: e.target.value } }))} className={inputCls} placeholder="Jammu & Kashmir" />
                  </div>
                  <div>
                    <label className={labelCls}>Country</label>
                    <input value={form.location.country} onChange={e => setForm(f => ({ ...f, location: { ...f.location, country: e.target.value } }))} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Starting Price (INR)</label>
                  <input type="number" value={form.startingPrice} onChange={e => setForm(f => ({ ...f, startingPrice: Number(e.target.value) }))} className={inputCls} />
                </div>
              </div>
            </AdminCard>
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            <AdminCard>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900 text-sm">Images (up to 5)</h3>
                  {form.images.length < 5 && (
                    <button type="button" onClick={addImage} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
                      <Plus size={12} /> Add Image
                    </button>
                  )}
                </div>
                {form.images.length === 0 && (
                  <p className="text-sm text-slate-400">No images added yet.</p>
                )}
                {form.images.map((img, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-600">Image {idx + 1}</span>
                      <button type="button" onClick={() => removeImage(idx)} className="text-slate-400 hover:text-red-500"><X size={14} /></button>
                    </div>
                    <input value={img.url} onChange={e => updateImage(idx, 'url', e.target.value)} className={inputCls} placeholder="https://..." />
                    <input value={img.alt} onChange={e => updateImage(idx, 'alt', e.target.value)} className={inputCls} placeholder="Alt text" />
                    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                      <input type="radio" name="primaryImg" checked={img.isPrimary} onChange={() => updateImage(idx, 'isPrimary', true)} />
                      Set as Primary
                    </label>
                    {img.url && <img src={img.url} alt={img.alt} className="w-full h-32 object-cover rounded-lg mt-1" onError={e => (e.currentTarget.style.display = 'none')} />}
                  </div>
                ))}
              </div>
            </AdminCard>

            <AdminCard>
              <div className="p-6 space-y-4">
                <h3 className="font-semibold text-slate-900 text-sm">SEO & Visibility</h3>
                <div>
                  <label className={labelCls}>SEO Title</label>
                  <input value={form.seoTitle} onChange={e => setForm(f => ({ ...f, seoTitle: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>SEO Description</label>
                  <textarea value={form.seoDescription} onChange={e => setForm(f => ({ ...f, seoDescription: e.target.value }))} rows={2} className={inputCls} />
                </div>
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="rounded" />
                    <span className="text-sm font-medium text-slate-700">Active (visible to customers)</span>
                  </label>
                </div>
              </div>
            </AdminCard>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 mt-6 justify-end">
          <button type="button" onClick={() => navigate('/admin/destinations')} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-lg">
            {loading ? 'Saving...' : isEdit ? 'Update Destination' : 'Create Destination'}
          </button>
        </div>
      </form>
    </div>
  );
}
