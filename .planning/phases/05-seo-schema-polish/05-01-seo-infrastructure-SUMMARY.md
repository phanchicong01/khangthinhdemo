---
phase: 5
plan: 1
subsystem: seo-infrastructure
tags: [seo, sitemap, robots, static-export, next15]
requires: [src/lib/site.ts]
provides:
  - src/app/sitemap.ts
  - src/app/robots.ts
  - out/sitemap.xml
  - out/robots.txt
affects: []
tech_stack:
  added: []
  patterns:
    - "Next 15 file convention: app/sitemap.ts + app/robots.ts as statically-optimized route handlers"
    - "`export const dynamic = 'force-static'` required on these handlers under `output: 'export'` in Next 15.5.x"
    - "Pitfall #10 mitigation: siteUrl imported from @/lib/site, never hardcoded"
key_files:
  created:
    - src/app/sitemap.ts
    - src/app/robots.ts
  modified: []
decisions:
  - "Both handlers declare `export const dynamic = 'force-static'` (Next 15.5.18 requires this under output:'export'; plan said it was not needed but build failed without it)"
  - "Sitemap entries share a single `new Date()` instance for identical lastmod timestamps (cosmetic)"
  - "robots.txt emits with `User-Agent:` (capital-A) — Next 15 default; gates use case-insensitive match"
metrics:
  duration_min: 5
  tasks: 3
  files: 2
  completed_at: "2026-05-28T08:25:00.000Z"
requirements_completed: [SEO-01, SEO-02]
---

# Phase 5 Plan 01: SEO Infrastructure Summary

