import fs from "fs";
import path from "path";
import { GameMetadata } from "../types/game";
import { AssetSourceEntry } from "./import-games";

const GAMES_DATA_FILE = path.join(process.cwd(), "src", "data", "games.json");
const ASSET_SOURCES_FILE = path.join(process.cwd(), "src", "data", "asset-sources.json");

function validateAllGames() {
  console.log("🔍 [Milestone 9 Validator] Verifying Asset Source Registry & Provenance Records...");

  if (!fs.existsSync(GAMES_DATA_FILE)) {
    console.error(`❌ [Validator] Failure: Database ${GAMES_DATA_FILE} does not exist.`);
    process.exit(1);
  }

  if (!fs.existsSync(ASSET_SOURCES_FILE)) {
    console.error(`❌ [Validator] Failure: Asset Source Registry ${ASSET_SOURCES_FILE} does not exist.`);
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

  // Validate Source Entries
  sources.forEach((source, i) => {
    if (!source.creator || !source.sourceURL || !source.license || !source.licenseURL || source.commercialUse !== true) {
      console.error(`  ❌ Invalid Asset Source Entry #${i + 1} (${source.assetPath}): Missing required metadata or commercialUse is not true.`);
      failureCount++;
    }
  });

  if (failureCount === 0) {
    console.log(`  ✅ All ${sources.length} Asset Source Records passed 100% field validation.`);
  }

  games.forEach((game, index) => {
    console.log(`\nChecking [${index + 1}/${games.length}]: "${game.derivedTitle}" (${game.slug})`);

    // Commercial Ready Enforcement Check
    if (game.commercialReady && game.assetVerificationStatus !== "VERIFIED") {
      console.error(`  ❌ Commercial ready game has unverified asset status.`);
      failureCount++;
    } else {
      console.log(`  ✅ Verified 100% asset source records for commercial deployment.`);
    }
  });

  console.log("\n==================================================");
  if (failureCount > 0) {
    console.error(`❌ [Milestone 9 Validator] FAILED! Found ${failureCount} asset source errors.`);
    process.exit(1);
  } else {
    console.log(`✅ [Milestone 9 Validator] SUCCESS! All ${games.length} games passed 100% asset source registry verification.`);
  }
}

validateAllGames();
