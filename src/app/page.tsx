"use client";

import { useState, useMemo } from "react";
import { FeaturedHeroSlider } from "@/components/home/FeaturedHeroSlider";
import { CategoriesGrid } from "@/components/home/CategoriesGrid";
import { EditorPicks } from "@/components/home/EditorPicks";
import { CategoryBar } from "@/components/games/CategoryBar";
import { GameGrid } from "@/components/games/GameGrid";
import { GameCard } from "@/components/games/GameCard";
import { getAllGames, getFeaturedGames, getTrendingGames } from "@/lib/games";
import { useRecentlyPlayed } from "@/hooks/useRecentlyPlayed";
import { Flame, Clock, ShieldCheck, Sparkles, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const allGames = getAllGames();
  const featuredGames = getFeaturedGames();
  const trendingGames = getTrendingGames();
  const { recentlyPlayed } = useRecentlyPlayed();

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
      
      {/* Cinematic Featured Hero Banner Slider */}
      <FeaturedHeroSlider featuredGames={featuredGames.length > 0 ? featuredGames : allGames} />

      {/* Category Icons Grid */}
      <CategoriesGrid />

      {/* Recently Played Section (If any exist) */}
      {recentlyPlayedGames.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-purple-400" />
            <h2 className="text-xl font-black text-white">Continue Playing</h2>
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
              <Flame className="h-5 w-5 text-rose-500 fill-rose-500" />
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Trending on GameHub
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingGames.map((game) => (
              <GameCard key={`trending-${game.id}`} game={game} />
            ))}
          </div>
        </section>
      )}

      {/* Editor Picks & Developer Spotlight */}
      <EditorPicks games={allGames} />

      {/* Category Bar & Main Game Grid Section */}
      <section className="space-y-6 pt-4 border-t border-border/40">
        <div className="space-y-4">
          <CategoryBar
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        <GameGrid
          games={filteredGames}
          title={
            selectedCategory === "all"
              ? "All Open-Source Games"
              : `${selectedCategory.toUpperCase()} Games`
          }
          showFilters={true}
        />
      </section>

      {/* Trust & Legal Compliance Platform Banner */}
      <Card className="rounded-3xl border border-border/60 bg-card/40 p-8 sm:p-10 backdrop-blur-md">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
            COMMERCIAL COMPLIANCE GUARANTEE
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            100% Permissive Open Source & Verified Provenance
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            GameHub guarantees commercial licensing readiness. Every hosted HTML5 game retains explicit open-source licenses (MIT, Apache-2.0, BSD), Git commit authentication, independent asset SHA256 hashes, and zero trademark infringement.
          </p>
        </div>
      </Card>

    </div>
  );
}
