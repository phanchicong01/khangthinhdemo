# Stack Research

**Domain:** Vietnamese corporate marketing landing page (B2B construction / materials / logistics)
**Researched:** 2026-05-26
**Confidence:** HIGH (core decisions verified against official docs and current npm/changelog data; deployment trade-offs MEDIUM)

> Context: Greenfield single-page landing + `/du-an` list for Khang Thịnh Investment. Locked stack already chosen by user — Next.js 15 (App Router) + React 19 + Tailwind v4 + TypeScript 5.9 + `output: 'export'`. This file recommends the **supporting** stack around that base (animations, icons, SEO, fonts, images, analytics, deploy target) so the roadmap can lock them in early.

---

## Recommended Stack

### Core Technologies (locked — not negotiable in this project)

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js | `^15.0.0` (current 15.x) | App Router framework, static export | Already chosen. Built-in `sitemap.ts`, `robots.ts`, metadata API, image conventions reduce dep surface. App Router + RSC fits a content-only marketing site. |
| React | `^19.0.0` | UI | Locked. Note: Motion / lucide-react / @fontsource all confirmed React 19 compatible. |
| Tailwind CSS | `^4.0.0` | Styling | Locked. `@theme` directive lets Burgundy/Bone palette live in `globals.css` without `tailwind.config.ts`. |
| TypeScript | `^5.9.3` | Type safety | Locked. Use `"strict": true` per project requirement. |

### Supporting Libraries (the actual research recommendation)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **`motion`** | `^12.39.0` | Subtle scroll/hover animations (Hero reveal, stats count-in, marquee, card lifts) | Hero entrance + `useInView` reveals on Services/Projects/BigStats. Replaces deprecated `framer-motion` package. Import from `motion/react`. |
| **`lucide-react`** | `^1.16.0` | UI icons (phone, mail, zalo placeholder, chevrons, anchor, ship, truck, hammer) | Per-icon tree-shakeable (~1KB each). Strong "industrial" line aesthetic that fits Burgundy/Bone theme. |
| **`@fontsource-variable/be-vietnam-pro`** | `^5.x` (latest) | Body font with full Vietnamese diacritics | Self-host via `next/font/local`-style approach; avoids Google Fonts runtime dependency on static export. See **Font Strategy** below. |
| **`@fontsource/bebas-neue`** | `^5.x` (latest) | Display font (Hero headline, BigStats numbers) | Bebas Neue has **no Vietnamese diacritics** — use ONLY for English/numbers/short uppercase Vietnamese without dấu, fall back to Be Vietnam Pro for diacritical headings. See **Font Strategy**. |
| **`clsx`** *(optional)* | `^2.x` | Conditional Tailwind classnames | Only if conditional class logic gets unwieldy. Otherwise inline template strings are fine for a small site. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| **Next.js built-in `sitemap.ts`** | Sitemap generation | App Router native — export `MetadataRoute.Sitemap`. Strictly better than `next-sitemap` for 2-page site. |
| **Next.js built-in `robots.ts`** | robots.txt | Same pattern as sitemap. No third-party needed. |
| **Next.js `opengraph-image.tsx`** | Static OG image | Use `ImageResponse` at build time (no runtime needed for static export — see **Caveats** below). Or commit a static PNG to `/public/og-image.png` (simpler, recommended for phase 1). |
| **`@vercel/og`** *(only if using ImageResponse)* | OG image generation runtime | Bundled with Next 15. Works at **build time** under `output: 'export'`. Skip entirely if going with static PNG. |
| **ESLint + `eslint-config-next`** | Linting | Ships with Next 15. Project already includes `next lint`. |
| **TypeScript `tsc --noEmit`** | Type check gate | Already mentioned in design spec testing section. |

---

## Installation

```bash
# Animations
npm install motion

# Icons
npm install lucide-react

# Fonts (self-hosted, no runtime Google Fonts)
npm install @fontsource-variable/be-vietnam-pro @fontsource/bebas-neue

# Optional helper
npm install clsx
```

No new devDependencies needed — TS, ESLint, Tailwind toolchain are already in `package.json`.

---

## Decision Deep-Dives

### 1. Animation library — `motion` (the rebranded Framer Motion)

