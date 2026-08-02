import { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { DollarSign, ShieldCheck, Play, ArrowLeft, CheckCircle2, TrendingUp, Wallet, ExternalLink, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Developer Revenue Dashboard - PlayNow",
  description: "Developer portal for earnings telemetry, ad revenue share tracking, submitted games status, and payouts.",
};

function loadDevData() {
  const gamesPath = path.join(process.cwd(), "src", "data", "games.json");
  const adsPath = path.join(process.cwd(), "src", "data", "ads.json");

  let games = [];
  let adsData: any = {};

  try {
    if (fs.existsSync(gamesPath)) games = JSON.parse(fs.readFileSync(gamesPath, "utf-8"));
    if (fs.existsSync(adsPath)) adsData = JSON.parse(fs.readFileSync(adsPath, "utf-8"));
  } catch (e) {}

  return { games, adsData };
}

export default function DeveloperDashboardPage() {
  const { games, adsData } = loadDevData();

  // Mock Developer Portfolio
  const devGames = games.slice(0, 3);
  const totalDevEarnings = devGames.reduce((acc: number, g: any, idx: number) => acc + (1420.80 / (idx + 1)), 0);

  return (
    <div className="min-h-screen bg-background text-foreground py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
                <DollarSign className="h-3.5 w-3.5 mr-1" />
                <span>Developer Monetization Partner (70% Share)</span>
              </span>
            </div>
            <h1 className="text-3xl font-black text-foreground tracking-tight">Developer Revenue Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track open-source game submissions, play telemetry, commercial compliance, and monthly ad payouts.
            </p>
          </div>

          <Link href="/developers">
            <Button className="rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold px-5 shadow-lg shadow-purple-500/20 transition-all flex items-center space-x-2 text-xs">
              <Plus className="h-4 w-4" />
              <span>Submit New Game</span>
            </Button>
          </Link>
        </div>

        {/* Revenue Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <Card className="p-6 border-border/60 bg-card/60 backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase">
              <span>Total Earnings (70%)</span>
              <Wallet className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-emerald-400">${totalDevEarnings.toFixed(2)}</div>
            <div className="text-xs font-semibold text-muted-foreground">
              Next Payout: 15th of next month
            </div>
          </Card>

          <Card className="p-6 border-border/60 bg-card/60 backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase">
              <span>Active Titles</span>
              <Play className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-black text-foreground">{devGames.length} Published</div>
            <div className="text-xs font-semibold text-emerald-400 flex items-center space-x-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>100% Monetization Active</span>
            </div>
          </Card>

          <Card className="p-6 border-border/60 bg-card/60 backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase">
              <span>Portfolio Plays</span>
              <TrendingUp className="h-4 w-4 text-purple-400" />
            </div>
            <div className="text-3xl font-black text-purple-300">112.7k Plays</div>
            <div className="text-xs font-semibold text-muted-foreground">
              Average eCPM: $3.75
            </div>
          </Card>

          <Card className="p-6 border-border/60 bg-card/60 backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase">
              <span>Legal Compliance</span>
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-black text-cyan-400">PASSED</div>
            <div className="text-xs font-semibold text-emerald-400">
              Commercial Ready: 100%
            </div>
          </Card>

        </div>

        {/* Developer Submitted Games Portfolio Table */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-foreground tracking-tight">Monetized Games Portfolio</h2>
          
          <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-muted-foreground">
                <thead className="bg-slate-900/80 text-foreground font-bold border-b border-border/60 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-5 py-4">#</th>
                    <th className="px-5 py-4">Game Title</th>
                    <th className="px-5 py-4">License</th>
                    <th className="px-5 py-4">Plays Count</th>
                    <th className="px-5 py-4">Revenue Generated</th>
                    <th className="px-5 py-4">Dev Share (70%)</th>
                    <th className="px-5 py-4">Compliance Status</th>
                    <th className="px-5 py-4 text-right">Payout Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {devGames.map((game: any, index: number) => {
                    const grossRevenue = 1420.80 / (index + 1);
                    const devShare = grossRevenue * 0.70;
                    return (
                      <tr key={game.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-5 py-4 font-mono">{index + 1}</td>
                        <td className="px-5 py-4 font-bold text-foreground">
                          <Link href={`/game/${game.slug}`} className="hover:text-cyan-400 transition-colors flex items-center space-x-1">
                            <span>{game.derivedTitle || game.title}</span>
                            <ExternalLink className="h-3 w-3 opacity-60" />
                          </Link>
                        </td>
                        <td className="px-5 py-4 font-mono text-purple-300">{game.originalLicense || game.license}</td>
                        <td className="px-5 py-4 font-bold text-foreground font-mono">{(game.playsCount || 12000).toLocaleString()}</td>
                        <td className="px-5 py-4 font-mono font-semibold text-foreground">${grossRevenue.toFixed(2)}</td>
                        <td className="px-5 py-4 font-mono font-black text-emerald-400">${devShare.toFixed(2)}</td>
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
    </div>
  );
}
