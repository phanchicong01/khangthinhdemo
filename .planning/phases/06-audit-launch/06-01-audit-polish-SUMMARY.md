---
phase: 6
plan: 1
subsystem: audit-polish
tags: [audit, lighthouse, responsive, a11y, config]
requires:
  - Phase 5 SEO infrastructure (sitemap, JSON-LD, OG image, branded 404)
  - Phase 2 layout shell (Nav, Footer)
  - Phase 1 next.config (output:export, trailingSlash, images.unoptimized)
provides:
  - Resolved Phase 2 deferred-item #1 (outputFileTracingRoot warning)
  - AUDIT GATE = PASS verdict (unblocks Wave 2 / Plan 06-02)
  - 2 Lighthouse mobile reports as evidence artifacts
  - 6 fixes in Nav.tsx + Footer.tsx for WCAG 2.5.5 tap-target compliance
affects:
  - src/components/layout/Nav.tsx (tap-target hit areas)
  - src/components/layout/Footer.tsx (tap-target hit areas)
  - next.config.ts (outputFileTracingRoot)
tech-stack:
  added:
    - Lighthouse 12.8.2 (dev-time audit tool, npx)
    - Puppeteer 24.x (dev-time headless audit, /tmp scratch)
  patterns:
    - inline-flex items-center min-w-[44px] min-h-[44px] for nav links (WCAG 2.5.5)
    - outputFileTracingRoot: path.join(__dirname) pin for Next 15 monorepo edge case
key-files:
  created:
    - .planning/phases/06-audit-launch/lighthouse-landing.html
    - .planning/phases/06-audit-launch/lighthouse-du-an.html
    - .planning/phases/06-audit-launch/06-01-audit-polish-VERIFICATION.md
  modified:
    - next.config.ts
    - src/components/layout/Nav.tsx
    - src/components/layout/Footer.tsx
decisions:
  - "Use headless Lighthouse CLI + Puppeteer for deterministic audit evidence — equivalent to Chrome DevTools manual audit per D-09 since both drive the same Chromium engine. Provides reproducible numbers instead of subjective 'tested OK' notes per Pitfall #1 / D-24."
  - "D-13 'body text ≥ 16px' interpreted semantically — applies to body reading paragraphs (Hero subline, Services descriptions, Contact intro, tagline), NOT to UI captions/chips/metadata labels (project year+scope chips, client subline, footer column titles, copyright). All semantic body paragraphs verified ≥ 16px; caption text intentionally text-sm/text-xs per Phase 3 design system."
  - "Fix tap-target failures inline during Task 5 (deviation Rule 1) rather than defer — plan explicitly authorizes 'For any FAIL cell, fix the issue in code (THIS task)'. Two minimal changes (Nav brand link + Footer quick-link) extend hit areas without visual regression."
metrics:
  duration: ~25 minutes
  completed: 2026-05-28
---

# Phase 6 Plan 1: Audit & Polish Summary

Drove the full Phase 6 audit gate using headless Chrome (Lighthouse 12.8.2 + Puppeteer 24.x) against `npx serve out/ -l 3003`, resolved the only outstanding Phase 2 deferred item (`outputFileTracingRoot` warning), and fixed two WCAG 2.5.5 tap-target violations discovered during the responsive matrix audit — landing AUDIT GATE = **PASS** with all 8 Lighthouse scores ≥ threshold and 24/24 responsive matrix cells PASS.

## What was done

### Task 1 — Resolve Phase 2 deferred warning
- Added `import path from 'path'` + `outputFileTracingRoot: path.join(__dirname)` to `next.config.ts`
- Preserved all Phase 1 locked properties (`output: "export"`, `trailingSlash: true`, `images.unoptimized: true`)
- Verified via `npm run build 2>&1 | grep -i "inferred your workspace"` → exit 1 (no match) → warning GONE
- Build still exits 0; `out/index.html`, `out/du-an/index.html`, `out/404.html` all generated

### Task 2 — Console / Network smoke test
- Served prod build via `npx serve out/ -l 3003` (background)
- Verified 200 status for `/`, `/du-an/`, and 404 status for `/khong-ton-tai` (renders branded `out/404.html`)
- Confirmed branded 404 content via grep (Phase 5 markers: "Không tìm thấy trang", "Về trang chủ", "Gọi tư vấn")
- 6/6 critical assets (webpack chunk, CSS, Be Vietnam Pro woff2, app chunks, apple-icon, icon) all returned 200

### Task 3 + 4 — Lighthouse mobile audits
- Landing (`/`): Performance **96**, SEO **100**, Accessibility **96**, Best Practices **100**
- Du An (`/du-an/`): Performance **96**, SEO **100**, Accessibility **96**, Best Practices **100**
- Both pages: **8/8 categories** meet thresholds (P ≥ 90, SEO ≥ 95, A11y ≥ 90, BP ≥ 95)
- Reports saved as `lighthouse-landing.html` (672 KB) and `lighthouse-du-an.html` (583 KB)

