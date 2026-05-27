# Roadmap: Khang Thịnh Investment Website

**Created:** 2026-05-26
**Granularity:** coarse (target 6 phases)
**Mode:** standard (verify gates enabled)
**Parallelization:** false (sequential)
**Core Value:** Khách hàng tiềm năng — sau khi xem website — tin tưởng đủ để gọi/Zalo liên hệ tư vấn

## Coverage

- v1 requirements: 38
- Mapped to phases: 38
- Unmapped: 0
- Status: 100% coverage validated

## Phases

- [ ] **Phase 1: Foundation Lock-In** — Static-export config, design tokens, fonts (Vietnamese diacritics), `lib/site.ts`, skeleton cleanup, "hello world" deploy
- [ ] **Phase 2: Layout Shell** — Sticky Nav, Footer (legal info), FloatingZalo button; real-device CTA smoke test
- [ ] **Phase 3: Landing Sections** — 8 sections (Hero → PartnersMarquee → Services → Projects → BigStats → Capabilities → CtaQuote → Contact) composed in `app/page.tsx`
- [ ] **Phase 4: Projects Data + `/du-an` List** — Typed `lib/projects.ts` + `/du-an` route consuming same source of truth
- [ ] **Phase 5: SEO + Schema + Polish** — sitemap.ts, robots.ts, JSON-LD `GeneralContractor`, static OG image, favicon, 404 page
- [ ] **Phase 6: Audit + Launch** — Lighthouse audit, real-device CTA test, Cloudflare Pages deploy, Web Analytics, README

## Phase Details

### Phase 1: Foundation Lock-In

**Goal**: Lock the configuration, design tokens, fonts, and constants so every later phase builds on a stable, statically-exportable foundation with correct Vietnamese rendering.

**Depends on**: Nothing (first phase)

**Requirements**: FND-01, FND-02, FND-03, FND-04, FND-05, FND-06, FND-07

**Success Criteria** (what must be TRUE):
  1. `npm run build` succeeds and produces `/out/` with static HTML for `/` and any existing routes (no Server Action / dynamic-render errors)
  2. Burgundy/Bone palette utilities (`bg-burgundy`, `text-bone`, `bg-espresso`, etc.) render correctly when applied to any element (Tailwind v4 `@theme` working)
  3. Vietnamese diacritics ("KHANG THỊNH ĐỘI TÀU 3,900 TẤN") render with correct glyphs — no fallback breakage — across all configured weights of Be Vietnam Pro
  4. Changing `NEXT_PUBLIC_SITE_URL` in `.env.local` propagates to a sample `console.log(siteUrl)` from `lib/site.ts` at build time; phone/Zalo/email constants importable from a single module
  5. Old skeleton folders (`src/app/dich-vu/`, `src/app/lien-he/`, `src/components/Header.tsx`) deleted; build still passes

**Plans**: 2 plans (Wave 1 + Wave 2 — sequential, second depends on first)
- [x] 01-01-config-tokens-fonts.md — Lock next.config.ts + Tailwind v4 @theme Burgundy/Bone + Be Vietnam Pro via next/font/google (Wave 1, FND-01..04)
- [x] 01-02-site-constants-cleanup.md — Create lib/site.ts single source of truth + wire NEXT_PUBLIC_SITE_URL + delete skeleton folders (Wave 2, FND-05..07)

**Risk callouts** (from PITFALLS.md):
- Pitfall #1: silent feature breakage from `output: 'export'` — bake config + CI build check now
- Pitfall #3: Vietnamese diacritic fallback — confirm `subsets: ['latin', 'vietnamese']` AND do NOT assign Bebas Neue to Vietnamese text
- Pitfall #4: Tailwind v4 `@theme` namespace mistakes — verify each color token generates a utility class
- Pitfall #15: `metadataBase` warning — set explicitly in `layout.tsx`

