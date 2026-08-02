import { Metadata } from "next";
import { Bookmark, Clock } from "lucide-react";
import { getAllGames } from "@/lib/games";
import { GameGrid } from "@/components/games/GameGrid";
import { ContinuePlayingRail } from "@/components/games/ContinuePlayingRail";

export const metadata: Metadata = {
  title: "My Library - PlayNow",
  description: "Your personal game collection, saved bookmarks, and recent play sessions.",
};

export default function LibraryPage() {
  const allGames = getAllGames();

  return (
    <div className="min-h-screen bg-background text-foreground py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Header */}
        <div className="space-y-2 border-b border-border pb-6">
          <div className="flex items-center space-x-2">
            <span className="rounded bg-primary px-3 py-1 text-[10px] font-mono font-bold text-primary-foreground uppercase tracking-wider flex items-center space-x-1">
              <Bookmark className="h-3 w-3 mr-1" aria-hidden="true" />
              <span>Personal Vault</span>
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-foreground uppercase">My Game Library</h1>
          <p className="text-xs text-muted-foreground font-mono">
            Access your saved games, favorites, and recent play sessions in one place.
          </p>
        </div>

        {/* Continue Playing */}
        <div className="space-y-4">
          <h2 className="font-display text-xl font-black text-foreground uppercase flex items-center">
            <Clock className="h-5 w-5 text-primary mr-2" aria-hidden="true" />
            Continue Playing
          </h2>

          <ContinuePlayingRail allGames={allGames} />
        </div>

        {/* Full Collection */}
        <div className="pt-4 border-t border-border">
          <GameGrid games={allGames} title="Full Collection" />
        </div>
      </div>
    </div>
  );
}
