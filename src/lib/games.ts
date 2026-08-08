import rawGames from "@/data/games.json";
import { GameMetadata, GameCategory, GameFilterOptions } from "@/types/game";

export const gamesData: GameMetadata[] = rawGames as GameMetadata[];

export function getAllGames(): GameMetadata[] {
  return gamesData;
}

export function getGameBySlug(slug: string): GameMetadata | undefined {
  return gamesData.find((g) => g.slug === slug || g.id === slug);
}

export function getFeaturedGames(): GameMetadata[] {
  return gamesData.filter((g) => g.featured);
}

export function getTrendingGames(): GameMetadata[] {
  return gamesData.filter((g) => g.trending);
}

export function getNewGames(): GameMetadata[] {
  return gamesData.filter((g) => g.isNew);
}

export function getGamesByCategory(category: GameCategory): GameMetadata[] {
  return gamesData.filter((g) => g.category.toLowerCase() === category.toLowerCase());
}

export function getRelatedGames(currentGame: GameMetadata, limit = 4): GameMetadata[] {
  return gamesData
    .filter(
      (g) =>
        g.id !== currentGame.id &&
        (g.category === currentGame.category || g.tags.some((t) => currentGame.tags.includes(t)))
    )
    .slice(0, limit);
}

export function filterAndSortGames(options: GameFilterOptions): GameMetadata[] {
  let result = [...gamesData];

  // Filter by category
  if (options.category && options.category !== "all") {
    result = result.filter((g) => g.category.toLowerCase() === options.category?.toLowerCase());
  }

  // Filter by text search query
  if (options.query && options.query.trim() !== "") {
    const q = options.query.toLowerCase().trim();
    result = result.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.tags.some((t) => t.toLowerCase().includes(q)) ||
        g.category.toLowerCase().includes(q)
    );
  }

  // Featured / Trending flags
  if (options.featuredOnly) {
    result = result.filter((g) => g.featured);
  }
  if (options.trendingOnly) {
    result = result.filter((g) => g.trending);
  }

  // Sort — "popular"/"rating" intentionally fall through to catalog order: GameMonetize's
  // feed doesn't expose a real per-game popularity or rating signal to sort by.
  switch (options.sortBy) {
    case "newest":
      result.sort((a, b) => new Date(b.releaseDate || 0).getTime() - new Date(a.releaseDate || 0).getTime());
      break;
    case "title":
      result.sort((a, b) => a.title.localeCompare(b.title));
      break;
    default:
      break;
  }

  return result;
}
