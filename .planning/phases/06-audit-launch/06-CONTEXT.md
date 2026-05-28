# Phase 6: Audit + Launch - Context

**Gathered:** 2026-05-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Final phase. Site passes full quality audit (Lighthouse, responsive, real-device CTA smoke test, console-clean local serve) and is deployed to **Vercel** (override of Phase 1 Cloudflare Pages decision — user is already using Vercel) with **Vercel Analytics** wired in for production. README.md documents the deploy workflow + env vars.

**In scope:**
- Lighthouse mobile audit on `/` and `/du-an` — Performance ≥ 90, SEO ≥ 95, Accessibility ≥ 90, Best Practices ≥ 95
- Manual responsive verification at 375px / 768px / 1280px DevTools — no overflow, broken layout, unreadable text
- Manual tap-target audit — every interactive element ≥ 44×44px, body text ≥ 16px
- Real-device CTA smoke test (FULL matrix): iOS Safari + Android Chrome + Facebook in-app + Zalo in-app — `tel:`, `mailto:`, `https://zalo.me/0826553599` all open correct handler
- Console-clean local verify: `npm run build && npx serve out/` → zero console errors, zero broken asset 404s on both pages
- Fix Phase 2 deferred item: `outputFileTracingRoot: __dirname` in `next.config.ts` (eliminate workspace-root warning during build)
- Wire `@vercel/analytics` script in `layout.tsx` — production-only (uses `process.env.NODE_ENV === 'production'` guard)
- Vercel deploy configuration documented in README.md: env vars (`NEXT_PUBLIC_SITE_URL`), build command (`npm run build`), output directory (`out/`), Next.js framework preset, custom domain configuration steps (when user provides real domain later)
- Confirm production deploy URL is reachable via HTTPS with valid cert
- Confirm Vercel Analytics records pageviews from production traffic (verify via Vercel dashboard 5+ minutes post-deploy)

