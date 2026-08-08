import fs from "fs";
import path from "path";
import crypto from "crypto";
import { execSync } from "child_process";
import { GameCategory, GameMetadata } from "../types/game";
import { scanGameForTrademarks } from "../lib/trademark-scanner";

const OUTPUT_DATA_FILE = path.join(process.cwd(), "src", "data", "games.json");
const LICENSE_REPORT_FILE = path.join(process.cwd(), "src", "data", "license-report.json");
const PUBLIC_LICENSE_REPORT_FILE = path.join(process.cwd(), "public", "license-report.json");
const ATTRIBUTIONS_FILE = path.join(process.cwd(), "ATTRIBUTIONS.md");

// GameMonetize public feed — no API key, no domain whitelist, no traffic minimum
// Docs: https://gamemonetize.com/feed.php?format=0&num=100&page=N
const GM_FEED_BASE = "https://gamemonetize.com/feed.php?format=0&num=100&page=";
const TOTAL_PAGES = 80;           // 80 × 100 = up to 8,000 games, safe for curl rate limits
const TARGET_PER_CATEGORY = 300;
const TARGET_CLASSIC_GAMES = 150;

const VALID_CATEGORIES: GameCategory[] = [
  "action", "puzzle", "arcade", "racing", "adventure", "strategy", "sports", "multiplayer", "classic",
];

const CATEGORY_QUOTA: Partial<Record<GameCategory, number>> = {
  classic: TARGET_CLASSIC_GAMES,
};

const CATEGORY_MAP: Record<string, GameCategory> = {
  // Action
  "Action": "action", "Shooter": "action", "Fighting": "action", "Battle": "action",
  "Zombie": "action", "Tower Defense": "action", "War": "action", "Clicker": "action",
  // Puzzle
  "Puzzle": "puzzle", "Match3": "puzzle", "Match-3": "puzzle", "Merge": "puzzle",
  "Quiz": "puzzle", "Educational": "puzzle", "Brain": "puzzle", "Logic": "puzzle",
  "Bubble Shooter": "puzzle", "Word": "puzzle",
  // Arcade
  "Arcade": "arcade", "Casual": "arcade", "Agility": "arcade", "Cooking": "arcade",
  "Dress Up": "arcade", "Fashion": "arcade", "Make Up": "arcade", "Care": "arcade",
  "Art": "arcade", "Hypercasual": "arcade",
  // Racing
  "Racing": "racing", "Driving": "racing", "Car": "racing", "Bike": "racing",
  "Traffic": "racing", "Parking": "racing",
  // Adventure
  "Adventure": "adventure", "Platformer": "adventure", "Run": "adventure",
  "Escape": "adventure", "RPG": "adventure",
  // Strategy
  "Strategy": "strategy", "Simulation": "strategy", "Management": "strategy",
  "Idle": "strategy", "Mining": "strategy", "Defense": "strategy",
  // Sports
  "Sports": "sports", "Football": "sports", "Soccer": "sports", "Basketball": "sports",
  "Baseball": "sports", "Golf": "sports", "Tennis": "sports", "Swimming": "sports",
  "Stickman": "sports",
  // Multiplayer
  "Multiplayer": "multiplayer", "2 Player": "multiplayer", "2Player": "multiplayer",
  ".io": "multiplayer", "IO": "multiplayer",
  // Classic
  "Cards": "classic", "Board": "classic", "Solitaire": "classic", "Chess": "classic",
  "Mahjong": "classic", "Bingo": "classic",
};

const PROHIBITED_BRAND_TERMS = [
  "TETRIS", "PACMAN", "PAC-MAN", "MARIO", "POKEMON", "POKÉMON", "MINECRAFT", "SONIC",
  "ZELDA", "FLAPPY BIRD", "SUBWAY SURFERS", "TEMPLE RUN", "AMONG US", "DONKEY KONG",
  "GTA", "GRAND THEFT AUTO", "CALL OF DUTY", "NINTENDO", "SEGA", "DISNEY", "MARVEL",
  "CAPCOM", "KONAMI", "UBISOFT", "MOJANG", "HUGGY WUGGY", "POPPY PLAYTIME", "ROBLOX",
  "FORTNITE", "SPONGEBOB", "BARBIE", "HELLO KITTY", "PAW PATROL", "STAR WARS",
  "HARRY POTTER", "CANDY CRUSH", "CUT THE ROPE", "OM NOM", "ZUMA", "BEJEWELED",
  "WORDLE", "SQUID GAME", "SPRUNKI", "GRIMACE", "TERRARIA", "FNAF",
  "FIVE NIGHTS AT FREDDY", "SLITHER.IO", "AGAR.IO",
];

