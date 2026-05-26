# Project Research Summary

**Project:** Khang Thịnh Investment — Corporate Marketing Website
**Domain:** Vietnamese B2B corporate landing page (VLXD / civil construction / waterway logistics)
**Researched:** 2026-05-26
**Confidence:** HIGH on technical decisions; MEDIUM on copy/conversion psychology (needs Vietnamese-native reviewer)

## Executive Summary

This is a **single-page Vietnamese trust-and-conversion marketing site** (plus one `/du-an` list route) for a 2025-founded company whose strongest credential is military/government contract experience (Bộ Quốc phòng — Binh đoàn 12 — Trường Sơn). The audience is older Vietnamese B2B buyers (40–60+) on mobile/Zalo who scan for a hotline within seconds and call rather than fill forms. Every decision in the design spec — sticky hotline, FloatingZalo, visible MST, named project clients, no contact form — is correctly calibrated to that audience and is **validated by the feature research**.

The recommended technical approach is the locked stack (Next.js 15 App Router + React 19 + Tailwind v4 + TypeScript 5.9, all with `output: 'export'`) augmented by a deliberately **minimal supporting stack**: `motion` for tasteful reveals, `lucide-react` for icons, `@fontsource` (or `next/font/google`) for self-hosted fonts, and **Cloudflare Pages** for deployment. Two researchers slightly diverge on font loading (STACK.md prefers `@fontsource` for offline-buildability; ARCHITECTURE.md prefers `next/font/google` for tighter integration) — both work; pick one and move on. Architecture is server-first: every section a Server Component except `Nav` (scroll shadow + mobile menu) and possibly `BigStats` if count-up animation is wanted.

The dominant risks are **silent**, not loud: `output: 'export'` strips features without warning, `basePath` breaks every asset on a misconfigured deploy, Bebas Neue lacks Vietnamese diacritics and will visibly break any Vietnamese headline that uses it, and the placeholder domain `khangthinhinv.vn` will bleed into sitemap/OG metadata if not gated behind an env var. The single most important pre-Phase-1 decisions to **lock now** are: (1) deploy target (recommendation: Cloudflare Pages — GitHub Pages is ruled out by its no-commercial-use ToS), (2) display font strategy for Vietnamese headings, and (3) production domain (or at minimum an env-var contract for it).

## Key Findings

### Recommended Stack

The full stack is documented in [STACK.md](./STACK.md). It is intentionally lean because the site has only 2 routes and one conversion goal. No animation library beyond `motion`, no UI framework, no CMS, no contact-form library.

**Core technologies (locked):**
- **Next.js 15 (App Router) + React 19** — file-conventions handle sitemap/robots/metadata natively; perfect for `output: 'export'`
- **Tailwind CSS v4 with `@theme` directive** — design tokens live in `globals.css`; no `tailwind.config.ts` needed; dark-mode-ready by re-declaring CSS variables later
- **TypeScript 5.9 strict** — already configured

