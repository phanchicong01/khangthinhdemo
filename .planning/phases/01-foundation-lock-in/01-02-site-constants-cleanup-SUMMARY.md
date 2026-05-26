---
phase: 01-foundation-lock-in
plan: 02
subsystem: infra
tags: [next15, static-export, env-vars, site-constants, metadata, skeleton-cleanup, fnd-05, fnd-06, fnd-07]

requires:
  - phase: 01-foundation-lock-in
    plan: 01
    provides: "Tailwind v4 @theme palette + Be Vietnam Pro font wiring + static export config"

provides:
  - "src/lib/site.ts as single source of truth for company facts (legalName, phone E.164/display/raw, email, Zalo HTTPS URL, taxId, legalRep, address)"
  - "siteUrl resolved at build time from NEXT_PUBLIC_SITE_URL ?? https://khangthinhinv.vn"
  - "telHref(), mailtoHref(), zaloHref() helpers"
  - "Company type export for downstream JSON-LD consumers"
  - ".env.example documenting the NEXT_PUBLIC_SITE_URL contract"
  - "metadataBase wired in layout.tsx — Pitfall #4 / #15 closed"
  - "Skeleton routes (/dich-vu, /lien-he) and components (Header.tsx, Footer.tsx) removed (FND-07)"
  - "Phase 1 sentinel covering palette + font weights 400-900 + env-var readout in src/app/page.tsx"

affects:
  - 02-skeleton-replace (consumes company facts + helpers for new Nav/Footer/FloatingZalo)
  - 03-hero-landing (will replace the Phase 1 sentinel page.tsx entirely)
  - 05-seo-meta (consumes siteUrl for sitemap/robots/JSON-LD)

tech-stack:
  added: []
  patterns:
    - "Company facts frozen via `as const` for literal-type narrowing at call sites"
    - "Three phone formats (display / E.164 tel: / raw zalo-builder) prevent Pitfall #7 (tel href breakage from spaces)"
    - "siteUrl uses `??` (nullish coalescing) NOT `||` — empty string env var must fail loudly, not fall through"
    - "metadataBase requires `new URL(siteUrl)` — Next.js Metadata API contract"
    - "Skeleton deletion sequenced: strip consumers first → verify build → delete files → verify build again (Pitfall #6 rollback safety)"

key-files:
  created:
    - src/lib/site.ts
    - .env.example
    - .planning/phases/01-foundation-lock-in/01-02-site-constants-cleanup-SUMMARY.md
  modified:
    - src/app/layout.tsx (import siteUrl; metadataBase: new URL(siteUrl))
    - src/app/page.tsx (rewrote — Phase 1 sentinel with palette/font/env readout)
    - src/app/du-an/page.tsx (Rule 3 auto-fix — strip Header/Footer imports + usage)
  deleted:
    - src/app/dich-vu/page.tsx
    - src/app/lien-he/page.tsx
    - src/components/Header.tsx
    - src/components/Footer.tsx

key-decisions:
  - "Used `??` (nullish coalescing) for siteUrl fallback so empty NEXT_PUBLIC_SITE_URL fails loudly instead of silently falling through"
  - "Three phone formats explicit (phoneDisplay/phoneE164/phoneRaw) — prevents 3 separate downstream stringly-typed bugs"
  - "taxId (no spaces) for JSON-LD schema convention; taxIdDisplay (with spaces) for UI — separation upstream avoids per-consumer formatting"
  - "Stripped Header/Footer usage from /du-an/page.tsx as an auto-fix (Rule 3) rather than deleting the route — /du-an is a planned PROJECT.md requirement; placeholder remains until Phase 3"

patterns-established:
  - "Single source of truth module: src/lib/site.ts groups all company constants on a `company` object exported `as const`"
  - "Env var pattern: `process.env.X ?? '<default>'` at module scope; consumers import the resolved value, never `process.env` directly"
  - "Skeleton-deletion order: (a) replace consumers, (b) verify build, (c) delete files, (d) re-verify build — single atomic git commit per phase enables `git revert` rollback"

requirements-completed: [FND-05, FND-06, FND-07]

duration: ~20min active (calendar gap between Task 3 and Task 4 due to user pause)
completed: 2026-05-26
---

# Phase 01 Plan 02: Site Constants + Cleanup Summary

**Locked company facts as a single source of truth in `src/lib/site.ts`, wired `NEXT_PUBLIC_SITE_URL` through `metadataBase`, deleted the old skeleton routes/components, and replaced the Phase-1 sentinel with a palette + font + env-var readout.**

## Performance

- **Duration:** ~20 min active work
- **Started:** 2026-05-26T09:43:48Z
- **Completed:** 2026-05-26T11:43:00Z
- **Tasks:** 5 (4 commits + 1 verification-only)
- **Files created:** 2 (src/lib/site.ts, .env.example)
- **Files modified:** 3 (src/app/layout.tsx, src/app/page.tsx, src/app/du-an/page.tsx)
- **Files deleted:** 4 (src/app/dich-vu/page.tsx, src/app/lien-he/page.tsx, src/components/Header.tsx, src/components/Footer.tsx)

