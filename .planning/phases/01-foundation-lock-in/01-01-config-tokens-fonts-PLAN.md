---
phase: 01-foundation-lock-in
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - next.config.ts
  - postcss.config.mjs
  - src/app/globals.css
  - src/app/layout.tsx
  - tsconfig.json
autonomous: true
requirements:
  - FND-01
  - FND-02
  - FND-03
  - FND-04
user_setup: []

must_haves:
  truths:
    - "npm run build succeeds with output: 'export' and produces /out/index.html"
    - "Tailwind utilities bg-burgundy, text-bone, bg-espresso, bg-bone, text-burgundy render correctly when applied to any element"
    - "Vietnamese diacritics (KHANG THỊNH ĐỘI TÀU 3,900 TẤN) render with correct Be Vietnam Pro glyphs across weights 400/500/600/700/800/900 — no fallback breakage"
    - "No metadataBase warning emitted during build (gated by lib/site.ts from Plan 02 — but stub works with hardcoded fallback)"
    - "No <link href='fonts.googleapis.com'> tags in <head> at runtime (next/font/google self-hosts)"
  artifacts:
    - path: "next.config.ts"
      provides: "Static export config — output:'export', trailingSlash:true, images.unoptimized:true"
      contains: "output: 'export'"
    - path: "postcss.config.mjs"
      provides: "Tailwind v4 PostCSS plugin wiring"
      contains: "@tailwindcss/postcss"
    - path: "src/app/globals.css"
      provides: "Tailwind v4 @theme tokens (Burgundy/Bone palette + font-sans), semantic :root aliases, base styles"
      contains: "@theme"
    - path: "src/app/layout.tsx"
      provides: "next/font/google Be_Vietnam_Pro wiring (vietnamese+latin subsets, weights 400-900), root metadata, lang='vi'"
      contains: "Be_Vietnam_Pro"
  key_links:
    - from: "src/app/layout.tsx"
      to: "src/app/globals.css"
      via: "import './globals.css'"
      pattern: "import.*globals\\.css"
    - from: "src/app/layout.tsx"
      to: "next/font/google"
      via: "Be_Vietnam_Pro({ subsets: ['vietnamese', 'latin'], weight: [...], variable: '--font-be-vietnam-pro' })"
      pattern: "Be_Vietnam_Pro"
    - from: "src/app/globals.css"
      to: "src/app/layout.tsx font variable"
      via: "@theme inline { --font-sans: var(--font-be-vietnam-pro) }"
      pattern: "@theme inline"
---

<objective>
Lock the foundation layer: static export config, Tailwind v4 design tokens (Burgundy/Bone palette), and Vietnamese-correct font wiring via `next/font/google` Be Vietnam Pro.

Purpose: Prevent 4 of the 5 critical Phase-1 pitfalls (silent `output:'export'` breakage, Tailwind v4 `@theme` namespace mistakes, Vietnamese diacritic fallback, missing `metadataBase`). Every later phase consumes these tokens — getting them wrong now ripples through every UI component.

Output: A repo that produces `/out/index.html` from `npm run build` with the Burgundy/Bone palette utilities generated, Be Vietnam Pro 400-900 self-hosted with Vietnamese subset, and `<html lang="vi">` set.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/research/SUMMARY.md
@.planning/phases/01-foundation-lock-in/01-RESEARCH.md

<!-- Files that will be rewritten in this plan — read for current state -->
@next.config.ts
@tsconfig.json
@package.json
@src/app/globals.css
@src/app/layout.tsx

<interfaces>
<!-- Locked decisions from 01-RESEARCH.md — executor MUST use these exact patterns. -->

Palette tokens (from RESEARCH.md TL;DR §3 — Burgundy/Bone, light mode):
```
--color-burgundy:      #6B1F1F
--color-burgundy-dark: #4A1414
--color-terracotta:    #B85450
--color-coffee:        #3A1F1A
--color-bone:          #F5F1EA
--color-bone-dark:     #EBE4D6
--color-espresso:      #1A1410
--color-taupe:         #8B7355
```

