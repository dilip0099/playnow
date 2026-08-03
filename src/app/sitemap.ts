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
  ];

  // Category routes
  const categoryRoutes = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // Game detail routes
  const gameRoutes = games.map((game) => ({
    url: `${baseUrl}/game/${game.slug}`,
    lastModified: new Date(game.releaseDate),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...gameRoutes];
}
