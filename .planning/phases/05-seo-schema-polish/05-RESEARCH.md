# Phase 5: SEO + Schema + Polish — Research

**Researched:** 2026-05-28
**Domain:** Next.js 15 metadata file conventions (sitemap / robots / opengraph-image / app icons) + JSON-LD `@graph` Organization+GeneralContractor + static-export build artifacts on Cloudflare Pages
**Confidence:** HIGH (all topics verified against official Next.js + Schema.org + Cloudflare Pages docs; one MEDIUM open risk on Vietnamese diacritics in Satori)

## Summary

Phase 5 is the final-SEO surfaces phase. All decisions are locked in `05-CONTEXT.md`; this research is **prescriptive verification** of Next 15 API shapes + one open risk (Satori Vietnamese diacritic rendering, per D-13b).

Verified findings (HIGH confidence, official docs):
- `app/sitemap.ts` exporting `MetadataRoute.Sitemap` and `app/robots.ts` exporting `MetadataRoute.Robots` are special Route Handlers that are **statically optimized by default** — they run at build time under `output: 'export'` and emit `out/sitemap.xml` + `out/robots.txt`. No dynamic APIs used in our shape, so no runtime concern.
- `app/opengraph-image.tsx` + `app/icon.tsx` + `app/apple-icon.tsx` exporting `ImageResponse` from `next/og` are also statically optimized by default — they pre-render to `out/opengraph-image.png` (or similar hashed name; Next auto-wires `<meta og:image>`) and `out/icon.png` + `out/apple-icon.png`, with auto-injection of `<link rel="icon">` / `<link rel="apple-touch-icon">` tags.
- `app/not-found.tsx` produces `out/404.html` under `output: 'export'`; Cloudflare Pages auto-serves any top-level `404.html` for unmatched routes (no Worker, no config needed). Root layout (Nav + Footer + FloatingZalo) auto-wraps not-found.
- `GeneralContractor` is a valid Schema.org type (`Thing > Organization > LocalBusiness > HomeAndConstructionBusiness > GeneralContractor`); `taxID`, `parentOrganization`, `areaServed`, `hasOfferCatalog`, `telephone`, `address` are all inherited. `@graph` with two nodes linked via `@id` is the documented pattern for representing "the corporate Org + the local business" duality.

