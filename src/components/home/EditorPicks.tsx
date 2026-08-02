import Link from "next/link";
import { Sparkles, Code2, ExternalLink, ShieldCheck, Heart } from "lucide-react";
import { GameMetadata } from "@/types/game";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EditorPicksProps {
  games: GameMetadata[];
}

export function EditorPicks({ games }: EditorPicksProps) {
  const picks = games.slice(0, 3);

  return (
    <div className="space-y-6">
      
      {/* Editor Picks Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-amber-400" />
          <span>Editor Picks & Highlights</span>
        </h2>
      </div>

      {/* Grid of Picks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {picks.map((game) => (
          <Card key={game.id} className="p-5 border-border/60 bg-card/60 backdrop-blur-md space-y-4 hover:border-purple-500/50 transition-all">
            <div className="flex items-center justify-between">
              <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px] font-bold uppercase">
                Staff Pick
              </Badge>
              <Badge variant="outline" className="font-mono text-[10px] bg-purple-500/10 text-purple-300 border-purple-500/30">
                {game.license}
              </Badge>
            </div>

            <div>
              <Link href={`/game/${game.slug}`}>
                <h3 className="text-lg font-extrabold text-white hover:text-cyan-300 transition-colors line-clamp-1">
                  {game.derivedTitle || game.title}
                </h3>
              </Link>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {game.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border/40 text-xs">
              <span className="text-slate-400 font-semibold">Author: <strong className="text-white">{game.originalAuthor || game.author}</strong></span>
              <Link href={`/game/${game.slug}`} className="text-xs font-bold text-cyan-400 hover:underline flex items-center space-x-1">
                <span>Play Now</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {/* Developer Spotlight Banner */}
      <Card className="p-6 sm:p-8 border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-950 backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
              <Code2 className="h-3.5 w-3.5" />
              <span>Developer Publishing Network</span>
            </div>
            <h3 className="text-2xl font-black text-white">Are You an Open-Source HTML5 Game Creator?</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Publish your permissive-licensed browser game on GameHub. Enjoy 70% ad revenue share, automated legal verification, and global player exposure.
            </p>
          </div>

          <Link href="/developers">
            <button className="rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs px-6 py-3 shadow-lg shadow-purple-600/30 transition-all hover:scale-105 shrink-0">
              Submit Game Repository
            </button>
          </Link>
        </div>
      </Card>

    </div>
  );
}
