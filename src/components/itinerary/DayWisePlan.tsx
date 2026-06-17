import { useState } from 'react';
import { ChevronDown, MapPin, Zap } from 'lucide-react';
import type { Day } from '../../types/itinerary.types';
import type { Activity } from '../../types/itinerary.types';

interface DayWisePlanProps {
  days: Day[];
  activities: Activity[];
}

export function DayWisePlan({ days, activities }: DayWisePlanProps) {
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
        const dayActivities = day.activities.map(ref => ({
          ...ref,
          activity: activities.find(a => a.id === ref.activityId),
        })).filter(item => item.activity);

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
                <p className="text-sm leading-relaxed mt-3 mb-3 flex items-start gap-2" style={{ color: '#5C4A3A' }}>
                  <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: '#E8643C' }} />
                  {day.description}
                </p>
                {dayActivities.length > 0 && (
                  <div className="space-y-2">
                    {dayActivities.map(item => (
                      <div key={item.activityId} className="flex items-start gap-2 p-2.5 rounded-xl" style={{ backgroundColor: '#FFF5EC' }}>
                        <Zap size={14} className="mt-0.5 shrink-0" style={{ color: item.isIncluded ? '#6BAE8E' : '#F4A261' }} />
                        <div>
                          <p className="text-sm font-medium" style={{ color: '#3D2C2C' }}>{item.activity!.name}</p>
                          <p className="text-xs mt-0.5" style={{ color: '#A08070' }}>
                            {item.isMandatory ? 'Mandatory' : item.isIncluded ? 'Included' : 'Optional add-on'} · {item.activity!.duration}
                          </p>
                        </div>
                      </div>
                    ))}
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
