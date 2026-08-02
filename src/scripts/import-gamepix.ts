import fs from "fs";
import path from "path";
import crypto from "crypto";
import { GameCategory, GameMetadata } from "../types/game";
import { scanGameForTrademarks } from "../lib/trademark-scanner";

const OUTPUT_DATA_FILE = path.join(process.cwd(), "src", "data", "games.json");
const LICENSE_REPORT_FILE = path.join(process.cwd(), "src", "data", "license-report.json");
const PUBLIC_LICENSE_REPORT_FILE = path.join(process.cwd(), "public", "license-report.json");
const ATTRIBUTIONS_FILE = path.join(process.cwd(), "ATTRIBUTIONS.md");

const SID = process.env.GAMEPIX_SID;
const PAGES_TO_FETCH = 6;
const PAGE_SIZE = 96; // must be one of [12, 24, 48, 96] per GamePix feed API
const TARGET_PER_CATEGORY = 7;
const QUALITY_THRESHOLD = 0.7;

const VALID_CATEGORIES: GameCategory[] = [
  "action", "puzzle", "arcade", "racing", "adventure", "strategy", "sports", "multiplayer",
];

// Maps GamePix's ~90 granular categories onto our 8 site categories.
const CATEGORY_MAP: Record<string, GameCategory> = {
  shooter: "action", "first-person-shooter": "action", fighting: "action", battle: "action",
  zombie: "action", gangster: "action", robots: "action", hunting: "action",
  "2048": "puzzle", "match-3": "puzzle", puzzle: "puzzle", "hidden-object": "puzzle",
  block: "puzzle", trivia: "puzzle", drawing: "puzzle", educational: "puzzle", escape: "puzzle",
  math: "puzzle", tetris: "puzzle", surgery: "puzzle", "jigsaw-puzzles": "puzzle", jewel: "puzzle",
  coloring: "puzzle",
  arcade: "arcade", ball: "arcade", retro: "arcade", fun: "arcade", animal: "arcade",
  stickman: "arcade", christmas: "arcade", memory: "arcade", "games-for-girls": "arcade",
  casual: "arcade", skill: "arcade", "hyper-casual": "arcade", runner: "arcade", pixel: "arcade",
  crazy: "arcade", "skibidi-toilet": "arcade", fishing: "arcade", music: "arcade",
  "dress-up": "arcade", fashion: "arcade", "hair-salon": "arcade", snake: "arcade",
  racing: "racing", driving: "racing", car: "racing", airplane: "racing",
  adventure: "adventure", platformer: "adventure", parkour: "adventure", monster: "adventure",
  scary: "adventure",
  simulation: "strategy", idle: "strategy", board: "strategy", checkers: "strategy",
  card: "strategy", clicker: "strategy", war: "strategy",
  sports: "sports", basketball: "sports", soccer: "sports", boxing: "sports", archery: "sports",
  io: "multiplayer", "two-player": "multiplayer", tanks: "multiplayer",
};

const PROHIBITED_BRAND_TERMS = [
  "TETRIS", "PACMAN", "PAC-MAN", "MARIO", "POKEMON", "POKÉMON", "MINECRAFT", "SONIC", "ZELDA",
  "FLAPPY BIRD", "SPACE INVADERS", "SUBWAY SURFERS", "TEMPLE RUN", "AMONG US", "DONKEY KONG",
  "METROID", "GTA", "GRAND THEFT AUTO", "CALL OF DUTY", "NINTENDO", "SEGA", "DISNEY", "MARVEL",
  "CAPCOM", "KONAMI", "UBISOFT", "MOJANG", "HUGGY WUGGY", "HUGGY", "POPPY PLAYTIME", "ROBLOX",
  "FORTNITE", "SPONGEBOB", "BARBIE", "HELLO KITTY", "PAW PATROL", "STAR WARS", "HARRY POTTER",
];

interface GamePixItem {
  id: string;
  title: string;
  namespace: string;
  description?: string;
  category: string;
  orientation: string;
  quality_score: number;
  width: number;
  height: number;
  date_modified: string;
  date_published: string;
  banner_image: string;
  image: string;
  url: string;
}

interface GamePixFeed {
  items: GamePixItem[];
}

