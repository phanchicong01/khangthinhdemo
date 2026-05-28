// SEO-02 — robots.txt emitted at build time.
//
// Next 15 file convention: `app/robots.ts` exporting default function returning
// MetadataRoute.Robots is statically optimized under `output: 'export'` and emits
// `out/robots.txt`. No runtime/server involvement.
//
// Pitfall #10 mitigation: sitemap URL + host are built from `siteUrl` — NEVER
// hardcode the domain here.
//
// Per CONTEXT D-28..D-30:
//   - Single allow-all rule (site has no admin/preview surfaces under static export)
//   - sitemap field references the sitemap.ts output URL (single string, NOT array)
//   - host field signals canonical host to legacy crawlers (Yandex etc.)
import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/site'

// Next 15.5.x under `output: 'export'` requires explicit `force-static` on
// route handlers (sitemap/robots). Without this, build fails with:
//   "export const dynamic = 'force-static'/export const revalidate not configured"
// See: https://nextjs.org/docs/advanced-features/static-html-export
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
