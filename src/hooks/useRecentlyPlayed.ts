"use client";

import { useState, useEffect, useCallback } from "react";

const RECENTLY_PLAYED_KEY = "gamehub_recently_played";
const MAX_RECENT_ITEMS = 10;

export function useRecentlyPlayed() {
  const [recentlyPlayed, setRecentlyPlayed] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENTLY_PLAYED_KEY);
      if (stored) {
        setRecentlyPlayed(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load recently played games", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const addRecentlyPlayed = useCallback((gameId: string) => {
    setRecentlyPlayed((prev) => {
      const filtered = prev.filter((id) => id !== gameId);
      const updated = [gameId, ...filtered].slice(0, MAX_RECENT_ITEMS);

      try {
        localStorage.setItem(RECENTLY_PLAYED_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save recently played game", e);
      }
      return updated;
    });
  }, []);

  return { recentlyPlayed, addRecentlyPlayed, isLoaded };
}
