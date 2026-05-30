# Roadmap — Milestone v2.0 (Full Corporate Website)

**Created:** 2026-05-30
**Granularity:** medium (12 phases)
**Mode:** autonomous (auto-advance enabled)
**v1.0 archive:** see `ROADMAP-v1.0.md`

## Phase Map

Each phase below is a self-contained chunk that:
- Builds on the previous phase (no skip)
- Has clear deliverables + verification gates
- Can be run via `/gsd:autonomous` or `/gsd:execute-phase {N}` individually

### Phase 07 — Re-research stack v2.0

**Goal:** Solidify all net-new library choices via deep research before building anything.

**Research targets:**
- Motion v12 best patterns for marketing site (page transitions + scroll reveal)
- next-intl v3 with App Router static export
- next-themes with Tailwind 4 dark mode
- Cloudflare Workers Email + form submission patterns (production-grade)
- @next/mdx integration with Next 15 App Router
- Pagefind for static search
- @vercel/analytics setup
- Bundle size impact analysis

**Deliverable:** `07-research-stack-v2/RESEARCH.md` with locked versions + integration notes
**Wave:** 1

### Phase 08 — Architecture refactor (nav, layout shell v2, design tokens)

**Goal:** Rebuild navigation + layout to support multi-page + i18n + dark mode.

**Plans:**
- 08-01 Multi-level Navbar with dropdown for `/dich-vu/*` + mobile accordion
- 08-02 Breadcrumbs component
- 08-03 Layout shell v2 (root layout supports `[locale]`)
- 08-04 Dark mode setup (next-themes + Tailwind dark: variant + extended palette)
- 08-05 Animation primitives (Reveal, Parallax, CountUp, MagneticButton)

**Deliverable:** All routes still work, nav supports future deep pages
**Wave:** 1 (sequential within phase)
**Requirements covered:** NAV-01..07, ANIM-02/06/09/10, DARK-01..05

### Phase 09 — Landing premium upgrade (`/`)

**Goal:** Rebuild landing page with v2.0 polish.

**Plans:**
- 09-01 Hero premium (parallax bg, animated SVG logo, tagline visible, big typography)
- 09-02 PartnersMarquee smooth animation
- 09-03 Services premium cards (gradient placeholder + hover lift + 5 sub-bullets)
- 09-04 BigStats with count-up + honest numbers
- 09-05 Process timeline section (5-step workflow)
- 09-06 Cam kết chất lượng section (4-card commitment)
- 09-07 Testimonials carousel (5 quotes)
- 09-08 CTA Quote section premium
- 09-09 Footer v2 (newsletter signup + sitemap + more links)

**Deliverable:** Landing page premium feel, ~10 sections rich content
**Wave:** Multiple waves by dependency
**Requirements covered:** ROUTE-01, ANIM-02..06, CONTENT-07/08/09, TRUST-02/03

### Phase 10 — About page (`/ve-chung-toi`)

**Goal:** Full company introduction page.

**Plans:**
- 10-01 Page scaffolding + Hero variant
- 10-02 Lịch sử công ty section (timeline)
- 10-03 Sứ mệnh / Tầm nhìn / Giá trị section
- 10-04 Sơ đồ tổ chức (SVG org chart)
- 10-05 Đội ngũ lãnh đạo (cards with photos placeholder)
- 10-06 Giấy phép & Chứng chỉ section
- 10-07 CTA contextual + related links

**Deliverable:** `/ve-chung-toi` live with deep content
**Wave:** sequential
**Requirements covered:** ROUTE-02, CONTENT-01, TRUST-01

### Phase 11 — Services hub + 3 detail pages

**Goal:** `/dich-vu` overview + 3 service detail pages.

**Plans:**
- 11-01 Services data module (`lib/services.ts`) — single source of truth
- 11-02 `/dich-vu` hub page (3 large cards with hover preview)
- 11-03 `/dich-vu/cung-ung-vlxd` detail page
- 11-04 `/dich-vu/xay-dung` detail page
- 11-05 `/dich-vu/van-chuyen-duong-thuy` detail page
- 11-06 FAQ schema markup per service page
- 11-07 Related projects component (consumes lib/projects)

**Deliverable:** 4 service routes live, content depth per service
**Wave:** 03 + 04 + 05 parallel after 11-01/11-02
**Requirements covered:** ROUTE-03..06, CONTENT-02, TRUST-05

### Phase 12 — Capabilities deep (`/nang-luc`)

**Goal:** `/nang-luc` standalone page with 3 capability tabs.

**Plans:**
- 12-01 Capabilities data module (`lib/capabilities.ts`)
- 12-02 Page Hero + intro
- 12-03 Tabs UI (Đội tàu / Cơ giới / Đội xây lắp) — accessible tabs pattern
- 12-04 Equipment placeholder cards with stat badges
- 12-05 An toàn lao động section
- 12-06 Chứng chỉ năng lực section

**Deliverable:** `/nang-luc` live with deep capability info
**Wave:** sequential
**Requirements covered:** ROUTE-07, CONTENT-03

### Phase 13 — Projects detail (`/du-an/[slug]`)

**Goal:** Dynamic project detail pages framework + upgrade `/du-an` list.

**Plans:**
- 13-01 Extend lib/projects with detail fields (gallery, volume, duration, role, testimonial)
- 13-02 `/du-an` list upgrade (filter by year/type, search)
- 13-03 `/du-an/[slug]` dynamic route with generateStaticParams
- 13-04 Project hero + gallery placeholder
- 13-05 Project meta (year/client/volume/duration/role table)
- 13-06 Related projects + CTA back to list
- 13-07 OG image per project (build-time)

