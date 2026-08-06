import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { getGameBySlug } from "@/lib/games";
import { GameGrid } from "@/components/games/GameGrid";
import { GameMetadata } from "@/types/game";
import { SITE_URL } from "@/lib/site";

interface GamesLikePageProps {
  params: Promise<{ slug: string }>;
}

interface FranchiseSeo {
  // The real, trademarked franchise being referenced for search-intent purposes only.
  // PlayThorn has no affiliation with any of these rights holders — see the mandatory
  // disclaimer baked into every `intro` string below.
  franchise: string;
  h1: string;
  title: string;
  description: string;
  intro: string;
  // Real slugs from src/data/games.json only — every entry here was picked because it
  // genuinely shares core gameplay (mechanic/genre/theme) with the franchise, verified
  // against each game's actual description and tags before inclusion. Never pad this
  // list with unrelated games just to hit a minimum count.
  gameSlugs: string[];
}

// Only franchises where our own GameMonetize-licensed catalog (src/data/games.json) has 3+
// genuinely similar real games were built out below. Several other obvious search terms
// (Roblox, Fortnite, Among Us) were researched and deliberately skipped: our catalog
// doesn't have enough games that are honestly comparable in actual gameplay, only in
// surface theming, and forcing that match would be exactly the "thin/dishonest match"
// this page type is not allowed to produce.
const FRANCHISE_SEO: Record<string, FranchiseSeo> = {
  minecraft: {
    franchise: "Minecraft",
    h1: "Games Like Minecraft — Free Alternatives to Play Online",
    title: "Games Like Minecraft - Free Browser Alternatives to Play Online",
    description:
      "Play free browser games with mining, crafting, and blocky sandbox gameplay similar to Minecraft — no download required. Independent alternatives, not affiliated with Mojang or Microsoft.",
    intro:
      "Minecraft (Mojang Studios / Microsoft) turned block-based mining, crafting, and sandbox building into one of the biggest games ever made. PlayThorn doesn't host Minecraft itself, but our own catalog has independently developed games that share that same core loop — digging for resources, crafting upgrades, fighting off mobs, and building out your own blocky world — all playable instantly in your browser, no install required. PlayThorn is an independent site and is not affiliated with, sponsored by, or endorsed by Mojang Studios, Microsoft, or Minecraft in any way. These are simply similar free alternatives for fans of that style of game.",
    gameSlugs: [
      "minetap-merge-clicker",
      "mineclicker",
      "merge-mine-idle-clicker",
      "idle-noob-lumberjack",
      "noob-playground",
      "battle-simulator-sandbox",
    ],
  },
  gta: {
    franchise: "GTA",
    h1: "Games Like GTA — Free Alternatives to Play Online",
    title: "Games Like GTA - Free Browser Driving & Action Alternatives",
    description:
      "Play free browser games with the high-speed driving, police chases, and chaotic action GTA is known for — no download required. Independent alternatives, not affiliated with Rockstar Games or Take-Two.",
    intro:
      "Grand Theft Auto (Rockstar Games / Take-Two Interactive) is famous for open-world driving chaos, police chases, and mayhem across a sprawling city. PlayThorn doesn't have an open-world crime sandbox, but our catalog has plenty of the same high-speed driving thrills GTA fans come for — outrunning cops, tearing through neon city streets, and surviving demolition-derby destruction — every one a real, independently developed game, playable instantly with no install. PlayThorn is an independent site and is not affiliated with, sponsored by, or endorsed by Rockstar Games, Take-Two Interactive, or the Grand Theft Auto franchise in any way. These are simply similar free alternatives.",
    gameSlugs: [
      "endless-car-chase",
      "road-madness",
      "night-city-racing",
      "demolition-derby-life",
      "supercars-zombie-driving",
      "drive-crazy",
    ],
  },
  "call-of-duty": {
    franchise: "Call of Duty",
    h1: "Games Like Call of Duty — Free Alternatives to Play Online",
    title: "Games Like Call of Duty - Free Browser FPS & War Shooter Alternatives",
    description:
      "Play free browser FPS and military shooter games with combat similar to Call of Duty — sniper missions, frontline assaults, and tactical firefights. No download. Independent alternatives, not affiliated with Activision.",
    intro:
      "Call of Duty (Activision) set the standard for fast-paced military first-person shooters — sniper missions, frontline assaults, and tactical firefights. You won't find the Call of Duty games themselves here, but PlayThorn's catalog has a deep bench of independently developed FPS and war-shooter titles that scratch the same itch: stealth sniping, commando raids, and battlefield combat, all playable instantly with no install. PlayThorn is an independent site and is not affiliated with, sponsored by, or endorsed by Activision or the Call of Duty franchise in any way. These are simply similar free alternatives.",
    gameSlugs: [
      "fps-sniper-shooting",
      "frontline-assault",
      "ww2-call-of-sniper",
      "commando-force-2",
      "strykon",
      "army-force-war",
      "funny-shooter-2",
      "the-room",
      "green-slaughter",
    ],
  },
  "world-of-tanks": {
    franchise: "World of Tanks",
    h1: "Games Like World of Tanks — Free Alternatives to Play Online",
    title: "Games Like World of Tanks - Free Browser Tank Battle Alternatives",
    description:
      "Play free browser tank warfare games with combat similar to World of Tanks — command tanks, upgrade your armor, and battle across war-torn fronts. No download. Independent alternatives, not affiliated with Wargaming.",
    intro:
      "World of Tanks (Wargaming) turned tank warfare into one of the biggest multiplayer franchises around. PlayThorn's catalog has its own deep roster of independently developed tank battle games — command real tanks, upgrade your armor and firepower, and battle across WWII-style fronts and modern arenas, all instantly in your browser with no install. PlayThorn is an independent site and is not affiliated with, sponsored by, or endorsed by Wargaming or World of Tanks in any way. These are simply similar free alternatives.",
    gameSlugs: [
      "world-of-wartanks",
      "war-of-tanks-3d",
      "tiger-tank",
      "tanks-blitz",
      "paper-panzer",
      "world-of-military-tanks",
      "tank-arena-steel-battle",
      "mech-battle-simulator",
      "tank-wars",
      "mountain-tank",
      "1941-frozen-front",
      "tanks-2d-war-and-heroes",
    ],
  },
  "candy-crush": {
    franchise: "Candy Crush",
    h1: "Games Like Candy Crush — Free Alternatives to Play Online",
    title: "Games Like Candy Crush - Free Browser Match-3 Puzzle Alternatives",
    description:
      "Play free browser match-3 and matching-puzzle games with the same satisfying gameplay as Candy Crush — no download, no app store, no signup. Independent alternatives, not affiliated with King.",
    intro:
      "Candy Crush Saga (King) turned match-3 puzzles into a global phenomenon. PlayThorn's catalog has its own independently developed match-3 and matching-puzzle games that deliver that same swap-match-clear satisfaction, playable instantly in your browser with no app install or account. PlayThorn is an independent site and is not affiliated with, sponsored by, or endorsed by King or Candy Crush in any way. These are simply similar free alternatives.",
    gameSlugs: ["prism-match-3d", "match-mystery", "skibidi-match-master", "merge-royal"],
  },
  "subway-surfers": {
    franchise: "Subway Surfers",
    h1: "Games Like Subway Surfers — Free Alternatives to Play Online",
    title: "Games Like Subway Surfers - Free Browser Endless Runner Alternatives",
    description:
      "Play free browser endless-runner games with the same dodge-and-dash gameplay as Subway Surfers — no download, no app store. Independent alternatives, not affiliated with SYBO Games.",
    intro:
      "Subway Surfers (SYBO Games) is one of the most-played endless runners ever made — dodging obstacles, dashing down lanes, and chasing a high score. PlayThorn's catalog has its own independently developed endless-runner and one-touch arcade dodgers that capture that same fast-reflex, obstacle-dodging rush, playable instantly in your browser with no install. PlayThorn is an independent site and is not affiliated with, sponsored by, or endorsed by SYBO Games or Subway Surfers in any way. These are simply similar free alternatives.",
    gameSlugs: ["wear-the-helmet", "ran-and-jump-jambo-runner", "canjump", "going-right"],
  },
};

