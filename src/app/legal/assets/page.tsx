import { Metadata } from "next";
import Link from "next/link";
import { Layers, ArrowLeft, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Asset Responsibility - PlayNow Legal",
  description: "Game art, audio, and code assets on PlayNow are hosted and managed by GameMonetize, not stored on PlayNow's own servers.",
};

export default function LegalAssetsPage() {
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
              <span>Asset Hosting Model</span>
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground">Asset Responsibility</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            PlayNow does not store or host game art, audio, or executable game code on its own servers. Every game is embedded live from <strong className="text-foreground">GameMonetize</strong>'s platform via iframe — GameMonetize hosts, serves, and is responsible for the underlying assets, and manages its own relationships with the original game developers.
          </p>
        </div>

        <Card className="p-6 border-border/60 bg-card/60 space-y-4">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-foreground">What PlayNow Verifies</h2>
          </div>
          <ul className="text-xs text-muted-foreground leading-relaxed space-y-2 list-disc list-inside">
            <li>Each title's public GameMonetize catalog listing and embed URL are checked before being added to PlayNow's catalog.</li>
            <li>Titles and descriptions are screened against a trademark/brand-conflict denylist before listing (see the automated screening in <code className="text-cyan-400">src/scripts/import-gamemonetize.ts</code>).</li>
            <li>Thumbnails, cover art, and screenshots shown on PlayNow are the same public images GameMonetize provides for each listing — PlayNow does not modify, re-host, or re-license them independently.</li>
          </ul>
          <p className="text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border/40">
            For a specific game's original developer, license terms, or asset ownership, refer to that game's page on <a href="https://gamemonetize.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">GameMonetize.com</a> directly, or see its embed link on PlayNow's <Link href="/legal/attributions" className="text-cyan-400 hover:underline">Game Sourcing Credits</Link> page.
          </p>
        </Card>

      </div>
    </div>
  );
}
