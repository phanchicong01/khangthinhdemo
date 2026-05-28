---
phase: 04-projects-data-du-an-list
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/lib/projects.ts
  - src/components/sections/Projects.tsx
  - src/app/du-an/page.tsx
autonomous: true
requirements: [PROJ-01, PROJ-02, PROJ-03]
must_haves:
  truths:
    - "Visiting / shows landing Projects section rendering 4 projects sourced from lib/projects.ts (not hardcoded const)"
    - "Visiting /du-an renders all 4 projects with title, named client, location, year, scope, and summary visible per card"
    - "/du-an declares its own metadata (title 'Dự án tiêu biểu | Khang Thịnh Investment', description, canonical '/du-an') distinct from root layout"
    - "Back link '← Về trang chủ' on /du-an navigates to /#du-an and works after fresh page load (static href, not router.back)"
    - "Both /du-an and /du-an/ resolve (trailingSlash: true) — out/du-an/index.html exists in static export"
    - "npm run build exits 0 with no new warnings"
  artifacts:
    - path: "src/lib/projects.ts"
      provides: "Project type + 4-entry typed projects array + getFeaturedProjects() helper"
      contains: "export type Project"
    - path: "src/components/sections/Projects.tsx"
      provides: "Landing Projects section consuming lib/projects.ts (no local PROJECTS const)"
      pattern: "from \"@/lib/projects\""
    - path: "src/app/du-an/page.tsx"
      provides: "Server-component /du-an list page with Burgundy/Bone palette, page header (back link + H1 + sub-text), and 4 cards with summaries"
      contains: "ArrowLeft"
    - path: "out/du-an/index.html"
      provides: "Static-export proof that /du-an renders all 4 summaries + back link + named clients"
      contains: "Cung ứng khối lượng lớn"
  key_links:
    - from: "src/components/sections/Projects.tsx"
      to: "src/lib/projects.ts"
      via: "import { projects } from '@/lib/projects' (or getFeaturedProjects)"
      pattern: "from \"@/lib/projects\""
    - from: "src/app/du-an/page.tsx"
      to: "src/lib/projects.ts"
      via: "import { projects } from '@/lib/projects'"
      pattern: "from \"@/lib/projects\""
    - from: "src/app/du-an/page.tsx"
      to: "/ (#du-an anchor)"
      via: "next/link Link href=\"/#du-an\""
      pattern: "href=\"/#du-an\""
---

