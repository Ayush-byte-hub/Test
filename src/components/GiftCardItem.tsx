import React from 'react';
import { GiftCard } from '../types';
import { CardArtwork } from './CardArtwork';

interface GiftCardItemProps {
  card: GiftCard;
  onSelect: (card: GiftCard) => void;
  isSelected?: boolean;
  isClaimed?: boolean;
}

export const GiftCardItem: React.FC<GiftCardItemProps> = ({
  card,
  onSelect,
  isSelected = false,
  isClaimed = false,
}) => {
  return (
    <div
      onClick={() => onSelect(card)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(card);
        }
      }}
      className={`group relative bg-white rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between transition-all duration-200 select-none cursor-pointer border ${
        isSelected
          ? 'ring-2 ring-[#0085FF] shadow-[0_12px_32px_rgba(0,133,255,0.28)] border-[#0085FF] -translate-y-0.5'
          : 'border-slate-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_28px_rgba(0,180,255,0.18)] hover:border-sky-300 hover:-translate-y-0.5 active:scale-[0.98]'
      }`}
    >
      {/* Top hanger cutout slot (authentic retail hanging card look) */}
      <div className="w-8 h-2 mx-auto bg-slate-100 rounded-full mb-2 shrink-0 border border-slate-300/70 shadow-inner group-hover:bg-slate-200 transition-colors" />

      {/* Brand Header & Denomination Row */}
      <div className="flex items-start justify-between gap-1.5 mb-2.5">
        <div className="flex flex-col min-w-0 pr-1">
          <span className="text-xs sm:text-[13px] font-black text-slate-900 tracking-tight uppercase font-['Montserrat',sans-serif] truncate">
            {card.name}
          </span>
          <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold tracking-tight">
            {card.quickDeliveryText || 'Quick Email Delivery'}
          </span>
        </div>

        {/* Value / Denomination - Clean, high contrast */}
        <div className="text-right shrink-0">
          <div className="text-xs sm:text-[14px] font-black text-slate-900 font-['Montserrat',sans-serif] leading-tight">
            {card.denomination}
          </div>
          {isClaimed ? (
            <div className="text-[8px] sm:text-[9px] font-black text-emerald-700 bg-emerald-100 border border-emerald-300 px-1.5 py-0.5 rounded-full inline-flex items-center gap-0.5 uppercase tracking-tight mt-0.5">
              <span>✓ Claimed</span>
            </div>
          ) : card.badge ? (
            <div className="text-[8px] sm:text-[9px] font-extrabold text-slate-400 uppercase tracking-tight">
              {card.badge}
            </div>
          ) : null}
        </div>
      </div>

      {/* Card Artwork Graphic */}
      <div className="w-full aspect-[16/10] rounded-xl overflow-hidden shadow-sm relative group-hover:brightness-[1.03] transition-all border border-black/5 bg-slate-950">
        <CardArtwork card={card} />
      </div>
    </div>
  );
};
