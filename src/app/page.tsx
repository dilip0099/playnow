"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { CinematicHero } from "@/components/home/CinematicHero";
import { TrendingCarousel } from "@/components/home/TrendingCarousel";
import { FeaturedCollections } from "@/components/home/FeaturedCollections";
import { GameGrid } from "@/components/games/GameGrid";
import { getAllGames, getFeaturedGames, getTrendingGames } from "@/lib/games";

const CATEGORIES = [
  { slug: "action", name: "Action" },
  { slug: "arcade", name: "Arcade" },
  { slug: "puzzle", name: "Puzzle" },
  { slug: "strategy", name: "Strategy" },
  { slug: "adventure", name: "Adventure" },
];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const allGames = getAllGames();
  const featuredGames = getFeaturedGames();
  const trendingGames = getTrendingGames();

  const filteredGames = useMemo(() => {
    if (selectedCategory === "all") return allGames;
    return allGames.filter(
      (g) => g.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [allGames, selectedCategory]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-12 bg-[#050505]">
      
      {/* 80vh Cinematic Hero Banner */}
      <CinematicHero games={featuredGames.length > 0 ? featuredGames : allGames} />

      {/* Netflix Horizontal Trending Carousel */}
      <TrendingCarousel games={trendingGames.length > 0 ? trendingGames : allGames} />

      {/* 3 Featured Collection Highlight Cards */}
      <FeaturedCollections />

      {/* Minimal Category Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-2 pt-2 border-t border-white/5">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`rounded-full px-5 py-2 text-xs font-bold transition-all whitespace-nowrap ${
            selectedCategory === "all"
              ? "bg-white text-black shadow-lg"
              : "bg-[#121212] text-zinc-400 border border-white/5 hover:text-white"
          }`}
        >
          All Games
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`rounded-full px-5 py-2 text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === cat.slug
                ? "bg-white text-black shadow-lg"
                : "bg-[#121212] text-zinc-400 border border-white/5 hover:text-white"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Steam Style Main Storefront Game Grid */}
      <section className="space-y-6">
        <GameGrid
          games={filteredGames}
          title={
            selectedCategory === "all"
              ? "Recently Added Games"
              : `${selectedCategory.toUpperCase()} Games`
          }
          showFilters={true}
        />
      </section>

    </div>
  );
}