**One open risk — MEDIUM confidence, gate for D-13b override:** Satori (the rendering engine behind `next/og`'s `ImageResponse`) has a known issue with Southeast-Asian combining diacritical marks — Thai diacritic overlap is a filed bug (`vercel/satori#668`). No Vietnamese-specific bug was found in a focused search, but Vietnamese also uses stacked combining marks (`ợ`, `ờ`, `ữ`, `ẳ`) and shares the same shaping concern. **The planner MUST add a probe task in Plan 05-02:** render a test ImageResponse with `Hợp tác cùng phát triển` and visually inspect; if any diacritic detaches/stacks wrong, downgrade per D-13b fallback (drop tagline, keep ASCII brand) or commit a static PNG.

**Primary recommendation:** Implement exactly as locked in CONTEXT.md. The Next.js 15 file conventions are mature and statically-export-safe. The only fragility is Satori + Vietnamese — gate that with a visual check in Plan 05-02 before committing to the full ImageResponse path.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**1. JSON-LD schema (SEO-04)**
- **D-01:** `@graph` array with TWO nodes — `Organization` + `GeneralContractor` — both linked via `sameAs`/`@id` references.
- **D-02:** JSON-LD lives in `src/app/page.tsx` only — NOT in `layout.tsx` or `/du-an/page.tsx`.
- **D-03:** Inject via inline `<script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}>`. Do NOT use `next/script`.
- **D-04:** Required fields per node:
  - **Organization:** `@id: ${siteUrl}#organization`, `@type: Organization`, `name: company.legalName`, `alternateName: company.shortName`, `url: siteUrl`, `taxID: company.taxId`, `foundingDate: String(company.founded)`, `sameAs: [siteUrl]`
  - **GeneralContractor:** `@id: ${siteUrl}#business`, `@type: GeneralContractor`, `name: company.legalName`, `image: ${siteUrl}/og.png`, `url: siteUrl`, `telephone: company.phoneE164`, `email: company.email`, `address: PostalAddress {streetAddress, addressLocality: 'Bến Lức', addressRegion: 'Tây Ninh', addressCountry: 'VN'}`, `taxID: company.taxId`, `parentOrganization: { '@id': '${siteUrl}#organization' }`, `areaServed: [AdministrativeArea Tây Ninh, Long An, Cà Mau]`, `hasOfferCatalog: OfferCatalog{3 items}`
- **D-05:** Skip `founder`, `openingHours`, social `sameAs` URLs.
- **D-06:** Phone in JSON-LD **MUST** be `+84826553599` (E.164, no spaces). Do NOT use `phoneDisplay`.

**2. OG image (SEO-03)**
- **D-07:** Use Next 15 `src/app/opengraph-image.tsx` with `ImageResponse(...)`. Build emits `out/og.png` (or `out/opengraph-image.png`); root metadata auto-wires it.
- **D-08:** Dimensions 1200×630 via `export const size = { width: 1200, height: 630 }`.
- **D-09:** Content: Burgundy `#6B1F1F` background, brand name top-left, services tagline center, motto italic, domain bottom-right.
- **D-10:** Font — fetch Be Vietnam Pro at build time (option a) or bundle .woff2 (option b). Planner chooses; (a) recommended.
- **D-11:** Single OG image serves both `/` and `/du-an`.
- **D-12:** Build emits PNG to `out/og.png` (or auto-hashed path); Next auto-injects meta tag.
- **D-13:** Alt = "Khang Thịnh Investment — Cung ứng VLXD, Xây dựng, Vận chuyển".
- **D-13b:** STACK.md warned against ImageResponse due to Satori CSS limits + Vietnamese diacritic risk. User overrode. Planner MUST verify diacritic rendering; fallback = drop tagline or commit static PNG.

**3. Favicon (SEO-05)**
- **D-14:** `src/app/icon.tsx` (32×32) + `src/app/apple-icon.tsx` (180×180), both `ImageResponse`-driven.
- **D-15:** Monogram "KT" on Burgundy `#6B1F1F` block, white text, Be Vietnam Pro black 900, ~15% radius, tight tracking.
- **D-16:** 32×32 + 180×180. Auto-wired by Next 15 into `<link rel="icon">` and `<link rel="apple-touch-icon">`.
- **D-17:** SKIP `favicon.ico`.
- **D-18:** Future swap to real logo = replace `icon.tsx` body or add `icon.svg` (SVG takes precedence).

**4. 404 page (SEO-06)**
- **D-19:** `src/app/not-found.tsx`, server component.
- **D-20:** Auto-wrapped by root layout (Nav/Footer).
- **D-21:** Burgundy section, 404 eyebrow + Vietnamese H1 + sub + 2 CTAs (Về trang chủ / Gọi tư vấn).
- **D-22:** `metadata.robots: { index: false, follow: false }` + title "404 — Không tìm thấy trang".
- **D-23:** NO analytics tracking in code (Phase 6 CF Analytics).

**5. Sitemap (SEO-01)**
- **D-24:** `src/app/sitemap.ts` returning `MetadataRoute.Sitemap[]`.
- **D-25:** Two entries: `siteUrl` (priority 1.0) and `${siteUrl}/du-an` (priority 0.8), both `changeFrequency: 'monthly'`, `lastModified: new Date()`.
- **D-26:** `lastModified = new Date()` (build-time).
- **D-27:** Build emits `out/sitemap.xml`.

**6. Robots (SEO-02)**
- **D-28:** `src/app/robots.ts` returning `MetadataRoute.Robots`.
- **D-29:** Rules `{ userAgent: '*', allow: '/' }`, sitemap `${siteUrl}/sitemap.xml`, host `siteUrl`.
- **D-30:** Build emits `out/robots.txt`.

**7. Build verification**
- **D-31..33:** `npm run build` exits 0; `out/{sitemap.xml, robots.txt, og.png, icon.png, apple-icon.png, index.html, 404.html}` all present. No metadataBase warning. Rich Results validation is Phase 6, not Phase 5.

**8. Plan granularity**
- **D-34:** 2 plans: 05-01 (sitemap + robots) Wave 1, 05-02 (OG + icons + JSON-LD + 404) Wave 2.
- **D-35:** Sequential (not parallel) — both touch `out/` during verification.

### Claude's Discretion
- Planner picks font source for OG/icons (Google Fonts fetch vs `/public/fonts/` bundle).
- Planner picks exact OG layout tuning (gold rule color, padding, font sizes within D-09 ranges).
- Planner decides whether the Satori-diacritic probe is its own task or a sub-step of the OG task.
- Planner decides exact filenames Next 15 emits (`og.png` vs `opengraph-image.png`) — must verify with `ls out/` post-build.

### Deferred Ideas (OUT OF SCOPE)
- Lighthouse audit + responsive verification — Phase 6
- Real-device CTA smoke test on /404 — Phase 6
- Vietnamese-native copy review of 404 microcopy — Phase 6
- Cloudflare Pages deploy + Web Analytics + README — Phase 6
- Google Search Console sitemap submission (LSEO-03) — post-launch v1.x
- Google Business Profile registration (LSEO-01) — post-launch v1.x
- Google Maps embed in Contact section (LSEO-02) — post-launch v1.x
- Logo SVG asset — deferred; monogram now, swap-in later is zero-code
- Brand-photo OG image — deferred
- Per-project OG images for `/du-an` — deferred
- JSON-LD `BreadcrumbList` — deferred (only 2 pages)
- JSON-LD per-project nodes (`Service`/`Project`) — deferred
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SEO-01 | `app/sitemap.ts` with 2 routes using `NEXT_PUBLIC_SITE_URL` | Topic 1 — `MetadataRoute.Sitemap` shape confirmed, static-export emit verified |
| SEO-02 | `app/robots.ts` with sitemap reference | Topic 2 — `MetadataRoute.Robots` shape confirmed, `host` field supported |
| SEO-03 | 1200×630 OG image with logo + tagline | Topic 3 — `opengraph-image.tsx` shape confirmed; Vietnamese diacritic probe added as risk |
| SEO-04 | JSON-LD `GeneralContractor` on landing | Topic 5 — `@graph` Org+GeneralContractor pattern verified against Schema.org |
| SEO-05 | Multi-size favicon (16/32/180) | Topic 4 — `icon.tsx` + `apple-icon.tsx` file convention verified |
| SEO-06 | Custom 404 page | Topic 6 — `not-found.tsx` + Cloudflare Pages 404.html auto-serve verified |
</phase_requirements>

## Stack Versions

| Package | Pinned | Latest on npm (2026-05-28) | Notes |
|---------|--------|----------------------------|-------|
| `next` | `^15.0.0` | `16.2.6` | All metadata file conventions in this phase exist since Next 13.3 and are stable across 15.x and 16.x. Project stays on 15.x — same APIs apply. |
| `react` | `^19.0.0` | 19.x | Server components for `not-found.tsx` and JSON-LD injection. |
| `lucide-react` | `^1.16.0` | 1.16.x | Available for 404 CTA icons (e.g. `ArrowLeft`, `Phone`) — already in deps. |
| `motion` | NOT installed | n/a | Not needed for this phase — confirmed via `package.json`. |

Build target: static export (`output: 'export'`). All Phase 5 artifacts must be pre-rendered.

## Topic 1: `MetadataRoute.Sitemap` API

**Verified:** Next.js 15 ships `app/sitemap.(js|ts)` as a file convention. Default export returns an array.

### Return type (from official docs)

```ts
type Sitemap = Array<{
  url: string
  lastModified?: string | Date
  changeFrequency?:
    | 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
  alternates?: { languages?: Languages<string> }
  images?: string[]
  videos?: Array<{ title: string; thumbnail_loc: string; description: string; ... }>
}>
```

Field-name notes:
- `lastModified` (camelCase TS field) renders as `<lastmod>` in XML.
- `changeFrequency` (camelCase TS field) renders as `<changefreq>` in XML. **Casing matters** — `changefreq` in TS will type-check as excess property but the planner should use the exact `changeFrequency` spelling.
- `priority` is a number `0–1`.

### Canonical Phase 5 implementation

```ts
// app/sitemap.ts
import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: siteUrl,                  lastModified: now, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${siteUrl}/du-an`,       lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ]
}
```

### Static export behavior

`sitemap.ts` is a "special Route Handler that is **cached by default** unless it uses a Request-time API or dynamic config" (per Next.js metadata-files docs). With `output: 'export'`:
- It runs once at `next build`.
- It emits `out/sitemap.xml` as a static file.
- Verify with: `cat out/sitemap.xml` post-build.

**Confidence:** HIGH — verified against [Next.js sitemap.xml docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap).

## Topic 2: `MetadataRoute.Robots` API

**Verified:** Next.js 15 ships `app/robots.(js|ts)` as a file convention.

### Return type (from official docs)

```ts
type Robots = {
  rules:
    | { userAgent?: string | string[]; allow?: string | string[]; disallow?: string | string[]; crawlDelay?: number }
    | Array<{ userAgent: string | string[]; allow?: string | string[]; disallow?: string | string[]; crawlDelay?: number }>
  sitemap?: string | string[]
  host?: string                       // ✓ SUPPORTED in the TS type
}
```

**`host` field:** Officially in the type signature as of Next 15 (per docs). Google deprecated reading `Host:` directive from robots.txt years ago (Yandex still reads it), but the field remains a valid robots.txt directive and Next emits it when set. **No harm in setting `host: siteUrl` per D-29.**

Multi-rule format: pass an array (per "Customizing specific user agents" section of the docs). Single-rule format: pass an object.

### Canonical Phase 5 implementation

```ts
// app/robots.ts
import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
```

### Static export behavior

Same pattern as sitemap — special Route Handler, cached/static by default, no Request-time API used → runs at build time, emits `out/robots.txt`. Verify with `cat out/robots.txt`.

**Confidence:** HIGH — verified against [Next.js robots.txt docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots).

## Topic 3: `ImageResponse` for `opengraph-image.tsx`

**Verified:** Next.js 15 ships `app/opengraph-image.(js|ts|tsx)` as a file convention. Use `ImageResponse` from `next/og`.

### Required + optional exports

| Export | Required | Type | Notes |
|--------|----------|------|-------|
| `default` function | **yes** | `() => ImageResponse \| Promise<ImageResponse>` | Returns `Blob \| ArrayBuffer \| TypedArray \| DataView \| ReadableStream \| Response`; `ImageResponse` satisfies this. |
| `alt` | optional | `string` | Auto-emits `<meta property="og:image:alt">`. |
| `size` | optional | `{ width: number; height: number }` | Auto-emits `og:image:width`/`og:image:height` + becomes ImageResponse width/height when spread into options. |
| `contentType` | optional | `string` (MIME) | Auto-emits `og:image:type`. Use `'image/png'`. |

### Canonical Phase 5 implementation (D-09 layout, font option a — fetch from Google Fonts)

```tsx
// app/opengraph-image.tsx
import { ImageResponse } from 'next/og'
import { siteUrl } from '@/lib/site'

