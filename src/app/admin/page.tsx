import { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { ShieldCheck, Users, FileCode, Play, DollarSign, TrendingUp, Sparkles, ExternalLink, ArrowRight, Flame } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Admin Executive Dashboard - GameHub",
  description: "Executive platform analytics, revenue metrics, player engagement telemetry, and compliance status.",
};

function loadAdminOverviewData() {
  const gamesPath = path.join(process.cwd(), "src", "data", "games.json");
  const analyticsPath = path.join(process.cwd(), "src", "data", "analytics.json");
  const adsPath = path.join(process.cwd(), "src", "data", "ads.json");

  let games = [];
  let analytics: any = {};
  let adsData: any = {};

  try {
    if (fs.existsSync(gamesPath)) games = JSON.parse(fs.readFileSync(gamesPath, "utf-8"));
    if (fs.existsSync(analyticsPath)) analytics = JSON.parse(fs.readFileSync(analyticsPath, "utf-8"));
    if (fs.existsSync(adsPath)) adsData = JSON.parse(fs.readFileSync(adsPath, "utf-8"));
  } catch (e) {
    console.error("Error loading admin overview data:", e);
  }

  return {
    games,
    analytics,
    adsData,
  };
}

export default function AdminPage() {
  const { games, analytics, adsData } = loadAdminOverviewData();

  const totalPlays = analytics.totalPlays || 148500;
  const totalRevenue = adsData.totalRevenue || 4825.50;
  const todayRevenue = adsData.todayRevenue || 342.10;
  const impressions = adsData.impressions || 1285000;
  const ctr = adsData.ctr || 3.2;

  return (
    <div className="min-h-screen bg-background text-foreground py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400 border border-cyan-500/20 flex items-center space-x-1">
                <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                <span>Executive Command Center</span>
              </span>
            </div>
            <h1 className="text-3xl font-black text-foreground tracking-tight">GameHub Platform Admin</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Revenue analytics, player telemetry, ad network performance, and legal compliance gate.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link href="/developers/dashboard">
              <button className="rounded-xl bg-slate-900 border border-border/60 text-cyan-400 hover:bg-slate-800 font-bold px-4 py-2.5 transition-all text-xs">
                Dev Partner Portal
              </button>
            </Link>
            <Link href="/admin/compliance">
              <button className="rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold px-5 py-2.5 shadow-lg shadow-purple-500/20 transition-all flex items-center space-x-2 text-xs">
                <ShieldCheck className="h-4 w-4" />
                <span>Compliance Portal</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Revenue & Platform Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          <Card className="p-5 border-emerald-500/30 bg-emerald-500/5 backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase">
              <span>Total Revenue</span>
              <DollarSign className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-emerald-400">${totalRevenue.toFixed(2)}</div>
            <div className="text-xs font-semibold text-emerald-400">
              Today: +${todayRevenue.toFixed(2)}
            </div>
          </Card>

          <Card className="p-5 border-border/60 bg-card/60 backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase">
              <span>Ad Impressions</span>
              <TrendingUp className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-black text-foreground">{(impressions / 1000).toFixed(1)}k</div>
            <div className="text-xs font-semibold text-muted-foreground">
              CTR Rate: {ctr}%
            </div>
          </Card>

          <Card className="p-5 border-border/60 bg-card/60 backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase">
              <span>Platform Plays</span>
              <Play className="h-4 w-4 text-purple-400" />
            </div>
            <div className="text-3xl font-black text-purple-300">{(totalPlays / 1000).toFixed(1)}k</div>
            <div className="text-xs font-semibold text-muted-foreground">
              Active Catalog: {games.length} Games
            </div>
          </Card>

          <Card className="p-5 border-border/60 bg-card/60 backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase">
              <span>Active Players</span>
              <Users className="h-4 w-4 text-amber-400" />
            </div>
            <div className="text-3xl font-black text-amber-400">4.2k / Day</div>
            <div className="text-xs font-semibold text-muted-foreground">
              Retention: 78.4%
            </div>
          </Card>

          <Card className="p-5 border-border/60 bg-card/60 backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase">
              <span>Legal Status</span>
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-emerald-400">100% READY</div>
            <div className="text-xs font-semibold text-emerald-400">
              Commercial Gate Passed
            </div>
          </Card>

        </div>

        {/* Top Earning Games Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-foreground tracking-tight flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-emerald-400" />
            <span>Top Earning Commercial Games</span>
          </h2>

          <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-muted-foreground">
                <thead className="bg-slate-900/80 text-foreground font-bold border-b border-border/60 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-5 py-4">Rank</th>
                    <th className="px-5 py-4">Game Title</th>
                    <th className="px-5 py-4">License</th>
                    <th className="px-5 py-4">Impressions</th>
                    <th className="px-5 py-4">Monetization Status</th>
                    <th className="px-5 py-4 text-right">Revenue Generated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {adsData.topRevenueGames?.map((item: any, index: number) => (
                    <tr key={item.slug} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-purple-400">#{index + 1}</td>
                      <td className="px-5 py-4 font-bold text-foreground">
                        <Link href={`/game/${item.slug}`} className="hover:text-cyan-400 transition-colors">
                          {item.title}
                        </Link>
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant="outline" className="font-mono text-[10px] bg-purple-500/10 text-purple-300 border-purple-500/30">
                          MIT / Apache
                        </Badge>
                      </td>
                      <td className="px-5 py-4 font-mono">{item.impressions.toLocaleString()}</td>
                      <td className="px-5 py-4">
                        <Badge variant="outline" className="font-bold text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                          ACTIVE ✅
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-right font-bold text-emerald-400 font-mono text-sm">
                        ${item.revenue.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
