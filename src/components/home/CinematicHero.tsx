"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Play, Plus, Star, Users, Flame, ChevronRight } from "lucide-react";
import { GameMetadata } from "@/types/game";
import { useFavorites } from "@/hooks/useFavorites";

interface CinematicHeroProps {
  games: GameMetadata[];
}

export function CinematicHero({ games }: CinematicHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isFavorite, toggleFavorite } = useFavorites();

  const featuredGames = games.slice(0, 5);
  const currentGame = featuredGames[currentIndex] || games[0];

  useEffect(() => {
    if (featuredGames.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredGames.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [featuredGames.length]);

  if (!currentGame) return null;

  const favorited = isFavorite(currentGame.id);

  return (
    <section className="relative w-full h-[75vh] min-h-[500px] max-h-[750px] overflow-hidden bg-[#131313] rounded-3xl border border-white/10 shadow-2xl">
      
      {/* Background Image with Ambient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={currentGame.heroImage || currentGame.coverImage || currentGame.thumbnailUrl}
          alt={currentGame.title}
          className="h-full w-full object-cover object-center transition-all duration-1000 scale-105"
        />
        {/* Directional Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#131313] via-[#131313]/80 to-transparent w-full md:w-3/4" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end p-6 sm:p-10 md:p-14 space-y-4">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center space-x-1.5 rounded-md bg-[#7701d0] px-3 py-1 font-mono text-[11px] font-bold text-white uppercase tracking-wider shadow-lg">
            <Flame className="h-3.5 w-3.5 fill-white" />
            <span>FEATURED SHOWCASE</span>
          </span>

          <span className="inline-flex items-center space-x-1 rounded-md bg-[#201f1f] px-3 py-1 font-mono text-[11px] font-medium text-zinc-300 border border-white/10 capitalize">
            {currentGame.category}
          </span>

          <span className="inline-flex items-center space-x-1 rounded-md bg-[#201f1f] px-2.5 py-1 font-mono text-[11px] font-bold text-[#c3f400] border border-white/10">
            <Star className="h-3.5 w-3.5 fill-[#c3f400] text-[#c3f400]" />
            <span>{currentGame.rating.toFixed(1)}</span>
          </span>
        </div>

        {/* Display Title */}
        <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-none max-w-3xl drop-shadow-md">
          {currentGame.derivedTitle || currentGame.title}
        </h1>

        {/* Description */}
        <p className="text-sm sm:text-base text-[#e5e2e1]/80 max-w-2xl line-clamp-2 leading-relaxed font-normal">
          {currentGame.description}
        </p>

        {/* Primary & Secondary Action CTAs */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Link
            href={`/game/${currentGame.slug}`}
            className="btn-primary-lime inline-flex items-center space-x-2 px-8 py-4 text-sm tracking-wide shadow-xl"
          >
            <Play className="h-5 w-5 fill-[#161e00]" />
            <span>PLAY NOW</span>
          </Link>

          <button
            onClick={() => toggleFavorite(currentGame.id)}
            className={`inline-flex items-center space-x-2 rounded-lg px-6 py-4 text-sm font-bold border transition-all ${
              favorited
                ? "bg-[#7701d0]/30 text-[#dcb8ff] border-[#7701d0]"
                : "bg-[#201f1f]/90 text-white border-white/10 hover:bg-white/10"
            }`}
          >
            <Plus className={`h-4 w-4 ${favorited ? "rotate-45" : ""}`} />
            <span>{favorited ? "IN LIBRARY" : "ADD TO FAVORITES"}</span>
          </button>
        </div>

        {/* Carousel Slide Indicators */}
        {featuredGames.length > 1 && (
          <div className="flex items-center space-x-2 pt-4">
            {featuredGames.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? "w-8 bg-[#c3f400]" : "w-2 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
