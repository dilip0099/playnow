import { Metadata } from "next";
import { DiscoverClient } from "./DiscoverClient";
import { getAllGames } from "@/lib/games";

export const metadata: Metadata = {
  title: "Free Online Games - Browse Full HTML5 Catalog - PlayThorn",
  description: "Browse free HTML5 browser games online instantly. Filter by category, sort by popularity, and play directly in your browser with no downloads or signup required.",
};

export default function DiscoverPage() {
  const games = getAllGames();

  return <DiscoverClient initialGames={games} />;
}
