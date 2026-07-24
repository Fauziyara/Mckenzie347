import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["43.153.223.215", "http://43.153.223.215:3000"],
  devIndicators: false,
  experimental: {
    optimizePackageImports: [
      "@reown/appkit",
      "@reown/appkit/react",
      "wagmi",
      "viem",
      "@tanstack/react-query",
      "lucide-react",
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
};

export default nextConfig;
