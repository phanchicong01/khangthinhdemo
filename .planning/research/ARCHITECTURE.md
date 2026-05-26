# Architecture Research

**Domain:** Next.js 15 App Router static-export marketing site (Vietnamese B2B services — VLXD / xây dựng / vận chuyển)
**Researched:** 2026-05-26
**Confidence:** HIGH (Next.js core, Tailwind v4, static export constraints all verified against official docs dated 2026-05-19). MEDIUM on animation library choice (multiple credible community sources agree, but no single canonical source).

---

## Standard Architecture

### System Overview

```
┌────────────────────────────────────────────────────────────────┐
│                     Build Time (next build)                    │
│   ┌───────────────┐   ┌───────────────┐   ┌───────────────┐    │
│   │ Server        │   │ Client        │   │ Metadata Files│    │
│   │ Components    │──▶│ Components    │   │ sitemap.ts    │    │
│   │ (rendered to  │   │ (prerendered  │   │ robots.ts     │    │
│   │  HTML)        │   │  + JS bundle) │   │ (rendered to  │    │
│   └───────┬───────┘   └───────┬───────┘   │  xml / txt)   │    │
│           │                   │           └───────┬───────┘    │
│           └───────────────────┴───────────────────┘            │
│                               │                                │
│                               ▼                                │
│                      ┌────────────────┐                        │
│                      │  /out/  static │                        │
│                      │  HTML/CSS/JS   │                        │
│                      └────────┬───────┘                        │
└───────────────────────────────┼────────────────────────────────┘
                                │ deploy
                                ▼
┌────────────────────────────────────────────────────────────────┐
│             Static Host (GH Pages / Netlify / Vercel)          │
│   ┌──────────────────────────────────────────────────────┐     │
│   │  index.html  +  du-an/index.html  +  _next/static/*  │     │
│   └──────────────────────────────────────────────────────┘     │
└───────────────────────┬────────────────────────────────────────┘
                        │ HTTP
                        ▼
┌────────────────────────────────────────────────────────────────┐
│                          Browser                                │
│  Server-rendered HTML  →  hydrate Client Components             │
│  (Nav scroll, FloatingZalo, anchor smooth scroll, animations)   │
│                                                                 │
│  External CTAs (no JS):  tel:  /  zalo.me  /  mailto:           │
└────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Layer | Responsibility | Implementation |
|-------|---------------|----------------|
| **App routes** (`src/app/`) | Routing, metadata, page composition, SEO files | Server Components by default; `layout.tsx` + `page.tsx` + `sitemap.ts` + `robots.ts` |
| **Layout shell** (`Nav`, `Footer`, `FloatingZalo`) | Persistent UI across all routes | Server Components where possible; `Nav` + `FloatingZalo` are Client Components (scroll listeners, interactive state) |
| **Sections** (`components/sections/*`) | One landing-page section each — pure presentational | Server Components (static markup); only mark `'use client'` if section uses scroll/intersection/state |
| **Data** (`lib/projects.ts`) | Typed static content (projects array) | Plain TypeScript module — imported at build time, tree-shaken into HTML |
| **Design tokens** (`app/globals.css` `@theme`) | Single source of truth for colors, fonts, spacing | Tailwind v4 `@theme` block — auto-generates utility classes |
| **Static assets** (`public/`) | OG image, favicon, pre-optimized project photos, robots fallback | Served as-is; pre-process images at build time via script (next/image is `unoptimized`) |

---

## Recommended Project Structure

```
website/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout: fonts, metadata, html lang="vi"
│   │   ├── page.tsx                # Landing: compose all sections
│   │   ├── globals.css             # @import "tailwindcss" + @theme tokens
│   │   ├── sitemap.ts              # Programmatic sitemap (2 routes)
│   │   ├── robots.ts               # Programmatic robots.txt
│   │   ├── opengraph-image.png     # (optional) per-route OG; or place in public/
│   │   ├── favicon.ico
│   │   └── du-an/
│   │       └── page.tsx            # Project list — Server Component, maps lib/projects
│   ├── components/
│   │   ├── Nav.tsx                 # 'use client' — sticky, scroll-shadow, mobile menu
│   │   ├── Footer.tsx              # Server Component
│   │   ├── FloatingZalo.tsx        # 'use client' — only if you want show-on-scroll;
│   │   │                           # plain <a> can stay Server Component
│   │   ├── ui/                     # Reusable primitives (Button, Container, SectionHeading)
│   │   │   ├── Button.tsx
│   │   │   ├── Container.tsx
│   │   │   └── SectionHeading.tsx
│   │   └── sections/               # One file per landing section
│   │       ├── Hero.tsx
│   │       ├── PartnersMarquee.tsx # CSS-only marquee — Server Component
│   │       ├── Services.tsx
│   │       ├── Projects.tsx        # Receives `projects` slice via props
│   │       ├── BigStats.tsx        # 'use client' IF count-up animation; else Server
│   │       ├── Capabilities.tsx
│   │       ├── CtaQuote.tsx
│   │       └── Contact.tsx
│   └── lib/
│       ├── projects.ts             # Typed static data
│       ├── site.ts                 # siteUrl, company info constants (DRY for sitemap+metadata+Footer)
│       └── nav.ts                  # Nav links array (DRY for Nav + Footer)
├── public/
│   ├── images/
│   │   └── projects/               # Pre-optimized AVIF/WebP + JPG fallback
│   ├── logo.svg
│   ├── og-image.png                # 1200×630
│   └── favicon.ico
├── scripts/
│   └── optimize-images.mjs         # (optional) sharp-based pre-build optimizer
├── next.config.ts                  # output:'export', images.unoptimized:true, trailingSlash:true
├── postcss.config.mjs              # @tailwindcss/postcss
├── tsconfig.json                   # strict: true, paths: { "@/*": ["./src/*"] }
└── package.json
```

### Structure Rationale

- **`app/` is routing only.** No business logic, no large markup. `page.tsx` files are thin — they import sections and compose them. Keeps the route layer scannable.
- **`components/sections/` separates landing-page sections from reusable UI.** A section is purpose-built for one slot on `/`; a `ui/` primitive (Button, Container) is reused across sections. This is the single most useful split for marketing sites — without it you get one 500-line `page.tsx`.
- **`components/ui/` only when reuse appears ≥2×.** YAGNI: if `Button` is used in Hero, CtaQuote, and Contact, extract it. If `BigStatCard` lives only in `BigStats.tsx`, keep it inline. (Aligns with design spec: "Services/Stats/Capabilities inline — no separate lib file.")
- **`lib/` is for pure data + constants.** `projects.ts` is typed data. `site.ts` holds `siteUrl`, phone, email, address — referenced from `sitemap.ts`, `robots.ts`, root `metadata`, `Footer.tsx`, and `Contact.tsx`. Single source of truth prevents the classic "phone number wrong in 3 places" bug.
- **No `hooks/` or `utils/` folder yet.** Premature. Marketing sites rarely need them. Add when first real cross-cutting concern appears.
- **`scripts/` for build-time tooling.** Image pre-optimization belongs here because `next/image` with `unoptimized:true` does not run sharp at build.
- **`public/images/projects/`** subfolder so future `/du-an/[slug]` migration has a natural home (Phase 2+).

---

## Architectural Patterns

### Pattern 1: Server-First Component Split

**What:** Default every component to a Server Component. Add `'use client'` only when forced by: `useState`, `useEffect`, browser-only APIs (window/IntersectionObserver/scroll listeners), or event handlers (`onClick`, `onScroll`).

**When to use:** Every component. This is the default in Next.js 15 App Router.

**Trade-offs:**
- ✅ Zero JS shipped for static sections (Services, Projects, Capabilities, Footer, etc.)
- ✅ Smaller bundle → faster LCP, easier Lighthouse ≥90
- ⚠️ Once a component is `'use client'`, all components it *imports* are bundled to the client. So push `'use client'` to the leaf, not the parent.

**Concrete decisions for this project:**

| Component | Client/Server | Why |
|-----------|---------------|-----|
| `app/layout.tsx`, `app/page.tsx`, `app/du-an/page.tsx` | Server | Routes, no interactivity |
| `Nav.tsx` | **Client** | Scroll-listener for shadow; mobile-menu open/close `useState` |
| `Footer.tsx` | Server | Pure markup |
| `FloatingZalo.tsx` | Server (plain `<a>`) OR Client (if showing/hiding on scroll) | Default to Server — it's just an anchor with an icon |
| `Hero.tsx`, `Services.tsx`, `Projects.tsx`, `Capabilities.tsx`, `CtaQuote.tsx`, `Contact.tsx`, `PartnersMarquee.tsx` | Server | Static markup; marquee uses CSS `@keyframes` |
| `BigStats.tsx` | Server if numbers are static text; **Client** if count-up animation | Recommend Server (numbers are factual — animation adds JS for marginal value) |

**Example:**
```tsx
// src/components/Nav.tsx
'use client'
import { useEffect, useState } from 'react'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  // ...
}
```

### Pattern 2: Section as Props-Free Composition (with a Typed Escape Hatch)

**What:** Each section in `components/sections/*` is a self-contained, **props-free** component that imports its own content from `lib/` or hardcodes copy inline. The `page.tsx` is purely `<Hero /> <Services /> ...`.

**When to use:** Marketing sites where each section appears exactly once and content is not reused. This is the *opposite* of design-system advice — and it is correct for marketing.

**Trade-offs:**

| Approach | Pros | Cons |
|----------|------|------|
| **Props-driven** (`<Hero headline="..." cta="..." />`) | Reusable; testable in isolation | Verbose `page.tsx`; the prop signature *is* the content; no real reuse on a 1-page site |
| **Hardcoded inline** (recommended) | Reads top-to-bottom like the page itself; copy lives where it's rendered; trivial to refactor | Less "clean" by abstract standards |
| **Hybrid: hardcoded + props for data-driven slices** | Best of both | Slight inconsistency |

**Recommendation for this project: Hybrid.**
- Most sections: hardcode copy inline. (Hero headline, Services card text, Capabilities bullets.)
- `<Projects />`: accept `projects: Project[]` prop OR import `lib/projects` directly. Either works — direct import is simpler if you only render this list once. If `/du-an` also wants to show the same 4 projects, import in both places.

**Example:**
```tsx
// src/components/sections/Projects.tsx (Server Component)
import { projects } from '@/lib/projects'
import { ProjectCard } from './ProjectCard'

export function Projects() {
  // Show first 4 on landing; full list lives on /du-an
  const featured = projects.slice(0, 4)
  return (
    <section id="projects" className="bg-bone-dark py-20">
      <Container>
        <SectionHeading title="Dự án tiêu biểu" />
        <div className="grid gap-6 md:grid-cols-2">
          {featured.map((p) => <ProjectCard key={p.slug} project={p} />)}
        </div>
      </Container>
    </section>
  )
}
```

### Pattern 3: Tailwind v4 `@theme` as Design System (Dark-Mode Future-Proof)

**What:** Define all design tokens via Tailwind v4's `@theme` directive in `globals.css`. Tailwind auto-generates utilities (`bg-burgundy`, `text-bone`, `font-display`) from the declared CSS variables. Dark mode is a **layer added later** by overriding variables — no token renaming needed.

**When to use:** Always for Tailwind v4 projects. This replaces the v3 `tailwind.config.js` pattern.

**Trade-offs:**
- ✅ One file (`globals.css`) holds the whole design system
- ✅ CSS variables are usable from anywhere (inline `style`, custom CSS, `@layer components`)
- ✅ Dark mode = add a `@media (prefers-color-scheme: dark)` block or a `.dark { }` selector that re-defines the same variable names — utility classes update automatically
- ⚠️ Token namespaces are reserved (`--color-*`, `--font-*`, `--spacing-*`, `--text-*`, `--radius-*`, `--shadow-*`, `--breakpoint-*`). Don't put random vars in `@theme` — use `:root` for those.

**Structure for this project:**

```css
/* src/app/globals.css */
@import "tailwindcss";

