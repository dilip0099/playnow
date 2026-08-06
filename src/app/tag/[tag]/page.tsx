import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { getAllGames } from "@/lib/games";
import { GameGrid } from "@/components/games/GameGrid";
import { SITE_URL } from "@/lib/site";

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

// Built directly from the real "tags" values in src/data/games.json (211 games total).
// Two kinds of tags were deliberately excluded from this map, both to avoid thin/duplicate pages:
//   1. "landscape" / "portrait" / "all" — these are device-orientation metadata on each game,
//      not thematic tags, so a "Landscape Games" page would be meaningless to a visitor.
//   2. Tags that are just the game's own category re-listed as a tag (e.g. "action", "puzzle",
//      "arcade", "racing", "adventure", "strategy", "sports", "multiplayer", "classic") — for every
//      one of these, the tag's game set is 100% identical to /category/[slug]'s game set, so a
//      /tag/ page would be exact duplicate content of an existing category page.
// What's left are genuine sub-collections (a themed slice within one or more categories) that each
// have 4+ real games — the threshold below which a listing page reads as thin/empty.
const TAG_SEO: Record<string, { h1: string; title: string; description: string; intro: string }> = {
  board: {
    h1: "Board Games",
    title: "Free Board Games Online - Chess, Checkers, Ludo & More",
    description:
      "Play free board games online instantly — chess, checkers, ludo, dominoes, tic-tac-toe and more classic tabletop games in your browser. No download required.",
    intro:
      "Classic tabletop games brought to the screen — chess, checkers, ludo, dominoes, and more. No board to set up, no download, just click and play.",
  },
  tanks: {
    h1: "Tank Games",
    title: "Free Tank Games Online - Multiplayer Tank Battles",
    description:
      "Play free tank games online instantly — armored combat and multiplayer tank battles in your browser. No download needed.",
    intro:
      "Armored combat games where you roll out, aim, and fire straight from the browser — no download, no install, no patch to wait on.",
  },
  clicker: {
    h1: "Clicker & Idle Games",
    title: "Free Clicker & Idle Games Online - Play Instantly",
    description:
      "Play free clicker and idle games online instantly — tap, upgrade, and watch the numbers climb. No download required.",
    intro:
      "Tap-to-progress clicker and idle games for whenever you want something low-effort to grind on in the background. Loads instantly, no install.",
  },
  fighting: {
    h1: "Fighting Games",
    title: "Free Fighting Games Online - 1v1 Combat Games",
    description:
      "Play free fighting games online instantly — 1v1 combat and brawler games in your browser. No download required.",
    intro:
      "Head-to-head fighting and brawler games built for quick rounds — no download, no unlock grind, just fight.",
  },
  simulation: {
    h1: "Simulation Games",
    title: "Free Simulation Games Online - Play Instantly",
    description:
      "Play free simulation games online instantly — management, driving, and life-sim style games in your browser. No download needed.",
    intro:
      "Simulation games for players who like managing, driving, or running something — all playable directly in the browser, no install required.",
  },
  card: {
    h1: "Card Games",
    title: "Free Card Games Online - Classic Card & Deck Games",
    description:
      "Play free card games online instantly — classic card and deck games, solo and multiplayer, in your browser. No download required.",
    intro:
      "Card and deck games — solo and multiplayer — playable instantly with no download and no physical deck required.",
  },
  shooter: {
    h1: "Shooter Games",
    title: "Free Shooter Games Online - Play Instantly",
    description:
      "Play free shooter games online instantly — fast-paced shooting action in your browser. No download needed.",
    intro:
      "Fast-paced shooting games for quick sessions — no download, no launcher, just aim and play.",
  },
  "first-person-shooter": {
    h1: "First-Person Shooter (FPS) Games",
    title: "Free FPS Games Online - First-Person Shooters",
    description:
      "Play free first-person shooter games online instantly — browser-based FPS action. No download required.",
    intro:
      "First-person shooters that run entirely in the browser tab — no launcher, no patch downloads, just load in and play.",
  },
  trivia: {
    h1: "Trivia Games",
    title: "Free Trivia Games Online - Quiz & Knowledge Games",
    description:
      "Play free trivia games online instantly — quiz and knowledge games playable in your browser. No download needed.",
    intro:
      "Quiz-style trivia games for testing what you know, playable instantly with no download or sign-up.",
  },
  io: {
    h1: "IO Games",
    title: "Free IO Games Online - Multiplayer Browser Battles",
    description:
      "Play free .io-style multiplayer games online instantly — real opponents, browser-based battles. No download required.",
    intro:
      "Our .io-style multiplayer picks — real opponents, fast matches, no download, no signup wall.",
  },
  "two-player": {
    h1: "Two-Player Games",
    title: "Free Two-Player Games Online - Play With a Friend",
    description:
      "Play free two-player games online instantly — same-screen games you can play head-to-head with a friend. No download required.",
    intro:
      "Same-device two-player games for going head-to-head with a friend on one screen — no download, no extra equipment.",
  },
  car: {
    h1: "Car Games",
    title: "Free Car Games Online - Driving & Racing Games",
    description:
      "Play free car games online instantly — high-speed driving, parking, and drifting games in your browser. No download needed.",
    intro:
      "Get behind the wheel with free car games — racing, drifting, parking, and stunt driving playable instantly in your browser tab.",
  },
  driving: {
    h1: "Driving Games",
    title: "Free Driving Games Online - Vehicle & Simulator Games",
    description:
      "Play free driving games online instantly — test your skills behind the wheel of cars, trucks, and buses. No download required.",
    intro:
      "Master vehicle physics and open roads with browser-based driving games. No downloads or installations required.",
  },
  zombie: {
    h1: "Zombie Games",
    title: "Free Zombie Games Online - Apocalypse & Survival Games",
    description:
      "Play free zombie games online instantly — fight off waves of undead in browser survival games. No download required.",
    intro:
      "Survive the undead outbreak with action-packed zombie shooters and defense games running directly in your browser.",
  },
  stickman: {
    h1: "Stickman Games",
    title: "Free Stickman Games Online - Action & Physics Games",
    description:
      "Play free stickman games online instantly — high-energy stick figure fighting, shooting, and physics games. No download needed.",
    intro:
      "Fast-paced stick figure action featuring physics ragdolls, intense combat, and obstacle courses playable instantly.",
  },
  logic: {
    h1: "Logic Games",
    title: "Free Logic Games Online - Mind & Brain Puzzles",
    description:
      "Play free logic games online instantly — challenge your brain with reasoning and problem-solving puzzles. No download needed.",
    intro:
      "Exercise your brain with clever logic puzzles, spatial challenges, and sequence-based mind games.",
  },
  physics: {
    h1: "Physics Games",
    title: "Free Physics Games Online - Gravity & Ragdoll Puzzles",
    description:
      "Play free physics games online instantly — experiment with gravity, momentum, and destruction in your browser. No download required.",
    intro:
      "Interact with realistic gravity, chain reactions, and momentum-based puzzles in instant browser games.",
  },
  educational: {
    h1: "Educational Games",
    title: "Free Educational Games Online - Math, Science & Learning",
    description:
      "Play free educational games online instantly — fun learning games for math, words, and problem solving. No download needed.",
    intro:
      "Fun, skill-building learning games that make math, spelling, and critical thinking engaging for all ages.",
  },
  "match-3": {
    h1: "Match-3 Games",
    title: "Free Match-3 Games Online - Swap & Tile Matching Puzzles",
    description:
      "Play free match-3 puzzle games online instantly — swap tiles, trigger combos, and clear boards. No download required.",
    intro:
      "Satisfying tile-matching and swap puzzles for quick, relaxing gameplay directly in your browser tab.",
  },
  escape: {
    h1: "Escape Games",
    title: "Free Escape Games Online - Room & Mystery Puzzles",
    description:
      "Play free escape games online instantly — find clues, solve riddles, and break out of locked rooms. No download needed.",
    intro:
      "Test your observation and problem-solving skills by discovering hidden clues and breaking out of mystery rooms.",
  },
  defense: {
    h1: "Defense Games",
    title: "Free Defense Games Online - Tower & Base Protection",
    description:
      "Play free defense games online instantly — place towers and hold the line against invading waves. No download required.",
    intro:
      "Strategic tower defense and base-protection games where smart positioning holds off endless enemy waves.",
  },
  word: {
    h1: "Word Games",
    title: "Free Word Games Online - Vocabulary & Crossword Puzzles",
    description:
      "Play free word games online instantly — test your vocabulary with anagrams, crosswords, and word searches. No download needed.",
    intro:
      "Challenge your vocabulary and spelling skills with daily word search, anagram, and crossword-style puzzles.",
  },
};

