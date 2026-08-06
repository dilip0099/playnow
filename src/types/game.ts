import { SupportedLicense } from "../data/licenses";

export type GameCategory =
  | "action"
  | "puzzle"
  | "arcade"
  | "racing"
  | "adventure"
  | "strategy"
  | "sports"
  | "multiplayer"
  | "classic";

export type GameClassification = "Original Game" | "Derived Game" | "Licensed Game";

export type BrandRiskLevel = "LOW" | "MEDIUM" | "HIGH";
export type AssetSourceType = "Original" | "CC0" | "MIT licensed" | "Open Licensed" | "Unknown";
export type AssetVerificationStatus = "VERIFIED" | "REJECTED";

export interface GameControl {
  key: string;
  action: string;
}

export interface GameFilterOptions {
  category?: GameCategory | "all";
  search?: string;
  query?: string;
  sortBy?: SortOption;
  favoritesOnly?: boolean;
  featuredOnly?: boolean;
  trendingOnly?: boolean;
}

export interface GameMetadata {
  id: string;
  title: string;
  slug: string;
  description: string;
  instructions?: string;
  category: GameCategory;
  genre: GameCategory;
  tags: string[];
  controls: GameControl[];
  author: string;
  version: string;
  rating: number; // 0.0 to 5.0
  playsCount: number;
  views?: number;
  plays?: number;
  favorites?: number;
  featured?: boolean;
  trending?: boolean;
  isNew?: boolean;
  isExclusive?: boolean;
  isRewarded?: boolean;
  subType?: string; // Engine: WebGL, Javascript, Construct 3
  releaseDate: string;
  lastUpdated: string;
  mobileSupport: boolean;
  aspectRatio?: string;
  thumbnailUrl: string;
  coverImage?: string;
  heroImage?: string;
  screenshots: string[];
  gameUrl: string;
  
  // Legal License Metadata
  license: SupportedLicense;
  repository: string;
  homepage: string;
  commercialUse: boolean;
  attributionRequired: boolean;

  // Milestone 5 Repository Trust Metadata
  commitHash: string;
  originalCommitHash?: string;
  licenseChecksum: string;
  trustVerified?: boolean;
  importTimestamp?: string;

  // Milestone 6 Metadata
  gameType: GameClassification;
  derivedTitle?: string;
  originalTitle?: string;
  originalAuthor?: string;
  originalRepository?: string;
  originalLicense?: SupportedLicense;
  modifications?: string[];

  // Milestone 8 Asset Verification Metadata
  assetVerificationStatus: AssetVerificationStatus;
  assetSource: AssetSourceType;
  brandRisk: BrandRiskLevel;
  commercialReady: boolean;
  rejectionReason?: string;

  // Milestone 13 Monetization & Revenue Metadata
  monetizationEnabled?: boolean;
  adSupported?: boolean;
  revenueShare?: number;

  // Third-party game network sourcing (e.g. GameMonetize) — set when gameType is
  // "Licensed Game". Monetization for these is handled by the network itself
  // per its publisher agreement, not by PlayThorn's own ad stack.
  sourceNetwork?: string;
  externalGameId?: string;
}

export type SortOption = "popular" | "rating" | "newest" | "title";
