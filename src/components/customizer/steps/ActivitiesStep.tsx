import { useCustomizerStore } from '../../../store/customizerStore';
import { formatIndianCurrency } from '../../../lib/pricing-engine';
import { Lock, Plus, Minus, Clock } from 'lucide-react';

export function ActivitiesStep() {
  const { pricingData, travelerCount, selectedActivityIds, toggleActivity } = useCustomizerStore();

  if (!pricingData) return null;

  const itinerary = pricingData.itinerary;
  const activitiesPool: any[] = pricingData.activities ?? [];

  const getActivity = (activityId: string) =>
    activitiesPool.find((a: any) => (a._id ?? a.id) === activityId);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold mb-1" style={{ color: '#3D2C2C' }}>Customize Your Activities</h3>
        <p className="text-xs mb-4" style={{ color: '#B5A090' }}>Mandatory activities are fixed. Optional activities can be added or removed.</p>
      </div>

      {(itinerary.days ?? []).map((day: any) => {
        if (!day.activities || day.activities.length === 0) return null;
        return (
          <div key={day.dayNumber} className="overflow-hidden rounded-2xl" style={{ border: '1.5px solid #E8D5C4' }}>
            <div className="px-4 py-2.5 flex items-center gap-2" style={{ backgroundColor: '#FFF5EC' }}>
              <span className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center" style={{ backgroundColor: '#5B7FA6' }}>
                {day.dayNumber}
              </span>
              <span className="text-sm font-semibold" style={{ color: '#3D2C2C' }}>{day.title}</span>
            </div>
            <div className="divide-y" style={{ borderColor: '#F0E4D7' }}>
              {day.activities.map((activityRef: any) => {
                const activityId = activityRef.activityId?._id ?? activityRef.activityId;
                const activity = getActivity(activityId);
                if (!activity) return null;

                const isSelected = selectedActivityIds.includes(activityId);
                const price = activity.priceType === 'per_person'
                  ? activity.basePrice * travelerCount
                  : activity.basePrice;

                return (
                  <div key={activityId} className="flex items-center gap-3 p-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-medium" style={{ color: '#3D2C2C' }}>{activity.name}</p>
                        {activityRef.isMandatory && <Lock size={11} style={{ color: '#B5A090' }} />}
                        {activityRef.isIncluded && !activityRef.isMandatory && (
                          <span className="text-xs px-1.5 rounded-full" style={{ backgroundColor: '#E4F4EC', color: '#3D8B60' }}>Included</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs" style={{ color: '#A08070' }}>
                        <span className="flex items-center gap-1"><Clock size={10} /> {activity.duration}</span>
                        <span>·</span>
                        <span>{activity.priceType === 'per_person' ? `${formatIndianCurrency(activity.basePrice)}/person` : `${formatIndianCurrency(activity.basePrice)}/group`}</span>
                        {!activityRef.isIncluded && (
                          <span className="font-medium" style={{ color: '#E8643C' }}>Total: {formatIndianCurrency(price)}</span>
                        )}
                      </div>
                    </div>
                    {activityRef.isMandatory ? (
                      <div className="text-xs flex items-center gap-1 shrink-0" style={{ color: '#B5A090' }}>
                        <Lock size={12} /> Mandatory
                      </div>
                    ) : (
                      <button
                        onClick={() => toggleActivity(activityId)}
                        className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                        style={isSelected
                          ? { backgroundColor: '#5B7FA6', color: '#fff' }
                          : { backgroundColor: '#F0E4D7', color: '#8A7060' }
                        }
                      >
                        {isSelected ? <><Minus size={11} /> Remove</> : <><Plus size={11} /> Add</>}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
