import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const gamesPath = path.join(process.cwd(), "src", "data", "games.json");
  const licenseReportPath = path.join(process.cwd(), "src", "data", "license-report.json");
  const assetRegistryPath = path.join(process.cwd(), "src", "data", "ASSET_REGISTRY.json");
  const assetSourcesPath = path.join(process.cwd(), "src", "data", "asset-sources.json");
  const versionPath = path.join(process.cwd(), "src", "data", "compliance-version.json");

  let games = [];
  let licenseReport: any = {};
  let assetRegistry = [];
  let assetSources = [];
  let versionData: any = {};

  try {
    if (fs.existsSync(gamesPath)) games = JSON.parse(fs.readFileSync(gamesPath, "utf-8"));
    if (fs.existsSync(licenseReportPath)) licenseReport = JSON.parse(fs.readFileSync(licenseReportPath, "utf-8"));
    if (fs.existsSync(assetRegistryPath)) assetRegistry = JSON.parse(fs.readFileSync(assetRegistryPath, "utf-8"));
    if (fs.existsSync(assetSourcesPath)) assetSources = JSON.parse(fs.readFileSync(assetSourcesPath, "utf-8"));
    if (fs.existsSync(versionPath)) versionData = JSON.parse(fs.readFileSync(versionPath, "utf-8"));
  } catch (e) {
    console.error("Error building compliance API telemetry response:", e);
  }

  const totalGames = games.length;
  const verifiedGames = games.filter((g: any) => g.trustVerified && g.assetVerificationStatus === "VERIFIED").length;
  const rejectedGames = licenseReport.totalRejected || 0;

  const licenseDistribution = {
    MIT: games.filter((g: any) => g.license === "MIT").length,
    "Apache-2.0": games.filter((g: any) => g.license === "Apache-2.0").length,
    BSD: games.filter((g: any) => g.license.startsWith("BSD")).length,
    ISC: games.filter((g: any) => g.license === "ISC").length,
    Owned: assetSources.filter((s: any) => s.ownershipStatus === "OWNED").length,
  };

  const assetOwnership = {
    totalAssets: assetRegistry.length,
    ownedAssets: assetSources.filter((s: any) => s.ownershipStatus === "OWNED").length,
    thirdPartyAssets: assetSources.filter((s: any) => s.ownershipStatus === "THIRD_PARTY").length,
  };

  const trademarkRisk = {
    LOW: games.filter((g: any) => g.brandRisk === "LOW").length,
    MEDIUM: games.filter((g: any) => g.brandRisk === "MEDIUM").length,
    HIGH: games.filter((g: any) => g.brandRisk === "HIGH").length,
  };

  const commercialReady = {
    ready: games.filter((g: any) => g.commercialReady).length,
    blocked: totalGames - games.filter((g: any) => g.commercialReady).length + rejectedGames,
  };

  return NextResponse.json({
    complianceVersion: versionData.version || "1.0.0",
    auditDate: versionData.auditDate || new Date().toISOString(),
    status: versionData.status || "PASSED",
    telemetry: {
      totalGames,
      verifiedGames,
      rejectedGames,
      licenseDistribution,
      assetOwnership,
      trademarkRisk,
      commercialReady,
    },
  });
}
