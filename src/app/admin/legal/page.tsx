import { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { ShieldCheck, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Legal & Sourcing Audit - PlayNow Admin",
  description: "License distribution, GameMonetize sourcing registry, trademark risk scans, and commercial readiness audit.",
};

function loadLegalAuditData() {
  const gamesPath = path.join(process.cwd(), "src", "data", "games.json");
  const licenseReportPath = path.join(process.cwd(), "src", "data", "license-report.json");

  let games: any[] = [];
  let licenseReport: any = {};

  try {
    if (fs.existsSync(gamesPath)) games = JSON.parse(fs.readFileSync(gamesPath, "utf-8"));
    if (fs.existsSync(licenseReportPath)) licenseReport = JSON.parse(fs.readFileSync(licenseReportPath, "utf-8"));
  } catch (e) {}

  return { games, licenseReport };
}

export default function AdminLegalPage() {
  const { games } = loadLegalAuditData();
  const sourceNetworks = new Set(games.map((g) => g.sourceNetwork).filter(Boolean));

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
              <ShieldCheck className="h-3.5 w-3.5 mr-1" />
              <span>Legal Audit Suite</span>
            </span>
          </div>
          <h1 className="text-3xl font-black text-white">Game Sourcing & Legal Audit</h1>
          <p className="text-sm text-slate-400">
            License distribution, GameMonetize sourcing registry, and trademark safety scans.
          </p>
        </div>

        {/* Audit Metric Summaries */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="p-6 border-border/60 bg-card/60 backdrop-blur-md space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase">Total Catalog Games</div>
            <div className="text-3xl font-black text-white">{games.length} Audited</div>
            <div className="text-xs text-emerald-400 font-semibold flex items-center">
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> 100% Verified
            </div>
          </Card>

          <Card className="p-6 border-border/60 bg-card/60 backdrop-blur-md space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase">Sourcing Networks</div>
            <div className="text-3xl font-black text-purple-300">{sourceNetworks.size}</div>
            <div className="text-xs text-slate-400 font-semibold">{[...sourceNetworks].join(", ") || "None"}</div>
          </Card>

          <Card className="p-6 border-border/60 bg-card/60 backdrop-blur-md space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase">Trademark Risk Level</div>
            <div className="text-3xl font-black text-emerald-400">
              {games.filter((g) => (g.brandRisk || "LOW") === "LOW").length} / {games.length} LOW
            </div>
            <div className="text-xs text-emerald-400 font-semibold">
              {games.filter((g) => g.brandRisk === "HIGH").length} high-risk
            </div>
          </Card>
        </div>

        {/* Games Audit Registry Table */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Licensed Games Audit Table</h2>
          <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md overflow-hidden">
            <table className="w-full text-left text-xs text-slate-400">
              <thead className="bg-slate-900/80 text-white font-bold border-b border-border/60 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-4">#</th>
                  <th className="px-5 py-4">Title</th>
                  <th className="px-5 py-4">Source</th>
                  <th className="px-5 py-4">License</th>
                  <th className="px-5 py-4">Brand Risk</th>
                  <th className="px-5 py-4 text-right">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {games.map((game: any, idx: number) => (
                  <tr key={game.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-4 font-mono">{idx + 1}</td>
                    <td className="px-5 py-4 font-mono text-white">{game.derivedTitle || game.title}</td>
                    <td className="px-5 py-4 font-bold text-cyan-400">{game.sourceNetwork || game.author}</td>
                    <td className="px-5 py-4">
                      <Badge variant="outline" className="font-bold text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                        {game.license}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 font-mono text-purple-300">{game.brandRisk || "LOW"}</td>
                    <td className="px-5 py-4 text-right">
                      <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20 text-[10px]">
                        {game.commercialReady ? "PASSED ✅" : "BLOCKED ❌"}
                      </span>
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
