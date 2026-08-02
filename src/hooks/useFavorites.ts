"use client";

import { useState, useEffect, useCallback } from "react";

const FAVORITES_STORAGE_KEY = "gamehub_favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load favorites from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const toggleFavorite = useCallback((gameId: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(gameId)
        ? prev.filter((id) => id !== gameId)
        : [...prev, gameId];

      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save favorites to localStorage", e);
      }
      return updated;
    });
  }, []);

  const isFavorite = useCallback(
    (gameId: string) => favorites.includes(gameId),
    [favorites]
  );

  return { favorites, isFavorite, toggleFavorite, isLoaded };
}
