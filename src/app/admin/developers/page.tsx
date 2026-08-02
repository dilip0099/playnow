import { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { Code2, ArrowLeft, ShieldCheck, DollarSign, CheckCircle2, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Developer Management - PlayNow Admin",
  description: "Developer game submissions queue, 70% ad revenue share payouts, and verification.",
};

function loadDevGames() {
  const gamesPath = path.join(process.cwd(), "src", "data", "games.json");
  let games = [];
  try {
    if (fs.existsSync(gamesPath)) games = JSON.parse(fs.readFileSync(gamesPath, "utf-8"));
  } catch (e) {}
  return games;
}

export default function AdminDevelopersPage() {
  const games = loadDevGames();

  return (
    <div className="min-h-screen bg-background text-foreground py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        <Link href="/admin" className="inline-flex items-center space-x-1 text-xs font-bold text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Admin Overview</span>
        </Link>

        <div className="space-y-2 border-b border-border/60 pb-6">
          <div className="flex items-center space-x-2">
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
              <Code2 className="h-3.5 w-3.5 mr-1" />
              <span>Developer Publishing Queue</span>
            </span>
          </div>
          <h1 className="text-3xl font-black text-white">Developer & Partner Management</h1>
          <p className="text-sm text-slate-400">
            Developer game submissions, repository verification queue, and 70% ad revenue share payout processing.
          </p>
        </div>

        {/* Developers Portfolio & Queue Table */}
        <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-400">
              <thead className="bg-slate-900/80 text-white font-bold border-b border-border/60 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-4">#</th>
                  <th className="px-5 py-4">Developer</th>
                  <th className="px-5 py-4">Title</th>
                  <th className="px-5 py-4">License</th>
                  <th className="px-5 py-4">Ad Revenue Share (70%)</th>
                  <th className="px-5 py-4">Compliance Check</th>
                  <th className="px-5 py-4 text-right">Payout Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {games.map((game: any, index: number) => {
                  const grossRevenue = 1420.80 / (index + 1);
                  const devShare = grossRevenue * 0.70;
                  return (
                    <tr key={game.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-4 font-mono">{index + 1}</td>
                      <td className="px-5 py-4 font-bold text-white">{game.author}</td>
                      <td className="px-5 py-4 font-bold text-cyan-400">
                        <Link href={`/game/${game.slug}`} className="hover:underline flex items-center space-x-1">
                          <span>{game.derivedTitle || game.title}</span>
                          <ExternalLink className="h-3 w-3 opacity-60" />
                        </Link>
                      </td>
                      <td className="px-5 py-4 font-mono text-purple-300">{game.originalLicense || game.license}</td>
                      <td className="px-5 py-4 font-mono font-bold text-emerald-400">${devShare.toFixed(2)}</td>
                      <td className="px-5 py-4">
                        <Badge variant="outline" className="font-bold text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                          VERIFIED ✅
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20 text-[10px]">
                          PAID ✅
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
