---
phase: 5
plan_number: 1
plan_slug: seo-infrastructure
type: execute
wave: 1
depends_on: []
files_modified:
  - src/app/sitemap.ts
  - src/app/robots.ts
requirements: [SEO-01, SEO-02]
goal: "Sitemap.xml + robots.txt generated at build with correct URLs from siteUrl env."
autonomous: true
estimated_tasks: 3
must_haves:
  truths:
    - "Running `npm run build` emits a valid out/sitemap.xml containing exactly 2 absolute URLs sourced from siteUrl (https://khangthinhinv.vn for default env)"
    - "Running `npm run build` emits a valid out/robots.txt with `User-agent: *`, `Allow: /`, and a `Sitemap: <siteUrl>/sitemap.xml` line"
    - "Both routes (/ and /du-an) appear in the sitemap with `monthly` changeFrequency and priorities 1.0 and 0.8 respectively"
    - "Build stdout contains ZERO metadataBase warnings (Phase 1 wiring not regressed)"
    - "TypeScript strict mode passes (`npx tsc --noEmit` exit 0) after the two new files are added"
    - "No file outside `src/app/sitemap.ts` and `src/app/robots.ts` is touched by this plan"
  artifacts:
    - path: "src/app/sitemap.ts"
      provides: "Default-exported function returning `MetadataRoute.Sitemap` with 2 entries (/, /du-an) built from siteUrl"
      contains: "MetadataRoute.Sitemap"
    - path: "src/app/robots.ts"
      provides: "Default-exported function returning `MetadataRoute.Robots` with single rule + sitemap field + host field"
      contains: "MetadataRoute.Robots"
    - path: "out/sitemap.xml"
      provides: "Static-export proof — XML sitemap with 2 absolute URLs"
      contains: "<urlset"
    - path: "out/robots.txt"
      provides: "Static-export proof — robots.txt referencing the sitemap"
      contains: "Sitemap:"
  key_links:
    - from: "src/app/sitemap.ts"
      to: "src/lib/site.ts"
      via: "import { siteUrl } from '@/lib/site' — never hardcode URL (Pitfall #10)"
      pattern: "from '@/lib/site'"
    - from: "src/app/robots.ts"
      to: "src/lib/site.ts"
      via: "import { siteUrl } from '@/lib/site' — never hardcode URL (Pitfall #10)"
      pattern: "from '@/lib/site'"
    - from: "src/app/robots.ts"
      to: "src/app/sitemap.ts"
      via: "robots.txt `Sitemap:` field references `${siteUrl}/sitemap.xml` emitted by sitemap.ts"
      pattern: "sitemap:"
---

<objective>
Emit `out/sitemap.xml` and `out/robots.txt` at build time using Next 15's `app/sitemap.ts` + `app/robots.ts` file conventions. Two routes only (`/`, `/du-an`). Both URLs derived from `siteUrl` exported by `@/lib/site` — Pitfall #10 (sitemap/OG under wrong domain) directly mitigated. Nothing else in the codebase is touched.

Purpose: Satisfy SEO-01 (sitemap.ts) + SEO-02 (robots.ts) — the foundational discovery surfaces. Once present, Google/Bing/Zalo crawlers can enumerate the site at all (without these the only entry points are direct URL paste + organic links). This plan is Wave 1 — zero dependencies on any other plan in Phase 5.

Output:
- `src/app/sitemap.ts` — new file, 2 entries built from siteUrl, `changeFrequency: 'monthly'`, priorities 1.0 (landing) and 0.8 (/du-an)
- `src/app/robots.ts` — new file, single allow-all rule + sitemap field + host field
- Build verification proving `out/sitemap.xml` + `out/robots.txt` exist with correct content
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/REQUIREMENTS.md
@.planning/phases/05-seo-schema-polish/05-CONTEXT.md
@.planning/phases/05-seo-schema-polish/05-RESEARCH.md
@.planning/research/PITFALLS.md
@src/lib/site.ts
@src/app/layout.tsx
@next.config.ts
@package.json
@/Users/congphan/Workspace/my-projects/khang-thing-group/website/CLAUDE.md

<interfaces>
<!-- Key types and contracts the executor needs. No codebase exploration required. -->