export const alt = 'Khang Thịnh Investment — Cung ứng VLXD, Xây dựng, Vận chuyển'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

async function loadFont(weight: 400 | 900) {
  // Fetch a single Be Vietnam Pro weight; Google Fonts serves .woff2 — wrap with the css2 API
  // and resolve to the woff2 binary. Planner: confirm subset for full Vietnamese diacritics.
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@${weight}&subset=vietnamese`,
    { headers: { 'User-Agent': 'Mozilla/5.0' } }
  ).then(r => r.text())
  const url = css.match(/url\((https:\/\/[^)]+\.woff2)\)/)?.[1]
  if (!url) throw new Error(`Be Vietnam Pro ${weight} font URL not found in Google css response`)
  return fetch(url).then(r => r.arrayBuffer())
}

export default async function OGImage() {
  const [regular, black] = await Promise.all([loadFont(400), loadFont(900)])
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        background: '#6B1F1F', color: '#FAF8F2',
        display: 'flex', flexDirection: 'column',
        padding: '72px 96px', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 96, fontWeight: 900, letterSpacing: '-0.02em' }}>
            KHANG THỊNH INV
          </div>
          <div style={{ width: 60, height: 4, background: '#FAF8F2', opacity: 0.9, marginTop: 16 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 48, fontWeight: 400 }}>
            Cung ứng VLXD · Xây dựng · Vận chuyển
          </div>
          <div style={{ fontSize: 36, fontStyle: 'italic', opacity: 0.8 }}>
            Hợp tác cùng phát triển
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end',
                      fontSize: 28, opacity: 0.6 }}>
          khangthinhinv.vn
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Be Vietnam Pro', data: regular, weight: 400, style: 'normal' },
        { name: 'Be Vietnam Pro', data: black,   weight: 900, style: 'normal' },
      ],
    }
  )
}
```

### Satori CSS subset — confirmed limitations

(All silent — Satori does not throw; just renders wrong.)

- **`display`:** ONLY `flex` and `none` work. **No `block`, no `inline-block`, no `inline`.** Top-level container MUST set `display: 'flex'`. Per [Satori CSS Support — DeepWiki](https://deepwiki.com/vercel/satori/4-advanced-usage) and [Issue #325](https://github.com/vercel/satori/issues/325).
- **Children with multiple kids:** any element with >1 child must explicitly set `display: 'flex'` (and usually `flexDirection`).
- **`gap`:** unsupported in flexbox per the same source — use margins or padding instead. (My example uses `gap: 12` — planner should swap to explicit `marginTop` on the second child if rendering glitches.)
- **No CSS selectors / no class names** — only inline `style={}`.
- **No `background-image` URL** for arbitrary photos — but solid colors and `linear-gradient` work.
- Font loading via `next/font` is **not honored** inside ImageResponse — must pass via `fonts` option (per docs example).

### Vietnamese diacritic rendering — OPEN RISK (gate per D-13b)

| Source | Finding |
|--------|---------|
| [Satori Issue #668 — Thai diacritics overlap](https://github.com/vercel/satori/issues/668) | Thai tone-mark + vowel combinations render with overlapping glyphs. Confirms Satori's complex-text-layout (shaping) is incomplete vs HarfBuzz. |
| [Satori Issue #215 — Unicode font breaks](https://github.com/vercel/satori/issues/215) | Reports characters being dropped/broken when font subset doesn't cover them. |
| [Satori Issue #36 — Dynamic font loading](https://github.com/vercel/satori/issues/36) | Confirms font loading is single-shot — no fallback chains. |
| Direct search for "Vietnamese diacritic Satori" | No filed bug found. Absence ≠ proof of correctness. |

Vietnamese uses pre-composed (NFC) glyphs for most diacritics (`ợ`, `ờ`, `ằ`, `ữ`) which are single codepoints — Satori is more likely to render these correctly than Thai's combining-mark sequences. **But** the font binary fetched from Google Fonts MUST contain those codepoints. The `subset=vietnamese` URL parameter is required (default `latin` subset will silently fall back).

**MANDATORY probe before committing to ImageResponse path** — the planner MUST sequence this in Plan 05-02:
1. Build with the implementation above.
2. Open `out/opengraph-image.png` (or whatever filename emerges).
3. Visually verify `Hợp tác cùng phát triển` — every `ợ`, `ù`, `ố`, `á`, `ể` looks correct (no missing glyph, no stacked-on-wrong-base, no `□` boxes).
4. If broken: trigger D-13b fallback — either commit a static `app/opengraph-image.png` (Next will prefer the static file over the .tsx if present in the same directory? Actually no — they conflict; planner must rename .tsx OR delete it), or strip the Vietnamese tagline from ImageResponse and use ASCII-only content.

**Static export behavior:** ImageResponse files are "statically optimized (generated at build time and cached) unless they use Request-time APIs". `output: 'export'` + no `params`/`headers()`/`cookies()` in our shape = build-time PNG generation. Emits to `out/` (Next 15 uses hashed filename in route handler emit; the auto-injected `<meta og:image>` references the correct URL).

**Filename in `out/`:** per Next 15, generated metadata routes emit at the path `/opengraph-image` (extension determined by `contentType`). For a static export this typically becomes `out/opengraph-image.png`. **Planner: confirm exact path via `ls out/ | grep -E 'opengraph|og'` post-build** and update CONTEXT D-31 if it differs from the assumed `out/og.png`.

**Confidence:** HIGH on API shape (official docs). MEDIUM on Vietnamese diacritic correctness — gated by probe.

Sources: [Next.js opengraph-image docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image), [Satori CSS Support DeepWiki](https://deepwiki.com/vercel/satori/4-advanced-usage), [Satori Issue #668 Thai diacritics](https://github.com/vercel/satori/issues/668).

## Topic 4: `icon.tsx` and `apple-icon.tsx`

**Verified:** Next.js 15 ships `app/icon.(js|ts|tsx)` and `app/apple-icon.(js|ts|tsx)` as file conventions.

### File type rules (from official docs)

| File | Supported file types | Auto-emitted `<link>` |
|------|----------------------|-----------------------|
| `app/favicon.ico` (root only) | `.ico` | `<link rel="icon" href="/favicon.ico" sizes="any">` |
| `app/icon.*` | `.ico`, `.jpg`, `.jpeg`, `.png`, `.svg`, OR `.js`/`.ts`/`.tsx` for ImageResponse | `<link rel="icon" href="/icon?<gen>" type="image/<gen>" sizes="<gen>">` |
| `app/apple-icon.*` | `.jpg`, `.jpeg`, `.png`, OR `.js`/`.ts`/`.tsx` for ImageResponse | `<link rel="apple-touch-icon" href="/apple-icon?<gen>" type="image/<gen>" sizes="<gen>">` |

**Precedence:** Static files take precedence over generated ones at the same path. Future swap to logo SVG (per D-18): adding `app/icon.svg` next to `icon.tsx` will conflict — planner should delete the .tsx when swapping (Next 15 throws or picks one nondeterministically when both exist; safer to remove). SVG file with `viewBox` gets `sizes="any"` auto-attached.

**You CANNOT generate a `favicon.ico` via code** — only `icon.*` and `apple-icon.*` accept `.tsx`. (D-17 confirmed valid: skip `favicon.ico` entirely; `icon.tsx` covers it.)

### Required exports for dynamic icons

| Export | Required | Notes |
|--------|----------|-------|
| `default` function | **yes** | Returns `ImageResponse` (or other valid type). |
| `size` | optional but recommended | `{ width, height }`. For Phase 5: 32×32 (icon) / 180×180 (apple-icon). |
| `contentType` | optional but recommended | `'image/png'`. |

`alt` is NOT a valid export for icons (only for `opengraph-image`/`twitter-image`).

### Canonical Phase 5 implementation (D-15 monogram)

```tsx
// app/icon.tsx
import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        background: '#6B1F1F', color: '#FAF8F2',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, fontWeight: 900, letterSpacing: '-0.04em',
        borderRadius: 5, // ~15% of 32
      }}>
        KT
      </div>
    ),
    { ...size }
  )
}
```

```tsx
// app/apple-icon.tsx — same shape, larger sizes
import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        background: '#6B1F1F', color: '#FAF8F2',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 100, fontWeight: 900, letterSpacing: '-0.04em',
        borderRadius: 27, // ~15% of 180
      }}>
        KT
      </div>
    ),
    { ...size }
  )
}
```

**Font note:** Glyphs "K" and "T" are basic Latin — Satori's bundled fallback (Noto Sans-ish) WILL render them. No need to load a custom font for icons unless planner wants exact Be Vietnam Pro weight 900 metrics. Recommendation: skip font loading for icons (saves a fetch per build) — visual difference between a system black and Be Vietnam Pro Black at 18px is invisible.

### Static export behavior

Same as opengraph-image — special Route Handlers, statically optimized, build-time PNG generation. Emits `out/icon.png` and `out/apple-icon.png` (or similar; verify with `ls out/`). Next auto-injects the `<link>` tags into `<head>` of every page.

**Confidence:** HIGH — verified against [Next.js app-icons docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons).

## Topic 5: JSON-LD `@graph` with Organization + GeneralContractor

**Verified:** `GeneralContractor` is a valid Schema.org type at `https://schema.org/GeneralContractor`.

### Type hierarchy (from schema.org)

```
Thing > Organization > LocalBusiness > HomeAndConstructionBusiness > GeneralContractor
Thing > Place > LocalBusiness > HomeAndConstructionBusiness > GeneralContractor
```

Multi-parent inheritance (both `Organization` AND `Place`) means GeneralContractor inherits `taxID`, `parentOrganization`, `address`, `telephone`, `areaServed`, `hasOfferCatalog`, `image`, `url`, `name`, `email`, `sameAs`, `foundingDate` — all of these are valid properties on the node.

**`taxID` on Organization:** Schema.org defines `taxID` directly on `Organization`. Since `GeneralContractor` inherits from `Organization` (via LocalBusiness), it inherits `taxID`. CONTEXT D-04 includes `taxID` on both nodes — that's valid and not duplicated semantically (one's the corporate ID, one is the local-business arm's ID — same value here but the duality is preserved by `@id`).

### `@graph` pattern — canonical Phase 5 shape

`@graph` is a JSON-LD top-level construct: one `@context`, an array of nodes each with its own `@type` and `@id`. Cross-node references use `{ '@id': '...' }`.

```ts
// Source: Schema.org + Next.js metadata patterns; matches CONTEXT D-04 exactly
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}#organization`,
      name: company.legalName,
      alternateName: company.shortName,
      url: siteUrl,
      taxID: company.taxId,
      foundingDate: String(company.founded),
      sameAs: [siteUrl],
    },
    {
      '@type': 'GeneralContractor',
      '@id': `${siteUrl}#business`,
      name: company.legalName,
      image: `${siteUrl}/og.png`, // verify exact filename — see Topic 3
      url: siteUrl,
      telephone: company.phoneE164,        // '+84826553599' E.164 — per Pitfall #6
      email: company.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: company.address.street,
        addressLocality: 'Bến Lức',
        addressRegion: 'Tây Ninh',
        addressCountry: 'VN',
      },
      taxID: company.taxId,
      parentOrganization: { '@id': `${siteUrl}#organization` },
      areaServed: [
        { '@type': 'AdministrativeArea', name: 'Tây Ninh' },
        { '@type': 'AdministrativeArea', name: 'Long An' },
        { '@type': 'AdministrativeArea', name: 'Cà Mau' },
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Dịch vụ Khang Thịnh Investment',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Cung ứng cát, đá, vật liệu san lấp' }},
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Xây dựng nhà phố và công trình dân dụng' }},
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Vận chuyển đường thủy' }},
        ],
      },
    },
  ],
}
```

### Injection pattern in `app/page.tsx` (per D-03)

```tsx
// app/page.tsx — add at top of returned JSX, before <main>
import { siteUrl } from '@/lib/site'
import { company } from '@/lib/site'
// ... existing section imports

