"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Search,
  Download,
  AlertTriangle,
  FileCheck,
  Layers,
  Sparkles,
  CheckCircle2,
  XCircle,
  ExternalLink,
  GitBranch,
  Key,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { GameMetadata } from "@/types/game";

interface ComplianceDashboardClientProps {
  initialData: {
    games: GameMetadata[];
    licenseReport: any;
    assetRegistry: any[];
    assetSources: any[];
  };
}

export function ComplianceDashboardClient({ initialData }: ComplianceDashboardClientProps) {
  const games = useMemo(() => Array.isArray(initialData?.games) ? initialData.games : [], [initialData]);
  const licenseReport = initialData?.licenseReport || {};
  const assetRegistry = useMemo(() => Array.isArray(initialData?.assetRegistry) ? initialData.assetRegistry : [], [initialData]);
  const assetSources = useMemo(() => Array.isArray(initialData?.assetSources) ? initialData.assetSources : [], [initialData]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRisk, setSelectedRisk] = useState("all");

  // Metrics Calculations
  const metrics = useMemo(() => {
    const totalGames = games.length;
    const verifiedGames = games.filter((g) => Boolean(g?.trustVerified && g?.assetVerificationStatus === "VERIFIED")).length;
    const rejectedGames = Number(licenseReport?.totalRejected) || 0;

    const licenseCounts = {
      MIT: games.filter((g) => g?.license === "MIT").length,
      Apache: games.filter((g) => g?.license === "Apache-2.0").length,
      BSD: games.filter((g) => String(g?.license || "").startsWith("BSD")).length,
      ISC: games.filter((g) => g?.license === "ISC").length,
      Owned: assetSources.filter((s) => s?.ownershipStatus === "OWNED" || s?.creator === "GameHub Studios").length,
    };

    const totalAssets = assetRegistry.length;
    const ownedAssets = assetSources.filter((s) => s?.ownershipStatus === "OWNED" || s?.creator === "GameHub Studios").length;
    const thirdPartyAssets = totalAssets - ownedAssets;
    const missingRecords = totalAssets - assetSources.length;

    const trademarkRisks = {
      LOW: games.filter((g) => (g?.brandRisk || "LOW") === "LOW").length,
      MEDIUM: games.filter((g) => g?.brandRisk === "MEDIUM").length,
      HIGH: games.filter((g) => g?.brandRisk === "HIGH").length,
    };

    const commercialReadiness = {
      ready: games.filter((g) => Boolean(g?.commercialReady)).length,
      blocked: totalGames - games.filter((g) => Boolean(g?.commercialReady)).length + rejectedGames,
    };

    return {
      totalGames,
      verifiedGames,
      rejectedGames,
      licenseCounts,
      totalAssets,
      ownedAssets,
      thirdPartyAssets,
      missingRecords: Math.max(0, missingRecords),
      trademarkRisks,
      commercialReadiness,
    };
  }, [games, licenseReport, assetRegistry, assetSources]);

  // Filtered Games List
  const filteredGames = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return games.filter((game) => {
      const title = String(game?.title || "").toLowerCase();
      const author = String(game?.author || "").toLowerCase();
      const slug = String(game?.slug || "").toLowerCase();

      const matchesSearch = !query || title.includes(query) || author.includes(query) || slug.includes(query);
      const matchesCategory = selectedCategory === "all" || game?.category === selectedCategory;
      const matchesRisk = selectedRisk === "all" || (game?.brandRisk || "LOW") === selectedRisk;

      return matchesSearch && matchesCategory && matchesRisk;
    });
  }, [games, searchQuery, selectedCategory, selectedRisk]);

  // Export Telemetry JSON
  const handleExportJSON = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      metrics,
      gamesCatalog: games,
      assetRegistry,
      assetSources,
      licenseReport,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gamehub-compliance-report-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400 border border-cyan-500/20 flex items-center space-x-1">
              <ShieldCheck className="h-3.5 w-3.5 mr-1" />
              <span>Internal Admin System</span>
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">GameHub Compliance Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Legal compliance telemetry, repository trust verification, asset provenance, and trademark audit engine.
          </p>
        </div>

        <Button
          onClick={handleExportJSON}
          className="rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold px-5 shadow-lg shadow-purple-500/20 transition-all flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Export Compliance JSON</span>
        </Button>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Games Metric */}
        <Card className="p-5 border-border/60 bg-card/60 backdrop-blur-md space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase">
            <span>Games Status</span>
            <FileCheck className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-foreground">{metrics.totalGames}</div>
          <div className="flex items-center justify-between text-xs font-semibold pt-1 border-t border-border/30">
            <span className="text-emerald-400 flex items-center"><CheckCircle2 className="h-3 w-3 mr-1" /> {metrics.verifiedGames} Verified</span>
            <span className="text-rose-400 flex items-center"><XCircle className="h-3 w-3 mr-1" /> {metrics.rejectedGames} Rejected</span>
          </div>
        </Card>

        {/* Licenses Metric */}
        <Card className="p-5 border-border/60 bg-card/60 backdrop-blur-md space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase">
            <span>License Distribution</span>
            <Key className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-300">
            MIT ({metrics.licenseCounts.MIT})
          </div>
          <div className="text-[11px] font-semibold text-muted-foreground flex flex-wrap gap-x-2">
            <span>Apache: {metrics.licenseCounts.Apache}</span>
            <span>BSD: {metrics.licenseCounts.BSD}</span>
            <span>ISC: {metrics.licenseCounts.ISC}</span>
          </div>
        </Card>

        {/* Assets Metric */}
        <Card className="p-5 border-border/60 bg-card/60 backdrop-blur-md space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase">
            <span>Asset Provenance</span>
            <Layers className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-foreground">{metrics.totalAssets}</div>
          <div className="flex items-center justify-between text-xs font-semibold pt-1 border-t border-border/30">
            <span className="text-cyan-400">Owned: {metrics.ownedAssets}</span>
            <span className="text-amber-400">Missing: {metrics.missingRecords}</span>
          </div>
        </Card>

        {/* Trademark Metric */}
        <Card className="p-5 border-border/60 bg-card/60 backdrop-blur-md space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase">
            <span>Trademark Risk</span>
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">
            LOW: {metrics.trademarkRisks.LOW}
          </div>
          <div className="flex items-center justify-between text-xs font-semibold pt-1 border-t border-border/30">
            <span className="text-amber-400">MED: {metrics.trademarkRisks.MEDIUM}</span>
            <span className="text-rose-400">HIGH: {metrics.trademarkRisks.HIGH}</span>
          </div>
        </Card>

        {/* Commercial Readiness Metric */}
        <Card className="p-5 border-border/60 bg-card/60 backdrop-blur-md space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase">
            <span>Commercial Readiness</span>
            <Sparkles className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-cyan-400">{metrics.commercialReadiness.ready} Ready</div>
          <div className="flex items-center justify-between text-xs font-semibold pt-1 border-t border-border/30 text-rose-400">
            <span>Blocked: {metrics.commercialReadiness.blocked}</span>
          </div>
        </Card>

      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-card/60 p-4 rounded-2xl border border-border/60 backdrop-blur-md">
        
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search games, authors, repositories..."
            className="pl-10 rounded-xl bg-background/60 border-border/60 text-sm"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl bg-background/60 border border-border/60 text-xs px-3 py-2 text-foreground font-semibold focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="arcade">Arcade</option>
            <option value="puzzle">Puzzle</option>
            <option value="action">Action</option>
            <option value="sports">Sports</option>
            <option value="strategy">Strategy</option>
          </select>

          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="rounded-xl bg-background/60 border border-border/60 text-xs px-3 py-2 text-foreground font-semibold focus:outline-none"
          >
            <option value="all">All Risk Levels</option>
            <option value="LOW">LOW Risk</option>
            <option value="MEDIUM">MEDIUM Risk</option>
            <option value="HIGH">HIGH Risk</option>
          </select>
        </div>

      </div>

      {/* Games Compliance Data Table */}
      <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-muted-foreground">
            <thead className="bg-slate-900/80 text-foreground font-bold border-b border-border/60 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-4">#</th>
                <th className="px-5 py-4">Game Title & Slug</th>
                <th className="px-5 py-4">Original Author</th>
                <th className="px-5 py-4">License</th>
                <th className="px-5 py-4">Git Commit</th>
                <th className="px-5 py-4">Asset Provenance</th>
                <th className="px-5 py-4">Brand Risk</th>
                <th className="px-5 py-4 text-right">Commercial Ready</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredGames.map((game, index) => (
                <tr key={game.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-4 font-mono">{index + 1}</td>
                  
                  <td className="px-5 py-4">
                    <div>
                      <Link href={`/game/${game.slug}`} className="font-bold text-foreground hover:text-cyan-400 transition-colors flex items-center space-x-1">
                        <span>{game.derivedTitle || game.title}</span>
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </Link>
                      <span className="font-mono text-[10px] text-muted-foreground">{game.slug}</span>
                    </div>
                  </td>

                  <td className="px-5 py-4 font-medium text-foreground">
                    {game.originalAuthor || game.author}
                  </td>

                  <td className="px-5 py-4">
                    <Badge variant="outline" className="font-mono text-[10px] bg-purple-500/10 text-purple-300 border-purple-500/30">
                      {game.originalLicense || game.license}
                    </Badge>
                  </td>

                  <td className="px-5 py-4">
                    <code className="font-mono text-[10px] text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded">
                      {(game.originalCommitHash || game.commitHash || "").slice(0, 7)}
                    </code>
                  </td>

                  <td className="px-5 py-4">
                    <span className="font-semibold text-emerald-400 flex items-center space-x-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{game.assetVerificationStatus || "VERIFIED"}</span>
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <Badge variant="outline" className="font-bold text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                      {game.brandRisk || "LOW"}
                    </Badge>
                  </td>

                  <td className="px-5 py-4 text-right">
                    {game.commercialReady ? (
                      <span className="font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20 text-[10px]">
                        READY ✅
                      </span>
                    ) : (
                      <span className="font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20 text-[10px]">
                        BLOCKED ❌
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
