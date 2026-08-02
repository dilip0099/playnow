import Link from "next/link";
import { Play, Plus } from "lucide-react";
import { gamesData } from "@/lib/games";
import { GameCard } from "@/components/games/GameCard";
import { ContinuePlayingRail } from "@/components/games/ContinuePlayingRail";

export default function HomePage() {
  const featuredGame = gamesData[0];

  const trendingGames = gamesData.filter((g) => g.trending && g.id !== featuredGame.id).slice(0, 4);
  const fallbackTrending = trendingGames.length >= 2 ? trendingGames : gamesData.slice(1, 5);

  // Every rail below the hero must show distinct games — reusing a card the visitor
  // already scrolled past (with the same badge) reads as broken/repetitive content.
  const shownIds = new Set([featuredGame.id, ...fallbackTrending.map((g) => g.id)]);

  const newGames = gamesData.filter((g) => g.isNew && !shownIds.has(g.id)).slice(0, 4);
  const fallbackNew =
    newGames.length >= 2
      ? newGames
      : [...gamesData]
          .filter((g) => !shownIds.has(g.id))
          .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
          .slice(0, 4);

  const genreIcons = [
    { name: "ACTION", icon: "⚔️", count: gamesData.filter((g) => g.category === "action").length },
    { name: "STRATEGY", icon: "🧠", count: gamesData.filter((g) => g.category === "strategy").length },
    { name: "RACING", icon: "🏎️", count: gamesData.filter((g) => g.category === "racing").length },
    { name: "ARCADE", icon: "🕹️", count: gamesData.filter((g) => g.category === "arcade").length },
    { name: "PUZZLE", icon: "🧩", count: gamesData.filter((g) => g.category === "puzzle").length },
    { name: "ADVENTURE", icon: "🗺️", count: gamesData.filter((g) => g.category === "adventure").length },
    { name: "SPORTS", icon: "⚽", count: gamesData.filter((g) => g.category === "sports").length },
    { name: "MULTIPLAYER", icon: "👥", count: gamesData.filter((g) => g.category === "multiplayer").length },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ═══ CINEMATIC HERO BANNER ═══ */}
      <section className="relative w-full h-[75vh] min-h-[500px] max-h-[720px] overflow-hidden">
        <img
          src={featuredGame.heroImage || featuredGame.coverImage}
          alt={featuredGame.title}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 lg:p-16 max-w-3xl space-y-5">
          <span className="rounded bg-secondary px-3 py-1 font-mono text-[10px] font-bold text-secondary-foreground uppercase tracking-wider">
            FEATURED PICK
          </span>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-foreground uppercase tracking-tight leading-[1.05]">
            {featuredGame.derivedTitle || featuredGame.title}
          </h1>

          <p className="text-sm text-foreground/80 leading-relaxed max-w-xl line-clamp-3">
            {featuredGame.description}
          </p>

          <div className="flex items-center space-x-3 pt-1">
            <Link
              href={`/game/${featuredGame.slug}`}
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

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-14">

        {/* ═══ CONTINUE PLAYING (hidden until there's real history) ═══ */}
        <ContinuePlayingRail allGames={gamesData} title="CONTINUE PLAYING" emptyState="hide" limit={3} />

        {/* ═══ TRENDING NOW ═══ */}
        <section className="space-y-5">
          <h2 className="font-display text-xl sm:text-2xl font-black text-foreground uppercase tracking-tight flex items-center">
            <span className="w-1 h-6 bg-primary rounded-full mr-3" />
            TRENDING NOW
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {fallbackTrending.map((game, idx) => (
              <GameCard key={game.id} game={game} priority={idx < 4} />
            ))}
          </div>
        </section>

        {/* ═══ NEW RELEASES ═══ */}
        <section className="space-y-5">
          <h2 className="font-display text-xl sm:text-2xl font-black text-foreground uppercase tracking-tight flex items-center">
            <span className="w-1 h-6 bg-primary rounded-full mr-3" />
            NEW RELEASES
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {fallbackNew.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>

        {/* ═══ POPULAR GENRES ═══ */}
        <section className="space-y-5">
          <div className="space-y-1">
            <span className="font-mono text-[10px] font-bold text-primary tracking-widest uppercase">SELECT YOUR CLUB</span>
            <h2 className="font-display text-xl sm:text-2xl font-black text-foreground uppercase tracking-tight">POPULAR GENRES</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {genreIcons.map((genre) => (
              <Link
                key={genre.name}
                href={`/category/${genre.name.toLowerCase()}`}
                className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-5 aspect-square hover:border-primary/50 hover:-translate-y-1 transition-all group"
              >
                <span className="text-3xl mb-2" aria-hidden="true">{genre.icon}</span>
                <span className="font-display text-[11px] font-black text-foreground tracking-wider group-hover:text-primary transition-colors">{genre.name}</span>
                <span className="font-mono text-[9px] text-muted-foreground mt-0.5">{genre.count} GAMES</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ═══ READY TO PLAY? CTA BANNER ═══ */}
        <section className="rounded-3xl bg-primary p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-md">
            <h2 className="font-display text-3xl sm:text-4xl font-black text-primary-foreground uppercase leading-tight">
              READY<br />TO PLAY?
            </h2>
            <p className="text-xs text-primary-foreground/70 leading-relaxed font-mono">
              No downloads, no lag, no limits. Jump straight into the action with PlayNow's ultra-low latency streaming technology.
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/discover"
              className="rounded-xl bg-primary-foreground px-8 py-4 text-sm font-black text-primary uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              START PLAYING
            </Link>
            <Link
              href="/library"
              className="rounded-xl border-2 border-primary-foreground/30 px-8 py-4 text-sm font-black text-primary-foreground uppercase tracking-wider hover:bg-primary-foreground/10 transition-colors"
            >
              VIEW LIBRARY
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
