import Link from "next/link";
import { Swords, Brain, Car, Joystick, Puzzle, Compass, Volleyball, UsersRound, Unlock, Dices } from "lucide-react";
import { gamesData } from "@/lib/games";
import { GameCard } from "@/components/games/GameCard";
import { ContinuePlayingRail } from "@/components/games/ContinuePlayingRail";
import { HeroCarousel } from "@/components/games/HeroCarousel";
import { CategoryRail } from "@/components/games/CategoryRail";
import { DailyChallengeCard } from "@/components/gamification/DailyChallengeCard";
import { GAME_GRID_COLS } from "@/lib/game-grid";
import { GameCategory } from "@/types/game";
import { SITE_URL, SITE_NAME } from "@/lib/site";

const HERO_SLIDE_COUNT = 5;

const CATEGORY_RAILS: { category: GameCategory; label: string }[] = [
  { category: "action", label: "ACTION GAMES" },
  { category: "strategy", label: "STRATEGY GAMES" },
  { category: "racing", label: "RACING GAMES" },
  { category: "arcade", label: "ARCADE GAMES" },
  { category: "puzzle", label: "PUZZLE GAMES" },
  { category: "adventure", label: "ADVENTURE GAMES" },
  { category: "sports", label: "SPORTS GAMES" },
  { category: "multiplayer", label: "MULTIPLAYER GAMES" },
  { category: "classic", label: "CLASSIC GAMES" },
];

export default function HomePage() {
  const heroGames = [...gamesData].sort((a, b) => b.rating - a.rating || b.playsCount - a.playsCount).slice(0, HERO_SLIDE_COUNT);
  const heroIds = new Set(heroGames.map((g) => g.id));

  const trendingGames = gamesData.filter((g) => g.trending && !heroIds.has(g.id)).slice(0, 6);
  const fallbackTrending = trendingGames.length >= 2 ? trendingGames : gamesData.filter((g) => !heroIds.has(g.id)).slice(0, 6);

  // Every rail below the hero must show distinct games — reusing a card the visitor
  // already scrolled past (with the same badge) reads as broken/repetitive content.
  const shownIds = new Set([...heroIds, ...fallbackTrending.map((g) => g.id)]);

  const newGames = gamesData.filter((g) => g.isNew && !shownIds.has(g.id)).slice(0, 6);
  const fallbackNew =
    newGames.length >= 2
      ? newGames
      : [...gamesData]
          .filter((g) => !shownIds.has(g.id))
          .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
          .slice(0, 6);

  const genreIcons = [
    { name: "UNBLOCKED", href: "/unblocked-games", icon: Unlock, count: gamesData.length },
    { name: "ACTION", href: "/category/action", icon: Swords, count: gamesData.filter((g) => g.category === "action").length },
    { name: "STRATEGY", href: "/category/strategy", icon: Brain, count: gamesData.filter((g) => g.category === "strategy").length },
    { name: "RACING", href: "/category/racing", icon: Car, count: gamesData.filter((g) => g.category === "racing").length },
    { name: "ARCADE", href: "/category/arcade", icon: Joystick, count: gamesData.filter((g) => g.category === "arcade").length },
    { name: "PUZZLE", href: "/category/puzzle", icon: Puzzle, count: gamesData.filter((g) => g.category === "puzzle").length },
    { name: "ADVENTURE", href: "/category/adventure", icon: Compass, count: gamesData.filter((g) => g.category === "adventure").length },
    { name: "SPORTS", href: "/category/sports", icon: Volleyball, count: gamesData.filter((g) => g.category === "sports").length },
    { name: "MULTIPLAYER", href: "/category/multiplayer", icon: UsersRound, count: gamesData.filter((g) => g.category === "multiplayer").length },
    { name: "CLASSIC", href: "/category/classic", icon: Dices, count: gamesData.filter((g) => g.category === "classic").length },
  ];

  // WebSite schema (+ SearchAction) is what makes a site eligible for Google's sitelinks
  // search box; Organization ties the brand identity together for knowledge-panel purposes.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_URL}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/icon`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ═══ FEATURED GAMES CAROUSEL ═══ */}
      <HeroCarousel games={heroGames} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-14">

        {/* ═══ CONTINUE PLAYING (hidden until there's real history) ═══ */}
        <ContinuePlayingRail allGames={gamesData} title="CONTINUE PLAYING" emptyState="hide" limit={3} />

        {/* ═══ DAILY CHALLENGE BONUS ═══ */}
        <DailyChallengeCard />

        {/* ═══ TRENDING NOW ═══ */}
        <section className="space-y-5">
          <h2 className="font-display text-xl sm:text-2xl font-black text-foreground uppercase tracking-tight flex items-center">
            <span className="w-1 h-6 bg-primary rounded-full mr-3" />
            TRENDING NOW
          </h2>

          <div className={`grid gap-4 ${GAME_GRID_COLS}`}>
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

          <div className={`grid gap-4 ${GAME_GRID_COLS}`}>
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
            {genreIcons.map((genre) => {
              const Icon = genre.icon;
              return (
                <Link
                  key={genre.name}
                  href={genre.href}
                  className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-5 aspect-square hover:border-primary/50 hover:-translate-y-1 transition-all group"
                >
                  <Icon className="h-7 w-7 mb-2 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
                  <span className="font-display text-[11px] font-black text-foreground tracking-wider group-hover:text-primary transition-colors">{genre.name}</span>
                  <span className="font-mono text-[9px] text-muted-foreground mt-0.5">{genre.count} GAMES</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ═══ PER-CATEGORY RAILS — the bulk of the 181-game catalog, browsable right
              on the homepage instead of requiring a trip to Discover first ═══ */}
        {CATEGORY_RAILS.map(({ category, label }) => (
          <CategoryRail
            key={category}
            category={category}
            label={label}
            games={gamesData.filter((g) => g.category === category)}
            excludeIds={heroIds}
          />
        ))}

        {/* ═══ READY TO PLAY? CTA BANNER ═══ */}
        <section className="rounded-3xl bg-primary p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-md">
            <h2 className="font-display text-3xl sm:text-4xl font-black text-primary-foreground uppercase leading-tight">
              READY<br />TO PLAY?
            </h2>
            <p className="text-xs text-primary-foreground/70 leading-relaxed font-mono">
              No downloads, no plugins, no waiting. Every game runs instantly in your browser — click and play.
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