**Choice:** `motion` v12.x, import from `motion/react`.
**Confidence:** HIGH (verified npm, motion.dev official docs, May 2026 release 12.39.0).

**Why:**
- "Framer Motion" was renamed to "Motion" in 2024 — `motion` is the actively developed package, `framer-motion` is the legacy alias. New projects in 2026 should install `motion`.
- Hybrid engine (Web Animations API + JS fallback) → 120fps for the kinds of effects this site needs (fade-up reveals, marquee, hover lifts).
- Full React 19 / RSC compatibility confirmed; declarative `<motion.div>` API plays nicely with App Router (use `"use client"` only on animated components).
- ~30M monthly downloads; trusted by Framer + Figma — de-facto standard.

**What to actually use it for here:**
- Hero headline fade-in + stagger on subline + CTA buttons
- `whileInView` reveals on Services/Projects/Capabilities/BigStats cards (subtle, once)
- BigStats number count-up (or use CSS + Intersection Observer; Motion is overkill if only used once)
- Partners marquee (CSS `animation: marquee` is actually simpler — see "What NOT to Use")
- Card `whileHover={{ y: -4 }}` micro-interactions

**Don't:** Use Motion for the partners scroll marquee — pure CSS keyframes are 0 KB and visually identical.

### 2. Icon library — `lucide-react`

**Choice:** `lucide-react` v1.16.x.
**Confidence:** HIGH (verified npm May 2026, lucide.dev official).

**Why:**
- Per-icon ESM imports → only icons you use ship (~1KB/icon). At ~10 icons for this site, total icon weight will be under 15KB gzipped.
- 1,500+ icons including all needed for this domain: `Phone`, `Mail`, `MessageCircle` (Zalo proxy), `Truck`, `Ship`, `Hammer`, `HardHat`, `MapPin`, `ArrowRight`, `ChevronDown`, `Menu`, `X`.
- Clean line aesthetic at 1.5–2px stroke width matches the industrial Burgundy/Bone palette better than the heavier Heroicons solid set.
- Active maintenance; works out-of-the-box with Next 15 + Turbopack tree-shaking.

**Anti-recommendations:**
- ❌ `react-icons` — barrel imports historically defeat tree-shaking unless using `react-icons/lu` deep imports. More fragile than just using `lucide-react` directly.
- ❌ `@heroicons/react` — fewer icons (≈300), and there's no specific Zalo/MessageCircle equivalent. Fine for Tailwind UI ports, but lucide is broader.
- ❌ Icon font sets (Font Awesome, Material Icons CDN) — defeats tree-shaking, adds a network request, and CDN dependency is bad for `output: 'export'` deployed to GitHub Pages.

### 3. Font strategy — self-hosted via `@fontsource`

**Choice:** Self-host Be Vietnam Pro + Bebas Neue with `@fontsource-variable/be-vietnam-pro` and `@fontsource/bebas-neue`. Load with `next/font/local` pattern OR direct CSS import in `globals.css`.
**Confidence:** HIGH (verified fontsource npm, Be Vietnam Pro full Vietnamese subset confirmed via Google Fonts metadata).

**Why self-host over `next/font/google`:**
- `next/font/google` does fetch and inline fonts at build time — it works with static export — BUT it requires network access during `next build`. In Vietnamese dev environments / CI behind firewalls / corporate proxies that can fail unpredictably.
- `@fontsource` packages bundle the WOFF2 + Vietnamese subset into `node_modules` → fully offline-buildable, deterministic, and 100% compatible with `output: 'export'`.
- Variable font version of Be Vietnam Pro (`@fontsource-variable/be-vietnam-pro`) ships one file covering all weights 100–900 → smaller than loading 4–5 static weight files.

**Critical Vietnamese caveat — Bebas Neue:**

Bebas Neue has **NO Vietnamese diacritics support** (no ấ ầ ậ ẫ ằ ắ ặ ẵ ễ ế ề ệ ể ố ồ ộ ỗ ơ ớ ờ ợ ỡ ư ứ ừ ự ữ đ Đ). If you render "KHANG THỊNH" or "ĐỘI TÀU" in Bebas Neue, characters will fall back mid-word and look broken.

**Three options, in order of preference:**

