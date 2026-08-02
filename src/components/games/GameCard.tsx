"use client";

import Link from "next/link";
import { Star, Eye, Play } from "lucide-react";
import { GameMetadata } from "@/types/game";

interface GameCardProps {
  game: GameMetadata;
  aspectRatio?: "16/9" | "3/4" | "square";
  priority?: boolean;
}

export function GameCard({ game, aspectRatio = "16/9" }: GameCardProps) {
  const displayTitle = game.derivedTitle || game.title;

  return (
    <Link
      href={`/game/${game.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1c1b1b] transition-all duration-300 hover:-translate-y-1 hover:border-[#c3f400]/40 hover:shadow-[0_0_20px_rgba(195,244,0,0.15)]"
    >
      {/* 16:9 Artwork Image Container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#131313]">
        <img
          src={game.thumbnailUrl || game.coverImage}
          alt={displayTitle}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Hover Dark Overlay + Neon Lime Play Button */}
        <div className="absolute inset-0 flex items-center justify-center bg-[#131313]/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#c3f400] text-[#161e00] shadow-xl transition-transform duration-300 group-hover:scale-110">
            <Play className="h-5 w-5 fill-[#161e00] ml-0.5" />
          </div>
        </div>

        {/* Category Pill Tag */}
        <div className="absolute top-2.5 left-2.5">
          <span className="rounded-md bg-[#131313]/80 px-2 py-0.5 font-mono text-[10px] font-bold text-zinc-300 border border-white/10 uppercase tracking-wider backdrop-blur-md">
            {game.category}
          </span>
        </div>
      </div>

      {/* Card Info Footer */}
      <div className="flex flex-col p-3.5 space-y-1.5 bg-[#1c1b1b]">
        <h3 className="font-display text-sm font-bold text-white truncate group-hover:text-[#c3f400] transition-colors">
          {displayTitle}
        </h3>

        <div className="flex items-center justify-between font-mono text-xs text-zinc-400 pt-0.5">
          {/* Star Rating */}
          <div className="flex items-center space-x-1 text-[#c3f400]">
            <Star className="h-3.5 w-3.5 fill-[#c3f400]" />
            <span className="font-bold text-white">{game.rating.toFixed(1)}</span>
          </div>

          {/* Plays Count */}
          <div className="flex items-center space-x-1 text-zinc-400">
            <Eye className="h-3.5 w-3.5" />
            <span>{(game.playsCount / 1000).toFixed(1)}k</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
