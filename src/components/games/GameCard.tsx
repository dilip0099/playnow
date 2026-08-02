"use client";

import Link from "next/link";
import { Star, Eye, Play } from "lucide-react";
import { GameMetadata } from "@/types/game";
import { ASPECT_RATIO_CLASS, GameAspectRatio } from "@/lib/aspect-ratio";

interface GameCardProps {
  game: GameMetadata;
  aspectRatio?: GameAspectRatio;
  priority?: boolean;
}

export function GameCard({ game, aspectRatio = "16/9", priority = false }: GameCardProps) {
  const displayTitle = game.derivedTitle || game.title;
  const statusLabel = game.trending ? "TRENDING" : game.isNew ? "LIVE NOW" : null;

  return (
    <Link
      href={`/game/${game.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-base hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow-primary"
    >
      {/* Artwork Image Container */}
      <div className={`relative w-full overflow-hidden bg-background ${ASPECT_RATIO_CLASS[aspectRatio]}`}>
        <img
          src={game.thumbnailUrl || game.coverImage}
          alt={displayTitle}
          className="h-full w-full object-cover object-center transition-transform duration-slow group-hover:scale-105"
          loading={priority ? "eager" : "lazy"}
        />

        {/* Hover Dark Overlay + Neon Lime Play Button */}
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 transition-opacity duration-base group-hover:opacity-100">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform duration-base group-hover:scale-110">
            <Play className="ml-0.5 h-4 w-4 fill-current" aria-hidden="true" />
          </div>
        </div>

        {/* Category Pill Tag */}
        <div className="absolute left-1.5 top-1.5 sm:left-2 sm:top-2">
          <span className="rounded-md border border-border bg-background/80 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-muted-foreground backdrop-blur-md">
            {game.category}
          </span>
        </div>

        {/* Trending / New status badge */}
        {statusLabel && (
          <div className="absolute right-1.5 top-1.5 sm:right-2 sm:top-2">
            <span className="rounded-md bg-primary px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider text-primary-foreground">
              {statusLabel}
            </span>
          </div>
        )}
      </div>

      {/* Card Info Footer */}
      <div className="flex flex-col space-y-1 bg-card p-2.5">
        <h3 className="font-display text-xs sm:text-sm font-bold text-foreground truncate transition-colors group-hover:text-primary">
          {displayTitle}
        </h3>

        <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground">
          {/* Star Rating */}
          <div className="flex items-center space-x-1 text-primary">
            <Star className="h-3 w-3 fill-current" />
            <span className="font-bold text-foreground">{game.rating.toFixed(1)}</span>
          </div>

          {/* Plays Count (hidden until we have real play analytics for a title) */}
          {game.playsCount > 0 && (
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Eye className="h-3 w-3" />
              <span>{(game.playsCount / 1000).toFixed(1)}k</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
