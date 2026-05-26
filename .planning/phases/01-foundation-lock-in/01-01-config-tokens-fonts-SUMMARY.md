---
phase: 01-foundation-lock-in
plan: 01
subsystem: infra
tags: [next15, static-export, tailwind-v4, next-font, be-vietnam-pro, vietnamese-subset, design-tokens]

requires:
  - phase: 00-research
    provides: "01-RESEARCH.md prescriptive patterns (Be Vietnam Pro weights, @theme inline wiring, output:'export' shape)"

provides:
  - Static export config locked (next.config.ts with unsupported-features warning comment)
  - Tailwind v4 @theme palette (Burgundy/Bone, 8 colors) generating bg-*, text-*, border-* utilities
  - Be Vietnam Pro self-hosted via next/font/google with Vietnamese subset + weights 400-900
  - @theme inline font wiring (--font-sans → --font-be-vietnam-pro) — Tailwind font-sans utility active
  - Semantic :root aliases (--color-bg, --color-fg, --color-primary) for future dark-mode swap
  - <html lang="vi"> set; viewport themeColor #6B1F1F
  - Clean build emits /out/index.html (static export verified end-to-end)

affects:
  - 01-02-site-constants-cleanup (consumes palette tokens; adds metadataBase via lib/site.ts; removes sentinel)
  - 02-skeleton-replace (consumes font + tokens for all UI components)
  - 03-hero-landing (consumes font weights 400-900 for industrial display feel without Bebas Neue)

tech-stack:
  added:
    - next/font/google (Be_Vietnam_Pro binding)
  patterns:
    - "Tailwind v4 CSS-first config: @theme block in globals.css replaces tailwind.config.ts"
    - "@theme inline { } REQUIRED for tokens that reference other CSS vars (font-sans → font-be-vietnam-pro)"
    - "Semantic aliases live in :root (NOT @theme) to avoid creating utility classes from intermediate names"
    - "next/font/google with subsets: ['vietnamese', 'latin'] + weight array (Be Vietnam Pro is not variable)"

key-files:
  created:
    - .planning/phases/01-foundation-lock-in/01-01-config-tokens-fonts-SUMMARY.md
  modified:
    - next.config.ts (added unsupported-features comment block)
    - postcss.config.mjs (added source comment)
    - src/app/globals.css (rewrote — @theme Burgundy/Bone tokens, @theme inline font wiring, base styles)
    - src/app/layout.tsx (rewrote — Be Vietnam Pro via next/font/google, removed Google Fonts <link> tags, added viewport)
    - src/app/page.tsx (added Phase 1 sentinel div — TODO(plan-01-02) for removal)

key-decisions:
  - "Adopted next/font/google over @fontsource (per Phase 1 RESEARCH.md TL;DR §2) — build-time deterministic in this dev env"
  - "Be Vietnam Pro weight array ['400'..'900'] required — not exposed as variable font in next/font/google binding"
  - "metadataBase intentionally deferred to Plan 02 — depends on lib/site.ts which Plan 02 creates"

patterns-established:
  - "Tailwind v4 @theme {} for utility-generating tokens; @theme inline {} for var-referencing tokens; :root {} for semantic aliases not needing utilities"
  - "<html lang='vi' className={font.variable}> + <body className='font-sans antialiased'> — font variable threads from root to body via Tailwind utility"
  - "Sentinel pattern: temporary verification div in page.tsx with TODO(plan-XX-YY) marker for removal in named plan"

requirements-completed: [FND-01, FND-02, FND-03, FND-04]

duration: 3min
completed: 2026-05-26
---

# Phase 01 Plan 01: Config, Tokens, Fonts Summary

**Static export config locked, Tailwind v4 @theme Burgundy/Bone palette emitting utilities, and Be Vietnam Pro self-hosted via next/font/google with Vietnamese subset across weights 400-900.**

## Performance

- **Duration:** 3 min
- **Started:** 2026-05-26T09:38:04Z
- **Completed:** 2026-05-26T09:40:47Z
- **Tasks:** 4
- **Files modified:** 5 (next.config.ts, postcss.config.mjs, src/app/globals.css, src/app/layout.tsx, src/app/page.tsx)

## Accomplishments

