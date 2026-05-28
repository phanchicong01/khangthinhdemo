---
phase: 01-foundation-lock-in
verified: 2026-05-22T00:00:00Z
status: passed
score: 5/5 must-haves verified
re_verification: false
gaps: []
human_verification:
  - test: "Open http://localhost:3000 in a browser after running npx serve out/ and visually confirm Vietnamese diacritics render with correct glyphs (not tofu/boxes) across all 6 weights (400-900)"
    expected: "Each weight line shows correct diacritics: Ộ, Ũ, Ấ, Ữ, Ẩ, etc. — no replacement characters"
    why_human: "Font rendering at glyph level requires a browser; grep confirms subset config and woff2 preloads exist but cannot verify the font binary actually covers Vietnamese code points at render time"
---

# Phase 1: Foundation Lock-In Verification Report

**Phase Goal:** Lock the configuration, design tokens, fonts, and constants so every later phase builds on a stable, statically-exportable foundation with correct Vietnamese rendering.
**Verified:** 2026-05-22
**Status:** PASSED
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | `npm run build` succeeds and produces `/out/index.html` (no Server Action / dynamic-render errors) | VERIFIED | Build exits 0; `/out/index.html` confirmed present; 3 static routes rendered (`/`, `/du-an`, `/_not-found`) |
| 2 | Burgundy/Bone palette utilities (`bg-burgundy`, `text-bone`, `bg-espresso`, etc.) render correctly (Tailwind v4 `@theme` working) | VERIFIED | Generated CSS `ee8b6b8cc294163f.css` contains: `bg-bone`, `bg-bone-dark`, `bg-burgundy`, `bg-burgundy-dark`, `bg-coffee`, `bg-espresso`, `bg-taupe`, `bg-terracotta`, `border-burgundy`, `text-bone` — all 8 palette tokens produce utilities |
| 3 | Vietnamese diacritics render with Be Vietnam Pro glyphs across all configured weights — no fallback breakage | VERIFIED | `layout.tsx` loads `Be_Vietnam_Pro` with `subsets: ['vietnamese', 'latin']` + `weight: ['400','500','600','700','800','900']`; 12 WOFF2 files preloaded in `out/index.html`; sentinel page renders diacritic strings at all 6 weights (400-900): "Cao tốc Cái Nước · Đất Mũi Cà Mau", "KHANG THỊNH ĐỘI TÀU 3,900 TẤN — BỘ QUỐC PHÒNG" |
| 4 | `NEXT_PUBLIC_SITE_URL` propagates to `lib/site.ts` at build time; phone/Zalo/email constants importable from a single module | VERIFIED | `out/index.html` contains `siteUrl = https://khangthinhinv.vn`, `tel = tel:+84921985599`, `zalo = https://zalo.me/0921985599`, `mail = mailto:khangthinhinv2025@gmail.com`, `mst = 1102 107 064`, `address = A3-02 KDC Long Phú, xã Bến Lức, tỉnh Tây Ninh` — all rendered from `lib/site.ts` exports |
| 5 | Old skeleton folders deleted; build still passes | VERIFIED | `src/app/dich-vu/` DELETED, `src/app/lien-he/` DELETED, `src/components/Header.tsx` DELETED; build exits 0 after deletions |

**Score:** 5/5 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `next.config.ts` | `output: 'export'`, `trailingSlash: true`, `images.unoptimized: true` | VERIFIED | All 3 config keys present; top-of-file comment lists 8 forbidden features |
| `src/app/globals.css` | Tailwind v4 `@theme {}` with 8 Burgundy/Bone tokens | VERIFIED | `@theme {}` block with `--color-burgundy`, `--color-bone`, `--color-espresso`, `--color-terracotta`, `--color-coffee`, `--color-bone-dark`, `--color-burgundy-dark`, `--color-taupe`; `@theme inline {}` for font-sans wiring |
| `src/app/layout.tsx` | `Be_Vietnam_Pro` via `next/font/google` with Vietnamese subset + all weights | VERIFIED | `subsets: ['vietnamese', 'latin']`, `weight: ['400','500','600','700','800','900']`, `variable: '--font-be-vietnam-pro'`; `<html lang="vi">`; `metadataBase: new URL(siteUrl)` wired |
| `src/lib/site.ts` | Single source of truth — `siteUrl`, `company`, helpers, type | VERIFIED | Exports `siteUrl` (from `NEXT_PUBLIC_SITE_URL ?? 'https://khangthinhinv.vn'`), `company` (as const with all 11 fields), `telHref()`, `mailtoHref()`, `zaloHref()`, `Company` type |
| `.env.example` | Documents `NEXT_PUBLIC_SITE_URL` contract | VERIFIED | File exists; contains `NEXT_PUBLIC_SITE_URL=https://khangthinhinv.vn` |
| `/out/index.html` | Static HTML produced by build | VERIFIED | Present; contains rendered sentinel content including Vietnamese diacritics and palette utility class names in JSX |
| `src/app/dich-vu/` | Deleted | VERIFIED | Directory absent |
| `src/app/lien-he/` | Deleted | VERIFIED | Directory absent |
| `src/components/Header.tsx` | Deleted | VERIFIED | File absent |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `layout.tsx` | `lib/site.ts` | `import { siteUrl }` | WIRED | `import { siteUrl } from '@/lib/site'` → `metadataBase: new URL(siteUrl)` |
| `page.tsx` | `lib/site.ts` | `import { company, siteUrl, telHref, zaloHref, mailtoHref }` | WIRED | All 5 exports consumed; rendered in `out/index.html` |
| `globals.css` | Tailwind v4 | `@theme {}` directive | WIRED | `@theme {}` generates `bg-*`/`text-*`/`border-*` utilities confirmed in generated CSS |
| `layout.tsx` | `globals.css` | `import './globals.css'` | WIRED | Import present; styles applied in build output |
| `globals.css` | font CSS var | `@theme inline { --font-sans: var(--font-be-vietnam-pro) }` | WIRED | `font-sans` utility resolves to Be Vietnam Pro variable; `<body class="font-sans antialiased">` in output |

