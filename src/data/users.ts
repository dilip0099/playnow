import { UserProfile } from "../types/user";

export const MOCK_USERS: UserProfile[] = [
  {
    id: "user-1",
    username: "cyber_gamer_99",
    displayName: "Alex Rivers",
    email: "alex@gamehub.local",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=cyber_gamer_99",
    role: "player",
    joinedDate: "2025-11-10",
    bio: "Hardcore retro canvas arcade enthusiast.",
    favorites: [
      { gameId: "2048-fusion", addedAt: "2026-01-15T10:00:00Z" },
      { gameId: "cyber-runner", addedAt: "2026-01-20T14:30:00Z" },
    ],
    recentlyPlayed: [
      { gameId: "2048-fusion", playedAt: "2026-02-01T18:20:00Z", lastScore: 4096 },
      { gameId: "neon-snake", playedAt: "2026-02-01T17:10:00Z", lastScore: 1850 },
    ],
  },
  {
    id: "user-2",
    username: "dev_soren",
    displayName: "Soren Cole",
    email: "soren@gamehub.local",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=dev_soren",
    role: "developer",
    joinedDate: "2025-08-01",
    bio: "Open-source HTML5 game developer & shader wizard.",
    favorites: [
      { gameId: "pong-championship", addedAt: "2026-01-05T09:12:00Z" },
    ],
    recentlyPlayed: [
      { gameId: "pong-championship", playedAt: "2026-02-01T19:00:00Z", lastScore: 10 },
    ],
  },
];

export function getDefaultUser(): UserProfile {
  return MOCK_USERS[0];
}
