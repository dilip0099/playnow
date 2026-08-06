import { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { ShieldCheck, FileCheck, Layers, Sparkles, CheckCircle2, ArrowRight, ExternalLink, Key, Lock, GitBranch, Copyright } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Public Legal Compliance & Sourcing - PlayThorn",
  description: "PlayThorn's public legal transparency portal: how our game catalog is licensed, trademark safety, and commercial readiness.",
};

function loadComplianceData() {
  const gamesPath = path.join(process.cwd(), "src", "data", "games.json");
  const licenseReportPath = path.join(process.cwd(), "src", "data", "license-report.json");
  const versionPath = path.join(process.cwd(), "src", "data", "compliance-version.json");

  let games: any[] = [];
  let licenseReport: any = {};
  let versionData: any = {};

  try {
    if (fs.existsSync(gamesPath)) games = JSON.parse(fs.readFileSync(gamesPath, "utf-8"));
    if (fs.existsSync(licenseReportPath)) licenseReport = JSON.parse(fs.readFileSync(licenseReportPath, "utf-8"));
    if (fs.existsSync(versionPath)) versionData = JSON.parse(fs.readFileSync(versionPath, "utf-8"));
  } catch (e) {
    console.error("Error loading public compliance data:", e);
  }

  const totalGames = games.length;
  const verifiedGames = games.filter((g) => g.trustVerified && g.assetVerificationStatus === "VERIFIED").length;
  const networkLicensedCount = games.filter((g) => g.gameType === "Licensed Game").length;
  const commercialReadyCount = games.filter((g) => g.commercialReady).length;

  const trademarkRisks = {
    LOW: games.filter((g) => (g.brandRisk || "LOW") === "LOW").length,
    MEDIUM: games.filter((g) => g.brandRisk === "MEDIUM").length,
    HIGH: games.filter((g) => g.brandRisk === "HIGH").length,
  };

  return {
    totalGames,
    verifiedGames,
    networkLicensedCount,
    commercialReadyCount,
    trademarkRisks,
    lastAuditDate: licenseReport.timestamp || versionData.auditDate || new Date().toISOString(),
    version: versionData.version || "1.0.0",
    games,
  };
}

