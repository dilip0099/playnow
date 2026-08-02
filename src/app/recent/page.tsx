import { Metadata } from "next";
import Link from "next/link";
import { Clock } from "lucide-react";
import { getAllGames } from "@/lib/games";
import { GameCard } from "@/components/games/GameCard";

export const metadata: Metadata = {
  title: "Recently Played - GameHub Marketplace",
  description: "View your recently played open-source HTML5 browser games history.",
};

export default function RecentPage() {
  const games = getAllGames().slice(0, 4);

  return (
    <div className="min-h-screen bg-background text-foreground py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="space-y-2 border-b border-border/60 pb-6">
          <div className="flex items-center space-x-2">
            <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-400 border border-purple-500/20 flex items-center space-x-1">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>Gameplay History</span>
            </span>
          </div>
          <h1 className="text-3xl font-black text-white">Recently Played Games</h1>
          <p className="text-sm text-slate-300">
            Resume your recent sessions instantly with zero setup.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>

      </div>
    </div>
  );
}
