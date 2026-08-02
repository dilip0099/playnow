import { BrandRiskLevel, AssetSourceType } from "../types/game";

export const PROHIBITED_TRADEMARKS = [
  "TETRIS",
  "PACMAN",
  "PAC-MAN",
  "MARIO",
  "POKEMON",
  "POKÉMON",
  "MINECRAFT",
  "SONIC",
  "ZELDA",
  "FLAPPY BIRD",
  "SPACE INVADERS",
  "SUBWAY SURFERS",
  "TEMPLE RUN",
  "AMONG US",
  "DONKEY KONG",
  "METROID",
  "GTA",
  "CALL OF DUTY",
  "NINTENDO",
  "SEGA",
  "DISNEY",
  "MARVEL",
  "CAPCOM",
  "KONAMI",
  "UBISOFT",
  "MOJANG",
];

export interface TrademarkScanResult {
  brandRisk: BrandRiskLevel;
  assetSource: AssetSourceType;
  commercialReady: boolean;
  conflicts: string[];
  recommendedTitle?: string;
  reason: string;
  actionRequired: string;
}

export function scanGameForTrademarks(
  title: string,
  description: string,
  htmlContent: string,
  assetSourceInput?: AssetSourceType
): TrademarkScanResult {
  const conflicts: string[] = [];
  const textToScan = `${title} ${description} ${htmlContent}`.toUpperCase();

  PROHIBITED_TRADEMARKS.forEach((tm) => {
    // Word boundary regex match to prevent false substring positives
    const regex = new RegExp(`\\b${tm.replace("-", "[\\s-]?")}\\b`, "i");
    if (regex.test(textToScan)) {
      conflicts.push(tm);
    }
  });

  const assetSource: AssetSourceType = assetSourceInput || "Original";
  let brandRisk: BrandRiskLevel = "LOW";
  let commercialReady = true;
  let reason = "Clean asset audit. Zero trademark or brand conflicts detected.";
  let actionRequired = "None. Safe for commercial deployment.";

  if (conflicts.length > 0) {
    brandRisk = "HIGH";
    commercialReady = false;
    reason = `Potential trademark conflict detected with commercial brand(s): ${conflicts.join(", ")}.`;
    actionRequired = `Rename game title and remove trademarked keywords to achieve LOW risk status.`;
  } else if (assetSource === "Unknown") {
    brandRisk = "HIGH";
    commercialReady = false;
    reason = "Asset provenance is unverified or unknown.";
    actionRequired = "Audit asset licenses or replace with original vector art.";
  }

  return {
    brandRisk,
    assetSource,
    commercialReady,
    conflicts,
    reason,
    actionRequired,
  };
}