/* 1. Brand tokens — semantic AND palette */
@theme {
  /* Palette (raw) */
  --color-burgundy: #6B1F1F;
  --color-burgundy-dark: #4A1414;
  --color-terracotta: #B85450;
  --color-coffee: #3A1F1A;
  --color-bone: #F5F1EA;
  --color-bone-dark: #EBE4D6;
  --color-espresso: #1A1410;
  --color-taupe: #8B7355;

  /* Fonts (wired to next/font CSS variables — see Pattern 5) */
  --font-display: var(--font-bebas);
  --font-body: var(--font-be-vietnam);
}

/* 2. Semantic aliases (NOT in @theme — these are app-level, not utilities) */
:root {
  --color-bg: var(--color-bone);
  --color-bg-alt: var(--color-bone-dark);
  --color-fg: var(--color-espresso);
  --color-fg-muted: var(--color-taupe);
  --color-primary: var(--color-burgundy);
  --color-primary-hover: var(--color-burgundy-dark);
  --color-accent: var(--color-terracotta);
}

/* 3. Dark mode — Phase-2-ready stub. Comment out until you're ready. */
/*
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: var(--color-espresso);
    --color-bg-alt: var(--color-coffee);
    --color-fg: var(--color-bone);
    --color-fg-muted: #B8A88F;
  }
}
*/

