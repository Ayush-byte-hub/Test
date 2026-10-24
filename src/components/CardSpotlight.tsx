import React, { useState, useEffect, useRef } from 'react';
import { GiftCard } from '../types';
import { CardArtwork } from './CardArtwork';
import { ShieldCheck, Sparkles, RefreshCw, Mail, Clock, CheckCircle2, Lock, ArrowRight, ShieldAlert, Loader2 } from 'lucide-react';

interface CardSpotlightProps {
  card: GiftCard;
  onOpenLocker: () => void;
  isCompleted?: boolean;
  submittedEmail?: string;
  onOpenEmailModal?: () => void;
  onSubmitEmail?: (email: string) => void;
  onReset?: () => void;
  isLimitReached?: boolean;
  claimedCount?: number;
  maxLimit?: number;
  onShowLimitModal?: () => void;
}

export const CardSpotlight: React.FC<CardSpotlightProps> = ({
  card,
  onOpenLocker,
  isCompleted = false,
  submittedEmail,
  onOpenEmailModal,
  onSubmitEmail,
  onReset,
  isLimitReached = false,
  claimedCount = 0,
  maxLimit = 3,
  onShowLimitModal,
}) => {
  const [stage, setStage] = useState<'idle' | 'generating' | 'locked' | 'email_entry' | 'completed'>('idle');
  const [currentDisplayCode, setCurrentDisplayCode] = useState<string>('');
  const [localEmail, setLocalEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const generatorTimerRef = useRef<NodeJS.Timeout | null>(null);

  const prefix = card.sampleCode ? card.sampleCode.substring(0, 14) : '15QV-JNM7-5A2N';
  const maskedPromoCode = `${prefix}-####`;

  // Respond to completion state from locker/sponsor
  useEffect(() => {
    if (submittedEmail) {
      setStage('completed');
      setCurrentDisplayCode(maskedPromoCode);
    } else if (isCompleted) {
      setStage('email_entry');
      setCurrentDisplayCode(maskedPromoCode);
    }
  }, [isCompleted, submittedEmail, maskedPromoCode]);

  // Reset stage when card changes
  useEffect(() => {
    if (!isCompleted && !submittedEmail) {
      setStage('idle');
      setCurrentDisplayCode('');
      setLocalEmail('');
      setEmailError('');
    } else if (submittedEmail) {
      setStage('completed');
      setCurrentDisplayCode(maskedPromoCode);
    } else if (isCompleted) {
      setStage('email_entry');
      setCurrentDisplayCode(maskedPromoCode);
    }
  }, [card.id, isCompleted, submittedEmail, maskedPromoCode]);

  const generateRandomPromoCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const makeGroup = () =>
      Array.from({ length: 4 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    return `${makeGroup()}-${makeGroup()}-${makeGroup()}-${makeGroup()}`;
  };

  const handleGetNow = () => {
    setStage('generating');
    let cycles = 0;
    const maxCycles = 14;

    if (generatorTimerRef.current) clearInterval(generatorTimerRef.current);

    generatorTimerRef.current = setInterval(() => {
      cycles++;
      const randomCode = generateRandomPromoCode();
      setCurrentDisplayCode(randomCode);

      if (cycles >= maxCycles) {
        if (generatorTimerRef.current) clearInterval(generatorTimerRef.current);
        // Settle on the masked code - last digits NEVER revealed
        setCurrentDisplayCode(maskedPromoCode);
        setStage('locked');
      }
    }, 110);
  };

  const handleLocalEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = localEmail.trim();
    if (!trimmed) {
      setEmailError('Please enter your email');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError('');
    onSubmitEmail?.(trimmed);

    import('canvas-confetti')
      .then((mod) => {
        const confetti = mod.default;
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0085ff', '#00b4d8', '#10b981', '#ffffff'],
        });
      })
      .catch(() => {});
  };

  return (
    <div className="w-full max-w-md mx-auto my-3 transition-all">
      <div className="relative bg-white rounded-3xl p-5 sm:p-6 shadow-[0_16px_48px_rgba(0,180,255,0.16)] border border-slate-200/90 flex flex-col items-center">
        {/* Spotlight Card Representation (matching video) */}
        <div className="w-full max-w-[270px] sm:max-w-[290px] bg-white rounded-2xl p-3.5 shadow-md border border-slate-200/90 flex flex-col mb-4">
          {/* Top hanger slot */}
          <div className="w-8 h-2 mx-auto bg-slate-100 rounded-full mb-2 shrink-0 border border-slate-300/70 shadow-inner" />

          {/* Header Row */}
          <div className="flex items-start justify-between gap-1 mb-2">
            <div>
              <div className="text-sm font-black text-slate-900 tracking-tight font-['Montserrat',sans-serif] uppercase">
                {card.name}
              </div>
              <div className="text-[10px] text-slate-400 font-medium">
                {card.quickDeliveryText || 'Quick Email Delivery'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-black text-slate-900 font-['Montserrat',sans-serif]">
                {card.denomination}
              </div>
              {card.badge && (
                <div className="text-[9px] font-extrabold text-slate-400 uppercase">
                  {card.badge}
                </div>
              )}
            </div>
          </div>

          {/* Artwork */}
          <div className="w-full aspect-[16/10] rounded-xl overflow-hidden shadow-inner border border-black/5 bg-slate-950">
            <CardArtwork card={card} isPriority={true} />
          </div>
        </div>

        {/* Limit Reached State: user already claimed maximum gift cards */}
        {isLimitReached && !isCompleted && !submittedEmail ? (
          <div className="w-full flex flex-col items-center text-center">
            <div className="w-full p-4 bg-amber-50 border border-amber-200 rounded-2xl mb-3 flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-2">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h4 className="text-sm sm:text-base font-black text-amber-950 uppercase font-['Montserrat',sans-serif] mb-1">
                Limit Reached ({claimedCount}/{maxLimit})
              </h4>
              <p className="text-xs text-amber-800 leading-snug">
                You have already claimed your maximum allowance of {maxLimit} gift cards for this giveaway.
              </p>
            </div>

            <button
              onClick={onShowLimitModal}
              className="w-full py-3 px-4 rounded-xl font-black text-xs sm:text-sm text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 transition-all cursor-pointer flex items-center justify-center gap-2 mb-3 shadow-xs"
            >
              <span>View My Claimed Cards ({claimedCount}/{maxLimit})</span>
            </button>

            {/* Downside Notice Message */}
            <div className="w-full p-3 bg-slate-50 border border-slate-200/90 rounded-xl flex items-start gap-2 text-left">
              <Clock className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <p className="text-[11px] sm:text-xs text-slate-600 font-medium leading-relaxed">
                We will verify and reach out to you within 30 days but in some cases it might take 90 days.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* State 1: Idle - "Here is your gift card!" + "Get Now!" */}
            {stage === 'idle' && (
              <div className="w-full flex flex-col items-center text-center">
                <h3 className="text-base sm:text-lg font-black text-slate-900 mb-3 tracking-tight font-['Montserrat',sans-serif]">
                  Here is your gift card!
                </h3>
                <button
                  onClick={handleGetNow}
                  className="w-full py-3.5 px-6 rounded-xl font-black text-base tracking-wide text-white bg-gradient-to-r from-[#0085ff] via-[#009cff] to-[#00b4d8] hover:from-[#0073e6] hover:to-[#009ee0] active:scale-[0.98] shadow-lg shadow-sky-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5 text-sky-100 animate-pulse" />
                  <span>Get Now!</span>
                </button>
              </div>
            )}
          </>
        )}

        {/* State 2: Generating animation */}
        {stage === 'generating' && (
          <div className="w-full flex flex-col items-center text-center py-1">
            <div className="w-full py-3 px-4 bg-slate-950 text-cyan-400 font-mono text-base sm:text-lg font-bold tracking-widest rounded-xl border border-cyan-400/40 shadow-inner mb-3 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
              <span>{currentDisplayCode || 'CONNECTING...'}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Generating secure redemption voucher...</span>
            </div>
          </div>
        )}

        {/* State 3: Locked - Code displayed partially + verification text + "Verify Now" */}
        {stage === 'locked' && (
          <div className="w-full flex flex-col items-center text-center">
            {/* Partially masked code */}
            <div className="w-full py-2.5 px-3 bg-slate-100 text-slate-900 font-mono text-base sm:text-lg font-extrabold tracking-widest rounded-xl border border-slate-300 shadow-sm mb-3 select-all flex items-center justify-center gap-2">
              <span>{currentDisplayCode || maskedPromoCode}</span>
            </div>

            {/* Exact notice text from video */}
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed px-1 mb-4">
              To display the last codes, we must verify that you are a real human, Click on this button and complete the offer.
            </p>

            {/* Verify Now Action */}
            <button
              onClick={onOpenLocker}
              className="w-full py-3.5 px-6 rounded-xl font-black text-base tracking-wide text-white bg-gradient-to-r from-[#0085ff] to-[#0066ee] hover:from-[#0073e6] hover:to-[#0055d4] active:scale-[0.98] shadow-lg shadow-blue-500/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5 text-white" />
              <span>Verify Now</span>
            </button>
          </div>
        )}

        {/* State 4: Email Entry Screen (Last codes protected - user enters email) */}
        {stage === 'email_entry' && (
          <div className="w-full flex flex-col items-center text-center">
            {/* Secured Masked Code (Never reveals last 4) */}
            <div className="w-full py-2 px-3 bg-slate-50 text-slate-800 font-mono text-sm sm:text-base font-bold tracking-widest rounded-xl border border-slate-200 shadow-xs mb-3 flex items-center justify-center gap-2">
              <Lock className="w-4 h-4 text-amber-500" />
              <span>{maskedPromoCode}</span>
            </div>

            <h4 className="text-sm sm:text-base font-black text-slate-900 uppercase font-['Montserrat',sans-serif] mb-1">
              Enter Your Email
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              Enter your email to receive your full voucher redemption code.
            </p>

            <form onSubmit={handleLocalEmailSubmit} className="w-full flex flex-col gap-2.5 mb-3">
              <div className="relative text-left">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={localEmail}
                  onChange={(e) => {
                    setLocalEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  placeholder="Enter email (e.g. name@gmail.com)"
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0085ff] focus:border-transparent transition-all"
                />
              </div>
              {emailError && (
                <p className="text-[11px] text-rose-500 font-semibold text-left">
                  {emailError}
                </p>
              )}
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl font-black text-sm text-white bg-gradient-to-r from-[#0085ff] to-[#009cff] hover:from-[#0073e6] hover:to-[#008ee0] active:scale-[0.98] shadow-md shadow-sky-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Submit Email</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Downside Notice Message */}
            <div className="w-full p-3 bg-slate-50 border border-slate-200/90 rounded-xl flex items-start gap-2 text-left">
              <Clock className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <p className="text-[11px] sm:text-xs text-slate-600 font-medium leading-relaxed">
                We will verify and reach out to you within 30 days but in some cases it might take 90 days.
              </p>
            </div>
          </div>
        )}

        {/* State 5: Completed / Email Registered */}
        {stage === 'completed' && (
          <div className="w-full flex flex-col items-center text-center">
            {/* Masked Code remains protected */}
            <div className="w-full py-2 px-3 bg-slate-50 text-slate-800 font-mono text-sm sm:text-base font-bold tracking-widest rounded-xl border border-slate-200 shadow-xs mb-3 flex items-center justify-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>{maskedPromoCode}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Submission Received</span>
            </div>

            <p className="text-xs text-slate-600 font-medium mb-1">
              Registered email:
            </p>
            <div className="text-xs sm:text-sm font-bold text-slate-900 bg-slate-100 py-1.5 px-3 rounded-lg border border-slate-200 font-mono mb-3 max-w-full break-all">
              {submittedEmail || localEmail}
            </div>

            {/* Downside Notice Message */}
            <div className="w-full p-3 bg-sky-50 border border-sky-100 rounded-xl flex items-start gap-2 text-left mb-3">
              <Clock className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
              <p className="text-[11px] sm:text-xs text-sky-900 font-semibold leading-relaxed">
                We will verify and reach out to you within 30 days but in some cases it might take 90 days.
              </p>
            </div>

            {onReset && (
              <button
                onClick={onReset}
                className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Choose Another Gift Card
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
