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
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform duration-base group-hover:scale-110">
            <Play className="ml-0.5 h-5 w-5 fill-current" aria-hidden="true" />
          </div>
        </div>

        {/* Category Pill Tag */}
        <div className="absolute left-2.5 top-2.5">
          <span className="rounded-md border border-border bg-background/80 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground backdrop-blur-md">
            {game.category}
          </span>
        </div>

        {/* Trending / New status badge */}
        {statusLabel && (
          <div className="absolute right-2.5 top-2.5">
            <span className="rounded-md bg-primary px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-primary-foreground">
              {statusLabel}
            </span>
          </div>
        )}
      </div>

      {/* Card Info Footer */}
      <div className="flex flex-col space-y-1.5 bg-card p-3.5">
        <h3 className="font-display text-sm font-bold text-foreground truncate transition-colors group-hover:text-primary">
          {displayTitle}
        </h3>

        <div className="flex items-center justify-between pt-0.5 font-mono text-xs text-muted-foreground">
          {/* Star Rating */}
          <div className="flex items-center space-x-1 text-primary">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span className="font-bold text-foreground">{game.rating.toFixed(1)}</span>
          </div>

          {/* Plays Count (hidden until we have real play analytics for a title) */}
          {game.playsCount > 0 && (
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Eye className="h-3.5 w-3.5" />
              <span>{(game.playsCount / 1000).toFixed(1)}k</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
