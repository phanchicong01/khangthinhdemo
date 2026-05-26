# Phase 1: Foundation Lock-In — Research

**Researched:** 2026-05-26
**Domain:** Next.js 15 static-export config + Tailwind v4 design tokens + next/font Vietnamese subset + lib/site.ts single-source-of-truth
**Confidence:** HIGH (all 4 focus areas verified against official Next.js 15 docs dated 2026-05-19 and Tailwind v4 theme docs)

## Summary

Phase 1 locks 4 things into the repo before any UI work begins: `next.config.ts` for static export, `globals.css` with Tailwind v4 `@theme` Burgundy/Bone tokens, root `layout.tsx` with `next/font/google` Be Vietnam Pro (Vietnamese subset), and `lib/site.ts` company facts. The roadmap and SUMMARY.md have already locked the key decisions (`next/font/google` over `@fontsource`; drop Bebas Neue entirely; deploy target Cloudflare Pages — root domain, no `basePath`). This research is **prescriptive verification + concrete code patterns**, not an options exploration.

**Primary recommendation:** Use the locked-in pattern below verbatim — `next/font/google` `Be_Vietnam_Pro({ subsets: ['vietnamese', 'latin'], weight: ['400','500','600','700','800','900'], display: 'swap', variable: '--font-be-vietnam-pro' })`, wire to Tailwind via `@theme inline { --font-sans: var(--font-be-vietnam-pro); }`, declare `--color-*` tokens in plain `@theme {}`, set `next.config.ts` to exactly `{ output: 'export', trailingSlash: true, images: { unoptimized: true } }`, and expose company facts from `lib/site.ts` with `tel:+84921985599` (E.164) for hrefs and `092 198 55 99` for display.