**Out of scope (deferred):**
- Vietnamese native-language copy review (Pitfall #8) — DEFERRED post-deploy per user decision. User will review live and report fixes after Phase 6 ships.
- Google Search Console (LSEO-03) sitemap submission — DEFER until real domain locked + native-copy-reviewed
- Google Business Profile (LSEO-01) — post-launch v1.x
- Google Maps embed in Contact (LSEO-02) — post-launch v1.x
- Custom domain registration — user has no domain yet; ships on `*.vercel.app` placeholder
- Rich Results Test on JSON-LD — done as part of deploy verification step (not blocking Phase 6 completion)
- Project detail pages `/du-an/[slug]` — explicitly out of scope per PROJECT.md
- Cloudflare Pages deploy — phase-1 decision overridden by user's existing Vercel preference
- Cloudflare Web Analytics — replaced by Vercel Analytics (same purpose: cookieless pageview tracking)

</domain>

<decisions>
## Implementation Decisions

### 1. Deploy target (OVERRIDES Phase 1 decision)

- **D-01:** Deploy target = **Vercel** (Hobby tier, free). Phase 1 Foundation locked Cloudflare Pages — user override during Phase 6 discuss-phase: "chưa có hiện đang dùng vercel tạm thời, giữ nguyên hiện tại".
- **D-02:** Domain at launch = **`*.vercel.app`** placeholder (Vercel auto-assigns). User has not registered a custom domain. Real domain swap deferred post-launch — adds 1 step in Vercel dashboard + DNS update + cert auto-issue (zero code change).
- **D-03:** `NEXT_PUBLIC_SITE_URL` for Vercel deploy = the assigned Vercel domain (e.g. `https://khang-thinh-website.vercel.app`). Configured in Vercel project Settings → Environment Variables → Production. Default placeholder `https://khangthinhinv.vn` in `lib/site.ts` is kept as fallback for local dev only.
- **D-04:** No `vercel.json` config needed — Vercel detects Next.js automatically. Build command auto-detected (`next build`); output directory auto-detected (`out/` because `output: 'export'` in next.config.ts).

### 2. Analytics

- **D-05:** Use **`@vercel/analytics`** package (free on Hobby tier) instead of Cloudflare Web Analytics. Same purpose: cookieless pageview tracking, no consent modal needed under PDPL/GDPR.
- **D-06:** Wire via `<Analytics />` component imported in `src/app/layout.tsx`. NOT a manual `<script>` tag — use the official React component which auto-detects production environment.
- **D-07:** Production-only behavior is automatic — `@vercel/analytics/react`'s `<Analytics />` component only fires beacons when `process.env.VERCEL_ENV === 'production'` (Vercel-injected env var). No manual `NODE_ENV` guard required.
- **D-08:** Confirm analytics live: after deploy, visit site 2–3 times from a real browser, wait 5 minutes, check Vercel dashboard → Analytics tab → Pageviews > 0.

### 3. Audit gates (QA-01..06)

- **D-09:** Lighthouse audit run from **Chrome DevTools** (not lighthouse-ci or PageSpeed Insights remote test) — local audit lets the audit run against `npx serve out/` so it's deterministic. Both `/` and `/du-an` audited separately.
- **D-10:** Lighthouse thresholds (mobile, throttled):
  - Performance ≥ 90
  - SEO ≥ 95
  - Accessibility ≥ 90
  - Best Practices ≥ 95
  - If ANY category falls below threshold on EITHER page → fix before Phase 6 completion. Common fixes: missing `alt` attrs, missing aria labels, `lang="vi"` confirmed on `<html>`, no oversized images.
- **D-11:** Responsive verification done in Chrome DevTools device toolbar at exact viewports **375px (iPhone SE) / 768px (iPad) / 1280px (laptop)**. Check both `/` and `/du-an`. Documented in VERIFICATION.md with screenshot at each breakpoint (or "no issues found" note per breakpoint).
- **D-12:** Tap-target audit done via Lighthouse "tap targets are sized appropriately" sub-audit + manual spot-check on FloatingZalo + Nav mobile drawer + CTA buttons.
- **D-13:** Body text size audit done via DevTools computed style on a sampled `<p>` in each section — must be ≥ 16px. Headings can be larger; body paragraphs anchor at 16px.
- **D-14:** Console-clean verify: in DevTools Console, run `console.clear()` then refresh both pages, then visit a non-existent route to test 404. Zero red errors. Zero 404 in Network tab for any asset (CSS, JS, fonts, images).

### 4. Real-device CTA smoke test (QA-05 + ROADMAP SC#4)

- **D-15:** Full matrix per ROADMAP SC#4: 4 browser environments × 3 link types = 12 test points minimum.
  - **Devices/browsers:**
    1. iOS Safari (any iPhone)
    2. Android Chrome (any Android)
    3. Facebook in-app browser (open link from FB mobile app)
    4. Zalo in-app browser (open link from Zalo message)
  - **Links to test (each browser):**
    1. `tel:+84826553599` (Hero CTA1, Contact card, CtaQuote banner, 404 secondary CTA)
    2. `mailto:khangthinhinv2025@gmail.com` (Contact card)
    3. `https://zalo.me/0826553599` (FloatingZalo FAB, Contact card Zalo channel)
- **D-16:** Each test point either PASS (handler opens correctly) or FAIL (with note: "in-app browser swallows tel: handler" type observation). Document results in matrix table in VERIFICATION.md.
- **D-17:** If FB/Zalo in-app browser swallows `tel:` (known issue — some in-app browsers strip phone handlers), document as ACCEPTED RISK and add a non-blocking note in VERIFICATION.md. Do NOT add UA-sniffing workarounds (Pitfall: brittle, breaks on UA string changes).

### 5. Phase 2 deferred-item resolution

- **D-18:** Fix `outputFileTracingRoot` warning in Phase 6, not Phase 7. Edit `next.config.ts`:
  ```ts
  import path from 'path'
  const nextConfig: NextConfig = {
    output: 'export',
    trailingSlash: true,
    images: { unoptimized: true },
    outputFileTracingRoot: path.join(__dirname),
  }
  ```
- **D-19:** Verify post-fix: `npm run build` stdout NO longer shows "inferred your workspace root" warning. Standalone gate task.

### 6. README.md rewrite

- **D-20:** Replace current README (10 lines, mentions GitHub Pages/Netlify/Vercel generically) with a focused Vercel deploy doc. Sections:
  1. **Title + 1-line description** (Vietnamese OK, brand voice consistent)
  2. **Tech stack** (Next.js 15 + React 19 + Tailwind 4 + TypeScript 5.9 + Vercel)
  3. **Dev** (npm install + npm run dev)
  4. **Build** (npm run build + output path)
  5. **Deploy → Vercel** (step-by-step):
     - Import GitHub repo into Vercel
     - Framework preset: Next.js (auto-detected)
     - Build command: `npm run build` (default)
     - Output directory: `out` (Vercel auto-detects from `output: 'export'`)
     - Env var: `NEXT_PUBLIC_SITE_URL` → set to Vercel assigned URL initially
     - Click Deploy
  6. **Custom domain (post-launch)** — 3-step instruction to add real domain in Vercel Settings → Domains → Update `NEXT_PUBLIC_SITE_URL` env var → Redeploy
  7. **Analytics** — Vercel Analytics enabled via `<Analytics />` component in layout.tsx; view dashboard at vercel.com/<project>/analytics
  8. **Local prod-mode smoke test:** `npm run build && npx serve out/ -l 3003` then `http://localhost:3003`
- **D-21:** README written in Vietnamese for primary content + English for tech commands/flags (consistent with CLAUDE.md style guidance).

### 7. Plan granularity

- **D-22:** Two plans (matches roadmap estimate):
  - **06-01 — Audit & Polish** (QA-01..06): Lighthouse mobile audit on both pages, responsive verification, tap-target audit, body-text audit, real-device CTA matrix, console-clean verify, fix outputFileTracingRoot, fix any audit-found issues
  - **06-02 — Deploy & Docs** (DEPLOY-01..03): wire `@vercel/analytics`, write README.md, manual Vercel deploy walkthrough documented (user clicks dashboard, plan documents the steps as VERIFICATION evidence), confirm live URL HTTPS + analytics pageview
- **D-23:** Plans run sequentially (Wave 1 → Wave 2) — audit must pass before deploy. If audit uncovers a regression (rare — most issues caught Phase 1-5), fix-loop happens inside 06-01 before Wave 2 starts.

### 8. Anti-patterns / pitfalls to enforce

- **D-24:** Pitfall #1 (Looks Done But Isn't) — every audit checklist item must have evidence in VERIFICATION.md (screenshot or grep output), NOT just "tested OK"
- **D-25:** Pitfall #2 (assets 404 on deploy) — Vercel doesn't need `basePath`, but verify post-deploy by inspecting Network tab for `_next/static/*` and font loads
- **D-26:** Pitfall #7 (tel/zalo CTAs broken) — full real-device matrix per D-15 is the gate; in-app browser limitations documented per D-17
- **D-27:** Pitfall #8 (Vietnamese copy review) — DEFERRED per user decision; flagged as non-Phase-6 backlog item in VERIFICATION.md
- **D-28:** Pitfall #10 (sitemap/OG wrong domain) — verify post-deploy: open `<vercel-url>/sitemap.xml` and confirm `<loc>` URLs match the actual deploy domain (NOT the local `khangthinhinv.vn` placeholder). If they don't, the `NEXT_PUBLIC_SITE_URL` env var wasn't set in Vercel before build.

</decisions>

<context>
## Phase Reference Context

**Phase 5 deliverables consumed by Phase 6:**
- `out/sitemap.xml` — must have correct domain after Vercel deploy with correct env var
- `out/robots.txt` — same
- `out/opengraph-image` (PNG 1200×630) — verify via DevTools meta tag inspection after deploy
- `out/icon` + `out/apple-icon` — verify browser tab shows KT monogram on deployed URL
- `out/index.html` — JSON-LD `@graph` block must resolve correct domain in `@id` URLs and `image` URL
- `out/404.html` — Vercel automatically serves `404.html` for unmatched routes (same as Cloudflare)
- `src/lib/site.ts` — `siteUrl` reads `NEXT_PUBLIC_SITE_URL` env var, falls back to `khangthinhinv.vn` placeholder

**Reusable from earlier phases (no changes needed):**
- `next.config.ts` — `output: 'export'` + `trailingSlash: true` work on Vercel identically to Cloudflare
- All layout/sections/components — visual + functional behavior unchanged across hosts
- All env-var-driven URLs (siteUrl in sitemap, JSON-LD, OG metadata) auto-pick up Vercel's env var at build time

**Vercel-specific notes:**
- Vercel detects `output: 'export'` and configures static deploy automatically
- No `vercel.json` needed unless you want custom headers (we don't)
- Build duration: ~30–60s for a 2-page Next.js static export
- Free hobby tier limits: 100GB bandwidth/mo, 100 deploys/day, 6 concurrent builds — comfortable for a B2B marketing site
- Vercel Analytics: free on hobby for 1 project, 2,500 pageviews/mo (more than enough)
- Cookieless: Vercel Analytics is privacy-first, no PII, no GDPR consent modal needed

**Override audit (Phase 1 → Phase 6):**
| Phase 1 decision | Phase 6 override | Reason |
|---|---|---|
| Deploy: Cloudflare Pages | Vercel | User already on Vercel; minimize friction |
| Analytics: Cloudflare Web Analytics | Vercel Analytics | Inherits from host change |
| Reason for original Cloudflare: free unlimited bandwidth | Mitigation: Vercel hobby's 100GB/mo is ample for B2B marketing site (estimated < 5GB/mo) | — |

This is an acceptable, documented override. No technical incompatibility introduced.

## User Quotes / Direction Captured

- Deploy: "chưa có hiện đang dùng vercel tạm thời" → "giữ nguyên hiện tại" → Vercel locked
- Domain: no custom domain owned → defer to *.vercel.app
- Copy review: "là cái đéo gì" (didn't understand) → after explanation → "Defer sang sau khi deploy"
- Device test: full matrix iOS Safari + Android Chrome + FB in-app + Zalo in-app

## Pitfalls to verify during Phase 6

- Pitfall #1 (Looks Done But Isn't) — every audit item must have evidence
- Pitfall #2 (deploy 404) — Vercel base path = root, expected to be moot
- Pitfall #7 (broken tel:/Zalo) — full device matrix
- Pitfall #8 (Vietnamese copy review) — DEFERRED, tracked in VERIFICATION.md
- Pitfall #10 (sitemap/OG wrong domain) — env var must be set before Vercel build

</context>

<next_steps>
## Next Steps

1. Run `/gsd:plan-phase 6` — planner produces:
   - `06-01-audit-polish-PLAN.md` (Lighthouse + responsive + tap-target + body-text + device-matrix + console-clean + outputFileTracingRoot fix)
   - `06-02-deploy-docs-PLAN.md` (wire @vercel/analytics + write README.md + document Vercel deploy walkthrough + post-deploy live verify)
2. After plans approved → `/gsd:execute-phase 6` Wave 1 (audit) then Wave 2 (deploy + docs)
3. Phase 6 success = website is publicly reachable on Vercel with HTTPS, Lighthouse green, analytics live, README updated. Vietnamese native-copy review tracked as post-launch backlog item.

</next_steps>
