// Vercel SSR mode (v2.0) — switched from static export 2026-05-30.
// Now ENABLED (previously blocked by output: 'export'):
// - middleware.ts (i18n locale routing — Phase 16)
// - app/api/*/route.ts with POST (quote form — Phase 14)
// - next/image optimization
// - ISR / streaming / dynamic rendering
import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export' REMOVED — deploy as SSR app on Vercel.
  outputFileTracingRoot: path.join(__dirname),
  // Keep trailingSlash for URL consistency with v1.0 (sitemap, existing links).
  trailingSlash: true,
  images: {
    // Optimization ON (was unoptimized under static export).
    // remotePatterns added later if external image hosts are used.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
