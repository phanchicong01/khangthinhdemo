---
phase: 03-landing-sections
plan: 01
subsystem: ui
tags: [nextjs, react-server-components, tailwind-v4, lucide-react, css-animation, vietnamese-b2b]

# Dependency graph
requires:
  - phase: 01-foundation-lock-in
    provides: "Tailwind v4 @theme palette (burgundy/bone/espresso/taupe/bone-dark), Be Vietnam Pro font wiring, lib/site.ts (telHref + company facts), globals.css scroll-margin-top"
  - phase: 02-layout-shell
    provides: "Nav.tsx anchor IDs (#dich-vu, #du-an, #doi-tac, #lien-he), lucide-react dependency, src/components/ folder convention"
provides:
  - "Hero section (SEC-01) — CSS blueprint-grid background + 2 CTAs (tel + #lien-he)"
  - "PartnersMarquee section (SEC-02) — CSS-only @keyframes translateX with prefers-reduced-motion guard"
  - "Services section (SEC-03) — 3 service cards with Lucide icons (Truck/HardHat/Ship)"
  - "Projects section (SEC-04) — 4-card grid with named-client trust signal and /du-an CTA"
  - "globals.css marquee utility class (.marquee-track) + @keyframes marquee"
  - "src/components/sections/ folder pattern (parallel to src/components/layout/)"
affects: [03-02, 04, 05]

# Tech tracking
tech-stack:
  added: []  # No new libraries — used existing lucide-react + Tailwind v4
  patterns:
    - "Server-component-by-default for presentational sections (no 'use client' directive)"
    - "Section data declared as readonly const arrays inside the component file (Phase 3 only; Phase 4 extracts to lib/projects.ts)"
    - "CSS-only animation pattern: @keyframes + transform: translateX + will-change + prefers-reduced-motion guard"
    - "Inline-style maskImage/WebkitMaskImage for edge-fade effects"
    - "Anchor IDs match Nav href targets verbatim (#dich-vu, #du-an, #doi-tac)"

key-files:
  created:
    - src/components/sections/Hero.tsx
    - src/components/sections/PartnersMarquee.tsx
    - src/components/sections/Services.tsx
    - src/components/sections/Projects.tsx
  modified:
    - src/app/globals.css

key-decisions:
  - "Project years 2024 (3 construction) and 2025 (nhà phố) are BEST-GUESS per CONTEXT.md D-16 — user MUST confirm before Phase 4 lib/projects.ts extraction"
  - "Project icon final picks per D-16 candidate list: Project 1 = Construction (highway); Project 2 = GitBranch (bridge); Project 3 = Anchor (island/sea); Project 4 = Home (residential)"
  - "Color-block alternation in Projects 2-col grid: row 1 [burgundy, espresso], row 2 [espresso, burgundy] — no two adjacent same color either horizontally or vertically"
  - "Marquee duplication strategy: render the token list 2x inline-flex; animate translateX 0 → -50% so the second copy seamlessly replaces the first at loop point"
  - "Marquee second copy marked aria-hidden=true to prevent screen reader double-read"

patterns-established:
  - "Server component default: section components have no 'use client' — they emit static HTML"
  - "lib/site helpers as single source for contact URLs: telHref()/mailtoHref()/zaloHref() — never hardcode digits or zalo.me URLs in section files"
  - "Section anchor IDs are an interface contract with Nav — adding a new section means adding its ID to the navAnchors list in Nav.tsx"
  - "CSS animation utility classes live in globals.css below the @theme block; component files reference the class name, not inline @keyframes"

requirements-completed: [SEC-01, SEC-02, SEC-03, SEC-04]

# Metrics
duration: 3min
completed: 2026-05-28
---

# Phase 03 Plan 01: Above-Fold + Showcase Summary

**Hero + PartnersMarquee + Services + Projects — 4 server-component landing sections with CSS-only marquee animation and Lucide icons, no LCP image hazard, no client-side JS.**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-05-27T17:04:00Z
- **Completed:** 2026-05-27T17:06:46Z
- **Tasks:** 3
- **Files modified:** 5 (4 created, 1 appended)

