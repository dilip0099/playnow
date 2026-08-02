"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Star, Plus, Check } from "lucide-react";
import { GameMetadata } from "@/types/game";

interface CinematicHeroProps {
  games: GameMetadata[];
}

export function CinematicHero({ games }: CinematicHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!games || games.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % games.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [games]);

  if (!games || games.length === 0) return null;

  const currentGame = games[currentIndex];
  const title = currentGame.derivedTitle || currentGame.title;

  return (
    <section className="relative w-full h-[75vh] sm:h-[82vh] overflow-hidden bg-[#050505] rounded-3xl border border-white/5 shadow-2xl">
      
      {/* Full-width High-Res Poster Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={currentGame.thumbnailUrl}
          alt={title}
          fill
          priority
          sizes="100vw"
          className="object-cover transition-all duration-1000 scale-105"
        />

        {/* Dark Cinematic Gradient Overlay Masks */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent" />
      </div>

      {/* Hero Content Information */}
      <div className="relative z-10 flex h-full max-w-7xl mx-auto items-end p-6 sm:p-14 pb-12">
        <div className="max-w-2xl space-y-4">
          
          {/* Rating & Category Pill */}
          <div className="flex items-center space-x-3 text-xs font-bold text-zinc-300">
            <span className="rounded-full bg-purple-600/30 text-purple-300 border border-purple-500/30 px-3 py-1 uppercase tracking-wider">
              {currentGame.category}
            </span>
            <div className="flex items-center space-x-1 text-amber-400">
              <Star className="h-4 w-4 fill-amber-400" />
              <span>{currentGame.rating.toFixed(1)} Rating</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none drop-shadow-lg">
            {title}
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-zinc-300 line-clamp-3 leading-relaxed max-w-xl">
            {currentGame.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link href={`/game/${currentGame.slug}`}>
              <button className="rounded-2xl bg-white hover:bg-zinc-200 text-black font-black px-8 py-4 text-sm sm:text-base flex items-center space-x-2.5 shadow-2xl transition-all hover:scale-105">
                <Play className="h-5 w-5 fill-black" />
                <span>PLAY NOW</span>
              </button>
            </Link>

            <button
              onClick={() => setIsSaved(!isSaved)}
              className="rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-white/10 text-white font-bold px-6 py-4 text-sm sm:text-base flex items-center space-x-2 backdrop-blur-md transition-all"
            >
              {isSaved ? (
                <>
                  <Check className="h-5 w-5 text-emerald-400" />
                  <span>IN LIBRARY</span>
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  <span>ADD TO LIBRARY</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Slide Navigation Dots */}
      <div className="absolute right-6 bottom-8 z-20 flex items-center space-x-2">
        {games.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex ? "w-8 bg-purple-500" : "w-2 bg-zinc-700 hover:bg-zinc-500"
            }`}
          />
        ))}
      </div>

    </section>
  );
}
