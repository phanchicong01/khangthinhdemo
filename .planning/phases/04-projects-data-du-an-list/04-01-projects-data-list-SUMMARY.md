---
phase: 04-projects-data-du-an-list
plan: 01-projects-data-list
subsystem: projects-data + du-an-route
tags: [data-module, refactor, page-rewrite, seo, lib]
requires:
  - "@/lib/site (untouched — reference pattern only)"
  - "next.config.ts trailingSlash: true (Phase 1)"
  - "Burgundy/Bone palette tokens (Phase 1)"
  - "Root layout Nav/Footer/FloatingZalo wrap (Phase 2)"
provides:
  - "src/lib/projects.ts — Project type + projects[] + getFeaturedProjects()"
  - "Refactored landing Projects section (no local PROJECTS const)"
  - "Rewritten /du-an list route with metadata + back link"
  - "Second indexable URL with distinct H1 + metadata (PITFALL #11 mitigation)"
affects:
  - "src/lib/projects.ts (NEW)"
  - "src/components/sections/Projects.tsx (refactored)"
  - "src/app/du-an/page.tsx (full rewrite)"
tech-stack:
  added: []
  patterns:
    - "lib/* modules as single source of truth (mirrors lib/site.ts pattern)"
    - "Server-component list page consuming typed data via `from '@/lib/...'`"
    - "Next.js `metadata.alternates.canonical` for page-distinct canonical"
key-files:
  created:
    - "src/lib/projects.ts"
  modified:
    - "src/components/sections/Projects.tsx"
    - "src/app/du-an/page.tsx"
decisions:
  - "Used `projects` (direct import) over `getFeaturedProjects()` in both consumers — simpler; helper still exported for future-proofing per D-09"
  - "Card titles on /du-an use `<h2>` to maintain proper outline order beneath single `<h1>`"
  - "`aria-label={\\`Dự án ${title} – ${client}\\`}` on every <article> on /du-an for screen-reader context (CONTEXT Open Q4)"
  - "Back link uses Next `<Link>` for client-side nav AND hash anchor works on direct visit (SC4)"
metrics:
  duration: "2min"
  completed: "2026-05-28"
  tasks: 4
  files_touched: 3
---

# Phase 4 Plan 01: Projects Data + /du-an List Summary

**One-liner:** Extracted 4-project dataset into typed `src/lib/projects.ts`, refactored landing Projects section to consume it, and fully rewrote `/du-an` route with Burgundy/Bone palette + page-distinct metadata + static-href back link.

## What Changed

### Created

- **`src/lib/projects.ts`** — Single source of truth for project data
  - `export type Project` — 9 fields (slug, title, client, location, year, scope, summary, icon, blockBg)
  - `export const projects: readonly Project[]` — 4 entries (D-04 slugs, D-05 locations, D-06 summaries, D-07 years, D-08 scope)
  - `export const getFeaturedProjects` — passthrough helper (D-09)
  - Imports Lucide icons (Construction, GitBranch, Anchor, Home) into the data module — tree-shaking preserved via per-icon ESM imports

### Modified

- **`src/components/sections/Projects.tsx`** — Refactored (D-10..D-13)
  - Removed local `type Project` + local `const PROJECTS`
  - Removed local Lucide imports (Construction/GitBranch/Anchor/Home)
  - Added `import { projects } from '@/lib/projects'`
  - JSX field renames: `p.name → p.title`, `p.role → p.scope`, `p.Icon → const Icon = p.icon`, `key={p.slug}`
  - `summary` NOT rendered (D-11 — compact landing card)
  - Visual unchanged: 200px color block + icon + h3 title + client + year·scope

- **`src/app/du-an/page.tsx`** — Full rewrite (D-14..D-25)
  - Removed: legacy blue palette (`#1a5276`, `#2e86c1`, `#f39c12`, `#1c2833`), `typeColors` lookup, emoji icons (📍 👷 🏢), 6-entry legacy array, Hero block
  - Server component (no `'use client'`)
  - Imports: `Metadata` type, `Link` (next/link), `ArrowLeft` (lucide), `projects` (@/lib/projects)
  - Metadata: exact D-15 title `'Dự án tiêu biểu | Khang Thịnh Investment'` + D-15 description + `alternates.canonical: '/du-an'`
  - Page header: `<Link href="/#du-an">` (ArrowLeft + "Về trang chủ") → H1 → sub-text
  - 2×2 card grid mirroring landing visual + `location` + `summary` per card
  - `<article aria-label="Dự án {title} – {client}">` for screen readers

## Tasks Executed

