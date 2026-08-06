import { Metadata } from "next";
import { DiscoverClient } from "./DiscoverClient";
import { getAllGames } from "@/lib/games";

export const metadata: Metadata = {
  title: "Store - PlayThorn Game Registry",
  description: "Explore the full catalog of HTML5 browser games. Filter by genre, sort by rating, and launch instantly.",
};

export default function DiscoverPage() {
  const games = getAllGames();

  return <DiscoverClient initialGames={games} />;
}
