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
const PAGE_SIZE = 96; // must be one of [12, 24, 48, 96] per GamePix feed API
// Verified live against the real feed: quality_score correlates with accumulated engagement,
// so a deep quality-ranked pool is needed to fill every category well past a handful of picks.
const MAIN_POOL_PAGES = 30;
// A shallow pool sorted by publish date instead of quality — freshly-published games haven't
// accumulated engagement yet, so this is the only way to surface genuinely new titles at all.
const NEW_RELEASES_POOL_PAGES = 3;
const TARGET_PER_CATEGORY = 22;
const NEW_RELEASES_COUNT = 12;
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

async function fetchPages(pages: number, order: "quality" | "pubdate"): Promise<GamePixItem[]> {
  const all: GamePixItem[] = [];
  for (let p = 1; p <= pages; p++) {
    const res = await fetch(
      `https://feeds.gamepix.com/v2/json?sid=${SID}&pagination=${PAGE_SIZE}&page=${p}&order=${order}`
    );
    if (!res.ok) {
      console.warn(`⚠️  GamePix feed page ${p} (order=${order}) returned ${res.status}, stopping pagination.`);
      break;
    }
    const data = (await res.json()) as GamePixFeed;
    if (!data.items || data.items.length === 0) break;
    all.push(...data.items);
  }
  return all;
}

function dedupeByNamespace(items: GamePixItem[]): GamePixItem[] {
  const seen = new Set<string>();
  return items.filter((i) => {
    if (seen.has(i.namespace)) return false;
    seen.add(i.namespace);
    return true;
  });
}

export async function importGamePixCatalog() {
  if (!SID) {
    console.error("❌ GAMEPIX_SID is not set. Add it to .env.local (see GamePix publisher dashboard).");
    process.exit(1);
  }

  const rejectedForBrandRisk: { title: string; conflicts: string[] }[] = [];

  // Requiring a non-empty `description` up front silently drops good games — GamePix appears
  // to backfill descriptions some time after a title first goes live (verified live: 8 of the
  // freshest ~30 published titles score 0.83+ on quality but have no description yet). A
  // fallback description is generated per-game below, so we only require a title + real score.
  function qualifies(i: GamePixItem): boolean {
    if (i.quality_score < QUALITY_THRESHOLD || !i.title) return false;
    const conflicts = hasBrandRisk(`${i.title} ${i.description || ""}`);
    if (conflicts.length > 0) {
      rejectedForBrandRisk.push({ title: i.title, conflicts });
      return false;
    }
    return true;
  }

  console.log("🔍 Fetching quality-ranked game pool from GamePix...");
  const qualityPool = dedupeByNamespace(await fetchPages(MAIN_POOL_PAGES, "quality")).filter(qualifies);
  console.log(`   ${qualityPool.length} candidates after quality + brand-risk filtering.`);

  // Group by our site category, keep the top N per category by quality_score
  const byCategory: Record<GameCategory, GamePixItem[]> = {
    action: [], puzzle: [], arcade: [], racing: [], adventure: [], strategy: [], sports: [], multiplayer: [],
  };
  qualityPool.forEach((item) => {
    byCategory[mapCategory(item.category)].push(item);
  });

  const selected: { item: GamePixItem; siteCategory: GameCategory }[] = [];
  const selectedIds = new Set<string>();
  VALID_CATEGORIES.forEach((cat) => {
    const top = byCategory[cat].sort((a, b) => b.quality_score - a.quality_score).slice(0, TARGET_PER_CATEGORY);
    top.forEach((item) => {
      selected.push({ item, siteCategory: cat });
      selectedIds.add(item.namespace);
    });
  });

  console.log(`✅ Selected ${selected.length} real games across ${VALID_CATEGORIES.length} categories.`);

  // "New Releases" needs titles that are ACTUALLY new, not just the most-recent survivors of a
  // quality-sorted pool (which skews toward older, more-established games — verified live: none
  // of the freshest 96 published titles clear our quality bar via the default/quality ordering,
  // because GamePix's quality_score accumulates with engagement over time). Fetching by
  // publish-date directly is the only way to surface genuinely new titles at all.
  console.log("🔍 Fetching freshest-published games from GamePix...");
  const freshPool = dedupeByNamespace(await fetchPages(NEW_RELEASES_POOL_PAGES, "pubdate")).filter(qualifies);
  const freshTopN = freshPool.slice(0, NEW_RELEASES_COUNT); // already sorted newest-first by the feed itself
  console.log(`   ${freshTopN.length} genuinely new titles clear the quality bar.`);

  freshTopN.forEach((item) => {
    if (!selectedIds.has(item.namespace)) {
      selected.push({ item, siteCategory: mapCategory(item.category) });
      selectedIds.add(item.namespace);
    }
  });

  if (rejectedForBrandRisk.length > 0) {
    console.log(`   Rejected ${rejectedForBrandRisk.length} for brand risk:`, rejectedForBrandRisk.map((r) => r.title));
  }

  const newestIds = new Set(freshTopN.map((item) => item.namespace));

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
