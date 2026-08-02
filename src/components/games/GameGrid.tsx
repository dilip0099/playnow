"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpDown, Frown, Sparkles, SlidersHorizontal } from "lucide-react";
import { GameCard } from "./GameCard";
import { GameMetadata, SortOption } from "@/types/game";

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
        return list.sort((a, b) => b.playsCount - a.playsCount);
      case "rating":
        return list.sort((a, b) => b.rating - a.rating);
      case "newest":
        return list.sort(
          (a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
        );
      case "title":
        return list.sort((a, b) => a.title.localeCompare(b.title));
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
            <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-bold text-purple-400 border border-purple-500/20">
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
                className="rounded-xl border border-border/60 bg-card/80 py-1.5 pl-9 pr-8 text-xs font-bold text-foreground shadow-sm focus:border-purple-500 focus:outline-none appearance-none cursor-pointer"
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
        <motion.div
          layout
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence>
            {displayedGames.map((game, idx) => (
              <GameCard key={game.id} game={game} priority={idx < 4} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border p-12 text-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400">
            <Frown className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-foreground">No games found</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            We couldn't find any games matching your current filters or search terms.
          </p>
        </div>
      )}

      {/* Infinite Scroll / Load More Button */}
      {hasMore && (
        <div className="flex justify-center pt-8">
          <button
            onClick={() => setVisibleCount((prev) => prev + 12)}
            className="flex items-center space-x-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-8 py-3 text-xs font-bold text-purple-400 hover:bg-purple-500/20 transition-all hover:scale-105"
          >
            <Sparkles className="h-4 w-4" />
            <span>LOAD MORE GAMES ({sortedGames.length - visibleCount} remaining)</span>
          </button>
        </div>
      )}
    </div>
  );
}
