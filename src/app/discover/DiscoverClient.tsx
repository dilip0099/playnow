"use client";

import { useState, useMemo } from "react";
import { LayoutGrid, List, Star, SlidersHorizontal } from "lucide-react";
import { GameMetadata, SortOption } from "@/types/game";
import { GameCard } from "@/components/games/GameCard";
import { Dialog } from "@/components/ui/dialog";
import { GAME_GRID_COLS } from "@/lib/game-grid";

interface DiscoverClientProps {
  initialGames: GameMetadata[];
}

const GENRE_FILTERS = [
  { name: "Action / Combat", key: "action" },
  { name: "Deep Strategy", key: "strategy" },
  { name: "Brain Puzzles", key: "puzzle" },
  { name: "Speed Racing", key: "racing" },
  { name: "Epic Adventure", key: "adventure" },
  { name: "Arcade Classic", key: "arcade" },
  { name: "Arena Sports", key: "sports" },
  { name: "Multiplayer Hub", key: "multiplayer" },
  { name: "Board & Card Classics", key: "classic" },
];

interface FilterControlsProps {
  selectedGenre: string | null;
  setSelectedGenre: (value: string | null) => void;
  topRatedOnly: boolean;
  setTopRatedOnly: (value: boolean) => void;
  selectedTag: string | null;
  setSelectedTag: (value: string | null) => void;
  webGlOnly: boolean;
  setWebGlOnly: (value: boolean) => void;
}

