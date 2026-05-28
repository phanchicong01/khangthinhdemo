# Phase 5 Plan 02 — Build Verification

**Date:** 2026-05-28
**Verifier:** GSD executor (Claude Opus 4)
**Build log:** `/tmp/build-05-02.log`
**Plan:** 05-02-schema-brand-polish

## Artifact Gate Results (per CONTEXT D-31)

| # | Artifact | Path on disk | Required dims/content | Status |
|---|----------|--------------|-----------------------|--------|
| 1 | sitemap.xml | `out/sitemap.xml` | 2 URLs (siteUrl + /du-an) | PASS (05-01 intact) |
| 2 | robots.txt | `out/robots.txt` | Allow / + sitemap + host | PASS (05-01 intact) |
| 3 | OG image | `out/opengraph-image` (Next 15 emits extensionless under output:'export') | 1200×630 PNG | PASS |
| 4 | Favicon 32 | `out/icon` (extensionless) | 32×32 PNG | PASS |
| 5 | Apple icon | `out/apple-icon` (extensionless) | 180×180 PNG | PASS |
| 6 | JSON-LD on landing | `out/index.html` `<script type="application/ld+json">` | Org + GeneralContractor `@graph`, JSON.parse-able | PASS |
| 7 | 404 branded | `out/404.html` | Burgundy block + "Không tìm thấy trang" H1 + 2 CTAs + noindex meta + Nav/Footer/FloatingZalo auto-wrap | PASS |

`file` output verbatim:
```
out/opengraph-image: PNG image data, 1200 x 630, 8-bit/color RGBA, non-interlaced
out/icon:            PNG image data, 32 x 32, 8-bit/color RGBA, non-interlaced
out/apple-icon:      PNG image data, 180 x 180, 8-bit/color RGBA, non-interlaced
```

Browser-served URLs (auto-injected by Next 15 into `<head>`):
- `<meta property="og:image" content="https://khangthinhinv.vn/opengraph-image?b9545a3ad717c00a"/>`
- `<link rel="icon" href="/icon?6cc08bbf53a302d4" type="image/png" sizes="32x32"/>`
- `<link rel="apple-touch-icon" href="/apple-icon?4071949bc43bf334" type="image/png" sizes="180x180"/>`

## Pitfall Gates

- **Pitfall #6 (E.164 phone)** — JSON-LD `telephone` = `"+84826553599"` — verified via `node JSON.parse` string equality. **HELD.**
- **Pitfall #10 (URLs from siteUrl)** — No raw `khangthinhinv.vn` literal in `src/app/page.tsx` (all JSON-LD URLs interpolate `${siteUrl}`). **HELD.**
- **Pitfall #14 (default 404)** — `out/404.html` exists with branded content. **HELD.**
- **Pitfall #15 (metadataBase warning)** — `grep -i metadataBase /tmp/build-05-02.log` → no matches. **HELD.**

## Vietnamese Diacritic Visual Probe (D-13b) — MANDATORY GATE

**Method:** Opened `out/opengraph-image` (copied to `/tmp/og-probe.png` with extension) in macOS Preview AND loaded inline via the multimodal image tool. Inspected glyphs at full 1200×630 resolution.

**Strings inspected:**
- Brand wordmark: `KHANG THỊNH INV` — "Ị" (capital I with dot below) renders correctly.
- Service line: `Cung ứng VLXD · Xây dựng · Vận chuyển` — `ứ`, `â`, `ự`, `ậ`, `ể` all render with the correct base + diacritic, no missing glyphs, no boxes (□), no stacked-on-wrong-base marks.
- Tagline: `Hợp tác cùng phát triển` — `ợ`, `á`, `ù`, `á`, `ể` all render correctly.

**Result: PASS** — Vietnamese diacritics render correctly across all three lines. The Be Vietnam Pro Vietnamese subset (loaded via Google Fonts CSS2 `subset=vietnamese`) provides full glyph coverage for Khang Thịnh's brand vocabulary.

**Minor note (not a failure):** Satori's synthesized italic for the tagline (no italic .ttf fetched, only weight-400 normal) is visually almost indistinguishable from upright. This is acceptable — glyphs are correct; the italic styling was a typographic nicety, not a content requirement. No fallback action needed.

**Neither Option A nor Option B applied** — the primary ImageResponse path holds.

## Favicon Visual Probe

- `out/icon` (32×32) — "KT" monogram clearly legible on Burgundy block with rounded corners. System fallback font sufficient at this size (per RESEARCH Topic 4).
- `out/apple-icon` (180×180) — "KT" monogram in bold Be Vietnam Pro 900, well-centered, soft 28px border-radius matches D-15 spec.

## Build Log Excerpt

```
✓ Compiled successfully in 3.6s
✓ Generating static pages (10/10)
✓ Exporting (2/2)

Route (app)                                 Size  First Load JS
┌ ○ /                                      797 B         103 kB
├ ○ /_not-found                            138 B         103 kB
├ ○ /apple-icon                            138 B         103 kB
├ ○ /du-an                                 174 B         107 kB
├ ○ /icon                                  138 B         103 kB
├ ○ /opengraph-image                       138 B         103 kB
├ ○ /robots.txt                            138 B         103 kB
└ ○ /sitemap.xml                           138 B         103 kB
```

All 8 routes prerendered as static content. The only build warning is the pre-existing multi-lockfile warning (unrelated, pre-existing per 05-01 SUMMARY).

## JSON-LD Block (verbatim from out/index.html)

```json
{"@context":"https://schema.org","@graph":[{"@type":"Organization","@id":"https://khangthinhinv.vn#organization","name":"Công ty TNHH Khang Thịnh Investment","alternateName":"KHANG THỊNH INV","url":"https://khangthinhinv.vn","taxID":"1102107064","foundingDate":"2025","sameAs":["https://khangthinhinv.vn"]},{"@type":"GeneralContractor","@id":"https://khangthinhinv.vn#business","name":"Công ty TNHH Khang Thịnh Investment","image":"https://khangthinhinv.vn/og.png","url":"https://khangthinhinv.vn","telephone":"+84826553599","email":"khangthinhinv2025@gmail.com","address":{"@type":"PostalAddress","streetAddress":"A3-02 KDC Long Phú","addressLocality":"Bến Lức","addressRegion":"Tây Ninh","addressCountry":"VN"},"taxID":"1102107064","parentOrganization":{"@id":"https://khangthinhinv.vn#organization"},"areaServed":[{"@type":"AdministrativeArea","name":"Tây Ninh"},{"@type":"AdministrativeArea","name":"Long An"},{"@type":"AdministrativeArea","name":"Cà Mau"}],"hasOfferCatalog":{"@type":"OfferCatalog","itemListElement":[{"@type":"Offer","itemOffered":{"@type":"Service","name":"Cung ứng cát, đá, vật liệu san lấp"}}, {"@type":"Offer","itemOffered":{"@type":"Service","name":"Xây dựng nhà phố và công trình dân dụng"}}, {"@type":"Offer","itemOffered":{"@type":"Service","name":"Vận chuyển đường thủy"}}]}}]}
```

(Whitespace added between adjacent Offer objects for readability; actual emit is single-line.)

## OVERALL VERIFICATION: PASS

All 7 build artifacts present at correct dimensions/content. All 4 pitfall gates held. Vietnamese diacritic gate PASSED — primary ImageResponse path holds; neither Option A nor Option B fallback triggered.

Plan 05-02 ready for commit.
