import React, { useState } from 'react';
import { GiftCard } from '../types';
import { MrBeastLogo } from './MrBeastLogo';
import { Mail, Clock, CheckCircle2, Lock, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface EmailClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: GiftCard | null;
  maskedCode: string;
  onSaveEmail: (cardId: string, email: string) => void;
  initialEmail?: string;
  isLimitReached?: boolean;
  claimedCount?: number;
  maxLimit?: number;
}

export const EmailClaimModal: React.FC<EmailClaimModalProps> = ({
  isOpen,
  onClose,
  card,
  maskedCode,
  onSaveEmail,
  initialEmail = '',
  isLimitReached = false,
  claimedCount = 0,
  maxLimit = 3,
}) => {
  const [email, setEmail] = useState<string>(initialEmail);
  const [submitted, setSubmitted] = useState<boolean>(Boolean(initialEmail));
  const [submittedEmail, setSubmittedEmail] = useState<string>(initialEmail);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen || !card) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLimitReached && !submitted) {
      setError(`Claim limit reached! Maximum of ${maxLimit} gift cards per user.`);
      return;
    }
    const trimmed = email.trim();
    if (!trimmed) {
      setError('Please enter your email address');
      return;
    }
    // Basic standard email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setError('Please enter a valid email address (e.g. name@gmail.com)');
      return;
    }

    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setSubmittedEmail(trimmed);
      onSaveEmail(card.id, trimmed);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0085ff', '#00b4d8', '#10b981', '#ffffff'],
        });
      } catch (_) {}
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm transition-opacity animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-5 sm:p-7 shadow-[0_24px_64px_rgba(0,0,0,0.45)] border border-slate-100 flex flex-col items-center text-center my-auto">
        
        {/* Header MrBeast Logo */}
        <div className="mb-2">
          <MrBeastLogo size={52} />
        </div>

        {!submitted ? (
          <>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-100 text-sky-800 text-xs font-bold rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>Sponsor Verification Complete!</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-['Montserrat',sans-serif] uppercase mb-1">
              Enter Your Email
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-snug max-w-sm mb-4">
              Enter the email address where your <span className="text-slate-900 font-extrabold">{card.name} {card.denomination}</span> code will be delivered.
            </p>

            {/* Masked Code Preview (Secured, last 4 not revealed) */}
            <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-600">
                  <Lock className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Secured Redemption Code
                  </div>
                  <div className="text-sm sm:text-base font-mono font-black text-slate-800 tracking-widest">
                    {maskedCode || '15QV-JNM7-5A2N-####'}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full shrink-0">
                Protected
              </span>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
              <div className="text-left w-full">
                <label htmlFor="claim-email-input" className="block text-xs font-bold text-slate-700 mb-1">
                  Delivery Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="claim-email-input"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Enter your email (e.g. name@gmail.com)"
                    autoFocus
                    required
                    className="w-full pl-10 pr-3.5 py-3 text-sm text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0085ff] focus:border-transparent transition-all shadow-xs"
                  />
                </div>
                {error && (
                  <p className="text-xs text-rose-500 font-semibold mt-1">
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl font-black text-base text-white bg-gradient-to-r from-[#0085ff] via-[#009cff] to-[#00b4d8] hover:from-[#0073e6] hover:to-[#009ee0] active:scale-[0.98] shadow-lg shadow-sky-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <span>{isSubmitting ? 'Submitting...' : 'Submit Email'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Downside Notice Message */}
            <div className="w-full mt-4 p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl flex items-start gap-2.5 text-left">
              <div className="w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 shrink-0 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                We will verify and reach out to you within 30 days but in some cases it might take 90 days.
              </p>
            </div>
          </>
        ) : (
          /* Confirmation Success Screen */
          <div className="w-full flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-['Montserrat',sans-serif] uppercase mb-1">
              Submission Received!
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-snug max-w-sm mb-4">
              Your email for <span className="text-slate-900 font-bold">{card.name} {card.denomination}</span> has been securely registered.
            </p>

            <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 mb-4 text-center">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                Registered Delivery Email
              </div>
              <div className="text-sm sm:text-base font-bold text-slate-900 break-all font-mono">
                {submittedEmail}
              </div>
            </div>

            {/* Downside Notice Message */}
            <div className="w-full mb-5 p-3.5 bg-sky-50 border border-sky-100 rounded-2xl flex items-start gap-2.5 text-left">
              <div className="w-5 h-5 rounded-full bg-sky-200 flex items-center justify-center text-sky-700 shrink-0 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs text-sky-900 font-semibold leading-relaxed">
                We will verify and reach out to you within 30 days but in some cases it might take 90 days.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 px-6 rounded-xl font-black text-sm text-white bg-slate-900 hover:bg-slate-800 active:scale-[0.98] transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
