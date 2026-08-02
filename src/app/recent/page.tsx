import { Metadata } from "next";
import { Clock } from "lucide-react";
import { getAllGames } from "@/lib/games";
import { RecentClient } from "./RecentClient";

export const metadata: Metadata = {
  title: "Recently Played - PlayNow",
  description: "View your recently played HTML5 browser games history.",
};

export default function RecentPage() {
  const allGames = getAllGames();

  return (
    <div className="min-h-screen bg-background text-foreground py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">

        <div className="space-y-2 border-b border-border pb-6">
          <div className="flex items-center space-x-2">
            <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-bold text-violet-300 border border-secondary/20 flex items-center space-x-1">
              <Clock className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
              <span>Gameplay History</span>
            </span>
          </div>
          <h1 className="text-3xl font-black text-foreground">Recently Played Games</h1>
          <p className="text-sm text-muted-foreground">
            Resume your recent sessions instantly with zero setup.
          </p>
        </div>

        <RecentClient allGames={allGames} />

      </div>
    </div>
  );
}
