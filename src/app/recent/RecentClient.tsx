"use client";

import { Clock } from "lucide-react";
import { GameMetadata } from "@/types/game";
import { useRecentlyPlayed } from "@/hooks/useRecentlyPlayed";
import { GameCard } from "@/components/games/GameCard";
import { EmptyGamesState } from "@/components/games/EmptyGamesState";
import { Skeleton } from "@/components/ui/skeleton";
import { GAME_GRID_COLS } from "@/lib/game-grid";

interface RecentClientProps {
  allGames: GameMetadata[];
}

export function RecentClient({ allGames }: RecentClientProps) {
  const { recentlyPlayed, isLoaded } = useRecentlyPlayed();
  const gamesById = new Map(allGames.map((g) => [g.id, g]));
  const recentGames = recentlyPlayed
    .map((id) => gamesById.get(id))
    .filter((g): g is GameMetadata => Boolean(g));

  if (!isLoaded) {
    return (
      <div className={`grid gap-4 ${GAME_GRID_COLS}`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[16/9] w-full" />
        ))}
      </div>
    );
  }

  if (recentGames.length === 0) {
    return (
      <EmptyGamesState
        icon={Clock}
        title="No recent sessions yet"
        description="Games you play will show up here automatically so you can jump back in."
        ctaHref="/discover"
        ctaLabel="Browse Games"
      />
    );
  }

  return (
    <div className={`grid gap-4 ${GAME_GRID_COLS}`}>
      {recentGames.map((game, idx) => (
        <GameCard key={game.id} game={game} priority={idx < 4} />
      ))}
    </div>
  );
}
