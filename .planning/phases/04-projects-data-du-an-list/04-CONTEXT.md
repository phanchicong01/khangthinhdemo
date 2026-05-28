# Phase 4: Projects Data + `/du-an` List - Context

**Gathered:** 2026-05-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Project data lives in **one typed module** `src/lib/projects.ts` consumed by BOTH the landing `Projects` section AND the standalone `/du-an` list route. The `/du-an` page exists today but uses legacy palette/data — Phase 4 rewrites it with Burgundy/Bone styling and refactors the landing Projects section to import from the new module.

**In scope:**
- Create `src/lib/projects.ts` with typed `Project[]` (slug/title/client/location/year/scope/summary + optional icon/blockBg)
- Refactor `src/components/sections/Projects.tsx` (landing) to import from the new module — keep visual unchanged, drop hardcoded const
- Rewrite `src/app/du-an/page.tsx` with Burgundy/Bone palette, same card visual as landing, plus `summary` text per card
- Wire `/du-an` page metadata (title, description, canonical) distinct from root layout
- Add "← Về trang chủ" back link in `/du-an` header that links to `/#du-an` (works after fresh page load)
- Confirm `trailingSlash: true` (from Phase 1) keeps `/du-an` and `/du-an/` both resolving

**Out of scope (other phases):**
- `/du-an/[slug]` detail routes — explicitly OUT per PROJECT.md (PROJ-DETAIL-01..03 deferred)
- Image gallery component — deferred until photo assets exist
- JSON-LD `BreadcrumbList` schema, sitemap inclusion of `/du-an` — Phase 5
- OG image for `/du-an` — Phase 5
- Filter/sort UI on `/du-an` — only 4 projects, no filter needed (deferred)
- More than 4 projects — current canonical list is 4 entries (3 QP + 1 grouped nhà phố). Adding entries is a content task outside this phase.

</domain>

<decisions>
## Implementation Decisions

### Data shape: `lib/projects.ts` (PROJ-01)

- **D-01:** Canonical project count = **4 entries** matching Phase 3 `Projects.tsx`. NO splitting of "Nhà phố tiêu biểu" into 3 separate entries. Landing and `/du-an` show the same 4 projects.
- **D-02:** Exported `Project` type:
  ```ts
  import type { LucideIcon } from 'lucide-react'

  export type Project = {
    slug: string           // kebab-case URL fragment; stable identifier
    title: string          // public display name
    client: string         // named client(s) — front-and-center per FEATURES.md
    location: string       // "Cà Mau" / "Long An" etc.
    year: string           // "2024" / "2025"
    scope: string          // role/work description — Phase 3 `role` maps here 1-to-1
    summary: string        // 1–2 sentence description (used on /du-an, NOT landing)
    icon: LucideIcon       // Lucide React icon (kept here so both landing + /du-an reuse)
    blockBg: 'bg-burgundy' | 'bg-espresso'  // color block bg for visual consistency
  }

  export const projects: readonly Project[] = [ ... ] as const
  ```
- **D-03:** Field mapping from Phase 3 `Projects.tsx` to lib schema:
  - `name` → `title`
  - `role` → `scope`
  - new field: `slug` (D-04 below)
  - new field: `location` (D-05 below)
  - new field: `summary` (D-06 below)
  - keep: `client`, `year`, `icon` (renamed from `Icon` lowercase to match convention), `blockBg`
- **D-04:** Slugs (kebab-case, stable identifiers):
  - `cao-toc-cai-nuoc-dat-mui`
  - `cau-cua-lon-dat-mui`
  - `duong-ra-dao-hon-khoai`
  - `nha-pho-tieu-bieu`
- **D-05:** Locations (string per project):
  - Cao tốc Cái Nước → "Đất Mũi, Cà Mau"
  - Cầu Cửa Lớn → "Đất Mũi, Cà Mau"
  - Đường ra Hòn Khoai → "Đảo Hòn Khoai, Cà Mau"
  - Nhà phố tiêu biểu → "Long An · Thạnh Hóa · Mỹ Yên"
