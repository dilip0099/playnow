import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allows dev server access across local network devices (Mobile / Tablet)
  allowedDevOrigins: ["192.168.1.154:3000", "192.168.1.154:3001", "192.168.1.154", "localhost:3000", "localhost:3001"],
};

export default nextConfig;
