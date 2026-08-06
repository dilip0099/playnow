import { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { ShieldCheck, Gamepad2, ArrowRight, Lock, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Admin Overview - PlayThorn Admin",
  description: "Platform catalog CMS and legal audit navigation.",
};

function loadOverviewData() {
  const gamesPath = path.join(process.cwd(), "src", "data", "games.json");
  let games: any[] = [];
  try {
    if (fs.existsSync(gamesPath)) games = JSON.parse(fs.readFileSync(gamesPath, "utf-8"));
  } catch (e) {}
  return { games };
}

export default function AdminPage() {
  const { games } = loadOverviewData();
  const commercialReadyCount = games.filter((g) => g.commercialReady).length;
  const newThisWeek = games.filter((g) => g.isNew).length;

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
            <h1 className="text-3xl font-black text-white">Admin Overview</h1>
            <p className="text-sm text-slate-400 mt-1">
              Catalog CMS and legal audit navigation. Real play/revenue analytics live in your GameMonetize publisher dashboard, not here.
            </p>
          </div>

          <Link href="/admin/compliance">
            <button className="rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold px-5 py-2.5 text-xs shadow-lg shadow-purple-600/30 flex items-center space-x-2">
              <ShieldCheck className="h-4 w-4" />
              <span>Legal Telemetry Dashboard</span>
            </button>
          </Link>
        </div>

        {/* Quick Metric Cards — every number here is derived from src/data/games.json, nothing invented */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="p-6 border-border/60 bg-card/60 backdrop-blur-md space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase">Active Games Catalog</div>
            <div className="text-3xl font-black text-white">{games.length} Titles</div>
            <div className="text-xs text-slate-400 font-semibold">Sourced via GameMonetize</div>
          </Card>

          <Card className="p-6 border-border/60 bg-card/60 backdrop-blur-md space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase">New This Week</div>
            <div className="text-3xl font-black text-purple-300">{newThisWeek} Titles</div>
            <div className="text-xs text-slate-400 font-semibold">Refreshed weekly from GameMonetize</div>
          </Card>

          <Card className="p-6 border-border/60 bg-card/60 backdrop-blur-md space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase">Legal Status</div>
            <div className="text-3xl font-black text-cyan-400">{commercialReadyCount === games.length ? "PASSED" : "REVIEW NEEDED"}</div>
            <div className="text-xs text-cyan-400 font-semibold">{commercialReadyCount} / {games.length} commercial-ready</div>
          </Card>
        </div>

        {/* Real revenue/play data lives on GameMonetize's side, not ours — link out instead of faking it */}
        <a
          href="https://gamemonetize.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/60 p-5 hover:bg-slate-800/60 transition-colors group"
        >
          <div>
            <h3 className="text-sm font-bold text-white">Revenue & Play Analytics</h3>
            <p className="text-xs text-slate-400 mt-0.5">Tracked in your GameMonetize publisher dashboard, not here — PlayThorn doesn't run its own ad/analytics stack.</p>
          </div>
          <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
        </a>

        {/* Sub-Admin CMS Portals Grid */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-white">Admin Management Modules</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

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
                  Browse metadata, categories, and licensing status across the catalog.
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