From src/lib/site.ts (do NOT modify — reference only):
```typescript
export const siteUrl: string  // = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://khangthinhinv.vn'
// No trailing slash on siteUrl — append paths as `${siteUrl}/du-an` etc.
```

From next/dist/lib/metadata/types/metadata-interface (Next 15 — already in node_modules):
```typescript
import type { MetadataRoute } from 'next'

// MetadataRoute.Sitemap = Array<{
//   url: string
//   lastModified?: string | Date
//   changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
//   priority?: number  // 0.0 - 1.0
//   alternates?: { languages?: Record<string, string> }
// }>

// MetadataRoute.Robots = {
//   rules: { userAgent: string | string[]; allow?: string | string[]; disallow?: string | string[]; crawlDelay?: number }
//        | Array<{ userAgent: string | string[]; allow?: string | string[]; disallow?: string | string[]; crawlDelay?: number }>
//   sitemap?: string | string[]
//   host?: string
// }
```

From next.config.ts (do NOT modify — Phase 1 lock):
```typescript
// output: 'export'   → app/sitemap.ts + app/robots.ts must be statically optimized
// trailingSlash: true → does NOT affect sitemap URLs (we write `/du-an` without trailing slash per D-25)
// images.unoptimized: true
```

NO new interface introduced by this plan (both files are leaf modules, consumed only by the Next.js build).
</interfaces>