export default function HomePage() {
  const jsonLd = { /* as above */ }
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger -- JSON-LD is parsed by crawlers, not executed
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen">
        {/* existing 8 sections */}
      </main>
    </>
  )
}
```

**`<script>` placement:** anywhere in the rendered HTML is acceptable per Google ("must be in the served HTML"). Placing it as the FIRST child of the page component, BEFORE `<main>`, keeps it visible in `view-source` near the top.

**Do NOT** use `next/script` — that injects a `<script>` with a runtime-load lifecycle. JSON-LD must be parsed inline during HTML parsing.

### `areaServed` shape

`areaServed` accepts: `Text` (string), `Place`, `AdministrativeArea`, or `GeoShape`. For Vietnamese provincial-level coverage, `AdministrativeArea` is the most specific and Google-friendly (per [Google Organization Schema docs](https://developers.google.com/search/docs/appearance/structured-data/organization)). CONTEXT D-04 chooses `AdministrativeArea` — confirmed correct.

### Google rich-results eligibility

- Google's [Local Business structured data docs](https://developers.google.com/search/docs/appearance/structured-data/local-business) explicitly recommend using a specific subtype (Dentist, Restaurant, ProfessionalService, etc.) rather than bare `LocalBusiness`. `GeneralContractor` qualifies.
- Required for rich-result eligibility per Google: `name`, `address`, plus at least one of `image`/`telephone`/`url`. Our shape satisfies all four.
- `openingHoursSpecification` is recommended by Google for the "open now" badge but **not required** for the basic local pack card. CONTEXT D-05 intentionally skips it (B2B, no retail hours) — accepted tradeoff: we forfeit the open-now badge, keep the local pack eligibility.
- `@graph` with multiple nodes is fully supported by Google's parser (per [Local Business Schema Guide 2026 — multiple-location pattern](https://postelniak.com/blog/local-business-schema-for-multiple-locations/)).
- Phase 6 will validate with the [Rich Results Test](https://search.google.com/test/rich-results) — Phase 5 only requires the script content to be valid JSON.

**Confidence:** HIGH — verified against [Schema.org/GeneralContractor](https://schema.org/GeneralContractor), [Google Local Business docs](https://developers.google.com/search/docs/appearance/structured-data/local-business), [Google Organization docs](https://developers.google.com/search/docs/appearance/structured-data/organization).

## Topic 6: `not-found.tsx` under static export + Cloudflare Pages

### Next.js behavior

- `app/not-found.tsx` is the App Router file convention for an unmatched-route handler.
- Under `output: 'export'`, Next.js renders it as `out/404.html` at build time. (Confirmed by [Next.js static-exports guide](https://nextjs.org/docs/app/guides/static-exports) — single-page-app fallback supported via `404.html`.)
- The root `app/layout.tsx` AUTOMATICALLY wraps `not-found.tsx` — Nav + Footer + FloatingZalo render around it without extra wiring. (Confirmed via Next.js routing semantics: not-found is a route segment inside the root layout's tree.)
- `export const metadata: Metadata = { robots: { index: false, follow: false } }` is supported inside `not-found.tsx` — Next merges it into the page's `<head>` and emits `<meta name="robots" content="noindex, nofollow">`.

### Cloudflare Pages behavior

- Cloudflare Pages auto-serves any **top-level** `404.html` from the published directory for any 404 response. (Per [Cloudflare Pages Serving Pages docs](https://developers.cloudflare.com/pages/configuration/serving-pages/).)
- It also walks UP the directory tree — `/blog/missing` would first try `/blog/404.html`, then fall back to `/404.html`. Our shape: only `/404.html` exists, so every unmatched route serves it. Correct.
- No `_redirects` or `_headers` config needed.
- Exception called out by Cloudflare: if a project has NO top-level `404.html`, Pages assumes SPA and serves `index.html` for unmatched routes. We have a `404.html` → that fallback doesn't apply.

### Canonical Phase 5 implementation

```tsx
// app/not-found.tsx — server component
import Link from 'next/link'
import type { Metadata } from 'next'
import { telHref } from '@/lib/site'

