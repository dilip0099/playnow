import { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { Layers, ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Asset Provenance & Ownership Registry - GameHub Legal",
  description: "Independent asset SHA256 checksums, GameHub Studios ownership status, and asset licensing audit.",
};

export default function LegalAssetsPage() {
  const assetSourcesPath = path.join(process.cwd(), "src", "data", "asset-sources.json");
  let assetSources: any[] = [];
  if (fs.existsSync(assetSourcesPath)) {
    try {
      assetSources = JSON.parse(fs.readFileSync(assetSourcesPath, "utf-8"));
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
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
              <Layers className="h-3.5 w-3.5 mr-1" />
              <span>Independent Asset Registry</span>
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground">Asset Provenance & Ownership Registry</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Every image, vector art, audio, and font file hosted on GameHub possesses an independent SHA256 provenance checksum and verified ownership rights (`creator: GameHub Studios`).
          </p>
        </div>

        {/* Asset Sources Table */}
        <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-muted-foreground">
              <thead className="bg-slate-900/80 text-foreground font-bold border-b border-border/60 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-4">#</th>
                  <th className="px-5 py-4">Asset Path</th>
                  <th className="px-5 py-4">Independent Creator</th>
                  <th className="px-5 py-4">Ownership Status</th>
                  <th className="px-5 py-4">Asset License</th>
                  <th className="px-5 py-4 text-right">Commercial Permission</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {assetSources.map((asset: any, index: number) => (
                  <tr key={asset.assetHash} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-4 font-mono">{index + 1}</td>
                    <td className="px-5 py-4 font-mono text-[11px] text-foreground">{asset.assetPath}</td>
                    <td className="px-5 py-4 font-bold text-cyan-400">{asset.creator}</td>
                    <td className="px-5 py-4">
                      <Badge variant="outline" className="font-bold text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                        {asset.ownershipStatus || "OWNED"}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 font-mono text-purple-300">{asset.license}</td>
                    <td className="px-5 py-4 text-right">
                      {asset.commercialUse ? (
                        <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 text-[10px] inline-flex items-center space-x-1">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          <span>ALLOWED</span>
                        </span>
                      ) : (
                        <span className="font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20 text-[10px]">
                          PROHIBITED
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
    </div>
  );
}
