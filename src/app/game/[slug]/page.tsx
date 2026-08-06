import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Star,
  Layers,
  Smartphone,
  Calendar,
  ExternalLink,
  Lightbulb,
  ChevronDown
} from "lucide-react";
import { getGameBySlug, getRelatedGames, getAllGames } from "@/lib/games";
import { GamePlayer } from "@/components/games/GamePlayer";
import { GameGallery } from "@/components/games/GameGallery";
import { GameWalkthrough } from "@/components/games/GameWalkthrough";
import { GameCard } from "@/components/games/GameCard";
import { EmbedGameButton } from "@/components/games/EmbedGameButton";
import { GameCategory } from "@/types/game";
import { SITE_URL } from "@/lib/site";

interface GamePageProps {
  params: Promise<{ slug: string }>;
}

// Generic, category-appropriate gameplay advice — not invented specifics about any single
// game's levels/scores (which we can't verify), just the kind of honest strategy guidance
// that applies to any real title in that genre. Keys must cover every GameCategory value.
const CATEGORY_TIPS: Record<GameCategory, string[]> = {
  action: [
    "Learn enemy attack patterns before rushing in — most action games telegraph a wind-up before every hit, so reacting to that cue beats memorizing combos.",
    "Keep moving. Standing still to line up the perfect shot is usually riskier than firing while repositioning.",
    "Save your strongest resource (health, ammo, special move) for when you actually need it, not the first tough moment you see.",
    "Practice a level's opening section until the controls feel automatic — most of the skill jump comes from muscle memory, not raw reflexes.",
  ],
  puzzle: [
    "Scan the whole board or level before making your first move — many puzzles punish acting before you've seen the full picture.",
    "Look for forced moves first — spots where only one piece or tile can go — solving those narrows down everything else.",
    "If you get stuck, undo a few moves and try a different approach rather than grinding the same path.",
    "Take a short break when stuck. Puzzle games usually reward a fresh perspective more than raw speed.",
  ],
  arcade: [
    "Survive first, score second — most arcade games hand out points for staying alive, so protect your run before chasing risky combos.",
    "Learn the pattern and timing of obstacles or enemies — arcade games are often built on repeating cycles once you notice them.",
    "Chain small, safe wins instead of gambling on an ambitious play that resets your progress.",
    "Practice one tricky section at a time instead of replaying the whole game from the start every attempt.",
  ],
  racing: [
    "Brake before the turn, not during it, so you're already at the right speed when you turn in.",
    "Look ahead to the next corner rather than at the car in front of you — reacting late causes most crashes.",
    "Aim for a smooth racing line — wide on entry, tight at the apex, wide again on exit — instead of cutting hard corners.",
    "Learn the track's layout over a lap or two before pushing for your fastest time.",
  ],
  adventure: [
    "Explore fully before moving on — adventure games often hide useful items or shortcuts just off the main path.",
    "Pay attention to environmental clues like color, sound, or camera framing — they usually hint at what to do next.",
    "If you hit a locked door or gap you can't cross, backtrack later once you've likely gained the tool or ability to get past it.",
    "Save or checkpoint often if the game allows it, especially before a risky jump or fight.",
  ],
  strategy: [
    "Scout before you commit — knowing what you're up against is worth more than an early aggressive move.",
    "Balance economy and offense; over-investing in one usually leaves you exposed on the other.",
    "Think a move or two ahead and consider your opponent's likely response before committing.",
    "Defend key positions rather than spreading your forces thin across the whole board or map.",
  ],
  sports: [
    "Learn the timing window for your sport's key action — shot, swing, or tackle — since most sports games reward precise timing over button-mashing.",
    "Position yourself where you're strongest instead of forcing a risky play out of position.",
    "Watch your opponent's positioning before committing to a move; predictable patterns get punished.",
    "Drill the fundamentals in a low-pressure moment before relying on them in a close match.",
  ],
  multiplayer: [
    "Spectate for a minute first if the game allows it — you'll pick up the map and common strategies fast.",
    "Stick near safer areas early on rather than exploring alone; isolated positions are usually the most exposed.",
    "Grow or level up steadily and avoid unnecessary risks — many multiplayer and .io-style games make you more vulnerable right after a gain, not less.",
    "Watch how experienced players open a round — you'll see the same effective patterns repeat.",
  ],
  classic: [
    "Learn the fundamental rules cold before trying advanced tactics — classic games like chess, mahjong, and solitaire reward solid basics over clever tricks.",
    "Think about your opponent's (or the board's) best response before committing to a move.",
    "Replay the same match or deal if the game allows it — recognizing recurring patterns is most of the skill here.",
    "Don't rush; classic games are generally won on patience and calculation, not speed.",
  ],
};

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
  const tips = CATEGORY_TIPS[game.category] || CATEGORY_TIPS.arcade;

  // Every answer below is derived directly from real GameMetadata fields (mobileSupport,
  // controls, category, tags) — nothing here is a claim we can't verify from the data.
  const controlsSummary =
    game.controls.length > 0
      ? game.controls.map((c) => `${c.key} (${c.action})`).join(", ")
      : "on-screen controls shown inside the game itself";

  const faqs = [
    {
      question: `Is ${displayTitle} free to play?`,
      answer: `Yes — ${displayTitle} is completely free to play on PlayNow, with no signup or subscription required.`,
    },
    {
      question: "Do I need to download anything to play?",
      answer: `No. ${displayTitle} runs directly in your browser as an HTML5 game — there's nothing to download or install.`,
    },
    {
      question: `Does ${displayTitle} work on mobile devices?`,
      answer: game.mobileSupport
        ? `Yes — ${displayTitle} supports mobile play and works on phones and tablets directly in your mobile browser.`
        : `${displayTitle} is currently optimized for desktop play and may not run well on mobile devices.`,
    },
    {
      question: `What are the controls for ${displayTitle}?`,
      answer:
        game.controls.length > 0
          ? `The controls are: ${controlsSummary}.`
          : "Control instructions are shown inside the game itself once it loads.",
    },
    {
      question: `What category is ${displayTitle}?`,
      answer: `${displayTitle} is a ${game.category} game${
        game.tags.length > 0 ? `, tagged as ${game.tags.join(", ")}` : ""
      }.`,
    },
    {
      question: `Can I embed ${displayTitle} on my own website?`,
      answer: `Yes — use the "Embed This Game" button on this page to get a free copy-paste iframe snippet for ${displayTitle}.`,
    },
  ];

  // Deliberately omits aggregateRating/review — that requires a genuine per-site review
  // count, which we don't have (the star rating shown in our UI is derived from GameMonetize's
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
          name: "GameMonetize",
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
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Preconnect to GameMonetize CDNs for faster iframe initialization */}
      <link rel="preconnect" href="https://html5.gamemonetize.co" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://html5.gamemonetize.co" />
      <link rel="preconnect" href="https://img.gamemonetize.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://img.gamemonetize.com" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ═══ COMPACT HEADER — a visitor clicking through wants to play, not scroll past
            a cinematic banner first. The player is the very next thing on the page. ═══ */}
      <div className="mx-auto max-w-[1800px] space-y-1.5 sm:space-y-2 px-3 pt-3 sm:px-6 sm:pt-6 lg:px-8">
        <div className="flex items-center space-x-2">
          <span className="rounded bg-secondary px-2.5 py-0.5 sm:py-1 font-mono text-[10px] font-bold text-secondary-foreground uppercase">
            INSTANT LAUNCH
          </span>
          <span className="rounded bg-muted px-2.5 py-0.5 sm:py-1 font-mono text-[10px] font-bold text-muted-foreground uppercase capitalize">
            {game.category}
          </span>
        </div>
        <h1 className="font-display text-lg sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-foreground">
          {displayTitle}
        </h1>
      </div>

      <div className="mx-auto max-w-[1800px] px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-8 sm:space-y-12">

        {/* ═══ GAME PLAYER — first thing in the viewport, no scrolling required ═══ */}
        <div id="player">
          <GamePlayer game={game} />
        </div>

        {/* ═══ ABOUT + GAME INFO ═══ */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* Left: Game Gallery + About The Game + How To Play */}
          <div className="lg:col-span-2 space-y-8">
            {/* Game Screenshots & Preview Showcase */}
            <GameGallery game={game} />

            {/* GameMonetize Official Video Walkthrough */}
            <GameWalkthrough externalGameId={game.externalGameId} gameTitle={displayTitle} />

            {/* How To Play */}
            {game.instructions && (
              <div className="space-y-3">
                <h2 className="font-display text-sm sm:text-xl lg:text-2xl font-black text-foreground uppercase flex items-center">
                  <span className="w-1 h-4 sm:h-6 bg-primary rounded-full mr-2 sm:mr-3" />
                  HOW TO PLAY
                </h2>
                <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">{game.instructions}</p>
                {game.controls.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {game.controls.map((control, idx) => (
                      <span
                        key={idx}
                        className="rounded-lg border border-border bg-muted px-2.5 py-1 sm:px-3 sm:py-1.5 font-mono text-[10px] sm:text-[11px] text-foreground/80"
                      >
                        <span className="font-bold text-foreground">{control.key}</span> — {control.action}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* About The Game */}
            <div className="space-y-4">
              <h2 className="font-display text-sm sm:text-xl lg:text-2xl font-black text-foreground uppercase flex items-center">
                <span className="w-1 h-4 sm:h-6 bg-primary rounded-full mr-2 sm:mr-3" />
                ABOUT THE GAME
              </h2>
              <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">
                {game.description}
              </p>
            </div>

            {/* Factual highlight cards — compact 3-card row centered on mobile */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <div className="flex flex-col items-center justify-center text-center rounded-xl sm:rounded-2xl border border-border bg-card p-3 sm:p-4 space-y-1 sm:space-y-1.5">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-primary fill-current" aria-hidden="true" />
                <h4 className="font-display text-[11px] sm:text-xs font-bold text-foreground">{game.rating.toFixed(1)} / 5</h4>
                <p className="font-mono text-[9px] sm:text-[10px] text-muted-foreground truncate w-full">Rating</p>
              </div>
              <div className="flex flex-col items-center justify-center text-center rounded-xl sm:rounded-2xl border border-border bg-card p-3 sm:p-4 space-y-1 sm:space-y-1.5">
                <Layers className="h-4 w-4 sm:h-5 sm:w-5 text-primary" aria-hidden="true" />
                <h4 className="font-display text-[11px] sm:text-xs font-bold text-foreground capitalize truncate w-full">{game.category}</h4>
                <p className="font-mono text-[9px] sm:text-[10px] text-muted-foreground truncate w-full">Genre</p>
              </div>
              <div className="flex flex-col items-center justify-center text-center rounded-xl sm:rounded-2xl border border-border bg-card p-3 sm:p-4 space-y-1 sm:space-y-1.5">
                <Smartphone className="h-4 w-4 sm:h-5 sm:w-5 text-primary" aria-hidden="true" />
                <h4 className="font-display text-[11px] sm:text-xs font-bold text-foreground truncate w-full">{game.mobileSupport ? "Mobile" : "Desktop"}</h4>
                <p className="font-mono text-[9px] sm:text-[10px] text-muted-foreground truncate w-full">Support</p>
              </div>
            </div>
          </div>

          {/* Right: Game Info Sidebar — factual metadata only */}
          <div className="space-y-5">
            {/* Game Poster / Media Preview Card (Desktop only to prevent mobile image duplication) */}
            <div className="hidden lg:block overflow-hidden rounded-2xl border border-border bg-card shadow-md">
              <div className="relative aspect-video w-full">
                <Image
                  src={game.heroImage || game.coverImage || game.thumbnailUrl}
                  alt={displayTitle}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="rounded-md bg-primary/90 px-2 py-0.5 text-[10px] font-bold text-primary-foreground uppercase backdrop-blur-sm">
                    {game.category}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-foreground">
                    ★ {game.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

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
                  {Array.from(new Set(game.tags)).map((tag) => (
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

            {/* Embed This Game — copy-paste iframe snippet for other sites */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
              <h3 className="font-display text-sm font-bold text-foreground">Embed This Game</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Add {displayTitle} to your own website for free with a copy-paste iframe.
              </p>
              <EmbedGameButton slug={game.slug} title={displayTitle} />
            </div>
          </div>
        </div>

        {/* ═══ STRATEGY & TIPS — generic, category-appropriate advice, no invented specifics ═══ */}
        <section className="space-y-3 sm:space-y-5">
          <h2 className="font-display text-sm sm:text-xl lg:text-2xl font-black text-foreground uppercase flex items-center">
            <span className="w-1 h-4 sm:h-6 bg-primary rounded-full mr-2 sm:mr-3" />
            STRATEGY & TIPS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {tips.map((tip, idx) => (
              <div key={idx} className="flex items-start space-x-2.5 sm:space-x-3 rounded-xl sm:rounded-2xl border border-border bg-card p-3 sm:p-4">
                <Lightbulb className="h-4 w-4 mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ FAQ ═══ */}
        <section className="space-y-3 sm:space-y-5">
          <h2 className="font-display text-sm sm:text-xl lg:text-2xl font-black text-foreground uppercase flex items-center">
            <span className="w-1 h-4 sm:h-6 bg-primary rounded-full mr-2 sm:mr-3" />
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <div className="space-y-2.5 sm:space-y-3">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group rounded-xl sm:rounded-2xl border border-border bg-card p-3.5 sm:p-5"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-display text-xs sm:text-sm font-bold text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
                  <span>{faq.question}</span>
                  <ChevronDown
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-muted-foreground transition-transform duration-base group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-foreground/80 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ═══ RECOMMENDED FOR YOU ═══ */}
        <section className="space-y-3 sm:space-y-5">
          <h2 className="font-display text-sm sm:text-xl lg:text-2xl font-black text-foreground uppercase flex items-center">
            <span className="w-1 h-4 sm:h-6 bg-primary rounded-full mr-2 sm:mr-3" />
            RECOMMENDED FOR YOU
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {relatedGames.map((relGame) => (
              <GameCard key={relGame.id} game={relGame} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
