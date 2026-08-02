import fs from "fs";
import path from "path";
import { GameMetadata } from "../types/game";
import { isSupportedLicense } from "../data/licenses";

const GAMES_DATA_FILE = path.join(process.cwd(), "src", "data", "games.json");
const PUBLIC_LICENSES_DIR = path.join(process.cwd(), "public", "LICENSES");

function validateAllGames() {
  console.log("🔍 [Milestone 7 Validator] Verifying Asset & Trademark Compliance...");

  if (!fs.existsSync(GAMES_DATA_FILE)) {
    console.error(`❌ [Validator] Failure: Database ${GAMES_DATA_FILE} does not exist.`);
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

    // Check 1: Required Legal & Compliance Fields
    const requiredFields: (keyof GameMetadata)[] = [
      "title",
      "slug",
      "author",
      "license",
      "repository",
      "brandRisk",
      "assetSource",
      "commercialReady",
    ];

    const missingFields = requiredFields.filter(
      (field) => game[field] === undefined || game[field] === null || game[field] === ""
    );

    if (missingFields.length > 0) {
      console.error(`  ❌ Missing required compliance fields: ${missingFields.join(", ")}`);
      failureCount++;
    } else {
      console.log(`  ✅ All required compliance fields present.`);
    }

    // Check 2: Brand Risk Check
    if (game.brandRisk !== "LOW") {
      console.error(`  ❌ High or Medium Brand Risk detected: "${game.brandRisk}"`);
      failureCount++;
    } else {
      console.log(`  ✅ Brand Risk Level: LOW.`);
    }

    // Check 3: Asset Source Check
    if (game.assetSource === "Unknown") {
      console.error(`  ❌ Unverified asset source: "${game.assetSource}"`);
      failureCount++;
    } else {
      console.log(`  ✅ Asset Source verified (${game.assetSource}).`);
    }

    // Check 4: Commercial Readiness Check
    if (!game.commercialReady) {
      console.error(`  ❌ Game is not commercial ready.`);
      failureCount++;
    } else {
      console.log(`  ✅ Commercial Readiness verified (commercialReady: true).`);
    }
  });

  console.log("\n==================================================");
  if (failureCount > 0) {
    console.error(`❌ [Milestone 7 Validator] FAILED! Found ${failureCount} trademark compliance errors.`);
    process.exit(1);
  } else {
    console.log(`✅ [Milestone 7 Validator] SUCCESS! All ${games.length} games passed 100% asset & trademark compliance checks.`);
  }
}

validateAllGames();
