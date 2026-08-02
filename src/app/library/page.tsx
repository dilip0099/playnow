import { Metadata } from "next";
import Link from "next/link";
import { Gamepad2, Heart, Clock, Bookmark, Play } from "lucide-react";
import { getAllGames } from "@/lib/games";
import { GameCard } from "@/components/games/GameCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "My Game Library - GameHub Marketplace",
  description: "Manage your personal game collection, saved bookmarks, and gameplay history.",
};

export default function LibraryPage() {
  const allGames = getAllGames();
  const libraryGames = allGames.slice(0, 6);

  return (
    <div className="min-h-screen bg-background text-foreground py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="space-y-2 border-b border-border/60 pb-6">
          <div className="flex items-center space-x-2">
            <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-400 border border-purple-500/20 flex items-center space-x-1">
              <Gamepad2 className="h-3.5 w-3.5 mr-1" />
              <span>Personal Vault</span>
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">My Game Library</h1>
          <p className="text-sm text-slate-300">
            Access your saved games, favorites, and recent play sessions in one place.
          </p>
        </div>

        {/* Continue Playing Hero Grid */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-white flex items-center space-x-2">
            <Clock className="h-5 w-5 text-purple-400" />
            <span>Continue Playing</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {libraryGames.slice(0, 3).map((game) => (
              <Card key={`lib-${game.id}`} className="p-4 border-border/60 bg-card/60 backdrop-blur-md space-y-3 hover:border-purple-500/50 transition-all">
                <img src={game.thumbnailUrl} alt={game.title} className="aspect-[16/10] w-full rounded-xl object-cover" />
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white line-clamp-1">{game.derivedTitle || game.title}</h3>
                    <span className="text-[11px] text-purple-300 font-semibold capitalize">{game.category}</span>
                  </div>
                  <Link href={`/game/${game.slug}`}>
                    <button className="h-9 w-9 rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105">
                      <Play className="h-4 w-4 fill-white" />
                    </button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* All Collection Grid */}
        <div className="space-y-4 pt-4 border-t border-border/40">
          <h2 className="text-2xl font-black text-white flex items-center space-x-2">
            <Bookmark className="h-5 w-5 text-cyan-400" />
            <span>Full Collection ({libraryGames.length})</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {libraryGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