1. **(Recommended) Use Be Vietnam Pro Bold + heavy letter-spacing + uppercase** for "display" text. Skip Bebas Neue entirely. Lighter bundle, no glyph fallbacks.
2. Use Bebas Neue ONLY for ASCII/numeric content (year "2025", stat numbers "3,900", English words like "INVESTMENT") — and wrap Vietnamese in a separate Be Vietnam Pro span.
3. Replace Bebas Neue with **"Oswald"** (also a condensed display sans) which **does** support Vietnamese — closest visual substitute with full diacritic coverage.

**Implementation pattern:**

```tsx
// app/layout.tsx — self-hosted, no runtime network
import "@fontsource-variable/be-vietnam-pro";
import "@fontsource/bebas-neue/400.css"; // only if option 2 above
```

Map to Tailwind v4 tokens in `globals.css`:

```css
@theme {
  --font-body: "Be Vietnam Pro Variable", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Bebas Neue", "Be Vietnam Pro Variable", sans-serif;
}
```

### 4. SEO toolkit — Next.js built-ins, no third-party

**Choice:** Use `app/sitemap.ts` + `app/robots.ts` + `metadata` export in layouts. **Do NOT install `next-sitemap`.**
**Confidence:** HIGH (Next.js official docs, App Router metadata API).

**Why:**
- 2 URLs total (`/`, `/du-an`). External package is dead weight.
- Built-in API is type-safe (`MetadataRoute.Sitemap`), runs at build time, ships with Next 15.
- Same for `robots.ts` — simpler than maintaining a hand-written `public/robots.txt`.

**Files to create:**
```ts
// app/sitemap.ts
import { MetadataRoute } from 'next';
export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://khangthinhinv.vn';
  return [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/du-an`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ];
}

