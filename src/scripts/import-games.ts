import fs from "fs";
import path from "path";
import { GameMetadata } from "../types/game";

const PUBLIC_GAMES_DIR = path.join(process.cwd(), "public", "games");
const OUTPUT_DATA_FILE = path.join(process.cwd(), "src", "data", "games.json");

function scanAndImportGames() {
  console.log("🎮 [Importer] Scanning public/games directory...");

  if (!fs.existsSync(PUBLIC_GAMES_DIR)) {
    console.error(`❌ [Importer] Directory not found: ${PUBLIC_GAMES_DIR}`);
    process.exit(1);
  }

  const entries = fs.readdirSync(PUBLIC_GAMES_DIR, { withFileTypes: true });
  const gameFolders = entries.filter((entry) => entry.isDirectory());

  const games: GameMetadata[] = [];

  for (const folder of gameFolders) {
    const folderName = folder.name;
    const folderPath = path.join(PUBLIC_GAMES_DIR, folderName);
    const metadataPath = path.join(folderPath, "metadata.json");
    const indexPath = path.join(folderPath, "index.html");

    if (!fs.existsSync(indexPath)) {
      console.warn(`⚠️ [Importer] Skipping ${folderName}: index.html missing.`);
      continue;
    }

    if (!fs.existsSync(metadataPath)) {
      console.warn(`⚠️ [Importer] Skipping ${folderName}: metadata.json missing.`);
      continue;
    }

    try {
      const rawMetadata = fs.readFileSync(metadataPath, "utf-8");
      const metadata = JSON.parse(rawMetadata);

      // Determine thumbnail path
      let thumbnailUrl = `/games/${folderName}/thumbnail.svg`;
      if (fs.existsSync(path.join(folderPath, "thumbnail.webp"))) {
        thumbnailUrl = `/games/${folderName}/thumbnail.webp`;
      } else if (fs.existsSync(path.join(folderPath, "thumbnail.png"))) {
        thumbnailUrl = `/games/${folderName}/thumbnail.png`;
      }

      const game: GameMetadata = {
        id: metadata.id || folderName,
        title: metadata.title || folderName,
        slug: metadata.slug || folderName,
        description: metadata.description || "No description provided.",
        instructions: metadata.instructions || "",
        category: metadata.category || "arcade",
        tags: metadata.tags || [],
        controls: metadata.controls || [],
        author: metadata.author || "Unknown Developer",
        version: metadata.version || "1.0.0",
        rating: metadata.rating ?? 4.5,
        playsCount: metadata.playsCount ?? 1000,
        featured: metadata.featured ?? false,
        trending: metadata.trending ?? false,
        isNew: metadata.isNew ?? false,
        releaseDate: metadata.releaseDate || new Date().toISOString().split("T")[0],
        aspectRatio: metadata.aspectRatio || "16/9",
        thumbnailUrl,
        gameUrl: `/games/${folderName}/index.html`,
      };

      games.push(game);
      console.log(`✅ [Importer] Imported "${game.title}" (${game.id})`);
    } catch (err) {
      console.error(`❌ [Importer] Error parsing metadata for ${folderName}:`, err);
    }
  }

  // Ensure src/data directory exists
  const outputDir = path.dirname(OUTPUT_DATA_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_DATA_FILE, JSON.stringify(games, null, 2), "utf-8");
  console.log(`🚀 [Importer] Successfully generated database: ${games.length} games -> src/data/games.json`);
}

scanAndImportGames();