const VALID_TAGS = Object.keys(TAG_SEO);

export async function generateStaticParams() {
  return VALID_TAGS.map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const normalized = tag.toLowerCase();
  const seo = TAG_SEO[normalized];
  if (!seo) return { title: "Games - PlayThorn" };

  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: `/tag/${tag}` },
    openGraph: {
      title: `${seo.h1} - PlayThorn`,
      description: seo.description,
      type: "website",
      url: `${SITE_URL}/tag/${tag}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${seo.h1} - PlayThorn`,
      description: seo.description,
    },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const normalizedTag = tag.toLowerCase();

  if (!VALID_TAGS.includes(normalizedTag)) {
    notFound();
  }

  const seo = TAG_SEO[normalizedTag];
  const games = getAllGames().filter((g) => g.tags.includes(normalizedTag));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: seo.title,
        description: seo.description,
        url: `${SITE_URL}/tag/${tag}`,
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
          { "@type": "ListItem", position: 2, name: seo.h1, item: `${SITE_URL}/tag/${tag}` },
        ],
      },
    ],
  };

  return (
    <div className="mx-auto max-w-[1800px] px-3 sm:px-6 lg:px-8 py-3.5 sm:py-8 space-y-3.5 sm:space-y-8">
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

      {/* Tag Banner Header - Compact & Responsive */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-4 sm:p-6 lg:p-8 shadow-sm">
        <div className="relative z-10 space-y-1.5 sm:space-y-2.5">
          <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-bold text-primary border border-primary/20 uppercase tracking-wider">
            Tag Collection
          </span>
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight leading-tight">
            {seo.h1}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
            {seo.intro}
          </p>
        </div>
      </div>

      {/* Games Listing */}
      <GameGrid games={games} title={seo.h1} showFilters={true} />
    </div>
  );
}