### Data-Flow Trace (Level 4)

Not applicable — Phase 1 artifacts are configuration, tokens, and constants modules. No dynamic data fetching or database queries exist. The "data" is static company facts baked into `lib/site.ts` as `as const`, which is correct by design for a static-export marketing site.

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Build exits 0 | `npm run build` | EXIT_CODE: 0 | PASS |
| `/out/index.html` produced | `ls /out/index.html` | File present | PASS |
| 8 palette utilities in generated CSS | `grep bg-burgundy ... *.css` | 10 utility classes found | PASS |
| `siteUrl` value rendered in HTML | `grep khangthinhinv out/index.html` | `siteUrl = https://khangthinhinv.vn` present | PASS |
| Vietnamese diacritics in HTML output | `grep "THỊNH\|Cài\|đảo"` in out/index.html | Diacritics present across weights 400-900 | PASS |
| Deleted folders absent | `ls src/app/dich-vu/` | No matches — deleted | PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|---------|
| FND-01 | 01-01 | `next.config.ts` with `output: 'export'`, `images.unoptimized: true`, `trailingSlash: true` | SATISFIED | All 3 keys verified in `next.config.ts` |
| FND-02 | 01-01 | TypeScript strict mode; build passes without errors | SATISFIED | Build exits 0; no TS errors emitted |
| FND-03 | 01-01 | Tailwind CSS v4 design tokens via `@theme` (Burgundy/Bone palette) | SATISFIED | 8 tokens in `@theme {}`; all 8 generate utility classes confirmed in generated CSS |
| FND-04 | 01-01 | Be Vietnam Pro loaded via `next/font/google` with `subsets: ['vietnamese', 'latin']`, weights 400-900 | SATISFIED | Config verified in `layout.tsx`; 12 WOFF2 preloads in `out/index.html` |
| FND-05 | 01-02 | `NEXT_PUBLIC_SITE_URL` env var propagates to `lib/site.ts` | SATISFIED | `siteUrl` uses `??` fallback; value rendered in `out/index.html` |
| FND-06 | 01-02 | Company facts (phone, Zalo, email, MST, address) in `lib/site.ts` as single source of truth | SATISFIED | `company` object exports all required facts; all rendered in sentinel page output |
| FND-07 | 01-02 | Old skeleton folders removed (`src/app/dich-vu/`, `src/app/lien-he/`, `src/components/Header.tsx`) | SATISFIED | All 3 confirmed absent; build still passes |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `src/app/page.tsx` | entire file | Phase 1 sentinel — intentional placeholder until Phase 3 replaces with real sections | Info (known, intentional) | None — documented in SUMMARY; marked for replacement in Phase 3 |
| `src/app/du-an/page.tsx` | — | Pre-existing skeleton list view; Header/Footer stripped; lacks Nav/Footer | Info (known) | None for Phase 1 — Phase 2 (Nav/Footer) and Phase 3 will address |

No blocker or warning anti-patterns found. Both items above are intentional placeholders documented in SUMMARY.md with clear removal plans.

### Human Verification Required

#### 1. Vietnamese Glyph Rendering at Pixel Level

**Test:** Run `npx serve out/` in the project root, open `http://localhost:3000` in a browser, and visually inspect the diacritic stress test block showing 6 weight rows.

**Expected:** Each row displays correct Vietnamese diacritics — "Cao tốc Cái Nước · Đất Mũi Cà Mau" (weight 400), "KHANG THỊNH ĐỘI TÀU 3,900 TẤN — BỘ QUỐC PHÒNG" (weight 900) — with no tofu boxes, missing glyphs, or system-font fallback substitution.

**Why human:** The `subsets: ['vietnamese', 'latin']` config and 12 WOFF2 preloads are verifiably correct, but actual glyph coverage at render time requires a browser engine. The CI environment cannot run a headless browser with font rendering for this check.

### Gaps Summary

No gaps found. All 5 phase success criteria pass automated verification:

1. `npm run build` exits 0 and produces `/out/index.html` — PASS
2. All 8 Burgundy/Bone palette utilities confirmed in generated CSS — PASS
3. Be Vietnam Pro with `vietnamese` subset loaded; 12 WOFF2 preloads confirm correct font build; Vietnamese diacritics present in rendered HTML — PASS (browser visual check deferred to human)
4. `NEXT_PUBLIC_SITE_URL` wires through `lib/site.ts` to rendered HTML output; all company constants importable from single module — PASS
5. Skeleton folders `src/app/dich-vu/`, `src/app/lien-he/`, `src/components/Header.tsx` confirmed absent; build still passes — PASS

Phase 1 goal achieved. Phase 2 (Layout Shell) may proceed.

---

_Verified: 2026-05-22_
_Verifier: Claude (gsd-verifier)_