/* 4. Base styles */
body {
  background: var(--color-bg);
  color: var(--color-fg);
  font-family: var(--font-body);
}
```

**Note on `@theme inline`:** When a `@theme` variable *references* another CSS variable (like `--font-display: var(--font-bebas)`), use `@theme inline { ... }` so the utility class compiles to the resolved value instead of a variable-reference chain. Verified in [Tailwind v4 docs](https://tailwindcss.com/docs/theme#referencing-other-variables).

```css
@theme inline {
  --font-display: var(--font-bebas);
  --font-body: var(--font-be-vietnam);
}
```

**Trade-off matrix: Where to put colors**

| Option | When to choose |
|--------|---------------|
| Raw palette in `@theme` (e.g. `--color-burgundy`) | Always — gives you utilities like `bg-burgundy` |
| Semantic in `@theme` (e.g. `--color-primary`) | Risky: locks "primary" as a utility name; harder to override per-page. Prefer keeping semantic aliases at `:root` |
| Both | Recommended (above) — palette as utilities, semantic in `:root` for CSS variable consumption |

### Pattern 4: Static Data as Typed TS Const

**What:** Project list (and any other static content like nav links, services array) lives as typed const arrays in `lib/*.ts`. No JSON, no MDX for this scale.

**When to use:** Content with < ~50 items that doesn't need a non-developer to edit it.

**Trade-offs:**

| Format | Pros | Cons | Use when |
|--------|------|------|----------|
| **TS const** ✅ | Type-safe; refactorable; tree-shakeable; zero runtime cost | Requires code edit | < 50 items, dev-edited (this project) |
| JSON | Editable by non-devs; same runtime cost | No types unless you write a schema; can't reference computed values | Editorial workflow, no CMS |
| MDX | Rich content with React components inline | Build complexity (need MDX plugin); overkill for short summaries | Blog posts, long-form project case studies (Phase 2+ when `/du-an/[slug]` lands) |

**Example:**
```ts
// src/lib/projects.ts
export type Project = {
  slug: string
  title: string
  client: string
  location: string
  year: string
  scope: string
  summary: string
  image?: string  // public/images/projects/<slug>.webp
}

export const projects: Project[] = [
  {
    slug: 'cao-toc-cai-nuoc-dat-mui',
    title: 'Cao tốc Cái Nước - Đất Mũi',
    client: 'Bộ Quốc phòng - Binh đoàn 12 - Trường Sơn',
    location: 'Cà Mau',
    year: '2024',
    scope: 'Cung ứng cát san lấp, vận chuyển đường thủy',
    summary: '...',
  },
  // ...3 more
]
```

### Pattern 5: Metadata — Root Layout + generateMetadata for Variants

**What:**
- Static, site-wide defaults → `metadata` export in `app/layout.tsx`.
- Per-page overrides → `metadata` export in each `page.tsx`.
- Dynamic (would need `generateMetadata`) is **not needed for this 2-route site**.

**When to use:**
- `layout.tsx` metadata: title template, default OG image, `metadataBase`, viewport, themeColor.
- `page.tsx` metadata: page-specific `title` + `description` (Next.js will merge with layout via `title.template`).

**Example:**

```tsx
// src/app/layout.tsx
import type { Metadata, Viewport } from 'next'
import { siteUrl } from '@/lib/site'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Khang Thịnh Investment — Cung ứng VLXD, Xây dựng, Vận chuyển',
    template: '%s | Khang Thịnh Investment',
  },
  description: 'Cung ứng cát, đá, san lấp. Xây dựng nhà phố & công trình. Vận chuyển đường thủy. Đối tác Bộ Quốc phòng - Binh đoàn 12 - Trường Sơn.',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'Khang Thịnh Investment',
    images: ['/og-image.png'],
  },
  alternates: { canonical: '/' },
}

export const viewport: Viewport = {
  themeColor: '#6B1F1F',
  width: 'device-width',
  initialScale: 1,
}
```

```tsx
// src/app/du-an/page.tsx
export const metadata: Metadata = {
  title: 'Dự án tiêu biểu',          // becomes "Dự án tiêu biểu | Khang Thịnh Investment"
  description: 'Danh sách các dự án Khang Thịnh đã tham gia: Cao tốc Cái Nước–Đất Mũi, Cầu Cửa Lớn, Đường ra Hòn Khoai, Nhà phố dân dụng.',
  alternates: { canonical: '/du-an' },
}
```

**Key Next.js 15 notes:**
- Use `viewport` export (separated from `metadata` since v14) for `themeColor`, `width`.
- `metadataBase` is required to make relative OG image URLs work — set it from `lib/site.ts` siteUrl.
- `alternates.canonical` per page prevents the trailing-slash duplicate-URL SEO issue.

### Pattern 6: sitemap.ts + robots.ts in App Router (Static-Export Compatible)

**What:** `app/sitemap.ts` returns a `MetadataRoute.Sitemap` array; `app/robots.ts` returns a `MetadataRoute.Robots` object. Both are **fully static-export compatible** — they're rendered to `sitemap.xml` and `robots.txt` at build time. Verified in [Next.js 16 docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) (same applies to v15).

**Trade-off vs. static `public/robots.txt`:**

| Approach | Pros | Cons |
|----------|------|------|
| `app/robots.ts` (recommended) | Type-safe; sitemap URL stays in sync with siteUrl constant | Slight indirection |
| `public/robots.txt` (static file) | Dead simple | Hardcodes the domain; easy to forget when domain changes |

Since the domain is a placeholder (`khangthinhinv.vn`) that may change, **use `robots.ts`** — change in one place (`lib/site.ts`) and both files update.

**Example:**

```ts
// src/lib/site.ts
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://khangthinhinv.vn'
export const company = {
  name: 'Khang Thịnh Investment',
  phone: '0921985599',
  zalo: 'https://zalo.me/0921985599',
  email: 'khangthinhinv2025@gmail.com',
  address: 'A3-02 KDC Long Phú, xã Bến Lức, tỉnh Tây Ninh',
}
```

```ts
// src/app/sitemap.ts
import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: siteUrl, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${siteUrl}/du-an`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ]
}
```

```ts
// src/app/robots.ts
import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
```

### Pattern 7: Animations — CSS-First, Library Only If Needed

**What:** For a marketing site that must hit Lighthouse Performance ≥ 90, the default is CSS-only animations. Add a library only when a specific effect demands it.

**Trade-off matrix:**

| Approach | Bundle Cost | Capability | Use For |
|----------|-------------|------------|---------|
| **CSS `@keyframes` + `transition`** ✅ | 0 KB | Marquee, hover effects, accordion-style reveal | PartnersMarquee, button hovers, hero text fade-in |
| **CSS `animation-timeline: view()`** (modern, 2025+) | 0 KB | Scroll-linked animations natively | Stat reveal on scroll, parallax-lite. Browser support ~85% in 2026 — graceful degradation acceptable |
| **Motion One** (`motion`) | ~4 KB | Scroll-trigger, spring, gesture | Only if CSS can't express it (e.g. count-up numbers) |
| **Framer Motion** (`motion/react`) | ~34–50 KB | Full React-integrated motion | Overkill — too heavy for a 2-page marketing site |
| **GSAP + ScrollTrigger** | 60+ KB | Pro-grade timelines | No — not justified |

**Recommendation:** Start with CSS only. If a section absolutely needs JS-driven motion (e.g. animated count-up for BigStats), add **Motion One** (`motion` package on npm, ~4 KB). Do not pull in Framer Motion.

**Sources for animation comparison:**
- [Motion Magazine: Framer Motion or Motion One?](https://motion.dev/magazine/should-i-use-framer-motion-or-motion-one) — official, MEDIUM-HIGH confidence
- [LogRocket: Best React animation libraries 2026](https://blog.logrocket.com/best-react-animation-libraries/) — community, MEDIUM
- Motion One core ~3.8 KB confirmed across multiple sources

**Example: PartnersMarquee with pure CSS (zero JS):**

```tsx
// Server Component
export function PartnersMarquee() {
  const partners = ['BINH ĐOÀN 12', 'TRƯỜNG SƠN', 'BỘ QUỐC PHÒNG', '...']
  // Duplicate the list so the loop is seamless
  return (
    <div className="overflow-hidden bg-espresso py-6">
      <div className="flex animate-marquee gap-12 whitespace-nowrap font-display text-bone">
        {[...partners, ...partners].map((p, i) => (
          <span key={i} className="text-2xl tracking-wider">{p}</span>
        ))}
      </div>
    </div>
  )
}
```

```css
/* In globals.css */
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
.animate-marquee {
  animation: marquee 30s linear infinite;
}
@media (prefers-reduced-motion: reduce) {
  .animate-marquee { animation: none; }
}
```

### Pattern 8: Fonts — next/font with Vietnamese Subset + CSS Variable

**What:** Use `next/font/google` to self-host both fonts at build time. Wire each to a CSS variable, then expose those variables to Tailwind v4 via `@theme inline`.

**Verified facts:**
- Be Vietnam Pro is a Google Font with `vietnamese` subset support ([Google Fonts](https://fonts.google.com/specimen/Be+Vietnam+Pro), [GitHub](https://github.com/bettergui/BeVietnamPro)) — variable font.
- Bebas Neue is **not** variable; weights must be specified.
- `next/font` is fully compatible with static export (no runtime dependency on Google).

**Example:**

```tsx
// src/app/layout.tsx
import { Be_Vietnam_Pro, Bebas_Neue } from 'next/font/google'