</context>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Create src/app/sitemap.ts (2 entries, siteUrl-derived, MetadataRoute.Sitemap)</name>
  <files>src/app/sitemap.ts</files>
  <read_first>
    - src/lib/site.ts (siteUrl export — single source of truth)
    - .planning/phases/05-seo-schema-polish/05-CONTEXT.md (D-24, D-25, D-26 — exact entry shape, lastModified strategy)
    - .planning/phases/05-seo-schema-polish/05-RESEARCH.md (Topic 1/2 — Next 15 sitemap.ts statically optimized under output: 'export')
    - .planning/research/PITFALLS.md (#10 — every URL must come from siteUrl, never hardcode)
  </read_first>
  <behavior>
    - File MUST be `src/app/sitemap.ts` (NOT .tsx, NOT under any sub-route — must live at app/ root for Next to pick up)
    - File MUST export a default function returning `MetadataRoute.Sitemap` (NOT a named export, NOT async unless needed)
    - Import path: `import { siteUrl } from '@/lib/site'` — do NOT hardcode `https://khangthinhinv.vn` (Pitfall #10)
    - Import type: `import type { MetadataRoute } from 'next'`
    - Two entries — ORDER MATTERS for human-readable XML:
      1. `{ url: siteUrl, lastModified: new Date(), changeFrequency: 'monthly', priority: 1.0 }` — landing
      2. `{ url: `${siteUrl}/du-an`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 }` — projects list
    - `lastModified: new Date()` — build-time timestamp per D-26 (NO file-mtime introspection)
    - `changeFrequency` value MUST be the literal `'monthly'` (TypeScript union — `'weekly' | 'monthly' | …`)
    - `priority` values are numbers (1.0 and 0.8), NOT strings
    - Top-of-file comment block per project style (matches src/lib/site.ts + src/components/sections/Projects.tsx): explain purpose, link consumers, cite D-numbers
    - NO `export const dynamic = 'force-static'` needed — Next 15 statically optimizes by default under output: 'export'
    - NO `revalidate` (project has no runtime — static export only)
  </behavior>
  <action>
Write `src/app/sitemap.ts` with this exact content (English comments per CLAUDE.md):

```typescript
// SEO-01 — XML sitemap emitted at build time.
//
// Next 15 file convention: `app/sitemap.ts` exporting default function returning
// MetadataRoute.Sitemap is statically optimized under `output: 'export'` and emits
// `out/sitemap.xml`. No runtime/server involvement.
//
// Pitfall #10 mitigation: every URL is built from `siteUrl` (env-driven via
// NEXT_PUBLIC_SITE_URL → src/lib/site.ts). NEVER hardcode the domain here.
//
// Per CONTEXT D-24..D-27:
//   - 2 entries only (/, /du-an) — matches roadmap route table
//   - lastModified: new Date() (build-time timestamp — D-26)
//   - changeFrequency: 'monthly' — low-velocity B2B marketing site
//   - priority: 1.0 (landing) / 0.8 (/du-an) — landing is canonical business page
import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/du-an`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]
}
```

Notes:
- The single `now` constant ensures both entries share the exact same build-time stamp (cosmetic — not behavioral).
- Do NOT add a third entry for /404 — 404 is NOT a discoverable route per SEO best practice.
- Do NOT add `alternates.languages` — site is single-locale (vi only).
  </action>
  <verify>
    <automated>
bash <<'EOF'
set -e
F="src/app/sitemap.ts"
echo "--- File exists ---" && test -f "$F"
echo "--- Default export of sitemap function ---" && grep -q 'export default function sitemap' "$F"
echo "--- Returns MetadataRoute.Sitemap ---" && grep -q 'MetadataRoute.Sitemap' "$F"
echo "--- Imports MetadataRoute type from next ---" && grep -q "import type { MetadataRoute } from 'next'" "$F"
echo "--- Imports siteUrl from @/lib/site ---" && grep -q "import { siteUrl } from '@/lib/site'" "$F"
echo "--- No hardcoded domain (Pitfall #10) ---" && ! grep -E "https?://khangthinhinv\.vn" "$F"
echo "--- Landing entry: url: siteUrl ---" && grep -q 'url: siteUrl' "$F"
echo "--- /du-an entry: url: \`\${siteUrl}/du-an\` ---" && grep -q 'url: `${siteUrl}/du-an`' "$F"
echo "--- changeFrequency: 'monthly' (both entries) ---" && [ "$(grep -c "changeFrequency: 'monthly'" "$F")" -eq 2 ]
echo "--- priority: 1.0 present ---" && grep -q 'priority: 1.0' "$F"
echo "--- priority: 0.8 present ---" && grep -q 'priority: 0.8' "$F"
echo "--- lastModified uses new Date() ---" && grep -q 'new Date()' "$F"
echo "--- No revalidate / no dynamic ---" && ! grep -q 'revalidate' "$F" && ! grep -q "export const dynamic" "$F"
echo "--- Type check ---" && npx tsc --noEmit
echo "PASS"
EOF
    </automated>
  </verify>
  <done>
    - `src/app/sitemap.ts` exists, default-exports a function returning `MetadataRoute.Sitemap` with exactly 2 entries.
    - Both URLs derived from `siteUrl` import (no hardcoded domain).
    - changeFrequency `'monthly'` x2, priorities 1.0 and 0.8, `lastModified: new Date()`.
    - `npx tsc --noEmit` exits 0.
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Create src/app/robots.ts (single allow-all rule + sitemap field + host)</name>
  <files>src/app/robots.ts</files>
  <read_first>
    - src/lib/site.ts (siteUrl export)
    - .planning/phases/05-seo-schema-polish/05-CONTEXT.md (D-28, D-29, D-30 — exact MetadataRoute.Robots shape)
    - .planning/phases/05-seo-schema-polish/05-RESEARCH.md (Topic 2 — robots.ts statically optimized; Sitemap field format)
    - src/app/sitemap.ts (Task 1 output — confirms sitemap URL pattern this file references)
  </read_first>
  <behavior>
    - File MUST be `src/app/robots.ts` (sibling of sitemap.ts at app/ root)
    - Default export of a function returning `MetadataRoute.Robots` (NOT async)
    - Import: `import type { MetadataRoute } from 'next'`, `import { siteUrl } from '@/lib/site'`
    - Return shape per D-29 (CONTEXT.md):
      ```ts
      {
        rules: { userAgent: '*', allow: '/' },
        sitemap: `${siteUrl}/sitemap.xml`,
        host: siteUrl,
      }
      ```
    - `rules` is a SINGLE object (NOT an array) — only one user-agent group needed; Next 15 accepts either single object or array, single is simpler/cleaner
    - `sitemap` value is a single string (Next emits `Sitemap: <url>` in robots.txt)
    - `host` value is the bare siteUrl (no path) — Next emits `Host: <url>` line; some legacy crawlers respect it for canonical-host hint
    - NO `disallow` field — site is fully crawlable (no admin/preview paths under static export)
    - NO `crawlDelay` — small site, not bandwidth-constrained
    - Top-of-file comment block matching project style (purpose + consumers + D-numbers)
  </behavior>
  <action>
Write `src/app/robots.ts` with this exact content:

```typescript
// SEO-02 — robots.txt emitted at build time.
//
// Next 15 file convention: `app/robots.ts` exporting default function returning
// MetadataRoute.Robots is statically optimized under `output: 'export'` and emits
// `out/robots.txt`. No runtime/server involvement.
//
// Pitfall #10 mitigation: sitemap URL + host are built from `siteUrl` — NEVER
// hardcode the domain here.
//
// Per CONTEXT D-28..D-30:
//   - Single allow-all rule (site has no admin/preview surfaces under static export)
//   - sitemap field references the sitemap.ts output URL (single string, NOT array)
//   - host field signals canonical host to legacy crawlers (Yandex etc.)
import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
```

Notes:
- The `userAgent: '*'` means "all crawlers". Vietnamese Coccoc, Google, Bing, Zalo all respect this.
- Do NOT add `disallow: '/api'` — there are no API routes under output: 'export'.
- Do NOT add a Vercel/Cloudflare-specific override here — Cloudflare Pages serves out/robots.txt verbatim.
  </action>
  <verify>
    <automated>
bash <<'EOF'
set -e
F="src/app/robots.ts"
echo "--- File exists ---" && test -f "$F"
echo "--- Default export of robots function ---" && grep -q 'export default function robots' "$F"
echo "--- Returns MetadataRoute.Robots ---" && grep -q 'MetadataRoute.Robots' "$F"
echo "--- Imports MetadataRoute type from next ---" && grep -q "import type { MetadataRoute } from 'next'" "$F"
echo "--- Imports siteUrl from @/lib/site ---" && grep -q "import { siteUrl } from '@/lib/site'" "$F"
echo "--- No hardcoded domain (Pitfall #10) ---" && ! grep -E "https?://khangthinhinv\.vn" "$F"
echo "--- userAgent: '*' ---" && grep -q "userAgent: '\*'" "$F"
echo "--- allow: '/' ---" && grep -q "allow: '/'" "$F"
echo "--- sitemap field references siteUrl + /sitemap.xml ---" && grep -q 'sitemap: `${siteUrl}/sitemap.xml`' "$F"
echo "--- host field = siteUrl ---" && grep -q 'host: siteUrl' "$F"
echo "--- No disallow / no crawlDelay ---" && ! grep -q 'disallow' "$F" && ! grep -q 'crawlDelay' "$F"
echo "--- Type check ---" && npx tsc --noEmit
echo "PASS"
EOF
    </automated>
  </verify>
  <done>
    - `src/app/robots.ts` exists, default-exports a function returning `MetadataRoute.Robots` with the single allow-all rule + siteUrl-derived sitemap + host.
    - No hardcoded domain anywhere.
    - `npx tsc --noEmit` exits 0.
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 3: Build verification — npm run build + cat out/sitemap.xml + cat out/robots.txt</name>
  <files></files>
  <read_first>
    - next.config.ts (confirms output: 'export' — sitemap/robots emit at build time, not runtime)
    - .planning/phases/05-seo-schema-polish/05-CONTEXT.md (D-31 — exact success surface table; D-32 no metadataBase warning)
    - .planning/research/PITFALLS.md (#15 — metadataBase warning gate)
  </read_first>
  <behavior>
    - `npm run build` exits 0 with no errors
    - Build stdout contains ZERO lines matching `metadataBase` (Phase 1 wiring intact, no regression)
    - `out/sitemap.xml` exists, is valid XML (parseable), contains exactly 2 `<url>` blocks
    - Each `<url>` block contains `<loc>` starting with `https://khangthinhinv.vn` (or whatever `NEXT_PUBLIC_SITE_URL` is set to — default fallback)
    - Both `<changefreq>monthly</changefreq>` present
    - Priorities `1` and `0.8` (or `1.0` — XML serialization may normalize) both present
    - `out/robots.txt` exists, contains:
      - `User-agent: *`
      - `Allow: /`
      - `Sitemap: https://khangthinhinv.vn/sitemap.xml` (or env-set host)
      - `Host: https://khangthinhinv.vn` (or env-set host)
    - TypeScript: `npx tsc --noEmit` exits 0 (sanity gate)
    - No other files in `out/` are unexpectedly missing (landing index.html and /du-an/index.html still exist — sanity, not strict gate of this plan)
  </behavior>
  <action>
