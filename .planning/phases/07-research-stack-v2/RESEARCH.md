# Phase 07 — Stack Research v2.0

**Date:** 2026-05-30
**Goal:** Lock library versions + integration patterns before building 12 phases.

## Environment baseline (verified via npm + node_modules)

| Package | Installed | Notes |
|---------|-----------|-------|
| next | **15.5.18** | Keep on 15.x (stable). NOT upgrading to 16.x mid-project. |
| react | 19.2.6 | |
| react-dom | 19.2.x | |
| tailwindcss | 4.x | @theme directive in globals.css |
| typescript | 5.9.3 | strict |
| @vercel/analytics | 2.0.1 | already installed, just needs wiring |
| lucide-react | 1.16.0 | |

## CRITICAL render-mode decision

**v1.0 was `output: 'export'` (static). v2.0 switches to Vercel SSR.** (User approved 2026-05-30.)

`next.config.ts` changes in Phase 08:
- REMOVE `output: 'export'`
- REMOVE `images.unoptimized: true` (enable optimization)
- KEEP `trailingSlash: true` (consistency with existing URLs + sitemap)
- ADD MDX config (`createMDX`)
- ADD next-intl plugin wrapper

This unlocks `middleware.ts`, `app/api/*/route.ts` (POST), `next/image` optimization, ISR.

## Locked versions for v2.0

| Package | Version to install | Purpose | Peer-checked |
|---------|-------------------|---------|--------------|
| `motion` | `^12.40.0` | Animations | react ^19 ✓ — import from `motion/react` |
| `next-intl` | `^4.13.0` | i18n | next ^16/^15 ✓, react ^19 ✓ — v4 (NOT v3, v4 is current) |
| `next-themes` | `^0.4.6` | Dark mode | react 19 ✓ |
| `react-hook-form` | `^7.76.1` | Form state | |
| `zod` | `^4.4.3` | Form schema validation | NOTE: zod v4 — `z.string().email()` deprecated → use `z.email()` |
| `@hookform/resolvers` | `^5.4.0` | RHF + Zod bridge | works with zod 4 |
| `resend` | `^6.12.4` | Email send from API route | needs `RESEND_API_KEY` env |
| `@next/mdx` | `15.5.18` (backport tag) | MDX pages | matches next 15.5.18 exactly — pin EXACT, not ^ |
| `@mdx-js/loader` | `^3.1.1` | MDX webpack loader | peer of @next/mdx |
| `@mdx-js/react` | `^3.1.1` | MDX React provider | peer of @next/mdx |
| `gray-matter` | `^4.0.3` | Frontmatter parse | for blog list metadata |
| `reading-time` | `^1.5.0` | Reading time calc | |
| `rehype-slug` | latest | Heading anchors | blog TOC |
| `rehype-autolink-headings` | latest | Anchor links | blog TOC |
| `remark-gfm` | latest | GitHub-flavored MD | tables, strikethrough |
| `pagefind` | `^1.5.2` | Static search | devDep — runs post-build |

### Maybe / deferred

| Package | Decision |
|---------|----------|
| `@formkit/auto-animate` | Defer — Motion `layout` prop covers list animations |
| `nodemailer` | Skip — using Resend (simpler, better deliverability) |

## Integration patterns + pitfalls

### 1. Motion v12 (`motion/react`)

- **Import path:** `import { motion } from 'motion/react'` (NOT `framer-motion`)
- **RSC:** Animated components MUST be `"use client"`. Keep them in `src/components/animations/` as small client wrappers.
- **Pattern:** Create reusable primitives so pages stay server components where possible:
  - `<Reveal>` — `whileInView={{opacity:1, y:0}}` `initial={{opacity:0, y:24}}` `viewport={{once:true, margin:'-80px'}}`
  - `<CountUp>` — `useInView` + `animate()` on a motion value
  - `<Parallax>` — `useScroll` + `useTransform` on `y`
  - `<MagneticButton>` — pointer-move → `useSpring`
- **Reduced motion:** wrap with `useReducedMotion()` — return static variant. Satisfies ANIM-10 / NFR-A11Y-04.
- **Marquee:** prefer CSS `@keyframes` for the partners marquee (cheaper than JS); Motion only where interactivity needed.

### 2. next-intl v4 (SSR + middleware)

- **v4 NOT v3** — v4 is current major. API: `src/i18n/routing.ts` + `src/i18n/request.ts` + `middleware.ts`.
- **Routing:** `defineRouting({ locales: ['vi','en'], defaultLocale: 'vi', localePrefix: 'as-needed' })` — `as-needed` keeps `/` for VI (no `/vi` prefix) and `/en/...` for English. Preserves existing VI URLs → no broken links, no redirect churn for SEO.
- **Middleware:** `src/middleware.ts` exports `createMiddleware(routing)`. Matcher excludes `/api`, `/_next`, static files.
- **Structure:** `src/app/[locale]/layout.tsx` + `src/app/[locale]/page.tsx`. Existing `src/app/page.tsx` content moves under `[locale]`.
- **Messages:** `src/messages/vi.json` + `en.json`. Access via `useTranslations()` (client) / `getTranslations()` (server).
- **Pitfall:** With `localePrefix: 'as-needed'`, the root `app/layout.tsx` still needs `<html lang>` — set lang from locale in `[locale]/layout.tsx`.
- **Pitfall:** `setRequestLocale(locale)` needed in every page for static rendering optimization.

