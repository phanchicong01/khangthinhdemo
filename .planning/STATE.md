---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: Phase 5 complete — Phase 6 next (Audit + Launch)
stopped_at: Completed 05-02-schema-brand-polish-PLAN.md — Phase 5 done
last_updated: "2026-05-28T08:35:00.000Z"
progress:
  total_phases: 6
  completed_phases: 5
  total_plans: 9
  completed_plans: 9
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-05-26)

**Core value:** Khách hàng tiềm năng — sau khi xem website — tin tưởng đủ để gọi/Zalo liên hệ tư vấn
**Current focus:** Phase 04 — projects-data-du-an-list

## Current Position

Phase: 05 (seo-schema-polish) — COMPLETE
Next: Phase 06 (audit-launch)

## Performance Metrics

**Velocity:**

- Total plans completed: 0
- Average duration: —
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| - | - | - | - |

**Recent Trend:**

- Last 5 plans: —
- Trend: —

*Updated after each plan completion*
| Phase 01 P01 | 3 | 4 tasks | 5 files |
| Phase 01 P02 | 20min | 5 tasks | 9 files |
| Phase 02 P01 | 3min | 3 tasks | 8 files |
| Phase 02 P02 | 5min | 1 tasks | 1 files |
| Phase 03 P01 | 3min | 3 tasks | 5 files |
| Phase 03 P02 | 3min | 3 tasks | 5 files |
| Phase 04 P01 | 2min | 4 tasks | 3 files |
| Phase 05 P01 | 5min | 3 tasks | 2 files |
| Phase 05 P02 | 18min | 6 tasks | 5 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Init: Rebuild từ đầu theo Mẫu A (industrial), không port code skeleton cũ
- Init: Palette Burgundy + Bone (light mode)
- Init: 1 font family Be Vietnam Pro (bỏ Bebas Neue do thiếu Vietnamese diacritics)
- Init: Deploy Cloudflare Pages (loại GitHub Pages do ToS commercial restriction)
- Init: next/font/google với subset Vietnamese explicit
- Init: Site URL qua env var `NEXT_PUBLIC_SITE_URL`
- [Phase 01]: Adopted next/font/google over @fontsource (per RESEARCH.md prescription)
- [Phase 01]: Tailwind v4: @theme {} for utility tokens; @theme inline {} for var-referencing tokens; :root {} for semantic aliases
- [Phase 01]: Use `??` (nullish coalescing) not `||` for siteUrl fallback — empty env vars must fail loudly
- [Phase 01]: Three explicit phone formats in lib/site.ts (display/E.164/raw) — prevents Pitfall #7 tel-href breakage
- [Phase 01]: Auto-fix: stripped Header/Footer from /du-an page rather than deleting the route (PROJECT.md requires /du-an)
- [Phase 02]: Picked useState for Nav mobile menu over CSS-only peer-checked for ESC + auto-close + accurate aria-expanded a11y
- [Phase 02]: Placed shell components under src/components/layout/ (nested) anticipating Phase 3 src/components/sections/
- [Phase 02]: Preserved Phase 1 sentinel content inside #nang-luc <details> debug card; will be removed in Phase 3
- [Phase 02]: Phase 02: Real-device CTA smoke test PASSED on iOS Safari + Android Chrome — tel/zalo.me/mailto handlers all fire, smooth-scroll lands below sticky nav, FloatingZalo FAB visibility OK. Phase 2 complete.
- [Phase 03]: Phase 03: Project years 2024/2025 in Projects.tsx are BEST-GUESS per CONTEXT D-16 — user must confirm before Phase 4 lib/projects.ts extraction
- [Phase 03]: Phase 03: Server-component-by-default for sections — marquee animation pure CSS @keyframes translateX with prefers-reduced-motion guard, no client component added
- [Phase 03]: Phase 03: Project icon picks Construction/GitBranch/Anchor/Home; color-block alternation P1=burgundy, P2=espresso, P3=espresso, P4=burgundy (no adjacent same color in 2-col grid)
- [Phase 03]: Phase 03: Cơ giới capability icon = Truck (D-23 candidate choice); reinforces fleet-mobility cue + matches Services VLXD icon
- [Phase 03]: Phase 03: 'Giờ làm việc' omitted from Contact (D-31 Claude's Discretion declined — no confirmed business hours commitment)
- [Phase 03]: Phase 03: #nang-luc lives on a wrapping <section> in page.tsx around BigStats + Capabilities — neither child carries an id
- [Phase 03]: Phase 03: Background alternation finalized — bone/espresso/bone-dark/bone/bone-dark/bone/espresso/bone-dark; no two adjacent espresso bands
- [Phase 04]: Phase 04: lib/projects.ts is single source of truth — both landing Projects.tsx and /du-an/page.tsx import 'projects' directly; getFeaturedProjects() exported but unused (future-proofing for >4 projects)
- [Phase 04]: Phase 04: /du-an back link uses static Next Link href='/#du-an' (NOT router.back) — works on direct visit/refresh per SC4
- [Phase 04]: Phase 04: /du-an cards use <h2> (under page <h1>) + aria-label='Dự án {title} – {client}' on <article> for semantic + screen-reader context
- [Phase 05]: Phase 05 P01: Next 15.5.18 requires `export const dynamic = 'force-static'` on sitemap.ts + robots.ts route handlers under output:'export' (plan/research assumed default static-opt — build aborted; added directive)
- [Phase 05]: Phase 05 P01: robots.txt emits `User-Agent:` (capital-A) from Next 15; RFC 9309 §2.2.1 makes field-name match case-insensitive, so compliant — gate uses `grep -qi`
- [Phase 05]: Phase 05 P02: Satori (next/og engine) parses TTF/OTF only — Google Fonts CSS2 must be fetched with bare 'Mozilla/5.0' UA to get .ttf URL (a full Chrome UA returns .woff2 which fails Satori with 'Unsupported OpenType signature wOF2')
- [Phase 05]: Phase 05 P02: JSON-LD `image` field kept as `${siteUrl}/og.png` even though Next 15 emits OG image at extensionless `/opengraph-image` URL — JSON-LD `image` is a rich-results hint; canonical share URL is the Next-injected `og:image` meta tag (acceptable divergence)
- [Phase 05]: Phase 05 P02: Vietnamese diacritic visual gate (D-13b) PASSED on first build — Be Vietnam Pro `subset=vietnamese` renders Ị/ứ/â/ự/ậ/ể/ợ/á/ù correctly; Option A/B fallback not triggered
- [Phase 05]: Phase 05 P02: `export const dynamic = 'force-static'` applied proactively to all 3 ImageResponse routes (opengraph-image, icon, apple-icon) — extends Phase 5 P1 learning to image conventions

### Pending Todos

None yet.

### Blockers/Concerns

None yet. Pre-Phase-1 lock checklist resolved in initialization (font, deploy, domain method).

## Session Continuity

Last session: 2026-05-28T08:35:00.000Z
Stopped at: Completed 05-02-schema-brand-polish-PLAN.md — Phase 5 done
Resume file: None
Next action: Begin Phase 6 (audit-launch) — Lighthouse, Rich Results, real-device CTA tests, Cloudflare Pages deploy
