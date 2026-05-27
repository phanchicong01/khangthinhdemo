---
phase: 03-landing-sections
plan: 02
subsystem: ui
tags: [nextjs, react-server-components, tailwind-v4, lucide-react, vietnamese-b2b, conversion-path]

# Dependency graph
requires:
  - phase: 01-foundation-lock-in
    provides: "Tailwind v4 @theme palette (burgundy/bone/espresso/taupe/bone-dark), Be Vietnam Pro font, lib/site.ts (telHref/zaloHref/mailtoHref + company facts)"
  - phase: 02-layout-shell
    provides: "Nav anchor IDs (#dich-vu, #du-an, #nang-luc, #doi-tac, #lien-he), layout.tsx Nav/Footer/FloatingZalo wiring, globals.css scroll-margin-top"
  - phase: 03-landing-sections (plan 01)
    provides: "Hero, PartnersMarquee, Services, Projects server components consumed by page.tsx composition"
provides:
  - "BigStats section (SEC-05) — 4 static stat tiles (3,900 / 4 / 2025 / 3) — no count-up animation"
  - "Capabilities section (SEC-06) — 3 capability groups (Đội tàu / Cơ giới / Đội xây lắp) with Lucide icons + Check bullet markers"
  - "CtaQuote section (SEC-07) — full-width espresso banner, single tel: CTA"
  - "Contact section (SEC-08) — 2-col legal block + 3 channel CTAs (tel/zalo/mailto) + plain-text email fallback (PITFALLS #7)"
  - "Composed app/page.tsx — 8-section landing page in locked order; #nang-luc wraps BigStats + Capabilities; Phase 1 sentinel deleted"
affects: [04, 05]

# Tech tracking
tech-stack:
  added: []  # No new libraries
  patterns:
    - "Server-component-by-default for all 4 new sections (no 'use client')"
    - "Anchor-wrapper pattern: <section id=nang-luc> in page.tsx around two anchor-less child sections (BigStats + Capabilities)"
    - "PITFALLS #7 email fallback: mailto: button + plain-text {company.email} rendered next to it"
    - "All CTA hrefs flow through @/lib/site helpers (telHref/zaloHref/mailtoHref) — zero hardcoded digits/emails"
    - "<dl>/<dt>/<dd> for legal block (semantic definition pairs; sr-only dt for screen readers)"

key-files:
  created:
    - src/components/sections/BigStats.tsx
    - src/components/sections/Capabilities.tsx
    - src/components/sections/CtaQuote.tsx
    - src/components/sections/Contact.tsx
  modified:
    - src/app/page.tsx

key-decisions:
  - "Cơ giới capability icon = Truck (D-23 candidate choice from Truck vs Wrench) — reinforces fleet-mobility cue + matches Services VLXD icon vocabulary"
  - "'Giờ làm việc' line OMITTED from Contact (D-31 Claude's Discretion declined — refuses to commit to fixed hours without business confirmation)"
  - "#nang-luc wraps BigStats + Capabilities — neither child carries an id; the wrapping <section id=nang-luc> lives in page.tsx so Nav 'Năng lực' link lands on the combined capability block"
  - "Background alternation finalized: Hero(bone) → Partners(espresso) → Services(bone-dark) → Projects(bone) → BigStats(bone-dark) → Capabilities(bone) → CtaQuote(espresso) → Contact(bone-dark) — no two adjacent espresso bands"
  - "Phase 1 sentinel <details> debug card and Phase 2 placeholder sections all removed in single page.tsx rewrite per D-40"

patterns-established:
  - "Composition pattern: 8 server components imported individually into page.tsx with grouped anchor wrappers where needed"
  - "Server-component default holds across all 8 sections — First Load JS still 102 kB shared (no new client component)"
  - "Plain-text fallback alongside actionable button (PITFALLS #7) — pattern usable for future contact channels"

requirements-completed: [SEC-05, SEC-06, SEC-07, SEC-08]

# Metrics
duration: 3min
completed: 2026-05-28
---

# Phase 03 Plan 02: Stats + Close + Compose Summary

**Built the conversion-closing half of Phase 3 (BigStats + Capabilities + CtaQuote + Contact) and composed all 8 landing sections into `src/app/page.tsx`, replacing the Phase 2 anchor placeholders and deleting the Phase 1 sentinel debug card.**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-05-27T17:10:00Z
- **Completed:** 2026-05-27T17:12:39Z
- **Tasks:** 3
- **Files modified:** 5 (4 created, 1 rewritten)

## Accomplishments

