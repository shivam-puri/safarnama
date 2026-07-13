import { useState } from 'react';
import { ChevronDown, MapPin, Zap, Clock, CheckCircle2, PlusCircle, Tag } from 'lucide-react';
import type { Day, ActivityRef, Activity } from '../../types/itinerary.types';
import { useSiteSettingsStore } from '../../store/siteSettingsStore';
import { formatIndianCurrency } from '../../lib/pricing-engine';

interface DayWisePlanProps {
  days: Day[];
  activities: Activity[];
}

// activityId comes back populated with the full Activity object from the API;
// fall back to looking it up in the pool for the rare unpopulated/id-only case.
function resolveActivity(ref: ActivityRef, pool: Activity[]): Activity | undefined {
  const raw = ref.activityId;
  if (raw && typeof raw === 'object') {
    return { ...raw, id: raw.id ?? (raw as any)._id };
  }
  return pool.find(a => a.id === raw);
}

function statusMeta(item: ActivityRef) {
  if (item.isMandatory) return { label: 'Mandatory', color: '#C44D27', bg: '#FDEAE3', Icon: Zap };
  if (item.isIncluded) return { label: 'Included', color: '#3D8B60', bg: '#E4F4EC', Icon: CheckCircle2 };
  return { label: 'Optional add-on', color: '#A06020', bg: '#FEF3E8', Icon: PlusCircle };
}

export function DayWisePlan({ days, activities }: DayWisePlanProps) {
  const showPrices = useSiteSettingsStore(s => s.showPrices);
  const [openDays, setOpenDays] = useState<Set<number>>(new Set([1]));

  const toggleDay = (dayNumber: number) => {
    setOpenDays(prev => {
      const next = new Set(prev);
      if (next.has(dayNumber)) { next.delete(dayNumber); } else { next.add(dayNumber); }
      return next;
    });
  };

  return (
    <div className="space-y-3">
      {days.map(day => {
        const isOpen = openDays.has(day.dayNumber);
        const dayActivities = day.activities
          .map(ref => ({ ...ref, activity: resolveActivity(ref, activities) }))
          .filter(item => item.activity);

        return (
          <div key={day.dayNumber} className="overflow-hidden rounded-2xl" style={{ border: '1.5px solid #E8D5C4' }}>
            <button
              onClick={() => toggleDay(day.dayNumber)}
              className="w-full flex items-center justify-between p-4 text-left transition-colors"
              style={{ backgroundColor: isOpen ? '#FFF5EC' : 'transparent' }}
              onMouseEnter={e => { if (!isOpen) (e.currentTarget as HTMLElement).style.backgroundColor = '#FFF5EC'; }}
              onMouseLeave={e => { if (!isOpen) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#5B7FA6' }}>
                  {day.dayNumber}
                </span>
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#3D2C2C' }}>{day.title}</p>
                  {dayActivities.length > 0 && (
                    <p className="text-xs mt-0.5" style={{ color: '#B5A090' }}>{dayActivities.length} activit{dayActivities.length > 1 ? 'ies' : 'y'}</p>
                  )}
                </div>
              </div>
              <ChevronDown
                size={18}
                className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                style={{ color: '#B5A090' }}
              />
            </button>

            {isOpen && (
              <div className="px-4 pb-4" style={{ borderTop: '1.5px solid #E8D5C4' }}>
                {day.description && (
                  <p className="text-sm leading-relaxed mt-3 mb-4 flex items-start gap-2 whitespace-pre-line" style={{ color: '#5C4A3A' }}>
                    <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: '#E8643C' }} />
                    {day.description}
                  </p>
                )}
                {dayActivities.length > 0 && (
                  <div className="space-y-3">
                    {dayActivities.map(item => {
                      const activity = item.activity!;
                      const meta = statusMeta(item);
                      const price = item.customPrice ?? activity.basePrice;
                      const showPrice = showPrices && !item.isIncluded && price > 0;
                      return (
                        <div
                          key={typeof item.activityId === 'string' ? item.activityId : activity.id}
                          className="p-3.5 rounded-xl"
                          style={{ backgroundColor: '#FFF5EC', border: '1px solid #F0E4D7' }}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2.5 min-w-0">
                              <meta.Icon size={16} className="mt-0.5 shrink-0" style={{ color: meta.color }} />
                              <div className="min-w-0">
                                <p className="text-sm font-semibold" style={{ color: '#3D2C2C' }}>{activity.name}</p>
                                {activity.description && (
                                  <p className="text-xs mt-1 leading-relaxed whitespace-pre-line" style={{ color: '#8A7060' }}>
                                    {activity.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            <span
                              className="text-[10px] font-semibold px-2 py-1 rounded-full shrink-0 whitespace-nowrap"
                              style={{ color: meta.color, backgroundColor: meta.bg }}
                            >
                              {meta.label}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 flex-wrap mt-2.5 text-xs" style={{ color: '#A08070' }}>
                            {activity.duration && (
                              <span className="flex items-center gap-1"><Clock size={12} /> {activity.duration}</span>
                            )}
                            {showPrice && (
                              <span className="font-semibold" style={{ color: '#5B7FA6' }}>
                                + {formatIndianCurrency(price)}{activity.priceType === 'per_person' ? '/person' : ' /group'}
                              </span>
                            )}
                            {activity.tags?.length ? (
                              <span className="flex items-center gap-1.5 flex-wrap">
                                <Tag size={11} />
                                {activity.tags.map(tag => (
                                  <span key={tag} className="px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#F0E4D7', color: '#8A7060' }}>
                                    {tag}
                                  </span>
                                ))}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
