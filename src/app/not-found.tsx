import Link from "next/link";
import { Home, Search, Swords, Puzzle, Car, Compass } from "lucide-react";
import { gamesData } from "@/lib/games";
import { GameCard } from "@/components/games/GameCard";
import { GAME_GRID_COLS } from "@/lib/game-grid";

// Real content, not a dead end: Google explicitly recommends this over redirecting removed
// pages to unrelated content ("soft 404" territory) when there's no genuine 1:1 replacement —
// which is the case here since the game catalog has changed providers more than once and old
// game slugs have no reliable mapping to current ones. A helpful 404 with real current
// popular games and category links keeps both users and crawl signals in a good place.
const QUICK_CATEGORIES = [
  { name: "Action", href: "/category/action", icon: Swords },
  { name: "Puzzle", href: "/category/puzzle", icon: Puzzle },
  { name: "Racing", href: "/category/racing", icon: Car },
  { name: "Adventure", href: "/category/adventure", icon: Compass },
];

export default function NotFound() {
  const popularGames = [...gamesData]
    .sort((a, b) => b.rating - a.rating || b.playsCount - a.playsCount)
    .slice(0, 10);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="flex flex-col items-center text-center space-y-4">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary border border-primary/20 uppercase tracking-wider">
          404 — Page Not Found
        </span>

        <h1 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight">
          This Page Moved On
        </h1>

        <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
          The game or page you're looking for was removed or never existed — but there are
          plenty of real games to play below.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="flex items-center space-x-2 rounded-full bg-primary px-6 py-3 text-sm font-black text-primary-foreground shadow-glow-primary hover:bg-primary-hover hover:scale-105 transition-all"
          >
            <Home className="h-4 w-4" />
            <span>HOME</span>
          </Link>
          <Link
            href="/discover"
            className="flex items-center space-x-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-black text-foreground hover:border-primary/40 transition-all"
          >
            <Search className="h-4 w-4" />
            <span>BROWSE ALL GAMES</span>
          </Link>
        </div>
      </div>

      {/* Quick category links */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {QUICK_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.name}
              href={cat.href}
              className="flex items-center space-x-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold text-muted-foreground hover:border-primary/40 hover:text-primary transition-all"
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{cat.name} Games</span>
            </Link>
          );
        })}
      </div>

      {/* Real popular games — keeps the visitor engaged instead of bouncing */}
      <section className="space-y-5">
        <h2 className="font-display text-xl font-black text-foreground uppercase tracking-tight text-center">
          Popular Right Now
        </h2>
        <div className={`grid gap-4 ${GAME_GRID_COLS}`}>
          {popularGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>
    </div>
  );
}