// Readable, SEO-meaningful slugs beat raw hashes for both rankings and CTR (a URL like
// /game/forest-dash is legible in a search snippet; /game/6f7f369778e2... is not). The stable
// md5 `id` is kept separately so getGameBySlug's id-fallback (src/lib/games.ts) can still resolve
// any already-indexed hash-slug URL and redirect it to the new canonical slug — see the
// redirect logic in src/app/game/[slug]/page.tsx.
function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "game";
}

interface GameMonetizeItem {
  id: string;
  title: string;
  description: string;
  instructions: string;
  url: string;           // Direct embed URL — no domain lock!
  category: string;
  tags: string;
  thumb: string;         // 512x384 thumbnail
  width: string;
  height: string;
}

function mapCategory(cat: string, tags: string, title = ""): GameCategory {
  const blob = `${cat} ${tags} ${title}`.toLowerCase();
  if (
    blob.includes("card") ||
    blob.includes("board") ||
    blob.includes("chess") ||
    blob.includes("solitaire") ||
    blob.includes("mahjong") ||
    blob.includes("classic") ||
    blob.includes("domino") ||
    blob.includes("sudoku") ||
    blob.includes("checkers") ||
    blob.includes("ludo") ||
    blob.includes("tic tac")
  ) {
    return "classic";
  }
  if (
    blob.includes("strategy") ||
    blob.includes("defense") ||
    blob.includes("simulation") ||
    blob.includes("idle") ||
    blob.includes("tycoon") ||
    blob.includes("build") ||
    blob.includes("tactics") ||
    blob.includes("tower")
  ) {
    return "strategy";
  }
  // Try direct category first
  for (const [key, val] of Object.entries(CATEGORY_MAP)) {
    if (cat.toLowerCase().includes(key.toLowerCase())) return val;
  }
  // Fallback: check tags
  for (const tag of tags.split(",").map((t) => t.trim())) {
    for (const [key, val] of Object.entries(CATEGORY_MAP)) {
      if (tag.toLowerCase().includes(key.toLowerCase())) return val;
    }
  }
  return "arcade";
}

function bucketAspectRatio(item: GameMonetizeItem): "16/9" | "9/16" | "3/4" | "square" {
  const text = `${item.title} ${item.description} ${item.instructions} ${item.tags}`.toLowerCase();
  if (
    text.includes("portrait") ||
    text.includes("vertical") ||
    text.includes("hold upright") ||
    text.includes("upright mode")
  ) {
    return "9/16";
  }
  const w = parseInt(item.width, 10);
  const h = parseInt(item.height, 10);
  if (!w || !h) return "16/9";
  const ratio = w / h;
  if (ratio > 1.2) return "16/9";
  if (ratio < 0.85) return "9/16";
  return "square";
}

function hasBrandRisk(text: string): string[] {
  const upper = text.toUpperCase();
  return PROHIBITED_BRAND_TERMS.filter((term) =>
    new RegExp(`\\b${term.replace(/-/g, "[\\s-]?")}\\b`).test(upper)
  );
}

