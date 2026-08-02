"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Star, Eye } from "lucide-react";
import { GameMetadata } from "@/types/game";

interface GameCardProps {
  game: GameMetadata;
  priority?: boolean;
}

export function GameCard({ game, priority = false }: GameCardProps) {
  const title = game.derivedTitle || game.title;
  const rating = game.rating ? game.rating.toFixed(1) : "4.8";
  const plays = (game.playsCount / 1000).toFixed(1);

  return (
    <Link href={`/game/${game.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-[#121212] border border-white/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-purple-900/20">
        
        {/* Artwork Image Container (16:9 Aspect Ratio) */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-900">
          <Image
            src={game.thumbnailUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Hover Play Button Overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <Play className="h-6 w-6 fill-white ml-0.5" />
            </div>
          </div>
        </div>

        {/* Minimal Content Details */}
        <div className="p-3.5 space-y-1.5">
          <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors truncate">
            {title}
          </h3>

          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
            <div className="flex items-center space-x-1 text-amber-400">
              <Star className="h-3.5 w-3.5 fill-amber-400" />
              <span className="font-bold">{rating}</span>
            </div>

            <div className="flex items-center space-x-1 text-zinc-400">
              <Eye className="h-3.5 w-3.5" />
              <span>{plays}k Plays</span>
            </div>
          </div>
        </div>

      </div>
    </Link>
  );
}
