"use client";

import { Heart } from "lucide-react";
import { GameMetadata } from "@/types/game";
import { useFavorites } from "@/hooks/useFavorites";
import { GameCard } from "@/components/games/GameCard";
import { EmptyGamesState } from "@/components/games/EmptyGamesState";
import { Skeleton } from "@/components/ui/skeleton";
import { GAME_GRID_COLS } from "@/lib/game-grid";

interface FavoritesClientProps {
  allGames: GameMetadata[];
}

export function FavoritesClient({ allGames }: FavoritesClientProps) {
  const { favorites, isLoaded } = useFavorites();
  const favoritedGames = allGames.filter((g) => favorites.includes(g.id));

  if (!isLoaded) {
    return (
      <div className={`grid gap-4 ${GAME_GRID_COLS}`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[16/9] w-full" />
        ))}
      </div>
    );
  }

  if (favoritedGames.length === 0) {
    return (
      <EmptyGamesState
        icon={Heart}
        title="No favorites yet"
        description="Tap the heart icon on any game to save it here for quick access later."
        ctaHref="/discover"
        ctaLabel="Browse Games"
      />
    );
  }

  return (
    <div className={`grid gap-4 ${GAME_GRID_COLS}`}>
      {favoritedGames.map((game, idx) => (
        <GameCard key={game.id} game={game} priority={idx < 4} />
      ))}
    </div>
  );
}