const beVietnam = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],   // not a variable font in google's npm package; specify needed weights only
  display: 'swap',
  variable: '--font-be-vietnam',
})

const bebas = Bebas_Neue({
  subsets: ['latin'],                      // Bebas does NOT include vietnamese subset — only use for English/decorative text
  weight: '400',                           // Bebas Neue is single-weight
  display: 'swap',
  variable: '--font-bebas',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${beVietnam.variable} ${bebas.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  )
}
```

```css
/* globals.css — wire CSS variables to Tailwind utilities */
@theme inline {
  --font-body: var(--font-be-vietnam);
  --font-display: var(--font-bebas);
}
```

**Usage:**
- Body text: default (via `body { font-family: var(--font-body) }`) or `font-body` utility
- Big headings, stats, marquee: `font-display` utility — but only for content that's safely ASCII/Latin (Bebas lacks Vietnamese diacritics)

**Critical pitfall:** Do **not** use Bebas Neue for Vietnamese text — the diacritics won't render correctly. Use it only for numbers, English words, or Latin-only headings. For Vietnamese display text, use `font-body` with weight 700 or 800.

**Weight minimization:** Loading 4 weights of Be Vietnam Pro (400/500/600/700) is ~80 KB total (woff2, Vietnamese + Latin subsets). If bundle is tight, drop 500 → ~60 KB.

### Pattern 9: Sticky Nav + Smooth Anchor Scroll

**What:** Use CSS `position: sticky` + global `scroll-behavior: smooth` + `scroll-margin-top` on section anchors. No JS scroll library needed.

**Example:**

```css
/* globals.css */
html { scroll-behavior: smooth; }

/* Each section anchor compensates for the sticky nav height */
section[id] {
  scroll-margin-top: 4.5rem;   /* match Nav height */
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}
```

```tsx
// Nav.tsx (Client Component for scroll shadow)
'use client'
// ...
return (
  <nav
    className={`sticky top-0 z-50 transition-shadow ${
      scrolled ? 'shadow-md bg-bone/95 backdrop-blur' : 'bg-bone'
    }`}
  >
    <Container className="flex h-18 items-center justify-between">
      <Link href="/#top">...</Link>
      <ul className="hidden md:flex gap-6">
        <li><a href="#services">Dịch vụ</a></li>
        <li><a href="#projects">Dự án</a></li>
        {/* ... */}
      </ul>
    </Container>
  </nav>
)
```

**Anchor link behavior across routes:**
- On `/` → `<a href="#services">` works natively.
- On `/du-an` → `<a href="/#services">` triggers full navigation back to landing, then scrolls. Next.js `<Link href="/#services">` does this correctly via App Router.

### Pattern 10: Image Strategy (next/image with `unoptimized: true`)

**What:** Static export disables Next.js's runtime image optimizer. Compensate by **pre-optimizing at build time** with a sharp-based script, generating AVIF + WebP + JPEG fallbacks at multiple widths, then using `next/image` (still useful for lazy-loading, layout-shift prevention, `srcset`) or plain `<picture>`.

**Trade-off:**

| Approach | Pros | Cons |
|----------|------|------|
| **`next/image` unoptimized + pre-built variants** ✅ | Get lazy-load + LCP hints for free; explicit `srcSet` works | Need a `<picture>` wrapper for true AVIF/WebP negotiation |
| **Plain `<picture>` with manual `srcset`** | Full control over format negotiation | Lose `next/image`'s lazy + sizing helpers |
| **Cloudinary loader** | Best image perf | Adds external dependency + cost; not needed for ~10 photos |

**Recommendation:** For Phase 1 (4 project photos + 1 hero + 1 OG), pre-optimize manually or with a `scripts/optimize-images.mjs` using sharp. Output to `/public/images/projects/<slug>-{w}.{ext}` for multiple widths. Use `<picture>` for AVIF→WebP→JPG, with `<img loading="lazy" decoding="async">`.

**Example:**

```tsx
// components/sections/ProjectCard.tsx
type Props = { project: Project }
export function ProjectCard({ project }: Props) {
  const base = `/images/projects/${project.slug}`
  return (
    <article className="bg-bone rounded-lg overflow-hidden">
      <picture>
        <source type="image/avif" srcSet={`${base}-640.avif 640w, ${base}-1024.avif 1024w`} sizes="(min-width: 768px) 50vw, 100vw" />
        <source type="image/webp" srcSet={`${base}-640.webp 640w, ${base}-1024.webp 1024w`} sizes="(min-width: 768px) 50vw, 100vw" />
        <img
          src={`${base}-1024.jpg`}
          alt={project.title}
          width={1024}
          height={576}
          loading="lazy"
          decoding="async"
          className="aspect-video w-full object-cover"
        />
      </picture>
      {/* ... text content */}
    </article>
  )
}
```

**Phase-1 shortcut:** Since project photos aren't available yet, use **CSS patterns** (diagonal stripes in burgundy/espresso) as project card backgrounds. Defer the image pipeline until real photos arrive — premature optimization.

---

## Data Flow

### Build-Time Flow

```
lib/projects.ts ─┐
lib/site.ts ─────┤
                 ├──▶ Server Components ──▶ HTML
public/* ────────┤    (rendered at         (in /out/)
                 │     next build)
@theme tokens ───┴──▶ Tailwind utilities ─▶ CSS (in /out/)
```

### Runtime Flow (Browser)

```
HTML loads ──▶ Hydrate Client Components (Nav, optional BigStats animation)
            ├──▶ User clicks anchor link    ──▶ scroll-behavior:smooth
            ├──▶ User scrolls               ──▶ Nav scroll-shadow listener
            └──▶ User clicks CTA            ──▶ tel: / zalo.me / mailto: (no JS)
```

### Key Data Flows

1. **Project list flow:** `lib/projects.ts` (TS const) → imported by `Projects.tsx` (landing) and `app/du-an/page.tsx` (list). Tree-shaken into HTML at build. Same source of truth.
2. **Company info flow:** `lib/site.ts` → consumed by `app/layout.tsx` metadata, `app/sitemap.ts`, `app/robots.ts`, `Footer.tsx`, `Contact.tsx`, `FloatingZalo.tsx`. Change one place, propagates everywhere.
3. **Design tokens flow:** `app/globals.css` `@theme` → Tailwind generates utility classes → consumed by every component via `className`.

---

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| **Current (Phase 1): 2 routes, 4 projects, no CMS** | Current architecture — `lib/projects.ts` + static export — is correct. No changes needed. |
| **+ Project detail pages (Phase 2)** | Add `app/du-an/[slug]/page.tsx` with `generateStaticParams()` returning all slugs. Still static export. May want to move `summary` → MDX file per project. |
| **+ More than ~20 projects** | Move to a folder of MDX files (`content/projects/*.mdx`) with a build script that compiles them. Type stays via a `getProjectsManifest()` helper. |
| **+ Editorial workflow (non-dev contributors)** | Add a headless CMS (Sanity, Decap CMS git-based, or Contentful) feeding the same `Project[]` shape. Static export still works — just fetch at build. |
| **+ Multi-language (i18n)** | Move to `app/[lang]/...` route structure. Sitemap uses `alternates.languages`. Still static export. |
| **+ Contact form / interactive features** | At that point, switch from `output: 'export'` to default Next.js + server actions. Architecture is forward-compatible — only the deploy target changes. |

### Scaling Priorities

1. **First bottleneck: image size.** When real project photos arrive, bundle size jumps. Mitigation: AVIF/WebP pipeline (Pattern 10) keeps Lighthouse green.
2. **Second bottleneck: font weights.** Adding more weights inflates the woff2 payload. Mitigation: audit what's actually used; drop unused weights from `Be_Vietnam_Pro` config.
3. **Third bottleneck: animation libraries.** Adding Framer Motion now would blow the 90-Performance budget. Stay CSS-only.

---

## Anti-Patterns

### Anti-Pattern 1: "Just Mark Everything 'use client' to Be Safe"

**What people do:** Add `'use client'` to the root layout or to every section "in case we need state later."

**Why it's wrong:** The whole React tree becomes a client bundle. You lose the central benefit of App Router. Hydration JS balloons; Lighthouse drops.

**Do this instead:** Default to Server. Push `'use client'` to the smallest possible leaf — usually `Nav.tsx` and maybe one or two interactive widgets. Verified pattern in [Next.js static export docs](https://nextjs.org/docs/app/guides/static-exports).

### Anti-Pattern 2: Hardcoding Domain/Phone/Email in Multiple Files

**What people do:** Type `khangthinhinv2025@gmail.com` in Footer, Contact section, sitemap, metadata, robots.

**Why it's wrong:** Phone/email/domain changes silently break consistency. Especially likely here — the domain is a placeholder.

**Do this instead:** `lib/site.ts` constants. Import everywhere.

### Anti-Pattern 3: Putting Layout-Wide Components inside Sections

**What people do:** Re-import `<Nav />` inside `Hero.tsx`, or nest `<Footer />` inside `page.tsx`.

**Why it's wrong:** They belong in `app/layout.tsx` so they appear on every route (especially `/du-an`) without duplication.

**Do this instead:** `Nav`, `Footer`, `FloatingZalo` live in `app/layout.tsx`. `page.tsx` files contain only route-specific sections.

### Anti-Pattern 4: Using Tailwind v3 `tailwind.config.js` Conventions

**What people do:** Copy-paste a `tailwind.config.js` with `theme.extend.colors` from a v3 tutorial.

**Why it's wrong:** Tailwind v4 has **no config file by default** — design tokens belong in CSS via `@theme`. A v3 config file will be ignored or cause confusion.

**Do this instead:** Put all customization in `globals.css` via `@theme` and `@layer`. Verified in [Tailwind v4 theme docs](https://tailwindcss.com/docs/theme).

### Anti-Pattern 5: Using `next/image` with `unoptimized` and Expecting AVIF/WebP

**What people do:** Use `<Image src="hero.jpg" />`, set `images.unoptimized: true`, and assume Next.js will still serve modern formats.

**Why it's wrong:** With `unoptimized: true`, Next.js serves the exact file as-is. No format conversion, no resizing.

**Do this instead:** Either (a) pre-generate AVIF/WebP at build via sharp + use `<picture>`, or (b) accept JPG-only and live with it. Don't expect Next.js to do the work.

### Anti-Pattern 6: Using Bebas Neue for Vietnamese Display Text

**What people do:** Apply `font-display` (Bebas Neue) to a Vietnamese headline like "Dự án tiêu biểu."

**Why it's wrong:** Bebas Neue has no Vietnamese diacritic glyphs; characters render with broken/fallback marks.

**Do this instead:** Use Bebas only for numbers and Latin-only labels (English words, stats). For Vietnamese headlines, use `font-body` (Be Vietnam Pro) with weight 700 or 800 — still feels "display" with the right tracking and size.

---

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Zalo | Plain `<a href="https://zalo.me/0921985599">` | No SDK; opens app/web. Phone number in URL. |
| Phone | `<a href="tel:0921985599">` | Mobile clicks dial; desktop opens dialer app. Strip spaces from number. |
| Email | `<a href="mailto:khangthinhinv2025@gmail.com">` | No CC/BCC/subject pre-fill needed for Phase 1. |
| Google Fonts | Build-time via `next/font/google` | No runtime request to Google; fonts self-hosted in `_next/static/media/`. |
| Search engines | sitemap.xml + robots.txt | Both generated by `app/sitemap.ts` + `app/robots.ts`. Submit to Google Search Console post-deploy. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `app/` ↔ `components/` | Direct import (Server→Server, Server→Client) | No prop drilling; sections are self-contained |
| `components/` ↔ `lib/` | Direct import of typed const | Pure functional dependency — no side effects |
| `globals.css` ↔ components | Utility classes (Tailwind-generated from `@theme`) | Tokens flow one-way: CSS → utilities → JSX |
| `next.config.ts` ↔ runtime | Build-time only | `output: 'export'`, `images.unoptimized`, `trailingSlash` baked into output |

---

## Sources

**Official (HIGH confidence):**
- [Next.js: How to create a static export](https://nextjs.org/docs/app/guides/static-exports) — verifies supported features (Server/Client Components, Route Handlers GET-only, `next/image` custom loader requirement), confirms unsupported (Server Actions, cookies, middleware, ISR), version current as of 2026-05-19
- [Next.js: sitemap.xml file convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) — confirms `sitemap.ts` works in App Router with TS types
- [Next.js: robots.txt file convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots) — confirms `robots.ts` works; type signature
- [Next.js: Font Module (next/font)](https://nextjs.org/docs/app/api-reference/components/font) — confirms `variable` option, multi-font pattern, Tailwind v4 integration via `@theme inline`
- [Tailwind CSS: Theme variables](https://tailwindcss.com/docs/theme) — confirms `@theme` directive, namespace rules, `inline` modifier, dark mode pattern

**Community / Industry (MEDIUM confidence):**
- [Motion Magazine: Should I use Framer Motion or Motion One?](https://motion.dev/magazine/should-i-use-framer-motion-or-motion-one) — official Motion team comparison
- [LogRocket: Best React animation libraries 2026](https://blog.logrocket.com/best-react-animation-libraries/) — bundle size comparison
- [Google Fonts: Be Vietnam Pro](https://fonts.google.com/specimen/Be+Vietnam+Pro) — confirms `vietnamese` subset support
- [GitHub: bettergui/BeVietnamPro](https://github.com/bettergui/BeVietnamPro) — official font repo

**Internal:**
- `/Users/congphan/Workspace/my-projects/khang-thing-group/website/.planning/PROJECT.md` — project goals, scope, constraints
- `/Users/congphan/Workspace/my-projects/khang-thing-group/website/docs/superpowers/specs/2026-05-26-khangthinh-theme-migration-design.md` — approved design spec
- `/Users/congphan/Workspace/my-projects/khang-thing-group/website/package.json` — current dependency versions

---

*Architecture research for: Next.js 15 App Router static-export marketing site*
*Researched: 2026-05-26*