**Research needed**: YES — 30-min spike to resolve (a) display-font strategy for Vietnamese (Bebas-numerals-only vs Be Vietnam Pro Bold display vs Oswald replacement) and (b) `next/font/google` vs `@fontsource` self-host. Per SUMMARY.md the project will use `next/font/google` with explicit Vietnamese subset and a Be Vietnam Pro Bold-display strategy unless the spike surfaces a blocker.

### Phase 2: Layout Shell

**Goal**: Persistent shell (Nav + Footer + FloatingZalo) renders on every route, exposes the hotline + Zalo + email CTAs, and is real-device smoke-tested before any section work begins.

**Depends on**: Phase 1 (needs `lib/site.ts`, design tokens, font wiring, working static build)

**Requirements**: SHELL-01, SHELL-02, SHELL-03, SHELL-04, SHELL-05

**Success Criteria** (what must be TRUE):
  1. Nav is sticky at top on scroll, shows logo + 5 anchor links + "Báo giá" CTA + visible hotline on desktop, collapses to a working mobile menu under 768px
  2. Footer displays full legal info (MST 1102 107 064, ĐDPL Tô Thị Bích Ngọc, address A3-02 KDC Long Phú, Bến Lức, Tây Ninh, phone, email) sourced from `lib/site.ts`
  3. FloatingZalo button is fixed bottom-right on every page, ≥56×56px touch target, deep-links to `https://zalo.me/0921985599`, has `aria-label="Chat Zalo với Khang Thịnh"`
  4. Clicking nav anchors (`#services`, `#projects`, `#capabilities`, `#contact`) smooth-scrolls to placeholder section anchors with `scroll-margin-top` accounting for the sticky nav (no content hidden under nav)
  5. Real-device smoke test passes: on iOS Safari and Android Chrome, tapping the Nav hotline opens the dialer, tapping FloatingZalo opens Zalo app/web, mailto link composes an email
  6. Root `layout.tsx` declares default metadata (title template, description, OG image stub, `metadataBase`, viewport, `lang="vi"`) and renders Nav/Footer/FloatingZalo around `{children}`

**Plans**: 2 plans (Wave 1 + Wave 2 — sequential; smoke test depends on shell)
- [x] 02-01-shell-components-PLAN.md — Nav + Footer + FloatingZalo + layout wiring + anchor placeholders (Wave 1, SHELL-01..05)
- [ ] 02-02-real-device-smoke-test-PLAN.md — iOS Safari + Android Chrome CTA + smooth-scroll verification (Wave 2, SHELL-03, SHELL-04)

**Risk callouts** (from PITFALLS.md):
- Pitfall #7: broken `tel:`/Zalo CTAs — use `tel:+84921985599` (E.164, no spaces) and `https://zalo.me/0921985599` (HTTPS), never `zalo://`
- UX Pitfall: sticky nav hiding anchor targets — apply `scroll-margin-top: 4.5rem` to `section[id]`
- UX Pitfall: tap targets <44×44px — enforce on all Nav buttons and FloatingZalo

**Research needed**: NO — sticky nav + floating CTA is one of the most documented patterns in Next.js (per SUMMARY.md flags).

**UI hint**: yes

### Phase 3: Landing Sections

**Goal**: All 8 landing sections render correctly in order, with hardcoded Vietnamese copy from the design spec and reusable typography/color tokens from Phase 1.

**Depends on**: Phase 2 (needs shell so sections render inside the live layout) and Phase 1 (tokens, fonts)

**Requirements**: SEC-01, SEC-02, SEC-03, SEC-04, SEC-05, SEC-06, SEC-07, SEC-08