- Locked `next.config.ts` at exactly `{ output: 'export', trailingSlash: true, images: { unoptimized: true } }` with a top-of-file comment listing 8 forbidden features (Server Actions, middleware, ISR, rewrites, etc.) to prevent silent future breakage (Pitfall #1).
- Rewrote `src/app/globals.css` with Tailwind v4 CSS-first config: `@theme { }` block declares all 8 palette tokens (`--color-burgundy`, `--color-bone`, `--color-espresso`, ...) — these now generate `bg-burgundy`, `text-bone`, `border-burgundy`, etc. as proven by the emitted `out/_next/static/css/*.css` containing the utilities.
- Rewrote `src/app/layout.tsx` to use `next/font/google` `Be_Vietnam_Pro({ subsets: ['vietnamese', 'latin'], weight: ['400'..'900'], display: 'swap', variable: '--font-be-vietnam-pro' })` — all runtime requests to `fonts.googleapis.com` removed; font is now self-hosted at build time.
- `@theme inline { --font-sans: var(--font-be-vietnam-pro); }` correctly wires Tailwind's `font-sans` utility to the next/font variable — required pattern when one token references another CSS var.
- Clean `npm run build` exits 0, emits `out/index.html`; emitted CSS contains burgundy utilities; no Server Action / dynamic / font-load errors.
- Phase 1 sentinel added to `src/app/page.tsx` exercising all 8 palette utilities + Vietnamese diacritics (`Ị`, `Ộ`, `À`, `Ấ`) at weight 900 — marked `TODO(plan-01-02)` for removal.

## Task Commits

Each task was committed atomically:

1. **Task 1: Verify next.config.ts + tsconfig.json + postcss.config.mjs baseline** — `30ea5c6` (chore)
2. **Task 2: Rewrite src/app/globals.css with Tailwind v4 @theme tokens** — `6a71d48` (feat)
3. **Task 3: Rewrite src/app/layout.tsx with Be Vietnam Pro via next/font/google** — `b87af44` (feat)
4. **Task 4: Build verification — sentinel + clean build emits /out/index.html** — `59df843` (test)

## Files Created/Modified

- `next.config.ts` — added top-of-file warning comment listing unsupported `output: 'export'` features (Pitfall #1 mitigation); functional config unchanged
- `postcss.config.mjs` — added source URL comment; Tailwind v4 single-plugin config preserved
- `src/app/globals.css` — replaced v3-style `:root { --red, --gray-* }` with Tailwind v4 `@theme {}` palette (8 burgundy/bone tokens), added `@theme inline {}` for font wiring, added `:root {}` semantic aliases, added base styles (body bg/color/font-family, prefers-reduced-motion); removed all DM Sans / DM Serif Display references
- `src/app/layout.tsx` — replaced `<link>` tags to fonts.googleapis.com with `next/font/google` `Be_Vietnam_Pro` binding; added `Viewport` export with `themeColor: '#6B1F1F'`; updated metadata title to `title.default + title.template` pattern; set `<html lang="vi" className={beVietnamPro.variable}>` and `<body className="font-sans antialiased">`; metadataBase deferred to Plan 02
- `src/app/page.tsx` — added Phase 1 sentinel `<div>` exercising all 8 palette utilities + Vietnamese diacritics at font-black; marked with `TODO(plan-01-02)` for Plan 02 removal

## Decisions Made

- **next/font/google over @fontsource** — per Phase 1 RESEARCH.md prescription (build-time self-hosting works in this dev env; eliminates one node_modules package; consistent with Next.js 15 idiomatic pattern).
- **`@theme {}` + `@theme inline {}` split** — palette colors as direct hex (utility generation), font-sans as inline wiring (var-referencing-var requires inline per Tailwind v4 docs).
- **Semantic aliases in `:root`, NOT `@theme`** — avoids creating `bg-bg`, `bg-primary` utility classes; semantic names are reserved for future dark-mode swap via `:root[data-theme]` or `@media (prefers-color-scheme)`.
- **metadataBase deferred to Plan 02** — depends on `lib/site.ts` which Plan 02 creates. Expected `metadataBase` build warning is documented; closes in Plan 02 (FND-05).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Installed missing `lightningcss-darwin-arm64` native binary**
- **Found during:** Task 4 (first build attempt)
- **Issue:** `npm run build` failed with `Cannot find module '../lightningcss.darwin-arm64.node'`. The `lightningcss` Node addon is a transitive optional native dep of `@tailwindcss/postcss`; npm had not installed the darwin-arm64 build (likely because the workspace contains both `package-lock.json` and a root-level `pnpm-lock.yaml`, confusing optional-deps resolution).
- **Fix:** `npm install lightningcss-darwin-arm64 --no-save` — installs the native binary into `node_modules/` without polluting `package.json`. A more durable fix (removing the root `pnpm-lock.yaml` or pinning `outputFileTracingRoot`) is out of scope for this plan.
- **Files modified:** node_modules only (no source file changes)
- **Verification:** `ls node_modules/lightningcss-darwin-arm64/lightningcss.darwin-arm64.node` exists; subsequent `npm run build` exits 0.
- **Committed in:** N/A (no tracked file changes — node_modules is gitignored)

---

**Total deviations:** 1 auto-fixed (1 blocking native-binary install)
**Impact on plan:** Zero scope creep. The fix was a build-environment correction that does not alter source code or planned artifacts.

## Issues Encountered

- **Workspace lockfile ambiguity** — Next.js detected both `/Users/congphan/pnpm-lock.yaml` (parent project root) and the local `package-lock.json`, emitting a workspace-root inference warning. Build still succeeds; warning is cosmetic. A future cleanup task could set `outputFileTracingRoot: __dirname` in `next.config.ts` or delete the unused lockfile — out of scope for this plan; logged for Plan 02 / Phase 1 follow-up.

## Known Stubs

- **`src/app/page.tsx` Phase 1 sentinel div** — Intentional, marked `TODO(plan-01-02): Remove this sentinel — replaced by real Hero in Phase 3`. Visible at `/` showing the palette/font test card. Plan 02 will remove it as part of skeleton rewrite (FND-07).

## User Setup Required

None — no external services or environment variables required for this plan. All work is in-repo config / source files.

## Next Phase Readiness

**Ready for Plan 02 (`01-02-site-constants-cleanup`):**
- Palette utilities available: `bg-burgundy`, `text-bone`, `border-burgundy`, etc.
- Font wiring active: `font-sans` resolves to Be Vietnam Pro at runtime
- Static export proven: `npm run build` → `out/index.html`
- Plan 02 must:
  - Create `src/lib/site.ts` with company facts (FND-05)
  - Add `metadataBase` to `layout.tsx` from `lib/site.ts` (closes Pitfall #4)
  - Delete `src/app/dich-vu/`, `src/app/du-an/`, `src/app/lien-he/` skeleton routes (FND-07)
  - Rewrite `src/app/page.tsx` to remove Phase 1 sentinel and reduce to Phase 1 minimal landing
  - Delete `src/components/Header.tsx` and `src/components/Footer.tsx` if no longer used (Header.tsx has pre-existing unstaged modifications that will be replaced)

**Open gaps (closed by Plan 02):**
- metadataBase warning (will close once `lib/site.ts` provides `siteUrl`)
- Phase 1 sentinel removal (TODO(plan-01-02) tag in `src/app/page.tsx`)
- Skeleton route cleanup

---
*Phase: 01-foundation-lock-in*
*Completed: 2026-05-26*

## Self-Check: PASSED

**Files verified:**
- FOUND: next.config.ts (modified, contains output: 'export' + warning comment)
- FOUND: postcss.config.mjs (modified, contains @tailwindcss/postcss)
- FOUND: src/app/globals.css (rewritten, contains @theme + @theme inline)
- FOUND: src/app/layout.tsx (rewritten, contains Be_Vietnam_Pro + next/font/google)
- FOUND: src/app/page.tsx (sentinel div added with TODO marker)
- FOUND: out/index.html (build output)
- FOUND: out/_next/static/css/*.css (contains bg-burgundy utility)

**Commits verified:**
- FOUND: 30ea5c6 (Task 1)
- FOUND: 6a71d48 (Task 2)
- FOUND: b87af44 (Task 3)
- FOUND: 59df843 (Task 4)
