// Static export (`output: 'export'`) — incompatible features (do NOT add):
// - Server Actions / "use server"
// - Route Handlers with POST/PUT/DELETE (only GET works)
// - `cookies()` / `headers()` from next/headers
// - middleware.ts
// - ISR / `revalidate`
// - rewrites / redirects / headers config
// - default next/image loader (must keep images.unoptimized: true)
import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  outputFileTracingRoot: path.join(__dirname),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