## Accomplishments

- Built 4 of 8 landing sections (Hero, PartnersMarquee, Services, Projects) — the "above-the-fold + showcase" conversion path that establishes B2B trust before the page even scrolls
- Hero ships zero `<img>` / `<picture>` / `<video>` per PITFALLS #5 — pure CSS blueprint-grid via dual linear-gradient at 40×40px tile + 30% opacity espresso lines on bone
- PartnersMarquee runs at GPU compositor speed via `transform: translateX` only (PITFALLS #12) with a `prefers-reduced-motion` pause guard satisfying WCAG 2.3.3
- All CTAs wired through `telHref()` from `@/lib/site` — zero hardcoded `0921985599` digits anywhere in the section files
- `npm run build` exits 0 producing `/out/` static export; First Load JS still 102 kB shared (no client component added)

## Task Commits

Each task was committed atomically:

1. **Task 1: Build Hero.tsx (SEC-01)** — `aedc445` (feat)
2. **Task 2: Build PartnersMarquee.tsx + append @keyframes marquee to globals.css (SEC-02)** — `8acfc14` (feat)
3. **Task 3: Build Services.tsx + Projects.tsx (SEC-03 + SEC-04)** — `302dceb` (feat)

**Plan metadata commit:** pending (final docs commit covers SUMMARY + STATE + ROADMAP)

## Files Created/Modified

- `src/components/sections/Hero.tsx` — Server component with blueprint-grid background (inline style for one-off linear-gradient pair), uppercase Vietnamese headline, military-partner sub-text, primary `tel:` CTA + secondary `#lien-he` CTA
- `src/components/sections/PartnersMarquee.tsx` — Server component rendering 24 partner tokens (3× of 4 unique × 2 copies for seamless loop) in an espresso dark band with mask-image edge fade
- `src/components/sections/Services.tsx` — Server component with 3 cards (Cung ứng VLXD / Xây dựng dân dụng / Vận chuyển đường thủy) using Lucide `Truck` / `HardHat` / `Ship` icons, anchor `#dich-vu`
- `src/components/sections/Projects.tsx` — Server component with 4 cards in 2×2 grid (3 military projects + 1 residential), `Construction` / `GitBranch` / `Anchor` / `Home` icons, single outline-burgundy "Xem tất cả dự án →" CTA to `/du-an`, anchor `#du-an`
- `src/app/globals.css` — Appended `@keyframes marquee` (0 → -50% translateX), `.marquee-track` utility class with `will-change: transform`, and `prefers-reduced-motion` pause guard. Existing `@theme`, `:root`, base styles, and `scroll-margin-top: 4.5rem` rules preserved verbatim.

## Decisions Made

- **Project icon selections (D-16 candidate resolution):** Construction (highway P1) / GitBranch (bridge P2) / Anchor (island/sea P3) / Home (residential P4) — picked for cleanest read at 80×80px in the color block.
- **Color-block alternation pattern:** P1=burgundy, P2=espresso, P3=espresso, P4=burgundy. In the 2-col desktop grid this means row 1 reads [burgundy | espresso] and row 2 reads [espresso | burgundy] — diagonal variety; no two adjacent blocks share a color either horizontally or vertically.
- **Marquee construction:** Two identical copies of the 12-token list wrapped in one `marquee-track` flex container. Animation runs `translateX(0)` → `translateX(-50%)` so the second copy lands exactly where the first started — seamless loop. Second copy carries `aria-hidden="true"` so screen readers do not double-read.
- **Mask edge fade percentages:** 8% transparent at each end per D-08. Implemented via inline `style` (both `maskImage` and `WebkitMaskImage` for Safari/iOS coverage).
- **No `<a href="#">` on Hero CTA1 phone number text** — text is the user-facing label "Gọi 092 198 55 99" (with literal spaces for readability per D-04); the `href` strips to `telHref()` returning `tel:+84921985599` which is E.164 per PITFALLS #7.

## Year flag (REQUIRED per planner instruction)

**Project years 2024 (Cao tốc Cái Nước, Cầu Cửa Lớn, Đường ra Hòn Khoai) and 2025 (Nhà phố tiêu biểu) are BEST-GUESS per CONTEXT.md D-16.** The user MUST confirm or correct these years before Plan 04 (Phase 4) extracts the project data to `src/lib/projects.ts`. If the years are wrong, the fix is a 4-line edit in `Projects.tsx` PROJECTS constant — or, more durably, in the future `lib/projects.ts` module.

## Deviations from Plan

None — plan executed exactly as written. No Rule 1/2/3/4 deviations triggered. Verification commands all returned PASS on first run. `npm run build` exits 0 with no warnings related to the new section files (only the pre-existing workspace-root warning about multiple lockfiles in the parent directory).

## Issues Encountered

None during planned work.

One non-issue worth recording: the original verification commands used a bash `!` prefix to negate `grep`; under zsh that triggers history expansion errors. Worked around by running the verification inside a `bash <<'EOF' ... EOF` heredoc. No file content was affected, no deviation logged.

## Globals.css Invariant Preservation

Verified post-edit:

- `@theme { … 8 colors … }` — preserved verbatim
- `@theme inline { --font-sans: var(--font-be-vietnam-pro); }` — preserved verbatim
- `:root { … semantic aliases … }` — preserved verbatim
- `html { scroll-behavior: smooth; }` and `@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }` — preserved verbatim
- `section[id] { scroll-margin-top: 4.5rem; }` — preserved verbatim
- Marquee block appended BELOW the scroll-margin-top rule; no existing rule modified.

## Build Verification

```
> next build
✓ Compiled successfully in 1086ms
✓ Generating static pages (5/5)
✓ Exporting (2/2)

Route (app)                                 Size  First Load JS
┌ ○ /                                      127 B         103 kB
├ ○ /_not-found                            994 B         103 kB
└ ○ /du-an                                 127 B         103 kB
+ First Load JS shared by all             102 kB
```

Exit code: 0. Static export at `/out/` regenerated. No new client component was added (First Load JS unchanged from Phase 2 baseline 103 kB). The Hero / Services / Projects / PartnersMarquee components do NOT yet render on `/` — they will be composed into `page.tsx` by Plan 03-02 along with sections 5–8.

## Next Phase Readiness

- **Plan 03-02 (next):** Will build BigStats + Capabilities + CtaQuote + Contact + compose all 8 sections into `src/app/page.tsx` and delete the Phase 1 sentinel `<details>` debug card from `#nang-luc`.
- **Pre-compose responsibilities for 03-02:** Import `Hero`, `PartnersMarquee`, `Services`, `Projects` from `@/components/sections/*` and render in the documented order (Hero → PartnersMarquee → Services → Projects → BigStats → Capabilities → CtaQuote → Contact). Verify all 5 Nav anchor IDs resolve to a real section.
- **User confirmation needed:** Project years (see "Year flag" above) — non-blocking for Plan 03-02 but blocking for Plan 04 (Phase 4) which extracts to `lib/projects.ts`.

## Self-Check: PASSED

Verified files exist on disk:
- FOUND: src/components/sections/Hero.tsx
- FOUND: src/components/sections/PartnersMarquee.tsx
- FOUND: src/components/sections/Services.tsx
- FOUND: src/components/sections/Projects.tsx
- FOUND: src/app/globals.css (with @keyframes marquee appended)

Verified commits exist in git log:
- FOUND: aedc445 (Task 1 — Hero)
- FOUND: 8acfc14 (Task 2 — PartnersMarquee + globals.css)
- FOUND: 302dceb (Task 3 — Services + Projects)

Verified plan-level invariants:
- All 4 section files are server components (no 'use client')
- No hardcoded `0921985599` in any section file
- No `<img>`, `<picture>`, or `<video>` in any section file
- `globals.css` preserves `@theme {`, `scroll-margin-top: 4.5rem`, and adds `@keyframes marquee`
- `npm run build` exit code 0

---
*Phase: 03-landing-sections*
*Completed: 2026-05-28*
