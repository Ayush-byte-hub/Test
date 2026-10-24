import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MrBeastLogo } from './MrBeastLogo';
import { ContentLockerSettings } from '../types';
import { RefreshCw } from 'lucide-react';

interface ContentLockerModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ContentLockerSettings;
  onSelectOffer?: (offer: any) => void;
  onQuickVerify?: () => void;
  cardName?: string;
  denomination?: string;
}

export const ContentLockerModal: React.FC<ContentLockerModalProps> = ({
  isOpen,
  settings,
  onQuickVerify,
  cardName = 'Gift Card',
}) => {
  const [iframeLoading, setIframeLoading] = useState<boolean>(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const lockerUrl = settings.customCpaUrl || 'https://clickanlook.space/iframe/8f73ca02-cf5e-11f1-98c9-129a1c289511?if=1';

  // Send CPALead handshake triggers to unhide locker content
  const sendTrigger = useCallback(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        const cw = iframeRef.current.contentWindow;
        const width = iframeRef.current.clientWidth || window.innerWidth || 380;
        // CPALead locker is configured with loadType: 'onClick', requiring showLockerOnclick to reveal
        cw.postMessage(JSON.stringify({ action: 'showLockerOnclick', w: width }), '*');
        cw.postMessage(JSON.stringify({ action: 'postSize', w: width, bodyHeight: 850 }), '*');
        cw.postMessage('showLocker', '*');
      } catch (err) {
        // Safe postMessage
      }
    }
  }, []);

  // Suppress any duplicate full-screen iframes injected by the cpljs loader in index.html.
  // The loader attempts to display a full-screen iframe at z-index 9999999 upon receiving showLocker,
  // which blocks touch scrolling and creates a frozen/glitched overlay.
  useEffect(() => {
    if (!isOpen) return;

    const cleanupDuplicate = () => {
      const iframes = document.querySelectorAll<HTMLIFrameElement>(
        'iframe[id="8f73ca02-cf5e-11f1-98c9-129a1c289511"], iframe[data-id="8f73ca02-cf5e-11f1-98c9-129a1c289511"]'
      );
      iframes.forEach((ifr) => {
        if (ifr.id !== 'cpl-modal-iframe') {
          ifr.style.setProperty('display', 'none', 'important');
          ifr.style.setProperty('pointer-events', 'none', 'important');
          ifr.style.setProperty('visibility', 'hidden', 'important');
          ifr.style.setProperty('position', 'fixed', 'important');
          ifr.style.setProperty('top', '-99999px', 'important');
          ifr.style.setProperty('left', '-99999px', 'important');
          ifr.style.setProperty('z-index', '-99999', 'important');
        }
      });
      // Ensure page body doesn't have scroll locking applied by the loader script
      if (document.body.style.overflow === 'hidden' && !isOpen) {
        document.body.style.overflow = '';
      }
    };

    cleanupDuplicate();
    const timer = setInterval(cleanupDuplicate, 200);
    return () => {
      clearInterval(timer);
      cleanupDuplicate();
    };
  }, [isOpen]);

  // Listen for locker conversion postMessage events & respond to getSize
  useEffect(() => {
    if (!isOpen) return;

    setIframeLoading(true);

    const handleMessage = (event: MessageEvent) => {
      try {
        let payload = event.data;
        if (typeof payload === 'string') {
          try {
            payload = JSON.parse(payload);
          } catch (_) {
            // Raw string message
          }
        }

        // When CPALead iframe initializes, it asks parent for window size:
        if (
          payload?.action === 'getSize' ||
          (typeof event.data === 'string' && event.data.includes('getSize'))
        ) {
          sendTrigger();
        }

        // When offer is completed, trigger verification
        if (
          payload === 'completed' ||
          payload?.status === 'complete' ||
          payload?.status === 'completed' ||
          payload?.action === 'unlock' ||
          payload?.action === 'lead_completed' ||
          payload?.type === 'lead_completed'
        ) {
          onQuickVerify?.();
        }
      } catch (err) {
        // Safe postMessage catch
      }
    };

    window.addEventListener('message', handleMessage);

    // Send repeating handshake triggers as the iframe script loads
    sendTrigger();
    const t1 = setTimeout(sendTrigger, 200);
    const t2 = setTimeout(sendTrigger, 600);
    const t3 = setTimeout(sendTrigger, 1200);
    const t4 = setTimeout(sendTrigger, 2200);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isOpen, sendTrigger, onQuickVerify]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-sm transition-opacity animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-md sm:max-w-lg bg-white rounded-3xl p-4 sm:p-6 shadow-[0_24px_64px_rgba(0,0,0,0.45)] border border-slate-100 flex flex-col items-center text-center my-auto max-h-[96vh] overflow-y-auto overscroll-contain">
        
        {/* MrBeast Panther Logo */}
        <div className="mb-1.5 sm:mb-2">
          <MrBeastLogo size={46} />
        </div>

        {/* Title */}
        <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight font-['Montserrat',sans-serif] uppercase mb-1">
          {settings.heading || 'Unlock Last Code'}
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-slate-600 font-semibold leading-snug max-w-sm mb-2.5 sm:mb-3">
          Complete offers on the content locker below to immediately reveal your full{' '}
          {cardName && cardName !== 'Gift Card' ? (
            <span className="text-black font-extrabold">{cardName} </span>
          ) : null}
          code!
        </p>

        {/* The Clean Embedded Content Locker Container with Smooth Scrolling */}
        <div
          ref={containerRef}
          className="relative w-full h-[520px] sm:h-[560px] max-h-[68vh] rounded-2xl border border-slate-200 bg-[#0c1626] shadow-inner mb-2.5 sm:mb-3 overflow-y-auto overflow-x-hidden smooth-scroll-container"
          style={{
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-y',
            overscrollBehavior: 'contain',
          }}
        >
          {iframeLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0c1626] z-10 text-slate-400 p-4">
              <RefreshCw className="w-7 h-7 animate-spin text-[#0085ff] mb-2" />
              <span className="text-xs font-semibold text-slate-300">Loading Content Locker...</span>
            </div>
          )}
          <iframe
            ref={iframeRef}
            src={lockerUrl}
            title="Content Locker"
            id="cpl-modal-iframe"
            data-id="8f73ca02-cf5e-11f1-98c9-129a1c289511"
            scrolling="yes"
            className="w-full h-full border-0 block"
            style={{
              width: '100%',
              height: '100%',
              minHeight: '100%',
              border: 'none',
              WebkitOverflowScrolling: 'touch',
              touchAction: 'pan-y',
            }}
            onLoad={() => {
              setIframeLoading(false);
              sendTrigger();
              setTimeout(sendTrigger, 150);
              setTimeout(sendTrigger, 500);
              setTimeout(sendTrigger, 1200);
            }}
          />
        </div>

        {/* Free Disclaimer Note */}
        <div className="w-full flex items-center justify-center text-[11px] sm:text-xs text-slate-500 font-medium px-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{settings.footerNote || "Don't worry sponsors are Free"}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