- **D-06:** Summary (1–2 sentences each, honest, B2B register — planner finalizes exact wording within these guidelines):
  - **Cao tốc Cái Nước:** "Cung ứng khối lượng lớn cát, đá, vật liệu san lấp và vận chuyển bằng đường thủy đến công trường cao tốc — dự án trọng điểm thuộc Bộ Quốc phòng — Binh đoàn 12 — Trường Sơn."
  - **Cầu Cửa Lớn:** "Cung cấp vật liệu xây dựng và vận chuyển đường thủy phục vụ thi công cầu Cửa Lớn — Đất Mũi Cà Mau — dự án thuộc Binh đoàn 12 — Trường Sơn."
  - **Đường ra Hòn Khoai:** "Vận chuyển đường thủy cát, đá và vật liệu thi công phục vụ tuyến giao thông ra đảo Hòn Khoai — công trình do Binh đoàn 12 — Trường Sơn triển khai."
  - **Nhà phố tiêu biểu:** "Thi công xây dựng nhà phố dân dụng tại Long An (Thạnh Hóa, Mỹ Yên) — các công trình tiêu biểu của Cô Thúy, Anh Bình, Chị Ngọc."
- **D-07:** Years confirmed: **"2024"** for 3 QP projects, **"2025"** for Nhà phố tiêu biểu. (User confirmed Phase 3 best-guess.)
- **D-08:** `scope` field uses Phase 3 `role` values verbatim: "Cung ứng VLXD + vận chuyển" (3 QP projects), "Thi công xây dựng" (Nhà phố).
- **D-09:** `lib/projects.ts` also exports a helper `getFeaturedProjects()` returning all 4 (currently a passthrough — future-proofing if more projects are added later, landing can still show featured-only subset).

### Landing `Projects.tsx` refactor

- **D-10:** Landing `Projects.tsx` MUST import from `@/lib/projects` — delete the local hardcoded `PROJECTS` const. Render via `projects.map(...)` (or `getFeaturedProjects().map(...)`).
- **D-11:** Landing card visual = **unchanged** from Phase 3 (color block 200px + icon + name + client + year·scope). Do NOT show `summary` on landing — keep compact for fast scan.
- **D-12:** Landing card markup uses `project.title`, `project.client`, `project.year`, `project.scope`, `project.icon`, `project.blockBg`. Field rename `name → title` and `role → scope` propagates here.
- **D-13:** "Xem tất cả dự án →" CTA still links to `/du-an` (unchanged from Phase 3).

### `/du-an` page rewrite

- **D-14:** `src/app/du-an/page.tsx` is fully rewritten. The current legacy file (blue palette, 6 entries, emoji icons) is DELETED in this phase.
- **D-15:** Page metadata (PROJ-03):
  ```ts
  export const metadata: Metadata = {
    title: 'Dự án tiêu biểu | Khang Thịnh Investment',
    description: '4 dự án tiêu biểu Khang Thịnh đã thực hiện: cao tốc Cái Nước — Đất Mũi Cà Mau, cầu Cửa Lớn, đường ra đảo Hòn Khoai (đối tác Bộ Quốc phòng — Binh đoàn 12 — Trường Sơn), nhà phố tiêu biểu Long An.',
    alternates: { canonical: '/du-an' }
  }
  ```
- **D-16:** Page header (top of `<main>`):
  - Back link "← Về trang chủ" (Lucide `ArrowLeft` icon, text-link burgundy, underline-on-hover) — placed ABOVE the H1
  - H1 "Dự án tiêu biểu" (font-black uppercase text-4xl md:text-5xl burgundy)
  - Sub-text 1 line: "Những công trình Khang Thịnh đã thực hiện — đối tác Bộ Quốc phòng, Binh đoàn 12, Trường Sơn." (text-espresso)
  - NO Hero block — compact header on bg-bone
  - NO breadcrumb (back link covers nav need for a 2-route site)
- **D-17:** Card grid = **same 2×2 desktop / 1-col mobile** as landing Projects. Reuses the color-block-200px + icon visual.
- **D-18:** Difference between landing card and `/du-an` card:
  - Landing card: title → client → year·scope (compact, 4 lines visible)
  - `/du-an` card: title → client → location → year · scope → `summary` (5–6 lines visible)
  - `/du-an` card height is taller; grid gap remains the same.