function FilterControls({
  selectedGenre,
  setSelectedGenre,
  topRatedOnly,
  setTopRatedOnly,
  selectedTag,
  setSelectedTag,
  webGlOnly,
  setWebGlOnly,
}: FilterControlsProps) {
  const POPULAR_TAGS = ["3d", "physics", "multiplayer", "guns", "car", "puzzle"];

  return (
    <>
      {/* Genre Registry */}
      <div className="space-y-3">
        <span className="text-primary text-[10px] font-bold uppercase tracking-widest font-mono">GENRE REGISTRY</span>
        <div className="space-y-1.5">
          {GENRE_FILTERS.map((genre) => (
            <button
              key={genre.key}
              onClick={() => setSelectedGenre(selectedGenre === genre.key ? null : genre.key)}
              aria-pressed={selectedGenre === genre.key}
              className={`flex items-center space-x-2.5 w-full text-left py-1.5 text-xs font-bold font-mono transition-colors ${
                selectedGenre === genre.key ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className={`h-3 w-3 rounded-sm ${selectedGenre === genre.key ? "bg-primary" : "bg-muted"}`} />
              <span>{genre.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Engine & Quality Filters */}
      <div className="mt-6 space-y-3">
        <span className="text-primary text-[10px] font-bold uppercase tracking-widest font-mono">ENGINE & QUALITY</span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setWebGlOnly(!webGlOnly)}
            aria-pressed={webGlOnly}
            className={`flex items-center space-x-1.5 rounded-full border px-2.5 py-1 font-mono font-bold text-[10px] transition-colors ${
              webGlOnly
                ? "border-amber-400 bg-amber-400/10 text-amber-400"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>🎮 3D WebGL HD</span>
          </button>
          <button
            onClick={() => setTopRatedOnly(!topRatedOnly)}
            aria-pressed={topRatedOnly}
            className={`flex items-center space-x-1.5 rounded-full border px-2.5 py-1 font-mono font-bold text-[10px] transition-colors ${
              topRatedOnly
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <Star className={`h-3 w-3 ${topRatedOnly ? "fill-current" : ""}`} aria-hidden="true" />
            <span>4.5+ Top Rated</span>
          </button>
        </div>
      </div>

      {/* Dynamic Tags */}
      <div className="mt-6 space-y-3">
        <span className="text-primary text-[10px] font-bold uppercase tracking-widest font-mono">POPULAR TAGS</span>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold transition-all ${
                selectedTag === tag
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export function DiscoverClient({ initialGames }: DiscoverClientProps) {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [topRatedOnly, setTopRatedOnly] = useState(false);
  const [webGlOnly, setWebGlOnly] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [visibleCount, setVisibleCount] = useState(21);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

  const activeFilterCount = (selectedGenre ? 1 : 0) + (topRatedOnly ? 1 : 0) + (webGlOnly ? 1 : 0) + (selectedTag ? 1 : 0);

  const topTrending = useMemo(
    () => [...initialGames].sort((a, b) => b.playsCount - a.playsCount)[0],
    [initialGames]
  );

  const filteredGames = useMemo(() => {
    let result = [...initialGames];
    if (selectedGenre) {
      result = result.filter((g) => g.category.toLowerCase() === selectedGenre.toLowerCase());
    }
    if (topRatedOnly) {
      result = result.filter((g) => g.rating >= 4.5);
    }
    if (webGlOnly) {
      result = result.filter((g) => (g.subType || "").toLowerCase().includes("webgl"));
    }
    if (selectedTag) {
      result = result.filter((g) =>
        (g.tags || []).some((t) => t.toLowerCase() === selectedTag.toLowerCase())
      );
    }
    switch (sortBy) {
      case "popular": return result.sort((a, b) => b.playsCount - a.playsCount);
      case "rating": return result.sort((a, b) => b.rating - a.rating);
      case "newest": return result.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
      default: return result;
    }
  }, [initialGames, selectedGenre, topRatedOnly, sortBy]);

  const visibleGames = filteredGames.slice(0, visibleCount);
  const remainingCount = Math.max(0, filteredGames.length - visibleCount);

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ═══ CATALOG STATUS BAR ═══ */}
      <div className="border-b border-border bg-shell px-4 sm:px-6 lg:px-8 py-3">
        <div className="mx-auto max-w-[1800px] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center space-x-8">
            <div>
              <span className="text-primary text-[10px] font-bold uppercase tracking-widest block">CATALOG</span>
              <span className="text-foreground font-black text-lg flex items-center">
                {initialGames.length} <span className="text-muted-foreground font-normal ml-1.5 text-xs">Games Available</span>
              </span>
            </div>
            <div className="hidden sm:block">
              <span className="text-muted-foreground text-[10px] block uppercase">MOST PLAYED</span>
              <span className="text-foreground/80 font-bold">{topTrending?.derivedTitle || topTrending?.title}</span>
            </div>
          </div>

          {/* Mobile/Tablet Filter Trigger — the genre/rating sidebar is desktop-only (lg+) */}
          <button
            onClick={() => setIsFilterDialogOpen(true)}
            aria-haspopup="dialog"
            className="relative flex items-center space-x-1.5 rounded-lg border border-border bg-card px-3 py-1.5 font-bold text-xs text-foreground/80 transition-colors hover:bg-accent lg:hidden"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="ml-1 rounded-full bg-primary px-1.5 py-0.2 font-mono text-[9px] font-black text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Grid/List toggle */}
          <div className="flex items-center space-x-1 bg-card rounded-lg p-1 border border-border">
            <button
              onClick={() => setViewMode("grid")}
              aria-pressed={viewMode === "grid"}
              aria-label="Grid view"
              className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              aria-pressed={viewMode === "list"}
              aria-label="List view"
              className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Filter Dialog — same controls as the desktop sidebar below */}
      <Dialog open={isFilterDialogOpen} onClose={() => setIsFilterDialogOpen(false)} title="Filter Games">
        <FilterControls
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          topRatedOnly={topRatedOnly}
          setTopRatedOnly={setTopRatedOnly}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          webGlOnly={webGlOnly}
          setWebGlOnly={setWebGlOnly}
        />
        <button
          onClick={() => setIsFilterDialogOpen(false)}
          className="mt-6 w-full rounded-xl bg-primary py-3 font-mono text-xs font-bold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          Show {filteredGames.length} Games
        </button>
      </Dialog>

      <div className="mx-auto max-w-[1800px] px-3 sm:px-6 lg:px-8 py-3.5 sm:py-8">
        <div className="flex gap-8">

          {/* ═══ LEFT SIDEBAR: Genre Registry + Filters (desktop only) ═══ */}
          <aside className="hidden lg:block w-52 flex-shrink-0 space-y-8 font-mono">
            <FilterControls
              selectedGenre={selectedGenre}
              setSelectedGenre={setSelectedGenre}
              topRatedOnly={topRatedOnly}
              setTopRatedOnly={setTopRatedOnly}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
              webGlOnly={webGlOnly}
              setWebGlOnly={setWebGlOnly}
            />
          </aside>

          {/* ═══ MAIN CONTENT: Game Grid ═══ */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* Game Cards Grid / List */}
            <div className={`grid gap-4 ${viewMode === "grid" ? GAME_GRID_COLS : "grid-cols-1"}`}>
              {visibleGames.map((game, idx) => (
                <GameCard
                  key={game.id}
                  game={game}
                  aspectRatio="16/9"
                  priority={idx < 6}
                  layout={viewMode}
                />
              ))}
            </div>

            {/* Load More */}
            {remainingCount > 0 && (
              <div className="space-y-3 text-center">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 12)}
                  className="w-full rounded-2xl border border-border bg-card py-4 font-mono text-xs font-bold text-foreground/80 hover:text-primary hover:border-primary/30 transition-all uppercase tracking-wider"
                >
                  LOAD {Math.min(remainingCount, 12)} MORE TITLES
                </button>
                <p className="font-mono text-[10px] text-muted-foreground">
                  Showing {visibleCount} of {filteredGames.length} Games
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
