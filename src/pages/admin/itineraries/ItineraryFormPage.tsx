import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X, Plus, ChevronUp, ChevronDown } from 'lucide-react';
import { adminApi } from '../../../lib/api';
import { useAsync } from '../../../hooks/useAsync';
import { AdminCard } from '../../../components/admin/ui/AdminCard';
import { ToastContainer } from '../../../components/admin/ui/Toast';
import { useToast } from '../../../components/admin/ui/useToast';
import type { Itinerary, Day, ActivityRef } from '../../../types/itinerary.types';

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

type FormState = {
  title: string; destinationId: string; category: Itinerary['category']; durationDays: number; durationNights: number;
  shortDescription: string; description: string; highlights: string[]; inclusions: string[]; exclusions: string[];
  basePricePerPerson: number; minTravelers: number; maxTravelers: number;
  images: Array<{ url: string; alt: string; isPrimary: boolean }>;
  days: Day[];
  isCustomizable: boolean; allowHotelChange: boolean; allowTransportChange: boolean;
  allowActivityChange: boolean; allowRoomSharingChange: boolean; allowTravelerCountChange: boolean;
  defaultHotelCategoryId: string; defaultTransportOptionId: string; defaultRoomSharingType: string;
  availableHotelCategoryIds: string[]; availableTransportOptionIds: string[];
  seoTitle: string; seoDescription: string; isActive: boolean; isFeatured: boolean; sortOrder: number;
  slug: string;
};

const defaultForm: FormState = {
  title: '', destinationId: '', category: 'budget', durationDays: 3, durationNights: 2,
  shortDescription: '', description: '', highlights: [''], inclusions: [''], exclusions: [''],
  basePricePerPerson: 0, minTravelers: 2, maxTravelers: 10,
  images: [],
  days: [],
  isCustomizable: true, allowHotelChange: true, allowTransportChange: true,
  allowActivityChange: true, allowRoomSharingChange: true, allowTravelerCountChange: true,
  defaultHotelCategoryId: '', defaultTransportOptionId: '', defaultRoomSharingType: 'double',
  availableHotelCategoryIds: [], availableTransportOptionIds: [],
  seoTitle: '', seoDescription: '', isActive: true, isFeatured: false, sortOrder: 0,
  slug: '',
};