Run a clean build + inspect both emitted files. This task does NOT modify source — it validates Tasks 1+2 holistically via static export.

```bash
rm -rf out .next
npm run build 2>&1 | tee /tmp/build-05-01.log
cat out/sitemap.xml
cat out/robots.txt
```

Then the verify block performs the gates listed above.
  </action>
  <verify>
    <automated>
bash <<'EOF'
set -e
echo "--- Clean build ---"
rm -rf out .next
npm run build 2>&1 | tee /tmp/build-05-01.log
echo "--- npm run build exited 0 (set -e would have stopped otherwise) ---"
echo "--- No metadataBase warning (Pitfall #15) ---"
! grep -i 'metadataBase' /tmp/build-05-01.log || { echo "FAIL: metadataBase warning surfaced — Phase 1 regression"; exit 1; }
echo "--- out/sitemap.xml exists ---"
test -f out/sitemap.xml
echo "--- Sitemap content ---"
cat out/sitemap.xml
echo "--- Sitemap has 2 <url> entries ---"
COUNT=$(grep -c '<url>' out/sitemap.xml || true)
[ "$COUNT" -eq 2 ] || { echo "FAIL: expected 2 <url>, got $COUNT"; exit 1; }
echo "--- Sitemap landing entry — base siteUrl ---"
grep -qE '<loc>https://khangthinhinv\.vn/?</loc>' out/sitemap.xml || \
  grep -qE "<loc>${NEXT_PUBLIC_SITE_URL:-https://khangthinhinv.vn}/?</loc>" out/sitemap.xml
