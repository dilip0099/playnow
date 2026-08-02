export type AdProvider = "Google AdSense" | "PlayNow Direct Ad Network" | "Unity Ads" | "Custom Direct Sponsor";

export type AdPlacementType = "homepage_banner" | "game_banner" | "loading_screen" | "rewarded_ad";

export interface AdPlacement {
  id: string;
  placementType: AdPlacementType;
  provider: AdProvider;
  width: number;
  height: number;
  enabled: boolean;
}

export interface AdImpression {
  id: string;
  gameId: string;
  placementType: AdPlacementType;
  timestamp: string;
  cpm: number;
  revenue: number;
}

export interface AdClick {
  id: string;
  gameId: string;
  placementType: AdPlacementType;
  timestamp: string;
  cpc: number;
  revenue: number;
}
