import { NextRequest, NextResponse } from "next/server";

/**
 * Interim gate for /admin/* until real session-based auth exists (see the
 * Roadmap section of the redesign plan). Fails CLOSED: if ADMIN_PASSWORD
 * isn't set, admin routes are blocked rather than left open to the public.
 * Set ADMIN_PASSWORD in the environment to enable access via HTTP Basic Auth.
 */
export function middleware(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return new NextResponse("Admin access is not configured.", { status: 503 });
  }

  const basicAuth = request.headers.get("authorization");
  if (basicAuth?.startsWith("Basic ")) {
    const decoded = Buffer.from(basicAuth.slice(6), "base64").toString();
    const separatorIndex = decoded.indexOf(":");
    const password = separatorIndex >= 0 ? decoded.slice(separatorIndex + 1) : "";
    if (password === adminPassword) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="PlayNow Admin"' },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};
