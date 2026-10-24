import React from 'react';
import { GiftCard } from '../types';
import { MrBeastLogo } from './MrBeastLogo';
import { ShieldAlert, CheckCircle2, Clock, X } from 'lucide-react';

interface ClaimLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  claimedCards: GiftCard[];
  maxLimit?: number;
}

export const ClaimLimitModal: React.FC<ClaimLimitModalProps> = ({
  isOpen,
  onClose,
  claimedCards,
  maxLimit = 3,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm transition-opacity animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-5 sm:p-7 shadow-[0_24px_64px_rgba(0,0,0,0.45)] border border-slate-100 flex flex-col items-center text-center my-auto">
        
        {/* Header MrBeast Logo */}
        <div className="mb-2">
          <MrBeastLogo size={52} />
        </div>

        {/* Warning Icon Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full mb-3">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
          <span>Fair Play Policy Enforced</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-['Montserrat',sans-serif] uppercase mb-1.5">
          Limit Reached ({maxLimit}/{maxLimit})
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-sm mb-4">
          To ensure fairness for all fans, users cannot claim more than <span className="font-bold text-slate-900">{maxLimit} gift cards</span>. You have reached your maximum claim limit.
        </p>

        {/* Claimed Cards List */}
        <div className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl p-3 mb-4 flex flex-col gap-2">
          <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 text-left px-1">
            Your {claimedCards.length} Claimed Cards
          </div>
          {claimedCards.length > 0 ? (
            claimedCards.map((card) => (
              <div
                key={card.id}
                className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 text-left"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-black text-slate-900 truncate">
                      {card.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">
                      {card.denomination}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                  Claimed
                </span>
              </div>
            ))
          ) : (
            <div className="text-xs text-slate-400 py-2">
              3 gift cards claimed in this session.
            </div>
          )}
        </div>

        {/* Downside Notice Message */}
        <div className="w-full mb-4 p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl flex items-start gap-2.5 text-left">
          <div className="w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 shrink-0 mt-0.5">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            We will verify and reach out to you within 30 days but in some cases it might take 90 days.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 px-6 rounded-xl font-black text-sm text-white bg-slate-900 hover:bg-slate-800 active:scale-[0.98] transition-all cursor-pointer"
        >
          Got It
        </button>

      </div>
    </div>
  );
};
