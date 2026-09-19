import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // "standalone" output is only needed for our Docker build (docker/frontend.Dockerfile
  // sets BUILD_STANDALONE=true). Vercel has its own optimized build pipeline and
  // doesn't need — and shouldn't receive — this setting; leaving it on unconditionally
  // caused it to interfere with Vercel's own routing.
  output: process.env.BUILD_STANDALONE === "true" ? "standalone" : undefined,
};

export default nextConfig;
