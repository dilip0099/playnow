import { MetadataRoute } from "next";
import { getAllGames } from "@/lib/games";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;
  const games = getAllGames();

  const categories = [
    "action",
    "puzzle",
    "arcade",
    "racing",
    "adventure",
    "strategy",
    "sports",
    "multiplayer",
    "classic",
  ];

  // Real tag values with 4+ games each that are genuinely distinct from any category page
  // (see src/app/tag/[tag]/page.tsx — tags matching a category 1:1 were deliberately excluded
  // as duplicate content).
  const tags = [
    "board",
    "tanks",
    "clicker",
    "fighting",
    "simulation",
    "card",
    "shooter",
    "first-person-shooter",
    "trivia",
    "io",
    "two-player",
    "car",
    "driving",
    "zombie",
    "stickman",
    "logic",
    "physics",
    "educational",
    "match-3",
    "escape",
    "defense",
    "word",
  ];

  // Franchise slugs with real, genuinely-matching games backing them (see
  // src/app/games-like/[slug]/page.tsx).
  const gamesLikeSlugs = [
    "minecraft",
    "gta",
    "call-of-duty",
    "world-of-tanks",
    "candy-crush",
    "subway-surfers",
  ];

  // Static / Core routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/unblocked-games`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal/dmca`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ];

  // Category routes
  const categoryRoutes = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // Tag routes
  const tagRoutes = tags.map((tag) => ({
    url: `${baseUrl}/tag/${tag}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // "Games like X" comparison routes
  const gamesLikeRoutes = gamesLikeSlugs.map((slug) => ({
    url: `${baseUrl}/games-like/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Game detail routes
  const gameRoutes = games.map((game) => ({
    url: `${baseUrl}/game/${game.slug}`,
    lastModified: new Date(game.releaseDate),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...tagRoutes, ...gamesLikeRoutes, ...gameRoutes];
}
