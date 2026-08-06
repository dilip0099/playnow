"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, Play } from "lucide-react";
import { GameMetadata } from "@/types/game";
import { useRecentlyPlayed } from "@/hooks/useRecentlyPlayed";
import { EmptyGamesState } from "./EmptyGamesState";
import { Skeleton } from "@/components/ui/skeleton";

interface ContinuePlayingRailProps {
  allGames: GameMetadata[];
  /** "show" (default) renders a loading/empty state — appropriate for a dedicated Library page.
   *  "hide" renders nothing (including the heading, if `title` is set) until there's real
   *  recently-played data — appropriate for the homepage, where an empty "Nothing in progress"
   *  card would just be noise for a first-time visitor. */
  emptyState?: "show" | "hide";
  limit?: number;
  /** When set, wraps the rail in its own `<section>` with this heading — used on the homepage
   *  where this component owns its whole section rather than sitting inside a caller's heading. */
  title?: string;
}

export function ContinuePlayingRail({ allGames, emptyState = "show", limit = 10, title }: ContinuePlayingRailProps) {
  const { recentlyPlayed, isLoaded } = useRecentlyPlayed();
  const gamesById = new Map(allGames.map((g) => [g.id, g]));
  const continueGames = recentlyPlayed
    .map((id) => gamesById.get(id))
    .filter((g): g is GameMetadata => Boolean(g))
    .slice(0, limit);

  if (!isLoaded) {
    if (emptyState === "hide") return null;
    return (
      <div className="flex space-x-2.5 overflow-x-auto pb-2 pt-0.5 scrollbar-none">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-32 sm:w-40 flex-shrink-0 rounded-xl" />
        ))}
      </div>
    );
  }

  if (continueGames.length === 0) {
    if (emptyState === "hide") return null;
    return (
      <EmptyGamesState
        icon={Clock}
        title="Nothing in progress"
        description="Start playing any game and it'll show up here so you can jump back in."
        ctaHref="/discover"
        ctaLabel="Browse Games"
      />
    );
  }

  const scrollRow = (
    <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-2 pt-0.5 scrollbar-none -mx-1 px-1 snap-x snap-mandatory">
      {continueGames.map((game) => (
        <Link
          key={`continue-${game.id}`}
          href={`/game/${game.slug}`}
          className="group relative w-32 sm:w-40 flex-shrink-0 snap-start rounded-xl border border-border bg-card p-1.5 sm:p-2 space-y-1.5 hover:border-primary/40 transition-all shadow-sm flex flex-col justify-between"
        >
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-muted">
            <Image
              src={game.thumbnailUrl}
              alt={game.title}
              fill
              sizes="(max-width: 640px) 128px, 160px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <span className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                <Play className="h-3 w-3 fill-current ml-0.5" />
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-1 min-w-0">
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-[11px] sm:text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                {game.derivedTitle || game.title}
              </h3>
              <span className="font-mono text-[9px] text-primary font-bold capitalize block truncate">
                {game.category}
              </span>
            </div>
            <button
              tabIndex={-1}
              aria-label={`Resume ${game.derivedTitle || game.title}`}
              className="h-6 w-6 shrink-0 rounded-md bg-primary/10 group-hover:bg-primary text-primary group-hover:text-primary-foreground flex items-center justify-center transition-colors"
            >
              <Play className="h-2.5 w-2.5 fill-current" />
            </button>
          </div>
        </Link>
      ))}
    </div>
  );

  if (!title) return scrollRow;

  return (
    <section className="space-y-3">
      <h2 className="font-display text-lg sm:text-xl font-black text-foreground uppercase tracking-tight flex items-center">
        <span className="w-1 h-5 bg-primary rounded-full mr-2.5" />
        {title}
      </h2>
      {scrollRow}
    </section>
  );
}