**Supporting libraries:**
- **`motion` (v12.x, import from `motion/react`)** — for Hero reveals, scroll-triggered fade-ins, BigStats count-up. Replaces deprecated `framer-motion`. CSS keyframes still preferred for the PartnersMarquee.
- **`lucide-react`** — tree-shakable industrial line icons (Phone, MessageCircle for Zalo, Truck, Ship, Hammer)
- **Self-hosted fonts** — Be Vietnam Pro (variable, full Vietnamese subset) for body; **see Font Strategy contradiction below** for display font
- **No third-party SEO package** — `app/sitemap.ts` + `app/robots.ts` + `metadata` exports cover the entire 2-route surface
- **Static OG PNG in `/public/`** — not `ImageResponse` (Satori's CSS subset and Vietnamese diacritic handling are fragile)

**Deployment:** Cloudflare Pages (unlimited bandwidth, free, commercial-use OK, Vietnam edge POPs, free cookieless analytics). Vercel is fine as #2. **GitHub Pages is ruled out** — its ToS prohibits primarily commercial sites.

**Analytics:** Cloudflare Web Analytics (free, cookieless, no consent banner needed in VN/EU).

### Expected Features

Full landscape in [FEATURES.md](./FEATURES.md). The current design spec already maps cleanly to MVP — research **validates rather than challenges** the approved scope.

**Must have (table stakes — Vietnamese B2B convention):**
- Sticky nav with visible hotline `092 198 55 99` (older buyers scan for this within 2–3 seconds)
- FloatingZalo button bottom-right, every page (85% of Vietnamese use Zalo)
- Company legal info in footer with MST `1102 107 064` (buyers verify on dangkykinhdoanh.gov.vn)
- Project portfolio with named clients — **Bộ Quốc phòng / Binh đoàn 12 / Trường Sơn is the single strongest possible Vietnamese credential**, must be front-and-center
- Honest BigStats (company founded 2025 — use tonnage hauled, named projects, fleet size; never "20 năm kinh nghiệm")
- 3-channel contact: `tel:` / `zalo.me/` / `mailto:` — no contact form
- Mobile-first responsive (375–1440px), body text ≥16px (audience skews older), 44×44px tap targets
- HTTPS + page load < 3s on 4G + SEO foundation (metadata, OG, sitemap, robots, favicon)

**Should have (differentiators for Khang Thịnh):**
- Partners marquee headlining military/government partnerships (text-only — logo image is a copyright risk, hard legal constraint)
- Lighthouse Performance ≥90 (most VN construction sites load 5–15s; <2s = instant quality signal)
- Industrial Burgundy/Bone palette (separates from template-farm blue/yellow VN construction sites)
- Anchor-driven single-page layout with 8 CTA touchpoints converging on call/Zalo
- `/du-an` list page with named clients + Cà Mau locations + scope

**Defer (v1.x post-launch):**
- Google Business Profile registration + Maps embed (biggest local SEO lever for Tây Ninh/Bến Lức)
- Schema.org `GeneralContractor` JSON-LD (recommended at launch — see Pitfall 6)
- Real project photos (currently CSS pattern placeholders)
- Custom 404 page (`app/not-found.tsx`)

**Defer (v2+, validate first):**
- `/du-an/[slug]` detail pages (needs more content per project first)
- Blog/News (only with committed content cadence)
- Service-specific landing pages for SEO long-tail

**Active anti-features (DO NOT build):**
- Contact form (B2B VLXD buyers call, don't fill forms; spam magnet)
- Live chat non-Zalo (VN users distrust generic widgets)
- Public price list (cát-đá prices are quote-driven; fixed prices either over-promise or lose negotiating room)
- Customer testimonials (generic "Anh Tuấn rất hài lòng" reads fake; named project clients are infinitely stronger)
- English/i18n version, CMS, newsletter, hero video, Hero slider, cookie consent banner

### Architecture Approach

Full detail in [ARCHITECTURE.md](./ARCHITECTURE.md). The architecture is a **server-first static export**: every component renders to HTML at build time; only `Nav` (scroll listener + mobile menu state) and possibly an animated `BigStats` need `'use client'`. Design tokens flow one-way from `@theme` in `globals.css` to Tailwind utilities into JSX. Company facts and the projects array live in `lib/site.ts` and `lib/projects.ts` as the single source of truth for sitemap, robots, footer, Contact section, and FloatingZalo (prevents the classic "phone number wrong in three places" bug).

**Major components:**
1. **`app/` (routes)** — `layout.tsx` (fonts, root metadata, JSON-LD), `page.tsx` (compose sections), `du-an/page.tsx`, `sitemap.ts`, `robots.ts`. Thin — no business logic.
2. **`components/sections/*`** — One Server Component per landing section, props-free, content hardcoded inline (marketing site YAGNI; reusability is a wrong goal here)
3. **`components/Nav.tsx` + `Footer.tsx` + `FloatingZalo.tsx`** — Persistent shell lives in `layout.tsx`, not in `page.tsx`
4. **`lib/site.ts` + `lib/projects.ts`** — Typed constants; single source of truth for company info and projects
5. **`globals.css` `@theme`** — Burgundy/Bone palette + font tokens; semantic aliases at `:root` for dark-mode future-proofing
6. **CSS-first animations** — `@keyframes` marquee, `scroll-behavior: smooth`, `prefers-reduced-motion` respect. JS animations only where CSS can't express the effect.

### Critical Pitfalls

Full list (16 pitfalls) in [PITFALLS.md](./PITFALLS.md). The top five that must be addressed in Phase 1:

1. **Silent feature breakage from `output: 'export'`** — Server Actions, non-GET Route Handlers, middleware, `cookies()`/`headers()`, and ISR all silently fail or are stripped. Lock the config in Phase 1 and add a CI step that runs `next build` (not just `dev`) on every PR.
2. **`basePath` breaking every asset URL on a misconfigured deploy** — Deploy a "hello world" to the chosen target BEFORE any UI work. If GitHub Pages were used (ruled out for ToS reasons anyway), `.nojekyll` + `basePath` + `assetPrefix` are all required. On Cloudflare Pages / Vercel, no basePath needed.
3. **Bebas Neue has no Vietnamese diacritics** — Any Vietnamese headline (e.g. "KHANG THỊNH", "ĐỘI TÀU") in `font-display` will visibly break with fallback glyphs. Either restrict Bebas to numerals + ASCII (stats like "3,900", year "2025"), use Be Vietnam Pro Bold + uppercase + tracking for Vietnamese display text, or swap to Oswald (closest substitute with full diacritic coverage). **The design spec currently assigns Bebas Neue to display globally — this is the most important spec-vs-reality contradiction.**
4. **Tailwind v4 `@theme` namespace mistakes** — `--color-*`, `--font-*`, `--spacing-*`, `--radius-*` etc. are reserved namespaces that generate utilities. Custom vars outside these namespaces produce no utility class (silent failure). Delete any v3 leftover `tailwind.config.js`; use `@import "tailwindcss"` not the v3 `@tailwind base/components/utilities` syntax.
5. **Hero LCP fail on rural 4G** — Static export disables Next.js's runtime image optimizer. Pre-optimize at build (sharp/squoosh → AVIF + WebP + JPG fallback). Keep the design spec's discipline of CSS pattern hero in Phase 1; only swap to a real photo once it's < 150KB. Add `priority` and `<link rel="preload">` on the LCP image.

Honorable mentions worth flagging in the roadmap: missing `LocalBusiness` JSON-LD (invisible to Google Vietnam local search); broken `tel:`/Zalo CTAs from spaces in the `href` or wrong scheme (must use `tel:+84921985599` and `https://zalo.me/0921985599`, never `zalo://`); placeholder domain bleeding into sitemap and OG metadata (gate with `NEXT_PUBLIC_SITE_URL` env var); machine-translated-sounding Vietnamese copy (needs native-speaker review gate).

## Implications for Roadmap

Based on combined research, the suggested phase structure is **6 phases**, with all four research dimensions agreeing on the high-level order (config → shell → sections → list route → SEO/polish → launch). The design spec's "Migration Order" matches this; research mostly adds explicit pre-Phase-1 lock decisions and a SEO+JSON-LD step the spec under-emphasized.

### Phase 1: Foundation Lock-In (Setup & Theme)

**Rationale:** Five of the six critical pitfalls (`output: 'export'` quirks, basePath/deploy, font/diacritics, `@theme` namespaces, `metadataBase`) must be eliminated BEFORE any section work — otherwise rework is painful. The font and deploy-target choices in particular ripple through every later phase.

**Delivers:** `next.config.ts` with `output: 'export'` + `images.unoptimized` + `trailingSlash`; `globals.css` with full Burgundy/Bone `@theme` tokens; `layout.tsx` with `metadataBase`, fonts (decision locked), root metadata, `lang="vi"`; `lib/site.ts` with company constants gated by `NEXT_PUBLIC_SITE_URL`; "Hello world" deployed end-to-end to chosen target with custom domain DNS pointed.

**Addresses (features):** SEO foundation; HTTPS; mobile responsive baseline tokens; Vietnamese diacritic correctness baseline.

**Avoids (pitfalls):** #1 (silent `output: 'export'` breakage), #2 (basePath asset 404s), #3 (font/diacritic breakage), #4 (Tailwind v4 namespace), #15 (`metadataBase` warning).

**Lock-in checklist before exit:** font decision, deploy target, domain (or env-var contract), `.nojekyll`/CNAME if applicable, ESLint rule banning `"use server"` and `cookies()` imports.

### Phase 2: Layout Shell (Nav + Footer + FloatingZalo)

**Rationale:** Shell appears on every route — building it before sections means the `/du-an` page in Phase 4 inherits it for free, and CTAs (Zalo/tel) can be smoke-tested on real devices early.

**Delivers:** `Nav.tsx` (sticky, scroll-shadow, mobile menu, anchor links), `Footer.tsx` (legal info — MST/ĐDPL/address/phone/email from `lib/site.ts`), `FloatingZalo.tsx` (fixed bottom-right with `aria-label`, 56×56px touch target, hover/active state).

**Uses (stack):** Next.js `<Link>`, `lucide-react` icons, `motion` (optional for Nav fade-in only).

**Implements (architecture):** Pattern 1 (Server-First — `Nav` is the one Client Component), Pattern 3 (Tailwind v4 tokens), Pattern 9 (sticky nav + scroll-margin-top).

**Avoids (pitfalls):** #7 (broken tel/Zalo CTAs — real-device test gates this phase exit), #2 anchor-target hidden by sticky nav.

### Phase 3: Landing Sections (Hero through Contact)

**Rationale:** The 8 sections are the bulk of the work but share no architectural complexity once Phase 1 + 2 are locked. Build in design-spec order; each section is a Server Component with hardcoded inline copy.

**Delivers:** Hero, PartnersMarquee (CSS-only — text only, no logos), Services, Projects, BigStats, Capabilities, CtaQuote, Contact sections composed into `app/page.tsx`.

**Uses (stack):** Tailwind utilities + `lucide-react` + CSS `@keyframes` for marquee; `motion` only for Hero reveals and optional BigStats count-up.

**Implements (architecture):** Pattern 2 (props-free section composition), Pattern 7 (CSS-first animations), Pattern 10 (image strategy — CSS pattern hero in Phase 1).

**Avoids (pitfalls):** #5 (Hero LCP — keep CSS pattern), #8 (B2B trust copy — Vietnamese-native gate), #12 (marquee jank — `transform: translateX` only).

### Phase 4: Projects Data + `/du-an` List

**Rationale:** Comes after sections because both `Projects.tsx` (landing) and `/du-an/page.tsx` import from the same `lib/projects.ts` — defining the data once unblocks both.

**Delivers:** Typed `lib/projects.ts` with 4 projects (slug, title, client, location, year, scope, summary), `app/du-an/page.tsx` rendering the list with named clients and scope, anchor link from landing Projects section.

**Uses (stack):** TypeScript const arrays (Pattern 4), Next.js App Router.

**Avoids (pitfalls):** #11 (anchor-only-SEO weakness — `/du-an` adds a second indexable URL; rich h2 structure on landing for keyword spread).

### Phase 5: SEO + Schema + Polish

**Rationale:** Programmatic sitemap/robots need `lib/site.ts` and the final route list to be stable, so this naturally lands after Phase 4. JSON-LD must match displayed NAP exactly — only safe to author once Footer and Contact copy are frozen.

**Delivers:** `app/sitemap.ts` + `app/robots.ts` (programmatic, use `siteUrl` from `lib/site.ts`); `LocalBusiness` / `GeneralContractor` JSON-LD in `layout.tsx` with `+84` phone, MST as `taxID`, `areaServed` (Tây Ninh / Long An / Cà Mau / TP.HCM); static `/public/og-image.png` (1200×630); favicon; `app/not-found.tsx`; `metadataBase` verified; CTA copy in Vietnamese B2B register reviewed.

**Avoids (pitfalls):** #6 (missing LocalBusiness JSON-LD — invisible to Google VN local search), #10 (sitemap/OG under wrong domain — must be gated behind env var), #14 (default 404), #8 (Vietnamese-native copy review gate).

### Phase 6: Audit + Launch

**Rationale:** Lighthouse + real-device + Vietnamese-native review are the gate-keepers. Submitting sitemap to GSC must wait until domain is locked and content reviewed (resubmitting wrong sitemap creates weeks of recovery).

**Delivers:** Lighthouse Performance ≥90 / SEO ≥95 / A11y ≥90 (mobile profile, throttled); real-device CTA smoke test (iOS Safari, Android Chrome, Facebook in-app, Zalo in-app); Vietnamese-native copy review signed off; Cloudflare Pages production deploy; GSC + Bing Webmaster Tools verification; sitemap submission; Cloudflare Web Analytics enabled.

**Avoids (pitfalls):** All "Looks Done But Isn't" checklist items (PITFALLS.md lines 462–485).

### Phase Ordering Rationale

- **Config-before-features** prevents 5 of 6 critical pitfalls from manifesting and is non-negotiable
- **Shell-before-sections** lets `/du-an` inherit Nav/Footer for free in Phase 4 and front-loads real-device CTA testing
- **Sections-before-projects-data** is a slight departure from the design spec's "data first" order, justified because the design spec already includes inline placeholder copy in each section file — and section structure stabilizes the project card markup before the data shape is committed
- **SEO+Schema after data stable** prevents JSON-LD NAP drift from displayed copy
- **Audit-as-its-own-phase** because Lighthouse + native copy review + real-device testing genuinely takes a day or more and routinely uncovers Phase-3 rework

### Research Flags

Phases likely needing deeper research during planning:

- **Phase 1 (Foundation):** Needs an explicit decision-doc resolving the **font-loading contradiction** (`next/font/google` vs `@fontsource`) AND the **Bebas Neue diacritic question** before writing `layout.tsx`. Suggest a 30-minute spike to test all three Vietnamese-display options visually.
- **Phase 5 (SEO + Schema):** JSON-LD `@type` selection (`GeneralContractor` vs `LocalBusiness` vs a `@graph` with `Organization` + `LocalBusiness`) for Google VN local search benefits warrants 1 hour of validation against Rich Results Test.

Phases with standard, well-documented patterns (skip `/gsd:research-phase`):

- **Phase 2 (Layout Shell):** Sticky nav + floating CTA is one of the most documented patterns in Next.js.
- **Phase 3 (Landing Sections):** Pure presentational components; no integration unknowns.
- **Phase 4 (Projects data):** Static TS const + `generateStaticParams()` (if needed later) is bog-standard.
- **Phase 6 (Audit + Launch):** Lighthouse + GSC submission is rote.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | **HIGH** | Core decisions verified against Next.js, Tailwind, Motion, Lucide, Fontsource official docs and current npm. Deployment trade-offs MEDIUM (no single winner — depends on org preference) |
| Features | **MEDIUM-HIGH** | VN construction site conventions corroborated across multiple agency blogs + Coteccons/Vinaconex direct inspection. Conversion psychology claims are reasoned from industry knowledge — flagged for Vietnamese-native validation |
| Architecture | **HIGH** | Next.js + Tailwind v4 + static export are all current as of May 2026; patterns verified against official docs. Animation library choice MEDIUM (community consensus but no canonical source) |
| Pitfalls | **HIGH** | Verified against official Next.js, Tailwind docs, GitHub issues, Google for Developers. Vietnamese B2B copy pitfalls MEDIUM — reasoned from industry patterns |

**Overall confidence:** **HIGH on technical decisions; MEDIUM on conversion/copy psychology.**

### Gaps to Address

1. **Display font for Vietnamese headlines** — Design spec's `--font-display: "Bebas Neue"` conflicts with the hard fact that Bebas Neue has no Vietnamese diacritics. **Resolve in Phase 1 spike.** Three options: (a) restrict Bebas to numerals/ASCII; (b) drop Bebas, use Be Vietnam Pro Bold for display; (c) swap to Oswald.
2. **Font-loading approach** — Two valid options: `next/font/google` (simpler, requires network at `next build`) vs `@fontsource` self-host (offline-buildable, deterministic). Either works; pick before Phase 1 ends.
3. **Production domain** — `khangthinhinv.vn` is a placeholder. Must be locked before Phase 5 (sitemap/OG/JSON-LD) and Phase 6 (GSC submission). Gate behind `NEXT_PUBLIC_SITE_URL` env var until then; never hardcode.
4. **Deploy target** — Recommendation Cloudflare Pages; user may prefer Vercel. **GitHub Pages is ruled out** by its no-commercial-use ToS — confirm user agreement before Phase 1.
5. **Logo asset** — Currently planned to extract from `Illustration.png`; quality not yet verified. Phase 1 should produce a usable SVG or PNG.
6. **Project photos** — Not available at Phase 1. Plan: CSS pattern placeholders ship; sharp-based optimization script lands when real photos arrive (likely v1.x post-launch). Do not block launch on photos.
7. **Vietnamese copy review** — A native reviewer (not the developer, not AI) must sign off every line before launch. Schedule this in Phase 6.
8. **Phone formatting** — Display as `092 198 55 99`, but `tel:` `href` MUST be `tel:+84921985599` (E.164, no spaces). Confirm this convention is enforced everywhere via `lib/site.ts`.

### What to Lock Now (Pre-Phase-1 Decisions Checklist)

Before kicking off Phase 1, the following must be locked in writing:

- [ ] **Deploy target:** Cloudflare Pages (recommended) / Vercel / Netlify — **NOT** GitHub Pages (commercial-use ToS conflict)
- [ ] **Display font strategy:** (a) Bebas-numerals-only + Be Vietnam Pro display, (b) Be Vietnam Pro display only, or (c) Oswald replacement. Run a 30-min visual spike with "KHANG THỊNH ĐỘI TÀU 3,900 TẤN" sample text.
- [ ] **Font loading mechanism:** `next/font/google` vs `@fontsource` (either works — pick one)
- [ ] **Production domain:** real `.vn` domain registered OR firm placeholder + `NEXT_PUBLIC_SITE_URL` env-var contract documented
- [ ] **Analytics:** Cloudflare Web Analytics (recommended if Cloudflare Pages) vs Plausible vs none-at-launch
- [ ] **Logo:** SVG/PNG asset extracted from `Illustration.png` and approved
- [ ] **CTA convention:** `tel:+84921985599` for href, `092 198 55 99` for display, `https://zalo.me/0921985599` for Zalo, plain-text email next to mailto link
- [ ] **JSON-LD `@type`:** `GeneralContractor` (recommended) vs `LocalBusiness`
- [ ] **CI gate:** GitHub Actions runs `next build` (not just `dev`) on every PR
- [ ] **ESLint rule:** ban `"use server"`, `cookies()`, `headers()` imports (forces awareness of `output: 'export'` constraints)

## Sources

### Primary (HIGH confidence)
- **Next.js official docs** — [Static Exports](https://nextjs.org/docs/app/guides/static-exports), [sitemap.ts](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap), [robots.ts](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots), [next/font](https://nextjs.org/docs/app/api-reference/components/font), [Image](https://nextjs.org/docs/app/api-reference/components/image)
- **Tailwind CSS v4 docs** — [Theme variables](https://tailwindcss.com/docs/theme), [Upgrade guide](https://tailwindcss.com/docs/upgrade-guide)
- **Motion (motion.dev)** — React 19 compatibility, v12.39 changelog
- **Google for Developers** — [LocalBusiness structured data](https://developers.google.com/search/docs/appearance/structured-data/local-business)
- **Google Fonts metadata** — Be Vietnam Pro vietnamese subset confirmed; Bebas Neue lacks Vietnamese
- **GitHub issue trackers** — [#67503 Server Actions in static exports](https://github.com/vercel/next.js/discussions/67503), [#73427 basePath static export](https://github.com/vercel/next.js/issues/73427), [tailwind #15735 PostCSS plugin](https://github.com/tailwindlabs/tailwindcss/issues/15735)

### Secondary (MEDIUM confidence)
- **VietnamNet, Statista, Subiz, Prodima** — Vietnamese mobile/Zalo usage statistics
- **AppLabX, Ranktracker, Cyno, VLink** — SEO Vietnam patterns including local search and GBP
- **LogRocket, PkgPulse, Motion Magazine** — React animation library and icon library comparisons
- **DanubeData** — Cloudflare Pages / Netlify / Vercel comparison
- **Sentry, DebugBear, Wallis** — web font CLS, image LCP, Next.js basePath writeups
- **Coteccons, Vinaconex** — direct competitor inspection
- **Zalo Developers community** — `zalo.me/{phone}` HTTPS deep-link pattern

### Tertiary (LOW confidence — needs validation)
- Vietnamese B2B copy / trust-pattern observations (industry knowledge — Vietnamese-native reviewer is the validation gate)
- Specific Bến Lức / Tây Ninh local search keyword competitiveness (no GSC data yet)

### Internal
- `.planning/PROJECT.md` — project goals, scope, constraints
- `.planning/research/STACK.md`, `FEATURES.md`, `ARCHITECTURE.md`, `PITFALLS.md` — full research
- `docs/superpowers/specs/2026-05-26-khangthinh-theme-migration-design.md` — approved design spec

---
*Research completed: 2026-05-26*
*Ready for roadmap: yes — pending the "What to Lock Now" checklist above*
