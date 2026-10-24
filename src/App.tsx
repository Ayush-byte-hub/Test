import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { GiftCard, ContentLockerSettings, SponsorOffer } from './types';
import { INITIAL_GIFT_CARDS } from './data/giftCards';
import { Header } from './components/Header';
import { GiftCardItem } from './components/GiftCardItem';
import { CardSpotlight } from './components/CardSpotlight';
import { ContentLockerModal } from './components/ContentLockerModal';
import { InteractiveSponsorModal } from './components/InteractiveSponsorModal';
import { EmailClaimModal } from './components/EmailClaimModal';
import { ClaimLimitModal } from './components/ClaimLimitModal';
import { LockerConfigDrawer } from './components/LockerConfigDrawer';
import { Search, Gift } from 'lucide-react';

const DEFAULT_LOCKER_SETTINGS: ContentLockerSettings = {
  heading: 'Unlock Last Code',
  subheading: 'Complete one of the sponsors below to unlock your last code!',
  offers: [
    {
      id: 'offer-cpa-main',
      title: 'Complete Free Sponsor Offer (Content Locker)',
      type: 'locker',
      url: 'https://clickanlook.space/iframe/8f73ca02-cf5e-11f1-98c9-129a1c289511?if=1',
    },
    {
      id: 'offer-slot',
      title: 'Spin the slot to take a chance at a special offer!',
      type: 'slot',
    },
    {
      id: 'offer-wheel',
      title: 'Spin the wheel to have a chance at big prizes!',
      type: 'wheel',
    },
  ],
  customCpaUrl: 'https://clickanlook.space/iframe/8f73ca02-cf5e-11f1-98c9-129a1c289511?if=1',
  useExternalCpa: true,
  simulationAutoVerifyTime: 3,
  footerNote: "Don't worry sponsors are Free",
  headerBrandName: 'MR BEAST',
  headerSubTitle: 'GIFT CARD GIVEAWAY',
  displayMode: 'iframe',
};

const MAX_GIFT_CARDS_ALLOWED = 3;

