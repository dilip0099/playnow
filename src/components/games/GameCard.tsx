"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Star, Heart, ShieldCheck, Flame } from "lucide-react";
import { GameMetadata } from "@/types/game";
import { Badge } from "@/components/ui/badge";

interface GameCardProps {
  game: GameMetadata;
  priority?: boolean;
}

export function GameCard({ game, priority }: GameCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`fav_${game.id}`);
      if (saved === "true") setIsFavorite(true);
    } catch (e) {}
  }, [game.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextState = !isFavorite;
    setIsFavorite(nextState);
    try {
      localStorage.setItem(`fav_${game.id}`, String(nextState));
    } catch (e) {}
  };

  return (
    <div className="group relative rounded-2xl border border-border/60 bg-card/60 p-3.5 shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/50 hover:shadow-purple-500/10 flex flex-col justify-between">
      
      {/* Thumbnail Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-900">
        <Image
          src={game.thumbnailUrl}
          alt={game.title}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Overlay Dark Blur on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
          <Link
            href={`/game/${game.slug}`}
            className="flex items-center space-x-2 rounded-full bg-purple-600 px-4 py-2 text-xs font-black text-white shadow-lg shadow-purple-600/50 hover:bg-purple-500 transition-transform hover:scale-105"
          >
            <Play className="h-4 w-4 fill-white" />
            <span>PLAY NOW</span>
          </Link>
        </div>

        {/* Top Badges Row */}
        <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5 z-10">
          {game.trending && (
            <Badge className="bg-rose-500/90 text-white font-bold text-[10px] px-2 py-0.5 shadow-md flex items-center space-x-0.5">
              <Flame className="h-3 w-3 fill-white" />
              <span>HOT</span>
            </Badge>
          )}

          {game.trustVerified && (
            <Badge className="bg-emerald-500/90 text-white font-bold text-[10px] px-2 py-0.5 shadow-md flex items-center space-x-0.5">
              <ShieldCheck className="h-3 w-3" />
              <span>VERIFIED</span>
            </Badge>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className="absolute right-2.5 top-2.5 h-8 w-8 rounded-full bg-slate-950/60 backdrop-blur-md flex items-center justify-center text-muted-foreground hover:text-rose-400 transition-all hover:scale-110 z-10 border border-white/10"
        >
          <Heart className={`h-4 w-4 ${isFavorite ? "fill-rose-500 text-rose-500" : ""}`} />
        </button>

      </div>

      {/* Game Details Body */}
      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">
            {game.category}
          </span>
          <div className="flex items-center space-x-1 text-xs font-bold text-amber-400">
            <Star className="h-3.5 w-3.5 fill-amber-400" />
            <span>{game.rating.toFixed(1)}</span>
          </div>
        </div>

        <Link href={`/game/${game.slug}`}>
          <h3 className="font-extrabold text-foreground group-hover:text-cyan-300 transition-colors line-clamp-1 text-sm sm:text-base">
            {game.derivedTitle || game.title}
          </h3>
        </Link>

        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {game.description}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px] text-muted-foreground font-semibold">
          <span>By {game.originalAuthor || game.author}</span>
          <Badge variant="outline" className="font-mono text-[9px] bg-purple-500/10 text-purple-300 border-purple-500/20">
            {game.license}
          </Badge>
        </div>
      </div>

    </div>
  );
}