**Success Criteria** (what must be TRUE):
  1. Visiting `/` shows the 8 sections in order: Hero → PartnersMarquee → Services → Projects → BigStats → Capabilities → CtaQuote → Contact, each separated by intentional vertical rhythm and using the Burgundy/Bone palette
  2. Hero displays a large uppercase Vietnamese headline (Be Vietnam Pro 900) + sub-text + 2 CTAs (Gọi 092 198 55 99 / Báo giá) with industrial CSS-pattern background — both CTAs are working tel/anchor links
  3. PartnersMarquee scrolls infinitely with CSS-only `@keyframes` (no JS), displays text "BINH ĐOÀN 12 · TRƯỜNG SƠN · BỘ QUỐC PHÒNG · …", and pauses for `prefers-reduced-motion: reduce`
  4. Services renders 3 cards (Cung ứng VLXD / Xây dựng dân dụng / Vận chuyển đường thủy) each with a lucide-react icon
  5. Projects section showcases 4 named projects (Cao tốc Cái Nước-Đất Mũi, Cầu Cửa Lớn, Đường ra Hòn Khoai, Nhà phố tiêu biểu) with named clients visible (Bộ Quốc phòng / Binh đoàn 12 / Trường Sơn front-and-center) and a "Xem tất cả → /du-an" link
  6. BigStats shows honest numbers (tonnage 700–3,900 tấn, 4 dự án tiêu biểu, năm thành lập 2025, đối tác Quốc phòng) — no fake "20 năm kinh nghiệm"
  7. Capabilities, CtaQuote (full-width espresso banner with "Yêu cầu báo giá" + prominent CTA), and Contact (info + 3 working CTA buttons tel/zalo/mailto with icons) all render correctly at 375px / 768px / 1280px breakpoints

**Plans**: TBD (estimated 2-3 plans for coarse granularity — likely Hero+Partners+Services in one, Projects+BigStats+Capabilities in another, CtaQuote+Contact+compose in a third)

**Risk callouts** (from PITFALLS.md):
- Pitfall #5: Hero LCP fail — keep CSS pattern (no real photo) in Phase 1, `priority` on any LCP element
- Pitfall #8: B2B trust copy — use Vietnamese B2B register ("Gọi ngay để tư vấn", "Báo giá VLXD"), avoid translated-Apple cadence, show MST and named clients prominently
- Pitfall #12: marquee jank on cheap Android — use `transform: translateX` only, add `will-change: transform`

**Research needed**: NO — pure presentational components; no integration unknowns.

**UI hint**: yes

### Phase 4: Projects Data + `/du-an` List

**Goal**: Project data lives in one typed module (`lib/projects.ts`) consumed by both the landing Projects section and the standalone `/du-an` list route, giving Google a second indexable URL.

**Depends on**: Phase 3 (Projects section structure stabilizes the card markup; lib then formalizes the data shape)

**Requirements**: PROJ-01, PROJ-02, PROJ-03

**Success Criteria** (what must be TRUE):
  1. `lib/projects.ts` exports a typed `Project[]` (fields: slug, title, client, location, year, scope, summary) covering the 4 v1 projects; landing Projects section refactors to import from this module
  2. Visiting `/du-an` renders a list of all projects (card layout) with named clients + Cà Mau locations + scope visible — no orphan placeholders
  3. `/du-an` page declares its own metadata (title "Dự án tiêu biểu | Khang Thịnh Investment", description, canonical) distinct from the root layout's defaults
  4. A "Quay lại trang chủ" or back link on `/du-an` returns the user to landing (anchored back at `#projects` if appropriate) and works after a fresh page load (not only via in-app navigation)

**Plans**: TBD (estimated 1-2 plans for coarse granularity)

**Risk callouts** (from PITFALLS.md):
- Pitfall #11: anchor-only-SEO weakness — `/du-an` provides a second indexable URL; ensure rich `h2`/`h3` structure on landing also
- Pitfall #2: trailing slash quirks — confirm `/du-an` and `/du-an/` both resolve correctly (`trailingSlash: true` should already be set in Phase 1)

**Research needed**: NO — static TS const + App Router list page is bog-standard (per SUMMARY.md flags).

### Phase 5: SEO + Schema + Polish

**Goal**: All SEO surfaces (sitemap, robots, OG image, favicon, structured data, 404) are wired correctly so the site is fully discoverable and shareable — with NAP consistency across UI, JSON-LD, and metadata.

