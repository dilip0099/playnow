"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play, Heart, Star } from "lucide-react";
import { GameMetadata } from "@/types/game";
import { useFavorites } from "@/hooks/useFavorites";

interface HeroCarouselProps {
  games: GameMetadata[];
  intervalMs?: number;
}

// A punchy one-liner beats a three-line synopsis in a hero — pull the real
// first sentence from the game's own description rather than inventing copy.
function tagline(description: string): string {
  const firstSentence = description.split(/(?<=[.!?])\s/)[0] || description;
  return firstSentence.length > 130 ? `${firstSentence.slice(0, 127).trimEnd()}…` : firstSentence;
}

export function HeroCarousel({ games, intervalMs = 6500 }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const slideCount = games.length;

  const goTo = useCallback(
    (index: number) => setActiveIndex(((index % slideCount) + slideCount) % slideCount),
    [slideCount]
  );

  useEffect(() => {
    if (isPaused || slideCount <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slideCount);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [isPaused, slideCount, intervalMs]);

  if (slideCount === 0) return null;

  return (
    <section
      className="relative w-full h-[75vh] min-h-[500px] max-h-[720px] overflow-hidden bg-background"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured games"
    >
      {games.map((game, idx) => {
        const isActive = idx === activeIndex;
        return (
          <div
            key={game.id}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              isActive ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"
            }`}
          >
            <img
              src={game.heroImage || game.coverImage}
              alt=""
              aria-hidden="true"
              fetchPriority={idx === 0 ? "high" : "low"}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 max-w-3xl space-y-5 p-8 sm:p-12 lg:p-16">
              <div className="flex items-center space-x-3 font-mono text-xs font-bold uppercase tracking-wider">
                <span className="rounded bg-secondary px-3 py-1 text-secondary-foreground">Featured</span>
                <span className="flex items-center space-x-1 text-primary">
                  <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                  <span className="text-foreground">{game.rating.toFixed(1)}</span>
                </span>
                <span className="text-muted-foreground">{game.category}</span>
              </div>

              <h1 className="font-display text-4xl font-black uppercase leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                {game.derivedTitle || game.title}
              </h1>

              <p className="max-w-xl text-sm leading-relaxed text-foreground/80">
                {tagline(game.description)}
              </p>

              <div className="flex items-center space-x-3 pt-1">
                <Link
                  href={`/game/${game.slug}`}
                  className="inline-flex items-center space-x-2.5 rounded-lg bg-primary px-8 py-4 text-sm font-black uppercase tracking-wider text-primary-foreground transition-all hover:bg-primary-hover hover:shadow-glow-primary"
                >
                  <Play className="h-4 w-4 fill-current" />
                  <span>PLAY NOW</span>
                </Link>

                <button
                  onClick={() => toggleFavorite(game.id)}
                  aria-label={isFavorite(game.id) ? `Remove ${game.title} from favorites` : `Add ${game.title} to favorites`}
                  aria-pressed={isFavorite(game.id)}
                  className={`flex h-[52px] w-[52px] items-center justify-center rounded-lg border transition-colors ${
                    isFavorite(game.id)
                      ? "border-rose-500/40 bg-rose-500/20 text-rose-400"
                      : "border-white/20 bg-white/5 text-foreground hover:bg-white/10"
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isFavorite(game.id) ? "fill-rose-400" : ""}`} />
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {slideCount > 1 && (
        <>
          {/* Arrows sit mid-height, which collides with the bottom-anchored text block on
              short/narrow screens — desktop only; mobile relies on the dots + swipe. */}
          <button
            onClick={() => goTo(activeIndex - 1)}
            aria-label="Previous featured game"
            className="absolute left-6 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/60 text-foreground backdrop-blur-md transition-colors hover:bg-background/90 sm:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => goTo(activeIndex + 1)}
            aria-label="Next featured game"
            className="absolute right-6 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/60 text-foreground backdrop-blur-md transition-colors hover:bg-background/90 sm:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div
            role="group"
            aria-label="Select featured game"
            className="absolute bottom-6 right-6 z-20 flex items-center space-x-2 sm:bottom-8 sm:right-10"
          >
            {games.map((game, idx) => (
              <button
                key={game.id}
                onClick={() => goTo(idx)}
                aria-label={`Show ${game.title}`}
                aria-current={idx === activeIndex}
                className={`h-1.5 rounded-full transition-all ${
                  idx === activeIndex ? "w-6 bg-primary" : "w-1.5 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
