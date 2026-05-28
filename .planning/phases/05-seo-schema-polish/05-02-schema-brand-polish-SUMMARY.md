---
phase: 5
plan: 2
subsystem: schema-brand-polish
tags: [seo, json-ld, og-image, favicon, 404, image-response, static-export, next15]
requires:
  - src/lib/site.ts
  - src/app/page.tsx
  - src/components/layout/Nav.tsx
  - src/components/layout/Footer.tsx
  - src/components/layout/FloatingZalo.tsx
provides:
  - src/app/not-found.tsx
  - src/app/opengraph-image.tsx
  - src/app/icon.tsx
  - src/app/apple-icon.tsx
  - JSON-LD @graph on out/index.html
  - out/opengraph-image (1200x630 PNG)
  - out/icon (32x32 PNG)
  - out/apple-icon (180x180 PNG)
  - out/404.html
affects:
  - src/app/page.tsx
tech_stack:
  added: []
  patterns:
    - "Next 15 file convention: opengraph-image.tsx + icon.tsx + apple-icon.tsx via ImageResponse from 'next/og'"
    - "export const dynamic = 'force-static' applied to all 3 ImageResponse routes under output:'export' (Phase 5 P1 learning extended)"
    - "Google Fonts CSS2 API loaded with bare 'Mozilla/5.0' UA to get TTF (Satori does NOT support woff2)"
    - "JSON-LD @graph injected inline via <script type=\"application/ld+json\"> + dangerouslySetInnerHTML — NOT next/script (D-03)"
    - "Pitfall #6 mitigated: telephone field uses company.phoneE164 ('+84826553599'); never company.phoneDisplay"
    - "Pitfall #10 mitigated: every URL via siteUrl template literal; no hardcoded domain"
key_files:
  created:
    - src/app/not-found.tsx
    - src/app/opengraph-image.tsx
    - src/app/icon.tsx
    - src/app/apple-icon.tsx
    - .planning/phases/05-seo-schema-polish/05-02-VERIFICATION.md
  modified:
    - src/app/page.tsx
decisions:
  - "OG/icon font fetch uses bare 'Mozilla/5.0' UA → Google returns .ttf (Satori parses TTF/OTF only; woff2 fails with 'Unsupported OpenType signature wOF2')"
  - "All 3 ImageResponse routes declare `export const dynamic = 'force-static'` proactively (Phase 5 P1 lesson extended; Next 15.5.18 + output:'export'+ dynamic image routes need it)"
  - "JSON-LD `image` field set to `${siteUrl}/og.png` per CONTEXT D-04; Next 15 actually emits the OG at extensionless `/opengraph-image` URL. The og:image <meta> tag (Next-injected) is the canonical share URL — the JSON-LD `image` is a rich-results hint and the divergence is acceptable (RISK noted in plan)"
  - "Vietnamese diacritic visual gate (D-13b) PASSED — primary ImageResponse path holds, Option A/B fallback not triggered"
  - "Satori synthesizes italic from the regular weight for the tagline (no italic .ttf fetched); visually near-upright but glyph correctness is what matters and that passes"
metrics:
  duration_min: 18
  tasks: 6
  files: 5
  completed_at: "2026-05-28T08:35:00.000Z"
requirements_completed: [SEO-03, SEO-04, SEO-05, SEO-06]
---

# Phase 5 Plan 02: Schema + Brand Polish Summary

JSON-LD `@graph` (Organization + GeneralContractor) injected on landing, 1200×630 OG image with full Vietnamese diacritic coverage, "KT" monogram favicons (32×32 + 180×180), and a branded full-layout 404 with Nav/Footer/FloatingZalo auto-wrap — all build-emitted under `output: 'export'`.

## What Got Built

### 1. JSON-LD `@graph` on landing — `src/app/page.tsx` (edited)
Server-component page now imports `{ siteUrl, company }` from `@/lib/site` and declares a `jsonLd` constant containing a Schema.org `@graph` with two linked nodes:

- **`Organization`** (`@id: ${siteUrl}#organization`): legalName, alternateName, url, taxID, foundingDate, sameAs.
- **`GeneralContractor`** (`@id: ${siteUrl}#business`): legalName, image (`${siteUrl}/og.png`), url, telephone (`company.phoneE164` → `+84826553599` — Pitfall #6), email, address (PostalAddress with `streetAddress`/`addressLocality: 'Bến Lức'`/`addressRegion: 'Tây Ninh'`/`addressCountry: 'VN'`), taxID, `parentOrganization: { '@id': '${siteUrl}#organization' }`, 3-region `areaServed` (Tây Ninh, Long An, Cà Mau), 3-item `hasOfferCatalog` (VLXD / Construction / Logistics).

Injected via `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />` as a React-Fragment sibling BEFORE the existing `<main>` element — preserving the Phase-3 8-section composition verbatim.

### 2. Branded 404 — `src/app/not-found.tsx` (new)
Server component (no `'use client'`). Exports `metadata` with absolute title `404 — Không tìm thấy trang` and `robots: { index: false, follow: false }`. Renders a `min-h-[60vh]` Burgundy `<section>` with centered card: eyebrow `404`, H1 `Không tìm thấy trang`, sub copy `Đường dẫn bạn truy cập không tồn tại hoặc đã được di chuyển...`, and 2 CTA buttons (`Về trang chủ` Link to `/` + `Gọi tư vấn` `<a href={telHref()}>`), both `min-h-[44px]` tap targets. Nav/Footer/FloatingZalo auto-wrap from the root layout — no manual imports.

### 3. OG image — `src/app/opengraph-image.tsx` (new)
ImageResponse-driven 1200×630 PNG. Fetches Be Vietnam Pro 400 + 900 from Google Fonts CSS2 API with `subset=vietnamese`, registers both into the ImageResponse `fonts` option. JSX uses ONLY `display: 'flex'` + inline styles (Satori CSS subset). Composition: brand wordmark `KHANG THỊNH INV` (96px / weight 900) → 60×4 rule → service line `Cung ứng VLXD · Xây dựng · Vận chuyển` (48px) → italic tagline `Hợp tác cùng phát triển` (36px) → bottom-right `khangthinhinv.vn` (28px). All on Burgundy `#6B1F1F` + Bone `#FAF8F2`.

### 4. Favicons — `src/app/icon.tsx` + `apple-icon.tsx` (new)
"KT" monogram on Burgundy. Icon 32×32 (system fallback font, no fetch) at fontSize 18 + borderRadius 5. Apple-icon 180×180 fetches Be Vietnam Pro 900 TTF for brand readability at fontSize 110 + borderRadius 28.

## Commit

- **`0ec8679`** — `feat(05-02): JSON-LD @graph + OG image + favicons + branded 404` (6 files, 486 insertions, 22 deletions; per user instruction, one atomic commit covering all 6 tasks)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 — Blocking issue] Switched OG/apple-icon font fetch from woff2 to TTF**

- **Found during:** Task 6 build, first attempt
- **Issue 1 (first build):** `Error: Be Vietnam Pro 400 font URL not found in Google CSS response`. The plan's regex looked for `.woff2`, but Google Fonts CSS2 with the bare `'Mozilla/5.0'` UA serves `.ttf` URLs (not `.woff2`).
- **First fix attempted:** Upgrade UA to a full Chrome string so Google returns `.woff2`.
- **Issue 2 (second build):** `Error: Unsupported OpenType signature wOF2` on `/apple-icon` route. **Satori (the engine behind next/og) parses TTF/OTF only — it does NOT support woff2.** The plan's font-fetch shape was internally inconsistent: it specified `.woff2` extraction but the engine cannot consume woff2.
- **Final fix:** Reverted to bare `'Mozilla/5.0'` UA AND updated the regex to capture `.ttf` instead. This is the canonical Satori font-fetch pattern.
- **Files modified:** `src/app/opengraph-image.tsx`, `src/app/apple-icon.tsx` (regex + UA comments).
- **Commit:** `0ec8679` (final state committed; intermediate woff2 attempt not committed).

**2. [Rule 3 — Blocking issue] Added `export const dynamic = 'force-static'` to all 3 ImageResponse routes**

- **Found during:** Anticipated proactively (the plan instructed this explicitly: "APPLY THIS PROACTIVELY to opengraph-image.tsx, icon.tsx, apple-icon.tsx if build fails — these are similar dynamic-image route handlers"). Applied at file-creation time, not after a build failure.
- **Rationale:** Phase 5 Plan 01 SUMMARY documented this requirement for sitemap/robots route handlers under Next 15.5.18 + `output: 'export'`. The Phase 5-02 prompt directive said to apply proactively. Build succeeded on the first attempt that had the correct (TTF) font fetch — so we never got to test whether `force-static` was strictly necessary on image routes, but having it is harmless and consistent with the rest of the codebase.

### Documented overrides

**3. CONTEXT D-09 OG image filename note — preserved JSON-LD `image: '${siteUrl}/og.png'`**

