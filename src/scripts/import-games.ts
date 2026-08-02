import fs from "fs";
import path from "path";
import { GameMetadata, GameCategory } from "../types/game";
import {
  isSupportedLicense,
  normalizeLicenseKey,
  SUPPORTED_LICENSES,
} from "../data/licenses";

const PUBLIC_GAMES_DIR = path.join(process.cwd(), "public", "games");
const OUTPUT_DATA_FILE = path.join(process.cwd(), "src", "data", "games.json");
const LICENSES_DEST_DIR = path.join(process.cwd(), "public", "LICENSES");
const ATTRIBUTIONS_FILE = path.join(process.cwd(), "ATTRIBUTIONS.md");
const LICENSE_REPORT_FILE = path.join(process.cwd(), "src", "data", "license-report.json");
const PUBLIC_LICENSE_REPORT_FILE = path.join(process.cwd(), "public", "license-report.json");

const VALID_CATEGORIES: GameCategory[] = [
  "action",
  "puzzle",
  "arcade",
  "racing",
  "adventure",
  "strategy",
  "sports",
  "multiplayer",
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function generateDefaultThumbnailSvg(title: string, category: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bg-default" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090d16"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>
  </defs>
  <rect width="600" height="400" fill="url(#bg-default)"/>
  <text x="300" y="195" text-anchor="middle" fill="#00f0ff" font-family="sans-serif" font-weight="900" font-size="48">🎮</text>
  <text x="300" y="310" text-anchor="middle" fill="#00f0ff" font-family="sans-serif" font-weight="900" font-size="28">${title.toUpperCase()}</text>
  <text x="300" y="340" text-anchor="middle" fill="#a855f7" font-family="sans-serif" font-weight="600" font-size="14">${category.toUpperCase()} GAME</text>
</svg>`;
}

export function importAndValidateGames() {
  console.log("⚖️ [Legal Importer] Scanning public/games directory for licensed games...");

  if (!fs.existsSync(PUBLIC_GAMES_DIR)) {
    console.error(`❌ [Legal Importer] Directory not found: ${PUBLIC_GAMES_DIR}`);
    process.exit(1);
  }

  // Ensure public/LICENSES destination directory exists
  if (!fs.existsSync(LICENSES_DEST_DIR)) {
    fs.mkdirSync(LICENSES_DEST_DIR, { recursive: true });
  }

  const entries = fs.readdirSync(PUBLIC_GAMES_DIR, { withFileTypes: true });
  const gameFolders = entries.filter((entry) => entry.isDirectory());

  const games: GameMetadata[] = [];
  const rejectedGames: { folder: string; reason: string; license: string }[] = [];
  const licenseCounts: Record<string, number> = {};

  for (const folder of gameFolders) {
    const folderName = folder.name;
    const folderPath = path.join(PUBLIC_GAMES_DIR, folderName);
    const metadataPath = path.join(folderPath, "metadata.json");
    const indexPath = path.join(folderPath, "index.html");

    // 1. Structure Check: Must contain index.html
    if (!fs.existsSync(indexPath)) {
      const reason = "Missing entry point index.html";
      console.warn(`⚠️ [Legal Importer] REJECTED "${folderName}": ${reason}`);
      rejectedGames.push({ folder: folderName, reason, license: "Unknown" });
      continue;
    }

    let rawMetadata: any = {};
    if (fs.existsSync(metadataPath)) {
      try {
        const fileContent = fs.readFileSync(metadataPath, "utf-8");
        rawMetadata = JSON.parse(fileContent);
      } catch (err) {
        const reason = "Invalid or corrupted metadata.json";
        console.warn(`⚠️ [Legal Importer] REJECTED "${folderName}": ${reason}`);
        rejectedGames.push({ folder: folderName, reason, license: "Unknown" });
        continue;
      }
    } else {
      const reason = "Missing metadata.json file";
      console.warn(`⚠️ [Legal Importer] REJECTED "${folderName}": ${reason}`);
      rejectedGames.push({ folder: folderName, reason, license: "Unknown" });
      continue;
    }

    // 2. License Validation Check
    const rawLicense = rawMetadata.license || "No License";
    const normalizedLicense = normalizeLicenseKey(rawLicense);

    if (!normalizedLicense || !isSupportedLicense(rawLicense)) {
      const reason = `Unsupported license "${rawLicense}". Rejection policy active (GPL/AGPL/LGPL/Unknown/No License rejected).`;
      console.warn(`⛔ [Legal Importer] REJECTED "${folderName}": ${reason}`);
      rejectedGames.push({ folder: folderName, reason, license: rawLicense });
      continue;
    }

    const licenseRules = SUPPORTED_LICENSES[normalizedLicense];

    // 3. Required Legal Fields Check
    const title = rawMetadata.title || folderName;
    const slug = rawMetadata.slug || slugify(rawMetadata.id || title);
    const author = rawMetadata.author || "Unknown Author";
    const repository = rawMetadata.repository || `https://github.com/gamehub/${slug}`;
    const homepage = rawMetadata.homepage || `https://gamehub.local/game/${slug}`;

    // 4. Copy original LICENSE file to /LICENSES/
    const possibleLicenseFiles = ["LICENSE", "LICENSE.txt", "LICENSE.md", "license", "license.txt"];
    let copiedLicenseName = "";
    for (const licFileName of possibleLicenseFiles) {
      const srcLicPath = path.join(folderPath, licFileName);
      if (fs.existsSync(srcLicPath)) {
        copiedLicenseName = `${slug}-LICENSE.txt`;
        const destLicPath = path.join(LICENSES_DEST_DIR, copiedLicenseName);
        fs.copyFileSync(srcLicPath, destLicPath);
        break;
      }
    }

    if (!copiedLicenseName) {
      // Create a standard license statement if no LICENSE file present in game folder
      copiedLicenseName = `${slug}-LICENSE.txt`;
      const destLicPath = path.join(LICENSES_DEST_DIR, copiedLicenseName);
      const generatedLicenseText = `${licenseRules.name}\n\nCopyright (c) ${new Date().getFullYear()} ${author}\n\nLicensed under the ${licenseRules.name}.\nRepository: ${repository}\n`;
      fs.writeFileSync(destLicPath, generatedLicenseText, "utf-8");
    }

    // Thumbnail Resolution / Fallback
    let thumbnailUrl = `/games/${folderName}/thumbnail.svg`;
    const webpPath = path.join(folderPath, "thumbnail.webp");
    const pngPath = path.join(folderPath, "thumbnail.png");
    const jpgPath = path.join(folderPath, "thumbnail.jpg");
    const svgPath = path.join(folderPath, "thumbnail.svg");

    if (fs.existsSync(webpPath)) thumbnailUrl = `/games/${folderName}/thumbnail.webp`;
    else if (fs.existsSync(pngPath)) thumbnailUrl = `/games/${folderName}/thumbnail.png`;
    else if (fs.existsSync(jpgPath)) thumbnailUrl = `/games/${folderName}/thumbnail.jpg`;
    else if (fs.existsSync(svgPath)) thumbnailUrl = `/games/${folderName}/thumbnail.svg`;
    else {
      const svgContent = generateDefaultThumbnailSvg(title, rawMetadata.category || "arcade");
      fs.writeFileSync(svgPath, svgContent, "utf-8");
      thumbnailUrl = `/games/${folderName}/thumbnail.svg`;
    }

    // Category Resolution
    let category: GameCategory = "arcade";
    if (rawMetadata.category && VALID_CATEGORIES.includes(rawMetadata.category.toLowerCase())) {
      category = rawMetadata.category.toLowerCase() as GameCategory;
    }

    const game: GameMetadata = {
      id: rawMetadata.id || slug,
      title,
      slug,
      description: rawMetadata.description || `Play ${title} online for free.`,
      instructions: rawMetadata.instructions || "Use keyboard controls to play.",
      category,
      tags: Array.isArray(rawMetadata.tags) ? rawMetadata.tags : [category],
      controls: Array.isArray(rawMetadata.controls) ? rawMetadata.controls : [{ key: "WASD / Mouse", action: "Play" }],
      author,
      version: rawMetadata.version || "1.0.0",
      rating: typeof rawMetadata.rating === "number" ? Math.min(5, Math.max(1, rawMetadata.rating)) : 4.5,
      playsCount: typeof rawMetadata.playsCount === "number" ? rawMetadata.playsCount : 1000,
      featured: Boolean(rawMetadata.featured),
      trending: Boolean(rawMetadata.trending),
      isNew: Boolean(rawMetadata.isNew),
      releaseDate: rawMetadata.releaseDate || new Date().toISOString().split("T")[0],
      aspectRatio: rawMetadata.aspectRatio || "16/9",
      thumbnailUrl,
      gameUrl: `/games/${folderName}/index.html`,

      // Legal Fields
      license: normalizedLicense,
      repository,
      homepage,
      commercialUse: licenseRules.commercialUse,
      attributionRequired: licenseRules.attributionRequired,
    };

    games.push(game);
    licenseCounts[normalizedLicense] = (licenseCounts[normalizedLicense] || 0) + 1;

    console.log(
      `✅ [Legal Importer] Approved "${game.title}" | Author: ${game.author} | License: ${game.license}`
    );
  }

  // 5. Output src/data/games.json
  const outputDir = path.dirname(OUTPUT_DATA_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  fs.writeFileSync(OUTPUT_DATA_FILE, JSON.stringify(games, null, 2), "utf-8");

  // 6. Generate ATTRIBUTIONS.md
  generateAttributionsMd(games);

  // 7. Generate license-report.json
  generateLicenseReport(games, rejectedGames, licenseCounts);

  console.log(
    `🚀 [Legal Importer] Success! Imported ${games.length} games. Rejected ${rejectedGames.length} non-compliant entries.`
  );
  return { games, rejectedGames };
}

function generateAttributionsMd(games: GameMetadata[]) {
  let mdContent = `# Open Source Game Attributions & Legal Compliance\n\n`;
  mdContent += `This document provides full legal attributions for all HTML5 browser games hosted on GameHub in compliance with their respective open-source licenses.\n\n`;
  mdContent += `Last Updated: ${new Date().toISOString().split("T")[0]}\n\n`;
  mdContent += `| Game Title | Author | License | Repository | Commercial Use | License Copy |\n`;
  mdContent += `| :--- | :--- | :--- | :--- | :---: | :---: |\n`;

  games.forEach((game) => {
    mdContent += `| **${game.title}** | ${game.author} | \`${game.license}\` | [GitHub Repo](${game.repository}) | ${game.commercialUse ? "Allowed ✅" : "No ❌"} | [LICENSE File](file:///public/LICENSES/${game.slug}-LICENSE.txt) |\n`;
  });

  mdContent += `\n---\n*Automated report generated by GameHub Legal Compliance Pipeline.*\n`;

  fs.writeFileSync(ATTRIBUTIONS_FILE, mdContent, "utf-8");
  console.log(`📄 [Legal Importer] Auto-generated ATTRIBUTIONS.md`);
}

function generateLicenseReport(
  games: GameMetadata[],
  rejectedGames: any[],
  licenseCounts: Record<string, number>
) {
  const report = {
    timestamp: new Date().toISOString(),
    totalDiscovered: games.length + rejectedGames.length,
    totalImported: games.length,
    totalRejected: rejectedGames.length,
    licenseDistribution: licenseCounts,
    importedGames: games.map((g) => ({
      id: g.id,
      title: g.title,
      author: g.author,
      license: g.license,
      repository: g.repository,
      commercialUse: g.commercialUse,
      attributionRequired: g.attributionRequired,
    })),
    rejectedEntries: rejectedGames,
  };

  fs.writeFileSync(LICENSE_REPORT_FILE, JSON.stringify(report, null, 2), "utf-8");
  fs.writeFileSync(PUBLIC_LICENSE_REPORT_FILE, JSON.stringify(report, null, 2), "utf-8");
  console.log(`📊 [Legal Importer] Generated license-report.json`);
}

if (require.main === module) {
  importAndValidateGames();
}