Font wiring (from RESEARCH.md Focus Area 1 + TL;DR §2):
```typescript
// Be Vietnam Pro is NOT variable in next/font/google — weight ARRAY required
Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],   // vietnamese FIRST for preload priority
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',                    // mandatory for VN diacritics
  variable: '--font-be-vietnam-pro',
})
```

CSS-to-Tailwind wiring (from RESEARCH.md Focus Area 2 — `@theme inline` REQUIRED for vars-referencing-vars):
```css
@theme inline {
  --font-sans: var(--font-be-vietnam-pro);
}
```

Static export config (from RESEARCH.md Focus Area 3 — exact final shape):
```typescript
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
}
```
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Verify next.config.ts + tsconfig.json + postcss.config.mjs baseline</name>
  <files>next.config.ts, tsconfig.json, postcss.config.mjs</files>
  <action>
**Goal:** Confirm static-export baseline is locked before touching globals.css / layout.tsx (these depend on the config being correct).

1. **Read `next.config.ts`** — current state already correct per inspection. Verify it contains EXACTLY:
   ```typescript
   import type { NextConfig } from "next";

   const nextConfig: NextConfig = {
     output: "export",
     trailingSlash: true,
     images: {
       unoptimized: true,
     },
   };

   export default nextConfig;
   ```
   If any other field is present (basePath, assetPrefix, distDir, rewrites, redirects, headers) — DELETE it. These are unsupported under `output: 'export'` (per RESEARCH.md Focus Area 3).

   Add a top-of-file comment block documenting unsupported features (per RESEARCH.md Pitfall #1 mitigation):
   ```typescript
   // ⚠️ Static export (`output: 'export'`) — incompatible features (do NOT add):
   // - Server Actions / "use server"
   // - Route Handlers with POST/PUT/DELETE (only GET works)
   // - `cookies()` / `headers()` from next/headers
   // - middleware.ts
   // - ISR / `revalidate`
   // - rewrites / redirects / headers config
   // - default next/image loader (must keep images.unoptimized: true)
   ```

2. **Read `tsconfig.json`** — verify `compilerOptions.strict: true` is set (it is, per inspection). NO changes needed unless strict is somehow disabled. Implements FND-02.

3. **Create `postcss.config.mjs`** at repo root (verify it does not already exist; if it exists, ensure it matches). Per RESEARCH.md Focus Area 2:
   ```javascript
   // Source: https://tailwindcss.com/docs/installation/framework-guides/nextjs (v4)
   export default { plugins: { '@tailwindcss/postcss': {} } };
   ```
   NO `autoprefixer`, NO `postcss-import` — Tailwind v4 handles internally.

**Gotcha (per RESEARCH.md):** Do NOT add or restore any `tailwind.config.ts`/`.js` — Tailwind v4 is CSS-first; the `@theme` block in globals.css (next task) is the entire config surface. If a config file exists, delete it.

**Rollback note:** Trivial — revert the file changes. No data loss possible.

Implements: FND-01 (config locked), FND-02 (strict TS verified).
  </action>
  <verify>
    <automated>cd /Users/congphan/Workspace/my-projects/khang-thing-group/website && grep -E "output:\s*['\"]export['\"]" next.config.ts && grep -E "trailingSlash:\s*true" next.config.ts && grep -E "unoptimized:\s*true" next.config.ts && grep -E '"strict":\s*true' tsconfig.json && grep -E '@tailwindcss/postcss' postcss.config.mjs && test ! -f tailwind.config.ts && test ! -f tailwind.config.js && echo "OK: config baseline locked"</automated>
  </verify>
  <done>
- `next.config.ts` contains `output: 'export'`, `trailingSlash: true`, `images.unoptimized: true` — and nothing else functional
- Top-of-file comment lists unsupported features (silent-breakage warning)
- `tsconfig.json` has `"strict": true`
- `postcss.config.mjs` exists with `@tailwindcss/postcss` plugin only
- No `tailwind.config.*` file exists at repo root
- `npm run build` not yet attempted (deferred to Task 4 after globals.css + layout.tsx rewrites)
  </done>
</task>

<task type="auto">
  <name>Task 2: Rewrite src/app/globals.css with Tailwind v4 @theme tokens (Burgundy/Bone)</name>
  <files>src/app/globals.css</files>
  <action>
**Goal:** Replace the current globals.css (which has v3-style raw `:root` variables like `--red`, `--gray-900` that generate NO Tailwind utilities) with the Tailwind v4 `@theme` pattern from RESEARCH.md.

**⚠️ Rewrite from scratch — do NOT try to patch in place.** Current content references DM Sans / DM Serif Display which are dropped entirely.

Write `src/app/globals.css` with EXACTLY this content (verbatim from RESEARCH.md Focus Area 2 + TL;DR §3):

```css
@import "tailwindcss";

/* ------------------------------------------------------------------ */
/* Design tokens — Tailwind v4 @theme block.                          */
/* --color-* generates bg-*, text-*, border-*, ring-*, fill-* utilities. */
/* --font-* generates font-* utilities.                               */
/* Custom variables outside reserved namespaces produce NO utility    */
/* (silent failure — see RESEARCH.md Pitfall #3).                     */
/* ------------------------------------------------------------------ */
@theme {
  /* Palette: Burgundy + Bone (light mode) */
  --color-burgundy: #6B1F1F;
  --color-burgundy-dark: #4A1414;
  --color-terracotta: #B85450;
  --color-coffee: #3A1F1A;
  --color-bone: #F5F1EA;
  --color-bone-dark: #EBE4D6;
  --color-espresso: #1A1410;
  --color-taupe: #8B7355;
}

/* @theme inline is REQUIRED when a token references another CSS var.
   Without `inline`, var(--font-be-vietnam-pro) resolves at definition
   scope (the root), not where the utility is applied → silent failure. */
@theme inline {
  --font-sans: var(--font-be-vietnam-pro);
}

/* Semantic aliases (NOT in @theme — these don't need utility classes;
   they're consumed only via var() in base styles, future dark-mode swap. */
:root {
  --color-bg: var(--color-bone);
  --color-bg-alt: var(--color-bone-dark);
  --color-fg: var(--color-espresso);
  --color-fg-muted: var(--color-taupe);
  --color-primary: var(--color-burgundy);
  --color-primary-hover: var(--color-burgundy-dark);
  --color-accent: var(--color-terracotta);
}

/* Base styles */
html { scroll-behavior: smooth; }
body {
  background: var(--color-bg);
  color: var(--color-fg);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  line-height: 1.6;
}
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}
```

**Why this exact structure (per RESEARCH.md):**
- `@import "tailwindcss"` is the v4 single-import syntax (replaces v3's `@tailwind base/components/utilities`)
- `--color-*` namespace generates `bg-burgundy`, `text-burgundy`, `border-burgundy`, etc. — any other name (like `--burgundy`) produces NO utility (Pitfall #3 / silent failure)
- `@theme inline` is REQUIRED for `--font-sans: var(--font-be-vietnam-pro)` to work — Tailwind v4 doc explicit requirement
- Semantic aliases live in `:root` (NOT `@theme`) because we don't want `bg-bg` / `bg-primary` utility classes — those names are reserved for the future dark-mode swap

**Gotchas (per RESEARCH.md):**
- DO NOT keep the old `:root` variables (`--red`, `--gray-900`, `--white`, etc.) — they don't generate utilities and would pollute the namespace
- DO NOT add `font-family: 'DM Sans'` anywhere — DM Sans/DM Serif Display are entirely dropped (Phase 1 uses ONLY Be Vietnam Pro)
- DO NOT add a `tailwind.config.ts` file — v4 is CSS-first

**Rollback note:** Save current globals.css to a scratch location before overwrite if paranoid. The current file is short (31 lines) — easy to restore from git history.

Implements: FND-03 (Tailwind v4 `@theme` Burgundy/Bone tokens).
  </action>
  <verify>
    <automated>cd /Users/congphan/Workspace/my-projects/khang-thing-group/website && grep -E '^@import "tailwindcss"' src/app/globals.css && grep -E '^@theme' src/app/globals.css && grep -E '@theme inline' src/app/globals.css && grep -E -- '--color-burgundy:\s*#6B1F1F' src/app/globals.css && grep -E -- '--color-bone:\s*#F5F1EA' src/app/globals.css && grep -E -- '--color-espresso:\s*#1A1410' src/app/globals.css && grep -E -- '--font-sans:\s*var\(--font-be-vietnam-pro\)' src/app/globals.css && ! grep -E 'DM Sans|DM Serif|--red:|--gray-' src/app/globals.css && echo "OK: globals.css rewritten correctly"</automated>
  </verify>
  <done>
- `globals.css` starts with `@import "tailwindcss";`
- `@theme {}` block declares all 8 palette tokens with `--color-*` namespace (burgundy, burgundy-dark, terracotta, coffee, bone, bone-dark, espresso, taupe) at exact hex values from RESEARCH.md
- Separate `@theme inline { --font-sans: var(--font-be-vietnam-pro); }` block present
- `:root` block declares semantic aliases (`--color-bg`, `--color-fg`, `--color-primary`, etc.)
- Base styles (`html scroll-behavior`, `body bg/color/font-family`, `prefers-reduced-motion`) present
- All v3-era variables (`--red`, `--gray-*`, `--white`) AND all DM Sans references REMOVED
  </done>
</task>

<task type="auto">
  <name>Task 3: Rewrite src/app/layout.tsx with Be Vietnam Pro via next/font/google</name>
  <files>src/app/layout.tsx</files>
  <action>
**Goal:** Replace current `layout.tsx` (which uses Google Fonts via `<link>` for DM Sans/DM Serif — Pitfall #7 violation, breaks Vietnamese diacritics) with `next/font/google` self-hosted Be Vietnam Pro pattern from RESEARCH.md.

**⚠️ Rewrite from scratch — do NOT patch in place.** The `<link>` lines must be entirely removed, not commented out.

Write `src/app/layout.tsx` with EXACTLY this content (verbatim from RESEARCH.md TL;DR §2 + Focus Area 1):

```tsx
// Source: https://nextjs.org/docs/app/api-reference/components/font#with-tailwind-css
// Be Vietnam Pro is NOT variable in next/font/google — `weight` array REQUIRED.
// `subsets: ['vietnamese', 'latin']` is mandatory for correct Vietnamese diacritic rendering.
import type { Metadata, Viewport } from 'next'
import { Be_Vietnam_Pro } from 'next/font/google'
import './globals.css'

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-be-vietnam-pro',
})

// NOTE: metadataBase intentionally omitted in this task — added in Plan 02 once
// `lib/site.ts` exposes `siteUrl`. Until then, build will log a metadataBase
// warning; Plan 02 closes that gap (Pitfall #4 / FND-05).
export const metadata: Metadata = {
  title: {
    default: 'Khang Thịnh Investment — Cung ứng VLXD, Xây dựng, Vận chuyển',
    template: '%s | Khang Thịnh Investment',
  },
  description:
    'Cung ứng cát, đá, san lấp. Xây dựng nhà phố & công trình dân dụng. Vận chuyển đường thủy. Đối tác Bộ Quốc phòng - Binh đoàn 12 - Trường Sơn.',
}

export const viewport: Viewport = {
  themeColor: '#6B1F1F',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
```

**Why this exact structure (per RESEARCH.md Focus Area 1):**
- Import name `Be_Vietnam_Pro` uses underscore (Next.js convention for multi-word font names)
- `subsets: ['vietnamese', 'latin']` puts vietnamese FIRST for preload priority — fallback for Windows Arial misrenders composite diacritics (`ờ`, `ợ`, `ữ`, `ẳ`)
- `weight: ['400', '500', '600', '700', '800', '900']` — required because Be Vietnam Pro is NOT a variable font in Google's npm binding
- `display: 'swap'` — invisible text or font-block strategies misrender diacritics; swap is mandatory
- `variable: '--font-be-vietnam-pro'` — applied via `className={beVietnamPro.variable}` on `<html>`, consumed by `@theme inline { --font-sans: var(--font-be-vietnam-pro); }` in globals.css (Task 2)
- `<html lang="vi">` — required for screen readers and Google Search "this page in Vietnamese" UI
- `<body className="font-sans antialiased">` — activates the Tailwind `font-sans` utility that resolves to `var(--font-be-vietnam-pro)`

**Gotchas (per RESEARCH.md Focus Area 1 + Pitfall #7):**
- DO NOT keep ANY `<link rel="preconnect" href="https://fonts.googleapis.com">` or `<link href="https://fonts.googleapis.com/css2?…">` tags — `next/font/google` self-hosts at build time; runtime requests to Google Fonts are dead weight and a CLS source
- DO NOT mix `className` and `variable` — pick `variable` (more flexible for Tailwind integration)
- DO NOT add `metadataBase` here yet — that depends on `lib/site.ts` from Plan 02 (the metadataBase warning will appear in Task 4 build verification — that's expected and closes in Plan 02)
- DO NOT import `@/lib/site` yet — it doesn't exist until Plan 02

**Page.tsx note:** Current `src/app/page.tsx` imports `@/components/Header` and `@/components/Footer` which still exist as skeleton. Those imports will break after Plan 02 deletes the skeleton (FND-07). For now, leave `page.tsx` alone — Plan 02 task "rewrite page.tsx as Phase 1 sentinel" handles it. Build at end of THIS plan may still pass because Header/Footer files still exist.

**Rollback note:** Trivial — `git checkout src/app/layout.tsx`. Current file is 25 lines.

Implements: FND-04 (Be Vietnam Pro Vietnamese subset via next/font/google).
  </action>
  <verify>
    <automated>cd /Users/congphan/Workspace/my-projects/khang-thing-group/website && grep -E "from 'next/font/google'" src/app/layout.tsx && grep -E 'Be_Vietnam_Pro\(' src/app/layout.tsx && grep -E "subsets:\s*\['vietnamese',\s*'latin'\]" src/app/layout.tsx && grep -E "weight:\s*\['400',\s*'500',\s*'600',\s*'700',\s*'800',\s*'900'\]" src/app/layout.tsx && grep -E "display:\s*'swap'" src/app/layout.tsx && grep -E "variable:\s*'--font-be-vietnam-pro'" src/app/layout.tsx && grep -E 'lang="vi"' src/app/layout.tsx && grep -E 'className=\{beVietnamPro\.variable\}' src/app/layout.tsx && grep -E 'className="font-sans antialiased"' src/app/layout.tsx && ! grep -E 'fonts\.googleapis\.com|DM Sans|DM Serif|preconnect' src/app/layout.tsx && echo "OK: layout.tsx rewritten correctly"</automated>
  </verify>
  <done>
- `layout.tsx` imports `Be_Vietnam_Pro` from `next/font/google` (underscore form)
- Font config: `subsets: ['vietnamese', 'latin']`, `weight` array 400-900, `display: 'swap'`, `variable: '--font-be-vietnam-pro'`
- `<html lang="vi" className={beVietnamPro.variable}>` and `<body className="font-sans antialiased">` present
- `metadata` and `viewport` exports declared (metadataBase deferred to Plan 02 — known gap)
- NO `<link>` tags pointing to `fonts.googleapis.com`, NO `preconnect`, NO `DM Sans` / `DM Serif` references
  </done>
</task>

<task type="auto">
  <name>Task 4: Build verification — confirm static export emits /out/index.html with palette utilities + diacritics</name>
  <files>(no code changes — verification only; may add temporary sentinel to src/app/page.tsx)</files>
  <action>
**Goal:** Prove the foundation works END-TO-END by running a clean build and visually inspecting the output. This is the Phase-1 gate for tokens + fonts before Plan 02 touches the skeleton.

**Step 1 — Pre-flight cleanup:**
```bash
cd /Users/congphan/Workspace/my-projects/khang-thing-group/website
rm -rf .next out
```

**Step 2 — Add temporary sentinel inside `src/app/page.tsx`** (DO NOT delete existing Header/Footer imports yet — they're still skeleton files, removed in Plan 02). Add this `<div>` near the top of the JSX returned from `HomePage()`, immediately after the existing Header:

```tsx
{/* ⚠️ Phase 1 sentinel — DELETE in Plan 02 / Phase 3 */}
<div className="bg-bone text-espresso p-8 m-4 border-4 border-burgundy">
  <p className="font-sans font-black uppercase tracking-wide text-4xl text-burgundy">
    KHANG THỊNH ĐỘI TÀU 3,900 TẤN
  </p>
  <p className="font-sans font-bold text-2xl text-burgundy-dark mt-2">
    Cao tốc Cái Nước — Đất Mũi — Cầu Cửa Lớn
  </p>
  <p className="font-sans text-base text-taupe mt-4">
    Hợp tác cùng phát triển — Đối tác Bộ Quốc phòng / Binh đoàn 12 / Trường Sơn
  </p>
  <div className="mt-4 grid grid-cols-4 gap-2">
    <div className="bg-burgundy h-12" aria-label="burgundy"></div>
    <div className="bg-terracotta h-12" aria-label="terracotta"></div>
    <div className="bg-bone-dark h-12" aria-label="bone-dark"></div>
    <div className="bg-espresso h-12" aria-label="espresso"></div>
  </div>
</div>
```

This sentinel exercises:
- `bg-bone`, `text-espresso`, `border-burgundy`, `text-burgundy`, `bg-burgundy`, `bg-terracotta`, `bg-bone-dark`, `bg-espresso`, `text-burgundy-dark`, `text-taupe` (all 8 palette tokens reachable)
- `font-sans` Tailwind utility (resolves to Be Vietnam Pro)
- `font-black` weight 900 + Vietnamese diacritics (`Ị`, `Ộ`, `À`) — visual proof of FND-04
- `uppercase`, `tracking-wide` — industrial display feel without Bebas Neue

**Step 3 — Run the clean build:**
```bash
npm run build 2>&1 | tee /tmp/build-01-01.log
```

**Expected outcomes:**
- Exit code 0
- `/out/index.html` exists
- Build log may show ONE expected warning about `metadataBase` — fine for now, closed in Plan 02
- Build log MUST NOT show any error about: missing module `@/lib/site` (we haven't imported it yet); Server Action / "use server" usage; dynamic rendering; font load failure

**Step 4 — Verify utility generation in emitted CSS:**
```bash
# Find emitted CSS file and confirm palette utilities are present
find out/_next/static/css -name "*.css" -exec grep -l "bg-burgundy" {} \;
find out/_next/static/css -name "*.css" -exec grep -l "text-bone\|text-espresso" {} \;
```
Both commands must print at least one CSS file path (proves Tailwind v4 emitted the utilities from the `@theme` block in Task 2).

**Step 5 — Manual visual verification (CHECKPOINT inside this task — Claude runs dev server, user inspects):**

Run `npm run dev` and open `http://localhost:3000/`. Visually verify (Claude lists for executor; user confirms during execute-phase):
1. The sentinel `<div>` has a Bone (off-white #F5F1EA) background with a Burgundy (#6B1F1F) 4px border
2. "KHANG THỊNH ĐỘI TÀU 3,900 TẤN" headline renders in Burgundy, very bold (weight 900), all caps, with VISIBLE diacritics on `Ị`, `Ộ`, `À` — letters look uniform, no fallback glyph swap, no detached diacritics
3. The 4-color grid below shows burgundy / terracotta (lighter rust) / bone-dark (slightly darker off-white) / espresso (near-black brown) — all four cells visibly different
4. Open Chrome DevTools → Network tab → reload → confirm there is NO request to `fonts.googleapis.com` or `fonts.gstatic.com` (next/font/google self-hosted; runtime requests would indicate the `<link>` tags weren't removed)

If any of the 4 visual checks fail, STOP and report — most likely cause is Task 2 (`@theme` namespace) or Task 3 (`variable` className wiring) was not applied verbatim.

**Step 6 — Cleanup tracking:**
Add a TODO comment near the sentinel:
```tsx
{/* TODO(plan-01-02): Remove this sentinel — replaced by real Hero in Phase 3 */}
```

**Rollback note:** If anything is off, `git checkout src/app/page.tsx src/app/layout.tsx src/app/globals.css next.config.ts` reverts everything. Sentinel is intentionally easy to delete in Plan 02.

Implements: Phase 1 success criteria #1, #2, #3 (build passes, palette utilities render, Vietnamese diacritics correct). Verifies FND-01, FND-02, FND-03, FND-04 together.
  </action>
  <verify>
    <automated>cd /Users/congphan/Workspace/my-projects/khang-thing-group/website && rm -rf .next out && npm run build 2>&1 | tee /tmp/build-01-01.log && test -f out/index.html && find out/_next/static/css -name "*.css" -exec grep -l "burgundy" {} \; | head -1 | grep -q "css$" && ! grep -Ei "error|failed|server actions|use server is not allowed" /tmp/build-01-01.log && echo "OK: clean build produces /out/index.html with burgundy utilities"</automated>
  </verify>
  <done>
- `npm run build` exits 0 from a clean state (no `.next` / `out` directories pre-existing)
- `out/index.html` exists
- Emitted CSS in `out/_next/static/css/` contains the `bg-burgundy` (or other palette) utility class
- Build log shows no errors (a single `metadataBase` warning is expected and closes in Plan 02)
- Visual smoke test: sentinel div renders with Burgundy border + Bone background, "KHANG THỊNH ĐỘI TÀU 3,900 TẤN" displays in Be Vietnam Pro 900 with all Vietnamese diacritics intact
- Network tab confirms zero requests to `fonts.googleapis.com` / `fonts.gstatic.com`
- Sentinel marked with `TODO(plan-01-02)` for removal in Plan 02
  </done>
</task>

</tasks>

<verification>
**Phase 1 Success Criteria covered by this plan:**

| Criterion | Verified By |
|-----------|-------------|
| #1: `npm run build` succeeds, produces `/out/` with static HTML | Task 4 — clean rebuild check |
| #2: Burgundy/Bone utilities (`bg-burgundy`, `text-bone`, `bg-espresso`) render | Task 4 — sentinel + CSS grep |
| #3: Vietnamese diacritics in Be Vietnam Pro across all 6 weights | Task 4 — sentinel visual check |
| #4: `NEXT_PUBLIC_SITE_URL` propagates from `lib/site.ts` | Deferred to Plan 02 |
| #5: Skeleton folders deleted, build still passes | Deferred to Plan 02 |

**Requirement coverage:**
- FND-01 → Task 1 (`next.config.ts` locked)
- FND-02 → Task 1 (strict TS verified) + Task 4 (build passes)
- FND-03 → Task 2 (`@theme` Burgundy/Bone) + Task 4 (utilities emitted)
- FND-04 → Task 3 (`next/font/google` Be Vietnam Pro) + Task 4 (diacritics render)
</verification>

<success_criteria>
- [ ] `next.config.ts` matches RESEARCH.md TL;DR §1 verbatim with unsupported-features comment
- [ ] `postcss.config.mjs` contains only `@tailwindcss/postcss`; no `tailwind.config.*` file at repo root
- [ ] `tsconfig.json` `compilerOptions.strict: true`
- [ ] `src/app/globals.css` has `@theme` palette + `@theme inline` font wiring + `:root` semantic aliases + base styles; no v3 leftovers, no DM Sans
- [ ] `src/app/layout.tsx` uses `Be_Vietnam_Pro` from `next/font/google` with `subsets: ['vietnamese', 'latin']` and `weight: ['400'..'900']`; no `<link>` to Google Fonts
- [ ] Clean `npm run build` exits 0; emits `out/index.html`
- [ ] Emitted CSS contains `bg-burgundy` (or other palette) utility — proves `@theme` namespace works
- [ ] Visual sentinel confirms Vietnamese diacritics render with Be Vietnam Pro (no fallback)
- [ ] Network tab confirms no runtime requests to Google Fonts CDN
- [ ] Single git commit per task (4 commits total — atomic rollback granularity)
</success_criteria>

<output>
After completion, create `.planning/phases/01-foundation-lock-in/01-01-SUMMARY.md` capturing:
- What changed (files rewritten / created)
- Verification artifacts (path to `out/index.html`, build log location)
- Any deviations from RESEARCH.md (should be ZERO — research was prescriptive)
- Known open gaps closed by Plan 02 (metadataBase, lib/site.ts, sentinel cleanup, skeleton deletion)
- Pointer to the Phase-1 sentinel that Plan 02 must remove
</output>
