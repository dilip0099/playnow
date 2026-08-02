import { Metadata } from "next";
import fs from "fs";
import path from "path";
import { ComplianceDashboardClient } from "./ComplianceDashboardClient";

export const metadata: Metadata = {
  title: "Compliance Dashboard - GameHub Admin",
  description: "Internal legal compliance, asset provenance, trademark risk, and commercial readiness dashboard.",
};

function loadData() {
  const gamesPath = path.join(process.cwd(), "src", "data", "games.json");
  const licenseReportPath = path.join(process.cwd(), "src", "data", "license-report.json");
  const assetRegistryPath = path.join(process.cwd(), "src", "data", "ASSET_REGISTRY.json");
  const assetSourcesPath = path.join(process.cwd(), "src", "data", "asset-sources.json");

  let games = [];
  let licenseReport: any = {};
  let assetRegistry = [];
  let assetSources = [];

  try {
    if (fs.existsSync(gamesPath)) {
      games = JSON.parse(fs.readFileSync(gamesPath, "utf-8"));
    }
    if (fs.existsSync(licenseReportPath)) {
      licenseReport = JSON.parse(fs.readFileSync(licenseReportPath, "utf-8"));
    }
    if (fs.existsSync(assetRegistryPath)) {
      assetRegistry = JSON.parse(fs.readFileSync(assetRegistryPath, "utf-8"));
    }
    if (fs.existsSync(assetSourcesPath)) {
      assetSources = JSON.parse(fs.readFileSync(assetSourcesPath, "utf-8"));
    }
  } catch (e) {
    console.error("Error reading compliance data files:", e);
  }

  return {
    games,
    licenseReport,
    assetRegistry,
    assetSources,
  };
}

export default function CompliancePage() {
  const data = loadData();

  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      <ComplianceDashboardClient initialData={data} />
    </div>
  );
}