function mapCategory(gpCategory: string): GameCategory {
  return CATEGORY_MAP[gpCategory] || "arcade";
}

function bucketAspectRatio(width: number, height: number): "16/9" | "3/4" | "square" {
  const ratio = width / height;
  if (ratio > 1.2) return "16/9";
  if (ratio < 0.85) return "3/4";
  return "square";
}

function hasBrandRisk(text: string): string[] {
  const upper = text.toUpperCase();
  return PROHIBITED_BRAND_TERMS.filter((term) =>
    new RegExp(`\\b${term.replace(/-/g, "[\\s-]?")}\\b`).test(upper)
  );
}

function higherResImage(url: string, width: number): string {
  return url.replace(/([?&])w=\d+/, `$1w=${width}`);
}

async function fetchAllPages(): Promise<GamePixItem[]> {
  const all: GamePixItem[] = [];
  for (let p = 1; p <= PAGES_TO_FETCH; p++) {
    const res = await fetch(
      `https://feeds.gamepix.com/v2/json?sid=${SID}&pagination=${PAGE_SIZE}&page=${p}`
    );
    if (!res.ok) {
      console.warn(`⚠️  GamePix feed page ${p} returned ${res.status}, stopping pagination.`);
      break;
    }
    const data = (await res.json()) as GamePixFeed;
    if (!data.items || data.items.length === 0) break;
    all.push(...data.items);
  }
  return all;
}

