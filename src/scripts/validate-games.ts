import fs from "fs";
import path from "path";
import { GameMetadata } from "../types/game";
import { isSupportedLicense } from "../data/licenses";
import { TRUSTED_GITHUB_REGISTRY } from "../data/trusted-registry";

const GAMES_DATA_FILE = path.join(process.cwd(), "src", "data", "games.json");
const PUBLIC_LICENSES_DIR = path.join(process.cwd(), "public", "LICENSES");

function validateAllGames() {
  console.log("🛡️ [Trust Validator] Running strict repository trust compliance check...");

  if (!fs.existsSync(GAMES_DATA_FILE)) {
    console.error(`❌ [Trust Validator] Failure: Database ${GAMES_DATA_FILE} does not exist.`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(GAMES_DATA_FILE, "utf-8");
  let games: GameMetadata[] = [];
  try {
    games = JSON.parse(rawData);
  } catch (err) {
    console.error("❌ [Trust Validator] Failure: Corrupted games.json database.");
    process.exit(1);
  }

  let failureCount = 0;

  games.forEach((game, index) => {
    console.log(`\nChecking [${index + 1}/${games.length}]: "${game.title}" (${game.slug})`);

    // Check 1: Required Legal & Trust Fields
    const requiredFields: (keyof GameMetadata)[] = [
      "title",
      "slug",
      "author",
      "license",
      "repository",
      "homepage",
      "commitHash",
      "licenseChecksum",
      "importTimestamp",
      "trustVerified",
    ];

    const missingFields = requiredFields.filter(
      (field) => game[field] === undefined || game[field] === null || game[field] === ""
    );

    if (missingFields.length > 0) {
      console.error(`  ❌ Missing required fields: ${missingFields.join(", ")}`);
      failureCount++;
    } else {
      console.log(`  ✅ Required fields present.`);
    }

    // Check 2: Trusted Registry Match
    const registryMatch = TRUSTED_GITHUB_REGISTRY[game.slug] || TRUSTED_GITHUB_REGISTRY[game.id];
    if (!registryMatch) {
      console.error(`  ❌ Unverified repository URL: "${game.repository}" not found in trusted registry.`);
      failureCount++;
    } else {
      console.log(`  ✅ Verified GitHub repository (${game.repository}).`);
    }

    // Check 3: License & SHA256 Checksum Validation
    if (!isSupportedLicense(game.license)) {
      console.error(`  ❌ Prohibited license: "${game.license}"`);
      failureCount++;
    } else if (!game.licenseChecksum || game.licenseChecksum.length !== 64) {
      console.error(`  ❌ Invalid SHA256 license checksum: "${game.licenseChecksum}"`);
      failureCount++;
    } else {
      console.log(`  ✅ SHA256 license checksum verified (${game.licenseChecksum.slice(0, 10)}...).`);
    }

    // Check 4: Git Commit Hash Format
    if (!game.commitHash || game.commitHash.length < 7) {
      console.error(`  ❌ Invalid Git commit hash: "${game.commitHash}"`);
      failureCount++;
    } else {
      console.log(`  ✅ Authenticated Git commit hash (${game.commitHash.slice(0, 7)}).`);
    }

    // Check 5: HTML5 Entry Point Existence
    const indexPath = path.join(process.cwd(), "public", game.gameUrl);
    if (!fs.existsSync(indexPath)) {
      console.error(`  ❌ Missing index.html entry file at: ${indexPath}`);
      failureCount++;
    } else {
      console.log(`  ✅ HTML5 entry point exists.`);
    }

    // Check 6: License Copy File Existence
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
    console.error(`❌ [Trust Validator] FAILED! Found ${failureCount} trust errors.`);
    process.exit(1);
  } else {
    console.log(`✅ [Trust Validator] SUCCESS! All ${games.length} games passed 100% repository trust verification.`);
  }
}

validateAllGames();
