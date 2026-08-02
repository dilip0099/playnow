import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  const analyticsPath = path.join(process.cwd(), "src", "data", "analytics.json");
  let analyticsData: any = {};

  try {
    if (fs.existsSync(analyticsPath)) {
      analyticsData = JSON.parse(fs.readFileSync(analyticsPath, "utf-8"));
    }
  } catch (e) {
    console.error("Error reading analytics.json:", e);
  }

  return NextResponse.json({
    status: "SUCCESS",
    timestamp: new Date().toISOString(),
    analytics: analyticsData,
  });
}
