import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Vercel invokes this route on its own cron schedule (see vercel.json) with
// `Authorization: Bearer ${CRON_SECRET}` automatically attached — this check
// is what stops a random visitor from hitting the route and burning a deploy.
//
// This endpoint doesn't run the fetch/parse logic directly because Vercel Serverless
// functions are limited in execution time and can't easily execute tsx scripts like
// import-gamemonetize.ts itself; instead it calls the project's Deploy Hook,
// which triggers a full Vercel build. A fresh Vercel build automatically
// re-runs import-gamemonetize against the live GameMonetize feed, exactly like a normal
// git-push deploy.
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const hookUrl = process.env.DEPLOY_HOOK_URL;
  if (!hookUrl) {
    return NextResponse.json({ error: "DEPLOY_HOOK_URL is not configured" }, { status: 500 });
  }

  const hookResponse = await fetch(hookUrl, { method: "POST" });
  if (!hookResponse.ok) {
    const body = await hookResponse.text();
    return NextResponse.json(
      { error: "Deploy hook call failed", status: hookResponse.status, body },
      { status: 502 }
    );
  }

  return NextResponse.json({ status: "ok", triggeredAt: new Date().toISOString() });
}
