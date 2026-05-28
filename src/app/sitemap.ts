// SEO-01 — XML sitemap emitted at build time.
//
// Next 15 file convention: `app/sitemap.ts` exporting default function returning
// MetadataRoute.Sitemap is statically optimized under `output: 'export'` and emits
// `out/sitemap.xml`. No runtime/server involvement.
//
// Pitfall #10 mitigation: every URL is built from `siteUrl` (env-driven via
// NEXT_PUBLIC_SITE_URL → src/lib/site.ts). NEVER hardcode the domain here.
//
// Per CONTEXT D-24..D-27:
//   - 2 entries only (/, /du-an) — matches roadmap route table
//   - lastModified: new Date() (build-time timestamp — D-26)
//   - changeFrequency: 'monthly' — low-velocity B2B marketing site
//   - priority: 1.0 (landing) / 0.8 (/du-an) — landing is canonical business page
import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/site'

// Next 15.5.x under `output: 'export'` requires explicit `force-static` on
// route handlers (sitemap/robots). Without this, build fails with:
//   "export const dynamic = 'force-static'/export const revalidate not configured"
// See: https://nextjs.org/docs/advanced-features/static-html-export
export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/du-an`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]
}