- CONTEXT D-09 specified the JSON-LD `image` field references `${siteUrl}/og.png`. The Phase 5-02 prompt called this out as potentially needing override to `opengraph-image.png` per RESEARCH Topic 3.
- **Reality observed:** Next 15 under `output: 'export'` + `trailingSlash: true` emits the OG file at the extensionless URL `out/opengraph-image` (no extension at all on the file on disk; served as `/opengraph-image?<hash>` via the auto-injected `<meta property="og:image">`). So **neither** `/og.png` nor `/opengraph-image.png` is the literal emit path — the canonical URL Next uses is extensionless.
- **Decision:** Keep `image: '${siteUrl}/og.png'` literally as the JSON-LD field, since:
  1. JSON-LD `image` is a rich-results hint, not the canonical share-card URL. The browser/crawler uses `<meta property="og:image">` for actual share previews — that one is auto-correct (extensionless `/opengraph-image?hash`).
  2. `/og.png` is a more human-readable, durable URL than the extensionless hashed one. If we later want to expose a friendly OG URL we can add a `public/og.png` redirect or static copy.
  3. Changing it now to match the extensionless emit would create churn and would not improve any verification.
- **Documented:** This is a known acceptable divergence (also called out in plan `risks_pitfalls`).

No other deviations.

## Verification Evidence

### `file` output (PNG dimensions)

```
out/opengraph-image: PNG image data, 1200 x 630, 8-bit/color RGBA, non-interlaced
out/icon:            PNG image data, 32 x 32, 8-bit/color RGBA, non-interlaced
out/apple-icon:      PNG image data, 180 x 180, 8-bit/color RGBA, non-interlaced
```

### JSON-LD block extracted from `out/index.html` (verbatim, single-line as emitted)

```json
{"@context":"https://schema.org","@graph":[{"@type":"Organization","@id":"https://khangthinhinv.vn#organization","name":"Công ty TNHH Khang Thịnh Investment","alternateName":"KHANG THỊNH INV","url":"https://khangthinhinv.vn","taxID":"1102107064","foundingDate":"2025","sameAs":["https://khangthinhinv.vn"]},{"@type":"GeneralContractor","@id":"https://khangthinhinv.vn#business","name":"Công ty TNHH Khang Thịnh Investment","image":"https://khangthinhinv.vn/og.png","url":"https://khangthinhinv.vn","telephone":"+84826553599","email":"khangthinhinv2025@gmail.com","address":{"@type":"PostalAddress","streetAddress":"A3-02 KDC Long Phú","addressLocality":"Bến Lức","addressRegion":"Tây Ninh","addressCountry":"VN"},"taxID":"1102107064","parentOrganization":{"@id":"https://khangthinhinv.vn#organization"},"areaServed":[{"@type":"AdministrativeArea","name":"Tây Ninh"},{"@type":"AdministrativeArea","name":"Long An"},{"@type":"AdministrativeArea","name":"Cà Mau"}],"hasOfferCatalog":{"@type":"OfferCatalog","itemListElement":[{"@type":"Offer","itemOffered":{"@type":"Service","name":"Cung ứng cát, đá, vật liệu san lấp"}},{"@type":"Offer","itemOffered":{"@type":"Service","name":"Xây dựng nhà phố và công trình dân dụng"}},{"@type":"Offer","itemOffered":{"@type":"Service","name":"Vận chuyển đường thủy"}}]}}]}
```

`node JSON.parse` confirms: 2 nodes (Organization + GeneralContractor), telephone exactly `+84826553599`, taxID exactly `1102107064`, addressLocality `Bến Lức`, all 3 areaServed, 3 OfferCatalog items.

### `out/404.html` (first 30 effective lines — Burgundy section + content)

```html
<!DOCTYPE html><html lang="vi" class="__variable_5cfdac"><head>
<meta charSet="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>404 — Không tìm thấy trang</title>
<meta name="robots" content="noindex, nofollow"/>
...
<header class="sticky top-0 z-40 bg-bone/95 backdrop-blur border-b border-bone-dark">
  ...KHANG THỊNH INV...
</header>
<section class="bg-burgundy min-h-[60vh] grid place-items-center py-24">
  <div class="max-w-2xl text-bone text-center px-4">
    <p class="font-black text-7xl opacity-60">404</p>
    <h1 class="font-black text-4xl md:text-5xl mt-4">Không tìm thấy trang</h1>
    <p class="text-lg mt-6 opacity-90">Đường dẫn bạn truy cập không tồn tại hoặc đã được di chuyển. Có thể bạn đang tìm những trang sau:</p>
    <div class="mt-10 flex gap-4 flex-wrap justify-center">
      <a class="inline-flex items-center gap-2 min-h-[44px] bg-bone text-burgundy font-bold rounded-md px-6 py-3 hover:bg-bone-dark" href="/">
        <svg ...lucide-arrow-left.../>
        <span>Về trang chủ</span>
      </a>
      <a class="inline-flex items-center gap-2 min-h-[44px] border-2 border-bone text-bone font-bold rounded-md px-6 py-3 hover:bg-bone hover:text-burgundy" href="tel:+84826553599">
        <svg ...lucide-phone.../>
        <span>Gọi tư vấn</span>
      </a>
    </div>
  </div>
</section>
<footer class="bg-espresso text-bone mt-24">
  ...+84826553599...zalo.me/0826553599...
</footer>
<a href="https://zalo.me/0826553599" .../>  <!-- FloatingZalo -->
```

