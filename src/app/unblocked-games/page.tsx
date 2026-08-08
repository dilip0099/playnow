import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { getAllGames } from "@/lib/games";
import { GameGrid } from "@/components/games/GameGrid";
import { SITE_URL } from "@/lib/site";

// "Unblocked games" is the single highest-volume search term in this entire niche
// (~3.35M-4.09M searches/month in 2026 — several times "online games" at ~450K-550K/mo),
// yet the site had zero content targeting it. The copy below stays honest about *why*
// these games work in restrictive network environments (HTML5, no Flash/plugins, no
// installs — a real, verifiable technical fact) rather than promising to "bypass school
// firewalls," which we can't guarantee and would be a false claim.
const TITLE = "Unblocked Games - Play Free HTML5 Games Online - PlayThorn";
const DESCRIPTION =
  "Play unblocked HTML5 games online for free in your browser. No Flash or downloads required — works on school Chromebooks, work PCs, and mobile devices.";
const H1 = "Unblocked Games";
const INTRO =
  "Every game on PlayThorn is pure HTML5 — no Flash, no plugins, no installer, nothing for a network filter to flag as an executable download. That's what \"unblocked\" really means here: these games run entirely inside the browser tab you already have open, the same as any other webpage. Pick one below and it loads instantly.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/unblocked-games" },
  openGraph: {
    title: `${H1} - PlayThorn`,
    description: DESCRIPTION,
    type: "website",
    url: `${SITE_URL}/unblocked-games`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${H1} - PlayThorn`,
    description: DESCRIPTION,
  },
};

export default function UnblockedGamesPage() {
  const games = getAllGames();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: TITLE,
        description: DESCRIPTION,
        url: `${SITE_URL}/unblocked-games`,
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
          { "@type": "ListItem", position: 2, name: H1, item: `${SITE_URL}/unblocked-games` },
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
        <span className="text-foreground font-bold">{H1}</span>
      </nav>

      {/* Header Banner - Compact & Responsive */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-4 sm:p-6 lg:p-8 shadow-sm">
        <div className="relative z-10 space-y-1.5 sm:space-y-2.5">
          <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-bold text-primary border border-primary/20 uppercase tracking-wider">
            No Download • Instant HTML5
          </span>
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight leading-tight">
            {H1}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            {INTRO}
          </p>
        </div>
      </div>

      {/* Games Listing */}
      <GameGrid games={games} title="All Unblocked Games" showFilters={true} />
    </div>
  );
}
