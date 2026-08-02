import { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { GitBranch, ArrowLeft, ExternalLink, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Author Attributions & Code Provenance - GameHub Legal",
  description: "Official open-source author attributions, repository URLs, Git commit hashes, and LICENSE file links.",
};

export default function LegalAttributionsPage() {
  const gamesPath = path.join(process.cwd(), "src", "data", "games.json");
  let games = [];
  if (fs.existsSync(gamesPath)) {
    try {
      games = JSON.parse(fs.readFileSync(gamesPath, "utf-8"));
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
            <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400 border border-cyan-500/20 flex items-center space-x-1">
              <GitBranch className="h-3.5 w-3.5 mr-1" />
              <span>Public Attributions Registry</span>
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground">Author Attributions & Code Provenance</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Full legal attribution is preserved for all open-source creator repositories. Every game entry maintains direct links to original GitHub repositories, original authors, and exact Git commit hashes.
          </p>
        </div>

        {/* Attributions Table */}
        <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-muted-foreground">
              <thead className="bg-slate-900/80 text-foreground font-bold border-b border-border/60 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-4">#</th>
                  <th className="px-5 py-4">Derived Title</th>
                  <th className="px-5 py-4">Original Author</th>
                  <th className="px-5 py-4">Original Repository</th>
                  <th className="px-5 py-4">License</th>
                  <th className="px-5 py-4 text-right">Git Commit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {games.map((game: any, index: number) => (
                  <tr key={game.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-4 font-mono">{index + 1}</td>
                    <td className="px-5 py-4 font-bold text-foreground">
                      <Link href={`/game/${game.slug}`} className="hover:text-cyan-400 transition-colors">
                        {game.derivedTitle || game.title}
                      </Link>
                    </td>
                    <td className="px-5 py-4 font-medium text-foreground">{game.originalAuthor || game.author}</td>
                    <td className="px-5 py-4">
                      <a
                        href={game.originalRepository || game.repository}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:underline flex items-center space-x-1"
                      >
                        <span>GitHub Repo</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant="outline" className="font-mono text-[10px] bg-purple-500/10 text-purple-300 border-purple-500/30">
                        {game.originalLicense || game.license}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <code className="font-mono text-[10px] text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded">
                        {(game.originalCommitHash || game.commitHash || "").slice(0, 7)}
                      </code>
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
