import { formatIndianCurrency } from '../../lib/pricing-engine';
import type { PriceBreakdown } from '../../types/customization.types';

interface PriceSummaryProps {
  breakdown: PriceBreakdown;
}

export function PriceSummary({ breakdown }: PriceSummaryProps) {
  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-600">Base Price</span>
        <span>{formatIndianCurrency(breakdown.basePrice)}</span>
      </div>
      {breakdown.hotelUpgrade !== 0 && (
        <div className="flex justify-between">
          <span className="text-gray-600">Hotel Adjustment</span>
          <span className={breakdown.hotelUpgrade > 0 ? 'text-orange-600' : 'text-green-600'}>
            {formatIndianCurrency(breakdown.hotelUpgrade)}
          </span>
        </div>
      )}
      {breakdown.roomSharingAdjustment !== 0 && (
        <div className="flex justify-between">
          <span className="text-gray-600">Room Sharing</span>
          <span className={breakdown.roomSharingAdjustment > 0 ? 'text-orange-600' : 'text-green-600'}>
            {formatIndianCurrency(breakdown.roomSharingAdjustment)}
          </span>
        </div>
      )}
      {breakdown.transportCost !== 0 && (
        <div className="flex justify-between">
          <span className="text-gray-600">Transport</span>
          <span className={breakdown.transportCost > 0 ? 'text-orange-600' : 'text-green-600'}>
            {formatIndianCurrency(breakdown.transportCost)}
          </span>
        </div>
      )}
      {breakdown.activitiesTotal !== 0 && (
        <div className="flex justify-between">
          <span className="text-gray-600">Activities</span>
          <span className={breakdown.activitiesTotal > 0 ? 'text-orange-600' : 'text-green-600'}>
            {formatIndianCurrency(breakdown.activitiesTotal)}
          </span>
        </div>
      )}
      <div className="flex justify-between border-t border-gray-200 pt-2">
        <span className="text-gray-600">Subtotal</span>
        <span>{formatIndianCurrency(breakdown.subtotal)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">GST ({breakdown.gstPercent}%)</span>
        <span>{formatIndianCurrency(breakdown.gstAmount)}</span>
      </div>
      <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-2">
        <span>Total</span>
        <span className="text-[#0F4C81]">{formatIndianCurrency(breakdown.totalAmount)}</span>
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>Per Person</span>
        <span>{formatIndianCurrency(breakdown.pricePerPerson)}</span>
      </div>
    </div>
  );
}
