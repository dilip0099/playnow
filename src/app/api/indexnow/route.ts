import { NextResponse } from "next/server";
import { getAllGames } from "@/lib/games";
import { SITE_URL } from "@/lib/site";

const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "playthorn2026indexnowkey";

export async function GET() {
  try {
    const games = getAllGames();
    const baseUrl = SITE_URL;

    // Collect all URLs to ping
    const urlList: string[] = [
      baseUrl,
      `${baseUrl}/unblocked-games`,
      `${baseUrl}/search`,
      `${baseUrl}/about`,
      ...["action", "puzzle", "arcade", "racing", "adventure", "strategy", "sports", "multiplayer", "classic"].map(
        (c) => `${baseUrl}/category/${c}`
      ),
      ...games.map((g) => `${baseUrl}/game/${g.slug}`),
    ];

    // Prepare IndexNow Payload
    const payload = {
      host: "playthorn.com",
      key: INDEXNOW_KEY,
      keyLocation: `${baseUrl}/${INDEXNOW_KEY}.txt`,
      urlList: urlList.slice(0, 1000), // Max 10,000 URLs per submit
    };

    // Ping Bing IndexNow endpoint
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      submittedUrls: urlList.length,
      message: response.ok
        ? "Successfully submitted all URLs to IndexNow engine!"
        : "IndexNow submission failed",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
