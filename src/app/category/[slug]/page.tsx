import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { getGamesByCategory, getAllGames } from "@/lib/games";
import { GameGrid } from "@/components/games/GameGrid";
import { GameCategory } from "@/types/game";
import { SITE_URL } from "@/lib/site";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

const VALID_CATEGORIES: GameCategory[] = [
  "action",
  "puzzle",
  "arcade",
  "racing",
  "adventure",
  "strategy",
  "sports",
  "multiplayer",
];

// Real keyword research (2026), not guessed copy — monthly search volume noted per pick.
// Multiplayer targets "io games" (201K/mo) over the generic "multiplayer games" (49.5K/mo)
// because our multiplayer bucket genuinely IS io/two-player/tanks titles (see
// import-gamepix.ts's CATEGORY_MAP) — the higher-volume term is also the accurate one here,
// not just a keyword-stuffing swap.
const CATEGORY_SEO: Record<GameCategory, { h1: string; title: string; description: string; intro: string }> = {
  action: {
    h1: "Action & Shooting Games",
    title: "Free Action & Shooting Games Online - No Download",
    description:
      "Play free action and shooting games online instantly in your browser. Fighting, battle, and combat games — no download, no install, just click and play.",
    intro:
      "Fighting, battle, and shooting games you can jump into in seconds — no download, no install, no account. Just pick a title and start playing.",
  },
  puzzle: {
    h1: "Puzzle Games",
    title: "Free Puzzle Games Online - Brain Teasers & Logic Games",
    description:
      "Play free puzzle games online instantly — match-3, brain teasers, logic puzzles and more. No download needed, just click and play in your browser.",
    intro:
      "Match-3, logic puzzles, and brain teasers for whenever you've got a few minutes to spare. Every game here runs straight in your browser.",
  },
  arcade: {
    h1: "Arcade Games",
    title: "Free Arcade Games Online - Classic & Casual Games",
    description:
      "Play free arcade games online instantly — classic games, casual fun, and retro-style arcade action. No downloads, just click and play.",
    intro:
      "Classic arcade action and casual pick-up-and-play titles, built for quick sessions between the things you're actually supposed to be doing.",
  },
  racing: {
    h1: "Racing Games",
    title: "Free Racing Games Online - Car & Driving Games",
    description:
      "Play free racing games online instantly — car racing, driving, and speed games. No download required, race right in your browser.",
    intro:
      "Car racing, drifting, and driving games that load instantly — no download, no install, just floor it.",
  },
  adventure: {
    h1: "Adventure Games",
    title: "Free Adventure Games Online - Explore & Platform Games",
    description:
      "Play free adventure games online instantly — platformers, exploration, and story-driven action. No download needed, dive in now.",
    intro:
      "Platformers and exploration games for when you want a bit more of a world to get lost in, still zero installs required.",
  },
  strategy: {
    h1: "Strategy Games",
    title: "Free Strategy Games Online - Simulation & Idle Games",
    description:
      "Play free strategy games online instantly — simulation, idle, card, and tactical games. No download required, play in your browser.",
    intro:
      "Simulation, idle, and tactical games for players who'd rather think three moves ahead than button-mash.",
  },
  sports: {
    h1: "Sports Games",
    title: "Free Sports Games Online - Basketball, Soccer & More",
    description:
      "Play free sports games online instantly — basketball, soccer, boxing and more. No download needed, jump into the game now.",
    intro:
      "Basketball, soccer, boxing, and more — real sports, zero equipment, playable the second the page loads.",
  },
  multiplayer: {
    h1: ".io Games & Multiplayer Games",
    title: "Free .io Games & Multiplayer Games Online",
    description:
      "Play free .io games and multiplayer games online instantly — compete with real players worldwide, no download needed.",
    intro:
      ".io games and other multiplayer titles where the other players on the map are real people, not bots — no download, no signup wall.",
  },
};

export async function generateStaticParams() {
  return VALID_CATEGORIES.map((cat) => ({
    slug: cat,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const normalized = slug.toLowerCase() as GameCategory;
  const seo = CATEGORY_SEO[normalized];
  if (!seo) return { title: "Games - PlayNow" };

  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: `/category/${slug}` },
    openGraph: {
      title: `${seo.h1} - PlayNow`,
      description: seo.description,
      type: "website",
      url: `${SITE_URL}/category/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${seo.h1} - PlayNow`,
      description: seo.description,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const normalizedCategory = slug.toLowerCase() as GameCategory;

  if (!VALID_CATEGORIES.includes(normalizedCategory)) {
    notFound();
  }

  const seo = CATEGORY_SEO[normalizedCategory];
  const games = getGamesByCategory(normalizedCategory);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: seo.title,
        description: seo.description,
        url: `${SITE_URL}/category/${slug}`,
      },
      {
        "@type": "ItemList",
        itemListElement: games.slice(0, 24).map((game, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          url: `${SITE_URL}/game/${game.slug}`,
          name: game.derivedTitle || game.title,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: seo.h1, item: `${SITE_URL}/category/${slug}` },
        ],
      },
    ],
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs font-semibold text-muted-foreground">
        <Link href="/" className="flex items-center hover:text-foreground transition-colors">
          <Home className="h-3.5 w-3.5 mr-1" />
          <span>Home</span>
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-bold">{seo.h1}</span>
      </nav>

      {/* Category Banner Header */}
      <div className="relative overflow-hidden rounded-3xl border border-secondary/20 bg-gradient-to-r from-secondary/20 via-card to-card p-8 sm:p-10 shadow-xl">
        <div className="relative z-10 space-y-2">
          <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-bold text-violet-300 border border-secondary/20 uppercase tracking-wider">
            Category Hub
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            {seo.h1}
          </h1>
          <p className="text-sm text-foreground/80 max-w-xl leading-relaxed">
            {seo.intro}
          </p>
        </div>
      </div>

      {/* Games Listing */}
      <GameGrid
        games={games}
        title={seo.h1}
        showFilters={true}
      />

    </div>
  );
}