**Deliverable:** 4 project detail pages live (placeholder content), filter on list
**Wave:** sequential within phase
**Requirements covered:** ROUTE-08/09, CONTENT-04

### Phase 14 — Contact page + form backend (`/lien-he` + Worker)

**Goal:** Full contact page with working form submission.

**Plans:**
- 14-01 Cloudflare Worker scaffold (`workers/quote-form/`) — separate deploy
- 14-02 Worker: validate + email + rate limit + honeypot
- 14-03 `/lien-he` page Hero + intro
- 14-04 Quote form component (react-hook-form + Zod)
- 14-05 Form success/error states
- 14-06 Google Maps embed + giờ làm việc + 4 kênh contact
- 14-07 Worker deploy + smoke test

**Deliverable:** `/lien-he` live, form submission works end-to-end (test email)
**Wave:** Worker (14-01/02/07) parallel to UI (14-03/04/05/06)
**Requirements covered:** ROUTE-10/14, FORM-01..09, CONTENT-05

### Phase 15 — Blog system (`/tin-tuc` + MDX)

**Goal:** MDX blog with 3-5 sample posts.

**Plans:**
- 15-01 @next/mdx setup with rehype/remark + frontmatter validation
- 15-02 Blog list page `/tin-tuc` with pagination
- 15-03 Blog detail page `/tin-tuc/[slug]` with reading time + TOC
- 15-04 3 sample posts (giả định) — VLXD trends, dự án Quốc phòng, kinh nghiệm xây dựng
- 15-05 Tag filter + RSS feed
- 15-06 Article schema markup

**Deliverable:** Blog live with 3 sample posts
**Wave:** sequential
**Requirements covered:** ROUTE-11/12, MDX-01..08, SEO-02

### Phase 16 — i18n (VI default + EN fallback)

**Goal:** Add EN translations for all static text.

**Plans:**
- 16-01 next-intl v3 setup with `[locale]` route segment
- 16-02 Middleware for locale detection
- 16-03 Translation files: `vi.json` + `en.json` for all UI strings
- 16-04 Language switcher component
- 16-05 hreflang metadata + translated OG
- 16-06 Sitemap include both locales

**Deliverable:** All routes work at `/vi/...` and `/en/...`
**Wave:** sequential (touches every component)
**Requirements covered:** I18N-01..06, SEO-06

### Phase 17 — Extras (Search, PWA, Analytics, polish)

**Goal:** Final extras + polish.

**Plans:**
- 17-01 Vercel Analytics integration + Web Vitals
- 17-02 Pagefind static search + Cmd-K modal
- 17-03 PWA manifest + service worker (offline shell)
- 17-04 Custom 404 + 500 pages
- 17-05 Newsletter signup form (Cloudflare Worker)
- 17-06 Animated SVG logo (path draw on load)
- 17-07 Magnetic button effect for primary CTAs
- 17-08 Loading skeletons for client components

**Deliverable:** All bells + whistles polished
**Wave:** parallel where possible
**Requirements covered:** ANALYTICS-01..03, SEARCH-01..03, PWA-01..03, ANIM-07/08/09

### Phase 18 — Audit + Launch v2.0

**Goal:** Final QA, Lighthouse, real-device testing, ship v2.0 live.

**Plans:**
- 18-01 Lighthouse all 14+ routes (Performance ≥85, SEO ≥95, A11y ≥95)
- 18-02 Schema.org validation all pages
- 18-03 Real-device testing (iPhone Safari + Android Chrome) — CTA matrix, form submit, navigation
- 18-04 Broken link check
- 18-05 Bundle analysis + tree-shake review
- 18-06 Update README + deploy docs
- 18-07 Update STATE / milestone-summary v2.0
- 18-08 Final push to Vercel + smoke test live

**Deliverable:** v2.0 live, audited, documented
**Wave:** sequential
**Requirements covered:** NFR-* + final ship

## Dependency Graph

```
Phase 07 (research) → BLOCKS everything below
Phase 08 (architecture) → BLOCKS 09..17
Phase 09 (landing) → independent after 08
Phase 10 (about) → independent after 08
Phase 11 (services) → depends on lib/services + 08
Phase 12 (capabilities) → depends on lib/capabilities + 08
Phase 13 (projects detail) → depends on lib/projects extend + 08
Phase 14 (contact + form) → independent after 08 (Worker is separate deploy)
Phase 15 (blog) → independent after 08
Phase 16 (i18n) → SHOULD run AFTER 09..15 (touches every component)
Phase 17 (extras) → AFTER 16
Phase 18 (launch) → LAST
```

## Estimated Velocity

12 phases × avg 5-7 plans each = ~70-85 plans total. v1.0 averaged 10 plans across 6 phases over 4-5 days. v2.0 will take meaningfully longer — autonomous mode + parallel waves help.

No timeline pressure per user instruction.

## Success Criteria (Milestone v2.0)

- [ ] All 14+ routes live on Vercel
- [ ] Form submission works end-to-end (Worker live)
- [ ] All Lighthouse scores meet NFR targets
- [ ] i18n VI/EN both functional
- [ ] Dark mode toggle works
- [ ] Blog has 3+ posts
- [ ] User sees the site and feels "đẳng cấp doanh nghiệp"
