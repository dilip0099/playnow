import fs from "fs";
import path from "path";
import { GameMetadata } from "../types/game";
import { isSupportedLicense } from "../data/licenses";

const GAMES_DATA_FILE = path.join(process.cwd(), "src", "data", "games.json");
const PUBLIC_LICENSES_DIR = path.join(process.cwd(), "public", "LICENSES");

function validateAllGames() {
  console.log("🛠️ [Milestone 6 Validator] Verifying original vs derived game metadata...");

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

    // Check 1: Required Legal & Derived Metadata Fields
    const requiredFields: (keyof GameMetadata)[] = [
      "title",
      "slug",
      "author",
      "license",
      "repository",
      "gameType",
      "originalRepository",
      "originalAuthor",
      "originalLicense",
      "derivedTitle",
      "modifications",
      "originalCommitHash",
    ];

    const missingFields = requiredFields.filter(
      (field) => game[field] === undefined || game[field] === null || game[field] === ""
    );

    if (missingFields.length > 0) {
      console.error(`  ❌ Missing required fields: ${missingFields.join(", ")}`);
      failureCount++;
    } else {
      console.log(`  ✅ Required original and derived metadata fields present.`);
    }

    // Check 2: Classification Check
    if (game.gameType !== "Original Game" && game.gameType !== "Derived Game") {
      console.error(`  ❌ Invalid game classification: "${game.gameType}"`);
      failureCount++;
    } else {
      console.log(`  ✅ Game Classification: ${game.gameType}`);
    }

    // Check 3: Modifications Array Check
    if (game.gameType === "Derived Game" && (!Array.isArray(game.modifications) || game.modifications.length === 0)) {
      console.error(`  ❌ Derived game "${game.derivedTitle}" is missing modifications list.`);
      failureCount++;
    } else {
      console.log(`  ✅ Modifications changelog logged (${game.modifications.length} modifications).`);
    }

    // Check 4: Original Repository Preservation
    if (!game.originalRepository.startsWith("https://github.com/")) {
      console.error(`  ❌ Original repository URL "${game.originalRepository}" is invalid.`);
      failureCount++;
    } else {
      console.log(`  ✅ Original repository preserved: ${game.originalRepository}`);
    }

    // Check 5: License & Entry Point Checks
    if (!isSupportedLicense(game.originalLicense)) {
      console.error(`  ❌ Unsupported original license: "${game.originalLicense}"`);
      failureCount++;
    } else {
      console.log(`  ✅ Verified original license (${game.originalLicense}).`);
    }
  });

  console.log("\n==================================================");
  if (failureCount > 0) {
    console.error(`❌ [Milestone 6 Validator] FAILED! Found ${failureCount} metadata errors.`);
    process.exit(1);
  } else {
    console.log(`✅ [Milestone 6 Validator] SUCCESS! All ${games.length} games passed original/derived metadata verification.`);
  }
}

validateAllGames();
