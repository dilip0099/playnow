import { NextResponse } from "next/server";
import { getAllGames } from "@/lib/games";
import { SITE_URL } from "@/lib/site";

const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "playthorn2026indexnowkey";

export async function GET() {
  try {
    const games = getAllGames();
    const baseUrl = SITE_URL;
    const hostname = new URL(baseUrl).hostname;

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
      ...games.map((g) => `${baseUrl}/unblocked-games/${g.slug}`),
    ];

    const chunkSize = 500;
    let successCount = 0;

    for (let i = 0; i < urlList.length; i += chunkSize) {
      const chunk = urlList.slice(i, i + chunkSize);
      const payload = {
        host: hostname,
        key: INDEXNOW_KEY,
        keyLocation: `${baseUrl}/${INDEXNOW_KEY}.txt`,
        urlList: chunk,
      };

      const res = await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        successCount += chunk.length;
      }
    }

    return NextResponse.json({
      success: true,
      submittedUrls: urlList.length,
      successfullyIndexed: successCount,
      message: `Successfully submitted ${successCount} / ${urlList.length} URLs to IndexNow engine!`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