**Depends on**: Phase 4 (route list `/` + `/du-an` must be final before sitemap; Footer + Contact copy must be frozen before JSON-LD mirrors NAP)

**Requirements**: SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, SEO-06

**Success Criteria** (what must be TRUE):
  1. `app/sitemap.ts` generates a valid XML sitemap with 2 entries (`/`, `/du-an`) using absolute URLs from `NEXT_PUBLIC_SITE_URL` — verified by viewing `/out/sitemap.xml` after build
  2. `app/robots.ts` generates a valid `robots.txt` that allows all crawlers and references the sitemap URL — verified by viewing `/out/robots.txt`
  3. Pasting the deployed URL into Zalo / Facebook Messenger / Slack shows the correct OG card (1200×630 PNG from `/public/og-image.png` with logo + tagline, title and description from `layout.tsx` metadata)
  4. The landing page emits a `GeneralContractor` JSON-LD `<script type="application/ld+json">` containing exact NAP (name "Công ty TNHH Khang Thịnh Investment", `telephone: "+84921985599"`, full PostalAddress with Bến Lức/Tây Ninh, `taxID: "1102107064"`, `areaServed`, services) — passes [Rich Results Test](https://search.google.com/test/rich-results) with no errors
  5. Browser tabs show the Khang Thịnh favicon (not the default Next.js triangle) across 16×16, 32×32, and apple-touch-icon 180×180 sizes
  6. Visiting any unknown route (e.g. `/khong-ton-tai`) renders a styled custom 404 (`app/not-found.tsx`) with branding + a clear link back to `/`

**Plans**: TBD (estimated 2 plans for coarse granularity — SEO infra + JSON-LD/OG/404 polish)

**Risk callouts** (from PITFALLS.md):
- Pitfall #6: missing/wrong LocalBusiness JSON-LD — use `+84` phone format, mirror NAP exactly across UI, JSON-LD, and (future) Google Business Profile
- Pitfall #10: sitemap/OG under wrong domain — every URL must come from `NEXT_PUBLIC_SITE_URL`; never hardcode the placeholder
- Pitfall #14: default 404 — ship `app/not-found.tsx`
- Pitfall #15: `metadataBase` already set in Phase 1 — verify no warning during build

**Research needed**: YES — 1-hour validation of JSON-LD `@type` choice (`GeneralContractor` vs `LocalBusiness` vs `@graph` of `Organization` + `LocalBusiness`) against Rich Results Test for Google VN local search benefits.

### Phase 6: Audit + Launch

**Goal**: The site passes a full quality audit (Lighthouse + real-device + Vietnamese-native copy review) and is deployed to Cloudflare Pages with analytics live and deploy instructions documented.

**Depends on**: Phase 5 (all features complete, JSON-LD/sitemap/OG live; final domain + content frozen before GSC sitemap submission)

**Requirements**: QA-01, QA-02, QA-03, QA-04, QA-05, QA-06, DEPLOY-01, DEPLOY-02, DEPLOY-03

**Success Criteria** (what must be TRUE):
  1. Manual responsive verification at 375px / 768px / 1280px shows no overflow, broken layout, or unreadable text on any page
  2. Lighthouse mobile (throttled) reports Performance ≥ 90, SEO ≥ 95, Accessibility ≥ 90, Best Practices ≥ 95 on both `/` and `/du-an`
  3. Every interactive element (nav links, CTA buttons, FloatingZalo, Footer links) has a tap target ≥ 44×44px, and body text is ≥ 16px throughout
  4. Real-device CTA smoke test: on iOS Safari, Android Chrome, Facebook in-app browser, and Zalo in-app browser — `tel:`, `mailto:`, and `https://zalo.me/0921985599` links all open the correct app/handler
  5. `npm run build` + `npx serve out/` produces zero console errors and zero broken asset 404s on either page
  6. The production build deployed to Cloudflare Pages is publicly reachable, served over HTTPS with a valid certificate, and Cloudflare Web Analytics records pageviews (production-only script — not in dev builds)
  7. `README.md` documents the deploy workflow: required env vars (`NEXT_PUBLIC_SITE_URL`), build command (`npm run build`), publish directory (`out/`), and Cloudflare Pages configuration steps

**Plans**: TBD (estimated 2 plans for coarse granularity — audit/QA pass + deploy/docs)

**Risk callouts** (from PITFALLS.md):
- All "Looks Done But Isn't" checklist items (PITFALLS.md lines 462–485) — work through them as the audit gate
- Pitfall #8: Vietnamese-native copy review — schedule a native reader (not the developer, not AI) to sign off every line before launch
- Pitfall #2 (recovery): if Cloudflare Pages deploy 404s assets, revisit — but Cloudflare Pages requires no `basePath` so this should be moot
- Submit sitemap to GSC only AFTER production domain locked AND content reviewed (resubmitting a wrong sitemap creates weeks of recovery)

**Research needed**: NO — Lighthouse audit + Cloudflare Pages deploy + GSC submission is rote (per SUMMARY.md flags).

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation Lock-In | 0/2 | Not started | - |
| 2. Layout Shell | 0/2 | Not started | - |
| 3. Landing Sections | 0/TBD | Not started | - |
| 4. Projects Data + `/du-an` List | 0/TBD | Not started | - |
| 5. SEO + Schema + Polish | 0/TBD | Not started | - |
| 6. Audit + Launch | 0/TBD | Not started | - |

## Phase Ordering Rationale

- **Config-before-features (Phase 1 first):** 5 of 6 critical pitfalls (`output: 'export'` quirks, fonts/diacritics, Tailwind v4 namespace, `metadataBase`, basePath/deploy) must be eliminated before any UI work — otherwise rework is painful and ripples through every later phase.
- **Shell-before-sections (Phase 2 before 3):** Building Nav + Footer + FloatingZalo before sections means `/du-an` inherits the shell for free in Phase 4, and the critical Zalo/tel CTAs are smoke-tested on real devices early (Pitfall #7).
- **Sections-before-projects-data (Phase 3 before 4):** Slight departure from the design spec's "data first" order — justified because section structure stabilizes the project card markup before the data shape is committed; both then converge on `lib/projects.ts`.
- **SEO-after-data-stable (Phase 5 after 4):** JSON-LD must mirror displayed NAP exactly — only safe to author once Footer and Contact copy are frozen. Programmatic sitemap needs the final route list.
- **Audit-as-its-own-phase (Phase 6):** Lighthouse + native copy review + real-device testing genuinely take time and routinely uncover Phase-3 rework.

## Pre-Phase-1 Lock Checklist

These decisions per SUMMARY.md should be confirmed before Phase 1 work begins (handled by `/gsd:research-phase 1`):

- [ ] Deploy target: Cloudflare Pages (recommended; GitHub Pages is ruled out by its no-commercial-use ToS)
- [ ] Display font strategy: option (b) Be Vietnam Pro Bold display only (recommended) — verify in 30-min visual spike with "KHANG THỊNH ĐỘI TÀU 3,900 TẤN"
- [ ] Font loading mechanism: `next/font/google` (per FND-04)
- [ ] Production domain: real `.vn` domain OR firm placeholder + `NEXT_PUBLIC_SITE_URL` env-var contract documented
- [ ] Analytics: Cloudflare Web Analytics
- [ ] CTA convention: `tel:+84921985599` for href, `092 198 55 99` for display, `https://zalo.me/0921985599` for Zalo
- [ ] JSON-LD `@type`: `GeneralContractor` (resolve in Phase 5 research)
- [ ] ESLint rule banning `"use server"`, `cookies()`, `headers()` imports

---
*Roadmap defined: 2026-05-26*
*Last updated: 2026-05-26 after initial roadmap creation*