echo "--- Sitemap /du-an entry ---"
grep -qE '<loc>https://khangthinhinv\.vn/du-an</loc>' out/sitemap.xml || \
  grep -qE "<loc>${NEXT_PUBLIC_SITE_URL:-https://khangthinhinv.vn}/du-an</loc>" out/sitemap.xml
echo "--- Both changefreq=monthly ---"
[ "$(grep -c '<changefreq>monthly</changefreq>' out/sitemap.xml)" -eq 2 ]
echo "--- Priorities (1 and 0.8) ---"
grep -qE '<priority>1(\.0)?</priority>' out/sitemap.xml
grep -qE '<priority>0\.8</priority>' out/sitemap.xml
echo "--- out/robots.txt exists ---"
test -f out/robots.txt
echo "--- Robots content ---"
cat out/robots.txt
echo "--- Robots: User-agent: * ---"
grep -q '^User-agent: \*' out/robots.txt
echo "--- Robots: Allow: / ---"
grep -q '^Allow: /' out/robots.txt
echo "--- Robots: Sitemap references sitemap.xml ---"
grep -qE '^Sitemap: https?://[^/]+/sitemap\.xml' out/robots.txt
echo "--- Robots: Host field present ---"
grep -qE '^Host: https?://' out/robots.txt
echo "--- TypeScript clean ---"
npx tsc --noEmit
echo "--- Sanity: landing + /du-an still emit (no regression) ---"
test -f out/index.html
test -f out/du-an/index.html
echo "PASS — sitemap + robots emitted; no metadataBase regression"
EOF
    </automated>
  </verify>
  <done>
    - `npm run build` exits 0; build stdout has ZERO `metadataBase` warnings.
    - `out/sitemap.xml` exists with exactly 2 `<url>` blocks, both with `<loc>` starting from siteUrl, both `<changefreq>monthly</changefreq>`, priorities 1.0 (or `1`) and 0.8 present.
    - `out/robots.txt` exists with `User-agent: *`, `Allow: /`, `Sitemap: <siteUrl>/sitemap.xml`, `Host: <siteUrl>` lines.
    - `npx tsc --noEmit` exits 0.
    - No regression: out/index.html and out/du-an/index.html still present.
  </done>
</task>

</tasks>

<verification>
After all 3 tasks complete:

