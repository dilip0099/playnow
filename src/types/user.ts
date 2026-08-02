export type UserRole = "player" | "developer" | "admin";

export interface UserFavorite {
  gameId: string;
  addedAt: string;
}

export interface RecentlyPlayedGame {
  gameId: string;
  playedAt: string;
  durationSeconds?: number;
  lastScore?: number;
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
  joinedDate: string;
  bio?: string;
  favorites: UserFavorite[];
  recentlyPlayed: RecentlyPlayedGame[];
}
