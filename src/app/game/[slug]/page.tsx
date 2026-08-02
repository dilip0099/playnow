import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Star,
  Layers,
  Smartphone,
  Calendar,
  ExternalLink
} from "lucide-react";
import { getGameBySlug, getRelatedGames, getAllGames } from "@/lib/games";
import { GamePlayer } from "@/components/games/GamePlayer";
import { GameCard } from "@/components/games/GameCard";
import { SITE_URL } from "@/lib/site";

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

  const title = `${game.derivedTitle || game.title} - Play Free on PlayNow`;
  const image = game.coverImage || game.thumbnailUrl;

  return {
    title,
    description: game.description,
    keywords: [game.title, game.category, "free online game", "browser game", ...game.tags],
    alternates: { canonical: `/game/${game.slug}` },
    openGraph: {
      title,
      description: game.description,
      type: "website",
      url: `${SITE_URL}/game/${game.slug}`,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: game.description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) notFound();

  const relatedGames = getRelatedGames(game, 4);
  const displayTitle = game.derivedTitle || game.title;

  // Deliberately omits aggregateRating/review — that requires a genuine per-site review
  // count, which we don't have (the star rating shown in our UI is derived from GamePix's
  // quality_score, not real user reviews on PlayNow). Fabricating one for richer search
  // snippets would violate Google's structured-data policy on reviews.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "VideoGame",
        name: displayTitle,
        description: game.description,
        image: game.coverImage || game.thumbnailUrl,
        genre: game.category,
        applicationCategory: "GameApplication",
        gamePlatform: "HTML5",
        operatingSystem: "Any",
        playMode: game.category === "multiplayer" ? "MultiPlayer" : "SinglePlayer",
        url: `${SITE_URL}/game/${game.slug}`,
        datePublished: game.releaseDate,
        publisher: {
          "@type": "Organization",
          name: "GamePix",
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: `${game.category} Games`, item: `${SITE_URL}/category/${game.category}` },
          { "@type": "ListItem", position: 3, name: displayTitle, item: `${SITE_URL}/game/${game.slug}` },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ═══ COMPACT HEADER — a visitor clicking through wants to play, not scroll past
            a cinematic banner first. The player is the very next thing on the page. ═══ */}
      <div className="mx-auto max-w-7xl space-y-2 px-4 pt-6 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2">
          <span className="rounded bg-secondary px-2.5 py-1 font-mono text-[10px] font-bold text-secondary-foreground uppercase">
            INSTANT LAUNCH
          </span>
          <span className="rounded bg-muted px-2.5 py-1 font-mono text-[10px] font-bold text-muted-foreground uppercase capitalize">
            {game.category}
          </span>
        </div>
        <h1 className="font-display text-2xl font-black uppercase tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          {displayTitle}
        </h1>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-12">

        {/* ═══ GAME PLAYER — first thing in the viewport, no scrolling required ═══ */}
        <div id="player">
          <GamePlayer game={game} />
        </div>

        {/* ═══ ABOUT + GAME INFO ═══ */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* Left: About The Game + How To Play */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <h2 className="font-display text-xl font-black text-foreground uppercase flex items-center">
                <span className="w-1 h-5 bg-primary rounded-full mr-3" />
                ABOUT THE GAME
              </h2>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {game.description}
              </p>
            </div>

            {game.instructions && (
              <div className="space-y-3">
                <h3 className="font-display text-sm font-black text-foreground uppercase">How To Play</h3>
                <p className="text-sm text-foreground/80 leading-relaxed">{game.instructions}</p>
                {game.controls.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {game.controls.map((control, idx) => (
                      <span
                        key={idx}
                        className="rounded-lg border border-border bg-muted px-3 py-1.5 font-mono text-[11px] text-foreground/80"
                      >
                        <span className="font-bold text-foreground">{control.key}</span> — {control.action}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Real, factual highlight cards — no invented specs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
                <Star className="h-5 w-5 text-primary fill-current" aria-hidden="true" />
                <h4 className="font-display text-xs font-bold text-foreground">{game.rating.toFixed(1)} / 5</h4>
                <p className="font-mono text-[10px] text-muted-foreground">Rated via {game.sourceNetwork || "our catalog"}</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
                <Layers className="h-5 w-5 text-primary" aria-hidden="true" />
                <h4 className="font-display text-xs font-bold text-foreground capitalize">{game.category}</h4>
                <p className="font-mono text-[10px] text-muted-foreground">Genre</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
                <Smartphone className="h-5 w-5 text-primary" aria-hidden="true" />
                <h4 className="font-display text-xs font-bold text-foreground">{game.mobileSupport ? "Mobile Ready" : "Desktop Only"}</h4>
                <p className="font-mono text-[10px] text-muted-foreground">Play anywhere</p>
              </div>
            </div>
          </div>

          {/* Right: Game Info Sidebar — factual metadata only */}
          <div className="space-y-5">
            <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
              <h3 className="font-display text-sm font-bold text-foreground">Game Info</h3>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-border pb-2.5">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-bold text-foreground capitalize">{game.category}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border pb-2.5">
                  <span className="text-muted-foreground">Released</span>
                  <span className="flex items-center space-x-1.5 font-bold text-foreground">
                    <Calendar className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                    <span>{new Date(game.releaseDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-border pb-2.5">
                  <span className="text-muted-foreground">Mobile Support</span>
                  <span className="font-bold text-foreground">{game.mobileSupport ? "Yes" : "No"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Source</span>
                  <a
                    href={game.gameUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 font-bold text-primary hover:underline"
                  >
                    <span>{game.sourceNetwork || "View"}</span>
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                </div>
              </div>

              {game.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 border-t border-border pt-4">
                  {game.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-muted px-2.5 py-1 font-mono text-[10px] font-bold capitalize text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ═══ GALLERY ═══ */}
        <section className="space-y-5">
          <h2 className="font-display text-xl font-black text-foreground uppercase flex items-center">
            <span className="w-1 h-5 bg-primary rounded-full mr-3" />
            GALLERY
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {(game.screenshots.length > 0 ? game.screenshots : [game.thumbnailUrl, game.coverImage || game.thumbnailUrl]).map((img, idx) => (
              <div key={idx} className="overflow-hidden rounded-2xl border border-border bg-card aspect-[16/9]">
                <img src={img} alt={`${displayTitle} screenshot ${idx + 1}`} className="h-full w-full object-cover hover:scale-105 transition-transform duration-slow" loading="lazy" />
              </div>
            ))}
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