export const metadata: Metadata = {
  title: '404 — Không tìm thấy trang',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <section className="min-h-[60vh] grid place-items-center bg-burgundy text-bone py-24 px-6">
      <div className="max-w-2xl text-center">
        <p className="text-7xl font-black opacity-60">404</p>
        <h1 className="text-4xl md:text-5xl font-black mt-4">
          Không tìm thấy trang
        </h1>
        <p className="text-lg mt-6 opacity-90">
          Đường dẫn bạn truy cập không tồn tại hoặc đã được di chuyển.
          Có thể bạn đang tìm những trang sau:
        </p>
        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="bg-bone text-burgundy font-bold px-6 py-3 rounded
                       inline-block min-h-[44px] min-w-[44px]"
          >
            ← Về trang chủ
          </Link>
          <a
            href={telHref()}
            className="border-2 border-bone text-bone font-bold px-6 py-3 rounded
                       inline-block min-h-[44px] min-w-[44px]"
          >
            Gọi tư vấn
          </a>
        </div>
      </div>
    </section>
  )
}
```

(Tailwind class names match palette tokens established in Phase 1; planner confirms `bg-burgundy` / `text-bone` exist.)

**Confidence:** HIGH — verified against [Next.js static exports guide](https://nextjs.org/docs/app/guides/static-exports) and [Cloudflare Pages Serving Pages docs](https://developers.cloudflare.com/pages/configuration/serving-pages/).

## Topic 7: Build verification commands

### Standard build

```bash
npm run build
```

No special flags needed — `next.config.ts` already sets `output: 'export'`. The build emits to `./out/`.

### Verify all expected artifacts exist

```bash
# Must all exist after build
ls -la out/sitemap.xml \
       out/robots.txt \
       out/index.html \
       out/404.html \
       out/du-an/index.html

