import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Home, Grid } from "lucide-react";
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

export async function generateStaticParams() {
  return VALID_CATEGORIES.map((cat) => ({
    slug: cat,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);
  const title = `Best Free ${categoryName} Games - Play Online on PlayNow`;
  const description = `Discover the top free online ${categoryName} browser games. Play instantly in your web browser with zero installs or downloads.`;

  return {
    title,
    description,
    alternates: { canonical: `/category/${slug}` },
    openGraph: {
      title: `${categoryName} Games - PlayNow`,
      description: `Free online ${categoryName} browser games on PlayNow.`,
      type: "website",
      url: `${SITE_URL}/category/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${categoryName} Games - PlayNow`,
      description: `Free online ${categoryName} browser games on PlayNow.`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const normalizedCategory = slug.toLowerCase() as GameCategory;

  if (!VALID_CATEGORIES.includes(normalizedCategory)) {
    notFound();
  }

  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);
  const games = getGamesByCategory(normalizedCategory);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs font-semibold text-muted-foreground">
        <Link href="/" className="flex items-center hover:text-foreground transition-colors">
          <Home className="h-3.5 w-3.5 mr-1" />
          <span>Home</span>
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-bold capitalize">{categoryName} Games</span>
      </nav>

      {/* Category Banner Header */}
      <div className="relative overflow-hidden rounded-3xl border border-secondary/20 bg-gradient-to-r from-secondary/20 via-card to-card p-8 sm:p-10 shadow-xl">
        <div className="relative z-10 space-y-2">
          <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-bold text-violet-300 border border-secondary/20 uppercase tracking-wider">
            Category Hub
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            {categoryName} Games
          </h1>
          <p className="text-sm text-foreground/80 max-w-xl leading-relaxed">
            Browse our hand-picked collection of high quality {categoryName.toLowerCase()} HTML5 games. Play instantly on desktop or mobile.
          </p>
        </div>
      </div>

      {/* Games Listing */}
      <GameGrid
        games={games}
        title={`${categoryName} Games`}
        showFilters={true}
      />

    </div>
  );
}
