import React, { useState } from 'react';
import { SponsorOffer } from '../types';
import { X, Trophy, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

interface InteractiveSponsorModalProps {
  isOpen: boolean;
  offer: SponsorOffer | null;
  onClose: () => void;
  onComplete: () => void;
}

export const InteractiveSponsorModal: React.FC<InteractiveSponsorModalProps> = ({
  isOpen,
  offer,
  onClose,
  onComplete,
}) => {
  const [step, setStep] = useState<'play' | 'verifying' | 'done'>('play');
  const [slotItems, setSlotItems] = useState<string[]>(['💎', '⭐', '🔥']);
  const [wheelRotation, setWheelRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  const icons = ['💎', '⭐', '🔥', '👑', '🎉', '⚡'];

  const handleSlotSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setSlotItems([
        icons[Math.floor(Math.random() * icons.length)],
        icons[Math.floor(Math.random() * icons.length)],
        icons[Math.floor(Math.random() * icons.length)],
      ]);
      if (count > 15) {
        clearInterval(interval);
        // Guarantee winning triple crown/stars!
        setSlotItems(['👑', '👑', '👑']);
        setIsSpinning(false);
        triggerVerification();
      }
    }, 100);
  };

  const handleWheelSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    const extraSpins = 360 * 5 + Math.floor(Math.random() * 360);
    setWheelRotation((prev) => prev + extraSpins);
    setTimeout(() => {
      setIsSpinning(false);
      triggerVerification();
    }, 3200);
  };

  const triggerVerification = () => {
    setStep('verifying');
    setTimeout(() => {
      setStep('done');
      setTimeout(() => {
        onComplete();
      }, 1200);
    }, 2800);
  };

  if (!isOpen || !offer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 overflow-hidden text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Sponsor Banner */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold mb-3">
          <Trophy className="w-3.5 h-3.5 text-amber-600" />
          <span>Sponsor Challenge</span>
        </div>

        <h3 className="text-base font-black text-slate-900 mb-1 leading-snug">
          {offer.title}
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          Complete this fast sponsor step to verify human authenticity and reveal your code!
        </p>

        {step === 'play' && (
          <div className="flex flex-col items-center">
            {offer.type === 'slot' ? (
              <div className="w-full">
                {/* Slot Display */}
                <div className="bg-slate-950 p-4 rounded-2xl border-4 border-amber-400 shadow-inner flex justify-center items-center gap-3 mb-5">
                  {slotItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="w-16 h-20 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-center text-3xl shadow-md"
                    >
                      {item}
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSlotSpin}
                  disabled={isSpinning}
                  className="w-full py-3.5 rounded-xl font-black text-base text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-[0.98] shadow-lg shadow-amber-500/30 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>{isSpinning ? 'Spinning...' : 'SPIN TO UNLOCK!'}</span>
                </button>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center">
                {/* Wheel Graphic */}
                <div className="relative w-44 h-44 mb-5 flex items-center justify-center">
                  {/* Wheel Pointer */}
                  <div className="absolute top-0 z-20 -mt-2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-red-600 drop-shadow-md" />
                  <div
                    style={{
                      transform: `rotate(${wheelRotation}deg)`,
                      transition: isSpinning ? 'transform 3.2s cubic-bezier(0.15, 0.9, 0.2, 1)' : 'none',
                    }}
                    className="w-40 h-40 rounded-full border-4 border-slate-900 overflow-hidden relative shadow-xl bg-conic from-amber-400 via-rose-500 to-cyan-400"
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-slate-900 z-10">
                        <span className="text-xs font-black">WIN</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleWheelSpin}
                  disabled={isSpinning}
                  className="w-full py-3.5 rounded-xl font-black text-base text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 active:scale-[0.98] shadow-lg shadow-pink-500/30 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>{isSpinning ? 'Spinning Wheel...' : 'SPIN THE WHEEL!'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {step === 'verifying' && (
          <div className="py-8 flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-[#00a8ff] animate-spin mb-4" />
            <h4 className="text-sm font-bold text-slate-800 mb-1">
              Validating Sponsor Session...
            </h4>
            <p className="text-xs text-slate-500 max-w-xs">
              Confirming human interaction and contacting gift card inventory API.
            </p>
          </div>
        )}

        {step === 'done' && (
          <div className="py-6 flex flex-col items-center animate-bounce">
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mb-2" />
            <h4 className="text-base font-black text-slate-900">
              Offer Complete!
            </h4>
            <p className="text-xs text-emerald-700 font-medium">
              Redirecting to email claim...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
