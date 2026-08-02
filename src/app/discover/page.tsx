import { Metadata } from "next";
import { DiscoverClient } from "./DiscoverClient";
import { getAllGames } from "@/lib/games";

export const metadata: Metadata = {
  title: "Discover Games - GameHub Marketplace",
  description: "Explore the full catalog of free open-source HTML5 games. Search, filter by category, and sort by most played or highest rated.",
};

export default function DiscoverPage() {
  const games = getAllGames();

  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      <DiscoverClient initialGames={games} />
    </div>
  );
}
