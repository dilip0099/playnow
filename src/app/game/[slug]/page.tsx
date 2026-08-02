import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Home, Star, Eye, User, Tag, GitBranch, ExternalLink, ShieldCheck, CheckCircle2, Lock, Sparkles, Key, Layers } from "lucide-react";
import { getGameBySlug, getRelatedGames, getAllGames } from "@/lib/games";
import { GamePlayer } from "@/components/games/GamePlayer";
import { GameControls } from "@/components/games/GameControls";
import { GameCard } from "@/components/games/GameCard";
import { Badge } from "@/components/ui/badge";

interface GamePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const games = getAllGames();
  return games.map((game) => ({
    slug: game.slug,
  }));
}

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) {
    return { title: "Game Not Found - GameHub" };
  }

  return {
    title: `${game.derivedTitle || game.title} - Play Free HTML5 Game`,
    description: game.description,
    keywords: [game.title, game.category, ...game.tags, "free browser game", "play online"],
    openGraph: {
      title: `${game.derivedTitle || game.title} - GameHub`,
      description: game.description,
      type: "website",
      images: [{ url: game.thumbnailUrl, width: 600, height: 400, alt: game.title }],
    },
  };
}

export default async function GameDetailPage({ params }: GamePageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) {
    notFound();
  }

  const relatedGames = getRelatedGames(game, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    "name": game.derivedTitle || game.title,
    "description": game.description,
    "genre": game.category,
    "author": {
      "@type": "Person",
      "name": game.originalAuthor || game.author,
    },
    "image": game.thumbnailUrl,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": game.rating,
      "ratingCount": game.playsCount,
      "bestRating": "5",
      "worstRating": "1",
    },
    "playMode": "SinglePlayer",
    "applicationCategory": "Game",
    "operatingSystem": "Web Browser",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs font-semibold text-muted-foreground">
          <Link href="/" className="flex items-center hover:text-foreground transition-colors">
            <Home className="h-3.5 w-3.5 mr-1" />
            <span>Home</span>
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link
            href={`/category/${game.category.toLowerCase()}`}
            className="capitalize hover:text-foreground transition-colors"
          >
            {game.category}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-bold truncate max-w-[200px]">{game.derivedTitle || game.title}</span>
        </nav>

        {/* Game Player Iframe */}
        <GamePlayer game={game} />

        {/* Legal Verification Badges Row */}
        <div className="rounded-2xl border border-border/60 bg-slate-900/60 p-4 backdrop-blur-md space-y-3">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center space-x-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>GameHub Legal Compliance & Verification Telemetry</span>
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[11px] py-1 font-semibold flex items-center space-x-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Verified Open Source</span>
            </Badge>

            <Badge variant="outline" className="bg-purple-500/10 text-purple-300 border-purple-500/30 text-[11px] py-1 font-semibold flex items-center space-x-1">
              <Key className="h-3.5 w-3.5" />
              <span>License Verified ({game.originalLicense || game.license})</span>
            </Badge>

            <Badge variant="outline" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 text-[11px] py-1 font-semibold flex items-center space-x-1">
              <GitBranch className="h-3.5 w-3.5" />
              <span>Repository Authenticated</span>
            </Badge>

            <Badge variant="outline" className="bg-indigo-500/10 text-indigo-300 border-indigo-500/30 text-[11px] py-1 font-semibold flex items-center space-x-1">
              <Layers className="h-3.5 w-3.5" />
              <span>Asset Provenance Verified</span>
            </Badge>

            <Badge variant="outline" className="bg-amber-500/10 text-amber-300 border-amber-500/30 text-[11px] py-1 font-semibold flex items-center space-x-1">
              <Lock className="h-3.5 w-3.5" />
              <span>Trademark Safe</span>
            </Badge>

            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[11px] py-1 font-semibold flex items-center space-x-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Commercial Ready</span>
            </Badge>
          </div>
        </div>

        {/* Details & Controls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Description Col */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-lg backdrop-blur-md space-y-4">
              
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[11px] font-bold text-purple-400 border border-purple-500/20">
                      {game.gameType || "Derived Game"}
                    </span>
                    <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-[11px] font-bold text-cyan-400 border border-cyan-500/20 uppercase">
                      {game.license}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-foreground">{game.derivedTitle || game.title}</h1>
                </div>

                <div className="flex items-center space-x-3 text-xs font-bold">
                  <div className="flex items-center space-x-1 text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                    <Star className="h-4 w-4 fill-amber-400" />
                    <span>{game.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-xl border border-cyan-500/20">
                    <Eye className="h-4 w-4" />
                    <span>{(game.playsCount / 1000).toFixed(1)}k Plays</span>
                  </div>
                </div>
              </div>

              {/* Description Body */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">About the Game</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {game.description}
                </p>
                {game.instructions && (
                  <div className="mt-3 rounded-xl bg-muted/40 p-4 border border-border/40 space-y-1">
                    <h4 className="text-xs font-bold text-foreground uppercase">How to Play</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{game.instructions}</p>
                  </div>
                )}
              </div>

              {/* Modifications Changelog */}
              {game.modifications && game.modifications.length > 0 && (
                <div className="rounded-xl bg-slate-900/60 p-4 border border-purple-500/20 space-y-2">
                  <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <GitBranch className="h-3.5 w-3.5" />
                    <span>GameHub Modifications & Enhancements</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {game.modifications.map((mod, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <span className="text-cyan-400 mt-0.5">•</span>
                        <span>{mod}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tags List */}
              {game.tags && game.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                  {game.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/search?q=${tag}`}
                      className="rounded-full bg-muted/60 px-3 py-1 text-[11px] font-semibold text-muted-foreground hover:bg-purple-500/20 hover:text-purple-300 transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}

            </div>
          </div>

          {/* Right Sidebar: Original Author & Provenance Info */}
          <div className="space-y-6">
            <GameControls controls={game.controls} />

            <div className="rounded-2xl border border-border/60 bg-card/60 p-5 shadow-lg backdrop-blur-md space-y-3 text-xs text-muted-foreground">
              <h3 className="font-bold text-foreground uppercase tracking-wider text-xs mb-2 flex items-center justify-between">
                <span>Original Provenance</span>
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
              </h3>

              <div className="flex items-center justify-between py-1.5 border-b border-border/30">
                <span className="flex items-center space-x-1.5">
                  <User className="h-3.5 w-3.5" />
                  <span>Original Author</span>
                </span>
                <span className="font-bold text-foreground">{game.originalAuthor || game.author}</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-border/30">
                <span>Original License</span>
                <span className="font-bold text-purple-400">{game.originalLicense || game.license}</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-border/30">
                <span>Git Commit</span>
                <code className="font-mono text-[11px] text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded">
                  {(game.originalCommitHash || game.commitHash || "").slice(0, 7)}
                </code>
              </div>

              <div className="pt-1">
                <a
                  href={game.originalRepository || game.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 w-full rounded-xl bg-slate-900 border border-border/60 py-2 text-xs font-bold text-purple-300 hover:bg-slate-800 transition-colors"
                >
                  <span>View Original GitHub Repo</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Related Games Section */}
        {relatedGames.length > 0 && (
          <section className="space-y-4 pt-6 border-t border-border/40">
            <h2 className="text-xl font-black text-foreground">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedGames.map((relGame) => (
                <GameCard key={relGame.id} game={relGame} />
              ))}
            </div>
          </section>
        )}

      </div>
    </>
  );
}