## Accomplishments

- Created `src/lib/site.ts` exporting `siteUrl`, `company` (as const), `telHref`, `mailtoHref`, `zaloHref`, and `Company` type — every constant matches RESEARCH.md Focus Area 4 verbatim (phone E.164 `+84921985599`, Zalo HTTPS `https://zalo.me/0921985599`, MST `1102107064`, ĐDPL `Tô Thị Bích Ngọc`, full address `A3-02 KDC Long Phú, xã Bến Lức, tỉnh Tây Ninh`).
- `siteUrl` uses `??` (nullish coalescing) so empty `NEXT_PUBLIC_SITE_URL` does NOT silently fall through to the default — this catches misconfiguration loudly.
- Created `.env.example` documenting the env-var contract (default `https://khangthinhinv.vn`, override via `.env.local`); audited `.gitignore` (already covered `.env*.local`, `/.next/`, `/out/`, `/node_modules`).
- Wired `metadataBase: new URL(siteUrl)` as the first property of the `metadata` export in `src/app/layout.tsx` — Pitfall #4 / #15 closed; build log no longer emits the `metadataBase` warning.
- Rewrote `src/app/page.tsx` as a Phase 1 sentinel: 6-weight Vietnamese diacritic stress test (400 → 900), 8-swatch palette grid (proves every `@theme` token), and an env-var readout block printing `siteUrl`, `tel`, `zalo`, `mail`, `mst`, `address` so the user can visually confirm propagation.
- Deleted `src/app/dich-vu/`, `src/app/lien-he/`, `src/components/Header.tsx`, `src/components/Footer.tsx` per FND-07.
- Proved env-var propagation end-to-end: default build → `out/index.html` contains `https://khangthinhinv.vn`; `.env.local` override with `NEXT_PUBLIC_SITE_URL=https://test.example.com` → `out/index.html` contains the override AND the default is absent; cleanup → returns to default.
- All 7 Phase-1 FND requirements pass the master grep checklist.

## Task Commits

Each task was committed atomically:

1. **Task 1: lib/site.ts + .env.example + .gitignore audit** — `ae80c7e` (feat)
2. **Task 2: Wire metadataBase from siteUrl** — `8b38ee1` (feat)
3. **Task 3: Replace page.tsx skeleton with Phase-1 sentinel** — `5e4fb05` (chore)
4. **Task 4: Delete skeleton folders (dich-vu, lien-he, Header, Footer)** — `e551260` (chore)
5. **Task 5: Env var propagation proof** — no commit (verification only)

## Files Created/Modified

**Created:**
- `src/lib/site.ts` — single source of truth for company facts, helpers, types
- `.env.example` — documents `NEXT_PUBLIC_SITE_URL` contract

**Modified:**
- `src/app/layout.tsx` — added `import { siteUrl } from '@/lib/site'`; set `metadata.metadataBase = new URL(siteUrl)`; replaced "intentionally omitted" comment with env-var explainer
- `src/app/page.tsx` — full rewrite as Phase 1 sentinel; imports `company, siteUrl, telHref, zaloHref, mailtoHref` from `@/lib/site`; removed all Header/Footer/skeleton-Hero/Services/Projects/CTA blocks
- `src/app/du-an/page.tsx` — stripped `<Header />` / `<Footer />` usage + imports (Rule 3 auto-fix; see Deviations)

**Deleted:**
- `src/app/dich-vu/page.tsx` (entire route)
- `src/app/lien-he/page.tsx` (entire route)
- `src/components/Header.tsx`
- `src/components/Footer.tsx`

## Decisions Made

- **`??` not `||` for siteUrl fallback** — `NEXT_PUBLIC_SITE_URL=""` (empty string) must fail loudly with `new URL('')` throwing, not silently fall through. `??` only triggers on `null` / `undefined`, exactly the semantics we want.
- **Three explicit phone formats** — `phoneDisplay` (UI), `phoneE164` (tel: href), `phoneRaw` (zalo URL builder). Conflating them creates Pitfall #7 (tel hrefs break when copied from display string). Each downstream consumer picks the format it needs.
- **`taxId` vs `taxIdDisplay`** — JSON-LD `taxID` schema requires no spaces; Vietnamese MST convention shows spaces. Separation upstream avoids per-consumer formatting helpers.
- **Stripped /du-an Header/Footer rather than deleting the route** (Rule 3 auto-fix) — PROJECT.md Active requirements include `Trang /du-an danh sách dự án`. Deleting Header.tsx/Footer.tsx would break `du-an/page.tsx` build; stripping the usage is the minimal change that preserves the planned route. Phase 2 or 3 will rewrite this page.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Stripped Header/Footer references from `src/app/du-an/page.tsx`**
- **Found during:** Task 4 (pre-deletion import audit)
- **Issue:** The plan's FND-07 deletion list (`Header.tsx`, `Footer.tsx`) did not account for `src/app/du-an/page.tsx`, which imports and renders both components. PROJECT.md Active Requirements explicitly lists `/du-an` as required, so deleting the route was not an option. Without an auto-fix, deleting `Header.tsx`/`Footer.tsx` would break the build.
- **Fix:** Removed the two import statements and the `<Header />` / `<Footer />` JSX usage, added a `NOTE(plan-01-02)` comment explaining Phase 2 will introduce new Nav/Footer and Phase 3 will rewrite this page.
- **Files modified:** `src/app/du-an/page.tsx`
- **Verification:** `npm run build` clean from empty state after the strip; `/du-an` route still generates as static HTML.
- **Committed in:** `e551260` (Task 4 commit; bundled with the deletions since they are tightly coupled — rollback of Task 4 must revert this strip too).

