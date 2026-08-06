import { Metadata } from "next";
import { Heart } from "lucide-react";
import { getAllGames } from "@/lib/games";
import { FavoritesClient } from "./FavoritesClient";

export const metadata: Metadata = {
  title: "Favorite Games - PlayThorn",
  description: "View and play your saved favorite HTML5 browser games.",
};

export default function FavoritesPage() {
  const allGames = getAllGames();

  return (
    <div className="min-h-screen bg-background text-foreground py-3.5 sm:py-10">
      <div className="mx-auto max-w-[1800px] px-3 sm:px-6 lg:px-8 space-y-3.5 sm:space-y-8">

        <div className="space-y-2 border-b border-border pb-6">
          <div className="flex items-center space-x-2">
            <span className="rounded-full bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-400 border border-rose-500/20 flex items-center space-x-1">
              <Heart className="h-3.5 w-3.5 fill-rose-500 mr-1" aria-hidden="true" />
              <span>Saved Collection</span>
            </span>
          </div>
          <h1 className="text-3xl font-black text-foreground">Your Favorite Games</h1>
          <p className="text-sm text-muted-foreground">
            Quickly jump back into the games you love. Favorites are saved directly to your browser storage.
          </p>
        </div>

        <FavoritesClient allGames={allGames} />

      </div>
    </div>
  );
}
