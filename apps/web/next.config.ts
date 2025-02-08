import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http" as any,
        hostname: "**",
        pathname: "**",
      },
      {
        protocol: "https" as any,
        hostname: "**",
        pathname: "**",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  experimental: {
    externalDir: true,
  },
  transpilePackages: ["@repo/ui"],
};

export default nextConfig;