// app/robots.ts
import { MetadataRoute } from 'next';
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://khangthinhinv.vn/sitemap.xml',
  };
}
```

### 5. OG image — static PNG, not ImageResponse

**Choice:** Commit `/public/og-image.png` (1200×630). Reference in `metadata.openGraph.images`.
**Confidence:** HIGH.

**Why not ImageResponse / `opengraph-image.tsx`:**
- Works with `output: 'export'` for **static** routes (no dynamic data), but Satori's CSS subset is restrictive (`flex` / `block` / `none` only, no `inline-block`, limited typography). Debugging Vietnamese diacritic rendering in Satori is a known pain point.
- Building a designed PNG once in Figma/Canva is faster than fighting Satori CSS and produces a higher-quality visual.
- ImageResponse is the right call if you had per-project OG images (`/du-an/[slug]`), but that route is explicitly out of scope for phase 1.

**Defer ImageResponse to a later phase** if/when `/du-an/[slug]` detail pages get built.

### 6. Image strategy — `next/image` with `unoptimized: true`, NO build-time optimizer

**Choice:** Use `<Image unoptimized />` with manually pre-optimized assets (WebP via Squoosh CLI or `sharp` script in `scripts/optimize-images.mjs`). **Do NOT install `next-image-export-optimizer`.**
**Confidence:** MEDIUM-HIGH (validated against Next.js docs + phase 1 scope from PROJECT.md).

**Rationale:**
- Phase 1 has **placeholder images and CSS patterns** for project showcases (per PROJECT.md "Content: ảnh dự án chưa có"). There is nothing to optimize.
- When real project photos arrive, the right move is **pre-optimize at the source** (Squoosh, ImageOptim, or a `sharp` one-off script) and commit the optimized WebPs to `/public/images/`. Lock the dimensions in the `<Image>` component.
- `next-image-export-optimizer` adds 50+ transitive deps, a custom `Loader`, and a build step — overkill for ≤20 photos that won't change weekly.

**Concrete recipe when photos arrive:**
1. Receive originals (JPG/PNG from user)
2. Run a one-time `sharp` script: resize to 1600px max, output `.webp` at quality 78
3. Commit to `/public/images/du-an/*.webp`
4. Use `<Image src="/images/du-an/foo.webp" width={1600} height={900} alt="..." unoptimized />`

### 7. Analytics — Cloudflare Web Analytics (free, cookieless)

**Choice (primary):** Cloudflare Web Analytics.
**Choice (alternative if not deploying to Cloudflare Pages):** Plausible Cloud ($9/mo, hosted in EU).
**Confidence:** HIGH for Cloudflare option (free + cookieless verified); MEDIUM on user appetite for $9/mo SaaS.

**Why Cloudflare Web Analytics:**
- **Free**, on every Cloudflare plan including free.
- Cookieless by default → **no cookie consent banner needed under GDPR/Vietnamese PDPL** for basic pageview analytics. The site still needs a privacy policy mentioning IP processing, but no annoying modal.
- ~1KB JavaScript beacon — Lighthouse Performance ≥ 90 stays achievable.
- Pageviews, top pages, top referrers, country breakdown, Core Web Vitals — exactly the metrics this B2B site needs.
- If deployment lands on Cloudflare Pages (see next section), enabling is one click.

**Why Plausible as backup:**
- If deploying to GitHub Pages / Netlify and you don't want a Cloudflare account: Plausible is the most polished privacy-friendly option, EU-hosted, GDPR/CCPA compliant by design, also cookieless.
- $9/mo for 10K pageviews is fine for a corporate site; very unlikely to exceed.

**Anti-recommendations:**
- ❌ Google Analytics 4 — requires cookie consent modal in Vietnam (PDPL) and EU (GDPR), 50KB+ script, hurts Lighthouse, IP transfer to US is a legal headache. Don't bother for a small B2B site.
- ❌ Vercel Analytics — only practical if deploying to Vercel; locks in.
- ❌ Self-hosted Umami — overkill, requires Postgres + a server. The point of static export is no server.

### 8. Deployment target — recommendation: Cloudflare Pages

**Choice:** Cloudflare Pages.
**Confidence:** MEDIUM (no single winner; depends on user's existing accounts and tolerance for DX trade-offs).

**Ranked recommendation:**

| Rank | Platform | Best For | Trade-offs |
|------|----------|----------|------------|
| 🥇 **1. Cloudflare Pages** | This project. | **Unlimited bandwidth** even on free tier. 300+ edge POPs (including Vietnam — HCMC, Hanoi). Free Web Analytics one-click integration. Cookieless DDoS protection bundled. Custom domain + auto Let's Encrypt SSL. | DX is slightly less polished than Vercel; build config requires `output: 'export'` + setting build command to `next build && cp -r out/* .` (or similar). |
| 🥈 **2. Vercel** | If you want zero-friction DX and don't mind potential vendor lock-in. | Best-in-class GitHub integration, preview deploys, instant cache invalidation. Free tier generous for marketing site. | Bandwidth metering on hobby tier (100GB) — fine for this site. Per-user paid pricing if it grows. Marketing site doesn't need Vercel-specific features. |
| 🥉 **3. Netlify** | Familiar Jamstack flow. | Easy form handling (irrelevant here — no forms), clean dashboard. | Slowest of the four globally. Aggressive bandwidth overage pricing ($55/100GB) — risky if site goes viral. |
| **4. GitHub Pages** | Absolute minimum cost / fastest setup if repo is already on GitHub. | **Free**, integrated with the repo, automatic SSL via Let's Encrypt for custom domains. | **Hard rule against commercial use** in GH Pages ToS — *this is a real concern for Khang Thịnh* since the site advertises commercial services. Use of Pages "primarily for commercial purposes" is disallowed. **This rules out GitHub Pages for this project.** Also: 100GB soft bandwidth cap, no preview deploys, no analytics. |

**Recommendation for Khang Thịnh:**
Deploy to **Cloudflare Pages**. The GitHub Pages "no commercial use" clause makes it inappropriate for a company marketing site. Cloudflare Pages gives free unlimited bandwidth + free analytics + Vietnam edge presence + commercial use OK.

**Domain note:** The chosen domain (`khangthinhinv.vn` placeholder) is a `.vn` TLD. All four platforms accept `.vn` domains via CNAME / A records; no vendor restrictions. `.vn` domain registration is handled separately via VNNIC-accredited registrars (Mat Bao, P.A. Vietnam, etc.).

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| `motion` | `@react-spring/web` | If you need physics-based spring animations across many gestures. Overkill here. |
| `motion` | GSAP + ScrollTrigger | If you need complex timeline orchestration (parallax, scroll-pinning). Overkill + larger bundle. |
| `motion` | Pure CSS `@keyframes` + Intersection Observer | If you want ZERO JS animation deps. Viable for this small site — marquee + simple fade-ins are CSS-only. Trade off: more boilerplate per effect. |
| `lucide-react` | `@heroicons/react` | If you already use Tailwind UI components that ship Heroicons. Not our case. |
| `lucide-react` | Inline SVG sprites | Maximum control + zero JS, but loses per-icon `import` ergonomics. Fine for 3-5 fixed icons. |
| `@fontsource/be-vietnam-pro` | `next/font/google` with `subsets: ['vietnamese']` | If build environment is reliably online and you trust Google Fonts CDN. Slightly less code in `layout.tsx`. |
| Built-in `sitemap.ts` | `next-sitemap` package | If you had 100+ dynamic routes needing splitting, lastmod from filesystem, or i18n alt links. None apply here. |
| Static OG PNG | `opengraph-image.tsx` with ImageResponse | When `/du-an/[slug]` detail pages exist and each needs a unique generated OG image. Phase 2+. |
| Cloudflare Web Analytics | Plausible (cloud, $9/mo) | If not deploying on Cloudflare or want richer dashboards / goals / outbound link tracking. |
| Cloudflare Pages | Vercel | If team is already on Vercel for other projects and wants unified billing. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `framer-motion` (old package name) | Deprecated alias since 2024 — points to old release line. New installs should use `motion`. | `motion` v12.x, import from `motion/react` |
| `react-icons` with barrel import (`import { FaPhone } from 'react-icons/fa'`) | Defeats tree-shaking in some bundler configs; ships extra icon families. | `lucide-react` with per-icon imports |
| `next-sitemap` | Built-in `app/sitemap.ts` covers the entire need with zero deps. | Native `MetadataRoute.Sitemap` |
| `next-image-export-optimizer` | 50+ transitive deps + custom loader for a phase 1 site with placeholder images. | Pre-optimize once with `sharp` CLI; commit WebPs; use `<Image unoptimized />` |
| Google Analytics 4 | Cookie consent modal required in VN (PDPL) + EU (GDPR); 50KB+ script hurts Lighthouse; data sovereignty issues. | Cloudflare Web Analytics (free, cookieless) |
| Google Fonts via `<link>` in `<head>` | Runtime network dependency; layout shift; CSP headaches. | Self-hosted via `@fontsource` packages |
| Bebas Neue for Vietnamese text (`KHANG THỊNH`) | No diacritic glyphs → broken fallback mid-word. | Be Vietnam Pro Bold + uppercase + letter-spacing, or swap to Oswald |
| GitHub Pages | ToS prohibits "primarily commercial" sites — this is a company marketing site advertising commercial services. | Cloudflare Pages (free + commercial OK) |
| JetBrains Mono font | Already deferred in design spec; rarely used in marketing landing. | System `font-mono` stack |
| Logo images of partners (Binh đoàn 12, etc.) | Already deferred in design spec for IP risk. | Text-based marquee (Mẫu A pattern) |

---

## Stack Patterns by Variant

**If user later wants `/du-an/[slug]` detail pages (deferred phase 2):**
- Add `app/du-an/[slug]/opengraph-image.tsx` with `ImageResponse` for per-project OG cards.
- Keep static export — `generateStaticParams()` for slugs works fine.
- Add `next/dynamic` for any heavy detail-page-only components.

**If user later wants a contact form (currently out of scope):**
- Static export = no API routes. Options:
  - **Formspree** / **Web3Forms** — third-party POST endpoint, ~free for low volume
  - **Cloudflare Pages Functions** — if deployed on Cloudflare, native edge function handles POST
- Add `zod` + `react-hook-form` for validation if going down this path.

**If user wants Vietnamese SEO boost / Google Search Console:**
- Add `Schema.org` JSON-LD via `<script type="application/ld+json">` for `Organization` + `LocalBusiness` (address: A3-02 KDC Long Phú, xã Bến Lức, tỉnh Tây Ninh).
- Already supported in `metadata.other` field of Next 15.
- No package needed — just inline JSON.

**If user adds blog / news section later:**
- MDX via `@next/mdx` is the standard choice for static export.
- Or static markdown files in `/content/` parsed with `gray-matter` + `remark`.

---

## Version Compatibility

| Package | Version | Compatible With | Notes |
|---------|---------|-----------------|-------|
| `next@^15` | 15.x | React 19, Tailwind 4, TS 5.9 | All confirmed in `package.json` |
| `motion@^12.39` | 12.39+ | React 18.2+, React 19 ✓ | Import from `motion/react`. No breaking changes from earlier v12. |
| `lucide-react@^1.16` | 1.16+ | React 16.8+, React 19 ✓ | Per-icon ESM imports tree-shake correctly with Turbopack |
| `@fontsource-variable/be-vietnam-pro@^5` | 5.x | Any bundler with CSS import | Variable font ships all weights in one file |
| `@fontsource/bebas-neue@^5` | 5.x | Any bundler | **No Vietnamese subset — see caveat above** |
| Tailwind v4 + Next 15 | n/a | Native via `@tailwindcss/postcss` | `@theme` directive replaces `tailwind.config.ts` |
| `output: 'export'` | n/a | Disables: ISR, API routes, middleware, server actions, dynamic `Image` optimization | All acknowledged in design spec |

---

## Sources

**Official documentation (HIGH confidence):**
- [Next.js — Static Exports guide](https://nextjs.org/docs/pages/guides/static-exports) — verified `output: 'export'` constraints, image limitations
- [Next.js — sitemap.xml metadata file](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) — built-in sitemap API
- [Next.js — ImageResponse](https://nextjs.org/docs/app/api-reference/functions/image-response) — Satori CSS limitations
- [Next.js — Font Optimization](https://nextjs.org/docs/app/getting-started/fonts) — `next/font` subsets
- [Motion (motion.dev)](https://motion.dev/docs/react) — React 19 compatibility verified
- [Motion changelog](https://github.com/motiondivision/motion/blob/main/CHANGELOG.md) — v12.39.0 verified May 2026
- [Lucide React guide](https://lucide.dev/guide/packages/lucide-react) — current install + tree-shaking
- [lucide-react on npm](https://www.npmjs.com/package/lucide-react) — v1.16.0 verified May 2026
- [Be Vietnam Pro on Google Fonts](https://fonts.google.com/specimen/Be+Vietnam+Pro) — Vietnamese subset confirmed
- [@fontsource/be-vietnam-pro on npm](https://www.npmjs.com/package/@fontsource/be-vietnam-pro) — Vietnamese subset packaging
- [Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics/) — free + cookieless verified
- [GitHub Pages — HTTPS docs](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https) — Let's Encrypt auto-SSL

**Comparative / industry sources (MEDIUM confidence — corroborated where critical):**
- [LogRocket — Best React animation libraries 2026](https://blog.logrocket.com/best-react-animation-libraries/) — Motion as default
- [Lucide vs Heroicons vs Phosphor 2026 (PkgPulse)](https://www.pkgpulse.com/guides/lucide-vs-heroicons-vs-phosphor-react-icon-libraries-2026) — bundle size benchmarks
- [Vercel Analytics vs Plausible vs Umami 2026 (PkgPulse)](https://www.pkgpulse.com/blog/vercel-analytics-vs-plausible-vs-umami-privacy-first-2026)
- [Cloudflare Pages vs Netlify vs Vercel 2026 (DanubeData)](https://danubedata.ro/blog/cloudflare-pages-vs-netlify-vs-vercel-static-hosting-2026) — bandwidth and pricing
- [Migrate from next-sitemap to App Directory (Mike Bifulco)](https://mikebifulco.com/posts/migrate-from-next-sitemap-to-app-directory-sitemap)
- [Next.js OG image with static export — Discussion #55890](https://github.com/vercel/next.js/discussions/55890) — known limitations

**Project context (HIGH confidence):**
- `/Users/congphan/Workspace/my-projects/khang-thing-group/website/.planning/PROJECT.md` — scope, constraints, key decisions
- `/Users/congphan/Workspace/my-projects/khang-thing-group/website/docs/superpowers/specs/2026-05-26-khangthinh-theme-migration-design.md` — approved design system
- `/Users/congphan/Workspace/my-projects/khang-thing-group/website/package.json` — current deps

---

*Stack research for: Vietnamese corporate marketing landing (Next.js 15 static export)*
*Researched: 2026-05-26*
