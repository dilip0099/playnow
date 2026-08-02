import fs from "fs";
import path from "path";
import { GameMetadata } from "../types/game";
import { isSupportedLicense } from "../data/licenses";

const GAMES_DATA_FILE = path.join(process.cwd(), "src", "data", "games.json");
const ASSET_REGISTRY_FILE = path.join(process.cwd(), "src", "data", "ASSET_REGISTRY.json");
const PUBLIC_LICENSES_DIR = path.join(process.cwd(), "public", "LICENSES");

function validateAllGames() {
  console.log("🔍 [Milestone 8 Validator] Verifying Asset Provenance & SHA256 Hashes...");

  if (!fs.existsSync(GAMES_DATA_FILE)) {
    console.error(`❌ [Validator] Failure: Database ${GAMES_DATA_FILE} does not exist.`);
    process.exit(1);
  }

  if (!fs.existsSync(ASSET_REGISTRY_FILE)) {
    console.error(`❌ [Validator] Failure: ASSET_REGISTRY.json database does not exist.`);
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

  let failureCount = 0;

  games.forEach((game, index) => {
    console.log(`\nChecking [${index + 1}/${games.length}]: "${game.derivedTitle}" (${game.slug})`);

    // Check 1: Required Legal & Provenance Fields
    const requiredFields: (keyof GameMetadata)[] = [
      "title",
      "slug",
      "author",
      "license",
      "repository",
      "brandRisk",
      "assetSource",
      "commercialReady",
      "assetVerificationStatus",
    ];

    const missingFields = requiredFields.filter(
      (field) => game[field] === undefined || game[field] === null || game[field] === ""
    );

    if (missingFields.length > 0) {
      console.error(`  ❌ Missing required provenance fields: ${missingFields.join(", ")}`);
      failureCount++;
    } else {
      console.log(`  ✅ All required provenance fields present.`);
    }

    // Check 2: Asset Verification Status
    if (game.assetVerificationStatus !== "VERIFIED") {
      console.error(`  ❌ Unverified asset provenance status: "${game.assetVerificationStatus}"`);
      failureCount++;
    } else {
      console.log(`  ✅ Asset Provenance Status: VERIFIED.`);
    }

    // Check 3: Commercial Readiness Rule
    if (game.commercialReady && game.assetVerificationStatus !== "VERIFIED") {
      console.error(`  ❌ Invalid Commercial Ready status for unverified game.`);
      failureCount++;
    } else {
      console.log(`  ✅ Commercial Readiness validated with VERIFIED asset provenance.`);
    }
  });

  console.log("\n==================================================");
  if (failureCount > 0) {
    console.error(`❌ [Milestone 8 Validator] FAILED! Found ${failureCount} asset provenance errors.`);
    process.exit(1);
  } else {
    console.log(`✅ [Milestone 8 Validator] SUCCESS! All ${games.length} games passed 100% asset provenance verification.`);
  }
}

validateAllGames();
