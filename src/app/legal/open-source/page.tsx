import { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { Lock, ArrowLeft, GitBranch, ExternalLink, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Derived Games Audit & Changelog - GameHub Legal",
  description: "Comprehensive audit of derived open-source HTML5 games, original repository links, and GameHub modifications.",
};

export default function LegalOpenSourcePage() {
  const gamesPath = path.join(process.cwd(), "src", "data", "games.json");
  let games = [];
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
              <span>Derived Works Audit</span>
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground">Derived Games Audit & Modifications Log</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            In compliance with open-source licenses (MIT, Apache 2.0, BSD), all technical, visual, and performance modifications made by GameHub to original repository codebases are documented below.
          </p>
        </div>

        {/* Derived Games Cards List */}
        <div className="space-y-6">
          {games.map((game: any, index: number) => (
            <Card key={game.id} className="p-6 border-border/60 bg-card/60 backdrop-blur-md space-y-4">
              
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge variant="outline" className="bg-purple-500/10 text-purple-300 border-purple-500/30">
                      {game.gameType || "Derived Game"}
                    </Badge>
                    <Badge variant="outline" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
                      {game.originalLicense || game.license}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-black text-foreground">
                    {index + 1}. {game.derivedTitle || game.title}
                  </h3>
                </div>

                <a
                  href={game.originalRepository || game.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 rounded-xl bg-slate-900 border border-border/60 px-3.5 py-2 text-xs font-bold text-cyan-400 hover:bg-slate-800 transition-colors"
                >
                  <span>Original Repository</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground">Original Author: </span>
                  <strong className="text-foreground">{game.originalAuthor || game.author}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">Git Commit Hash: </span>
                  <code className="font-mono text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded">
                    {(game.originalCommitHash || game.commitHash || "").slice(0, 7)}
                  </code>
                </div>
              </div>

              {/* Modifications Changelog */}
              {game.modifications && game.modifications.length > 0 && (
                <div className="rounded-xl bg-slate-900/60 p-4 border border-border/40 space-y-2">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center space-x-1.5">
                    <GitBranch className="h-3.5 w-3.5 text-purple-400" />
                    <span>Modifications Made by GameHub</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    {game.modifications.map((mod: string, idx: number) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{mod}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}
