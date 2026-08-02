"use client";

import { useState, useMemo } from "react";
import { ArrowUpDown, Frown, SlidersHorizontal } from "lucide-react";
import { GameCard } from "./GameCard";
import { EmptyGamesState } from "./EmptyGamesState";
import { GameMetadata, SortOption } from "@/types/game";
import { GAME_GRID_COLS } from "@/lib/game-grid";

interface GameGridProps {
  games: GameMetadata[];
  title?: string;
  showFilters?: boolean;
  initialSort?: SortOption;
}

export function GameGrid({
  games,
  title = "All Games",
  showFilters = true,
  initialSort = "popular",
}: GameGridProps) {
  const [sortBy, setSortBy] = useState<SortOption>(initialSort);
  const [visibleCount, setVisibleCount] = useState<number>(12);

  const sortedGames = useMemo(() => {
    const list = [...games];
    switch (sortBy) {
      case "popular":
        return list.sort((a, b) => (b.playsCount || 0) - (a.playsCount || 0));
      case "rating":
        return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "newest":
        return list.sort(
          (a, b) => new Date(b.releaseDate || 0).getTime() - new Date(a.releaseDate || 0).getTime()
        );
      case "title":
        return list.sort((a, b) => String(a.title || "").localeCompare(String(b.title || "")));
      default:
        return list;
    }
  }, [games, sortBy]);

  const displayedGames = sortedGames.slice(0, visibleCount);
  const hasMore = visibleCount < sortedGames.length;

  return (
    <div className="w-full space-y-6">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight flex items-center space-x-2">
            <span>{title}</span>
            <span className="rounded-full bg-secondary/10 px-2.5 py-0.5 text-xs font-bold text-violet-300 border border-secondary/20">
              {sortedGames.length}
            </span>
          </h2>
        </div>

        {showFilters && (
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center">
              <SlidersHorizontal className="absolute left-3 h-3.5 w-3.5 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="rounded-xl border border-border/60 bg-card/80 py-1.5 pl-9 pr-8 text-xs font-bold text-foreground shadow-sm focus:border-primary focus:outline-none appearance-none cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
                <option value="title">Alphabetical</option>
              </select>
              <ArrowUpDown className="absolute right-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      {/* Game Cards Grid */}
      {displayedGames.length > 0 ? (
        <div className={`grid gap-4 ${GAME_GRID_COLS}`}>
          {displayedGames.map((game, idx) => (
            <div key={game.id || idx} className="transition-all duration-300">
              <GameCard game={game} priority={idx < 4} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyGamesState
          icon={Frown}
          title="No games found"
          description="Try selecting a different category or adjusting your search filters."
        />
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center pt-6">
          <button
            onClick={() => setVisibleCount((prev) => prev + 12)}
            className="rounded-2xl border border-primary/30 bg-primary/10 px-8 py-3 text-xs font-bold text-primary hover:bg-primary hover:text-primary-foreground shadow-lg transition-all hover:scale-105"
          >
            Load More Games ({sortedGames.length - visibleCount} remaining)
          </button>
        </div>
      )}

    </div>
  );
}
