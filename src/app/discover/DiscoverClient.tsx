"use client";

import { useState, useMemo } from "react";
import { Search, Compass, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { GameMetadata, SortOption } from "@/types/game";
import { GameCard } from "@/components/games/GameCard";
import { Input } from "@/components/ui/input";

interface DiscoverClientProps {
  initialGames: GameMetadata[];
}

const CATEGORIES = [
  "all",
  "arcade",
  "puzzle",
  "action",
  "strategy",
  "racing",
  "sports",
  "platformer",
  "adventure",
  "classic",
];

export function DiscoverClient({ initialGames }: DiscoverClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption | "trending" | "updated">("popular");

  const filteredAndSortedGames = useMemo(() => {
    let result = [...initialGames];

    // Category Filter
    if (selectedCategory !== "all") {
      result = result.filter((g) => g.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.author.toLowerCase().includes(q) ||
          g.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sorting
    switch (sortBy) {
      case "popular":
        return result.sort((a, b) => (b.playsCount || 0) - (a.playsCount || 0));
      case "rating":
        return result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "newest":
        return result.sort(
          (a, b) => new Date(b.releaseDate || 0).getTime() - new Date(a.releaseDate || 0).getTime()
        );
      case "trending":
        return result.sort((a, b) => Number(b.trending) - Number(a.trending));
      case "updated":
        return result.sort(
          (a, b) => new Date(b.lastUpdated || 0).getTime() - new Date(a.lastUpdated || 0).getTime()
        );
      default:
        return result;
    }
  }, [initialGames, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header Banner */}
      <div className="space-y-2 border-b border-border/60 pb-6">
        <div className="flex items-center space-x-2">
          <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400 border border-cyan-500/20 flex items-center space-x-1">
            <Compass className="h-3.5 w-3.5 mr-1" />
            <span>Discover Portal</span>
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Explore Full Game Catalog</h1>
        <p className="text-sm text-slate-300">
          Search and filter through our verified open-source HTML5 browser games repository.
        </p>
      </div>

      {/* Filter & Search Bar Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-card/60 p-4 rounded-2xl border border-border/60 backdrop-blur-md">
        
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, author, or tag..."
            className="pl-10 rounded-xl bg-slate-900/80 border-border/60 text-sm text-white"
          />
        </div>

        {/* Sort By Selector */}
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative flex items-center w-full sm:w-auto">
            <SlidersHorizontal className="absolute left-3 h-3.5 w-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full sm:w-auto rounded-xl border border-border/60 bg-slate-900/80 py-2 pl-9 pr-8 text-xs font-bold text-white focus:outline-none appearance-none cursor-pointer"
            >
              <option value="popular">Most Played</option>
              <option value="trending">Trending</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest First</option>
              <option value="updated">Recently Updated</option>
            </select>
            <ArrowUpDown className="absolute right-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-xs font-bold capitalize transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                : "bg-slate-900 text-slate-400 border border-border/60 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results Count & Grid */}
      <div className="space-y-4">
        <div className="text-xs font-semibold text-slate-400">
          Showing <strong className="text-white">{filteredAndSortedGames.length}</strong> games
        </div>

        {filteredAndSortedGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-border p-12 text-center text-slate-400 space-y-2">
            <h3 className="text-lg font-bold text-white">No matching games found</h3>
            <p className="text-xs">Try adjusting your category filter or search query.</p>
          </div>
        )}
      </div>

    </div>
  );
}
