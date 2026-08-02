import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Play,
  Plus,
  ChevronLeft,
  ChevronRight,
  Zap,
  Users,
  Palette,
  BarChart3
} from "lucide-react";
import { getGameBySlug, getRelatedGames, getAllGames } from "@/lib/games";
import { GamePlayer } from "@/components/games/GamePlayer";
import { GameCard } from "@/components/games/GameCard";

interface GamePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const games = getAllGames();
  return games.map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) return { title: "Game Not Found - PlayNow" };
  return {
    title: `${game.derivedTitle || game.title} - Play Free on PlayNow`,
    description: game.description,
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) notFound();

  const relatedGames = getRelatedGames(game, 4);
  const displayTitle = game.derivedTitle || game.title;

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ═══ HERO BANNER ═══ */}
      <section className="relative w-full h-[50vh] min-h-[360px] max-h-[500px] overflow-hidden">
        <img
          src={game.heroImage || game.coverImage}
          alt={displayTitle}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 lg:p-16 max-w-3xl space-y-4">
          <div className="flex items-center space-x-2">
            <span className="rounded bg-secondary px-2.5 py-1 font-mono text-[10px] font-bold text-secondary-foreground uppercase">
              INSTANT LAUNCH
            </span>
            <span className="rounded bg-muted px-2.5 py-1 font-mono text-[10px] font-bold text-muted-foreground uppercase capitalize">
              v{game.version} STABLE
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black text-foreground uppercase tracking-tight">
            {displayTitle}
          </h1>

          <p className="text-sm text-foreground/80 leading-relaxed max-w-xl line-clamp-2">
            {game.description}
          </p>

          <div className="flex items-center space-x-3 pt-1">
            <Link
              href={`/game/${game.slug}#player`}
              className="inline-flex items-center space-x-2.5 rounded-lg bg-primary px-8 py-4 text-sm font-black text-primary-foreground uppercase tracking-wider hover:bg-primary-hover hover:shadow-glow-primary transition-all"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>PLAY NOW</span>
            </Link>
            <button
              aria-label="Add to library"
              className="flex h-[52px] w-[52px] items-center justify-center rounded-lg border border-white/20 bg-white/5 text-foreground hover:bg-white/10 transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">

        {/* ═══ GAME PLAYER ═══ */}
        <div id="player">
          <GamePlayer game={game} />
        </div>

        {/* ═══ ABOUT + FRIENDS SIDEBAR ═══ */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* Left: About The Game */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <h2 className="font-display text-xl font-black text-foreground uppercase flex items-center">
                <span className="w-1 h-5 bg-primary rounded-full mr-3" />
                ABOUT THE GAME
              </h2>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {game.description} Utilizing the proprietary HTML5 Canvas Engine, every collision, jump, and score combo is rendered with millisecond precision. Instant browser playback with zero downloads required.
              </p>
            </div>

            {/* Feature Highlight Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
                <Zap className="h-5 w-5 text-primary" aria-hidden="true" />
                <h4 className="font-display text-xs font-bold text-foreground">INSTANT</h4>
                <p className="font-mono text-[10px] text-muted-foreground">5ms+ loading & persistent sessions</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
                <Users className="h-5 w-5 text-primary" aria-hidden="true" />
                <h4 className="font-display text-xs font-bold text-foreground">{game.rating.toFixed(1)} / 5 RATED</h4>
                <p className="font-mono text-[10px] text-muted-foreground">by {game.sourceNetwork || "the community"}</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
                <Palette className="h-5 w-5 text-primary" aria-hidden="true" />
                <h4 className="font-display text-xs font-bold text-foreground">DYNAMIC</h4>
                <p className="font-mono text-[10px] text-muted-foreground">Custom map & mod editor</p>
              </div>
            </div>
          </div>

          {/* Right: Friends Online Sidebar */}
          <div className="space-y-5">
            <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-sm font-bold text-foreground">Friends Online</h3>
                <span className="font-mono text-[10px] text-primary font-bold">ACTIVE</span>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  { name: "Ghost_Rider_99", status: "PLAYING", game: displayTitle, color: "bg-secondary" },
                  { name: "PixelVanguard", status: "IN MENU", game: "Lobby", color: "bg-sky-600" },
                  { name: "Nova_Strike", status: "SPECTATING", game: "Arena Mode", color: "bg-emerald-600" },
                ].map((friend) => (
                  <div key={friend.name} className="flex items-center space-x-3 rounded-xl bg-muted p-2.5">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${friend.color} text-white font-bold text-[10px]`}>
                      {friend.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-[11px] font-bold text-foreground truncate">{friend.name}</p>
                      <p className="font-mono text-[9px] text-muted-foreground">{friend.status} • {friend.game}</p>
                    </div>
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                ))}
              </div>
              <button className="w-full text-center font-mono text-[10px] font-bold text-primary hover:underline uppercase tracking-wider pt-1">
                VIEW ALL FRIENDS
              </button>
            </div>

            {/* Market Pulse Widget */}
            <div className="rounded-2xl overflow-hidden relative">
              <div className="bg-gradient-to-br from-primary to-primary-hover p-5 space-y-2 text-primary-foreground">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider opacity-80">MARKET PULSE</span>
                <div className="text-3xl font-display font-black">1.2M</div>
                <div className="font-mono text-[11px] font-bold">Daily Active Players</div>
                <BarChart3 className="absolute bottom-3 right-3 h-10 w-10 opacity-30" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>

        {/* ═══ GALLERY ═══ */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-black text-foreground uppercase flex items-center">
              <span className="w-1 h-5 bg-primary rounded-full mr-3" />
              GALLERY
            </h2>
            <div className="flex items-center space-x-2">
              <button aria-label="Previous screenshot" className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button aria-label="Next screenshot" className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {(game.screenshots.length > 0 ? game.screenshots : [game.thumbnailUrl, game.coverImage || game.thumbnailUrl]).map((img, idx) => (
              <div key={idx} className="overflow-hidden rounded-2xl border border-border bg-card aspect-[16/9]">
                <img src={img} alt={`${displayTitle} screenshot ${idx + 1}`} className="h-full w-full object-cover hover:scale-105 transition-transform duration-slow" loading="lazy" />
              </div>
            ))}
          </div>
        </section>

        {/* ═══ SYSTEM REQUIREMENTS ═══ */}
        <section className="space-y-5">
          <h2 className="font-display text-xl font-black text-foreground uppercase flex items-center">
            <span className="w-1 h-5 bg-primary rounded-full mr-3" />
            System Requirements
          </h2>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 font-mono text-xs">
              <div className="space-y-3">
                <span className="text-primary font-bold text-[10px] uppercase tracking-wider">MINIMUM</span>
                <div className="space-y-2 text-foreground/80">
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Browser</span>
                    <span>Chrome / Edge / Firefox</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">OS/Version</span>
                    <span>{game.mobileSupport ? "Any" : "Desktop"} / {game.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">RAM</span>
                    <span>2 GB</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-primary font-bold text-[10px] uppercase tracking-wider">RECOMMENDED</span>
                <div className="space-y-2 text-foreground/80">
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Connection</span>
                    <span>Stable Fiber Optic</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Hardware</span>
                    <span>Dedicated GPU / GTX 1050+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Display</span>
                    <span>144Hz Monitor Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ RECOMMENDED FOR YOU ═══ */}
        <section className="space-y-5">
          <h2 className="font-display text-xl font-black text-foreground uppercase flex items-center">
            <span className="w-1 h-5 bg-primary rounded-full mr-3" />
            RECOMMENDED FOR YOU
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedGames.map((relGame) => (
              <GameCard key={relGame.id} game={relGame} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
