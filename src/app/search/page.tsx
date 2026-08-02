"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, Suspense } from "react";
import Link from "next/link";
import { Home, ChevronRight, Search as SearchIcon, Heart } from "lucide-react";
import { filterAndSortGames, getAllGames } from "@/lib/games";
import { GameGrid } from "@/components/games/GameGrid";
import { useFavorites } from "@/hooks/useFavorites";
import { GameCategory, SortOption } from "@/types/game";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const category = (searchParams.get("category") || "all") as GameCategory | "all";
  const sortBy = (searchParams.get("sort") || "popular") as SortOption;
  const isFavoritesOnly = searchParams.get("favorites") === "true";

  const allGames = getAllGames();
  const { favorites } = useFavorites();

  const filteredGames = useMemo(() => {
    let result = filterAndSortGames({ query, category, sortBy });
    if (isFavoritesOnly) {
      result = result.filter((g) => favorites.includes(g.id));
    }
    return result;
  }, [query, category, sortBy, isFavoritesOnly, favorites]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs font-semibold text-muted-foreground">
        <Link href="/" className="flex items-center hover:text-foreground transition-colors">
          <Home className="h-3.5 w-3.5 mr-1" />
          <span>Home</span>
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-bold">
          {isFavoritesOnly ? "My Favorites" : query ? `Search: "${query}"` : "All Games"}
        </span>
      </nav>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground flex items-center space-x-3">
            {isFavoritesOnly ? (
              <>
                <Heart className="h-7 w-7 text-pink-500 fill-pink-500" />
                <span>My Favorite Games</span>
              </>
            ) : query ? (
              <>
                <SearchIcon className="h-7 w-7 text-purple-400" />
                <span>Search Results for "{query}"</span>
              </>
            ) : (
              <span>Browse Catalog</span>
            )}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Found {filteredGames.length} matching browser game{filteredGames.length === 1 ? "" : "s"}.
          </p>
        </div>
      </div>

      {/* Games Grid */}
      <GameGrid games={filteredGames} title="Search Results" showFilters={true} />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-muted-foreground">Loading Search Results...</div>}>
      <SearchContent />
    </Suspense>
  );
}
