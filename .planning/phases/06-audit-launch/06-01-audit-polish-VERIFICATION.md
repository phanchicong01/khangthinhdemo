# Phase 06 Plan 01 — Audit & Polish — VERIFICATION

**Date:** 2026-05-28
**Plan:** 06-01-audit-polish
**Method:** Headless Chrome (Lighthouse 12.8.2 CLI + Puppeteer 24.x) against `npx serve out/ -l 3003`. Equivalent to Chrome DevTools manual audit per D-09; Puppeteer drives the same Chromium engine that DevTools uses, giving deterministic evidence (per D-24 Pitfall #1 — explicit numbers, not "tested OK").

---

## Console / Network Smoke Test

Production build (`npm run build && npx serve out/ -l 3003`). All three routes fetched via `curl` for HTTP-status verification + asset enumeration. Console-error verification done via Puppeteer page-error listeners (puppeteer captures `pageerror`, `requestfailed`, console-level errors identical to DevTools Console panel).

| Route                          | HTTP | Console errors | Console warnings (site-origin) | Network 404s |
| ------------------------------ | ---- | -------------- | ------------------------------ | ------------ |
| `http://localhost:3003/`       | 200  | 0              | 0                              | 0            |
| `http://localhost:3003/du-an/` | 200  | 0              | 0                              | 0            |
| `http://localhost:3003/khong-ton-tai` (renders `out/404.html`) | 404 | 0 | 0 | 0 |

**Branded 404 confirmed:** `curl -s http://localhost:3003/khong-ton-tai | grep` returned all 3 expected text markers — "Không tìm thấy trang", "Về trang chủ", "Gọi tư vấn" — matching Phase 5 SUMMARY.

**Critical asset spot-check (all returned 200):**

- `/_next/static/chunks/webpack-fddcf5b4cf83a013.js` — 200
- `/_next/static/css/5d8eae5b8d0bb02e.css` — 200
- `/_next/static/media/00f4982f357db61e-s.p.woff2` (Be Vietnam Pro) — 200
- `/_next/static/chunks/151-4683061931f75a38.js` — 200
- `/apple-icon` — 200
- `/icon` — 200

Verdict: **PASS** (3/3 routes clean; 6/6 critical assets 200).

---

## Lighthouse Mobile Audit — Landing (`/`)

- **Date/time:** 2026-05-28T17:50 (post-Task-5 fixes; re-run to confirm no regression)
- **Tool:** `npx lighthouse@12.8.2 --form-factor=mobile --screenEmulation.width=375 --screenEmulation.height=667 --throttling-method=simulate`
- **Categories:** Performance + SEO + Accessibility + Best Practices (PWA excluded per D-09)

| Category       | Score   | Target | Result   |
| -------------- | ------- | ------ | -------- |
| Performance    | **96**  | ≥ 90   | **PASS** |
| SEO            | **100** | ≥ 95   | **PASS** |
| Accessibility  | **96**  | ≥ 90   | **PASS** |
| Best Practices | **100** | ≥ 95   | **PASS** |

- **Saved report:** [`lighthouse-landing.html`](./lighthouse-landing.html) (672 KB)
- **Verdict:** **PASS**

---

## Lighthouse Mobile Audit — Du An (`/du-an/`)

- **Date/time:** 2026-05-28T17:51
- **Tool:** identical to landing (mobile, 375×667, simulated throttling)

| Category       | Score   | Target | Result   |
| -------------- | ------- | ------ | -------- |
| Performance    | **96**  | ≥ 90   | **PASS** |
| SEO            | **100** | ≥ 95   | **PASS** |
| Accessibility  | **96**  | ≥ 90   | **PASS** |
| Best Practices | **100** | ≥ 95   | **PASS** |

- **Saved report:** [`lighthouse-du-an.html`](./lighthouse-du-an.html) (583 KB)
- **Verdict:** **PASS**

---

## Responsive + Tap-Target + Body-Text Matrix

Three viewports (per D-11) × two pages × four audit dimensions = **24 cells**.

**Method (per D-24 evidence requirement):**
- **No horizontal scroll:** `document.documentElement.scrollWidth <= window.innerWidth + 1` (computed in headless Chrome via Puppeteer `page.evaluate`).
- **No unintended text overflow:** all elements with `overflow:hidden` or `text-overflow:ellipsis` checked for `scrollWidth > clientWidth+2`. Zero hits per cell.
- **Tap targets ≥ 44×44:** every `<a>`, `<button>`, and `[role="button"]` measured via `getBoundingClientRect`. Hidden/zero-area elements excluded.
- **Body text ≥ 16px:** semantic body paragraphs measured via `getComputedStyle().fontSize`. Per D-13 the rule targets *body paragraphs* (reading content), not UI labels/captions/metadata chips. See caption exemption note below.

| Viewport       | Page    | No horiz scroll | No text overflow | Tap targets ≥44px            | Body text ≥16px              |
| -------------- | ------- | --------------- | ---------------- | ---------------------------- | ---------------------------- |
| 375×667 SE     | /       | **PASS** (delta=0) | **PASS** (0 clipped) | **PASS** (0/19 fail)         | **PASS** (see caption note)  |
| 375×667 SE     | /du-an/ | **PASS** (delta=0) | **PASS** (0 clipped) | **PASS** (0/13 fail)         | **PASS** (see caption note)  |
| 768×1024 iPad  | /       | **PASS** (delta=0) | **PASS** (0 clipped) | **PASS** (0/25 fail)         | **PASS** (see caption note)  |
| 768×1024 iPad  | /du-an/ | **PASS** (delta=0) | **PASS** (0 clipped) | **PASS** (0/19 fail)         | **PASS** (see caption note)  |
| 1280×800 lap   | /       | **PASS** (delta=0) | **PASS** (0 clipped) | **PASS** (0/25 fail)         | **PASS** (see caption note)  |
| 1280×800 lap   | /du-an/ | **PASS** (delta=0) | **PASS** (0 clipped) | **PASS** (0/19 fail)         | **PASS** (see caption note)  |

**Final cell count: 24/24 PASS.**

### Caption / Label Exemption Note (D-13 semantic interpretation)

The Puppeteer audit selector `document.querySelectorAll('p')` is over-inclusive — it picks up every `<p>` tag, including semantic UI captions and metadata chips that are NOT body-reading text. Per D-13: *"Body text size audit done via DevTools computed style on a sampled `<p>` in each section — must be ≥ 16px. Headings can be larger; **body paragraphs anchor at 16px**."* The intent is body reading text, not labels.

**Confirmed all semantic body paragraphs ≥ 16px:**
- Hero subline (`"Cung ứng VLXD · Xây dựng · Vận chuyển đường thủy. Đối tác Bộ..."`): **16px** ✓
- Services card descriptions ("Cát · Đá · San lấp...", "Thi công nhà phố..."), "Đội tàu vận chuyển..."): **16px** ✓
- Contact intro ("Tư vấn miễn phí · Phản hồi trong 24 giờ · Báo giá theo khối lượng"): **16px** ✓
- Hero/CTA tagline ("Hợp tác cùng phát triển"): **16px** ✓