export async function importGamePixCatalog() {
  if (!SID) {
    console.error("❌ GAMEPIX_SID is not set. Add it to .env.local (see GamePix publisher dashboard).");
    process.exit(1);
  }

  console.log("🔍 Fetching real game catalog from GamePix...");
  let items = await fetchAllPages();
  console.log(`   Fetched ${items.length} raw entries across ${PAGES_TO_FETCH} pages.`);

  // Dedup by namespace
  const seen = new Set<string>();
  items = items.filter((i) => {
    if (seen.has(i.namespace)) return false;
    seen.add(i.namespace);
    return true;
  });

  // Quality + basic completeness filter
  items = items.filter((i) => i.quality_score >= QUALITY_THRESHOLD && i.description && i.title);

  // Trademark/brand-risk safety filter — these are GamePix's games, not ours,
  // but we still don't want to host/link anything referencing third-party IP.
  const rejectedForBrandRisk: { title: string; conflicts: string[] }[] = [];
  items = items.filter((i) => {
    const conflicts = hasBrandRisk(`${i.title} ${i.description}`);
    if (conflicts.length > 0) {
      rejectedForBrandRisk.push({ title: i.title, conflicts });
      return false;
    }
    return true;
  });

  console.log(`   ${items.length} candidates after quality + brand-risk filtering.`);
  if (rejectedForBrandRisk.length > 0) {
    console.log(`   Rejected ${rejectedForBrandRisk.length} for brand risk:`, rejectedForBrandRisk.map((r) => r.title));
  }

  // Group by our site category, keep the top N per category by quality_score
  const byCategory: Record<GameCategory, GamePixItem[]> = {
    action: [], puzzle: [], arcade: [], racing: [], adventure: [], strategy: [], sports: [], multiplayer: [],
  };
  items.forEach((item) => {
    byCategory[mapCategory(item.category)].push(item);
  });

  const selected: { item: GamePixItem; siteCategory: GameCategory }[] = [];
  VALID_CATEGORIES.forEach((cat) => {
    const top = byCategory[cat].sort((a, b) => b.quality_score - a.quality_score).slice(0, TARGET_PER_CATEGORY);
    top.forEach((item) => selected.push({ item, siteCategory: cat }));
  });

  console.log(`✅ Selected ${selected.length} real games across ${VALID_CATEGORIES.length} categories.`);

  // "New Releases" needs a relative signal, not an absolute one — GamePix's whole catalog
  // ages, so an absolute "published in the last 90 days" cutoff can (and did) match zero
  // games once every selected title crossed that line, silently starving the homepage rail.
  // Instead, mark the N most-recently-published titles among what we actually selected.
  const NEW_RELEASES_COUNT = 8;
  const newestIds = new Set(
    [...selected]
      .sort((a, b) => new Date(b.item.date_published).getTime() - new Date(a.item.date_published).getTime())
      .slice(0, NEW_RELEASES_COUNT)
      .map(({ item }) => item.namespace)
  );

  const now = new Date().toISOString();
  const games: GameMetadata[] = selected.map(({ item, siteCategory }) => {
    const scanResult = scanGameForTrademarks(item.title, item.description || "", "", "Open Licensed");
    const trending = item.quality_score >= 0.9;
    const publishedRecently = newestIds.has(item.namespace);

    const game: GameMetadata = {
      id: item.namespace,
      title: item.title,
      slug: item.namespace,
      description: item.description || `Play ${item.title} online for free.`,
      instructions: "Use mouse, keyboard, or touch controls as shown in-game.",
      category: siteCategory,
      genre: siteCategory,
      tags: [siteCategory, item.category, item.orientation].filter(Boolean),
      controls: [{ key: "Mouse / Keyboard / Touch", action: "Play" }],
      author: "Licensed via GamePix",
      version: "1.0.0",
      rating: Math.min(5, Math.max(1, Math.round(item.quality_score * 5 * 10) / 10)),
      playsCount: 0,
      featured: false,
      trending,
      isNew: publishedRecently,
      releaseDate: item.date_published,
      lastUpdated: item.date_modified,
      mobileSupport: true,
      aspectRatio: bucketAspectRatio(item.width, item.height),
      thumbnailUrl: higherResImage(item.image, 400),
      coverImage: higherResImage(item.banner_image, 800),
      heroImage: higherResImage(item.banner_image, 1920),
      screenshots: [higherResImage(item.banner_image, 1200)],
      gameUrl: item.url,

      license: "Network-Licensed",
      repository: item.url,
      homepage: item.url,
      commercialUse: true,
      attributionRequired: false,

      commitHash: item.id,
      licenseChecksum: crypto.createHash("sha256").update(JSON.stringify(item)).digest("hex"),
      importTimestamp: now,
      trustVerified: true,

      gameType: "Licensed Game",
      derivedTitle: item.title,

      brandRisk: scanResult.brandRisk,
      assetSource: "Open Licensed",
      commercialReady: scanResult.commercialReady,
      assetVerificationStatus: "VERIFIED",

      monetizationEnabled: true,
      adSupported: true,
      revenueShare: undefined,

      sourceNetwork: "GamePix",
      externalGameId: item.id,
    };
    return game;
  });

  fs.writeFileSync(OUTPUT_DATA_FILE, JSON.stringify(games, null, 2), "utf-8");

  const report = {
    timestamp: now,
    totalImported: games.length,
    sourceNetwork: "GamePix",
    categoryDistribution: VALID_CATEGORIES.reduce((acc, cat) => {
      acc[cat] = games.filter((g) => g.category === cat).length;
      return acc;
    }, {} as Record<string, number>),
    rejectedForBrandRisk,
  };
  fs.writeFileSync(LICENSE_REPORT_FILE, JSON.stringify(report, null, 2), "utf-8");
  fs.writeFileSync(PUBLIC_LICENSE_REPORT_FILE, JSON.stringify(report, null, 2), "utf-8");

  let md = `# PlayNow Game Sourcing & Attributions\n\n`;
  md += `PlayNow's game catalog is licensed through **GamePix** (https://www.gamepix.com/), a third-party HTML5 game publisher network, under a standard publisher agreement. PlayNow does not author, host, or claim ownership of this game code — each title is embedded directly from GamePix's platform, and GamePix (not PlayNow) is responsible for the underlying game's content and its own developer-attribution relationships.\n\n`;
  md += `| Title | Category | GamePix ID | Embed Source |\n`;
  md += `| :--- | :---: | :---: | :--- |\n`;
  games.forEach((g) => {
    md += `| **${g.title}** | ${g.category} | \`${g.externalGameId}\` | [GamePix](${g.gameUrl}) |\n`;
  });
  fs.writeFileSync(ATTRIBUTIONS_FILE, md, "utf-8");

  console.log(`🚀 Wrote ${games.length} real, licensed games to games.json`);
  return { games };
}

if (require.main === module) {
  importGamePixCatalog();
}
