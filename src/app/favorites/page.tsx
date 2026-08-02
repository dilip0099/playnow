import { Metadata } from "next";
import Link from "next/link";
import { Heart, Compass } from "lucide-react";
import { getAllGames } from "@/lib/games";
import { GameCard } from "@/components/games/GameCard";

export const metadata: Metadata = {
  title: "Favorite Games - GameHub Marketplace",
  description: "View and play your saved favorite open-source HTML5 browser games.",
};

export default function FavoritesPage() {
  const allGames = getAllGames();

  return (
    <div className="min-h-screen bg-background text-foreground py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="space-y-2 border-b border-border/60 pb-6">
          <div className="flex items-center space-x-2">
            <span className="rounded-full bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-400 border border-rose-500/20 flex items-center space-x-1">
              <Heart className="h-3.5 w-3.5 fill-rose-500 mr-1" />
              <span>Saved Collection</span>
            </span>
          </div>
          <h1 className="text-3xl font-black text-white">Your Favorite Games</h1>
          <p className="text-sm text-slate-300">
            Quickly jump back into the games you love. Favorites are saved directly to your browser storage.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allGames.slice(0, 4).map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>

      </div>
    </div>
  );
}