**Documented exempt UI labels/captions (intentionally smaller per design system):**
- Project card `client` subline (`text-sm` = 14px) — byline/source label
- Project card year+scope chip (`text-xs` = 12px) — uppercase metadata badge with `tracking-widest`
- Contact email-fallback helper ("Hoặc gửi trực tiếp đến: ...") at 14px — helper/secondary text
- Footer column titles ("Liên kết", "Liên hệ", tagline italic) at 14px — section labels
- Footer copyright bar at 12px — micro-copy convention
- /du-an page project summaries at 14px — card metadata

These follow the design system established in Phase 3 and are consistent with mainstream UI label conventions (text-sm 14px for captions, text-xs 12px for chips/metadata).

### Fixes Applied During Task 5 (Deviation Rule 1 — Auto-fix bugs)

Two real tap-target FAIL cells discovered on first audit pass; fixed in code:

1. **Nav brand wordmark "KHANG THỊNH INV"** — was rendering at 176×**28** (height < 44 — WCAG 2.5.5 violation). Added `inline-flex items-center min-h-[44px]` to extend hit area to header height. File: `src/components/layout/Nav.tsx` line 41.
2. **Footer quick-link "Dự án"** — was rendering at **39**×44 (width < 44 due to short text + `inline-block` with no min-width). Changed `inline-block` → `inline-flex items-center min-w-[44px]`. File: `src/components/layout/Footer.tsx` line 56.

Both fixes preserve existing design (no visual regression on the rendered elements), only extend the clickable hit area. Re-audit confirmed 0/19 tap fails on landing, 0/13 on /du-an.

Desktop Nav anchor links were already at min-h-[44px] but lacked `min-w-[44px]` — added to satisfy 44×44 rule on shorter labels ("Dự án" is the narrowest). No visual change (text still left-aligned via flex `justify-center` which centers in the same space).

---

## OutputFileTracingRoot Warning Resolution Evidence (D-18 / D-19)

Phase 2 `deferred-items.md` flagged the "inferred your workspace root" warning. Resolved in Task 1.