- **D-19:** Container = `max-w-6xl mx-auto px-4`, section padding `py-20 md:py-24` — identical to landing Projects section.
- **D-20:** **No filter, no sort, no search** — only 4 entries.
- **D-21:** `/du-an` page is a **server component** (no `'use client'`). Static export safe.

### Back link & SEO

- **D-22:** Back link `href="/#du-an"` — hash anchor to landing Projects section. Works after a fresh page load (browser handles hash scroll automatically). MUST use Next `<Link href="/#du-an">` (or plain `<a>`) — do NOT use `router.back()` (fails on direct visits per SC4).
- **D-23:** Back link is positioned ONLY in the page header (D-16). No duplicate at bottom. Site is small; users can also use Nav at top.
- **D-24:** `trailingSlash: true` from Phase 1 already in `next.config.ts` — both `/du-an` and `/du-an/` resolve. No code change needed; planner verifies via `out/du-an/index.html` exists.
- **D-25:** Canonical URL = `/du-an` (no trailing slash inside `<link rel="canonical">`). The static-export trailing slash is a URL routing convention, not a canonical signal.

### Cross-cutting (locked from prior phases)

- **D-26:** Same palette tokens from Phase 1 (`bg-bone`, `bg-bone-dark`, `bg-burgundy`, `bg-espresso`, `text-burgundy`, `text-bone`, `text-espresso`, `text-taupe`, `border-burgundy`, `border-taupe`).
- **D-27:** Same Be Vietnam Pro font (already wired in root layout). All weights (400-900) available.
- **D-28:** Nav + Footer + FloatingZalo render on `/du-an` automatically via root layout — no extra wiring needed.
- **D-29:** Tap targets ≥44×44px on the back link and any tappable card area (carry forward Phase 2 D-21).
- **D-30:** Vietnamese user-facing text, English code/comments (project CLAUDE.md).

### Claude's Discretion

- Exact Tailwind class compositions (text size, shadow values, transition durations).
- Whether the back link displays as inline text "← Về trang chủ" or as a button with border — recommended inline text to match minimal page header (D-16).
- Whether to wrap each `/du-an` card in `<article>` vs `<div>` — recommended `<article>` for semantic HTML (helpful for Phase 5 SEO).
- Whether to add `aria-label` on each card linking back to `#du-an` for screen-reader context — recommended yes if the title alone is ambiguous.
- The exact ordering of `Project[]` (current order matches landing Phase 3) — keep stable to avoid accidental layout shift.
- Whether the helper `getFeaturedProjects()` is exported or unused in Phase 4 — recommended export it now (cheap future-proofing).
- Whether to delete the legacy `src/app/du-an/page.tsx` content via `git rm` and `Write` a new file, or just rewrite — either is fine; rewrite via `Write` is simpler.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project-level
- `.planning/PROJECT.md` — Core value, out-of-scope list (PROJ-DETAIL out, image gallery out, CMS out)
- `.planning/REQUIREMENTS.md` — PROJ-01..03 acceptance criteria
- `.planning/ROADMAP.md` §Phase 4 — SC1-SC4, Pitfalls #2 trailing slash + #11 anchor-only-SEO
- `/Users/congphan/Workspace/my-projects/khang-thing-group/CLAUDE.md` — Company facts canonical (parent dir)
- `/Users/congphan/Workspace/my-projects/khang-thing-group/website/CLAUDE.md` — Project conventions (VN user-facing, EN code, concise)

### Prior phase outputs (consumed by Phase 4)
- `src/lib/site.ts` — Single source of truth for company facts (NOT modified in Phase 4)
- `src/components/sections/Projects.tsx` — Source for hardcoded data → migrate to `lib/projects.ts`; this file is REFACTORED in Phase 4
- `src/app/du-an/page.tsx` — Current legacy state with blue palette and 6 entries; REWRITTEN in Phase 4
- `src/app/layout.tsx` — Root layout (NOT modified — Nav/Footer/FloatingZalo wraps every route automatically)
- `src/app/globals.css` — Existing scroll-margin-top: 4.5rem rule applies to `#du-an` anchor on landing (D-22 relies on this)
- `next.config.ts` — `trailingSlash: true` from Phase 1 (D-24 relies on this)
- `.planning/phases/03-landing-sections/03-CONTEXT.md` — Phase 3 decisions D-15..D-19 about Projects section layout (Phase 4 refactor MUST preserve this visual)
- `.planning/phases/03-landing-sections/03-02-stats-close-compose-SUMMARY.md` — Latest Projects.tsx state

