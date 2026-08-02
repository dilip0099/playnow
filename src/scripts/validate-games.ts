import fs from "fs";
import path from "path";
import { GameMetadata } from "../types/game";
import { AssetSourceEntry } from "./import-games";

const GAMES_DATA_FILE = path.join(process.cwd(), "src", "data", "games.json");
const ASSET_SOURCES_FILE = path.join(process.cwd(), "src", "data", "asset-sources.json");
const GAME_CREDITS_FILE = path.join(process.cwd(), "GAME_CREDITS.md");
const ASSET_CREDITS_FILE = path.join(process.cwd(), "ASSET_CREDITS.md");

function validateAllGames() {
  console.log("🔍 [Milestone 9.1 Validator] Verifying Independent Game & Asset Provenance...");

  if (!fs.existsSync(GAMES_DATA_FILE)) {
    console.error(`❌ [Validator] Failure: Database ${GAMES_DATA_FILE} does not exist.`);
    process.exit(1);
  }

  if (!fs.existsSync(ASSET_SOURCES_FILE)) {
    console.error(`❌ [Validator] Failure: Asset Source Registry ${ASSET_SOURCES_FILE} does not exist.`);
    process.exit(1);
  }

  if (!fs.existsSync(GAME_CREDITS_FILE)) {
    console.error(`❌ [Validator] Failure: GAME_CREDITS.md missing.`);
    process.exit(1);
  }

  if (!fs.existsSync(ASSET_CREDITS_FILE)) {
    console.error(`❌ [Validator] Failure: ASSET_CREDITS.md missing.`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(GAMES_DATA_FILE, "utf-8");
  let games: GameMetadata[] = [];
  try {
    games = JSON.parse(rawData);
  } catch (err) {
    console.error("❌ [Validator] Failure: Corrupted games.json database.");
    process.exit(1);
  }

  const rawSources = fs.readFileSync(ASSET_SOURCES_FILE, "utf-8");
  let sources: AssetSourceEntry[] = [];
  try {
    sources = JSON.parse(rawSources);
  } catch (err) {
    console.error("❌ [Validator] Failure: Corrupted asset-sources.json database.");
    process.exit(1);
  }

  let failureCount = 0;

  // Validate Independent Asset Creators
  sources.forEach((source, i) => {
    if (!source.creator || !source.sourceURL || !source.license || source.commercialUse !== true) {
      console.error(`  ❌ Invalid Independent Asset Entry #${i + 1} (${source.assetPath}).`);
      failureCount++;
    }
  });

  if (failureCount === 0) {
    console.log(`  ✅ All ${sources.length} Independent Asset Source Records passed validation.`);
  }

  games.forEach((game, index) => {
    console.log(`\nChecking [${index + 1}/${games.length}]: "${game.derivedTitle}" (${game.slug})`);

    // Verify Original Game Source vs Independent Asset Creator
    if (!game.originalAuthor || !game.originalRepository) {
      console.error(`  ❌ Missing original game repository or author metadata.`);
      failureCount++;
    } else {
      console.log(`  ✅ Independent Game Provenance verified (Author: ${game.originalAuthor}, Repo: ${game.originalRepository}).`);
    }
  });

  console.log("\n==================================================");
  if (failureCount > 0) {
    console.error(`❌ [Milestone 9.1 Validator] FAILED! Found ${failureCount} provenance errors.`);
    process.exit(1);
  } else {
    console.log(`✅ [Milestone 9.1 Validator] SUCCESS! All ${games.length} games passed independent game & asset provenance validation.`);
  }
}

validateAllGames();
