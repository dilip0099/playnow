"use client";

import Link from "next/link";
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

export function ContinuePlayingRail({ allGames, emptyState = "show", limit = 3, title }: ContinuePlayingRailProps) {
  const { recentlyPlayed, isLoaded } = useRecentlyPlayed();
  const gamesById = new Map(allGames.map((g) => [g.id, g]));
  const continueGames = recentlyPlayed
    .map((id) => gamesById.get(id))
    .filter((g): g is GameMetadata => Boolean(g))
    .slice(0, limit);

  if (!isLoaded) {
    if (emptyState === "hide") return null;
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: limit }).map((_, i) => (
          <Skeleton key={i} className="aspect-[16/10] w-full" />
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

  const grid = (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {continueGames.map((game) => (
        <div
          key={`continue-${game.id}`}
          className="rounded-2xl border border-border bg-card p-4 space-y-3 hover:border-primary/40 transition-all"
        >
          <img src={game.thumbnailUrl} alt={game.title} className="aspect-[16/10] w-full rounded-xl object-cover" loading="lazy" />
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <h3 className="font-display text-sm font-bold text-foreground line-clamp-1">{game.derivedTitle || game.title}</h3>
              <span className="font-mono text-[10px] text-primary font-bold capitalize">{game.category}</span>
            </div>
            <Link href={`/game/${game.slug}`}>
              <button aria-label={`Resume ${game.derivedTitle || game.title}`} className="h-9 w-9 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground flex items-center justify-center shadow-lg transition-transform hover:scale-105">
                <Play className="h-4 w-4 fill-current" />
              </button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );

  if (!title) return grid;

  return (
    <section className="space-y-5">
      <h2 className="font-display text-xl sm:text-2xl font-black text-foreground uppercase tracking-tight flex items-center">
        <span className="w-1 h-6 bg-primary rounded-full mr-3" />
        {title}
      </h2>
      {grid}
    </section>
  );
}