function getFranchiseGames(seo: FranchiseSeo): GameMetadata[] {
  return seo.gameSlugs
    .map((slug) => getGameBySlug(slug))
    .filter((g): g is GameMetadata => Boolean(g));
}

export async function generateStaticParams() {
  return Object.keys(FRANCHISE_SEO).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: GamesLikePageProps): Promise<Metadata> {
  const { slug } = await params;
  const seo = FRANCHISE_SEO[slug];
  if (!seo) return { title: "Games - PlayThorn" };

  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: `/games-like/${slug}` },
    openGraph: {
      title: `${seo.h1} - PlayThorn`,
      description: seo.description,
      type: "website",
      url: `${SITE_URL}/games-like/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${seo.h1} - PlayThorn`,
      description: seo.description,
    },
  };
}

export default async function GamesLikePage({ params }: GamesLikePageProps) {
  const { slug } = await params;
  const seo = FRANCHISE_SEO[slug];

  if (!seo) {
    notFound();
  }

  const games = getFranchiseGames(seo);

  if (games.length === 0) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: seo.title,
        description: seo.description,
        url: `${SITE_URL}/games-like/${slug}`,
      },
      {
        "@type": "ItemList",
        itemListElement: games.map((game, idx) => ({
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
          { "@type": "ListItem", position: 2, name: seo.h1, item: `${SITE_URL}/games-like/${slug}` },
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
        <span className="text-foreground font-bold">Games Like {seo.franchise}</span>
      </nav>

      {/* Header Banner - Compact & Responsive */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-4 sm:p-6 lg:p-8 shadow-sm">
        <div className="relative z-10 space-y-1.5 sm:space-y-2.5">
          <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-bold text-primary border border-primary/20 uppercase tracking-wider">
            Not Affiliated with {seo.franchise}
          </span>
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight leading-tight">
            {seo.h1}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            {seo.intro}
          </p>
        </div>
      </div>

      {/* Games Listing */}
      <GameGrid games={games} title={`Free Alternatives to ${seo.franchise}`} showFilters={true} />
    </div>
  );
}
