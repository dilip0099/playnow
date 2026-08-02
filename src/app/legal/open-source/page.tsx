import { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { Lock, ArrowLeft, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Catalog Changelog - PlayNow Legal",
  description: "Full list of every PlayNow game licensed via GamePix, with category, quality signal, and publish/update dates.",
};

export default function LegalOpenSourcePage() {
  const gamesPath = path.join(process.cwd(), "src", "data", "games.json");
  let games: any[] = [];
  if (fs.existsSync(gamesPath)) {
    try {
      games = JSON.parse(fs.readFileSync(gamesPath, "utf-8"));
    } catch (e) {}
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">

        <Link href="/compliance" className="inline-flex items-center space-x-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Legal Compliance Portal</span>
        </Link>

        <div className="space-y-2 border-b border-border/60 pb-6">
          <div className="flex items-center space-x-2">
            <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 border border-amber-500/20 flex items-center space-x-1">
              <Lock className="h-3.5 w-3.5 mr-1" />
              <span>Catalog Registry</span>
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground">Catalog Changelog</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Every game below is licensed via GamePix — PlayNow does not author this code. Publish and update dates are GamePix's own catalog timestamps.
          </p>
        </div>

        {/* Games List */}
        <div className="space-y-6">
          {games.map((game: any, index: number) => (
            <Card key={game.id} className="p-6 border-border/60 bg-card/60 backdrop-blur-md space-y-4">

              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge variant="outline" className="bg-purple-500/10 text-purple-300 border-purple-500/30">
                      {game.gameType || "Licensed Game"}
                    </Badge>
                    <Badge variant="outline" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 capitalize">
                      {game.category}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-black text-foreground">
                    {index + 1}. {game.derivedTitle || game.title}
                  </h3>
                </div>
                <a
                  href={game.gameUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 rounded-xl bg-slate-900 border border-border/60 px-3.5 py-2 text-xs font-bold text-cyan-400 hover:bg-slate-800 transition-colors"
                >
                  <span>View on GamePix</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">{game.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground">Source: </span>
                  <strong className="text-foreground">{game.sourceNetwork || game.author}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">Published: </span>
                  <strong className="text-foreground">{new Date(game.releaseDate).toLocaleDateString()}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">Catalog ID: </span>
                  <code className="font-mono text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded">
                    {game.externalGameId}
                  </code>
                </div>
              </div>

            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}
