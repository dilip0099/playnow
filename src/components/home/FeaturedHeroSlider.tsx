"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Star, Eye, ShieldCheck, Flame, ChevronRight, ChevronLeft, Sparkles, User, Tag } from "lucide-react";
import { GameMetadata } from "@/types/game";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FeaturedHeroSliderProps {
  featuredGames: GameMetadata[];
}

export function FeaturedHeroSlider({ featuredGames }: FeaturedHeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (featuredGames.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredGames.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [featuredGames.length]);

  if (!featuredGames || featuredGames.length === 0) return null;

  const currentGame = featuredGames[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredGames.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredGames.length) % featuredGames.length);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-slate-950 shadow-2xl group">
      
      {/* Background Poster Image with Cinematic Dark Gradient Overlay */}
      <div className="relative aspect-[21/9] min-h-[380px] sm:min-h-[460px] w-full overflow-hidden">
        <Image
          src={currentGame.thumbnailUrl}
          alt={currentGame.title}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40 blur-[2px] transition-all duration-700 scale-105 group-hover:scale-100"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
      </div>

      {/* Hero Content Details */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12 space-y-4 max-w-3xl z-10">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-purple-600 text-white font-bold text-xs px-3 py-1 uppercase tracking-wider flex items-center space-x-1 shadow-lg">
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            <span>FEATURED SPOTLIGHT</span>
          </Badge>

          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs font-semibold flex items-center space-x-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>COMMERCIAL READY</span>
          </Badge>

          <Badge variant="outline" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 text-xs font-semibold uppercase">
            {currentGame.license}
          </Badge>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-md">
          {currentGame.derivedTitle || currentGame.title}
        </h1>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed max-w-2xl">
          {currentGame.description}
        </p>

        {/* Action Row */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Link href={`/game/${currentGame.slug}`}>
            <Button className="rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black px-6 py-6 text-sm sm:text-base shadow-xl shadow-purple-600/30 flex items-center space-x-2 transition-all hover:scale-105">
              <Play className="h-5 w-5 fill-white" />
              <span>PLAY NOW FOR FREE</span>
            </Button>
          </Link>

          <div className="flex items-center space-x-4 text-xs font-bold text-slate-300">
            <div className="flex items-center space-x-1 text-amber-400 bg-amber-500/10 px-3 py-2 rounded-xl border border-amber-500/20">
              <Star className="h-4 w-4 fill-amber-400" />
              <span>{currentGame.rating.toFixed(1)}</span>
            </div>

            <div className="flex items-center space-x-1 text-cyan-400 bg-cyan-500/10 px-3 py-2 rounded-xl border border-cyan-500/20">
              <Eye className="h-4 w-4" />
              <span>{(currentGame.playsCount / 1000).toFixed(1)}k Plays</span>
            </div>
          </div>
        </div>

      </div>

      {/* Carousel Slide Indicators & Arrows */}
      <div className="absolute right-6 bottom-6 flex items-center space-x-3 z-20">
        <button
          onClick={handlePrev}
          className="h-10 w-10 rounded-full bg-slate-900/80 border border-white/10 flex items-center justify-center text-white hover:bg-purple-600 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-1.5">
          {featuredGames.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex ? "w-6 bg-purple-500" : "w-2 bg-slate-700"
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="h-10 w-10 rounded-full bg-slate-900/80 border border-white/10 flex items-center justify-center text-white hover:bg-purple-600 transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

    </div>
  );
}