# OG image + icons — exact filenames depend on Next 15 emit; check whichever exists
ls -la out/ | grep -E 'opengraph|og|icon|apple'
```

### Verify sitemap is well-formed XML

```bash
# xmllint ships on macOS by default and on most Linux distros
xmllint --noout out/sitemap.xml && echo "✓ sitemap.xml is valid XML"

# Cross-check URL count = 2
grep -c '<url>' out/sitemap.xml
# expect: 2
```

### Verify robots.txt contains expected directives

```bash
grep -E '^(User-Agent|User-agent|Allow|Sitemap|Host):' out/robots.txt
# expect lines for: User-Agent: *, Allow: /, Sitemap: https://..., Host: https://...
```

### Verify JSON-LD is valid JSON

```bash
# Extract the ld+json script body from out/index.html and parse it via Node
node -e "
const fs = require('fs');
const html = fs.readFileSync('out/index.html', 'utf8');
const match = html.match(/<script type=\"application\/ld\+json\"[^>]*>([\s\S]*?)<\/script>/);
if (!match) { console.error('✗ no ld+json script found'); process.exit(1); }
try {
  const obj = JSON.parse(match[1]);
  const types = (obj['@graph'] || []).map(n => n['@type']);
  console.log('✓ JSON-LD valid; types:', types.join(', '));
} catch (e) {
  console.error('✗ JSON-LD parse failed:', e.message); process.exit(1);
}
"
# expect: ✓ JSON-LD valid; types: Organization, GeneralContractor
```

### Verify metadataBase warning is absent

```bash
# Re-run build, capture stderr+stdout, scan for the specific warning string
npm run build 2>&1 | grep -i 'metadataBase' && echo "✗ metadataBase warning present" || echo "✓ no metadataBase warning"
```

### Verify OG image is 1200×630 PNG

```bash
# macOS: use sips
sips -g pixelHeight -g pixelWidth out/opengraph-image.png 2>/dev/null || \
sips -g pixelHeight -g pixelWidth out/og.png 2>/dev/null
# expect: pixelHeight: 630, pixelWidth: 1200
```

### Verify 404.html renders with branding

```bash
# Should contain Burgundy color + Vietnamese H1
grep -o '#6B1F1F' out/404.html | head -1 && \
grep -o 'Không tìm thấy trang' out/404.html | head -1
```

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| `next` (15.x) | All phase 5 file conventions | ✓ (via package.json) | `^15.0.0` | — |
| `next/og` (`ImageResponse`) | OG + icons | ✓ (bundled with `next`) | n/a | Static PNG fallback per D-13b |
| Network at build time | Fonts via Google Fonts fetch (option a) | Assumed (CI/dev machine online) | n/a | Bundle .woff2 in `/public/fonts/` (option b) — planner picks |
| `xmllint` | Sitemap XML validation | ✓ (macOS default; verify on CI) | bundled | `xmlstarlet`, or parse via Node `xmldom` |
| `sips` | Image dimension check | ✓ (macOS only) | bundled | `identify` (ImageMagick) on Linux; or Node `sharp` |
| `node` | JSON-LD validation script | ✓ (project uses Node) | per package.json | — |
| Cloudflare Pages | 404.html auto-serve | Deferred to Phase 6 | n/a | — (Phase 5 verifies file exists; Phase 6 verifies live serving) |

**Missing dependencies with no fallback:** None blocking.

**Missing dependencies with fallback:**
- Network during build — fall back to bundled `.woff2` (option b in D-10).
- `sips`/`xmllint` on a Linux CI — alternatives exist; planner adds the right tool to the verify step per environment.

## Common Pitfalls

### Pitfall A: Static-file vs generated-file conflict on icon paths

**What goes wrong:** Adding `app/icon.tsx` AND `app/icon.png` in the same directory — Next 15 picks one nondeterministically or errors during build.

**Why it happens:** Both register at the `/icon` route segment.

**How to avoid:** Pick ONE per icon segment. CONTEXT D-14 picks `.tsx` for both `icon` and `apple-icon`. D-18 (future logo swap) requires deleting `icon.tsx` before adding `icon.svg`.

### Pitfall B: Satori top-level child without `display: flex`

**What goes wrong:** ImageResponse renders blank or with misplaced children when the root `<div>` (or any multi-child element) omits `display: 'flex'`.

**Why it happens:** Satori only supports `display: flex` and `display: none`. Default `display: block` is silently treated as `flex` for the root but children inherit no implicit layout.

**How to avoid:** Every multi-child element gets `style={{ display: 'flex', flexDirection: 'column' | 'row' }}`. The example in Topic 3 follows this religiously.

### Pitfall C: JSON-LD escape characters from `JSON.stringify`

**What goes wrong:** Vietnamese diacritics get UTF-8-escaped in JSON.stringify output (e.g. `\u1ee3` for `ợ`) — technically valid JSON-LD but harder to read and risks issues if any consumer expects raw UTF-8.

**Why it happens:** Default Node `JSON.stringify` doesn't escape non-ASCII; modern V8 keeps UTF-8 — so this rarely happens. But some older toolchains or stringify wrappers escape.

**How to avoid:** Use plain `JSON.stringify(jsonLd)` (no replacer) and `dangerouslySetInnerHTML`. Verify post-build: `grep 'Hợp tác' out/index.html` should match. If escaped, accept it — Google parses both forms.

### Pitfall D: `lastModified` regenerated on every build inflates diff noise

**What goes wrong:** `new Date()` in `sitemap.ts` produces a different ISO timestamp on every build. Git diff after each rebuild shows `out/sitemap.xml` changing. Cloudflare Pages may emit a "site changed" indicator on cosmetic-only builds.

**Why it matters:** Low-velocity B2B site — Google rate-limits crawls regardless. Daily timestamps churn doesn't help.

**Tradeoff:** CONTEXT D-26 accepts the churn (chose simplicity over file-mtime introspection). Don't fight it.

### Pitfall E: Hard-coded domain in JSON-LD `@id`

**What goes wrong:** Writing `'@id': 'https://khangthinhinv.vn#organization'` literally. When the real domain is finalized, the `@id` mismatches between cached Google-known and current.

**How to avoid:** Build from `siteUrl` (which comes from `NEXT_PUBLIC_SITE_URL`). Already locked in D-04 — verify the planner doesn't regress.

### Pitfall F: `next/script` for JSON-LD

**What goes wrong:** Using `<Script>` from `next/script` to inject JSON-LD. The script becomes deferred / lazy, may not be in initial HTML, Google misses it on first crawl.

**How to avoid:** Use plain `<script type="application/ld+json" dangerouslySetInnerHTML={...}>`. Per D-03 — verify.

## Code Examples

All canonical examples are inlined per topic above. Cross-references:

- `app/sitemap.ts` — Topic 1
- `app/robots.ts` — Topic 2
- `app/opengraph-image.tsx` — Topic 3
- `app/icon.tsx` + `app/apple-icon.tsx` — Topic 4
- JSON-LD `@graph` block + injection — Topic 5
- `app/not-found.tsx` — Topic 6

## Open Questions

1. **Will Satori render `Hợp tác cùng phát triển` with correct diacritic positioning?**
   - What we know: Thai diacritics have a filed bug (#668). Vietnamese uses pre-composed codepoints which historically render better in Satori; no Vietnamese-specific bug found.
   - What's unclear: Whether Be Vietnam Pro's Google Fonts subset shipped via `?subset=vietnamese` covers every diacritic combination used in the OG text.
   - Recommendation: **Mandatory visual probe** in Plan 05-02 — if broken, fall back per D-13b. Planner adds an explicit "verify OG diacritics" task with a defined fallback path.

2. **Exact filename Next 15 emits for `opengraph-image.tsx` under static export — `og.png` or `opengraph-image.png` or a hashed path?**
   - What we know: Next 15 emits at the route segment path; `<meta og:image>` references the correct relative URL automatically.
   - What's unclear: Whether CONTEXT D-31's assumption of `out/og.png` is correct, OR if it's `out/opengraph-image.png`.
   - Recommendation: Plan 05-02's build-verify task runs `ls out/ | grep -E 'opengraph|og|icon'` and updates CONTEXT D-31 to the actual emit names. Don't pre-assume.

3. **Does Cloudflare Pages emit a `Content-Type: text/html` for `404.html` AND a HTTP 404 status, or 200?**
   - What we know: Pages serves the file content. Per docs, it responds with HTTP 404 status when serving the configured 404 page (not 200 SPA-style).
   - What's unclear: Has not been verified end-to-end with a live deploy (deploy is Phase 6).
   - Recommendation: Verify in Phase 6 with `curl -I https://domain/khong-ton-tai` — expect `HTTP/2 404`. If 200, Pages is treating it as SPA fallback — investigate `404.html` placement at out/ root.

## Sources

### Primary (HIGH confidence — official docs)

- [Next.js — sitemap.xml file convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) — full `MetadataRoute.Sitemap` type and examples.
- [Next.js — robots.txt file convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots) — `MetadataRoute.Robots` shape, host field, multi-rule format.
- [Next.js — opengraph-image and twitter-image](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image) — required exports, font loading example, static-optimization note.
- [Next.js — favicon, icon, apple-icon](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons) — file convention table, ImageResponse pattern, static vs generated precedence.
- [Next.js — Static Exports guide](https://nextjs.org/docs/app/guides/static-exports) — `output: 'export'` constraints and supported features.
- [Schema.org — GeneralContractor](https://schema.org/GeneralContractor) — type hierarchy and inherited properties.
- [Google — Local Business structured data](https://developers.google.com/search/docs/appearance/structured-data/local-business) — required fields for rich-results eligibility.
- [Google — Organization structured data](https://developers.google.com/search/docs/appearance/structured-data/organization) — `areaServed` shape, parentOrganization usage.
- [Cloudflare Pages — Serving Pages](https://developers.cloudflare.com/pages/configuration/serving-pages/) — `404.html` auto-serve behavior and directory walk.

### Secondary (MEDIUM confidence — cross-verified)

- [Satori — CSS Support (DeepWiki)](https://deepwiki.com/vercel/satori/4-advanced-usage) — display: flex/none only, inline-block unsupported, gap unsupported.
- [Satori Issue #668 — Thai diacritics overlap](https://github.com/vercel/satori/issues/668) — shaping limitations for Southeast Asian scripts.
- [Satori Issue #325 — Rendering inline elements](https://github.com/vercel/satori/issues/325) — confirms inline display unsupported.
- [Local Business Schema Guide 2026](https://clickyowl.com/local-business-schema/) — `@graph` multi-node pattern.
- [Schema Markup for Local Business with Multiple Locations](https://postelniak.com/blog/local-business-schema-for-multiple-locations/) — `parentOrganization` + `@id` linking pattern.

### Tertiary (LOW confidence — single source)

- npm latest version check for `next` returned `16.2.6` (2026-05-28). Project pinned to `^15.0.0`; APIs verified above are stable across 15.x and 16.x.

## Metadata

**Confidence breakdown:**
- Sitemap API (Topic 1): HIGH — official docs explicit and matches CONTEXT shape.
- Robots API (Topic 2): HIGH — official docs explicit; `host` field confirmed in type.
- ImageResponse for OG (Topic 3): HIGH on API; MEDIUM on Vietnamese diacritic rendering correctness (gated by probe).
- Icon conventions (Topic 4): HIGH — official docs explicit.
- JSON-LD `@graph` (Topic 5): HIGH — Schema.org + Google docs both verified.
- not-found.tsx + Cloudflare Pages (Topic 6): HIGH — both Next and Cloudflare official docs confirm.
- Build verification (Topic 7): HIGH — standard CLI tools.

**Research date:** 2026-05-28
**Valid until:** 2026-06-28 (30 days; Next.js metadata APIs are stable, low churn risk)