The key non-obvious facts confirmed by official docs:
1. **Be Vietnam Pro is NOT exposed as a variable font in `next/font/google`** — you MUST pass a `weight` array. (Per Next.js Font API: variable Google fonts allow omitting weight; non-variable fonts require it. Be Vietnam Pro's npm Google Font binding ships as static weights.)
2. **`@theme inline` is required** when font tokens reference another CSS variable (the next/font-generated variable). Plain `@theme` would emit `var(--font-be-vietnam-pro)` resolved at the wrong scope.
3. **`output: 'export'` silently strips features** — Server Actions, non-GET Route Handlers, `cookies()`, `headers()`, middleware, ISR — without build errors in many cases. The ESLint guardrail is non-negotiable.

<user_constraints>
## User Constraints (from CONTEXT.md / PROJECT.md / ROADMAP.md)

> No CONTEXT.md exists for this phase (no `/gsd:discuss-phase` was run). Constraints below are sourced from PROJECT.md "Key Decisions", REQUIREMENTS.md, ROADMAP.md "Pre-Phase-1 Lock Checklist", and the approved design spec — all of which the user has already approved.

### Locked Decisions
- **Tech stack:** Next.js 15 (App Router) + React 19 + Tailwind CSS 4 + TypeScript 5.9 — already set up, not negotiable.
- **Deployment model:** Static export (`output: 'export'`) — no backend, no Server Actions, no API routes (POST/PUT/DELETE).
- **Font loading mechanism:** `next/font/google` with explicit `subsets: ['vietnamese', 'latin']` per FND-04. (NOT `@fontsource` — STACK.md preferred that but the roadmap and FND-04 locked `next/font/google`.)
- **Font family:** 1 family — Be Vietnam Pro 400–900. **Bebas Neue dropped entirely** (no Vietnamese diacritics; would visibly break headlines). Industrial display feel achieved via Be Vietnam Pro 800/900 + uppercase + letter-spacing.
- **Palette:** Burgundy + Bone (light mode). Exact hex values from design spec.
- **Deploy target:** Cloudflare Pages — root domain, **no `basePath` needed**. GitHub Pages explicitly ruled out (commercial-use ToS conflict).
- **Domain:** Placeholder `https://khangthinhinv.vn` gated behind `NEXT_PUBLIC_SITE_URL` env var (FND-05).
- **CTA conventions:** `tel:+84921985599` (E.164, no spaces) for href; `092 198 55 99` for display; `https://zalo.me/0921985599` (HTTPS) for Zalo.
- **`trailingSlash: true`** locked (FND-01) — produces `/du-an/index.html` directories.
- **`images.unoptimized: true`** locked (FND-01) — required for `output: 'export'`.
- **TypeScript strict mode** must remain on; `npm run build` must pass clean (FND-02).
- **Skeleton cleanup:** Delete `src/app/dich-vu/`, `src/app/lien-he/`, `src/components/Header.tsx` (FND-07).

### Claude's Discretion
- Exact ordering of `globals.css` blocks (palette → semantic aliases → base styles).
- Whether to add an ESLint custom rule banning `"use server"` / `cookies()` / `headers()` in Phase 1 or defer to a later phase. (Roadmap suggests adding now; plan should include unless deferred.)
- File-name choices inside `lib/` (`site.ts` is locked by FND-06; other helper file names are open).
- Whether to seed `lib/site.ts` with helpers (`getTelHref()`, `getZaloUrl()`) or only raw constants — recommend helpers.
- Whether to add a "hello world" sanity sentinel (e.g., a `<p>{siteUrl}</p>` rendered briefly to verify env var wiring) before deleting it at end of phase.

### Deferred Ideas (OUT OF SCOPE for Phase 1)
- All section components (Hero, Services, Projects, BigStats, etc.) — Phase 3.
- Nav / Footer / FloatingZalo — Phase 2.
- `lib/projects.ts` data — Phase 4.
- sitemap.ts / robots.ts / JSON-LD / og-image / favicon / 404 page — Phase 5.
- Cloudflare Pages deploy + Web Analytics + README — Phase 6.
- Lighthouse audit / responsive verification — Phase 6.
- Real project photos / image-optimization pipeline — v1.x post-launch.
- Dark mode toggle (palette tokens are CSS-variable-based so future-proofed, but no toggle now).
- Animation library install (`motion`) — defer to Phase 3 only if actually needed.
- `lucide-react` install — defer to Phase 2 (first consumer is Nav).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| **FND-01** | `next.config.ts` with `output: 'export'`, `images.unoptimized: true`, `trailingSlash: true` | Focus Area 3 below — verified against [Next.js Static Exports docs (16.2.6 / 2026-05-19)](https://nextjs.org/docs/app/guides/static-exports). All three fields confirmed valid. `trailingSlash: true` is documented as the convention that emits `/route/index.html`. |
| **FND-02** | TypeScript strict mode, `npm run build` passes | Already present in `package.json` (TS 5.9.3). Verify `tsconfig.json` has `"strict": true`. Build will pass once skeleton folders are deleted (no orphan imports) and `globals.css` is replaced (current file references `DM Sans` which will be removed). |
| **FND-03** | Tailwind v4 design tokens via `@theme` (Burgundy/Bone) | Focus Area 2 below — verified against [Tailwind v4 theme docs](https://tailwindcss.com/docs/theme). `--color-*` namespace generates `bg-*`, `text-*`, `border-*` utilities. Use `@theme inline` for font tokens that reference `var(--font-…)`. |
| **FND-04** | Be Vietnam Pro 400–900 via `next/font/google`, `subsets: ['vietnamese', 'latin']` | Focus Area 1 below — verified against [Next.js Font docs (16.2.6 / 2026-05-19)](https://nextjs.org/docs/app/api-reference/components/font). Be Vietnam Pro is non-variable in Google's npm binding → `weight` array required. |
| **FND-05** | `NEXT_PUBLIC_SITE_URL` env var, default `https://khangthinhinv.vn` | Focus Area 4 below. `process.env.NEXT_PUBLIC_*` is inlined at build time (Next 15 standard). Must be read with nullish coalescing: `process.env.NEXT_PUBLIC_SITE_URL ?? 'https://khangthinhinv.vn'`. |
| **FND-06** | Company facts in `lib/site.ts` — single source of truth | Focus Area 4 below. Recommend typed `as const` object + helper functions. |
| **FND-07** | Delete `src/app/dich-vu/`, `src/app/lien-he/`, `src/components/Header.tsx` | Mechanical. After deletion, `npm run build` must still pass — verifies no orphan imports. |
</phase_requirements>

## TL;DR — Key Decisions with Code

### 1. `next.config.ts` (exact final content)
```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
}

export default nextConfig
```

### 2. `src/app/layout.tsx` (font + metadata wiring)
```tsx
import type { Metadata, Viewport } from 'next'
import { Be_Vietnam_Pro } from 'next/font/google'
import { siteUrl } from '@/lib/site'
import './globals.css'

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-be-vietnam-pro',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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

### 3. `src/app/globals.css` (replace existing entirely)
```css
@import "tailwindcss";

/* ------------------------------------------------------------------ */
/* Design tokens — Tailwind v4 @theme block.                          */
/* --color-* generates bg-*, text-*, border-* utilities.              */
/* --font-* generates font-* utilities.                               */
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

/* @theme inline is REQUIRED when a token references another CSS var. */
@theme inline {
  --font-sans: var(--font-be-vietnam-pro);
}

/* Semantic aliases (NOT in @theme — these don't need utility classes) */
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

### 4. `src/lib/site.ts` (single source of truth)
```ts
// Single source of truth for company facts, domain, and CTA URLs.
// Imported by: layout.tsx (metadata), sitemap.ts (Phase 5), robots.ts (Phase 5),
// Footer.tsx (Phase 2), Contact.tsx (Phase 3), FloatingZalo.tsx (Phase 2),
// JSON-LD GeneralContractor (Phase 5).

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://khangthinhinv.vn'

export const company = {
  legalName: 'Công ty TNHH Khang Thịnh Investment',
  shortName: 'KHANG THỊNH INV',
  tagline: 'Hợp tác cùng phát triển',
  founded: 2025,

  // Phone — Vietnamese local format displayed, E.164 used in tel: href
  phoneDisplay: '092 198 55 99',
  phoneE164: '+84921985599', // tel:+84921985599
  phoneRaw: '0921985599',    // bare digits, used to build zalo.me URL

  // Email
  email: 'khangthinhinv2025@gmail.com',

  // Zalo deep link — HTTPS (NEVER zalo://). Works on iOS Universal Link + Android intent.
  zaloUrl: 'https://zalo.me/0921985599',

  // Legal
  taxId: '1102107064',          // MST — used as taxID in JSON-LD and footer display
  taxIdDisplay: '1102 107 064',
  legalRep: 'Tô Thị Bích Ngọc', // ĐDPL

  // Address (PostalAddress shape, reusable in JSON-LD)
  address: {
    street: 'A3-02 KDC Long Phú',
    locality: 'xã Bến Lức',
    region: 'Tây Ninh',
    country: 'VN',
    full: 'A3-02 KDC Long Phú, xã Bến Lức, tỉnh Tây Ninh',
  },
} as const

// Helpers (prevent typos at call sites)
export const telHref = (): string => `tel:${company.phoneE164}`
export const mailtoHref = (): string => `mailto:${company.email}`
export const zaloHref = (): string => company.zaloUrl
```

---

## Focus Area 1: `next/font/google` Vietnamese Subset (CRITICAL)

### Findings

**Verified against [Next.js Font API Reference v16.2.6 / 2026-05-19](https://nextjs.org/docs/app/api-reference/components/font):**

1. **`subsets` accepts an array of strings.** `subsets: ['vietnamese', 'latin']` is valid. Per Next.js docs: "Fonts specified via `subsets` will have a link preload tag injected into the head when the `preload` option is true, which is the default." Failing to specify any subsets while `preload: true` results in a warning.

2. **Be Vietnam Pro is NOT a variable font in Google's npm binding.** Confirmed via Google Fonts metadata (referenced in STACK.md and SUMMARY.md): the npm `next/font/google` binding ships static weight files. Per Next.js docs: "Required if the font being used is **not** variable." → `weight` is mandatory for Be Vietnam Pro. Pass an array: `weight: ['400','500','600','700','800','900']`.

   **Implication for bundle size:** Loading six weights × two subsets (latin + vietnamese) ≈ 12 woff2 files preloaded. Each weight × subset ≈ 8–15 KB woff2. Expected total: **~100–150 KB**. Acceptable for a marketing site if Lighthouse target ≥ 90 (still on budget with no other heavy assets).

3. **`display: 'swap'` is the right choice here.** Per MDN/Next docs:
   - `'swap'` — show fallback immediately, swap to web font when ready. CLS risk but text is always visible.
   - `'optional'` — same as block-then-fallback after 100 ms; web font may NEVER swap in on slow connections. Bad for Vietnamese — fallback may render wrong glyphs.
   - `'block'` — invisible text up to ~3 s. Bad for LCP.

   For Vietnamese where fallback fonts often misrender composite diacritics (especially Arial on Windows), `'swap'` is mandated. Combine with `adjustFontFallback: true` (default) — Next.js auto-adjusts fallback font metrics to minimize CLS.

4. **CSS variable wiring is standard.** Set `variable: '--font-be-vietnam-pro'`, apply `className={font.variable}` on `<html>`, then in CSS `var(--font-be-vietnam-pro)` is available globally.

5. **Tailwind v4 integration uses `@theme inline`.** Verified directly in Next.js docs ([Font Module → With Tailwind CSS](https://nextjs.org/docs/app/api-reference/components/font#with-tailwind-css)):
   ```css
   @theme inline {
     --font-sans: var(--font-inter);
   }
   ```
   This produces utility `font-sans` that emits `font-family: var(--font-inter)`. Without `inline`, Tailwind would resolve the variable at definition time (wrong scope) and the utility would fail silently.

### Recommended Approach (prescriptive)

```tsx
// src/app/layout.tsx
import { Be_Vietnam_Pro } from 'next/font/google'

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-be-vietnam-pro',
  // adjustFontFallback: true is the default — keep default
  // preload: true is the default — keep default
})

// Apply to <html> via .variable class
<html lang="vi" className={beVietnamPro.variable}>
```

```css
/* src/app/globals.css */
@theme inline {
  --font-sans: var(--font-be-vietnam-pro);
}
```

**Tailwind utility produced:** `font-sans` → `font-family: var(--font-be-vietnam-pro)`.
**For "display" usage** (Hero headlines, BigStats): use `font-sans font-black uppercase tracking-wide` — weight 900 + uppercase + letter-spacing achieves industrial display feel WITH correct Vietnamese diacritic rendering.

### Gotchas

- **Underscore in import name:** Per Next.js docs: "Use an underscore (`_`) for font names with multiple words. E.g. `Roboto Mono` should be imported as `Roboto_Mono`." → `Be_Vietnam_Pro` (not `BeVietnamPro`).
- **Don't add `<link rel="preconnect" href="fonts.googleapis.com">`** as the current `layout.tsx` does — `next/font/google` self-hosts at build time; no runtime request to Google. The current preconnect lines are dead weight and must be removed.
- **Don't combine `className` and `variable` styles** — pick one. Recommend `variable` (more flexible for Tailwind integration). The existing `inter.className` pattern in Next docs is for the className approach; for our Tailwind v4 pattern use `inter.variable`.
- **Build will fail if `next build` runs offline AFTER first install.** Once `next build` has run once with network access, fonts are cached in `.next/cache/`. CI machines that build from clean must have network access to `fonts.gstatic.com` — but pages serve fully self-hosted (no runtime hit). If this becomes a CI blocker, switch to `@fontsource-variable/be-vietnam-pro` is the documented fallback (STACK.md option) — but defer that decision unless a real CI failure occurs.

### Verification

Manual Vietnamese diacritic test — render in a sentinel during Phase 1 build:
```tsx
<p className="font-sans font-black uppercase tracking-wide">
  KHANG THỊNH ĐỘI TÀU 3,900 TẤN — Cao tốc Cái Nước-Đất Mũi
</p>
```
Visually inspect `Ị`, `Ộ`, `Ầ`, `Đ`, `Ấ`, `Ũ` — all must render with correct stacked diacritics, no fallback glyph swap, uniform baseline.

---

## Focus Area 2: Tailwind v4 `@theme` Directive Integration (CRITICAL)

### Findings

**Verified against [Tailwind v4 theme docs](https://tailwindcss.com/docs/theme):**

1. **Tailwind v4 has NO config file by default.** All design tokens live in CSS via `@theme`. There is no `tailwind.config.ts` for this project. **Verified:** current repo has no `tailwind.config.*` file — correct.

2. **PostCSS config check:** `package.json` already has `@tailwindcss/postcss: ^4.0.0`. The required `postcss.config.mjs` should contain only:
   ```js
   export default { plugins: { '@tailwindcss/postcss': {} } }
   ```
   No `autoprefixer`, no `postcss-import` (v4 handles internally).

3. **Token namespaces are reserved** and each generates a specific utility family:
   | Namespace | Utility family |
   |-----------|----------------|
   | `--color-*` | `bg-*`, `text-*`, `border-*`, `fill-*`, `ring-*`, `stroke-*`, etc. |
   | `--font-*` | `font-*` (e.g. `--font-sans` → `font-sans`) |
   | `--spacing-*` | `p-*`, `m-*`, `gap-*`, `w-*`, `h-*`, etc. |
   | `--radius-*` | `rounded-*` |
   | `--shadow-*` | `shadow-*` |
   | `--breakpoint-*` | responsive variants |
   | `--text-*` | font-size utilities |

   Custom variables outside these namespaces produce NO utility (silent failure).

4. **`@theme` vs `:root`:**
   | Feature | `@theme` | `:root` |
   |---------|----------|---------|
   | Generates utility classes | ✓ | ✗ |
   | Creates CSS variables | ✓ | ✓ |
   | Must be top-level | ✓ | ✗ |

   Put palette in `@theme`, semantic aliases in `:root`.

5. **`@theme inline` is REQUIRED for vars-referencing-vars.** Per Tailwind docs:
   > Without `inline`, this fails because `var(--font-inter)` is resolved where `--font-sans` is defined (the root), not where it's used.

   With `inline`, Tailwind inserts the variable reference directly into the utility CSS rule.

### Recommended Approach (prescriptive)

The exact `globals.css` structure (palette → `@theme inline` for fonts → `:root` semantic aliases → base styles) is in the TL;DR section above.

**Naming convention to produce expected utility classes:**

| Token in `@theme` | Utility class generated |
|-------------------|--------------------------|
| `--color-burgundy: #6B1F1F` | `bg-burgundy`, `text-burgundy`, `border-burgundy`, `ring-burgundy` |
| `--color-burgundy-dark: #4A1414` | `bg-burgundy-dark`, `text-burgundy-dark`, ... |
| `--color-terracotta: #B85450` | `bg-terracotta`, ... |
| `--color-coffee: #3A1F1A` | `bg-coffee`, ... |
| `--color-bone: #F5F1EA` | `bg-bone`, `text-bone`, ... |
| `--color-bone-dark: #EBE4D6` | `bg-bone-dark`, ... |
| `--color-espresso: #1A1410` | `bg-espresso`, `text-espresso`, ... |
| `--color-taupe: #8B7355` | `bg-taupe`, `text-taupe`, ... |
| `--font-sans: var(--font-be-vietnam-pro)` | `font-sans` → `font-family: var(--font-be-vietnam-pro)` |

This matches what Phase 2/3 components expect: `<button className="bg-burgundy text-bone hover:bg-burgundy-dark">`, `<body className="bg-bone text-espresso">`, etc.

### Gotchas

- **Old v3 syntax must be removed:** The current `globals.css` uses `@import "tailwindcss"` correctly (v4), but lines 3–16 declare a raw `:root` palette with v3-style names (`--red`, `--gray-900`, etc.) that DON'T generate utilities. Delete entirely; replace with `@theme` block above.
- **Don't put random vars in `@theme`** — only the reserved namespaces produce utilities. App-level semantic aliases like `--color-bg`, `--color-primary` belong in `:root`, NOT in `@theme` (putting them in `@theme` would produce `bg-bg` and `bg-primary` utilities, which is fine but locks the semantic name and prevents per-component override).
- **`font-display: 'swap'`** in Next.js font config is the **font loading strategy**. Don't confuse with Tailwind's `font-display` utility (which doesn't exist — Tailwind has `font-sans`/`font-serif`/`font-mono` but no `font-display`). We use `font-sans` for all Vietnamese text.
- **Dark mode hooks (deferred):** Re-defining the same CSS variable names inside a `.dark { }` or `@media (prefers-color-scheme: dark) { :root { … } }` selector will swap palette without renaming utilities. Architecture is dark-mode-future-proof; keep utility classes pointing to semantic vars where possible.

### Verification

After writing `globals.css`, verify utility generation:
```bash
npm run build
# Then grep the emitted CSS for bg-burgundy:
grep -r "bg-burgundy" out/_next/static/css/ 2>/dev/null || \
grep -r "bg-burgundy" .next/static/css/
# Should find at least one match if the utility is used in JSX,
# OR Tailwind may tree-shake it if no consumer exists yet.
```

For tree-shake-safe verification, add a temporary sentinel to `app/page.tsx` (Phase 1 may already have a "hello world" page):
```tsx
<div className="bg-burgundy text-bone p-4">
  Sanity check: burgundy on bone — should be visible.
</div>
```

---

## Focus Area 3: Static Export Config Completeness

### Findings

**Verified against [Next.js Static Exports guide v16.2.6 / 2026-05-19](https://nextjs.org/docs/app/guides/static-exports):**

**Required fields:**
- `output: 'export'` — switches build mode. Emits `/out/` with HTML/CSS/JS.

**Strongly recommended (project-specific):**
- `images: { unoptimized: true }` — required because `next/image` default loader needs a running optimizer (not available on Cloudflare Pages static). Without this, builds fail when `<Image>` is used.
- `trailingSlash: true` — emits `/du-an/index.html` directory structure instead of `/du-an.html` file. Static hosts (including Cloudflare Pages) handle this directory pattern natively; without trailing-slash trick, requests for `/du-an` may 404 unless host has fallback rewrites.

**Not needed for Cloudflare Pages root-domain deploy:**
- `basePath` — only needed for non-root deploys (e.g., `github.io/repo/`). Cloudflare Pages serves at root domain → omit. SUMMARY.md and ROADMAP.md confirm: "On Cloudflare Pages / Vercel, no basePath needed."
- `assetPrefix` — same reasoning; omit.
- `distDir` — defaults to `out` for static export; no need to change.

**`trailingSlash: true` vs `false` trade-offs:**

| `trailingSlash: true` (LOCKED) | `trailingSlash: false` |
|---|---|
| Emits `/du-an/index.html` | Emits `/du-an.html` |
| `/du-an` and `/du-an/` both resolve on directory-serving hosts | `/du-an` resolves; `/du-an/` may 404 |
| Aligns with Cloudflare Pages default | Requires custom Cloudflare Pages route rules |
| `<Link href="/du-an">` auto-appends `/` | `<Link>` strips trailing `/` |
| **Best for static export** | Better for SPA-like sites with active hosting layer |

**The roadmap and FND-01 lock `trailingSlash: true`** — verified compatible with Cloudflare Pages.

**Silently broken features under `output: 'export'`** (per official docs "Unsupported Features"):
- Server Actions
- Route Handlers (`route.ts`) with POST/PUT/DELETE (only GET works, returns static response)
- `cookies()` / `headers()` from `next/headers`
- Middleware (`middleware.ts` not executed)
- Dynamic routes without `generateStaticParams()`
- ISR / `revalidate` (ignored)
- Rewrites, redirects, headers config
- Draft Mode, Intercepting Routes
- Default `next/image` loader (must use `unoptimized: true` or custom loader)

**Critical:** Many of these don't produce loud build errors. Adding a Server Action later, in any phase, would silently break the production deploy. ESLint guardrail is the only practical detection mechanism.

### Recommended Approach

```ts
// next.config.ts — minimal, locked, no more, no less
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
}

export default nextConfig
```

**Detection / prevention of silent breaks:**

1. **CI must run `next build`, not just `next dev`.** Add to `package.json` script or CI workflow: builds will surface dynamic-rendering errors that dev hides.

2. **ESLint guardrail (recommended for this phase):** Add a custom rule or use `no-restricted-syntax` to ban:
   ```json
   {
     "rules": {
       "no-restricted-imports": ["error", {
         "paths": [
           { "name": "next/headers", "message": "next/headers (cookies, headers) is incompatible with output: 'export'." }
         ]
       }],
       "no-restricted-syntax": [
         "error",
         {
           "selector": "ExpressionStatement > Literal[value='use server']",
           "message": "Server Actions are incompatible with output: 'export'."
         }
       ]
     }
   }
   ```
   The exact ESLint rule syntax may need adjustment per `eslint-config-next` shape; mark as Claude's discretion to refine in the plan.

3. **Documentation in `next.config.ts` itself:** Add a top-of-file comment listing the unsupported features so future devs see it before adding code that would break the deploy.

### Gotchas

- The current `package.json` build script `"build": "next build"` is correct — no need to change.
- After `next build`, `/out/` is produced. The current `.gitignore` should ignore `/out/` and `/.next/` (verify in Phase 1; if missing, add).
- **`metadataBase` warning:** Without `metadataBase` in root `layout.tsx`, every build logs a warning and OG image URLs may fail to absolutize. The layout.tsx template above sets it from `siteUrl`. (Pitfall #15.)
- **Don't disable `output: 'export'` "just to test"** — divergence between dev (Node server) and prod (static) is the #1 source of silent breakage. Roadmap pitfall #1.

### Verification

Phase 1 exit gate:
```bash
# Clean build must succeed
rm -rf .next out
npm run build

# Verify /out/ structure exists
ls out/
# Expect at minimum: index.html, _next/, 404.html (Next default)

# Verify no "metadataBase" warning in build output
npm run build 2>&1 | grep -i "metadatabase" && echo "FAIL: warning present" || echo "OK"

# Verify trailingSlash behavior
ls out/du-an/index.html 2>/dev/null  # Will fail until /du-an route exists (Phase 4)
# For now, just verify index.html and 404.html exist
test -f out/index.html && echo "OK: index.html generated"
```

---

## Focus Area 4: `lib/site.ts` Shape

### Findings

**Single-source-of-truth requirements (from PITFALLS.md #7 + #10, REQUIREMENTS.md FND-05/06):**
- Phone displayed as `092 198 55 99`, used in `tel:` as `+84921985599` (E.164, no spaces).
- Zalo deep link MUST be `https://zalo.me/0921985599` (HTTPS) — never `zalo://`.
- Email plain text + `mailto:` link.
- MST displayed as `1102 107 064`, used in JSON-LD as `1102107064` (no spaces, per `taxID` schema).
- Address structured for `PostalAddress` JSON-LD (Phase 5).
- `siteUrl` resolves: `process.env.NEXT_PUBLIC_SITE_URL ?? 'https://khangthinhinv.vn'` — never hardcode.

**Why helpers, not just raw constants:**
- Phone-related helpers (`telHref()`) prevent typos at call sites where the bare number could lose its `+` or gain spaces.
- Same value used in 4+ places: metadata, footer, Contact section, JSON-LD, FloatingZalo. One typo creates inconsistent NAP — silently hurts local SEO (Pitfall #6).
- TypeScript `as const` on the `company` object freezes literal types so consumers get autocomplete.

**`process.env.NEXT_PUBLIC_*` resolution at build:**
- Next.js inlines `process.env.NEXT_PUBLIC_*` at build time per [Next.js env vars docs](https://nextjs.org/docs/app/api-reference/file-conventions/env-files#bundling-environment-variables-for-the-browser).
- Default fallback must use `??` (nullish coalescing), NOT `||`, so empty string in `.env.local` doesn't fall through to placeholder.
- `.env.local` is git-ignored by default — safe for local override.

### Recommended Shape

```ts
// src/lib/site.ts
// Single source of truth for company facts, domain, and CTA URLs.

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://khangthinhinv.vn'

export const company = {
  legalName: 'Công ty TNHH Khang Thịnh Investment',
  shortName: 'KHANG THỊNH INV',
  tagline: 'Hợp tác cùng phát triển',
  founded: 2025,

  phoneDisplay: '092 198 55 99',
  phoneE164: '+84921985599',
  phoneRaw: '0921985599',

  email: 'khangthinhinv2025@gmail.com',
  zaloUrl: 'https://zalo.me/0921985599',

  taxId: '1102107064',
  taxIdDisplay: '1102 107 064',
  legalRep: 'Tô Thị Bích Ngọc',

  address: {
    street: 'A3-02 KDC Long Phú',
    locality: 'xã Bến Lức',
    region: 'Tây Ninh',
    country: 'VN',
    full: 'A3-02 KDC Long Phú, xã Bến Lức, tỉnh Tây Ninh',
  },
} as const

export const telHref = (): string => `tel:${company.phoneE164}`
export const mailtoHref = (): string => `mailto:${company.email}`
export const zaloHref = (): string => company.zaloUrl

// Type export for downstream consumers (PostalAddress JSON-LD in Phase 5)
export type Company = typeof company
```

**Consumption pattern (illustrative; not built in Phase 1):**
```tsx
import { company, telHref, zaloHref, mailtoHref } from '@/lib/site'

<a href={telHref()}>Gọi {company.phoneDisplay}</a>
<a href={zaloHref()}>Chat Zalo</a>
<a href={mailtoHref()}>{company.email}</a>
```

### Gotchas

- **`||` vs `??`:** Use `??`. `process.env.NEXT_PUBLIC_SITE_URL || 'fallback'` would fall through if user sets `NEXT_PUBLIC_SITE_URL=""` (which they shouldn't, but is a real failure mode).
- **`new URL(siteUrl)` in metadataBase requires absolute URL with protocol.** The default `'https://khangthinhinv.vn'` includes protocol; if a user sets `NEXT_PUBLIC_SITE_URL=khangthinhinv.vn`, `new URL(...)` will throw. Document this in `.env.example` (recommend creating one in this phase).
- **No `process.env.NODE_ENV` branching needed** — the env var is the only switch. Production deploy sets `NEXT_PUBLIC_SITE_URL` to real domain; dev/local uses default.
- **`as const` is critical** for type safety — without it, `company.phoneE164` has type `string` (not the literal), breaking downstream type narrowing.
- **Don't add Zalo OA app ID, GBP place ID, etc. yet** — defer until Phase 5/6 needs them.

### Verification

```bash
# 1. Write a sentinel that logs siteUrl at build time
# In a Phase-1 temporary app/page.tsx:
import { siteUrl, company } from '@/lib/site'
console.log('[Phase 1 sanity]', { siteUrl, phone: company.phoneE164 })

# 2. Build with default env (no .env.local)
npm run build
# Expect: [Phase 1 sanity] { siteUrl: 'https://khangthinhinv.vn', ... }

# 3. Build with override
echo 'NEXT_PUBLIC_SITE_URL=https://test.example.com' > .env.local
npm run build
# Expect: [Phase 1 sanity] { siteUrl: 'https://test.example.com', ... }

# 4. Clean up
rm .env.local
```

---

## Project Constraints (from CLAUDE.md)

Sourced from `/Users/congphan/Workspace/my-projects/khang-thing-group/CLAUDE.md` (global) and `/Users/congphan/Workspace/my-projects/khang-thing-group/website/CLAUDE.md` (project):

- **Language:** Respond in Vietnamese to user; English for code/comments. RESEARCH.md itself is English (technical artifact for downstream planner) but user-facing text and copy is Vietnamese.
- **Style:** Concise, preserve existing patterns.
- **GSD workflow enforcement:** No direct edits outside a GSD command. Phase 1 work must run through `/gsd:execute-phase`.
- **Tech stack locked (verbatim):** Next.js 15 + React 19 + Tailwind 4 + TS 5.9 — not negotiable.
- **Deployment model locked:** Static export, no backend, no server actions.
- **Domain:** Placeholder `khangthinhinv.vn`; deploy target chosen later.
- **Legal:** No partner logos (Binh đoàn 12, Trường Sơn) — text only.
- **Content:** Logo extracted from PDF/Illustration.png; project photos not available — Phase 1 doesn't need them.
- **Anti-libraries (project-level):** No `framer-motion` (use `motion`), no `react-icons` (use `lucide-react`), no `next-sitemap` (use built-in), no `next-image-export-optimizer`, no GA4, no Google Fonts `<link>` (use `next/font/google`), no Bebas Neue on Vietnamese, no GitHub Pages, no JetBrains Mono.

The Phase 1 plan must not introduce any of these anti-libraries. None of them are needed for Phase 1 work anyway (`lucide-react` and `motion` arrive in Phase 2/3 respectively).

---

## Standard Stack (Phase 1 install scope)

### Core (already in `package.json` — verified)
| Library | Version | Purpose | Source |
|---------|---------|---------|--------|
| `next` | `^15.0.0` | App Router, static export | package.json line 12 |
| `react` | `^19.0.0` | UI | package.json line 13 |
| `react-dom` | `^19.0.0` | DOM rendering | package.json line 14 |
| `@tailwindcss/postcss` | `^4.0.0` | Tailwind v4 PostCSS plugin | package.json line 17 |
| `tailwindcss` | `^4.0.0` | Tailwind v4 | package.json line 22 |
| `typescript` | `^5.9.3` | Type safety | package.json line 23 |
| `postcss` | `^8.0.0` | PostCSS runtime | package.json line 21 |

### Phase 1 install scope
**Nothing.** Phase 1 uses only what's already in `package.json` plus the built-in `next/font/google` (ships with Next 15).

Defer:
- `lucide-react` → Phase 2 (Nav icons)
- `motion` → Phase 3 (only if Hero/BigStats animations actually needed)
- `@fontsource-*` → not used (next/font/google chosen)
- `clsx` → defer; YAGNI for Phase 1

**Version verification (Phase 1 plan should run before installing anything new):**
```bash
npm view next version          # expect 15.x (currently locked to ^15.0.0)
npm view tailwindcss version   # expect 4.x
```
Per Next.js docs URL `lastUpdated: 2026-05-19` retrieved during this research, Next.js current stable is 16.x with v15 still supported per the project lock. Project is on `^15.0.0`. No upgrade needed in Phase 1.

---

## Architecture Patterns (Phase 1 only)

### Pattern: Single-Source-of-Truth Constants
**What:** `lib/site.ts` exports a frozen `company` object + helper functions. Every consumer imports from there — no inline duplicates of phone/email/MST anywhere.

**Why:** Pitfall #6 (NAP drift kills local SEO) and #7 (broken `tel:` from inconsistent format) both prevented at compile time.

**Example:** See Focus Area 4 above.

### Pattern: Tailwind v4 `@theme` Tokens, Semantic Aliases in `:root`
**What:** Palette + font tokens in `@theme` (auto-generate utilities). Semantic aliases (`--color-bg`, `--color-primary`) in `:root` (CSS-variable consumption only, no utility class needed).

**Why:** Keeps utility namespace clean (no `bg-primary` collision with user expectation) AND keeps dark-mode swap trivial later (re-define semantic aliases in `.dark { }` block).

**Example:** See TL;DR `globals.css`.

### Pattern: Font CSS Variable + `@theme inline`
**What:** `next/font/google` sets `variable: '--font-be-vietnam-pro'` → applied as className on `<html>` → wired into Tailwind via `@theme inline { --font-sans: var(--font-be-vietnam-pro); }`.

**Why:** This is the official Next.js + Tailwind v4 pattern (verified in Next.js Font docs). `@theme inline` is required for vars-referencing-vars.

**Example:** See Focus Area 1 and TL;DR `layout.tsx` + `globals.css`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Self-host fonts manually | Custom `@font-face` declarations + woff2 files | `next/font/google` with `subsets: ['vietnamese', 'latin']` | Auto-handles preload, fallback metrics, build-time self-hosting, CSS variable wiring. |
| Phone number format helpers | String formatters | Just commit both formats as constants (`phoneDisplay`, `phoneE164`) | Two literals are clearer than one + a formatter. |
| Env var validation library | Manual `assert(process.env.X)` | `??` nullish coalescing with default | Two-line solution; `zod`/`envalid` overkill for 1 var. |
| Tailwind config file | `tailwind.config.ts` with `theme.extend.colors` | Tailwind v4 `@theme` in `globals.css` | Tailwind v4 removed the config-file requirement; CSS-first is the official pattern. |
| Tailwind class purge whitelist | `safelist` config | Use full class names statically in JSX (no `bg-${variant}` interpolation) | v4 scanner finds literal class strings. |
| PostCSS plugin chain | `autoprefixer` + `postcss-import` + ... | Just `@tailwindcss/postcss` | v4 handles autoprefixing and imports internally. |
| Build-time env var injection | Webpack `DefinePlugin` | `NEXT_PUBLIC_*` prefix | Next.js inlines automatically at build. |

**Key insight:** Phase 1 is a "config and constants" phase — its biggest risk is OVER-engineering. The right move is to use Next.js + Tailwind v4 defaults for everything and treat additions as exceptions to be justified.

---

## Common Pitfalls (Phase 1 scope)

### Pitfall 1: Silent feature breakage from `output: 'export'` (CRITICAL)
**What goes wrong:** Server Actions / Route Handlers / `cookies()` / middleware compile in dev but are stripped or fail in production.
**Why it happens:** `next dev` runs a Node server; `next build` with `output: 'export'` strips runtime features without loud errors.
**How to avoid:**
1. Pin `next.config.ts` with `output: 'export'` in this phase.
2. Run `next build` (not just `dev`) on every PR via CI.
3. Add ESLint guardrails (see Focus Area 3 above).
4. Document the unsupported list in `next.config.ts` comment.

**Warning signs:** Button "doesn't do anything" in production; `_next/data/*.json` 404s.

### Pitfall 2: Vietnamese diacritic fallback (CRITICAL — addressed by FND-04)
**What goes wrong:** Default `subsets: ['latin']` omits Vietnamese composite glyphs (`ờ`, `ợ`, `ữ`, `ẳ`) → mid-word fallback to Arial/system font with broken diacritic placement; visible CLS on font swap.
**Why it happens:** Most tutorials default to latin-only; devs test with English words and miss it.
**How to avoid:** `subsets: ['vietnamese', 'latin']` (vietnamese first for preload priority). Confirmed FND-04 mandates this. Drop Bebas Neue entirely (it has zero Vietnamese diacritic coverage).

**Warning signs:** "KHANG THỊNH" renders but inner diacritics look detached on Windows Chrome.

### Pitfall 3: Tailwind v4 `@theme` namespace mistakes (CRITICAL — addressed by FND-03)
**What goes wrong:** `--primary: #6B1F1F` doesn't generate `bg-primary` (wrong namespace).
**Why it happens:** v4 requires the `--color-*` / `--font-*` / `--spacing-*` namespace prefixes.
**How to avoid:** Always use namespaced names (`--color-burgundy`, not `--burgundy`). Document the namespace rules at the top of `@theme {}`.

**Warning signs:** `bg-burgundy` produces no visible style; Tailwind IntelliSense doesn't autocomplete.

### Pitfall 4: `metadataBase` warning
**What goes wrong:** Without `metadataBase` in root layout, every `next build` logs a warning and OG image URLs may fail to absolutize.
**How to avoid:** Set `metadataBase: new URL(siteUrl)` in `app/layout.tsx` (template above).

### Pitfall 5: Placeholder domain leaking into production
**What goes wrong:** `khangthinhinv.vn` hardcoded in metadata / sitemap → submitted to GSC under wrong domain.
**How to avoid:** All domain references flow through `siteUrl` from `lib/site.ts` (which reads `NEXT_PUBLIC_SITE_URL`). Never hardcode the literal.

### Pitfall 6: Build fails if old skeleton imports linger after FND-07 deletion
**What goes wrong:** Deleting `src/components/Header.tsx` while `app/layout.tsx` still imports it → TS error.
**How to avoid:** Sequence FND-07 carefully: (1) remove imports from `layout.tsx`/`page.tsx`; (2) verify build; (3) delete the orphan folders; (4) verify build again.

### Pitfall 7: Current `layout.tsx` has DM Sans / DM Serif Display via `<link>` — must be removed
**What goes wrong:** Current `src/app/layout.tsx` lines 14–20 inject Google Fonts via `<link>` for DM Sans + DM Serif Display. Phase 1 replaces this with `next/font/google` for Be Vietnam Pro. If `<link>` lines are left in by accident, they create a runtime network request (Pitfall: Google Fonts via `<link>`) and conflict with the new font wiring.
**How to avoid:** Rewrite `layout.tsx` from scratch (template in TL;DR) — don't try to patch in place.

---

## Code Examples

All concrete code examples are in the TL;DR section above. Repeated here for direct reference:

### `next.config.ts`
```ts
// Source: https://nextjs.org/docs/app/guides/static-exports (verified 2026-05-26)
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
}

export default nextConfig
```

### `postcss.config.mjs`
```js
// Source: https://tailwindcss.com/docs/installation/framework-guides/nextjs
export default { plugins: { '@tailwindcss/postcss': {} } }
```

### `app/layout.tsx` (font + metadata wiring)
```tsx
// Source: https://nextjs.org/docs/app/api-reference/components/font#with-tailwind-css
// Verified 2026-05-26 against Next.js 16.2.6 docs (applies to v15 identically)
import type { Metadata, Viewport } from 'next'
import { Be_Vietnam_Pro } from 'next/font/google'
import { siteUrl } from '@/lib/site'
import './globals.css'

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-be-vietnam-pro',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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

### `app/globals.css`
```css
/* Source: https://tailwindcss.com/docs/theme (verified 2026-05-26) */
@import "tailwindcss";

@theme {
  --color-burgundy: #6B1F1F;
  --color-burgundy-dark: #4A1414;
  --color-terracotta: #B85450;
  --color-coffee: #3A1F1A;
  --color-bone: #F5F1EA;
  --color-bone-dark: #EBE4D6;
  --color-espresso: #1A1410;
  --color-taupe: #8B7355;
}

@theme inline {
  --font-sans: var(--font-be-vietnam-pro);
}

:root {
  --color-bg: var(--color-bone);
  --color-bg-alt: var(--color-bone-dark);
  --color-fg: var(--color-espresso);
  --color-fg-muted: var(--color-taupe);
  --color-primary: var(--color-burgundy);
  --color-primary-hover: var(--color-burgundy-dark);
  --color-accent: var(--color-terracotta);
}

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

### `lib/site.ts`
```ts
// Single source of truth — see Focus Area 4 for rationale
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://khangthinhinv.vn'

export const company = {
  legalName: 'Công ty TNHH Khang Thịnh Investment',
  shortName: 'KHANG THỊNH INV',
  tagline: 'Hợp tác cùng phát triển',
  founded: 2025,
  phoneDisplay: '092 198 55 99',
  phoneE164: '+84921985599',
  phoneRaw: '0921985599',
  email: 'khangthinhinv2025@gmail.com',
  zaloUrl: 'https://zalo.me/0921985599',
  taxId: '1102107064',
  taxIdDisplay: '1102 107 064',
  legalRep: 'Tô Thị Bích Ngọc',
  address: {
    street: 'A3-02 KDC Long Phú',
    locality: 'xã Bến Lức',
    region: 'Tây Ninh',
    country: 'VN',
    full: 'A3-02 KDC Long Phú, xã Bến Lức, tỉnh Tây Ninh',
  },
} as const

export const telHref = (): string => `tel:${company.phoneE164}`
export const mailtoHref = (): string => `mailto:${company.email}`
export const zaloHref = (): string => company.zaloUrl

export type Company = typeof company
```

### `.env.example` (recommend creating in this phase)
```bash
# Production site URL — must include protocol. Used in metadata, sitemap, robots, JSON-LD.
NEXT_PUBLIC_SITE_URL=https://khangthinhinv.vn
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `tailwind.config.ts` with `theme.extend.colors` | Tailwind v4 `@theme` in CSS | Tailwind v4 (Jan 2025) | No JS config; tokens live where styles live. |
| `@tailwind base; @tailwind components; @tailwind utilities;` | `@import "tailwindcss";` | Tailwind v4 | Single import line. |
| `<link href="fonts.googleapis.com">` in `<head>` | `next/font/google` self-hosted at build | Next.js 13 | No runtime third-party request, no CLS from late font load. |
| `framer-motion` package | `motion` package (import from `motion/react`) | Motion rebrand 2024 | New installs should use `motion`; framer-motion is deprecated alias. |
| `next export` CLI | `output: 'export'` in `next.config.ts` | Next.js 14 (Nov 2023) | Config-driven instead of separate command. |

**Deprecated/outdated:**
- `next export` CLI command — removed in Next 14. Don't reference in any plan.
- v3 Tailwind utility-class generation via `tailwind.config.js theme.extend` — superseded by `@theme`.
- `@next/font` import path — renamed to `next/font` in Next 13.2. Use `next/font/google` and `next/font/local`.

---

## Open Questions

1. **ESLint guardrail scope in Phase 1?**
   - What we know: Pitfall #1 is real; banning `"use server"` / `cookies()` / `headers()` imports is a documented best practice (PROJECT.md key decisions; SUMMARY.md "What to Lock Now"; ROADMAP.md Pre-Phase-1 Lock Checklist).
   - What's unclear: Exact ESLint rule syntax — `eslint-config-next` extends from `next/core-web-vitals` which may not expose `no-restricted-syntax` out of the box. May require adding `eslint` plugin or custom config.
   - Recommendation: Plan should include the guardrail as a task with a small spike (5–10 min) inside the task itself if syntax verification needed. If it's painful, downgrade to a `npm run check:static-export` script that greps for forbidden patterns.

2. **`.gitignore` audit?**
   - What we know: `/out/` and `/.next/` should be ignored; `.env.local` should be ignored.
   - What's unclear: Whether the current `.gitignore` already covers these (file not read in this research).
   - Recommendation: Plan should include a `.gitignore` verification task — small and mechanical.

3. **Sentinel "hello world" page strategy?**
   - What we know: Roadmap success criterion 4 requires "Changing `NEXT_PUBLIC_SITE_URL` in `.env.local` propagates to a sample `console.log(siteUrl)`" — strong hint that Phase 1 needs a temporary sentinel.
   - What's unclear: Whether the sentinel lives in `app/page.tsx` (must be cleaned up in Phase 3 when real Hero arrives) or in a build-time log (cleaner but less observable).
   - Recommendation: Plan should choose ONE: either a minimal `app/page.tsx` with `<p>{siteUrl}</p>` that gets entirely replaced in Phase 3, OR a `console.log` in `layout.tsx` that gets removed at Phase 1 exit. Either is fine.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | All Next.js commands | ✓ (assumed — npm scripts in package.json) | ≥18.18 needed for Next 15; assume present | — |
| npm / pnpm / yarn | Install + build | ✓ (assumed — package.json present, `npm run` scripts defined) | any current | — |
| Internet access to `fonts.gstatic.com` at build time | `next/font/google` first build (cached after) | Assumed ✓ | — | `@fontsource-variable/be-vietnam-pro` if Google Fonts unreachable in CI |
| Git | Commit hygiene | Assumed ✓ | — | — |
| Cloudflare Pages account | Phase 6 deploy — NOT Phase 1 | Out of scope this phase | — | — |

**Missing dependencies with no fallback:** None at Phase 1.
**Missing dependencies with fallback:** None confirmed missing.

Phase 1 is pure code/config — no new runtime dependencies, no external services hit at build (after first font fetch). Treat the audit as PASS unless the planner discovers something during execution.

---

## Validation Architecture

> `.planning/config.json` not present at the time of research. Defaulting to **enabled** per the standard (Nyquist validation is on unless explicitly disabled). If the project config later sets `workflow.nyquist_validation: false`, this section can be ignored.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None installed yet — Phase 1 has no automated test framework. Validation is via `npm run build` + `tsc --noEmit` + manual sanity. |
| Config file | `tsconfig.json` (TypeScript), `package.json` scripts |
| Quick run command | `npm run build` (build serves as both type-check + bundle check) |
| Full suite command | `npm run build && npx tsc --noEmit && npx next lint` |
| Phase gate command | `rm -rf .next out && npm run build && test -f out/index.html` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FND-01 | `next.config.ts` configured for static export | build | `npm run build && test -d out` | ❌ Wave 0 — `next.config.ts` not yet present |
| FND-02 | TypeScript strict + build clean | type-check + build | `npx tsc --noEmit && npm run build` | ✓ tsconfig.json exists; `strict` must be verified |
| FND-03 | Tailwind v4 `@theme` Burgundy/Bone tokens render | manual visual + grep | After build: temporarily insert `<div className="bg-burgundy text-bone">`, run `npm run dev`, verify color renders. Then `grep -r "bg-burgundy" .next/static/css/` should match. | ❌ Wave 0 — globals.css needs rewrite |
| FND-04 | Be Vietnam Pro Vietnamese diacritics render correctly | manual visual | After build: insert sentinel `<p className="font-sans font-black">KHANG THỊNH ĐỘI TÀU 3,900 TẤN — Cao tốc Cái Nước-Đất Mũi</p>`, run dev server, visually inspect diacritics on all weights 400/500/600/700/800/900. | ❌ Wave 0 — layout.tsx + globals.css need rewrite |
| FND-05 | `NEXT_PUBLIC_SITE_URL` propagates from `.env.local` | build-time sentinel | Build twice: once with no `.env.local` (expect default), once with `NEXT_PUBLIC_SITE_URL=https://test.example.com` (expect override). Verify via `console.log` in layout or visible `<p>{siteUrl}</p>` sentinel. | ❌ Wave 0 — `lib/site.ts` and `.env.example` need creating |
| FND-06 | Company facts importable from `lib/site.ts` | type-check + manual | `npx tsc --noEmit` passes; manually import in a sentinel: `import { company } from '@/lib/site'`. | ❌ Wave 0 — `lib/site.ts` does not exist |
| FND-07 | Skeleton folders removed; build still passes | build | After deletion: `npm run build && test ! -d src/app/dich-vu && test ! -d src/app/lien-he && test ! -f src/components/Header.tsx`. | n/a — verification happens after the delete task |

### Sampling Rate
- **Per task commit:** `npm run build` (must succeed). If task touches TS only, `npx tsc --noEmit` may be sufficient as a quick check, but build is the safety net under `output: 'export'`.
- **Per wave merge:** `npm run build && npx tsc --noEmit && npx next lint`.
- **Phase gate (before `/gsd:verify-work`):** Clean rebuild + visual diacritic check + env-var override check (commands in Verification subsections above).

### Wave 0 Gaps
- [ ] **No automated test framework installed.** Phase 1 doesn't need one — `next build` + `tsc` cover the type/bundle surface, and the requirements are visual/static. **Recommendation:** Do not install a test framework in Phase 1. If a later phase needs unit tests (e.g., a complex component in Phase 3), add Vitest at that point.
- [ ] **No sentinel page exists.** Need to create a temporary `app/page.tsx` (or keep an existing minimal one) that exercises `lib/site.ts` import + a Burgundy/Bone Tailwind utility + a Vietnamese diacritic test string. Mark this for cleanup before Phase 3.
- [ ] **No `.env.example` file.** Need to add to document `NEXT_PUBLIC_SITE_URL` contract.
- [ ] **No ESLint guardrail rule.** Pre-Phase-1 Lock Checklist requires this; planner decides whether Phase 1 or deferred.

---

## Sources

### Primary (HIGH confidence)
- [Next.js Font Module API (v16.2.6 / lastUpdated 2026-05-19)](https://nextjs.org/docs/app/api-reference/components/font) — confirms `subsets`, `weight` array requirement for non-variable fonts, `variable` CSS-variable export, Tailwind v4 `@theme inline` integration, `display: 'swap'` semantics.
- [Next.js Static Exports guide (v16.2.6 / lastUpdated 2026-05-19)](https://nextjs.org/docs/app/guides/static-exports) — confirms `output: 'export'`, `trailingSlash`, supported/unsupported features list.
- [Tailwind CSS v4 Theme docs](https://tailwindcss.com/docs/theme) — confirms `@theme` directive syntax, namespace rules, `@theme inline` mechanics, palette → utility class generation.
- Project planning artifacts (HIGH — these ARE the locked decisions):
  - `/Users/congphan/Workspace/my-projects/khang-thing-group/website/.planning/PROJECT.md`
  - `/Users/congphan/Workspace/my-projects/khang-thing-group/website/.planning/REQUIREMENTS.md`
  - `/Users/congphan/Workspace/my-projects/khang-thing-group/website/.planning/ROADMAP.md`
  - `/Users/congphan/Workspace/my-projects/khang-thing-group/website/.planning/research/SUMMARY.md`
  - `/Users/congphan/Workspace/my-projects/khang-thing-group/website/.planning/research/STACK.md`
  - `/Users/congphan/Workspace/my-projects/khang-thing-group/website/.planning/research/ARCHITECTURE.md`
  - `/Users/congphan/Workspace/my-projects/khang-thing-group/website/.planning/research/PITFALLS.md`
  - `/Users/congphan/Workspace/my-projects/khang-thing-group/website/docs/superpowers/specs/2026-05-26-khangthinh-theme-migration-design.md`

### Secondary (MEDIUM confidence)
- Be Vietnam Pro Vietnamese-subset support: cross-referenced in SUMMARY.md, STACK.md, ARCHITECTURE.md against Google Fonts metadata.
- Zalo deep link `https://zalo.me/{phone}` HTTPS pattern: PITFALLS.md cites Zalo Developers community thread.

### Tertiary (LOW confidence — flagged for plan-time verification if used)
- None applicable to Phase 1. All claims in this RESEARCH.md are sourced from HIGH or MEDIUM tier.

---

## Metadata

**Confidence breakdown:**
- Standard stack: **HIGH** — verified against current Next.js / Tailwind v4 official docs.
- Architecture (Phase 1 scope): **HIGH** — only 4 files touched (`next.config.ts`, `layout.tsx`, `globals.css`, `lib/site.ts`); patterns verified directly.
- Pitfalls: **HIGH** — pitfalls #1, #3, #4, #15 all addressed by Phase 1 requirements; mitigations sourced from PITFALLS.md which cites official docs and GitHub issues.
- `next/font/google` Vietnamese subset (Focus Area 1): **HIGH** — directly verified in Next.js Font API docs.
- Tailwind v4 `@theme inline` (Focus Area 2): **HIGH** — directly verified in Tailwind v4 theme docs.
- Static export config (Focus Area 3): **HIGH** — directly verified in Next.js Static Exports guide.
- `lib/site.ts` shape (Focus Area 4): **HIGH** — derived from CTA conventions locked in PITFALLS.md + REQUIREMENTS.md.

**Research date:** 2026-05-26
**Valid until:** 2026-06-25 (30 days — stack is mature, Next.js 15 stable, Tailwind v4 stable; revisit only if major framework versions bump or if Be Vietnam Pro's npm binding changes).
