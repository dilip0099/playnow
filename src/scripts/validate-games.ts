import fs from "fs";
import path from "path";
import { GameMetadata } from "../types/game";
import { isSupportedLicense } from "../data/licenses";

const GAMES_DATA_FILE = path.join(process.cwd(), "src", "data", "games.json");
const PUBLIC_LICENSES_DIR = path.join(process.cwd(), "public", "LICENSES");

function validateAllGames() {
  console.log("🔍 [Legal Validator] Running strict compliance validation check...");

  if (!fs.existsSync(GAMES_DATA_FILE)) {
    console.error(`❌ [Legal Validator] Failure: Database ${GAMES_DATA_FILE} does not exist.`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(GAMES_DATA_FILE, "utf-8");
  let games: GameMetadata[] = [];
  try {
    games = JSON.parse(rawData);
  } catch (err) {
    console.error("❌ [Legal Validator] Failure: Corrupted games.json database.");
    process.exit(1);
  }

  if (games.length === 0) {
    console.warn("⚠️ [Legal Validator] Warning: 0 games found in database.");
  }

  let failureCount = 0;

  games.forEach((game, index) => {
    console.log(`\nChecking [${index + 1}/${games.length}]: "${game.title}" (${game.slug})`);

    // Check 1: Required Legal Fields
    const requiredFields: (keyof GameMetadata)[] = [
      "title",
      "slug",
      "author",
      "license",
      "repository",
      "homepage",
      "thumbnailUrl",
      "category",
      "commercialUse",
      "attributionRequired",
    ];

    const missingFields = requiredFields.filter((field) => game[field] === undefined || game[field] === null || game[field] === "");

    if (missingFields.length > 0) {
      console.error(`  ❌ Missing required fields: ${missingFields.join(", ")}`);
      failureCount++;
    } else {
      console.log(`  ✅ Required fields present.`);
    }

    // Check 2: License Validation
    if (!isSupportedLicense(game.license)) {
      console.error(`  ❌ Unsupported or prohibited license: "${game.license}"`);
      failureCount++;
    } else {
      console.log(`  ✅ Permissive license verified (${game.license}).`);
    }

    // Check 3: HTML5 Entry Point Existence
    const indexPath = path.join(process.cwd(), "public", game.gameUrl);
    if (!fs.existsSync(indexPath)) {
      console.error(`  ❌ Missing index.html entry file at: ${indexPath}`);
      failureCount++;
    } else {
      console.log(`  ✅ HTML5 entry point exists.`);
    }

    // Check 4: License Copy File Existence
    const licFilePath = path.join(PUBLIC_LICENSES_DIR, `${game.slug}-LICENSE.txt`);
    if (!fs.existsSync(licFilePath)) {
      console.error(`  ❌ Missing legal LICENSE copy file at: ${licFilePath}`);
      failureCount++;
    } else {
      console.log(`  ✅ Legal LICENSE copy file exists.`);
    }
  });

  console.log("\n==================================================");
  if (failureCount > 0) {
    console.error(`❌ [Legal Validator] FAILED! Found ${failureCount} validation errors.`);
    process.exit(1);
  } else {
    console.log(`✅ [Legal Validator] SUCCESS! All ${games.length} games passed 100% legal compliance validation.`);
  }
}

validateAllGames();