1. **TypeScript clean**: `npx tsc --noEmit` exits 0
2. **Build clean**: `npm run build` exits 0; no metadataBase warning (Pitfall #15 gate held)
3. **SEO-01 satisfied**: out/sitemap.xml contains 2 absolute URLs sourced from siteUrl, monthly changefreq, priorities 1.0 / 0.8
4. **SEO-02 satisfied**: out/robots.txt contains allow-all rule + Sitemap line + Host line, all URLs from siteUrl
5. **Pitfall #10 mitigated**: zero hardcoded domain strings in sitemap.ts or robots.ts source; both files import siteUrl from @/lib/site
6. **No scope creep**: ONLY src/app/sitemap.ts and src/app/robots.ts added — no edits to layout.tsx, page.tsx, components, or any other file
7. **Phase 5 readiness for Plan 05-02**: out/ contains sitemap.xml + robots.txt; subsequent build in 05-02 will regenerate them alongside og/icons (no conflict — they live at different paths)
</verification>

<success_criteria>
- src/app/sitemap.ts exists; default-exports `function sitemap(): MetadataRoute.Sitemap`; 2 entries built from siteUrl with monthly + 1.0 / 0.8
- src/app/robots.ts exists; default-exports `function robots(): MetadataRoute.Robots`; allow-all + sitemap + host all from siteUrl
- No hardcoded `https://khangthinhinv.vn` literal in either file (Pitfall #10)
- npm run build exits 0; out/sitemap.xml + out/robots.txt both emit with correct content
- No metadataBase warning in build stdout (Pitfall #15)
- TypeScript strict mode passes
- No other source file is modified by this plan
</success_criteria>

<risks_pitfalls>
- **Pitfall #6 (NOT triggered this plan)**: Phone in JSON-LD format — addressed in Plan 05-02. Not relevant here.
- **Pitfall #10 (PRIMARY GATE)**: Sitemap/OG under wrong domain. Mitigation: import siteUrl from @/lib/site in BOTH files; verify block greps `! grep -E "https?://khangthinhinv\.vn" "$F"` to prove no hardcoded literal. If env-set NEXT_PUBLIC_SITE_URL points to wrong domain, the issue surfaces in deploy config — not this plan's responsibility.
- **Pitfall #14 (NOT triggered this plan)**: Default 404 page — addressed in Plan 05-02.
- **Pitfall #15 (CRITICAL GATE)**: metadataBase warning. Phase 1 set `metadataBase: new URL(siteUrl)` in layout.tsx line 22. This plan does NOT touch layout.tsx; verify block greps `! grep -i 'metadataBase' /tmp/build-05-01.log` to prove no regression. If a warning surfaces, it means a NEW page added in 04 or 05 has metadata using relative URLs without metadataBase resolution — STOP and inspect; do NOT proceed to Plan 05-02 until clean.

Additional risks specific to this plan:
- **MetadataRoute.Sitemap type drift**: Next 15 minor versions occasionally shift `changeFrequency` enum casing. If `'monthly'` rejects, fallback to `'monthly' as const`. Currently HIGH confidence on lowercase per RESEARCH Topic 1.
- **Static export emit path**: `out/sitemap.xml` vs `out/sitemap.xml/index.html`. Verified by RESEARCH Topic 1 — under output: 'export' the file is `out/sitemap.xml` directly. If executor sees `out/sitemap.xml/` directory, that signals a Next 15 regression — file an issue, do not work around.
- **NEXT_PUBLIC_SITE_URL not set in CI**: Default fallback in site.ts is `https://khangthinhinv.vn`. Verify block tolerates both env-set and default values. For real deploy, env var MUST be set in Cloudflare Pages config (Phase 6 concern, not Phase 5).
</risks_pitfalls>

<output>
After completion, create `.planning/phases/05-seo-schema-polish/05-01-seo-infrastructure-SUMMARY.md` capturing:
- Files created (src/app/sitemap.ts, src/app/robots.ts) — 2 files, 0 edits
- Task commits (3 commits — one per task; Task 3 is verify-only but commit a docs note about build green)
- Verbatim copies of `out/sitemap.xml` and `out/robots.txt` (the actual emitted bytes — proves SEO-01/SEO-02 satisfied)
- Build log excerpt confirming zero metadataBase warnings
- Confirm requirements completed: SEO-01, SEO-02
- Phase 5 readiness for Plan 05-02 (sitemap.ts + robots.ts in place; next plan adds JSON-LD, OG image, favicons, 404 — all under a new build that regenerates sitemap/robots without conflict)
</output>