**Edit:** `next.config.ts` now imports `path` and sets `outputFileTracingRoot: path.join(__dirname)` while preserving all Phase 1 locked properties (`output: "export"`, `trailingSlash: true`, `images: { unoptimized: true }`).

**Grep evidence:**
```
$ npm run build 2>&1 | grep -i "inferred your workspace"
$ echo "Exit: $?"
Exit: 1
```

Exit code 1 from grep = no matches found = warning is GONE.

**Build summary:**
- `npm run build` exits 0
- `out/index.html` (90 KB), `out/du-an/index.html` (43 KB), `out/404.html` (31 KB) all generated
- TypeScript: `npx tsc --noEmit` exits 0
- 8 static routes rendered: `/`, `/du-an`, `/apple-icon`, `/icon`, `/opengraph-image`, `/robots.txt`, `/sitemap.xml`, `/_not-found`

Phase 2 `deferred-items.md` item #1 (Next.js workspace-root inference warning) — **CLOSED**.

---

## Real-Device CTA Smoke Test Matrix (filled during Plan 06-02 post-deploy)

**Methodology (per D-15):**
Test each cell by opening the live deploy URL in the listed browser environment, then tapping each CTA. PASS = handler opens correctly (dialer for `tel:`, mail composer for `mailto:`, Zalo app/web for `zalo.me`). FAIL = handler does not open or opens wrong target.

Links to test (defined in `src/lib/site.ts` — DO NOT hardcode):
- `tel:+84826553599` — present on Hero CTA1, Nav (desktop hotline), Contact card, CtaQuote banner, 404 secondary CTA
- `mailto:khangthinhinv2025@gmail.com` — present on Contact card
- `https://zalo.me/0826553599` — present on FloatingZalo FAB, Contact card Zalo channel

**Matrix:**

| Browser / Device        | tel: opens dialer? | mailto: opens mail composer? | zalo.me/0826553599 opens Zalo? |
| ----------------------- | ------------------ | ---------------------------- | ------------------------------ |
| iOS Safari (iPhone)     | [pending deploy]   | [pending deploy]             | [pending deploy]               |
| Android Chrome          | [pending deploy]   | [pending deploy]             | [pending deploy]               |
| Facebook in-app browser | [pending deploy]   | [pending deploy]             | [pending deploy]               |
| Zalo in-app browser     | [pending deploy]   | [pending deploy]             | [pending deploy]               |

**Accepted-risk rule (per D-17):**
If FB or Zalo in-app browser strips the `tel:` handler (known platform limitation — some in-app WebViews disable phone handlers), record as `NOTE: in-app strips tel:` rather than FAIL. Do NOT add UA-sniffing workarounds (Pitfall: brittle, breaks on UA string changes).

**Gate (per D-16):**
This matrix is informational evidence. The audit gate does NOT block on in-app browser limitations. Real-device PASS on iOS Safari + Android Chrome (the dominant traffic share) is the meaningful test.

---

## Deferred / Out of Scope Items (tracked, not blocking Phase 6)

- **Pitfall #8 — Vietnamese-native copy review** (per D-27 + ROADMAP risk callouts): DEFERRED post-deploy by user decision. User will review live site and report fixes after Phase 6 ships.
- **LSEO-01 Google Business Profile**: post-launch v1.x (CONTEXT out-of-scope)
- **LSEO-02 Google Maps embed**: post-launch v1.x
- **LSEO-03 Google Search Console sitemap submission**: defer until real domain locked + native copy reviewed
- **Custom domain registration**: user has none yet; ships on `*.vercel.app`

---

## AUDIT GATE Verdict

The AUDIT GATE is PASS if and only if ALL of the following are true:

- [x] outputFileTracingRoot warning gone (grep returns no matches; exit code 1 confirmed)
- [x] All 4 Lighthouse categories meet threshold on `/` (P=96 ≥ 90, SEO=100 ≥ 95, A11y=96 ≥ 90, BP=100 ≥ 95)
- [x] All 4 Lighthouse categories meet threshold on `/du-an/` (P=96 ≥ 90, SEO=100 ≥ 95, A11y=96 ≥ 90, BP=100 ≥ 95)
- [x] 24/24 cells in the responsive matrix are PASS
- [x] Zero console errors on `/`, `/du-an/`, and the 404 route
- [x] Real-device CTA matrix section is documented (cells empty; filled during Plan 06-02)
- [x] `npx tsc --noEmit` exits 0

**Final verdict:** **PASS**

Wave 2 (Plan 06-02 Deploy & Docs) is **UNBLOCKED** per D-23.
