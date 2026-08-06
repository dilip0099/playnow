"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, Eye, Play } from "lucide-react";
import { GameMetadata } from "@/types/game";
import { ASPECT_RATIO_CLASS, GameAspectRatio } from "@/lib/aspect-ratio";

interface GameCardProps {
  game: GameMetadata;
  aspectRatio?: GameAspectRatio;
  priority?: boolean;
  layout?: "grid" | "list";
}

export function GameCard({
  game,
  aspectRatio = "16/9",
  priority = false,
  layout = "grid",
}: GameCardProps) {
  const displayTitle = game.derivedTitle || game.title;
  const statusLabel = game.isExclusive
    ? "EXCLUSIVE"
    : game.isRewarded
    ? "⚡ REWARD"
    : game.trending
    ? "TRENDING"
    : game.isNew
    ? "NEW"
    : null;

  if (layout === "list") {
    return (
      <Link
        href={`/game/${game.slug}`}
        className="group relative flex flex-row items-center justify-between gap-3 overflow-hidden rounded-xl sm:rounded-2xl border border-border bg-card p-2 sm:p-3 transition-all duration-base hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-glow-primary"
      >
        {/* Left Side: Artwork & Info */}
        <div className="flex flex-row items-center gap-3 min-w-0 flex-1">
          {/* Artwork Image Container */}
          <div className="relative w-24 sm:w-44 h-16 sm:h-24 shrink-0 overflow-hidden rounded-lg sm:rounded-xl bg-background">
            <Image
              src={game.thumbnailUrl || game.coverImage || ""}
              alt={displayTitle}
              fill
              sizes="(max-width: 640px) 96px, 176px"
              className="object-cover object-center transition-transform duration-slow group-hover:scale-105"
              priority={priority}
              loading={priority ? undefined : "lazy"}
            />

            {/* Category Pill Tag (Desktop Only) */}
            <div className="hidden sm:block absolute left-2 top-2">
              <span className="rounded-md border border-border bg-background/80 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-muted-foreground backdrop-blur-md">
                {game.category}
              </span>
            </div>

            {/* Trending / New status badge */}
            {statusLabel && (
              <div className="absolute right-1 top-1 sm:right-2 sm:top-2">
                <span className="rounded-md bg-primary px-1 sm:px-1.5 py-0.5 font-mono text-[7px] sm:text-[8px] font-bold uppercase tracking-wider text-primary-foreground">
                  {statusLabel}
                </span>
              </div>
            )}
          </div>

          {/* Card Details */}
          <div className="flex flex-col space-y-1 min-w-0 flex-1">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="flex items-center space-x-1 text-primary text-[10px] sm:text-xs font-mono font-bold">
                <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-current" />
                <span className="text-foreground">{game.rating.toFixed(1)}</span>
              </div>
              {game.playsCount > 0 && (
                <div className="flex items-center space-x-1 text-muted-foreground text-[10px] sm:text-xs font-mono">
                  <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  <span>{(game.playsCount / 1000).toFixed(1)}k plays</span>
                </div>
              )}
            </div>

            <h3 className="font-display text-xs sm:text-base font-bold text-foreground truncate transition-colors group-hover:text-primary">
              {displayTitle}
            </h3>

            {game.description && (
              <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1">
                {game.description}
              </p>
            )}
          </div>
        </div>

        {/* Right Side: CTA Button (Hidden on Mobile, Visible on Desktop) */}
        <div className="hidden sm:flex items-center justify-end shrink-0 sm:pr-2">
          <div className="flex items-center justify-center space-x-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-black text-primary-foreground shadow-glow-primary transition-transform group-hover:scale-105 uppercase tracking-wider">
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>PLAY NOW</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/game/${game.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-base hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow-primary"
    >
      {/* Artwork Image Container */}
      <div className={`relative w-full overflow-hidden bg-background ${ASPECT_RATIO_CLASS[aspectRatio]}`}>
        <Image
          src={game.thumbnailUrl || game.coverImage || ""}
          alt={displayTitle}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
          className="object-cover object-center transition-transform duration-slow group-hover:scale-105"
          priority={priority}
          loading={priority ? undefined : "lazy"}
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
      <div className="flex flex-col space-y-1 bg-card p-2 sm:p-2.5">
        <h3 className="font-display text-[11px] sm:text-sm font-bold text-foreground truncate transition-colors group-hover:text-primary">
          {displayTitle}
        </h3>

        <div className="flex items-center justify-between font-mono text-[9px] sm:text-[11px] text-muted-foreground">
          {/* Star Rating */}
          <div className="flex items-center space-x-1 text-primary">
            <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-current" />
            <span className="font-bold text-foreground">{game.rating.toFixed(1)}</span>
          </div>

          {/* Plays Count */}
          {game.playsCount > 0 && (
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Eye className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              <span>{(game.playsCount / 1000).toFixed(1)}k</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
