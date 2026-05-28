# Phase 5: SEO + Schema + Polish - Context

**Gathered:** 2026-05-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Final SEO surfaces — sitemap, robots.txt, OG image, favicon, JSON-LD structured data, custom 404 — wired correctly so the site is fully discoverable and shareable, with NAP consistency across UI, JSON-LD, and metadata. All assets generated at build time (Next.js `output: 'export'`) — no runtime/BE involvement.

**In scope:**
- `src/app/sitemap.ts` → emits valid XML sitemap with `/` and `/du-an` using `siteUrl` from `lib/site.ts`
- `src/app/robots.ts` → emits valid `robots.txt` allowing all crawlers + sitemap reference
- `src/app/opengraph-image.tsx` → code-driven 1200×630 PNG, build-time render via Next 15 `ImageResponse`
- `src/app/icon.tsx` + `src/app/apple-icon.tsx` → monogram "KT" favicons (32×32, 180×180), build-time render
- JSON-LD `@graph` block on landing `src/app/page.tsx` containing `Organization` + `GeneralContractor` nodes
- `src/app/not-found.tsx` → branded full-layout 404 with Burgundy block + 2 CTAs
- Build verification: `npm run build` emits zero metadataBase warnings; `out/sitemap.xml`, `out/robots.txt`, `out/og.png`, `out/favicon.ico`, `out/apple-icon.png` all exist

**Out of scope (other phases):**
- Lighthouse audit + responsive verification — Phase 6
- Real-device CTA smoke test on /404 — Phase 6
- Vietnamese-native copy review of 404 microcopy — Phase 6
- Cloudflare Pages deploy + Web Analytics + README — Phase 6
- Google Search Console sitemap submission (LSEO-03) — post-launch v1.x
- Google Business Profile registration (LSEO-01) — post-launch v1.x
- Google Maps embed in Contact section (LSEO-02) — post-launch v1.x
- Logo SVG asset — deferred; placeholder monogram used now, swap-in later is zero-code-change
- Brand-photo OG image — deferred; current code-driven OG is "good enough" for share previews
- Per-project OG images for `/du-an` — single root OG sufficient for 2-route site
- JSON-LD `BreadcrumbList` schema — deferred; only 2 pages, breadcrumb-rich-results minimal benefit
- JSON-LD per-project nodes (`Service` or `Project` schema entries) — deferred; landing-level `GeneralContractor` covers business identity

</domain>

<decisions>
## Implementation Decisions

### 1. JSON-LD schema (SEO-04)

- **D-01:** Use `@graph` array with TWO nodes — `Organization` + `GeneralContractor` — both linked via `sameAs`/`@id` references.
  - **Rationale:** `Organization` captures corporate identity (legalName, taxID, founder). `GeneralContractor` (subtype of `LocalBusiness`) captures local-SEO surfaces (address, telephone, areaServed, services) for Google VN local rich results. `@graph` lets both coexist without conflict. Roadmap line 160 explicitly flagged this as research-required; this choice maximizes both signals.