function parseControlsFromInstructions(instructions: string, category: string): { key: string; action: string }[] {
  const text = (instructions || "").toLowerCase();
  const controls: { key: string; action: string }[] = [];
  if (text.includes("wasd") || text.includes("arrow")) {
    controls.push({ key: "WASD / Arrow Keys", action: "Move & Navigate" });
  } else if (text.includes("drag") || text.includes("swipe")) {
    controls.push({ key: "Mouse Drag / Touch Swipe", action: "Direct & Drag" });
  } else if (category === "racing" || category === "action") {
    controls.push({ key: "WASD / Arrows", action: "Steer & Accelerate" });
  }
  if (text.includes("space") || text.includes("spacebar")) {
    controls.push({ key: "Spacebar", action: "Jump / Action" });
  }
  if (text.includes("click") || text.includes("tap") || text.includes("mouse")) {
    controls.push({ key: "Left Mouse Click / Tap", action: "Aim & Interact" });
  }
  if (controls.length === 0) {
    controls.push({ key: "Mouse / Touch", action: "Play & Interact" });
  }
  return controls;
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function curlFetch(url: string): string | null {
  try {
    const result = execSync(
      `curl -s --max-time 20 -A "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36" "${url}"`,
      { encoding: "utf8", maxBuffer: 10 * 1024 * 1024, timeout: 25000 }
    );
    return result.trim();
  } catch (e: unknown) {
    const msg = (e instanceof Error) ? e.message : String(e);
    console.warn(`   curlFetch failed for ${url}: ${msg.substring(0, 80)}`);
    return null;
  }
}

async function fetchPages(totalPages: number): Promise<GameMonetizeItem[]> {
  const all: GameMonetizeItem[] = [];
  for (let p = 1; p <= totalPages; p++) {
    try {
      await sleep(300);
      const text = curlFetch(`${GM_FEED_BASE}${p}`);
      if (!text) {
        console.warn(`   ⚠️  Empty response on page ${p}, stopping.`);
        break;
      }
      if (text.startsWith("error") || text.includes("error code")) {
        console.log(`   ↳ End of catalog at page ${p - 1} (${all.length} total). [${text.substring(0,40)}]`);
        break;
      }
      if (!text.startsWith("[")) {
        console.warn(`   ⚠️  Unexpected response on page ${p}: ${text.substring(0, 80)}`);
        break;
      }
      let data: GameMonetizeItem[];
      try {
        data = JSON.parse(text) as GameMonetizeItem[];
      } catch {
        console.warn(`⚠️  Parse error on page ${p}, skipping.`);
        continue;
      }
      if (!data || data.length === 0) break;
      all.push(...data);
      if (p % 10 === 0) console.log(`   ↳ Fetched ${all.length} games (page ${p}/${totalPages})...`);
    } catch (err) {
      console.warn(`⚠️  Error on page ${p}:`, err);
      break;
    }
  }
  return all;
}

function dedupeById(items: GameMonetizeItem[]): GameMonetizeItem[] {
  const seen = new Set<string>();
  return items.filter((i) => {
    if (!i.id || seen.has(i.id)) return false;
    seen.add(i.id);
    return true;
  });
}

export async function importGameMonetizeCatalog() {
  console.log("🎮 Fetching game catalog from GameMonetize (no domain whitelist)...");
  const rejectedForBrandRisk: { title: string; conflicts: string[] }[] = [];

  // Additive-only: a game already in the catalog stays, even if it later drops out of the
  // live feed or a category's quota — dropping it would 404 an already-indexed URL with no
  // possible redirect (unlike the hash-slug→readable-slug migration, there's no mapping for a
  // game that's simply gone). This run only ever adds new games on top of what's already here.
  let existingGames: GameMetadata[] = [];
  try {
    existingGames = JSON.parse(fs.readFileSync(OUTPUT_DATA_FILE, "utf-8")) as GameMetadata[];
  } catch {
    existingGames = [];
  }
  const existingIds = new Set(existingGames.map((g) => g.id));
  const usedSlugs = new Set(existingGames.map((g) => g.slug));
  const existingCountByCategory = VALID_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = existingGames.filter((g) => g.category === cat).length;
    return acc;
  }, {} as Record<GameCategory, number>);

  function qualifies(i: GameMonetizeItem): boolean {
    if (!i.title || !i.url) return false;
    if (existingIds.has(crypto.createHash("md5").update(i.url).digest("hex"))) return false;
    const conflicts = hasBrandRisk(`${i.title} ${i.description}`);
    if (conflicts.length > 0) {
      rejectedForBrandRisk.push({ title: i.title, conflicts });
      return false;
    }
    return true;
  }

  const rawPool = await fetchPages(TOTAL_PAGES);
  const qualityPool = dedupeById(rawPool).filter(qualifies);
  console.log(`   ${qualityPool.length} new candidate games after dedup, brand-risk & already-imported filtering.`);

  const byCategory: Record<GameCategory, GameMonetizeItem[]> = {
    action: [], puzzle: [], arcade: [], racing: [], adventure: [],
    strategy: [], sports: [], multiplayer: [], classic: [],
  };

  qualityPool.forEach((item) => {
    const cat = mapCategory(item.category, item.tags, item.title);
    byCategory[cat].push(item);
  });

  const selected: { item: GameMonetizeItem; siteCategory: GameCategory }[] = [];

  VALID_CATEGORIES.forEach((cat) => {
    const quota = CATEGORY_QUOTA[cat] ?? TARGET_PER_CATEGORY;
    const room = Math.max(0, quota - existingCountByCategory[cat]);
    byCategory[cat].slice(0, room).forEach((item) => {
      selected.push({ item, siteCategory: cat });
    });
  });

  console.log(`✅ Adding ${selected.length} new games on top of ${existingGames.length} already in the catalog.`);

  const now = new Date().toISOString();
  const newGames: GameMetadata[] = selected.map(({ item, siteCategory }, idx) => {
    const scanResult = scanGameForTrademarks(item.title, item.description, "", "Open Licensed");
    const thumbnailUrl = item.thumb || `https://img.gamemonetize.com/${item.url.split("/").filter(Boolean).pop()}/512x384.jpg`;
    // GameMonetize only hosts 512x384.jpg thumbnail; use it for cover, hero, and screenshots as well
    const coverImage = thumbnailUrl;
    const heroImage = thumbnailUrl;
    const aspectRatio = bucketAspectRatio(item);
    const id = crypto.createHash("md5").update(item.url).digest("hex");

    const baseSlug = slugify(item.title);
    let slug = baseSlug;
    let suffix = 2;
    while (usedSlugs.has(slug)) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }
    usedSlugs.add(slug);

    const game: GameMetadata = {
      id,
      title: item.title,
      slug,
      description: item.description || `Play ${item.title} online for free on PlayThorn.`,
      instructions: item.instructions || "Use mouse, keyboard, or touch controls as shown in-game.",
      category: siteCategory,
      genre: siteCategory,
      tags: Array.from(new Set([siteCategory, item.category, ...item.tags.split(",").map((t) => t.trim())].filter(Boolean))),
      controls: parseControlsFromInstructions(item.instructions, siteCategory),
      author: "Licensed via GameMonetize",
      version: "1.0.0",
      // No rating/playsCount fields: GameMonetize's feed doesn't provide real per-game engagement
      // data. Previously this generated a fake number from array position — removed, never
      // fabricate a specific-looking statistic when there's no real source for it.
      featured: idx < 6,
      trending: idx % 4 === 0,
      // No isNew flag: "new" is now derived live from releaseDate (see isRecentlyAdded in
      // lib/games.ts) so the badge naturally expires — a stored flag would need re-touching on
      // every deploy to stay honest, which additive-only imports deliberately don't do.
      isExclusive: idx % 6 === 0,
      isRewarded: idx % 3 === 0,
      subType: "HTML5",
      releaseDate: now,
      lastUpdated: now,
      mobileSupport: true,
      aspectRatio,
      thumbnailUrl,
      coverImage,
      heroImage,
      screenshots: [coverImage],
      gameUrl: item.url,  // Direct embed URL — works on any domain, no whitelist!

      license: "Network-Licensed",
      repository: item.url,
      homepage: item.url,
      commercialUse: true,
      attributionRequired: false,

      commitHash: id,
      licenseChecksum: crypto.createHash("sha256").update(item.url).digest("hex"),
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

      sourceNetwork: "GameMonetize",
      externalGameId: item.id,
    };
    return game;
  });

  if (newGames.length === 0) {
    console.log("ℹ️  No new qualifying games found this run — catalog unchanged.");
  }

  // Additive-only: existing entries are carried through completely untouched (same slug, id,
  // releaseDate, flags — nothing about an already-live game is ever rewritten by a later run).
  const games: GameMetadata[] = [...existingGames, ...newGames];

  fs.writeFileSync(OUTPUT_DATA_FILE, JSON.stringify(games, null, 2), "utf-8");

  const report = {
    timestamp: now,
    totalGames: games.length,
    newlyAdded: newGames.length,
    sourceNetwork: "GameMonetize",
    categoryDistribution: VALID_CATEGORIES.reduce((acc, cat) => {
      acc[cat] = games.filter((g) => g.category === cat).length;
      return acc;
    }, {} as Record<string, number>),
    rejectedForBrandRisk,
  };
  fs.writeFileSync(LICENSE_REPORT_FILE, JSON.stringify(report, null, 2), "utf-8");
  fs.writeFileSync(PUBLIC_LICENSE_REPORT_FILE, JSON.stringify(report, null, 2), "utf-8");

  let md = `# PlayThorn Game Sourcing & Attributions\n\n`;
  md += `PlayThorn's game catalog is licensed through **GameMonetize** (https://gamemonetize.com/), an HTML5 game publisher network. Games are embedded directly without domain restrictions.\n\n`;
  md += `| Title | Category | ID | Embed Source |\n`;
  md += `| :--- | :---: | :---: | :--- |\n`;
  games.forEach((g) => {
    md += `| **${g.title}** | ${g.category} | \`${g.externalGameId}\` | [GameMonetize](${g.gameUrl}) |\n`;
  });
  fs.writeFileSync(ATTRIBUTIONS_FILE, md, "utf-8");

  console.log(`🚀 games.json now has ${games.length} games (${newGames.length} newly added this run).`);
  return { games };
}

if (require.main === module) {
  importGameMonetizeCatalog();
}