### Research / pitfalls
- `.planning/research/PITFALLS.md` §"Pitfall #2: Trailing slash quirks" — verify `/du-an` and `/du-an/` both resolve
- `.planning/research/PITFALLS.md` §"Pitfall #11: Anchor-only SEO weakness" — `/du-an` provides a 2nd indexable URL (this is the Phase 4 contribution)
- `.planning/research/FEATURES.md` — "Project portfolio with named clients" is a Table Stakes trust signal — keep named clients front-and-center on both views

### External (no external specs required)
No external ADRs/specs for Phase 4 — static TS const + App Router list page is well-documented in Next.js docs.

</canonical_refs>

<deferred>
## Deferred Ideas

Captured here so they're not lost.

- **`/du-an/[slug]` detail pages** — explicitly OUT per PROJECT.md "Out of Scope". Resurfaces once photo assets exist.
- **Image gallery component** — deferred.
- **Filter/sort UI** — only 4 projects; revisit when count >10.
- **BreadcrumbList JSON-LD** — Phase 5.
- **OG image for `/du-an`** — Phase 5.
- **More than 4 projects** — content/data task outside this phase.
- **`getFeaturedProjects()` actually filtering** — currently returns all 4; resurfaces when project count grows.
- **Achievement metrics (m³, ngày công)** — considered for D-06; rejected to avoid fabricated numbers. Resurfaces if user supplies verified data.
- **Hero block on `/du-an`** — rejected (D-16 chose compact header). Resurfaces if `/du-an` content grows substantially.

</deferred>

<open_questions>
## Open Questions for Planning

Planner derives from codebase — do NOT re-ask user:

1. **Plan partition** — Recommend single plan for Phase 4 (1 plan, 3-4 tasks): (1) create `lib/projects.ts`, (2) refactor landing `Projects.tsx`, (3) rewrite `/du-an/page.tsx`, (4) final build + verify both routes in `out/`. Alternative is 2 plans split at the refactor boundary — adds overhead with no clear benefit for this small phase.
2. **Icon imports in lib/projects.ts** — LucideIcon as a value (Construction, GitBranch, Anchor, Home) imported INTO the data module is unusual but acceptable in Next.js. Planner verifies tree-shaking still works (lucide-react is per-icon import).
3. **`getFeaturedProjects()` placement** — top-level export of `lib/projects.ts` next to `projects` const. Implementation: `() => projects` (passthrough). Type return = `readonly Project[]`.
4. **Card aria-label on /du-an** — Claude's discretion (D-32 above). Recommend `aria-label={`Dự án ${project.title} – ${project.client}`}` on `<article>` to give screen readers full context without relying on visual order.
5. **Verify SC2 acceptance via grep on `out/du-an/index.html`** — must contain all 4 project titles, all 4 client strings, all 4 location strings, all 4 summary strings, and "Về trang chủ" back-link text. Plus `<link rel="canonical" href="/du-an">` or equivalent.
6. **Anchor jump SC4 acceptance** — automatable check: `out/du-an/index.html` contains `href="/#du-an"` (the static link). Manual smoke check (browser) after deploy is the gold-standard — could become part of Phase 6 audit.

</open_questions>

<next_steps>
## Next Steps

1. Skip `/gsd:research-phase 4` per ROADMAP "Research needed: NO".
2. Skip UI-SPEC — CONTEXT.md captures everything visual.
3. **Run `/gsd:plan-phase 4`** — Planner produces 1 PLAN.md (recommended) with 3-4 tasks.
4. After plan-checker PASS, run `/gsd:execute-phase 4`.

</next_steps>
