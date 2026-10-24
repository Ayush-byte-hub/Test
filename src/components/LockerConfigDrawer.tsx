import React, { useState } from 'react';
import { ContentLockerSettings, SponsorOffer, GiftCard } from '../types';
import { Settings, X, Plus, Trash2, Link, Save, Check, Image as ImageIcon } from 'lucide-react';

interface LockerConfigDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ContentLockerSettings;
  onSave: (newSettings: ContentLockerSettings) => void;
  cards?: GiftCard[];
  onUpdateCardImage?: (cardId: string, imageUrl: string) => void;
}

export const LockerConfigDrawer: React.FC<LockerConfigDrawerProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
  cards = [],
  onUpdateCardImage,
}) => {
  const [activeTab, setActiveTab] = useState<'locker' | 'assets'>('locker');
  const [formData, setFormData] = useState<ContentLockerSettings>(settings);
  const [newOfferTitle, setNewOfferTitle] = useState<string>('');
  const [savedNotice, setSavedNotice] = useState<boolean>(false);

  // Asset manager state
  const [selectedCardId, setSelectedCardId] = useState<string>(cards[0]?.id || '');
  const [customImageUrl, setCustomImageUrl] = useState<string>('');
  const [assetSavedNotice, setAssetSavedNotice] = useState<boolean>(false);

  const handleAddOffer = () => {
    if (!newOfferTitle.trim()) return;
    const newOffer: SponsorOffer = {
      id: `offer-${Date.now()}`,
      title: newOfferTitle.trim(),
      type: 'survey',
    };
    setFormData((prev) => ({
      ...prev,
      offers: [...prev.offers, newOffer],
    }));
    setNewOfferTitle('');
  };

  const handleRemoveOffer = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      offers: prev.offers.filter((o) => o.id !== id),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 1000);
  };

  const handleSaveCardImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateCardImage && selectedCardId && customImageUrl.trim()) {
      onUpdateCardImage(selectedCardId, customImageUrl.trim());
      setAssetSavedNotice(true);
      setTimeout(() => setAssetSavedNotice(false), 2000);
      setCustomImageUrl('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-sky-100 text-sky-700 rounded-xl">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Giveaway Settings</h3>
              <p className="text-xs text-slate-500">Configure locker & custom card pics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('locker')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'locker'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Content Locker & CPA
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('assets')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'assets'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-sky-600" />
            <span>Card Pictures</span>
          </button>
        </div>

        {activeTab === 'locker' ? (
          /* Form Body */
          <form onSubmit={handleSubmit} className="p-5 space-y-6 flex-1 text-sm">
            {/* Header Branding */}
            <div className="space-y-3">
              <label className="font-bold text-slate-800 text-xs uppercase tracking-wider block">
                Header Branding
              </label>
              <div>
                <span className="text-xs text-slate-600 mb-1 block">Brand Title</span>
                <input
                  type="text"
                  value={formData.headerBrandName}
                  onChange={(e) => setFormData({ ...formData, headerBrandName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-sky-400 outline-none"
                />
              </div>
              <div>
                <span className="text-xs text-slate-600 mb-1 block">Header Subtitle</span>
                <input
                  type="text"
                  value={formData.headerSubTitle}
                  onChange={(e) => setFormData({ ...formData, headerSubTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-sky-400 outline-none"
                />
              </div>
            </div>

            {/* Modal Text Settings */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <label className="font-bold text-slate-800 text-xs uppercase tracking-wider block">
                Content Locker Modal Copy
              </label>
              <div>
                <span className="text-xs text-slate-600 mb-1 block">Modal Heading</span>
                <input
                  type="text"
                  value={formData.heading}
                  onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-sky-400 outline-none"
                />
              </div>
              <div>
                <span className="text-xs text-slate-600 mb-1 block">Modal Subheading</span>
                <textarea
                  rows={2}
                  value={formData.subheading}
                  onChange={(e) => setFormData({ ...formData, subheading: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-sky-400 outline-none resize-none"
                />
              </div>
            </div>

            {/* External CPA Network / Content Locker Link */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <label className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Link className="w-3.5 h-3.5 text-sky-600" />
                <span>External CPA Network Locker URL</span>
              </label>
              <p className="text-xs text-slate-500">
                If you have your own CPAGrip, CPABuild, OGAds, AdWorkMedia, or custom locker script URL, paste it below.
              </p>
              <input
                type="url"
                placeholder="https://clickanlook.space/iframe/8f73ca02-cf5e-11f1-98c9-129a1c289511?if=1"
                value={formData.customCpaUrl}
                onChange={(e) => setFormData({ ...formData, customCpaUrl: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-sky-400 outline-none"
              />
              <label className="flex items-center gap-2 cursor-pointer mt-1">
                <input
                  type="checkbox"
                  checked={formData.useExternalCpa}
                  onChange={(e) => setFormData({ ...formData, useExternalCpa: e.target.checked })}
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-700">
                  Directly open external URL when user clicks sponsor offer
                </span>
              </label>
            </div>

            {/* Sponsor Offers Management */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <label className="font-bold text-slate-800 text-xs uppercase tracking-wider block">
                Sponsor Offers in Locker
              </label>
              <div className="space-y-2">
                {formData.offers.map((offer) => (
                  <div
                    key={offer.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-2"
                  >
                    <span className="text-xs font-semibold text-slate-800 flex-1 leading-snug">
                      {offer.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveOffer(offer.id)}
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Offer */}
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  placeholder="New offer label..."
                  value={newOfferTitle}
                  onChange={(e) => setNewOfferTitle(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-sky-400"
                />
                <button
                  type="button"
                  onClick={handleAddOffer}
                  className="px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="pt-4 border-t border-slate-100 sticky bottom-0 bg-white pb-3">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-sky-500/20 hover:from-sky-600 hover:to-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {savedNotice ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                <span>{savedNotice ? 'Saved Successfully!' : 'Save Locker Configuration'}</span>
              </button>
            </div>
          </form>
        ) : (
          /* Card Pictures & Assets Manager */
          <div className="p-5 space-y-5 flex-1 text-sm">
            <div>
              <h4 className="font-bold text-slate-800 text-sm mb-1">
                Custom Card Picture URLs
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                All gift cards already include built-in authentic picture artwork matching the video. You can also replace any specific card with your own image URL.
              </p>
            </div>

            <form onSubmit={handleSaveCardImage} className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Select Gift Card to Update:
                </label>
                <select
                  value={selectedCardId}
                  onChange={(e) => setSelectedCardId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-sky-400 outline-none"
                >
                  {cards.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.denomination})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Custom Picture Image URL:
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/roblox-giftcard.jpg"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-sky-400 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {assetSavedNotice ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
                <span>{assetSavedNotice ? 'Picture Updated!' : 'Apply Picture to Card'}</span>
              </button>
            </form>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-700 block">
                Current Gift Cards Active ({cards.length}):
              </span>
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                {cards.map((c) => (
                  <div key={c.id} className="p-2 bg-white border border-slate-200 rounded-xl text-[11px] flex items-center justify-between">
                    <span className="font-bold truncate">{c.name}</span>
                    <span className="text-slate-400 font-semibold">{c.denomination}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
