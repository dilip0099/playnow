"use client";

import Image from "next/image";
import Link from "next/link";
import { Flame, Star, Play } from "lucide-react";
import { GameMetadata } from "@/types/game";

interface TrendingCarouselProps {
  games: GameMetadata[];
}

export function TrendingCarousel({ games }: TrendingCarouselProps) {
  if (!games || games.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Flame className="h-5 w-5 text-rose-500 fill-rose-500" />
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Trending Now</h2>
      </div>

      {/* Netflix Horizontal Scrollable Row */}
      <div className="flex space-x-4 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth">
        {games.map((game) => {
          const title = game.derivedTitle || game.title;
          return (
            <Link
              key={game.id}
              href={`/game/${game.slug}`}
              className="group shrink-0 w-[85vw] sm:w-[300px] block"
            >
              <div className="relative overflow-hidden rounded-2xl bg-[#121212] border border-white/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
                {/* 16:9 Artwork Image (300x170 approx) */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-900">
                  <Image
                    src={game.thumbnailUrl}
                    alt={title}
                    fill
                    sizes="300px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="h-10 w-10 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg">
                      <Play className="h-5 w-5 fill-white ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Artwork First Content Details */}
                <div className="p-3 flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors truncate max-w-[200px]">
                    {title}
                  </h3>
                  <div className="flex items-center space-x-1 text-xs text-amber-400 font-bold">
                    <Star className="h-3.5 w-3.5 fill-amber-400" />
                    <span>{game.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
