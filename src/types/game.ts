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
  aspectRatio?: string;
  thumbnailUrl: string;
  gameUrl: string;
  
  // Legal License Metadata (Milestone 3)
  license: SupportedLicense;
  repository: string;
  homepage: string;
  commercialUse: boolean;
  attributionRequired: boolean;
}

export type SortOption = "popular" | "newest" | "rating" | "title";

export interface GameFilterOptions {
  category?: GameCategory | "all";
  query?: string;
  sortBy?: SortOption;
  featuredOnly?: boolean;
  trendingOnly?: boolean;
}