| # | Task                                       | Commit    | Files                                |
| - | ------------------------------------------ | --------- | ------------------------------------ |
| 1 | Create src/lib/projects.ts                 | `5d39c6c` | src/lib/projects.ts (new)            |
| 2 | Refactor sections/Projects.tsx             | `e923ecd` | src/components/sections/Projects.tsx |
| 3 | Rewrite app/du-an/page.tsx                 | `0cd7b28` | src/app/du-an/page.tsx               |
| 4 | Build verify (no source changes)           | —         | out/index.html, out/du-an/index.html |

## Verification Results

### TypeScript

```
npx tsc --noEmit → exit 0 (after each task)
```

### Build

```
npm run build → exit 0
Route (app)         Size  First Load JS
○ /                 797 B    103 kB
○ /du-an            171 B    107 kB
```

### Static export grep table (out/)

| Check                                                     | Status |
| --------------------------------------------------------- | ------ |
| out/index.html exists                                     | PASS   |
| out/index.html contains all 4 project titles + clients    | PASS   |
| out/du-an/index.html exists (PITFALL #2 trailing slash)   | PASS   |
| out/du-an/ has metadata title "Dự án tiêu biểu \| ..."    | PASS   |
| out/du-an/ has D-15 description fragment                  | PASS   |
| out/du-an/ has all 4 D-06 summary fragments               | PASS   |
| out/du-an/ has all 4 D-05 locations                       | PASS   |
| out/du-an/ has back link `href="/#du-an"`                 | PASS   |
| out/du-an/ has "Về trang chủ" text                        | PASS   |
| out/du-an/ contains `+84921985599` (Footer)               | PASS   |
| out/du-an/ contains `zalo.me/0921985599` (FloatingZalo)   | PASS   |
| out/du-an/ has `rel="canonical"` link                     | PASS   |
| No `#1a5276` / `#2e86c1` / `#f39c12` in /du-an output     | PASS   |
| No emoji (📍 👷 🏢) in /du-an output                       | PASS   |
| No `typeColors` lookup in /du-an output                   | PASS   |

## Decisions Made (within Claude's Discretion)

1. **Used `projects` directly (not `getFeaturedProjects()`) in both consumers** — simpler, matches Phase 3 import style; helper is exported and available for future expansion when project count > featured-4.
2. **`<h2>` for card titles on /du-an** — H1 is "Dự án tiêu biểu" (page heading); each card title is a subordinate heading. Maintains semantic outline order.
3. **`aria-label` on every /du-an card** — Per CONTEXT Open Q4 recommendation: gives screen readers full "Dự án {title} – {client}" context without relying on visual order.
4. **Back link via Next `<Link>`** — Client-side nav back to landing (smooth) while still working as a hash anchor on direct visit (browser handles `/#du-an` scroll natively after full page load → SC4 satisfied).
5. **Canonical URL in output** — Next.js auto-resolves `alternates.canonical: '/du-an'` to absolute `https://khangthinhinv.vn/du-an/` (with trailing slash applied by `trailingSlash: true` config). This matches D-25 intent — the trailing-slash URL is the canonical static-export form.

## Deviations from Plan

**None.** All 4 tasks executed exactly as written. No auto-fixes triggered (Rules 1–4 not invoked).

Pre-existing untracked files in `.planning/` and modified `tsconfig.json` were observed but are out of scope for this plan (they predate session start — see "Out of Scope" below).

## Out of Scope (Deferred)

- `tsconfig.json` was auto-formatted by `next build` (added `target: "ES2017"`, line-broke arrays). Pre-existing modification — not caused by this plan's source changes. No action taken.
- Untracked legacy plan files (`01-01-config-tokens-fonts-PLAN.md` etc.) and verification artifacts predate this session. Deferred to a separate housekeeping commit if user requests.

## Requirements Completed

- **PROJ-01** — Typed `Project[]` source of truth (lib/projects.ts with 9 fields × 4 entries) — **DONE**
- **PROJ-02** — `/du-an` list view rendering all 4 with named clients + location + scope + summary — **DONE**
- **PROJ-03** — `/du-an` page metadata (distinct title, D-15 description, canonical `/du-an`) — **DONE**

## Phase 5 Readiness Note

`@/lib/projects` is now a stable import target. Phase 5 (`sitemap.ts`) can optionally include `/du-an` (already trivially derivable from app routes) without needing to import `projects` — the lib is ready when/if `/du-an/[slug]` is resurfaced from deferred scope.

## Self-Check: PASSED

- src/lib/projects.ts FOUND
- src/components/sections/Projects.tsx FOUND (modified)
- src/app/du-an/page.tsx FOUND (rewritten)
- out/index.html FOUND
- out/du-an/index.html FOUND
- Commit 5d39c6c FOUND
- Commit e923ecd FOUND
- Commit 0cd7b28 FOUND
