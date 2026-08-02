import fs from "fs";
import path from "path";

const PUBLIC_GAMES_DIR = path.join(process.cwd(), "public", "games");
const PUBLIC_LICENSES_DIR = path.join(process.cwd(), "public", "LICENSES");

const BATCH_1_SLUGS = [
  "neon-snake",
  "cosmic-defense",
  "pixel-memory",
  "2048-fusion",
  "retro-tetris",
  "breakout-pulse",
  "cyber-runner",
  "pong-championship",
  "tic-tac-toe-glow",
  "tower-builder",
];

function keepOnlyBatch1() {
  console.log("🧹 Filtering public/games/ and public/LICENSES/ down to Batch 1 (10 games)...");

  // Clean games
  const entries = fs.readdirSync(PUBLIC_GAMES_DIR, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory() && !BATCH_1_SLUGS.includes(entry.name)) {
      const targetDir = path.join(PUBLIC_GAMES_DIR, entry.name);
      fs.rmSync(targetDir, { recursive: true, force: true });
      console.log(`🗑️ Removed game outside Batch 1: ${entry.name}`);
    }
  }

  // Clean licenses
  if (fs.existsSync(PUBLIC_LICENSES_DIR)) {
    const licFiles = fs.readdirSync(PUBLIC_LICENSES_DIR);
    for (const file of licFiles) {
      const match = BATCH_1_SLUGS.some((slug) => file.startsWith(`${slug}-LICENSE`));
      if (!match) {
        fs.unlinkSync(path.join(PUBLIC_LICENSES_DIR, file));
        console.log(`🗑️ Removed license file outside Batch 1: ${file}`);
      }
    }
  }

  console.log("✅ Batch 1 isolation complete (10 verified LOW RISK games).");
}

keepOnlyBatch1();