- Closed the conversion path opened in Plan 03-01: numbers (BigStats) → capabilities (Capabilities) → conversion banner (CtaQuote) → contact channels (Contact)
- All 4 new sections are server components — `npm run build` First Load JS stays at 102 kB shared (no new client component added in Phase 3)
- BigStats ships static numbers only — no count-up animation per FEATURES.md anti-features + D-22 (better Lighthouse Performance, avoids VN-audience annoyance)
- Contact section satisfies PITFALLS #7 with plain-text `{company.email}` rendered immediately below the mailto button — users without a mail handler can still copy the address
- `src/app/page.tsx` rewritten end-to-end: 8 imports + 8 section renders + `#nang-luc` wrapper around BigStats + Capabilities. Phase 2 placeholders + Phase 1 sentinel both deleted in the same commit.
- Background alternation pattern locked: bone / espresso / bone-dark / bone / bone-dark / bone / espresso / bone-dark — no two adjacent espresso bands per CONTEXT D-33
- All 5 Nav anchor IDs (`#dich-vu`, `#du-an`, `#nang-luc`, `#doi-tac`, `#lien-he`) live in `out/index.html`

## Task Commits

Each task was committed atomically:

1. **Task 1: Build BigStats.tsx + Capabilities.tsx (SEC-05 + SEC-06)** — `f848a56` (feat)
2. **Task 2: Build CtaQuote.tsx + Contact.tsx (SEC-07 + SEC-08)** — `0601312` (feat)
3. **Task 3: Compose app/page.tsx + delete Phase 1 sentinel** — `8fa4a62` (feat)

**Plan metadata commit:** pending (final docs commit covers SUMMARY + STATE + ROADMAP + REQUIREMENTS).

## Files Created/Modified

- `src/components/sections/BigStats.tsx` — Server component. 4 stat tiles in a 2×2 mobile / 4-col desktop grid. Numbers `3,900` / `4` / `2025` / `3` with `border-l-4 border-burgundy`. No anchor id (lives inside `#nang-luc` wrapper in page.tsx).
- `src/components/sections/Capabilities.tsx` — Server component. 3 groups (Đội tàu / Cơ giới / Đội xây lắp) each with a Lucide icon (Ship / Truck / HardHat) + 4 B2B bullets prefixed by the Lucide `Check` icon. No anchor id (lives inside `#nang-luc` wrapper).
- `src/components/sections/CtaQuote.tsx` — Server component. Full-width `bg-espresso` banner with `YÊU CẦU BÁO GIÁ NGAY HÔM NAY` headline, supporting line, single `bg-burgundy` tel CTA. No anchor id per D-29.
- `src/components/sections/Contact.tsx` — Server component with `id="lien-he"`. 2-col grid: left = `<dl>/<dt>/<dd>` legal block (legalName / taxIdDisplay / legalRep / address.full); right = 3 stacked CTAs (tel / zalo / mailto) + plain-text `{company.email}` fallback per PITFALLS #7. CTAs all flow through `telHref()` / `zaloHref()` / `mailtoHref()`.
- `src/app/page.tsx` — Rewritten in full. Imports all 8 section components from `@/components/sections/*` and renders them under `<main className="min-h-screen">` in the locked order. `<section id="nang-luc">` wraps BigStats + Capabilities. Phase 1 sentinel `<details>` debug card and Phase 2 placeholder sections deleted.

## Decisions Made