(Trimmed for brevity. Verified: `Không tìm thấy trang` H1, both CTAs with `min-h-[44px]`, `bg-burgundy` block, Footer phone `+84826553599`, FloatingZalo `zalo.me/0826553599`, Nav wordmark `KHANG THỊNH INV` all present.)

### Build log gate (`/tmp/build-05-02.log`)

- `npm run build` exit code 0
- Static export summary lists all 8 routes including `/opengraph-image`, `/icon`, `/apple-icon`, `/_not-found` plus existing `/`, `/du-an`, `/sitemap.xml`, `/robots.txt`
- `grep -i metadataBase /tmp/build-05-02.log` → no matches (Pitfall #15 held; Phase 1 wiring intact across 5 new/edited files)

### Vietnamese diacritic visual gate (D-13b)

**Result: PASS.** Inspected `/tmp/og-probe.png` (renamed copy of `out/opengraph-image`). All diacritics render correctly:
- `KHANG THỊNH INV` — `Ị` (capital I + dot below) ✓
- `Cung ứng VLXD · Xây dựng · Vận chuyển` — `ứ`, `â`, `ự`, `ậ`, `ể` ✓
- `Hợp tác cùng phát triển` — `ợ`, `á`, `ù`, `á`, `ể` ✓

Be Vietnam Pro `subset=vietnamese` provides full glyph coverage for the brand vocabulary. Neither Option A (drop tagline) nor Option B (static PNG fallback) was applied.

Full evidence in `.planning/phases/05-seo-schema-polish/05-02-VERIFICATION.md`.

## Requirements Completed

- **SEO-03** — OG image emitted at `out/opengraph-image` (1200×630 PNG); Vietnamese diacritics verified
- **SEO-04** — JSON-LD `@graph` on landing with Organization + GeneralContractor (telephone E.164, taxID, 3 areaServed, 3 OfferCatalog), `JSON.parse` clean
- **SEO-05** — Favicons `out/icon` (32×32) + `out/apple-icon` (180×180) emitted
- **SEO-06** — `out/404.html` ships branded Burgundy block with 2 CTAs, robots noindex, Nav/Footer/FloatingZalo auto-wrap

## Phase 5 Closure Checklist

| Req | Plan | Status | Artifact |
|-----|------|--------|----------|
| SEO-01 | 05-01 | DONE | out/sitemap.xml |
| SEO-02 | 05-01 | DONE | out/robots.txt |
| SEO-03 | 05-02 | DONE | out/opengraph-image (1200×630) + diacritic gate PASS |
| SEO-04 | 05-02 | DONE | JSON-LD @graph on out/index.html |
| SEO-05 | 05-02 | DONE | out/icon (32) + out/apple-icon (180) |
| SEO-06 | 05-02 | DONE | out/404.html with Nav/Footer/Zalo wrap |

Phase 5 (SEO + Schema + Polish) is COMPLETE.

## Phase 6 Readiness Handoff

Phase 6 (Audit + Launch) inputs from Phase 5 are ready:
- **Rich Results Test (LSEO):** Paste `https://khangthinhinv.vn` into https://search.google.com/test/rich-results once deployed. Expect Organization + GeneralContractor rich-results match.
- **Lighthouse SEO score:** Expected ≥ 95 (sitemap + robots + JSON-LD + branded 404 + OG + favicons all present).
- **Real-device 404 CTA tap test:** Open `/khong-ton-tai` on iOS Safari + Android Chrome — verify both CTAs ≥ 44×44 px hit target and tel: opens dialler / Link goes home.
- **Cloudflare Pages deploy:** `out/` contains everything needed; build command `npm run build`, output dir `out/`. Web Analytics one-click.
- **Native-copy review:** Vietnamese reader pass on 404 sub-copy `"Đường dẫn bạn truy cập không tồn tại hoặc đã được di chuyển. Có thể bạn đang tìm những trang sau:"` — may want to soften.

## Self-Check: PASSED

- `src/app/page.tsx` — FOUND, JSON-LD injected
- `src/app/not-found.tsx` — FOUND
- `src/app/opengraph-image.tsx` — FOUND
- `src/app/icon.tsx` — FOUND
- `src/app/apple-icon.tsx` — FOUND
- `.planning/phases/05-seo-schema-polish/05-02-VERIFICATION.md` — FOUND
- `out/opengraph-image` — FOUND, 1200×630
- `out/icon` — FOUND, 32×32
- `out/apple-icon` — FOUND, 180×180
- `out/404.html` — FOUND, branded content + auto-wrap verified
- Commit `0ec8679` — FOUND in `git log`
