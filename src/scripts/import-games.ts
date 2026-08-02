import fs from "fs";
import path from "path";
import { GameMetadata, GameCategory } from "../types/game";

const PUBLIC_GAMES_DIR = path.join(process.cwd(), "public", "games");
const OUTPUT_DATA_FILE = path.join(process.cwd(), "src", "data", "games.json");

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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function generateDefaultThumbnailSvg(title: string, category: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bg-default" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090d16"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="600" height="400" fill="url(#bg-default)"/>
  <circle cx="300" cy="180" r="60" fill="#7c3aed" opacity="0.3" filter="url(#glow)"/>
  <text x="300" y="195" text-anchor="middle" fill="#00f0ff" font-family="system-ui, sans-serif" font-weight="900" font-size="48">🎮</text>
  <text x="300" y="310" text-anchor="middle" fill="#00f0ff" font-family="system-ui, sans-serif" font-weight="900" font-size="28" letter-spacing="2" filter="url(#glow)">${title.toUpperCase()}</text>
  <text x="300" y="340" text-anchor="middle" fill="#a855f7" font-family="system-ui, sans-serif" font-weight="600" font-size="14" letter-spacing="1">${category.toUpperCase()} GAME</text>
</svg>`;
}

function scanAndImportGames() {
  console.log("🎮 [Importer] Scanning public/games directory...");

  if (!fs.existsSync(PUBLIC_GAMES_DIR)) {
    console.error(`❌ [Importer] Directory not found: ${PUBLIC_GAMES_DIR}`);
    process.exit(1);
  }

  const entries = fs.readdirSync(PUBLIC_GAMES_DIR, { withFileTypes: true });
  const gameFolders = entries.filter((entry) => entry.isDirectory());

  const games: GameMetadata[] = [];
  let skippedCount = 0;

  for (const folder of gameFolders) {
    const folderName = folder.name;
    const folderPath = path.join(PUBLIC_GAMES_DIR, folderName);
    const metadataPath = path.join(folderPath, "metadata.json");
    const indexPath = path.join(folderPath, "index.html");

    // Validation 1: Ignore folders without index.html
    if (!fs.existsSync(indexPath)) {
      console.warn(`⚠️ [Importer] Invalid game in "${folderName}": Missing index.html. Skipping.`);
      skippedCount++;
      continue;
    }

    let rawMetadata: any = {};
    if (fs.existsSync(metadataPath)) {
      try {
        const fileContent = fs.readFileSync(metadataPath, "utf-8");
        rawMetadata = JSON.parse(fileContent);
      } catch (err) {
        console.warn(`⚠️ [Importer] Corrupted metadata.json in "${folderName}". Generating fallback.`);
      }
    }

    // Auto-generate Title & Slug
    const title = rawMetadata.title || folderName.replace(/[-_]/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase());
    const slug = rawMetadata.slug || slugify(rawMetadata.id || title);

    // Auto-generate Category
    let category: GameCategory = "arcade";
    if (rawMetadata.category && VALID_CATEGORIES.includes(rawMetadata.category.toLowerCase())) {
      category = rawMetadata.category.toLowerCase() as GameCategory;
    } else if (Array.isArray(rawMetadata.tags)) {
      const match = rawMetadata.tags.find((t: string) => VALID_CATEGORIES.includes(t.toLowerCase() as GameCategory));
      if (match) category = match.toLowerCase() as GameCategory;
    }

    // Thumbnail Auto-Detection / Generation
    let thumbnailUrl = `/games/${folderName}/thumbnail.svg`;
    const webpPath = path.join(folderPath, "thumbnail.webp");
    const pngPath = path.join(folderPath, "thumbnail.png");
    const jpgPath = path.join(folderPath, "thumbnail.jpg");
    const svgPath = path.join(folderPath, "thumbnail.svg");

    if (fs.existsSync(webpPath)) {
      thumbnailUrl = `/games/${folderName}/thumbnail.webp`;
    } else if (fs.existsSync(pngPath)) {
      thumbnailUrl = `/games/${folderName}/thumbnail.png`;
    } else if (fs.existsSync(jpgPath)) {
      thumbnailUrl = `/games/${folderName}/thumbnail.jpg`;
    } else if (fs.existsSync(svgPath)) {
      thumbnailUrl = `/games/${folderName}/thumbnail.svg`;
    } else {
      // Generate thumbnail SVG if missing
      const svgContent = generateDefaultThumbnailSvg(title, category);
      fs.writeFileSync(svgPath, svgContent, "utf-8");
      console.log(`🖼️ [Importer] Auto-generated thumbnail.svg for "${title}"`);
    }

    const game: GameMetadata = {
      id: rawMetadata.id || slug,
      title,
      slug,
      description: rawMetadata.description || `Play ${title} online for free in your browser.`,
      instructions: rawMetadata.instructions || "Use keyboard controls to play.",
      category,
      tags: Array.isArray(rawMetadata.tags) ? rawMetadata.tags : [category],
      controls: Array.isArray(rawMetadata.controls) ? rawMetadata.controls : [{ key: "WASD / Mouse", action: "Play" }],
      author: rawMetadata.author || "GameHub Studios",
      version: rawMetadata.version || "1.0.0",
      rating: typeof rawMetadata.rating === "number" ? Math.min(5, Math.max(1, rawMetadata.rating)) : 4.5,
      playsCount: typeof rawMetadata.playsCount === "number" ? rawMetadata.playsCount : 1200,
      featured: Boolean(rawMetadata.featured),
      trending: Boolean(rawMetadata.trending),
      isNew: Boolean(rawMetadata.isNew),
      releaseDate: rawMetadata.releaseDate || new Date().toISOString().split("T")[0],
      aspectRatio: rawMetadata.aspectRatio || "16/9",
      thumbnailUrl,
      gameUrl: `/games/${folderName}/index.html`,
    };

    games.push(game);
    console.log(`✅ [Importer] Successfully imported "${game.title}" (${game.id}) -> Category: ${game.category}`);
  }

  // Ensure src/data directory exists
  const outputDir = path.dirname(OUTPUT_DATA_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_DATA_FILE, JSON.stringify(games, null, 2), "utf-8");
  console.log(`🚀 [Importer] Done! Total valid games: ${games.length} (Skipped: ${skippedCount}) -> src/data/games.json`);
}

scanAndImportGames();