- **Cơ giới icon (D-23):** `Truck` over `Wrench`. Truck keeps the icon vocabulary tight (Services already uses Truck for VLXD), reads as fleet-mobility rather than tooling shop, and stays unambiguous at 48px.
- **'Giờ làm việc' in Contact (D-31 Claude's Discretion):** OMITTED. Committing to fixed business hours without owner confirmation is a real-world trust risk — buyers who call after-hours and don't reach anyone treat the page as inaccurate. Cleaner to omit until the company confirms a commitment.
- **`#nang-luc` placement:** The id lives on the **wrapping** `<section>` in `page.tsx`, NOT on either BigStats or Capabilities individually. Nav "Năng lực" link lands at the top of the combined capability block (BigStats first, then Capabilities) which reads as a single narrative — numbers backing capabilities.
- **Background alternation:** Hero(bone) · Partners(espresso) · Services(bone-dark) · Projects(bone) · BigStats(bone-dark) · Capabilities(bone) · CtaQuote(espresso) · Contact(bone-dark). Pattern keeps every espresso band buffered by at least one lighter band — verified, no two adjacent dark bands.
- **Sentinel deletion strategy:** Rewriting `page.tsx` in full (not editing surgically) was simpler than mutating the 5 placeholder sections one by one. Single commit deletes the entire Phase 2 scaffold + Phase 1 sentinel in one atomic change.

## Deviations from Plan

None — plan executed exactly as written. No Rule 1/2/3/4 deviations triggered. All three task verifications and the plan-level verification passed on first run. `npm run build` exits 0; static export at `/out/` regenerates successfully.

One non-issue worth recording: as in Plan 03-01, the verification commands used the bash `!` prefix to negate `grep`. Under zsh this triggers history expansion — worked around by running verification inside `bash <<'EOF' ... EOF` heredocs. No file content affected.

## Issues Encountered

None during planned work.

Pre-existing repo state observation: at task start, `git status` showed several unrelated modified/untracked files (`.planning/config.json` changes, `tsconfig.json` modification, deleted `.md` files in 01-foundation-lock-in, new `*-VERIFICATION.md` files). These were not touched by this plan — only files in the plan's scope (`src/components/sections/{BigStats,Capabilities,CtaQuote,Contact}.tsx` + `src/app/page.tsx`) were staged into commits.

## Build Verification

```
> next build
✓ Compiled successfully in 1096ms
✓ Generating static pages (5/5)
✓ Exporting (2/2)

Route (app)                                 Size  First Load JS
┌ ○ /                                      797 B         103 kB
├ ○ /_not-found                            994 B         103 kB
└ ○ /du-an                                 123 B         103 kB
+ First Load JS shared by all             102 kB
```

Exit code: 0. Static export at `/out/` regenerated. The `/` route grew from 127 B (Plan 03-01 baseline placeholder) to 797 B — entirely from the 4 new section markup. Shared First Load JS unchanged at 102 kB (confirming no client component was added).

### `out/index.html` smoke (all PASS)

| Check | Status |
|-------|--------|
| Hero headline `CÔNG TRÌNH BỀN VỮNG` | PRESENT |
| Marquee text `BỘ QUỐC PHÒNG` | PRESENT |
| Project name `Cao tốc Cái Nước` | PRESENT |
| CTA banner headline `YÊU CẦU BÁO GIÁ NGAY HÔM NAY` | PRESENT |
| Address fragment `A3-02 KDC Long Phú` | PRESENT |
| Anchor `id="dich-vu"` | PRESENT |
| Anchor `id="du-an"` | PRESENT |
| Anchor `id="nang-luc"` | PRESENT |
| Anchor `id="doi-tac"` | PRESENT |
| Anchor `id="lien-he"` | PRESENT |
| `tel:+84921985599` | PRESENT |
| `zalo://` scheme | ABSENT (HTTPS Zalo only — PITFALLS #7 preserved) |
| `Phase 1 sentinel` | ABSENT (D-40 satisfied) |

## Layout Shell Untouched

- `src/app/layout.tsx` — preserved verbatim (Nav / Footer / FloatingZalo wiring intact)
- `src/components/layout/Nav.tsx` — preserved verbatim
- `src/components/layout/Footer.tsx` — preserved verbatim
- `src/components/layout/FloatingZalo.tsx` — preserved verbatim
- `src/app/globals.css` — preserved verbatim (the marquee `@keyframes` block from Plan 03-01 remains)

## Year Flag (carried from Plan 03-01)

Project years (2024 for the 3 military projects, 2025 for nhà phố) in `Projects.tsx` are still BEST-GUESS. User MUST confirm or correct before Phase 4 (`lib/projects.ts` extraction). Not blocking Phase 3 completion — content is shipped as-is per CONTEXT D-16.

## Next Phase Readiness

- **Phase 3 status:** COMPLETE. All 8 sections render on `/`; all 5 Nav anchor IDs resolve to real sections; conversion path complete (Hero CTA → tel / `#lien-he`; CtaQuote → tel; Contact → tel / Zalo / mailto with plain-text fallback).
- **Phase 4 (next):** Extract `Projects.tsx` `PROJECTS` const into a typed `src/lib/projects.ts` module. Build `/du-an` list page consuming the same data. User must confirm project years before that extraction.
- **Phase 5 + 6:** SEO foundation (metadata / sitemap / robots / JSON-LD `GeneralContractor`) and Lighthouse audit + perf polish.

## Self-Check: PASSED

Verified files exist on disk:
- FOUND: src/components/sections/BigStats.tsx
- FOUND: src/components/sections/Capabilities.tsx
- FOUND: src/components/sections/CtaQuote.tsx
- FOUND: src/components/sections/Contact.tsx
- FOUND: src/app/page.tsx (rewritten)
- FOUND: .planning/phases/03-landing-sections/03-02-stats-close-compose-SUMMARY.md

Verified commits exist in git log:
- FOUND: f848a56 (Task 1 — BigStats + Capabilities)
- FOUND: 0601312 (Task 2 — CtaQuote + Contact)
- FOUND: 8fa4a62 (Task 3 — page.tsx compose + sentinel delete)

Verified plan-level invariants:
- All 8 section files in src/components/sections/ are server components (no 'use client')
- No hardcoded `0921985599` in any section file
- No hardcoded email literal `"khangthinhinv2025@gmail.com"` in any section file
- No `<img>`, `<picture>`, or `<video>` in any section file
- `src/app/layout.tsx` untouched (Nav/Footer/FloatingZalo intact)
- `npm run build` exit code 0; out/index.html contains all required signature strings + 5 anchor IDs + tel:+84921985599; no `zalo://`, no `Phase 1 sentinel`

---
*Phase: 03-landing-sections*
*Completed: 2026-05-28*
