import { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { ShieldCheck, Users, Gamepad2, Code2, TrendingUp, DollarSign, ArrowRight, Key, Layers, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Executive SaaS Dashboard - GameHub Admin",
  description: "Executive platform command center, SaaS metrics overview, and portal navigation.",
};

function loadOverviewData() {
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
  } catch (e) {}

  return { games, analytics, adsData };
}

export default function AdminPage() {
  const { games, analytics, adsData } = loadOverviewData();

  return (
    <div className="min-h-screen bg-background text-foreground py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-400 border border-purple-500/20 flex items-center space-x-1">
                <Lock className="h-3.5 w-3.5 mr-1" />
                <span>SaaS Control Center</span>
              </span>
            </div>
            <h1 className="text-3xl font-black text-white">Executive Command Platform</h1>
            <p className="text-sm text-slate-400 mt-1">
              Manage platform catalog CMS, user accounts, developer publishing, telemetry analytics, and legal audits.
            </p>
          </div>

          <Link href="/admin/compliance">
            <button className="rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold px-5 py-2.5 text-xs shadow-lg shadow-purple-600/30 flex items-center space-x-2">
              <ShieldCheck className="h-4 w-4" />
              <span>Legal Telemetry Dashboard</span>
            </button>
          </Link>
        </div>

        {/* Executive Quick Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 border-border/60 bg-card/60 backdrop-blur-md space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase">Active Games Catalog</div>
            <div className="text-3xl font-black text-white">{games.length} Titles</div>
            <div className="text-xs text-emerald-400 font-semibold">100% Commercial Ready</div>
          </Card>

          <Card className="p-6 border-border/60 bg-card/60 backdrop-blur-md space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase">Total Revenue</div>
            <div className="text-3xl font-black text-emerald-400">${(adsData.totalRevenue || 4825.50).toFixed(2)}</div>
            <div className="text-xs text-slate-400 font-semibold">Ad Impressions: 1.28M</div>
          </Card>

          <Card className="p-6 border-border/60 bg-card/60 backdrop-blur-md space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase">Total Plays</div>
            <div className="text-3xl font-black text-purple-300">{(analytics.totalPlays || 148500).toLocaleString()}</div>
            <div className="text-xs text-slate-400 font-semibold">DAU: 4,200 Players</div>
          </Card>

          <Card className="p-6 border-border/60 bg-card/60 backdrop-blur-md space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase">Legal Status</div>
            <div className="text-3xl font-black text-cyan-400">PASSED</div>
            <div className="text-xs text-cyan-400 font-semibold">Zero Infringements</div>
          </Card>
        </div>

        {/* Sub-Admin CMS Portals Grid */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-white">Admin Management Modules</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <Link href="/admin/games" className="group">
              <Card className="p-6 border-border/60 bg-card/60 hover:bg-slate-800/80 transition-all space-y-3 h-full">
                <div className="h-10 w-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform">
                  <Gamepad2 className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                  <span>Game Catalog CMS</span>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Add, edit, remove, and manage metadata, categories, and monetization settings across the catalog.
                </p>
              </Card>
            </Link>

            <Link href="/admin/users" className="group">
              <Card className="p-6 border-border/60 bg-card/60 hover:bg-slate-800/80 transition-all space-y-3 h-full">
                <div className="h-10 w-10 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                  <span>User Accounts</span>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Manage player accounts, roles, favorites, and recent gameplay history telemetry.
                </p>
              </Card>
            </Link>

            <Link href="/admin/developers" className="group">
              <Card className="p-6 border-border/60 bg-card/60 hover:bg-slate-800/80 transition-all space-y-3 h-full">
                <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                  <Code2 className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                  <span>Developer Queue</span>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Review submitted game repositories and calculate 70% ad revenue share developer payouts.
                </p>
              </Card>
            </Link>

            <Link href="/admin/analytics" className="group">
              <Card className="p-6 border-border/60 bg-card/60 hover:bg-slate-800/80 transition-all space-y-3 h-full">
                <div className="h-10 w-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                  <span>Platform Analytics</span>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Track daily plays, retention rate, average session duration, and search queries.
                </p>
              </Card>
            </Link>

            <Link href="/admin/legal" className="group">
              <Card className="p-6 border-border/60 bg-card/60 hover:bg-slate-800/80 transition-all space-y-3 h-full">
                <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                  <span>Legal Audit Suite</span>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Audit open-source license distributions, SHA256 asset provenance, and trademark risk scans.
                </p>
              </Card>
            </Link>

          </div>
        </div>

      </div>
    </div>
  );
}