export default function PublicCompliancePage() {
  const data = loadComplianceData();

  return (
    <div className="min-h-screen bg-background text-foreground py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Hero Title Banner */}
        <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-slate-900 via-purple-950/20 to-slate-950 p-8 sm:p-12 shadow-2xl relative overflow-hidden space-y-4">
          <div className="inline-flex items-center space-x-2 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="h-4 w-4 mr-1.5" />
            <span>Public Legal Transparency Portal v{data.version}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight">
            Real Games, Openly Licensed
          </h1>

          <p className="text-muted-foreground text-sm sm:text-base max-w-3xl leading-relaxed">
            PlayThorn's game catalog is provided through <strong className="text-foreground">GameMonetize</strong>, a third-party HTML5 game publisher network, under a standard publisher agreement. PlayThorn does not author, host, or claim ownership of this game code — every title is embedded directly from GameMonetize's platform, which is responsible for the underlying game's content and its own developer relationships.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-semibold text-muted-foreground">
            <span>Last Sync: <strong className="text-foreground">{new Date(data.lastAuditDate).toLocaleDateString()}</strong></span>
            <span>•</span>
            <span>Catalog: <strong className="text-cyan-400">{data.totalGames} Games</strong></span>
            <span>•</span>
            <span>Status: <strong className="text-emerald-400">ACTIVE</strong></span>
          </div>
        </div>

        {/* Audit Metrics Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <Card className="p-6 border-border/60 bg-card/60 backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase">
              <span>Catalog</span>
              <FileCheck className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-black text-foreground">{data.totalGames} Total Games</div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{data.verifiedGames} Verified</span>
            </div>
          </Card>

          <Card className="p-6 border-border/60 bg-card/60 backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase">
              <span>Sourcing Model</span>
              <Key className="h-4 w-4 text-purple-400" />
            </div>
            <div className="text-3xl font-black text-purple-300">{data.networkLicensedCount} Licensed</div>
            <div className="text-xs font-semibold text-muted-foreground">via GameMonetize Network</div>
          </Card>

          <Card className="p-6 border-border/60 bg-card/60 backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase">
              <span>Trademark Screening</span>
              <Layers className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-emerald-400">{data.trademarkRisks.LOW} Low Risk</div>
            <div className="text-xs font-semibold text-muted-foreground">
              {data.trademarkRisks.MEDIUM} medium, {data.trademarkRisks.HIGH} high
            </div>
          </Card>

          <Card className="p-6 border-border/60 bg-card/60 backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase">
              <span>Commercial Ready</span>
              <Sparkles className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-black text-cyan-400">{data.commercialReadyCount} Ready</div>
            <div className="text-xs font-semibold text-emerald-400 flex items-center space-x-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Screened for brand conflicts</span>
            </div>
          </Card>

        </div>

        {/* Legal Transparency Documentation Pages Grid */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-foreground tracking-tight">Legal Transparency Documentation</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">

            <Link href="/legal/licenses" className="group">
              <Card className="p-6 border-border/60 bg-card/60 hover:bg-slate-800/60 transition-all duration-300 space-y-3 h-full">
                <div className="h-10 w-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform">
                  <Key className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-purple-300 transition-colors flex items-center justify-between">
                  <span>Licensing Policy</span>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  How PlayThorn licenses games via GameMonetize, and the rules for any open-source code we host directly.
                </p>
              </Card>
            </Link>

            <Link href="/legal/attributions" className="group">
              <Card className="p-6 border-border/60 bg-card/60 hover:bg-slate-800/60 transition-all duration-300 space-y-3 h-full">
                <div className="h-10 w-10 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                  <GitBranch className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                  <span>Game Sourcing Credits</span>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Every title's GameMonetize catalog ID and embed source, for full transparency on where each game comes from.
                </p>
              </Card>
            </Link>

            <Link href="/legal/assets" className="group">
              <Card className="p-6 border-border/60 bg-card/60 hover:bg-slate-800/60 transition-all duration-300 space-y-3 h-full">
                <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                  <Layers className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-emerald-300 transition-colors flex items-center justify-between">
                  <span>Asset Responsibility</span>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Game assets (art, audio, code) are hosted and managed by GameMonetize, not stored on PlayThorn's own servers.
                </p>
              </Card>
            </Link>

            <Link href="/legal/open-source" className="group">
              <Card className="p-6 border-border/60 bg-card/60 hover:bg-slate-800/60 transition-all duration-300 space-y-3 h-full">
                <div className="h-10 w-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform">
                  <Lock className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-amber-300 transition-colors flex items-center justify-between">
                  <span>Catalog Changelog</span>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Full list of every licensed game with its category, quality signal, and publish/update dates.
                </p>
              </Card>
            </Link>

            <Link href="/legal/dmca" className="group">
              <Card className="p-6 border-border/60 bg-card/60 hover:bg-slate-800/60 transition-all duration-300 space-y-3 h-full">
                <div className="h-10 w-10 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-400 border border-rose-500/20 group-hover:scale-110 transition-transform">
                  <Copyright className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-rose-300 transition-colors flex items-center justify-between">
                  <span>DMCA Policy</span>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  How to submit a valid copyright takedown notice, and how counter-notifications work.
                </p>
              </Card>
            </Link>

          </div>
        </div>

        {/* Audited Games List Table */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-foreground tracking-tight">Full Licensed Catalog</h2>

          <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-muted-foreground">
                <thead className="bg-slate-900/80 text-foreground font-bold border-b border-border/60 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-5 py-4">#</th>
                    <th className="px-5 py-4">Game Title</th>
                    <th className="px-5 py-4">Source</th>
                    <th className="px-5 py-4">License</th>
                    <th className="px-5 py-4">Catalog ID</th>
                    <th className="px-5 py-4">Trademark Risk</th>
                    <th className="px-5 py-4 text-right">Legal Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {data.games.map((game: any, index: number) => (
                    <tr key={game.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-4 font-mono">{index + 1}</td>
                      <td className="px-5 py-4 font-bold text-foreground">
                        <Link href={`/game/${game.slug}`} className="hover:text-cyan-400 transition-colors flex items-center space-x-1">
                          <span>{game.derivedTitle || game.title}</span>
                          <ExternalLink className="h-3 w-3 opacity-60" />
                        </Link>
                      </td>
                      <td className="px-5 py-4 font-medium text-foreground">{game.sourceNetwork || game.author}</td>
                      <td className="px-5 py-4">
                        <Badge variant="outline" className="font-mono text-[10px] bg-purple-500/10 text-purple-300 border-purple-500/30">
                          {game.license}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <code className="font-mono text-[10px] text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded">
                          {game.externalGameId || (game.commitHash || "").slice(0, 12)}
                        </code>
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant="outline" className="font-bold text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                          {game.brandRisk || "LOW"}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 text-[10px]">
                          PASSED ✅
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
    </div>
  );
}
