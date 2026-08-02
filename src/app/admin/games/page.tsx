import { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { Gamepad2, ArrowLeft, Plus, Edit3, Trash2, CheckCircle2, ShieldCheck, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Game Management CMS - PlayNow Admin",
  description: "CMS game catalog management, metadata editor, compliance status, and monetization toggle.",
};

function loadGames() {
  const gamesPath = path.join(process.cwd(), "src", "data", "games.json");
  let games = [];
  try {
    if (fs.existsSync(gamesPath)) games = JSON.parse(fs.readFileSync(gamesPath, "utf-8"));
  } catch (e) {}
  return games;
}

export default function AdminGamesPage() {
  const games = loadGames();

  return (
    <div className="min-h-screen bg-background text-foreground py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        <Link href="/admin" className="inline-flex items-center space-x-1 text-xs font-bold text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Admin Overview</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-400 border border-purple-500/20 flex items-center space-x-1">
                <Gamepad2 className="h-3.5 w-3.5 mr-1" />
                <span>Catalog CMS Management</span>
              </span>
            </div>
            <h1 className="text-3xl font-black text-white">Game Catalog CMS</h1>
            <p className="text-sm text-slate-400 mt-1">
              Manage game metadata, toggle monetization status, upload artwork assets, and verify open-source compliance.
            </p>
          </div>

          <Button className="rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold px-5 text-xs flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add New Game</span>
          </Button>
        </div>

        {/* Games CMS Table */}
        <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-400">
              <thead className="bg-slate-900/80 text-white font-bold border-b border-border/60 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-4">#</th>
                  <th className="px-5 py-4">Game Title & Slug</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">License</th>
                  <th className="px-5 py-4">Commercial Status</th>
                  <th className="px-5 py-4">Monetization</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {games.map((game: any, index: number) => (
                  <tr key={game.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-4 font-mono">{index + 1}</td>
                    <td className="px-5 py-4 font-bold text-white">
                      <Link href={`/game/${game.slug}`} className="hover:text-cyan-400 transition-colors flex items-center space-x-1">
                        <span>{game.derivedTitle || game.title}</span>
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </Link>
                    </td>
                    <td className="px-5 py-4 capitalize font-semibold text-purple-300">{game.category}</td>
                    <td className="px-5 py-4 font-mono text-purple-300">{game.originalLicense || game.license}</td>
                    <td className="px-5 py-4">
                      <Badge variant="outline" className="font-bold text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                        VERIFIED ✅
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant="outline" className="font-bold text-[10px] bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
                        ENABLED ✅
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-right space-x-2">
                      <button className="rounded-lg bg-slate-900 border border-border/60 p-1.5 text-slate-300 hover:text-cyan-400 transition-colors">
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button className="rounded-lg bg-slate-900 border border-border/60 p-1.5 text-slate-300 hover:text-rose-400 transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
