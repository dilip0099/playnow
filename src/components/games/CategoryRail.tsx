import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GameMetadata, GameCategory } from "@/types/game";
import { GameCard } from "./GameCard";
import { GAME_GRID_COLS } from "@/lib/game-grid";

interface CategoryRailProps {
  category: GameCategory;
  label: string;
  games: GameMetadata[];
  excludeIds?: Set<string>;
  limit?: number;
}

export function CategoryRail({ category, label, games, excludeIds, limit = 7 }: CategoryRailProps) {
  const visible = [...games]
    .filter((g) => !excludeIds?.has(g.id))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);

  if (visible.length === 0) return null;

  return (
    <section className="space-y-3 sm:space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center font-display text-sm sm:text-xl lg:text-2xl font-black uppercase tracking-tight text-foreground">
          <span className="mr-2 sm:mr-3 h-4 sm:h-6 w-1 rounded-full bg-primary" />
          {label}
        </h2>
        <Link
          href={`/category/${category}`}
          className="flex items-center space-x-1 font-mono text-[10px] sm:text-xs font-bold text-muted-foreground transition-colors hover:text-primary"
        >
          <span>VIEW ALL</span>
          <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        </Link>
      </div>

      <div className={`grid gap-4 ${GAME_GRID_COLS}`}>
        {visible.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  );
}
