import type { NextConfig } from "next";

// GitHub Pages hosts this repository below /Algorithm-Tracker.
// Keep the base path off during local development.
const isGitHubActions = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isGitHubActions ? "/Algorithm-Tracker" : undefined,
  images: {
    unoptimized: true,
  },
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