### 3. next-themes (dark mode)

- `<ThemeProvider attribute="class" defaultTheme="system" enableSystem>` in root layout, `"use client"`.
- Tailwind 4 dark: variant — add `@variant dark (&:where(.dark, .dark *));` in globals.css (Tailwind v4 syntax, NOT `darkMode: 'class'` config).
- **Pitfall:** `suppressHydrationWarning` on `<html>` to avoid theme flash mismatch.
- Dark palette: define dark token overrides under `.dark { --color-bg: ...; }`.

### 4. Form: API route + Resend (NO Cloudflare Worker)

- `src/app/api/quote/route.ts` — `export async function POST(req)`. Works now that SSR is on.
- Validate server-side with same Zod schema (share `src/lib/schemas/quote.ts`).
- Honeypot field check (FORM-04). Rate limit: simple in-memory LRU by IP for soft protection (FORM-05) — note: serverless = per-instance, acceptable for low volume; can upgrade to Upstash Redis later if spam.
- Resend: `await resend.emails.send({ from, to: 'khangthinhinv2025@gmail.com', subject, html })`. Needs `RESEND_API_KEY` in Vercel env + a verified sender domain (or use `onboarding@resend.dev` for testing).
- **Env needed (user action later):** `RESEND_API_KEY`. Until set, route returns graceful error → UI shows fallback (call/Zalo). Document in README.

### 5. MDX blog (@next/mdx 15.5.18 + gray-matter)

- Pin `@next/mdx@15.5.18` EXACT (backport tag matches our next).
- `createMDX` wraps next.config. `pageExtensions: ['ts','tsx','md','mdx']`.
- Two content approaches considered:
  - (A) MDX as routes (`app/tin-tuc/[slug]/page.mdx`) — simple but mixes content with routing
  - (B) **CHOSEN:** content files in `src/content/blog/*.mdx`, compiled via `next-mdx-remote` style OR direct import map. For SSR + static params, read files at build with gray-matter for list, dynamic import MDX for detail.
- `reading-time` on raw content for each post.
- rehype-slug + rehype-autolink-headings + remark-gfm in MDX options.

### 6. Pagefind (static search)

- devDependency. Runs AFTER build: `pagefind --site .next/...` — actually for Vercel SSR, index the built HTML. Add postbuild script.
- **Pitfall with SSR:** Pagefind indexes static HTML output. With SSR/ISR, run pagefind against the build output dir or a crawl. Simpler: keep blog + main pages statically rendered (they are — no dynamic data) so pagefind can index `.next/server/app`. May need a small crawl step. DEFER details to Phase 17 — low priority (P3).

### 7. Vercel Analytics

- Already installed `@vercel/analytics@2.0.1`. Add `<Analytics/>` from `@vercel/analytics/next` (or `/react`) to root layout. SpeedInsights optional (`@vercel/speed-insights`).

## Bundle size budget

| Lib | Approx gzipped | Mitigation |
|-----|---------------|------------|
| motion | ~34KB (tree-shaken, motion/react) | Client-only, code-split per animated component |
| next-intl | ~10KB | Server-heavy, small client runtime |
| next-themes | ~2KB | tiny |
| react-hook-form | ~9KB | only on /lien-he |
| zod | ~12KB | shared client+server schema; only where forms used |
| MDX runtime | ~5KB + content | only on blog routes |

Target NFR-PERF-05 (first-load < 200KB) achievable because heavy libs are route-scoped, not global. Motion is the main global cost if used in nav/layout — keep nav animations CSS where possible.

## Phase 08 install command (for executor)

```bash
npm i motion@^12.40.0 next-intl@^4.13.0 next-themes@^0.4.6 \
  react-hook-form@^7.76.1 zod@^4.4.3 @hookform/resolvers@^5.4.0 \
  resend@^6.12.4 gray-matter@^4.0.3 reading-time@^1.5.0 \
  @next/mdx@15.5.18 @mdx-js/loader@^3.1.1 @mdx-js/react@^3.1.1 \
  rehype-slug rehype-autolink-headings remark-gfm
npm i -D pagefind
```

(Install incrementally per phase to keep failures isolated — Phase 08 installs core: motion, next-intl, next-themes. Phase 14 adds form libs. Phase 15 adds MDX. Phase 17 adds pagefind.)

## Open items needing user input (non-blocking — graceful fallback built)

1. **RESEND_API_KEY** — user sets in Vercel env when ready. Until then, form shows "gọi/Zalo" fallback.
2. **Custom domain** — still placeholder `khangthinhinv.vn`.
3. **Real images** — placeholder gradient/texture system until provided.
4. **Resend verified sender domain** — or use test sender initially.

## Verdict

Stack locked. No blockers. Proceed to Phase 08 (architecture refactor: remove export, add SSR config, nav, dark, anim primitives, i18n scaffold).