- **D-02:** JSON-LD lives in `src/app/page.tsx` only — NOT in `layout.tsx` or `/du-an/page.tsx`. Landing page is the canonical business-info page; `/du-an` is a project list (no business-entity claim needed).
- **D-03:** Inject via inline `<script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}>` placed inside the page component (above `<main>` or just after). Do NOT use `next/script` — JSON-LD is parsed at HTML-parse time, not script-load time.
- **D-04:** Required fields per node:
  - **`Organization`**:
    - `@id`: `${siteUrl}#organization`
    - `@type`: `Organization`
    - `name`: `company.legalName` → "Công ty TNHH Khang Thịnh Investment"
    - `alternateName`: `company.shortName` → "KHANG THỊNH INV"
    - `url`: `siteUrl`
    - `taxID`: `company.taxId` → "1102107064"
    - `foundingDate`: `String(company.founded)` → "2025"
    - `sameAs`: `[siteUrl]` (single self-link until social profiles exist)
  - **`GeneralContractor`**:
    - `@id`: `${siteUrl}#business`
    - `@type`: `GeneralContractor`
    - `name`: `company.legalName`
    - `image`: `${siteUrl}/og.png` (build-output OG image — reused)
    - `url`: `siteUrl`
    - `telephone`: `company.phoneE164` → "+84921985599" (E.164, per Pitfall #6)
    - `email`: `company.email`
    - `address`: PostalAddress object built from `company.address` (streetAddress, addressLocality "Bến Lức", addressRegion "Tây Ninh", addressCountry "VN")
    - `taxID`: `company.taxId`
    - `parentOrganization`: `{ '@id': '${siteUrl}#organization' }` (links to Organization node)
    - `areaServed`: `[{ '@type': 'AdministrativeArea', name: 'Tây Ninh' }, { '@type': 'AdministrativeArea', name: 'Long An' }, { '@type': 'AdministrativeArea', name: 'Cà Mau' }]`
    - `hasOfferCatalog`: `OfferCatalog` with 3 items — "Cung ứng cát, đá, vật liệu san lấp", "Xây dựng nhà phố và công trình dân dụng", "Vận chuyển đường thủy"
- **D-05:** Skipped optional fields (per user gray-area answer):
  - `founder` (PII consideration — `legalRep` not embedded in JSON-LD)
  - `openingHours` / `contactPoint.hoursAvailable` (B2B, no fixed retail hours)
  - Social `sameAs` URLs (no Facebook/LinkedIn/Zalo OA profile to link yet)
- **D-06:** Phone format in JSON-LD **MUST** be `+84921985599` (E.164, no spaces, no parentheses). Do NOT use `phoneDisplay` ("092 198 55 99"). Matches Pitfall #6 from PITFALLS.md and Phase 1 D-10.

### 2. OG image (SEO-03)

- **D-07:** Use Next 15's file-based convention — `src/app/opengraph-image.tsx` exporting a default function returning `ImageResponse(...)`. Build emits `out/og.png` and auto-wires it into root metadata (no manual `openGraph.images` needed in `layout.tsx`).
- **D-08:** Dimensions: 1200×630 (locked by Open Graph spec — Facebook/Zalo/Slack standard). Set via `export const size = { width: 1200, height: 630 }`.
- **D-09:** Content layout (single composition, code-driven):
  - Background: solid `#6B1F1F` (Burgundy) — matches theme color
  - Top-left: "KHANG THỊNH INV" (font-black, white #FAF8F2, size ~96px)
  - Below brand name: thin gold rule (60px wide, border-bottom 4px Gold-ish — TBD by planner whether to use Burgundy palette gold or just white)
  - Center: "Cung ứng VLXD · Xây dựng · Vận chuyển" (font-medium, white, ~48px)
  - Below: tagline "Hợp tác cùng phát triển" (italic, opacity 80%, ~36px)
  - Bottom-right: `khangthinhinv.vn` (regular, opacity 60%, ~28px)
- **D-10:** Font in `opengraph-image.tsx`: Next 15 `ImageResponse` does NOT auto-pick up `next/font` — must fetch font binary via `fetch(new URL(...))` + pass to `ImageResponse` options. Planner determines source — either:
  - (a) Fetch Be Vietnam Pro from Google Fonts URL at build time
  - (b) Bundle a single .woff2 in `/public/fonts/` and read with `fs`
  - Recommend (a) for simplicity; cache hit on subsequent builds.
- **D-11:** Single OG image serves both `/` and `/du-an`. No per-page OG override. (Per-project OG deferred — Out of scope above.)
- **D-12:** Build emits PNG to `out/og.png`. Next auto-injects `<meta property="og:image" content="${siteUrl}/og.png">` into both root metadata AND `/du-an` metadata (inherits from root since `/du-an` doesn't override `openGraph`).
- **D-13:** Alt text for `og:image`: "Khang Thịnh Investment — Cung ứng VLXD, Xây dựng, Vận chuyển" (matches `metadata.title.default`). Set via `export const alt = '...'` in `opengraph-image.tsx`.
- **D-13b:** **Note on STACK.md guidance:** STACK.md ("OG image — static PNG, not ImageResponse") recommended Phase 1 use static PNG due to Satori CSS limits + Vietnamese diacritic risk. User intentionally overrode to `opengraph-image.tsx` because: (a) no designer available, (b) content is simple — only Latin uppercase brand name + diacritics in tagline. Planner MUST verify Vietnamese diacritic rendering during plan-phase research; if Satori fails on `Hợp tác cùng phát triển`, fallback strategy is: render only the ASCII portion + drop tagline OR commit a static PNG and revert to Static-PNG option mid-plan.

### 3. Favicon (SEO-05)

- **D-14:** Use Next 15's file-based icon convention — `src/app/icon.tsx` (renders 32×32) + `src/app/apple-icon.tsx` (renders 180×180). Both use `ImageResponse` to generate PNG at build time.
- **D-15:** Design: monogram "KT" on solid Burgundy block.
  - Background: `#6B1F1F` (Burgundy)
  - Text: "KT" in white `#FAF8F2` (Bone)
  - Font weight: black (900) — Be Vietnam Pro
  - Border-radius: ~15% of size (soft rounded corners — readable at 16×16)
  - Letter spacing: tight (-2% tracking) to fit in tiny canvas
- **D-16:** Sizes generated:
  - `icon.tsx` → 32×32 (used as 16×16 + 32×32 via browser scale)
  - `apple-icon.tsx` → 180×180 (iOS home-screen)
  - Next 15 auto-wires both into `<link rel="icon">` and `<link rel="apple-touch-icon">` in `<head>`
- **D-17:** SKIP `favicon.ico` (multi-resolution .ico file) — Next 15 docs say "favicon.ico optional if icon.tsx exists; modern browsers prefer PNG icon". Saves build complexity.
- **D-18:** Future swap to real logo: replace `icon.tsx` body (or add `icon.svg` next to it — SVG takes precedence) with brand SVG. Zero other code change.

### 4. 404 page (SEO-06)

- **D-19:** File: `src/app/not-found.tsx`. Server component (no `'use client'`).
- **D-20:** Layout: branded full-layout — Nav (top) + Footer (bottom) AUTOMATICALLY wrap via root `layout.tsx`. (Next 15: `not-found.tsx` renders inside root layout by default.)
- **D-21:** Page content:
  - Section bg: Burgundy `#6B1F1F`, min-h-[60vh], grid-place-items-center, py-24
  - Inner card (centered, max-w-2xl, text-bone):
    - Eyebrow: "404" (font-black, text-7xl, opacity 60%)
    - H1: "Không tìm thấy trang" (font-black, text-4xl md:text-5xl, mt-4)
    - Sub: "Đường dẫn bạn truy cập không tồn tại hoặc đã được di chuyển. Có thể bạn đang tìm những trang sau:" (text-lg, mt-6, opacity 90%)
    - Two CTA buttons (mt-10, flex gap-4 flex-wrap):
      - Primary: `← Về trang chủ` (Link to `/`, bone bg, burgundy text, font-bold)
      - Secondary: `Gọi tư vấn` (`<a href={telHref()}>`, outlined bone border, bone text)
- **D-22:** Page metadata (SEO defensive — prevent indexing):
  ```ts
  export const metadata: Metadata = {
    title: '404 — Không tìm thấy trang',
    robots: { index: false, follow: false }
  }
  ```
  Note: Static export — Next emits `out/404.html`; Cloudflare Pages auto-serves this for any unknown route. No middleware/edge needed.
- **D-23:** Do NOT add analytics tracking on 404 hits in code — defer to Cloudflare Web Analytics (Phase 6) which auto-logs path frequency.

### 5. Sitemap (SEO-01)

- **D-24:** File: `src/app/sitemap.ts`. Exports default function returning `MetadataRoute.Sitemap[]`.
- **D-25:** Two entries:
  - `{ url: siteUrl, lastModified: new Date(), changeFrequency: 'monthly', priority: 1.0 }`
  - `{ url: \`${siteUrl}/du-an\`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 }`
- **D-26:** `lastModified` uses `new Date()` (build-time timestamp) — acceptable for a low-velocity B2B site. NO file-mtime introspection (premature complexity).
- **D-27:** Build emits `out/sitemap.xml` (Next 15 default route handler output). Verify by `cat out/sitemap.xml` post-build.

### 6. Robots (SEO-02)

- **D-28:** File: `src/app/robots.ts`. Exports default function returning `MetadataRoute.Robots`.
- **D-29:** Content:
  ```ts
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
  ```
- **D-30:** Build emits `out/robots.txt`. Verify by `cat out/robots.txt` post-build.

### 7. Build & verification surfaces

- **D-31:** Phase 5 success = `npm run build` exits 0 AND produces all of:
  - `out/sitemap.xml` — valid XML, 2 URLs
  - `out/robots.txt` — single User-agent rule + sitemap line
  - `out/og.png` — 1200×630 PNG
  - `out/icon.png` (or icon-32x32.png) — 32×32 PNG
  - `out/apple-icon.png` — 180×180 PNG
  - `out/index.html` — contains `<script type="application/ld+json">` with both nodes
  - `out/404.html` — branded 404 with Nav/Footer rendered
- **D-32:** NO metadataBase warning in build output (already wired Phase 1, but verify after metadata changes don't regress).
- **D-33:** Rich Results Test (https://search.google.com/test/rich-results) validation is a Phase 6 audit gate — not blocking Phase 5 completion. Phase 5 only requires valid JSON.parse() of the embedded script.

### 8. Plan granularity

- **D-34:** 2 plans (matches roadmap estimate):
  - **05-01 — SEO infrastructure** (sitemap + robots): touches only NEW files `src/app/sitemap.ts`, `src/app/robots.ts`. Zero touch of existing pages. Wave 1.
  - **05-02 — Schema + Brand polish** (JSON-LD + OG + favicons + 404): touches NEW files `src/app/opengraph-image.tsx`, `src/app/icon.tsx`, `src/app/apple-icon.tsx`, `src/app/not-found.tsx` AND EDITS `src/app/page.tsx` (inject JSON-LD block). Wave 2 (depends on 05-01 only because both end with one final build verification together).
- **D-35:** Plans run sequentially (Wave 1 → Wave 2) — NOT parallel — because both edit the same `out/` directory during verification builds and `05-02` is conceptually "polish on top of infra". Token cost low for sequential here.

</decisions>

<context>
## Phase Reference Context

**Phase 1 foundations (already locked, reused in Phase 5):**
- `src/lib/site.ts` exports `siteUrl`, `company` (with `legalName`, `phoneE164`, `taxId`, `address`, `email`), `telHref()` — all NAP fields ready for JSON-LD + sitemap + 404 CTAs
- `src/app/layout.tsx` already has `metadataBase: new URL(siteUrl)` (line 22) — Phase 5 verifies no regression
- `themeColor: '#6B1F1F'` already in `viewport` (line 33) — matches Burgundy used in OG/favicon/404
- Title template `'%s | Khang Thịnh Investment'` already in `metadata.title.template` — `/du-an` already uses it correctly

**Phase 2 components (reused by 404 page):**
- `src/components/layout/Nav.tsx` + `Footer.tsx` auto-wrap `not-found.tsx` via root layout
- No new Nav/Footer changes needed in Phase 5

**Phase 3 sections (no overlap with Phase 5):**
- Landing sections in `src/components/sections/` — Phase 5 only adds a JSON-LD `<script>` to `page.tsx`, does not modify any section component

**Phase 4 `/du-an` (no overlap):**
- `/du-an` already has `alternates: { canonical: '/du-an' }` (page.tsx line 15) — Phase 5 sitemap simply lists the route, no metadata change needed

**Pitfalls watched in Phase 5:**
- Pitfall #6: phone in JSON-LD MUST be `+84921985599` (E.164) — locked D-06
- Pitfall #10: every URL in sitemap/OG must come from `siteUrl` env var — locked D-25, D-12
- Pitfall #14: default 404 — fixed via D-19..D-23
- Pitfall #15: metadataBase warning — verified D-32

**Verification surfaces Phase 6 will audit (not Phase 5):**
- Rich Results Test (Google) for JSON-LD validation
- Real Zalo/FB/Slack paste-link test for OG image rendering
- Lighthouse SEO score ≥ 95
- Real-device tap-target ≥ 44×44 on 404 CTAs
- Vietnamese native-reader copy review

## User Quotes / Direction Captured

- User on JSON-LD: "đây là mock à, hay sao, vì chưa làm BE mới làm FE à" → confirmed static-site context; locked Option D after explanation
- User on OG: locked Option B (`opengraph-image.tsx`) — code-driven, no static PNG
- User on favicon: locked Option A (monogram "KT" via `icon.tsx`)
- User on 404: locked Option B (branded full-layout with Nav/Footer + 2 CTAs)

</context>

<next_steps>
## Next Steps

1. Run `/gsd:plan-phase 5` — researcher pulls Next 15 ImageResponse + JSON-LD Schema.org best-practice references; planner produces:
   - `05-01-seo-infrastructure-PLAN.md` (sitemap + robots)
   - `05-02-schema-brand-polish-PLAN.md` (JSON-LD + OG + favicons + 404)
2. After plans approved → `/gsd:execute-phase 5` — Wave 1 then Wave 2 sequentially.
3. Phase 6 (Audit + Launch) consumes Phase 5 output unchanged — Rich Results, Lighthouse, real-device tests live in Phase 6.

</next_steps>
