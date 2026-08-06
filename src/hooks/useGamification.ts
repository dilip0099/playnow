"use client";

import { useState, useEffect, useCallback } from "react";

const GAMIFICATION_KEY = "playthorn_gamification_v1";

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconKey: "gamepad" | "flame" | "zap" | "star" | "trophy" | "crown";
  reqXp?: number;
  reqStreak?: number;
  reqGames?: number;
}

export const ALL_BADGES: Badge[] = [
  { id: "rookie", name: "First Step", description: "Play your first game on PlayThorn", iconKey: "gamepad" },
  { id: "streak_3", name: "Streak Starter", description: "Maintain a 3-day play streak", iconKey: "flame", reqStreak: 3 },
  { id: "streak_7", name: "Weekly Warrior", description: "Maintain a 7-day play streak", iconKey: "zap", reqStreak: 7 },
  { id: "xp_100", name: "Rising Star", description: "Earn 100 XP", iconKey: "star", reqXp: 100 },
  { id: "xp_500", name: "Pro Gamer", description: "Earn 500 XP", iconKey: "trophy", reqXp: 500 },
  { id: "xp_2000", name: "Gaming Legend", description: "Earn 2000 XP", iconKey: "crown", reqXp: 2000 },
];

export interface GamificationState {
  xp: number;
  streak: number;
  lastPlayDate: string; // YYYY-MM-DD
  lastClaimDate: string; // YYYY-MM-DD
  gamesPlayedCount: number;
  unlockedBadgeIds: string[];
}

const DEFAULT_STATE: GamificationState = {
  xp: 0,
  streak: 1,
  lastPlayDate: "",
  lastClaimDate: "",
  gamesPlayedCount: 0,
  unlockedBadgeIds: [],
};

export function useGamification() {
  const [state, setState] = useState<GamificationState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [recentXpNotice, setRecentXpNotice] = useState<{ amount: number; reason: string } | null>(null);

  const getTodayString = () => new Date().toISOString().split("T")[0];

  useEffect(() => {
    try {
      const stored = localStorage.getItem(GAMIFICATION_KEY);
      if (stored) {
        const parsed: GamificationState = JSON.parse(stored);
        
        // Auto-check streak validity on load
        const today = getTodayString();
        if (parsed.lastPlayDate) {
          const lastDate = new Date(parsed.lastPlayDate);
          const currentDate = new Date(today);
          const diffDays = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

          if (diffDays > 1) {
            // Missed a day, reset streak to 1
            parsed.streak = 1;
          }
        }
        setState(parsed);
      } else {
        // Initial setup
        const initial = { ...DEFAULT_STATE, lastPlayDate: getTodayString() };
        setState(initial);
        localStorage.setItem(GAMIFICATION_KEY, JSON.stringify(initial));
      }
    } catch (e) {
      console.error("Failed to load gamification state", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveState = useCallback((newState: GamificationState) => {
    setState(newState);
    try {
      localStorage.setItem(GAMIFICATION_KEY, JSON.stringify(newState));
    } catch (e) {
      console.error("Failed to save gamification state", e);
    }
  }, []);

  const addXp = useCallback(
    (amount: number, reason: string = "Gameplay") => {
      setState((prev) => {
        const newXp = prev.xp + amount;
        const newUnlockedBadges = [...prev.unlockedBadgeIds];

        // Check badge unlocks
        ALL_BADGES.forEach((badge) => {
          if (!newUnlockedBadges.includes(badge.id)) {
            if (badge.reqXp && newXp >= badge.reqXp) {
              newUnlockedBadges.push(badge.id);
            }
            if (badge.reqStreak && prev.streak >= badge.reqStreak) {
              newUnlockedBadges.push(badge.id);
            }
            if (badge.reqGames && prev.gamesPlayedCount >= badge.reqGames) {
              newUnlockedBadges.push(badge.id);
            }
          }
        });

        const updated: GamificationState = {
          ...prev,
          xp: newXp,
          unlockedBadgeIds: newUnlockedBadges,
        };

        saveState(updated);
        return updated;
      });

      // Show brief notice
      setRecentXpNotice({ amount, reason });
      setTimeout(() => setRecentXpNotice(null), 3000);
    },
    [saveState]
  );

  const recordGameSession = useCallback(() => {
    const today = getTodayString();

    setState((prev) => {
      let newStreak = prev.streak;
      if (prev.lastPlayDate !== today) {
        if (prev.lastPlayDate) {
          const lastDate = new Date(prev.lastPlayDate);
          const currentDate = new Date(today);
          const diffDays = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

          if (diffDays === 1) {
            newStreak += 1;
          } else if (diffDays > 1) {
            newStreak = 1;
          }
        } else {
          newStreak = 1;
        }
      }

      const newGamesCount = prev.gamesPlayedCount + 1;
      const newUnlockedBadges = [...prev.unlockedBadgeIds];

      if (!newUnlockedBadges.includes("rookie")) {
        newUnlockedBadges.push("rookie");
      }

      const updated: GamificationState = {
        ...prev,
        streak: newStreak,
        lastPlayDate: today,
        gamesPlayedCount: newGamesCount,
        unlockedBadgeIds: newUnlockedBadges,
      };

      saveState(updated);
      return updated;
    });

    // Grant 10 base XP for launching game
    addXp(10, "Game Launch");
  }, [saveState, addXp]);

  const claimDailyReward = useCallback(() => {
    const today = getTodayString();
    if (state.lastClaimDate === today) return false;

    const bonusAmount = 50 + (state.streak - 1) * 15;

    setState((prev) => {
      const updated: GamificationState = {
        ...prev,
        lastClaimDate: today,
      };
      saveState(updated);
      return updated;
    });

    addXp(bonusAmount, `Daily Check-in Day ${state.streak}`);
    return true;
  }, [state.lastClaimDate, state.streak, saveState, addXp]);

  // Level calculation: Level 1 = 0-99 XP, Level 2 = 100-249 XP, etc.
  const level = Math.floor(Math.sqrt(state.xp / 50)) + 1;
  const xpForCurrentLevel = Math.pow(level - 1, 2) * 50;
  const xpForNextLevel = Math.pow(level, 2) * 50;
  const levelProgressPercent = Math.min(
    100,
    Math.max(0, ((state.xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100)
  );

  const isDailyRewardAvailable = state.lastClaimDate !== getTodayString();

  return {
    ...state,
    level,
    levelProgressPercent,
    xpForNextLevel,
    isDailyRewardAvailable,
    isLoaded,
    recentXpNotice,
    addXp,
    recordGameSession,
    claimDailyReward,
  };
}
