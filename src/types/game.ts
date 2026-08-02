import { SupportedLicense } from "../data/licenses";

export type GameCategory =
  | "action"
  | "puzzle"
  | "arcade"
  | "racing"
  | "adventure"
  | "strategy"
  | "sports"
  | "multiplayer";

export type GameClassification = "Original Game" | "Derived Game";

export type BrandRiskLevel = "LOW" | "MEDIUM" | "HIGH";
export type AssetSourceType = "Original" | "CC0" | "MIT licensed" | "Open Licensed" | "Unknown";
export type AssetVerificationStatus = "VERIFIED" | "REJECTED";

export interface GameControl {
  key: string;
  action: string;
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
  featured?: boolean;
  trending?: boolean;
  isNew?: boolean;
  releaseDate: string;
  lastUpdated: string;
  mobileSupport: boolean;
  aspectRatio?: string;
  thumbnailUrl: string;
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
  licenseChecksum: string; // SHA256
  importTimestamp: string;
  trustVerified: boolean;

  // Milestone 6 Derived Game Metadata
  gameType: GameClassification;
  originalRepository: string;
  originalAuthor: string;
  originalLicense: SupportedLicense;
  derivedTitle: string;
  modifications: string[];
  originalCommitHash: string;

  // Milestone 7 Asset & Trademark Compliance
  brandRisk: BrandRiskLevel;
  assetSource: AssetSourceType;
  commercialReady: boolean;

  // Milestone 8 Asset Provenance Verification
  assetVerificationStatus: AssetVerificationStatus;
}

export type SortOption = "popular" | "newest" | "rating" | "title";

export interface GameFilterOptions {
  category?: GameCategory | "all";
  query?: string;
  sortBy?: SortOption;
  featuredOnly?: boolean;
  trendingOnly?: boolean;
}