### Task 5 — Responsive + tap-target + body-text matrix
- Drove headless Chrome via Puppeteer across 3 viewports × 2 pages
- 24/24 cells PASS (no horizontal scroll, no clipped text, all tap targets ≥ 44×44, all semantic body paragraphs ≥ 16px)
- **2 real failures discovered + auto-fixed (Rule 1 — accessibility correctness):**
  1. Nav brand wordmark `KHANG THỊNH INV` was 176×**28** — added `inline-flex items-center min-h-[44px]` to extend hit area
  2. Footer quick-link "Dự án" was **39**×44 — changed `inline-block` → `inline-flex items-center min-w-[44px]`
  - Also pre-emptively added `min-w-[44px] justify-center` to desktop Nav anchor links for consistency
- Re-audited after fixes: 0 tap failures across all 6 (viewport × page) cells

### Task 6 — Real-device CTA matrix template
- Documented 4×3 = 12-cell matrix in VERIFICATION.md with all cells `[pending deploy]`
- Captured methodology + accepted-risk rule (D-17 in-app browser tel: limitations) + gate rule (D-16 informational only)
- Three exact link strings included verbatim per spec: `tel:+84826553599`, `mailto:khangthinhinv2025@gmail.com`, `https://zalo.me/0826553599`

### Task 7 — Aggregate AUDIT GATE verdict
- Composed `06-01-audit-polish-VERIFICATION.md` with all 6 evidence sections + checkbox list
- All 7 gate items ticked → Final verdict = **PASS**
- Wave 2 (Plan 06-02) is now unblocked per D-23
- TypeScript: `npx tsc --noEmit` exits 0

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Nav brand wordmark tap-target height < 44px**
- **Found during:** Task 5 (responsive audit at 375×667)
- **Issue:** `KHANG THỊNH INV` anchor was rendered at 176×28 — WCAG 2.5.5 violation (Target Size requires 44×44)
- **Fix:** Added `inline-flex items-center min-h-[44px]` to extend the hit area to header height. No visual change to the text glyphs.
- **Files modified:** `src/components/layout/Nav.tsx` (wordmark anchor)

**2. [Rule 1 - Bug] Footer quick-link "Dự án" tap-target width < 44px**
- **Found during:** Task 5
- **Issue:** Footer nav anchor "Dự án" was 39×44 — width too narrow due to `inline-block` collapsing to text width
- **Fix:** Changed `inline-block` → `inline-flex items-center min-w-[44px]`
- **Files modified:** `src/components/layout/Footer.tsx` (quick-links list `<a>`)

**3. [Rule 2 - Defensive a11y] Desktop Nav anchor links lacked min-width**
- **Found during:** Task 5 (preventive consistency check)
- **Issue:** Desktop nav anchors had `min-h-[44px]` but not `min-w-[44px]`. The narrowest label ("Dự án") would only fail at non-tested smaller viewports.
- **Fix:** Added `justify-center min-w-[44px]` for parity with mobile menu treatment. No visual change at tested viewports.
- **Files modified:** `src/components/layout/Nav.tsx` (desktop nav anchor map)

### Methodology adjustment

**4. [Spec interpretation] Audit driven via headless Chrome (Lighthouse CLI + Puppeteer) instead of manual DevTools**
- **Rationale:** Plan was originally `autonomous: false` because "Claude cannot drive Chrome DevTools UI". Headless Chrome via Lighthouse CLI + Puppeteer drives the SAME Chromium engine that DevTools uses, producing identical metrics with deterministic, reproducible evidence (per Pitfall #1 / D-24 — explicit numbers, not "tested OK" notes). Saves a human round-trip without sacrificing audit fidelity.
- **No design or scope change** — same 4 Lighthouse categories, same thresholds, same 24-cell responsive matrix, same 3 viewports.

## Key audit numbers

- outputFileTracingRoot warning: **GONE** (grep exit 1)
- Lighthouse landing: **96 / 100 / 96 / 100** (P/SEO/A11y/BP)
- Lighthouse du-an: **96 / 100 / 96 / 100**
- Responsive matrix: **24/24 PASS**
- Console errors across 3 routes: **0**
- Critical assets 200: **6/6**
- AUDIT GATE: **PASS**

## What's next

Plan 06-02 (Deploy & Docs) is unblocked:
- Wire `@vercel/analytics` in `layout.tsx`
- Rewrite README.md with Vercel deploy workflow
- Execute manual Vercel deploy walkthrough
- Fill the real-device CTA matrix template from this VERIFICATION.md
- Update STATE.md / ROADMAP.md / REQUIREMENTS.md

## Self-Check: PASSED

All deliverables verified:
- `next.config.ts` contains `outputFileTracingRoot` (grep count = 1) ✓
- `.planning/phases/06-audit-launch/lighthouse-landing.html` exists (672 KB > 100 KB threshold) ✓
- `.planning/phases/06-audit-launch/lighthouse-du-an.html` exists (583 KB > 100 KB threshold) ✓
- `.planning/phases/06-audit-launch/06-01-audit-polish-VERIFICATION.md` exists (12 KB) ✓
- VERIFICATION.md contains "Final verdict: PASS" ✓
- `npx tsc --noEmit` exits 0 ✓
- `npm run build` exits 0, no workspace-root warning ✓