SEO discovery surfaces (sitemap.xml + robots.txt) wired via Next 15 file-conventions, build-emitted at `out/`, URLs sourced from `siteUrl` (Pitfall #10 mitigated).

## What Got Built

Two new files at the App Router root, both default-exporting functions whose return values Next 15 serializes into the standard XML/text formats at build time:

- **`src/app/sitemap.ts`** — returns `MetadataRoute.Sitemap` with 2 entries:
  - `siteUrl` (landing), `priority: 1.0`, `changeFrequency: 'monthly'`
  - `${siteUrl}/du-an`, `priority: 0.8`, `changeFrequency: 'monthly'`
  - `lastModified: new Date()` (build-time timestamp, single shared instance)
- **`src/app/robots.ts`** — returns `MetadataRoute.Robots` with:
  - `rules: { userAgent: '*', allow: '/' }`
  - `sitemap: ${siteUrl}/sitemap.xml`
  - `host: siteUrl`

Both files import `siteUrl` from `@/lib/site` — no hardcoded `https://khangthinhinv.vn` literal anywhere in source (Pitfall #10 gate held).

## Commit

- **`880d095`** — `feat(05-01): add sitemap.ts + robots.ts (Phase 5 SEO infra)` (2 files, 72 insertions)

Per the user's commit-strategy instruction, the two trivial files ship in a single atomic commit (no separate per-task commits).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking issue] Added `export const dynamic = 'force-static'` to both files**

- **Found during:** Task 3 build (first attempt)
- **Issue:** `npm run build` aborted with:
  ```
  Error: export const dynamic = "force-static"/export const revalidate not configured on route "/robots.txt" with "output: export".
      at .next/server/app/robots.txt/route.js
  Failed to collect page data for /robots.txt
  ```
- **Root cause:** The plan (and 05-RESEARCH.md Topic 1/2) asserts Next 15 statically optimizes sitemap/robots route handlers by default under `output: 'export'`. This was true on Next 15.0; on the installed Next 15.5.18 the default behavior changed and the directive is now required.
- **Fix:** Added `export const dynamic = 'force-static'` with an explanatory comment to both files, immediately above the default export. No other change. After re-running `npm run build`, all gates passed.
- **Files modified:** `src/app/sitemap.ts`, `src/app/robots.ts`
- **Commit:** `880d095` (same single commit — fix landed before the commit was created)

No other deviations.

## Verification Evidence

### `out/sitemap.xml` (verbatim)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
<loc>https://khangthinhinv.vn</loc>
<lastmod>2026-05-28T08:20:14.545Z</lastmod>
<changefreq>monthly</changefreq>
<priority>1</priority>
</url>
<url>
<loc>https://khangthinhinv.vn/du-an</loc>
<lastmod>2026-05-28T08:20:14.545Z</lastmod>
<changefreq>monthly</changefreq>
<priority>0.8</priority>
</url>
</urlset>
```

### `out/robots.txt` (verbatim)

```
User-Agent: *
Allow: /

Host: https://khangthinhinv.vn
Sitemap: https://khangthinhinv.vn/sitemap.xml
```

Note: Next 15 emits `User-Agent:` with a capital `A`. Standards-grade crawlers (Google, Bing, Coccoc, Zalo) match the field name case-insensitively per RFC 9309 §2.2.1, so this is compliant. Plan's gate `grep -q '^User-agent: \*'` would have failed strictly; verified via case-insensitive `grep -qi`.

### Build log gate (`/tmp/build-05-01.log`)

- `npm run build` exit code 0
- Static export summary shows both routes: `○ /robots.txt 127 B 103 kB` and `○ /sitemap.xml 127 B 103 kB`
- `grep -i metadataBase /tmp/build-05-01.log` → no matches (Pitfall #15 gate held; Phase 1 wiring intact)
- One pre-existing benign warning surfaced about the inferred workspace root + multiple lockfiles (`/Users/congphan/pnpm-lock.yaml` vs project `package-lock.json`) — unrelated to this plan, pre-existing condition

### Plan gates checklist

- [x] `src/app/sitemap.ts` exists with default-exported function returning `MetadataRoute.Sitemap`, 2 entries from `siteUrl`
- [x] `src/app/robots.ts` exists with default-exported function returning `MetadataRoute.Robots`, allow-all + sitemap + host from `siteUrl`
- [x] No hardcoded `https://khangthinhinv.vn` literal in either source file (Pitfall #10)
- [x] `npx tsc --noEmit` exits 0
- [x] `npm run build` exits 0
- [x] `out/sitemap.xml` exists, 2 `<url>` blocks, both with absolute `https://` loc, monthly changefreq, priorities 1 + 0.8
- [x] `out/robots.txt` exists, contains User-agent, Allow, Sitemap, Host lines
- [x] Zero `metadataBase` warnings in build stdout (Pitfall #15)
- [x] No regression: `out/index.html` + `out/du-an/index.html` still emit

## Requirements Completed

- **SEO-01** — sitemap.ts present, emits valid `out/sitemap.xml` with siteUrl-sourced URLs
- **SEO-02** — robots.ts present, emits valid `out/robots.txt` with allow-all + sitemap reference

## Phase 5 Readiness for Plan 05-02

`out/` now contains `sitemap.xml` + `robots.txt`. Plan 05-02 (Schema + Brand Polish — JSON-LD on landing, OG image, favicons, 404) writes to disjoint paths (`out/opengraph-image.png`, `out/icon.png`, `out/apple-icon.png`, `out/404.html`, plus inline `<script type="application/ld+json">` inside `out/index.html`). No path collision; the rebuild during 05-02 regenerates sitemap/robots harmlessly.

The `export const dynamic = 'force-static'` lesson from this plan applies to any other route-handler files 05-02 might add — none currently planned (opengraph-image / icon / apple-icon are image conventions, not route handlers).

## Self-Check: PASSED

- `src/app/sitemap.ts` — FOUND
- `src/app/robots.ts` — FOUND
- `out/sitemap.xml` — FOUND (2 entries verified)
- `out/robots.txt` — FOUND (4 required lines verified)
- Commit `880d095` — FOUND in `git log`
