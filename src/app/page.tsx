"use client";

import { useState, useMemo } from "react";
import { HeroSection } from "@/components/games/HeroSection";
import { CategoryBar } from "@/components/games/CategoryBar";
import { GameGrid } from "@/components/games/GameGrid";
import { GameCard } from "@/components/games/GameCard";
import { getAllGames, getFeaturedGames, getTrendingGames } from "@/lib/games";
import { useRecentlyPlayed } from "@/hooks/useRecentlyPlayed";
import { Flame, Clock, Sparkles, Shield, Zap, Laptop } from "lucide-react";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const allGames = getAllGames();
  const featuredGames = getFeaturedGames();
  const trendingGames = getTrendingGames();
  const { recentlyPlayed } = useRecentlyPlayed();

  const heroGame = featuredGames.length > 0 ? featuredGames[0] : allGames[0];

  const filteredGames = useMemo(() => {
    if (selectedCategory === "all") return allGames;
    return allGames.filter(
      (g) => g.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [allGames, selectedCategory]);

  const recentlyPlayedGames = useMemo(() => {
    return recentlyPlayed
      .map((id) => allGames.find((g) => g.id === id))
      .filter((g): g is typeof allGames[0] => g !== undefined);
  }, [allGames, recentlyPlayed]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Hero Banner Section */}
      <HeroSection featuredGame={heroGame} />

      {/* Category Pills Bar */}
      <div className="space-y-4">
        <CategoryBar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {/* Recently Played Section (If any exist) */}
      {recentlyPlayedGames.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-purple-400" />
            <h2 className="text-xl font-black text-foreground">Recently Played</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentlyPlayedGames.map((game) => (
              <GameCard key={`recent-${game.id}`} game={game} />
            ))}
          </div>
        </section>
      )}

      {/* Trending Games Section */}
      {selectedCategory === "all" && trendingGames.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Flame className="h-5 w-5 text-amber-400 fill-amber-400" />
              <h2 className="text-xl sm:text-2xl font-black text-foreground">
                Trending Games
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingGames.map((game) => (
              <GameCard key={`trending-${game.id}`} game={game} />
            ))}
          </div>
        </section>
      )}

      {/* Main Game Grid Section */}
      <section className="pt-4">
        <GameGrid
          games={filteredGames}
          title={
            selectedCategory === "all"
              ? "All Browser Games"
              : `${selectedCategory.toUpperCase()} Games`
          }
          showFilters={true}
        />
      </section>

      {/* Portal Highlights & Features Info Section */}
      <section className="rounded-3xl border border-border/60 bg-card/40 p-8 sm:p-10 backdrop-blur-md">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-8">
          <span className="rounded-full bg-cyan-500/10 px-3.5 py-1 text-xs font-bold text-cyan-400 border border-cyan-500/20">
            NEXT-GEN GAMING PORTAL
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">
            Why Play on GameHub?
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            GameHub delivers high-performance HTML5 canvas games directly in your browser. No downloads, zero ads, and instant cross-device compatibility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-border/40 bg-muted/30 p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-foreground">Instant Loading</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Launch and play games in milliseconds without installing app stores or waiting for downloads.
            </p>
          </div>

          <div className="rounded-2xl border border-border/40 bg-muted/30 p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-foreground">Safe & Sandboxed</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              All HTML5 games execute inside strictly enforced browser sandboxes to ensure high security and privacy.
            </p>
          </div>

          <div className="rounded-2xl border border-border/40 bg-muted/30 p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <Laptop className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-foreground">Responsive Everywhere</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Play seamlessly on desktop, laptop, mobile, or tablet with responsive canvas controls.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