---

**Total deviations:** 1 auto-fixed (Rule 3 — blocking)
**Impact on plan:** Zero scope creep. The strip is the minimal change required for the planned deletion to succeed.

## Issues Encountered

- **Workspace lockfile ambiguity (carried from Plan 01)** — Next.js still emits "We detected multiple lockfiles and selected the directory of /Users/congphan/pnpm-lock.yaml as the root directory" warning. Build still passes; cosmetic only. Out of scope for Phase 1.
- **Pre-existing unstaged changes in working tree** — `tsconfig.json` had pre-existing modifications and two old `.planning/.../*.md → -PLAN.md` renames sat unstaged before this plan started. These were NOT staged or committed as part of this plan (per task_commit_protocol — only task-related files staged individually).

## Known Stubs

- **`src/app/page.tsx` Phase 1 sentinel** — Intentional. The entire file body is a placeholder until Phase 3 composes the real Hero/Services/Projects/Contact sections. Comments at top document the removal path.
- **`src/app/du-an/page.tsx`** — Pre-existing skeleton list view. Currently lacks Nav/Footer (stripped in this plan). Phase 2 (Nav/Footer) and Phase 3 (real page composition) will address.

## User Setup Required

None — `NEXT_PUBLIC_SITE_URL` is optional (default `https://khangthinhinv.vn` baked into `lib/site.ts`). User may create `.env.local` with an override for dev/preview deploys but is not required to.

## Next Phase Readiness

**Ready for Phase 2 (`02-skeleton-replace`):**
- `lib/site.ts` ready for consumption — Nav/Footer/FloatingZalo can `import { company, telHref, zaloHref, mailtoHref } from '@/lib/site'`
- Tailwind utilities confirmed working (`bg-burgundy`, `text-bone`, all 8 palette colors)
- Font wiring complete — `font-sans` resolves to Be Vietnam Pro across weights 400-900
- Static export stable — `npm run build` → `out/index.html` clean (no metadataBase warning, no orphan imports)

**Critical handoff to Phase 2:**
- Phase 2 (Nav/Footer/FloatingZalo) should leave `src/app/page.tsx` alone — only Phase 3 replaces it with real sections.
- The Phase 1 sentinel in `page.tsx` and the temporary stripped `/du-an` page are intentional placeholders.

**Open notes:**
- Lockfile workspace warning is cosmetic; can be addressed by setting `outputFileTracingRoot: __dirname` in `next.config.ts` or removing the parent `pnpm-lock.yaml`. Out of scope for Phase 1.
- Pre-existing unstaged `tsconfig.json` modifications remain in the working tree — investigate in a future commit if needed.

---
*Phase: 01-foundation-lock-in*
*Completed: 2026-05-26*

## Self-Check: PASSED

**Files verified:**
- FOUND: src/lib/site.ts (single source of truth — siteUrl, company, helpers, Company type)
- FOUND: .env.example (NEXT_PUBLIC_SITE_URL contract)
- FOUND: src/app/layout.tsx (metadataBase wired to siteUrl)
- FOUND: src/app/page.tsx (Phase 1 sentinel — palette + 6 weights + env readout)
- FOUND: src/app/du-an/page.tsx (Header/Footer stripped)
- FOUND: .planning/phases/01-foundation-lock-in/01-02-site-constants-cleanup-SUMMARY.md

**Deletions verified:**
- DELETED: src/app/dich-vu/
- DELETED: src/app/lien-he/
- DELETED: src/components/Header.tsx
- DELETED: src/components/Footer.tsx

**Commits verified:**
- FOUND: ae80c7e (Task 1 — feat: lib/site.ts + .env.example)
- FOUND: 8b38ee1 (Task 2 — feat: wire metadataBase)
- FOUND: 5e4fb05 (Task 3 — chore: replace page.tsx with sentinel)
- FOUND: e551260 (Task 4 — chore: delete skeleton folders)

