import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // All game artwork (thumbnails, covers, hero images, screenshots) comes from GamePix's
    // CDN — see higherResImage() in src/scripts/import-gamepix.ts.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.gamepix.com",
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
