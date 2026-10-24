export interface GiftCard {
  id: string;
  brand: string;
  brandLogoType: string;
  name: string;
  denomination: string;
  badge?: string;
  quickDeliveryText?: string;
  category: 'gaming' | 'entertainment' | 'shopping' | 'tech';
  imageUrl?: string;
  cardTheme: {
    bgGradient: string;
    textColor: string;
    accentColor: string;
    subtextColor?: string;
  };
  sampleCode: string;
}

export type QualityMode = 'hd1080' | 'standard';

export interface SponsorOffer {
  id: string;
  title: string;
  description?: string;
  payout?: string;
  url?: string;
  type: 'slot' | 'wheel' | 'survey' | 'app' | 'locker';
}

export interface ContentLockerSettings {
  heading: string;
  subheading: string;
  offers: SponsorOffer[];
  customCpaUrl: string;
  cpaGripScriptUrl?: string;
  cpaGripId?: string;
  useExternalCpa: boolean;
  simulationAutoVerifyTime: number; // in seconds
  footerNote: string;
  headerBrandName: string;
  headerSubTitle: string;
  displayMode?: 'iframe' | 'offers' | 'both';
}
