import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { User, Code2, ExternalLink, ShieldCheck, Heart, Play } from "lucide-react";
import { getAllGames } from "@/lib/games";
import { GameCard } from "@/components/games/GameCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DevPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const games = getAllGames();
  const authors = Array.from(new Set(games.map((g) => g.originalAuthor || g.author)));
  return authors.map((author) => ({
    slug: encodeURIComponent(author.toLowerCase().replace(/\s+/g, "-")),
  }));
}

export async function generateMetadata({ params }: DevPageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedName = decodeURIComponent(slug).replace(/-/g, " ");
  return {
    title: `${decodedName} - Open Source Game Creator Profile`,
    description: `Browse open-source browser games created by ${decodedName} on GameHub Marketplace.`,
  };
}

export default async function DeveloperProfilePage({ params }: DevPageProps) {
  const { slug } = await params;
  const decodedName = decodeURIComponent(slug).replace(/-/g, " ");
  const games = getAllGames();

  const authorGames = games.filter(
    (g) => (g.originalAuthor || g.author).toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase() ||
           (g.originalAuthor || g.author).toLowerCase() === decodedName.toLowerCase()
  );

  if (authorGames.length === 0) {
    // Fallback to first author's games
  }

  const displayGames = authorGames.length > 0 ? authorGames : games.slice(0, 3);
  const authorName = authorGames.length > 0 ? (authorGames[0].originalAuthor || authorGames[0].author) : decodedName;

  return (
    <div className="min-h-screen bg-background text-foreground py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Creator Hero Header */}
        <Card className="p-8 border-purple-500/30 bg-gradient-to-br from-purple-950/30 via-slate-900 to-slate-950 backdrop-blur-md space-y-4">
          <div className="flex items-center space-x-3">
            <div className="h-16 w-16 rounded-full bg-purple-600/20 text-purple-400 border border-purple-500/40 flex items-center justify-center font-black text-xl">
              <Code2 className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-3xl font-black text-white">{authorName}</h1>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px] uppercase font-bold">
                  Verified Creator
                </Badge>
              </div>
              <p className="text-xs text-slate-300">Open-Source HTML5 Game Developer & GitHub Contributor</p>
            </div>
          </div>
        </Card>

        {/* Published Games Grid */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-white">Games Created by {authorName}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