const getSavedClaimedCardIds = (): string[] => {
  try {
    const raw = localStorage.getItem('mrbeast_claimed_card_ids');
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
};

const getSavedSubmittedEmails = (): Record<string, string> => {
  try {
    const raw = localStorage.getItem('mrbeast_claimed_emails');
    return raw ? JSON.parse(raw) : {};
  } catch (_) {
    return {};
  }
};

export default function App() {
  const [cards, setCards] = useState<GiftCard[]>(INITIAL_GIFT_CARDS);
  const [selectedCard, setSelectedCard] = useState<GiftCard | null>(INITIAL_GIFT_CARDS[9]); // Default to Roblox $100 as in video
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Locker states
  const [lockerSettings, setLockerSettings] = useState<ContentLockerSettings>(DEFAULT_LOCKER_SETTINGS);
  const [isLockerOpen, setIsLockerOpen] = useState<boolean>(false);
  const [activeOffer, setActiveOffer] = useState<SponsorOffer | null>(null);
  const [isSponsorModalOpen, setIsSponsorModalOpen] = useState<boolean>(false);
  const [isConfigDrawerOpen, setIsConfigDrawerOpen] = useState<boolean>(false);

  // Claim tracking & 3-card limit enforcement
  const [claimedCardIds, setClaimedCardIds] = useState<string[]>(getSavedClaimedCardIds);
  const [submittedEmails, setSubmittedEmails] = useState<Record<string, string>>(getSavedSubmittedEmails);
  const [completedCards, setCompletedCards] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    getSavedClaimedCardIds().forEach((id) => {
      initial[id] = true;
    });
    return initial;
  });
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState<boolean>(false);

  const spotlightRef = useRef<HTMLDivElement | null>(null);

  // Filter cards by category and search
  const filteredCards = cards.filter((card) => {
    const matchesSearch =
      card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.denomination.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || card.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectCard = (card: GiftCard) => {
    setSelectedCard(card);
    if (spotlightRef.current) {
      spotlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleOpenLocker = () => {
    if (selectedCard && !claimedCardIds.includes(selectedCard.id) && claimedCardIds.length >= MAX_GIFT_CARDS_ALLOWED) {
      setIsLimitModalOpen(true);
      return;
    }
    setIsLockerOpen(true);
  };

  const handleSelectOffer = (offer: SponsorOffer) => {
    if (offer.type === 'locker' || (lockerSettings.useExternalCpa && lockerSettings.customCpaUrl)) {
      window.open(lockerSettings.customCpaUrl || 'https://clickanlook.space/iframe/8f73ca02-cf5e-11f1-98c9-129a1c289511?if=1', '_blank', 'noopener,noreferrer');
      return;
    }
    // Launch interactive mini sponsor challenge
    setActiveOffer(offer);
    setIsSponsorModalOpen(true);
  };

  const handleCompleteSponsor = () => {
    setIsSponsorModalOpen(false);
    setIsLockerOpen(false);

    if (selectedCard) {
      if (!claimedCardIds.includes(selectedCard.id) && claimedCardIds.length >= MAX_GIFT_CARDS_ALLOWED) {
        setIsLimitModalOpen(true);
        return;
      }

      // Mark as completed - do NOT reveal last code digits
      setCompletedCards((prev) => ({
        ...prev,
        [selectedCard.id]: true,
      }));

      // Immediately launch email entry screen
      setIsEmailModalOpen(true);

      // Fire victory celebration confetti
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#0085ff', '#00c3ff', '#10b981', '#ffffff'],
        });
      } catch (err) {
        // Safe confetti fallback
      }

      if (spotlightRef.current) {
        spotlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleSaveEmail = (cardId: string, email: string) => {
    // Prevent claiming more than 3 cards
    if (claimedCardIds.length >= MAX_GIFT_CARDS_ALLOWED && !claimedCardIds.includes(cardId)) {
      setIsEmailModalOpen(false);
      setIsLimitModalOpen(true);
      return;
    }

    const nextEmails = { ...submittedEmails, [cardId]: email };
    setSubmittedEmails(nextEmails);
    try {
      localStorage.setItem('mrbeast_claimed_emails', JSON.stringify(nextEmails));
    } catch (_) {}

    const nextClaimed = claimedCardIds.includes(cardId)
      ? claimedCardIds
      : [...claimedCardIds, cardId];
    setClaimedCardIds(nextClaimed);
    try {
      localStorage.setItem('mrbeast_claimed_card_ids', JSON.stringify(nextClaimed));
    } catch (_) {}

    setCompletedCards((prev) => ({ ...prev, [cardId]: true }));
  };


  return (
    <div className="min-h-screen text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] relative overflow-x-hidden selection:bg-cyan-200">
      
      {/* Seamless Flowing White & Blue Background (Matching user video recording) */}
      <div 
        className="fixed inset-0 pointer-events-none -z-10 flowing-bg"
        aria-hidden="true"
      />

      {/* Main Content Container (Centered mobile-first canvas matching video) */}
      <div className="relative z-10 max-w-lg sm:max-w-xl mx-auto min-h-screen flex flex-col">
        
        {/* Header */}
        <Header
          brandTitle={lockerSettings.headerBrandName}
          subTitle={lockerSettings.headerSubTitle}
        />

        {/* Spotlight / Generator Stage */}
        {selectedCard && (
          <div ref={spotlightRef} className="px-3 sm:px-4">
            <CardSpotlight
              card={selectedCard}
              onOpenLocker={handleOpenLocker}
              isCompleted={Boolean(completedCards[selectedCard.id])}
              submittedEmail={submittedEmails[selectedCard.id]}
              onOpenEmailModal={() => setIsEmailModalOpen(true)}
              onSubmitEmail={(email) => handleSaveEmail(selectedCard.id, email)}
              onReset={() => {
                const nextUnused = cards.find((c) => !claimedCardIds.includes(c.id)) || cards[0];
                setSelectedCard(nextUnused);
              }}
              isLimitReached={!claimedCardIds.includes(selectedCard.id) && claimedCardIds.length >= MAX_GIFT_CARDS_ALLOWED}
              claimedCount={claimedCardIds.length}
              maxLimit={MAX_GIFT_CARDS_ALLOWED}
              onShowLimitModal={() => setIsLimitModalOpen(true)}
            />
          </div>
        )}

        {/* Search & Category Filter Bar */}
        <div className="px-3 sm:px-4 pt-2 pb-2.5 sticky top-0 bg-white/80 backdrop-blur-md z-20 border-b border-white/60 shadow-xs">
          <div className="relative flex items-center mb-2.5">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search 30+ gift cards (Roblox, Steam, PSN...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm bg-white/95 border border-slate-200/90 rounded-xl outline-none focus:ring-2 focus:ring-[#00a8ff] focus:bg-white transition-all font-medium shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-xs text-slate-400 hover:text-slate-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs - Clean segmented controls */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-bold text-slate-600">
            {[
              { id: 'all', label: 'All Cards' },
              { id: 'gaming', label: 'Gaming' },
              { id: 'entertainment', label: 'Entertainment' },
              { id: 'shopping', label: 'Shopping' },
              { id: 'tech', label: 'Tech & App' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-black text-white shadow-xs'
                    : 'bg-white/85 text-slate-700 hover:bg-white shadow-xs border border-white/80'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fair Play 3-Card Limit Counter Bar */}
        <div className="px-3 sm:px-4 py-2 flex items-center justify-between text-xs text-slate-700 bg-white/70 backdrop-blur-md border-b border-white/60">
          <div className="flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <span>Giveaway Limit: Max 3 Cards Per User</span>
          </div>
          <button
            onClick={() => setIsLimitModalOpen(true)}
            className={`font-black px-2.5 py-0.5 rounded-full text-[11px] transition-all cursor-pointer shadow-xs ${
              claimedCardIds.length >= MAX_GIFT_CARDS_ALLOWED
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {claimedCardIds.length}/{MAX_GIFT_CARDS_ALLOWED} Claimed
          </button>
        </div>

        {/* Gift Cards Grid: 2 Columns on Mobile (matching video) */}
        <main className="p-3 sm:p-4 flex-1">
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
            {filteredCards.map((card) => (
              <GiftCardItem
                key={card.id}
                card={card}
                onSelect={handleSelectCard}
                isSelected={selectedCard?.id === card.id}
                isClaimed={claimedCardIds.includes(card.id)}
              />
            ))}
          </div>

          {filteredCards.length === 0 && (
            <div className="text-center py-12 px-4">
              <Gift className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No cards found matching &quot;{searchQuery}&quot;</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-3 text-xs text-sky-600 font-bold hover:underline"
              >
                Reset filters
              </button>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="w-full py-6 px-4 bg-white/70 backdrop-blur-md border-t border-white/60 text-center text-xs text-slate-500 flex flex-col items-center gap-2 mt-auto">
          <div className="flex items-center justify-center gap-3 text-slate-600 font-semibold flex-wrap">
            <span>Terms of Service</span>
            <span>·</span>
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Redemption Guide</span>
          </div>
          <p className="text-[11px] text-slate-500">
            All brand trademarks, logos, and game assets belong to their respective copyright holders.
          </p>
        </footer>

      </div>

      {/* Content Locker Modal (Unlock Last Code) */}
      <ContentLockerModal
        isOpen={isLockerOpen}
        onClose={() => setIsLockerOpen(false)}
        settings={lockerSettings}
        onSelectOffer={handleSelectOffer}
        onQuickVerify={() => {
          handleCompleteSponsor();
        }}
        cardName={selectedCard?.name}
        denomination={selectedCard?.denomination}
      />

      {/* Interactive Sponsor Mini-Game / Task Challenge */}
      <InteractiveSponsorModal
        isOpen={isSponsorModalOpen}
        offer={activeOffer}
        onClose={() => setIsSponsorModalOpen(false)}
        onComplete={handleCompleteSponsor}
      />

      {/* Screen to enter email after completing offer - keeps codes protected */}
      <EmailClaimModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        card={selectedCard}
        maskedCode={
          selectedCard
            ? `${selectedCard.sampleCode ? selectedCard.sampleCode.substring(0, 14) : '15QV-JNM7-5A2N'}-####`
            : '15QV-JNM7-5A2N-####'
        }
        initialEmail={selectedCard ? submittedEmails[selectedCard.id] || '' : ''}
        isLimitReached={Boolean(
          selectedCard &&
            !claimedCardIds.includes(selectedCard.id) &&
            claimedCardIds.length >= MAX_GIFT_CARDS_ALLOWED
        )}
        claimedCount={claimedCardIds.length}
        maxLimit={MAX_GIFT_CARDS_ALLOWED}
        onSaveEmail={(cardId, email) => handleSaveEmail(cardId, email)}
      />

      {/* Fair Play Claim Limit Modal (Max 3 gift cards) */}
      <ClaimLimitModal
        isOpen={isLimitModalOpen}
        onClose={() => setIsLimitModalOpen(false)}
        claimedCards={cards.filter((c) => claimedCardIds.includes(c.id))}
        maxLimit={MAX_GIFT_CARDS_ALLOWED}
      />

      {/* Content Locker Settings Drawer */}
      <LockerConfigDrawer
        isOpen={isConfigDrawerOpen}
        onClose={() => setIsConfigDrawerOpen(false)}
        settings={lockerSettings}
        onSave={(newSettings) => setLockerSettings(newSettings)}
        cards={cards}
        onUpdateCardImage={(cardId, imageUrl) => {
          setCards((prev) =>
            prev.map((c) => (c.id === cardId ? { ...c, imageUrl } : c))
          );
          if (selectedCard?.id === cardId) {
            setSelectedCard((prev) => (prev ? { ...prev, imageUrl } : null));
          }
        }}
      />

    </div>
  );
}
