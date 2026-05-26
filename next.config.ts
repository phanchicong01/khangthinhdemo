// Static export (`output: 'export'`) — incompatible features (do NOT add):
// - Server Actions / "use server"
// - Route Handlers with POST/PUT/DELETE (only GET works)
// - `cookies()` / `headers()` from next/headers
// - middleware.ts
// - ISR / `revalidate`
// - rewrites / redirects / headers config
// - default next/image loader (must keep images.unoptimized: true)
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
