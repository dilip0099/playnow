import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // All game artwork (thumbnails, covers, hero images, screenshots) comes from GameDistribution's
    // CDN — see src/scripts/import-gamedistribution.ts.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.gamedistribution.com",
      },
      {
        protocol: "https",
        hostname: "html5.gamedistribution.com",
      },
    ],
  },
  async redirects() {
    return [
      // The Vercel-issued subdomain still resolves and serves the same deployment as
      // playthorn.com now that a real domain is connected — without this, Google would see
      // identical content under two hosts (duplicate content), and it's the exact URL this
      // site was indexed under before the domain migration.
      {
        source: "/:path*",
        has: [{ type: "host", value: "playnow-eta.vercel.app" }],
        destination: "https://playthorn.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
