import { Metadata } from "next";
import { DiscoverClient } from "./DiscoverClient";
import { getAllGames } from "@/lib/games";

export const metadata: Metadata = {
  title: "Free Online Games - Instant Play, No Download - PlayThorn",
  description: "Browse free online games and play instantly in your browser. Filter by category, sort by popularity, and play on PC or Mobile with no downloads or signup.",
};

export default function DiscoverPage() {
  const games = getAllGames();

  return <DiscoverClient initialGames={games} />;
}