export function ItineraryFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();
  const isEdit = Boolean(id);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [saving, setSaving] = useState(false);

  const { data: destResult } = useAsync(() => adminApi.getDestinations(), []);
  const { data: hotelResult } = useAsync(() => adminApi.getHotelCategories(), []);
  const { data: transportResult } = useAsync(() => adminApi.getTransportOptions(), []);
  const { data: actResult } = useAsync(() => adminApi.getActivities(), []);

  const destinations = destResult?.data ?? [];
  const hotelCategories = hotelResult?.data ?? [];
  const transportOptions = transportResult?.data ?? [];
  const activities = actResult?.data ?? [];

  useEffect(() => {
    if (id) {
      adminApi.getItinerary(id).then((result: any) => {
        const itn = result?.data ?? result;
        if (itn) {
          // Normalize populated references: backend may return full objects instead of ID strings
          const destId = itn.destinationId?._id ?? itn.destinationId?.id ?? itn.destinationId;
          const normalizedDays = (itn.days ?? []).map((day: any) => ({
            ...day,
            activities: (day.activities ?? []).map((act: any) => ({
              ...act,
              activityId: act.activityId?._id ?? act.activityId?.id ?? act.activityId,
            })),
          }));
          setForm({
            title: itn.title, destinationId: destId, category: itn.category,
            durationDays: itn.duration?.days, durationNights: itn.duration?.nights,
            shortDescription: itn.shortDescription ?? '', description: itn.description ?? '',
            highlights: itn.highlights?.length ? itn.highlights : [''],
            inclusions: itn.inclusions?.length ? itn.inclusions : [''],
            exclusions: itn.exclusions?.length ? itn.exclusions : [''],
            basePricePerPerson: itn.basePricePerPerson, minTravelers: itn.minTravelers, maxTravelers: itn.maxTravelers,
            images: (itn.images ?? []).map((img: any) => ({ url: img.url, alt: img.alt, isPrimary: img.isPrimary ?? false })),
            days: normalizedDays,
            isCustomizable: itn.customizationConfig?.isCustomizable ?? true,
            allowHotelChange: itn.customizationConfig?.allowHotelChange ?? true,
            allowTransportChange: itn.customizationConfig?.allowTransportChange ?? true,
            allowActivityChange: itn.customizationConfig?.allowActivityChange ?? true,
            allowRoomSharingChange: itn.customizationConfig?.allowRoomSharingChange ?? true,
            allowTravelerCountChange: itn.customizationConfig?.allowTravelerCountChange ?? true,
            defaultHotelCategoryId: itn.customizationConfig?.defaultHotelCategoryId?._id ?? itn.customizationConfig?.defaultHotelCategoryId ?? '',
            defaultTransportOptionId: itn.customizationConfig?.defaultTransportOptionId?._id ?? itn.customizationConfig?.defaultTransportOptionId ?? '',
            defaultRoomSharingType: itn.customizationConfig?.defaultRoomSharingType ?? 'double',
            availableHotelCategoryIds: (itn.customizationConfig?.availableHotelCategoryIds ?? []).map((x: any) => x?._id ?? x?.id ?? x),
            availableTransportOptionIds: (itn.customizationConfig?.availableTransportOptionIds ?? []).map((x: any) => x?._id ?? x?.id ?? x),
            seoTitle: '', seoDescription: '', isActive: itn.isActive, isFeatured: itn.isFeatured, sortOrder: 0,
            slug: itn.slug,
          });
        }
      }).catch(() => addToast('Failed to load itinerary', 'error'));
    }
  }, [id]);

  useEffect(() => {
    setForm(f => {
      const days = [...f.days];
      while (days.length < f.durationDays) {
        days.push({ dayNumber: days.length + 1, title: `Day ${days.length + 1}`, description: '', activities: [] });
      }
      return { ...f, days: days.slice(0, f.durationDays) };
    });
  }, [form.durationDays]);

  const inputCls = "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelCls = "block text-sm font-medium text-slate-700 mb-1.5";

  function listField(arr: string[], idx: number, val: string, setter: (v: string[]) => void) {
    const next = [...arr]; next[idx] = val; setter(next);
  }
  function addListItem(arr: string[], setter: (v: string[]) => void) { setter([...arr, '']); }
  function removeListItem(arr: string[], idx: number, setter: (v: string[]) => void) { setter(arr.filter((_, i) => i !== idx)); }

  function moveDayUp(idx: number) {
    if (idx === 0) return;
    setForm(f => {
      const days = [...f.days];
      [days[idx - 1], days[idx]] = [days[idx], days[idx - 1]];
      days.forEach((d, i) => { d.dayNumber = i + 1; });
      return { ...f, days };
    });
  }

  function moveDayDown(idx: number) {
    setForm(f => {
      if (idx >= f.days.length - 1) return f;
      const days = [...f.days];
      [days[idx], days[idx + 1]] = [days[idx + 1], days[idx]];
      days.forEach((d, i) => { d.dayNumber = i + 1; });
      return { ...f, days };
    });
  }

  function addActivityToDay(dayIdx: number, activityId: string) {
    setForm(f => {
      const days = [...f.days];
      const ref: ActivityRef = { activityId, isMandatory: false, isIncluded: true };
      days[dayIdx] = { ...days[dayIdx], activities: [...days[dayIdx].activities, ref] };
      return { ...f, days };
    });
  }

  function removeActivityFromDay(dayIdx: number, actIdx: number) {
    setForm(f => {
      const days = [...f.days];
      days[dayIdx] = { ...days[dayIdx], activities: days[dayIdx].activities.filter((_, i) => i !== actIdx) };
      return { ...f, days };
    });
  }

  function updateActivityRef(dayIdx: number, actIdx: number, field: keyof ActivityRef, value: boolean | number | string) {
    setForm(f => {
      const days = [...f.days];
      const acts = [...days[dayIdx].activities];
      acts[actIdx] = { ...acts[actIdx], [field]: value };
      days[dayIdx] = { ...days[dayIdx], activities: acts };
      return { ...f, days };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.destinationId) {
      addToast('Title and destination are required', 'error');
      return;
    }

    const dest = destinations.find((d: any) => d.id === form.destinationId);
    const itnData = {
      destinationId: form.destinationId,
      destinationSlug: (dest as any)?.slug ?? '',
      title: form.title,
      slug: form.slug || slugify(form.title + '-' + form.durationDays + 'd' + form.durationNights + 'n'),
      shortDescription: form.shortDescription,
      description: form.description,
      duration: { days: form.durationDays, nights: form.durationNights },
      images: form.images.filter(img => img.url),
      category: form.category,
      minTravelers: form.minTravelers,
      maxTravelers: form.maxTravelers,
      basePricePerPerson: form.basePricePerPerson,
      days: form.days,
      customizationConfig: {
        isCustomizable: form.isCustomizable,
        allowHotelChange: form.allowHotelChange,
        allowTransportChange: form.allowTransportChange,
        allowActivityChange: form.allowActivityChange,
        allowRoomSharingChange: form.allowRoomSharingChange,
        allowTravelerCountChange: form.allowTravelerCountChange,
        defaultHotelCategoryId: form.defaultHotelCategoryId,
        defaultTransportOptionId: form.defaultTransportOptionId,
        defaultRoomSharingType: form.defaultRoomSharingType,
        availableHotelCategoryIds: form.availableHotelCategoryIds,
        availableTransportOptionIds: form.availableTransportOptionIds,
      },
      inclusions: form.inclusions.filter(Boolean),
      exclusions: form.exclusions.filter(Boolean),
      highlights: form.highlights.filter(Boolean),
      isActive: form.isActive,
      isFeatured: form.isFeatured,
    };

    setSaving(true);
    try {
      if (isEdit && id) {
        await adminApi.updateItinerary(id, itnData);
        addToast('Itinerary updated', 'success');
      } else {
        await adminApi.createItinerary(itnData);
        addToast('Itinerary created', 'success');
      }
      setTimeout(() => navigate('/admin/itineraries'), 1000);
    } catch {
      addToast('Save failed', 'error');
    } finally {
      setSaving(false);
    }
  }

  const steps = ['Basic Info', 'Day Planner', 'Pricing', 'Customization', 'SEO & Visibility'];
  const destActivities = (activities as any[]).filter((a: any) => a.destinationId === form.destinationId);

  return (
    <div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{isEdit ? 'Edit Itinerary' : 'New Itinerary'}</h1>
      </div>

      <div className="flex items-center gap-0 mb-6 bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center flex-1">
            <button
              type="button"
              onClick={() => setStep(i + 1)}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${step === i + 1 ? 'text-blue-600' : step > i + 1 ? 'text-green-600' : 'text-slate-400'}`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${step === i + 1 ? 'bg-blue-600 text-white' : step > i + 1 ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'}`}>{i + 1}</span>
              <span className="hidden sm:block">{s}</span>
            </button>
            {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${step > i + 1 ? 'bg-green-300' : 'bg-slate-200'}`} />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AdminCard>
              <div className="p-6 space-y-4">
                <h3 className="font-semibold text-slate-900 text-sm">Basic Information</h3>
                <div>
                  <label className={labelCls}>Title *</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: slugify(e.target.value + '-' + f.durationDays + 'd' + f.durationNights + 'n') }))} className={inputCls} placeholder="Budget Kashmir 4D/3N" />
                </div>
                <div>
                  <label className={labelCls}>Destination *</label>
                  <select value={form.destinationId} onChange={e => setForm(f => ({ ...f, destinationId: e.target.value }))} className={inputCls}>
                    <option value="">Select destination...</option>
                    {(destinations as any[]).map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as Itinerary['category'] }))} className={inputCls}>
                    {['budget', 'family', 'luxury', 'adventure', 'honeymoon'].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Days</label>
                    <input type="number" min={1} value={form.durationDays} onChange={e => setForm(f => ({ ...f, durationDays: Number(e.target.value) }))} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Nights</label>
                    <input type="number" min={0} value={form.durationNights} onChange={e => setForm(f => ({ ...f, durationNights: Number(e.target.value) }))} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Short Description</label>
                  <textarea value={form.shortDescription} onChange={e => setForm(f => ({ ...f, shortDescription: e.target.value }))} rows={2} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Description</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} className={inputCls} />
                </div>
              </div>
            </AdminCard>
            <div className="space-y-5">
              <AdminCard>
                <div className="p-6 space-y-3">
                  <h3 className="font-semibold text-slate-900 text-sm">Highlights</h3>
                  {form.highlights.map((h, i) => (
                    <div key={i} className="flex gap-2">
                      <input value={h} onChange={e => listField(form.highlights, i, e.target.value, v => setForm(f => ({ ...f, highlights: v })))} className={inputCls} placeholder={`Highlight ${i + 1}`} />
                      <button type="button" onClick={() => removeListItem(form.highlights, i, v => setForm(f => ({ ...f, highlights: v })))} className="text-slate-400 hover:text-red-500"><X size={14} /></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addListItem(form.highlights, v => setForm(f => ({ ...f, highlights: v })))} className="text-xs text-blue-600 flex items-center gap-1"><Plus size={12} /> Add Highlight</button>
                </div>
              </AdminCard>
              <AdminCard>
                <div className="p-6 space-y-3">
                  <h3 className="font-semibold text-slate-900 text-sm">Inclusions</h3>
                  {form.inclusions.map((h, i) => (
                    <div key={i} className="flex gap-2">
                      <input value={h} onChange={e => listField(form.inclusions, i, e.target.value, v => setForm(f => ({ ...f, inclusions: v })))} className={inputCls} placeholder="Accommodation..." />
                      <button type="button" onClick={() => removeListItem(form.inclusions, i, v => setForm(f => ({ ...f, inclusions: v })))} className="text-slate-400 hover:text-red-500"><X size={14} /></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addListItem(form.inclusions, v => setForm(f => ({ ...f, inclusions: v })))} className="text-xs text-blue-600 flex items-center gap-1"><Plus size={12} /> Add Inclusion</button>
                </div>
              </AdminCard>
              <AdminCard>
                <div className="p-6 space-y-3">
                  <h3 className="font-semibold text-slate-900 text-sm">Exclusions</h3>
                  {form.exclusions.map((h, i) => (
                    <div key={i} className="flex gap-2">
                      <input value={h} onChange={e => listField(form.exclusions, i, e.target.value, v => setForm(f => ({ ...f, exclusions: v })))} className={inputCls} placeholder="Airfare..." />
                      <button type="button" onClick={() => removeListItem(form.exclusions, i, v => setForm(f => ({ ...f, exclusions: v })))} className="text-slate-400 hover:text-red-500"><X size={14} /></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addListItem(form.exclusions, v => setForm(f => ({ ...f, exclusions: v })))} className="text-xs text-blue-600 flex items-center gap-1"><Plus size={12} /> Add Exclusion</button>
                </div>
              </AdminCard>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            {form.days.map((day, dayIdx) => (
              <AdminCard key={dayIdx}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900">Day {day.dayNumber}</h3>
                    <div className="flex gap-1">
                      <button type="button" onClick={() => moveDayUp(dayIdx)} className="p-1 text-slate-400 hover:text-slate-700"><ChevronUp size={16} /></button>
                      <button type="button" onClick={() => moveDayDown(dayIdx)} className="p-1 text-slate-400 hover:text-slate-700"><ChevronDown size={16} /></button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className={labelCls}>Day Title</label>
                      <input value={day.title} onChange={e => setForm(f => { const days = [...f.days]; days[dayIdx] = { ...days[dayIdx], title: e.target.value }; return { ...f, days }; })} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Description</label>
                      <textarea value={day.description} onChange={e => setForm(f => { const days = [...f.days]; days[dayIdx] = { ...days[dayIdx], description: e.target.value }; return { ...f, days }; })} rows={3} className={inputCls} />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className={labelCls + ' mb-0'}>Activities</label>
                        <select
                          onChange={e => { if (e.target.value) { addActivityToDay(dayIdx, e.target.value); e.target.value = ''; } }}
                          className="text-xs border border-slate-300 rounded-lg px-2 py-1 focus:outline-none"
                        >
                          <option value="">+ Add activity</option>
                          {destActivities.map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                      </div>
                      {day.activities.length > 0 && (
                        <table className="w-full text-xs border border-slate-200 rounded-lg overflow-hidden">
                          <thead className="bg-slate-50">
                            <tr>
                              <th className="px-3 py-2 text-left text-slate-500">Activity</th>
                              <th className="px-3 py-2 text-center text-slate-500">Mandatory</th>
                              <th className="px-3 py-2 text-center text-slate-500">Included</th>
                              <th className="px-3 py-2 text-right text-slate-500">Custom Price</th>
                              <th className="px-3 py-2"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {day.activities.map((act, actIdx) => {
                              const actData = (activities as any[]).find((a: any) => a.id === act.activityId);
                              return (
                                <tr key={actIdx}>
                                  <td className="px-3 py-2 text-slate-700">{actData?.name ?? act.activityId}</td>
                                  <td className="px-3 py-2 text-center">
                                    <input type="checkbox" checked={act.isMandatory} onChange={e => updateActivityRef(dayIdx, actIdx, 'isMandatory', e.target.checked)} />
                                  </td>
                                  <td className="px-3 py-2 text-center">
                                    <input type="checkbox" checked={act.isIncluded} onChange={e => updateActivityRef(dayIdx, actIdx, 'isIncluded', e.target.checked)} />
                                  </td>
                                  <td className="px-3 py-2 text-right">
                                    <input type="number" value={act.customPrice ?? ''} onChange={e => updateActivityRef(dayIdx, actIdx, 'customPrice', e.target.value ? Number(e.target.value) : 0)} className="w-20 border border-slate-200 rounded px-2 py-0.5 text-right" placeholder="default" />
                                  </td>
                                  <td className="px-3 py-2">
                                    <button type="button" onClick={() => removeActivityFromDay(dayIdx, actIdx)} className="text-red-400 hover:text-red-600"><X size={12} /></button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              </AdminCard>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AdminCard>
              <div className="p-6 space-y-4">
                <h3 className="font-semibold text-slate-900 text-sm">Pricing</h3>
                <div>
                  <label className={labelCls}>Base Price Per Person (INR)</label>
                  <input type="number" value={form.basePricePerPerson} onChange={e => setForm(f => ({ ...f, basePricePerPerson: Number(e.target.value) }))} className={inputCls} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Min Travelers</label>
                    <input type="number" min={1} value={form.minTravelers} onChange={e => setForm(f => ({ ...f, minTravelers: Number(e.target.value) }))} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Max Travelers</label>
                    <input type="number" min={1} value={form.maxTravelers} onChange={e => setForm(f => ({ ...f, maxTravelers: Number(e.target.value) }))} className={inputCls} />
                  </div>
                </div>
              </div>
            </AdminCard>
            <AdminCard>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900 text-sm">Images</h3>
                  {form.images.length < 5 && (
                    <button type="button" onClick={() => setForm(f => ({ ...f, images: [...f.images, { url: '', alt: '', isPrimary: f.images.length === 0 }] }))} className="text-xs text-blue-600 flex items-center gap-1"><Plus size={12} /> Add</button>
                  )}
                </div>
                {form.images.map((img, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">Image {idx + 1}</span>
                      <button type="button" onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))} className="text-slate-400 hover:text-red-500"><X size={12} /></button>
                    </div>
                    <input value={img.url} onChange={e => setForm(f => { const imgs = [...f.images]; imgs[idx] = { ...imgs[idx], url: e.target.value }; return { ...f, images: imgs }; })} className={inputCls} placeholder="https://..." />
                    <input value={img.alt} onChange={e => setForm(f => { const imgs = [...f.images]; imgs[idx] = { ...imgs[idx], alt: e.target.value }; return { ...f, images: imgs }; })} className={inputCls} placeholder="Alt text" />
                  </div>
                ))}
              </div>
            </AdminCard>
          </div>
        )}

        {step === 4 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AdminCard>
              <div className="p-6 space-y-3">
                <h3 className="font-semibold text-slate-900 text-sm">Customization Toggles</h3>
                {([
                  ['isCustomizable', 'Is Customizable'],
                  ['allowHotelChange', 'Allow Hotel Change'],
                  ['allowTransportChange', 'Allow Transport Change'],
                  ['allowActivityChange', 'Allow Activity Change'],
                  ['allowRoomSharingChange', 'Allow Room Sharing Change'],
                  ['allowTravelerCountChange', 'Allow Traveler Count Change'],
                ] as [keyof FormState, string][]).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={form[key] as boolean} onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))} className="rounded" />
                    <span className="text-sm text-slate-700">{label}</span>
                  </label>
                ))}
              </div>
            </AdminCard>
            {form.isCustomizable && (
              <AdminCard>
                <div className="p-6 space-y-4">
                  <h3 className="font-semibold text-slate-900 text-sm">Default Options</h3>
                  <div>
                    <label className={labelCls}>Default Hotel Category</label>
                    <select value={form.defaultHotelCategoryId} onChange={e => setForm(f => ({ ...f, defaultHotelCategoryId: e.target.value }))} className={inputCls}>
                      <option value="">None</option>
                      {(hotelCategories as any[]).map((hc: any) => <option key={hc.id} value={hc.id}>{hc.displayLabel}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Default Transport</label>
                    <select value={form.defaultTransportOptionId} onChange={e => setForm(f => ({ ...f, defaultTransportOptionId: e.target.value }))} className={inputCls}>
                      <option value="">None</option>
                      {(transportOptions as any[]).map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Default Room Sharing</label>
                    <select value={form.defaultRoomSharingType} onChange={e => setForm(f => ({ ...f, defaultRoomSharingType: e.target.value }))} className={inputCls}>
                      <option value="single">Single</option>
                      <option value="double">Double</option>
                      <option value="triple">Triple</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Available Hotel Categories</label>
                    <div className="space-y-1.5">
                      {(hotelCategories as any[]).map((hc: any) => (
                        <label key={hc.id} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox"
                            checked={form.availableHotelCategoryIds.includes(hc.id)}
                            onChange={e => setForm(f => ({
                              ...f,
                              availableHotelCategoryIds: e.target.checked
                                ? [...f.availableHotelCategoryIds, hc.id]
                                : f.availableHotelCategoryIds.filter(x => x !== hc.id)
                            }))}
                          />
                          <span className="text-sm text-slate-700">{hc.displayLabel}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Available Transport Options</label>
                    <div className="space-y-1.5">
                      {(transportOptions as any[]).map((t: any) => (
                        <label key={t.id} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox"
                            checked={form.availableTransportOptionIds.includes(t.id)}
                            onChange={e => setForm(f => ({
                              ...f,
                              availableTransportOptionIds: e.target.checked
                                ? [...f.availableTransportOptionIds, t.id]
                                : f.availableTransportOptionIds.filter(x => x !== t.id)
                            }))}
                          />
                          <span className="text-sm text-slate-700">{t.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </AdminCard>
            )}
          </div>
        )}

        {step === 5 && (
          <div className="max-w-2xl space-y-5">
            <AdminCard>
              <div className="p-6 space-y-4">
                <h3 className="font-semibold text-slate-900 text-sm">SEO</h3>
                <div>
                  <label className={labelCls}>SEO Title</label>
                  <input value={form.seoTitle} onChange={e => setForm(f => ({ ...f, seoTitle: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>SEO Description</label>
                  <textarea value={form.seoDescription} onChange={e => setForm(f => ({ ...f, seoDescription: e.target.value }))} rows={2} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Slug</label>
                  <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Sort Order</label>
                  <input type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))} className={inputCls} />
                </div>
              </div>
            </AdminCard>
            <AdminCard>
              <div className="p-6 space-y-3">
                <h3 className="font-semibold text-slate-900 text-sm">Visibility</h3>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="rounded" />
                  <span className="text-sm text-slate-700">Active (visible to customers)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} className="rounded" />
                  <span className="text-sm text-slate-700">Featured on homepage</span>
                </label>
              </div>
            </AdminCard>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <div>
            {step > 1 && (
              <button type="button" onClick={() => setStep(s => s - 1)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">
                ← Previous
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => navigate('/admin/itineraries')} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">
              Cancel
            </button>
            {step < 5 ? (
              <button type="button" onClick={() => setStep(s => s + 1)} className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
                Next →
              </button>
            ) : (
              <button type="submit" disabled={saving} className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-lg">
                {saving ? 'Saving...' : isEdit ? 'Update Itinerary' : 'Create Itinerary'}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
