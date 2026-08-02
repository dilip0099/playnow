import fs from "fs";
import path from "path";
import { GameMetadata } from "../types/game";
import { AssetSourceEntry } from "./import-games";

const GAMES_DATA_FILE = path.join(process.cwd(), "src", "data", "games.json");
const ASSET_SOURCES_FILE = path.join(process.cwd(), "src", "data", "asset-sources.json");
const ASSET_LICENSE_AUDIT_FILE = path.join(process.cwd(), "ASSET_LICENSE_AUDIT.md");

function validateAllGames() {
  console.log("🔍 [Milestone 9.2 Validator] Verifying Production Asset Licensing Cleanup...");

  if (!fs.existsSync(GAMES_DATA_FILE)) {
    console.error(`❌ [Validator] Failure: Database ${GAMES_DATA_FILE} does not exist.`);
    process.exit(1);
  }

  if (!fs.existsSync(ASSET_SOURCES_FILE)) {
    console.error(`❌ [Validator] Failure: Asset Source Registry ${ASSET_SOURCES_FILE} does not exist.`);
    process.exit(1);
  }

  if (!fs.existsSync(ASSET_LICENSE_AUDIT_FILE)) {
    console.error(`❌ [Validator] Failure: ASSET_LICENSE_AUDIT.md missing.`);
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

  // Validate Zero Placeholder URLs & Licensing Types
  sources.forEach((source, i) => {
    if (
      !source.creator ||
      !source.sourceURL ||
      source.sourceURL.includes(".local") ||
      !source.license ||
      source.commercialUse !== true
    ) {
      console.error(`  ❌ Invalid Asset Source Entry #${i + 1} (${source.assetPath}): Contains placeholder URL or missing licensing data.`);
      failureCount++;
    }
  });

  if (failureCount === 0) {
    console.log(`  ✅ All ${sources.length} Asset Source Records passed production licensing cleanup (zero placeholder URLs).`);
  }

  games.forEach((game, index) => {
    console.log(`\nChecking [${index + 1}/${games.length}]: "${game.derivedTitle}" (${game.slug})`);

    if (!game.commercialReady || game.assetVerificationStatus !== "VERIFIED") {
      console.error(`  ❌ Game failed commercial readiness or asset verification.`);
      failureCount++;
    } else {
      console.log(`  ✅ Production Asset Licensing Cleanup verified (commercialReady: true).`);
    }
  });

  console.log("\n==================================================");
  if (failureCount > 0) {
    console.error(`❌ [Milestone 9.2 Validator] FAILED! Found ${failureCount} licensing errors.`);
    process.exit(1);
  } else {
    console.log(`✅ [Milestone 9.2 Validator] SUCCESS! All ${games.length} games passed production asset licensing cleanup verification.`);
  }
}

validateAllGames();