<objective>
Extract the 4-project dataset from `src/components/sections/Projects.tsx` into a single typed module `src/lib/projects.ts` consumed by BOTH the landing Projects section AND a fully-rewritten `/du-an` list route. The new `/du-an` page uses the Burgundy/Bone palette (deletes the legacy blue palette + 6-entry list + emoji icons), reuses the same card visual as landing plus per-card location + summary, declares its own metadata for SEO (PITFALL #11 mitigation — 2nd indexable URL), and adds a back link to `/#du-an` that works on fresh page load (no router.back).

Purpose: Satisfy PROJ-01..03 — typed source-of-truth for project data, polished /du-an list view, page-distinct metadata. Provides Google a 2nd indexable URL (PITFALL #11) and stabilizes the project data shape so Phase 5 (sitemap.ts) and any future `/du-an/[slug]` work has a clean import target.

Output:
- `src/lib/projects.ts` — new typed module (Project type, 4 entries, getFeaturedProjects())
- `src/components/sections/Projects.tsx` — refactored to import from @/lib/projects; visual unchanged
- `src/app/du-an/page.tsx` — fully rewritten server component with Burgundy/Bone palette
- `out/du-an/index.html` — regenerated static export proving trailing slash + content
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/REQUIREMENTS.md
@.planning/phases/04-projects-data-du-an-list/04-CONTEXT.md
@.planning/phases/03-landing-sections/03-CONTEXT.md
@.planning/phases/03-landing-sections/03-02-stats-close-compose-SUMMARY.md
@.planning/research/PITFALLS.md
@src/lib/site.ts
@src/components/sections/Projects.tsx
@src/app/du-an/page.tsx
@src/app/layout.tsx
@next.config.ts
@/Users/congphan/Workspace/my-projects/khang-thing-group/website/CLAUDE.md

<interfaces>
<!-- Key types and contracts the executor needs. No codebase exploration required. -->

From src/lib/site.ts (do NOT modify — reference only):
```typescript
export const siteUrl: string
export const company: { legalName, shortName, tagline, founded, phoneDisplay, phoneE164, phoneRaw, email, zaloUrl, taxId, taxIdDisplay, legalRep, address: { street, locality, region, country, full } }
export const telHref: () => string
export const mailtoHref: () => string
export const zaloHref: () => string
export type Company = typeof company
```

From src/components/sections/Projects.tsx (current — about to be refactored):
```typescript
// Current local type (DELETE after refactor):
type Project = { name, client, year, role, Icon: LucideIcon, blockBg: 'bg-burgundy' | 'bg-espresso' }
// Current local const (DELETE):
const PROJECTS: readonly Project[] = [ ... 4 entries ... ]
// After refactor: import { projects } from '@/lib/projects', map field renames name→title, role→scope, Icon→icon
```

From src/app/layout.tsx (do NOT modify — Nav/Footer/FloatingZalo wrap /du-an automatically):
```typescript
// Root layout sets:
//   - <html lang="vi">
//   - default metadata (title template '%s | Khang Thịnh Investment', description, metadataBase)
// /du-an page metadata MUST override title (not use template) per D-15
```

From next.config.ts (do NOT modify):
```typescript
// output: 'export', trailingSlash: true, images.unoptimized: true
// → /du-an emits out/du-an/index.html (verify in Task 4)
```

NEW interface this plan introduces (Project type — D-02):
```typescript
import type { LucideIcon } from 'lucide-react'

export type Project = {
  slug: string                              // kebab-case stable identifier (D-04)
  title: string                             // public display name (was 'name' in Phase 3)
  client: string                            // named client(s)
  location: string                          // D-05
  year: string                              // '2024' | '2025' (D-07)
  scope: string                             // role description (was 'role' in Phase 3)
  summary: string                           // D-06 — shown on /du-an only
  icon: LucideIcon                          // Lucide React icon (lowercase 'i' — was 'Icon' in Phase 3)
  blockBg: 'bg-burgundy' | 'bg-espresso'    // color block bg
}

export const projects: readonly Project[]
export function getFeaturedProjects(): readonly Project[]  // passthrough, returns all
```
</interfaces>

</context>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Create src/lib/projects.ts (Project type + 4 entries + helper)</name>
  <files>src/lib/projects.ts</files>
  <read_first>
    - src/components/sections/Projects.tsx (current PROJECTS const — copy field values for title/client/year/scope/icon/blockBg)
    - .planning/phases/04-projects-data-du-an-list/04-CONTEXT.md (D-02 type, D-04 slugs, D-05 locations, D-06 summaries, D-07 years, D-08 scope, D-09 helper)
    - src/lib/site.ts (reference only — confirms project's style for lib modules: top file comment + `as const` + typed exports)
  </read_first>
  <behavior>
    - lib/projects.ts MUST export a `Project` type (9 fields, matching D-02 verbatim)
    - lib/projects.ts MUST export a `projects` const array with EXACTLY 4 entries in the order: cao-toc-cai-nuoc-dat-mui, cau-cua-lon-dat-mui, duong-ra-dao-hon-khoai, nha-pho-tieu-bieu (D-04)
    - lib/projects.ts MUST export `getFeaturedProjects()` returning `readonly Project[]` (passthrough — `() => projects`)
    - Each entry contains exact wording from D-06 for `summary` (Cao tốc → "Cung ứng khối lượng lớn..."; Cầu Cửa Lớn → "Cung cấp vật liệu xây dựng..."; Hòn Khoai → "Vận chuyển đường thủy cát, đá..."; Nhà phố → "Thi công xây dựng nhà phố...")
    - Locations per D-05 (Cao tốc + Cầu Cửa Lớn → "Đất Mũi, Cà Mau"; Hòn Khoai → "Đảo Hòn Khoai, Cà Mau"; Nhà phố → "Long An · Thạnh Hóa · Mỹ Yên")
    - blockBg alternation matches Phase 3 verbatim: burgundy, espresso, espresso, burgundy
    - Icon imports: Construction, GitBranch, Anchor, Home (single per-icon imports for tree-shaking)
  </behavior>
  <action>
Write src/lib/projects.ts with this exact structure (English code, English comments per CLAUDE.md; Vietnamese only in user-facing string values):

```typescript
// Single source of truth for project data.
//
// Consumers:
// - src/components/sections/Projects.tsx — landing 4-card showcase (visual locked from Phase 3)
// - src/app/du-an/page.tsx               — /du-an list route (adds location + summary per card)
// - src/app/sitemap.ts                    (Phase 5) — optional URL inclusion if /du-an/[slug] added later
//
// Field map from Phase 3 Projects.tsx → this module:
//   name  → title      role → scope      Icon → icon (lowercase)
// New fields added in Phase 4: slug, location, summary
//
// Per CONTEXT.md D-01..D-09 — do NOT split 'Nhà phố tiêu biểu' into 3 entries.
import { Construction, GitBranch, Anchor, Home } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type Project = {
  slug: string                              // kebab-case URL fragment + stable identifier (D-04)
  title: string                             // public display name (Phase 3 'name')
  client: string                            // named client(s) — front-and-center
  location: string                          // D-05
  year: string                              // '2024' | '2025' (D-07)
  scope: string                             // role description (Phase 3 'role')
  summary: string                           // D-06 — 1–2 sentences; shown on /du-an only
  icon: LucideIcon                          // Lucide React icon
  blockBg: 'bg-burgundy' | 'bg-espresso'    // color block bg
}

export const projects: readonly Project[] = [
  {
    slug: 'cao-toc-cai-nuoc-dat-mui',
    title: 'Cao tốc Cái Nước — Đất Mũi Cà Mau',
    client: 'Bộ Quốc phòng — Binh đoàn 12 — Trường Sơn',
    location: 'Đất Mũi, Cà Mau',
    year: '2024',
    scope: 'Cung ứng VLXD + vận chuyển',
    summary:
      'Cung ứng khối lượng lớn cát, đá, vật liệu san lấp và vận chuyển bằng đường thủy đến công trường cao tốc — dự án trọng điểm thuộc Bộ Quốc phòng — Binh đoàn 12 — Trường Sơn.',
    icon: Construction,
    blockBg: 'bg-burgundy',
  },
  {
    slug: 'cau-cua-lon-dat-mui',
    title: 'Cầu Cửa Lớn — Đất Mũi Cà Mau',
    client: 'Bộ Quốc phòng — Binh đoàn 12 — Trường Sơn',
    location: 'Đất Mũi, Cà Mau',
    year: '2024',
    scope: 'Cung ứng VLXD + vận chuyển',
    summary:
      'Cung cấp vật liệu xây dựng và vận chuyển đường thủy phục vụ thi công cầu Cửa Lớn — Đất Mũi Cà Mau — dự án thuộc Binh đoàn 12 — Trường Sơn.',
    icon: GitBranch,
    blockBg: 'bg-espresso',
  },
  {
    slug: 'duong-ra-dao-hon-khoai',
    title: 'Đường giao thông ra đảo Hòn Khoai',
    client: 'Bộ Quốc phòng — Binh đoàn 12 — Trường Sơn',
    location: 'Đảo Hòn Khoai, Cà Mau',
    year: '2024',
    scope: 'Cung ứng VLXD + vận chuyển',
    summary:
      'Vận chuyển đường thủy cát, đá và vật liệu thi công phục vụ tuyến giao thông ra đảo Hòn Khoai — công trình do Binh đoàn 12 — Trường Sơn triển khai.',
    icon: Anchor,
    blockBg: 'bg-espresso',
  },
  {
    slug: 'nha-pho-tieu-bieu',
    title: 'Nhà phố tiêu biểu',
    client: 'Cô Thúy (Thạnh Hóa) · Anh Bình (Mỹ Yên) · Chị Ngọc (Long An)',
    location: 'Long An · Thạnh Hóa · Mỹ Yên',
    year: '2025',
    scope: 'Thi công xây dựng',
    summary:
      'Thi công xây dựng nhà phố dân dụng tại Long An (Thạnh Hóa, Mỹ Yên) — các công trình tiêu biểu của Cô Thúy, Anh Bình, Chị Ngọc.',
    icon: Home,
    blockBg: 'bg-burgundy',
  },
] as const

// Helper — Phase 4 passthrough (D-09). Future-proofing for when project count > featured-4.
export const getFeaturedProjects = (): readonly Project[] => projects
```

Use `as const` on the array, NOT on individual entries (entries have `LucideIcon` typed fields so they can't be deeply const).
  </action>
  <verify>
    <automated>
bash <<'EOF'
set -e
F="src/lib/projects.ts"
echo "--- File exists ---" && test -f "$F"
echo "--- Project type exported ---" && grep -q 'export type Project' "$F"
echo "--- 9 required fields ---"
for field in 'slug:' 'title:' 'client:' 'location:' 'year:' 'scope:' 'summary:' 'icon:' 'blockBg:'; do
  grep -q "$field" "$F" || { echo "MISSING field: $field"; exit 1; }
done
echo "--- All 4 slugs ---"
for slug in 'cao-toc-cai-nuoc-dat-mui' 'cau-cua-lon-dat-mui' 'duong-ra-dao-hon-khoai' 'nha-pho-tieu-bieu'; do
  grep -q "$slug" "$F" || { echo "MISSING slug: $slug"; exit 1; }
done
echo "--- Exact D-06 summary fragments ---"
grep -q 'Cung ứng khối lượng lớn cát, đá' "$F"
grep -q 'Cung cấp vật liệu xây dựng và vận chuyển đường thủy phục vụ thi công cầu Cửa Lớn' "$F"
grep -q 'Vận chuyển đường thủy cát, đá và vật liệu thi công phục vụ tuyến giao thông ra đảo Hòn Khoai' "$F"
grep -q 'Thi công xây dựng nhà phố dân dụng tại Long An' "$F"
echo "--- All 4 locations (D-05) ---"
grep -q "'Đất Mũi, Cà Mau'" "$F"
grep -q "'Đảo Hòn Khoai, Cà Mau'" "$F"
grep -q "'Long An · Thạnh Hóa · Mỹ Yên'" "$F"
echo "--- projects const exported ---" && grep -q 'export const projects: readonly Project\[\]' "$F"
echo "--- getFeaturedProjects exported ---" && grep -q 'export const getFeaturedProjects' "$F"
echo "--- 4 lucide icons imported ---" && grep -q "from 'lucide-react'" "$F" && grep -qE 'Construction.*GitBranch.*Anchor.*Home' "$F"
echo "--- Type check ---" && npx tsc --noEmit
echo "PASS"
EOF
    </automated>
  </verify>
  <done>
    - src/lib/projects.ts exists with `export type Project` (9 fields per D-02), `export const projects` (4 entries with all D-04 slugs / D-05 locations / D-06 summaries / D-07 years / D-08 scope), and `export const getFeaturedProjects` (passthrough).
    - `npx tsc --noEmit` exits 0 (no type errors).
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Refactor src/components/sections/Projects.tsx to consume @/lib/projects (D-10..D-12)</name>
  <files>src/components/sections/Projects.tsx</files>
  <read_first>
    - src/components/sections/Projects.tsx (current state with local type + PROJECTS const)
    - src/lib/projects.ts (Task 1 output — types + data + helper)
    - .planning/phases/04-projects-data-du-an-list/04-CONTEXT.md (D-10..D-13 — keep visual unchanged, rename field references, summary NOT shown on landing)
  </read_first>
  <behavior>
    - Local `type Project` and `const PROJECTS` MUST be removed from Projects.tsx
    - Replaced with `import { projects } from '@/lib/projects'` (top-level import alongside lucide imports)
    - Render loop iterates `projects` (or `getFeaturedProjects()` — either is fine; prefer `projects` for simplicity)
    - Field references updated: `p.name` → `p.title`, `p.role` → `p.scope`, `p.Icon` → `p.icon`, `key={p.name}` → `key={p.slug}`
    - JSX renders the icon as `<p.icon ... />` (lowercase tag works in JSX when the variable is capitalized — but `p.icon` is lowercase, so use `const Icon = p.icon` pattern OR rename via destructuring inside the map)
    - `summary` is NOT rendered on landing card (kept compact per D-11)
    - All other classes/markup unchanged (color block 200px, card body, etc.)
    - Local Lucide imports of `Construction, GitBranch, Anchor, Home` MUST be removed (now imported by lib/projects.ts). `ArrowRight` import stays (used by the "Xem tất cả" CTA).
  </behavior>
  <action>
Rewrite src/components/sections/Projects.tsx to this content (preserving Phase 3 visual exactly — only data source changes):

```typescript
// SEC-04 Projects — 4 representative projects + "Xem tất cả" link.
// Server component. Data source: @/lib/projects (Phase 4 D-10).
// Visual unchanged from Phase 3 — only the data import path changed.
// `summary` field is NOT rendered here (kept compact per D-11) — used on /du-an only.
import { ArrowRight } from 'lucide-react'
import { projects } from '@/lib/projects'

export default function Projects() {
  return (
    <section
      id="du-an"
      aria-label="Dự án tiêu biểu"
      className="bg-bone py-20 md:py-24"
    >
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="font-black uppercase tracking-wide text-3xl md:text-4xl text-burgundy text-center md:text-left">
          Dự án tiêu biểu
        </h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p) => {
            const Icon = p.icon
            return (
              <article key={p.slug} className="border border-taupe bg-bone-dark">
                <div className={`${p.blockBg} h-[200px] flex items-center justify-center`}>
                  <Icon className="w-20 h-20 text-bone" aria-hidden="true" />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl md:text-2xl text-espresso leading-tight">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-taupe">{p.client}</p>
                  <p className="mt-4 text-xs uppercase tracking-widest text-espresso">
                    {p.year} · {p.scope}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
        <div className="mt-10 flex justify-center">
          <a
            href="/du-an"
            className="inline-flex items-center gap-2 min-h-[44px] border-2 border-burgundy text-burgundy px-6 py-3 rounded-sm text-sm font-bold uppercase tracking-wide hover:bg-burgundy hover:text-bone transition-colors"
          >
            <span>Xem tất cả dự án</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
```

Notes:
- The `const Icon = p.icon` pattern inside the map is required because JSX requires capitalized identifiers for custom component tags; `<p.icon />` works in TS/JSX but `const Icon = p.icon; <Icon />` is the canonical pattern and matches Phase 3 readability.
- The `<section id="du-an">` anchor stays (this is the target of `/#du-an` back link from /du-an page).
  </action>
  <verify>
    <automated>
bash <<'EOF'
set -e
F="src/components/sections/Projects.tsx"
echo "--- File exists ---" && test -f "$F"
echo "--- Imports from @/lib/projects ---" && grep -q "from '@/lib/projects'" "$F"
echo "--- Local PROJECTS const removed ---" && ! grep -q 'const PROJECTS' "$F"
echo "--- Local Project type removed ---" && ! grep -qE '^type Project = \{' "$F"
echo "--- LucideIcon import removed ---" && ! grep -q "import type { LucideIcon }" "$F"
echo "--- Construction/GitBranch/Anchor/Home not imported here anymore ---"
! grep -qE "import .*\b(Construction|GitBranch|Anchor|Home)\b.* from 'lucide-react'" "$F"
echo "--- ArrowRight still imported ---" && grep -q "import { ArrowRight }" "$F"
echo "--- Renders title/client/year/scope ---"
grep -q '{p.title}' "$F"
grep -q '{p.client}' "$F"
grep -q '{p.year}' "$F"
grep -q '{p.scope}' "$F"
echo "--- summary NOT rendered on landing (D-11) ---"
! grep -q '{p.summary}' "$F"
echo "--- key={p.slug} ---" && grep -q 'key={p.slug}' "$F"
echo "--- Anchor id=\"du-an\" preserved ---" && grep -q 'id="du-an"' "$F"
echo "--- Xem tất cả CTA preserved ---" && grep -q 'Xem tất cả dự án' "$F"
echo "--- No 'use client' added ---" && ! grep -q "'use client'" "$F"
echo "--- Type check ---" && npx tsc --noEmit
echo "PASS"
EOF
    </automated>
  </verify>
  <done>
    - Local `PROJECTS` const + `type Project` removed from Projects.tsx.
    - File imports `projects` from `@/lib/projects` and renders via `projects.map(...)` with field renames (title/client/scope/icon/slug).
    - Landing card visual identical to Phase 3 (no summary rendered, 200px color block + icon + title + client + year·scope).
    - `npx tsc --noEmit` exits 0.
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 3: Rewrite src/app/du-an/page.tsx (Burgundy/Bone palette, server component, metadata, back link, 4 cards with summaries)</name>
  <files>src/app/du-an/page.tsx</files>
  <read_first>
    - src/app/du-an/page.tsx (current legacy file — blue palette + 6 entries + emoji icons; will be fully overwritten)
    - src/lib/projects.ts (Task 1 output — projects array)
    - src/components/sections/Projects.tsx (Task 2 output — card visual to mirror)
    - src/app/layout.tsx (read only — confirms Nav/Footer wrap automatically; do NOT modify)
    - .planning/phases/04-projects-data-du-an-list/04-CONTEXT.md (D-14..D-25 — full rewrite spec)
    - .planning/research/PITFALLS.md (#11 anchor-only SEO mitigation — /du-an is 2nd indexable URL; ensure rich H1/h2 structure)
  </read_first>
  <behavior>
    - File MUST be a server component (NO `'use client'` directive)
    - Imports: `Metadata` type from 'next', `Link` from 'next/link', `ArrowLeft` from 'lucide-react', `projects` from '@/lib/projects'
    - `export const metadata: Metadata = { title: 'Dự án tiêu biểu | Khang Thịnh Investment', description: '...' (D-15 exact wording), alternates: { canonical: '/du-an' } }` — title uses absolute string (NOT root layout template) so Google sees the exact title
    - Page structure: `<main>` → page header (back link + H1 + sub-text) → grid (2×2 desktop, 1-col mobile) → 4 `<article>` cards
    - Back link: `<Link href="/#du-an">` with `<ArrowLeft className="w-4 h-4" />` + "Về trang chủ" text, `text-burgundy hover:underline`, `min-h-[44px]` for tap target (D-29), placed ABOVE H1
    - H1: "Dự án tiêu biểu" — `font-black uppercase tracking-wide text-4xl md:text-5xl text-burgundy`
    - Sub-text: "Những công trình Khang Thịnh đã thực hiện — đối tác Bộ Quốc phòng, Binh đoàn 12, Trường Sơn." `text-espresso`
    - Container: `max-w-6xl mx-auto px-4 py-20 md:py-24`
    - Cards: same structure as landing (color block 200px + icon centered + card body) BUT body adds `location` row and `summary` text. Order: title (h2) → client → location → year · scope → summary
    - Card uses `<article aria-label="Dự án {title} – {client}">` for semantic + screen-reader context (D-32 from CONTEXT Claude's Discretion #4)
    - NO `'use client'`, NO `router.back()`, NO `useState`, NO Hero block, NO breadcrumb, NO filter (D-20, D-22)
    - Background: `bg-bone` page; cards `bg-bone-dark border-taupe` (same as landing) per CONTEXT bg suggestion
    - DELETE all legacy content: blue palette `#1a5276`/`#2e86c1`/`#f39c12`, `typeColors` lookup, emoji icons (📍 👷 🏢), the `pt-16` wrapper, the legacy 6-entry `projects` array
  </behavior>
  <action>
Overwrite src/app/du-an/page.tsx in full with this exact content:

```typescript
// PROJ-02 + PROJ-03 — /du-an list route.
// Server component (static export safe). Consumes typed data from @/lib/projects.
// Metadata distinct from root layout (PITFALL #11 — 2nd indexable URL).
// Back link uses static href '/#du-an' (NOT router.back) so it works after fresh page load (SC4).
// Burgundy/Bone palette — legacy blue palette (#1a5276) + emoji icons fully removed in this rewrite.
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { projects } from '@/lib/projects'

export const metadata: Metadata = {
  title: 'Dự án tiêu biểu | Khang Thịnh Investment',
  description:
    '4 dự án tiêu biểu Khang Thịnh đã thực hiện: cao tốc Cái Nước — Đất Mũi Cà Mau, cầu Cửa Lớn, đường ra đảo Hòn Khoai (đối tác Bộ Quốc phòng — Binh đoàn 12 — Trường Sơn), nhà phố tiêu biểu Long An.',
  alternates: { canonical: '/du-an' },
}

export default function DuAnPage() {
  return (
    <main className="bg-bone min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-20 md:py-24">
        {/* Page header: back link → H1 → sub-text (D-16) */}
        <Link
          href="/#du-an"
          className="inline-flex items-center gap-2 min-h-[44px] text-burgundy hover:underline text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Về trang chủ</span>
        </Link>

        <h1 className="mt-6 font-black uppercase tracking-wide text-4xl md:text-5xl text-burgundy">
          Dự án tiêu biểu
        </h1>
        <p className="mt-4 text-base md:text-lg text-espresso max-w-3xl">
          Những công trình Khang Thịnh đã thực hiện — đối tác Bộ Quốc phòng, Binh đoàn 12, Trường Sơn.
        </p>

        {/* 2×2 desktop / 1-col mobile grid (D-17) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p) => {
            const Icon = p.icon
            return (
              <article
                key={p.slug}
                aria-label={`Dự án ${p.title} – ${p.client}`}
                className="border border-taupe bg-bone-dark"
              >
                <div
                  className={`${p.blockBg} h-[200px] flex items-center justify-center`}
                >
                  <Icon className="w-20 h-20 text-bone" aria-hidden="true" />
                </div>
                <div className="p-6">
                  <h2 className="font-bold text-xl md:text-2xl text-espresso leading-tight">
                    {p.title}
                  </h2>
                  <p className="mt-2 text-sm text-taupe">{p.client}</p>
                  <p className="mt-1 text-sm text-espresso">{p.location}</p>
                  <p className="mt-3 text-xs uppercase tracking-widest text-espresso">
                    {p.year} · {p.scope}
                  </p>
                  <p className="mt-4 text-sm md:text-base text-espresso leading-relaxed">
                    {p.summary}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </main>
  )
}
```

Key notes for executor:
- `<h1>` once per page (correct semantic — root layout has no h1). Card titles use `<h2>` (proper outline order).
- `<Link href="/#du-an">` — Next/Link is used so client-side navigation back to landing is smooth, but the hash anchor still works on direct visits (the browser handles the scroll-to-anchor natively on full page load).
- `aria-label` on `<article>` gives screen readers full context per CONTEXT open Q4.
- DO NOT add Nav/Footer/FloatingZalo imports — root layout wraps them automatically.
- DO NOT add a 2nd back link at the bottom (D-23).
  </action>
  <verify>
    <automated>
bash <<'EOF'
set -e
F="src/app/du-an/page.tsx"
echo "--- File exists ---" && test -f "$F"
echo "--- Server component (no 'use client') ---" && ! grep -q "'use client'" "$F"
echo "--- Exact metadata title ---" && grep -q "title: 'Dự án tiêu biểu | Khang Thịnh Investment'" "$F"
echo "--- Canonical '/du-an' ---" && grep -q "canonical: '/du-an'" "$F"
echo "--- D-15 description fragment ---" && grep -q '4 dự án tiêu biểu Khang Thịnh đã thực hiện' "$F"
echo "--- Back link href=\"/#du-an\" ---" && grep -q 'href="/#du-an"' "$F"
echo "--- 'Về trang chủ' text ---" && grep -q 'Về trang chủ' "$F"
echo "--- ArrowLeft imported + used ---" && grep -q "import { ArrowLeft }" "$F" && grep -q '<ArrowLeft' "$F"
echo "--- next/link imported ---" && grep -q "import Link from 'next/link'" "$F"
echo "--- Metadata type imported ---" && grep -q "import type { Metadata } from 'next'" "$F"
echo "--- projects imported from lib ---" && grep -q "from '@/lib/projects'" "$F"
echo "--- H1 'Dự án tiêu biểu' ---" && grep -q '<h1' "$F" && grep -q 'Dự án tiêu biểu' "$F"
echo "--- Sub-text fragment ---" && grep -q 'Những công trình Khang Thịnh đã thực hiện' "$F"
echo "--- Renders title/client/location/scope/summary ---"
grep -q '{p.title}' "$F"
grep -q '{p.client}' "$F"
grep -q '{p.location}' "$F"
grep -q '{p.scope}' "$F"
grep -q '{p.summary}' "$F"
echo "--- 2x2 grid ---" && grep -q 'grid-cols-1 md:grid-cols-2' "$F"
echo "--- max-w-6xl py-20 ---" && grep -q 'max-w-6xl' "$F" && grep -q 'py-20 md:py-24' "$F"
echo "--- Card aria-label pattern ---" && grep -q 'aria-label={`Dự án' "$F"
echo "--- Legacy palette REMOVED ---"
! grep -q '#1a5276' "$F"
! grep -q '#2e86c1' "$F"
! grep -q '#f39c12' "$F"
! grep -q '#1c2833' "$F"
echo "--- Emoji icons REMOVED ---"
! grep -q '📍' "$F"
! grep -q '👷' "$F"
! grep -q '🏢' "$F"
echo "--- typeColors lookup REMOVED ---" && ! grep -q 'typeColors' "$F"
echo "--- Legacy 6-entry array REMOVED (no 'Nhà Chị Ngọc' string standalone — legacy entry name) ---"
! grep -q '"Nhà Chị Ngọc"' "$F"
! grep -q "id: 1" "$F"
echo "--- No router.back ---" && ! grep -q 'router.back' "$F"
echo "--- No useState / no client hooks ---"
! grep -q 'useState'
! grep -q 'use client'
echo "--- Type check ---" && npx tsc --noEmit
echo "PASS"
EOF
    </automated>
  </verify>
  <done>
    - src/app/du-an/page.tsx fully rewritten as server component with Burgundy/Bone palette.
    - Page metadata: exact D-15 title + description + `canonical: '/du-an'`.
    - Back link `<Link href="/#du-an">` with `ArrowLeft` icon and "Về trang chủ" text, ≥44px tap target.
    - 4 `<article>` cards rendering title (h2), client, location, year · scope, summary — all fields from lib/projects.ts.
    - No `'use client'`, no legacy blue palette, no emoji icons, no `router.back`, no `typeColors`, no 6-entry legacy array.
    - `npx tsc --noEmit` exits 0.
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 4: Build verification — npm run build + grep out/ for both routes</name>
  <files></files>
  <read_first>
    - next.config.ts (confirms trailingSlash: true → /du-an emits out/du-an/index.html)
    - .planning/research/PITFALLS.md (#2 trailing slash, #11 anchor-only SEO — /du-an must exist as standalone HTML file)
  </read_first>
  <behavior>
    - `npm run build` exits 0 with no errors and no new warnings
    - out/index.html exists (landing) and still contains all 4 project titles + clients (proving Task 2 refactor preserved landing visual)
    - out/du-an/index.html exists (proves trailingSlash: true is respected — PITFALL #2)
    - out/du-an/index.html contains: all 4 D-06 summary fragments, all 4 D-05 locations, "Về trang chủ" back link text, exact metadata title "Dự án tiêu biểu | Khang Thịnh Investment", H1 "Dự án tiêu biểu", sub-text fragment, href="/#du-an"
    - out/du-an/index.html does NOT contain legacy palette `#1a5276`, NOT contain emoji icons, NOT contain Phase 1 sentinel
    - Nav + Footer + FloatingZalo render on /du-an (proven by checking for company.phoneE164 +84921985599 in out/du-an/index.html — comes from Footer)
  </behavior>
  <action>
Run build + verify outputs. This task does NOT modify source files — only validates the previous 3 tasks holistically via static export inspection.

```bash
npm run build
```

Then grep the static export for required strings. Use the verify block below.
  </action>
  <verify>
    <automated>
bash <<'EOF'
set -e
echo "--- npm run build (clean) ---"
rm -rf out .next
npm run build
echo "--- out/index.html landing still has 4 projects (Task 2 refactor sanity) ---"
test -f out/index.html
grep -q 'Cao tốc Cái Nước' out/index.html
grep -q 'Cầu Cửa Lớn' out/index.html
grep -q 'Hòn Khoai' out/index.html
grep -q 'Nhà phố tiêu biểu' out/index.html
grep -q 'Bộ Quốc phòng' out/index.html
echo "--- out/du-an/index.html exists (PITFALL #2 trailing slash) ---"
test -f out/du-an/index.html
echo "--- /du-an page header ---"
grep -q 'Về trang chủ' out/du-an/index.html
grep -q 'Dự án tiêu biểu' out/du-an/index.html
grep -q 'Những công trình Khang Thịnh đã thực hiện' out/du-an/index.html
echo "--- /du-an metadata distinct from root (PROJ-03) ---"
grep -q 'Dự án tiêu biểu | Khang Thịnh Investment' out/du-an/index.html
grep -q '4 dự án tiêu biểu Khang Thịnh đã thực hiện' out/du-an/index.html
echo "--- /du-an all 4 D-06 summaries present ---"
grep -q 'Cung ứng khối lượng lớn cát, đá' out/du-an/index.html
grep -q 'Cung cấp vật liệu xây dựng và vận chuyển đường thủy phục vụ thi công cầu Cửa Lớn' out/du-an/index.html
grep -q 'Vận chuyển đường thủy cát, đá và vật liệu thi công phục vụ tuyến giao thông ra đảo Hòn Khoai' out/du-an/index.html
grep -q 'Thi công xây dựng nhà phố dân dụng tại Long An' out/du-an/index.html
echo "--- /du-an all 4 D-05 locations present ---"
grep -q 'Đất Mũi, Cà Mau' out/du-an/index.html
grep -q 'Đảo Hòn Khoai, Cà Mau' out/du-an/index.html
grep -q 'Long An · Thạnh Hóa · Mỹ Yên' out/du-an/index.html
echo "--- /du-an back link target ---"
grep -q 'href="/#du-an"' out/du-an/index.html
echo "--- /du-an inherits shell (Nav/Footer/FloatingZalo from root layout) ---"
grep -q '+84921985599' out/du-an/index.html  # From Footer (telHref helper)
grep -q 'zalo.me/0921985599' out/du-an/index.html  # From FloatingZalo
echo "--- Legacy artifacts absent ---"
! grep -q '#1a5276' out/du-an/index.html
! grep -q '📍' out/du-an/index.html
! grep -q '👷' out/du-an/index.html
! grep -q '🏢' out/du-an/index.html
! grep -q 'typeColors' out/du-an/index.html
! grep -q 'Phase 1 sentinel' out/du-an/index.html
echo "--- canonical link present ---"
grep -qE 'rel="canonical"[^>]*href="[^"]*\/du-an"' out/du-an/index.html
echo "PASS — all build verifications green"
EOF
    </automated>
  </verify>
  <done>
    - `npm run build` exits 0.
    - out/index.html still renders all 4 projects (landing refactor preserved visual).
    - out/du-an/index.html exists (PITFALL #2 satisfied), contains all 4 summaries + locations + "Về trang chủ" + href="/#du-an" + canonical link + exact metadata title + Nav/Footer strings (tel:+84921985599, zalo.me/0921985599).
    - No legacy artifacts remain anywhere in the static export.
  </done>
</task>

</tasks>

<verification>
After all 4 tasks complete:

1. **TypeScript clean**: `npx tsc --noEmit` exits 0
2. **Build clean**: `npm run build` exits 0; static export at out/ regenerates with both routes
3. **No regressions on landing**: out/index.html still contains all 4 project titles, all 4 clients, and the "Xem tất cả dự án" CTA link to /du-an
4. **PROJ-01 satisfied**: src/lib/projects.ts exports typed Project[] with 9 fields covering 4 projects; both Projects.tsx and /du-an page import from it
5. **PROJ-02 satisfied**: /du-an renders all 4 with named clients + Cà Mau/Long An locations + scope visible + summary text (5–6 visible lines per card)
6. **PROJ-03 satisfied**: /du-an metadata (title 'Dự án tiêu biểu | Khang Thịnh Investment', distinct description, canonical '/du-an') different from root layout default
7. **SC4 satisfied**: Back link is a static `<Link href="/#du-an">` — works on direct visit/refresh (no router.back dependency)
8. **PITFALL #2 satisfied**: out/du-an/index.html exists (trailingSlash: true respected)
9. **PITFALL #11 mitigated**: /du-an provides a 2nd indexable URL with its own H1 "Dự án tiêu biểu", h2 per card, and distinct metadata
</verification>

<success_criteria>
- src/lib/projects.ts exists, exports `Project` type + `projects` array (4 entries, exact D-04 slugs / D-05 locations / D-06 summaries / D-07 years) + `getFeaturedProjects()` helper
- src/components/sections/Projects.tsx imports from @/lib/projects (no local PROJECTS const, no local Project type); landing visual unchanged from Phase 3
- src/app/du-an/page.tsx is a server component (no 'use client') with Burgundy/Bone palette; renders header (back link + H1 + sub-text) + 2×2 card grid with title/client/location/year·scope/summary per card
- src/app/du-an/page.tsx declares own metadata: title 'Dự án tiêu biểu | Khang Thịnh Investment', description (D-15 exact), alternates.canonical '/du-an'
- Back link: `<Link href="/#du-an">` with ArrowLeft + "Về trang chủ" + min-h-[44px]
- npm run build exits 0; out/index.html (landing) AND out/du-an/index.html both present and contain all required content
- No legacy artifacts (blue palette, emoji icons, typeColors, 6-entry legacy array) remain in /du-an
</success_criteria>

<output>
After completion, create `.planning/phases/04-projects-data-du-an-list/04-01-projects-data-list-SUMMARY.md` capturing:
- Files created/modified (src/lib/projects.ts, src/components/sections/Projects.tsx, src/app/du-an/page.tsx)
- Task commits (4 commits — one per task; Task 4 commit may be optional verify-only, but documenting the build green is helpful)
- Decisions made within Claude's Discretion (e.g. exact text size on /du-an sub-text, aria-label final wording, whether getFeaturedProjects() is exported but unused — recommend export+unused for future-proofing)
- Build verification table (out/index.html + out/du-an/index.html greps)
- Note any deviations from the plan, e.g. if the executor chose `getFeaturedProjects()` over `projects` in Projects.tsx
- Confirm requirements completed: PROJ-01, PROJ-02, PROJ-03
- Phase 5 readiness note (sitemap.ts can now import from @/lib/projects if needed)
</output>
