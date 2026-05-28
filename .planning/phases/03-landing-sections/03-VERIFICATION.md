---
phase: 03-landing-sections
verified: 2026-05-28T00:00:00Z
status: passed
score: 7/7 must-haves verified
re_verification: false
gaps: []
human_verification:
  - test: "Kiểm tra visual tại 375px / 768px / 1280px"
    expected: "8 sections hiển thị đúng thứ tự, không overflow, font và màu sắc đúng Burgundy/Bone palette"
    why_human: "Responsive layout, visual design, và font rendering cần browser DevTools để xác nhận"
  - test: "Tap CTAs trên thiết bị thực (iOS Safari / Android Chrome)"
    expected: "CTA1 Hero mở dialer; CTA Zalo mở app Zalo; mailto mở mail client"
    why_human: "tel:/zalo.me/mailto link behavior chỉ xác nhận được trên thiết bị thực"
  - test: "Kiểm tra PartnersMarquee animation chạy mượt"
    expected: "Scrolls liên tục, không giật (jank), tốc độ 40s per cycle"
    why_human: "CSS animation performance trên cheap Android cần xác nhận thực tế (PITFALLS #12)"
---

# Phase 3: Landing Sections - Verification Report

**Phase Goal:** All 8 landing sections render correctly in order, with hardcoded Vietnamese copy from the design spec and reusable typography/color tokens from Phase 1.
**Verified:** 2026-05-28
**Status:** PASSED
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| #   | Truth | Status | Evidence |
| --- | ----- | ------ | -------- |
| 1 | 8 sections render on `/` in order (Hero → PartnersMarquee → Services → Projects → BigStats → Capabilities → CtaQuote → Contact), vertical rhythm, Burgundy/Bone palette | VERIFIED | `page.tsx` imports and renders all 8 in locked order; `out/` at 797B confirms full render; `@theme` tokens present in `globals.css` |
| 2 | Hero displays large uppercase VN headline (Be Vietnam Pro 900) + sub-text + 2 working CTAs (Gọi / Báo giá) + industrial CSS pattern background | VERIFIED | `Hero.tsx` L21–22: `font-black uppercase` h1 "CÔNG TRÌNH BỀN VỮNG · ĐỐI TÁC TIN CẬY"; `telHref()` + `#lien-he` CTAs; blueprint-grid via `backgroundImage` inline style |
| 3 | PartnersMarquee — CSS-only @keyframes infinite scroll, displays "BINH ĐOÀN 12 · TRƯỜNG SƠN · BỘ QUỐC PHÒNG · …", pauses for prefers-reduced-motion | VERIFIED | `@keyframes marquee` in `globals.css`; `.marquee-track` with `animation: marquee 40s linear infinite`; `@media (prefers-reduced-motion: reduce) { animation: none }`; token list confirmed in HTML |
| 4 | Services renders 3 cards with Lucide icons (Truck/HardHat/Ship) | VERIFIED | `Services.tsx` imports `Truck`, `HardHat`, `Ship` from `lucide-react`; 3 SERVICES const entries; confirmed in build |
| 5 | Projects section — 4 named projects with named clients visible front-and-center + "Xem tất cả → /du-an" link | VERIFIED | `Projects.tsx`: Cao tốc Cái Nước, Cầu Cửa Lớn, Hòn Khoai, Nhà phố; clients in `text-taupe`; "Xem tất cả dự án" → `/du-an` confirmed in `out/index.html` |
| 6 | BigStats — honest numbers (3,900 tấn / 4 dự án / 2025 / 3 đối tác QP) — no fake "20 năm" | VERIFIED | `BigStats.tsx` STATS const: `3,900`, `4`, `2025`, `3`; no "năm kinh nghiệm" string found; confirmed in `out/index.html` grep |
| 7 | Capabilities, CtaQuote (espresso banner "Yêu cầu báo giá" + prominent CTA), Contact (info + 3 working tel/zalo/mailto CTAs) render correctly | VERIFIED | `Capabilities.tsx`: 3 groups; `CtaQuote.tsx`: `bg-espresso`, headline "YÊU CẦU BÁO GIÁ NGAY HÔM NAY", `telHref()` CTA; `Contact.tsx`: `id="lien-he"`, 3 CTAs via `telHref()`/`zaloHref()`/`mailtoHref()`, plain-text email fallback |

**Score:** 7/7 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
| -------- | -------- | ------ | ------- |
| `src/components/sections/Hero.tsx` | Hero section — SEC-01 | VERIFIED | 47 lines; blueprint-grid background; `telHref()` + `#lien-he` CTAs; no `use client` |
| `src/components/sections/PartnersMarquee.tsx` | CSS marquee — SEC-02 | VERIFIED | 50 lines; `marquee-track` class; `aria-hidden` on duplicate copy |
| `src/components/sections/Services.tsx` | 3-card services — SEC-03 | VERIFIED | 58 lines; `Truck`/`HardHat`/`Ship` icons; `id="dich-vu"` |
| `src/components/sections/Projects.tsx` | 4 projects — SEC-04 | VERIFIED | 95 lines; all 4 projects + clients; `id="du-an"`; `/du-an` CTA |
| `src/components/sections/BigStats.tsx` | Stat tiles — SEC-05 | VERIFIED | 43 lines; static numbers; `border-l-4 border-burgundy` |
| `src/components/sections/Capabilities.tsx` | 3 capability groups — SEC-06 | VERIFIED | 79 lines; Ship/Truck/HardHat icons; Check bullet markers |
| `src/components/sections/CtaQuote.tsx` | Espresso CTA banner — SEC-07 | VERIFIED | 32 lines; `bg-espresso`; "YÊU CẦU BÁO GIÁ NGAY HÔM NAY"; `telHref()` |
| `src/components/sections/Contact.tsx` | Contact + 3 CTAs — SEC-08 | VERIFIED | 78 lines; `id="lien-he"`; `telHref()`/`zaloHref()`/`mailtoHref()`; plain-text email |
| `src/app/page.tsx` | Composed 8-section page | VERIFIED | 37 lines; all 8 imports; `#nang-luc` wrapper for BigStats+Capabilities; no sentinel |
| `src/app/globals.css` | `@keyframes marquee` + `prefers-reduced-motion` | VERIFIED | `@keyframes marquee` (translateX 0→-50%); `.marquee-track` with `will-change: transform`; reduced-motion guard present |
| `out/index.html` | Static export built | VERIFIED | `npm run build` exit 0; 797 B for `/`; `/out/` regenerated |

### Key Link Verification

| From | To | Via | Status | Details |
| ---- | -- | --- | ------ | ------- |
| `Hero.tsx` | `tel:+84921985599` | `telHref()` from `@/lib/site` | WIRED | CTA1 href uses `telHref()`; confirmed in `out/index.html` `tel:+84921985599` present |
| `Hero.tsx` | `#lien-he` | CTA2 href | WIRED | `href="#lien-he"` anchors to `Contact` section |
| `PartnersMarquee.tsx` | `.marquee-track` animation | `globals.css` `@keyframes marquee` | WIRED | Class references `marquee-track`; definition in `globals.css` |
| `CtaQuote.tsx` | `tel:+84921985599` | `telHref()` from `@/lib/site` | WIRED | Single tel CTA via `telHref()` |
| `Contact.tsx` | `tel:`, `zalo.me`, `mailto:` | `telHref()`/`zaloHref()`/`mailtoHref()` | WIRED | All 3 CTAs flow through `@/lib/site` helpers; confirmed in build output |
| `Projects.tsx` | `/du-an` route | `href="/du-an"` | WIRED | "Xem tất cả dự án" link present in `out/index.html` |
| `page.tsx` | All 8 sections | Individual imports | WIRED | All 8 components imported and rendered in correct order |
| `page.tsx` | `#nang-luc` | Wrapper `<section id="nang-luc">` around BigStats + Capabilities | WIRED | All 5 Nav anchor IDs present in `out/index.html` |

### Data-Flow Trace (Level 4)

All sections render static/hardcoded data (no database, no API). Phase 3 is a static marketing site — data lives as `readonly const` arrays inside component files. Level 4 data-flow trace not applicable for static server components.

| Artifact | Data Variable | Source | Status |
| -------- | ------------- | ------ | ------ |
| `Hero.tsx` | `telHref()` | `@/lib/site` single source of truth | STATIC OK — constant |
| `Projects.tsx` | `PROJECTS[]` | Hardcoded const in file (D-16: Phase 4 will extract to `lib/projects.ts`) | STATIC OK — intentional for Phase 3 |
| `BigStats.tsx` | `STATS[]` | Hardcoded const in file | STATIC OK — honest numbers |
| `Contact.tsx` | `company.*`, `telHref`/`zaloHref`/`mailtoHref` | `@/lib/site` | FLOWING — single source of truth |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
| -------- | ------- | ------ | ------ |
| Build exits 0 | `npm run build` | Exit 0, `/` = 797 B, 102 kB shared JS | PASS |
| Hero headline in HTML | `grep "CÔNG TRÌNH BỀN VỮNG" out/index.html` | 1 match | PASS |
| PartnersMarquee text in HTML | `grep "BỘ QUỐC PHÒNG" out/index.html` | 1 match | PASS |
| Project name in HTML | `grep "Cao tốc Cái Nước" out/index.html` | 1 match | PASS |
| BigStats number in HTML | `grep "3,900" out/index.html` | 1 match | PASS |
| CtaQuote headline in HTML | `grep "YÊU CẦU BÁO GIÁ" out/index.html` | 1 match | PASS |
| Contact heading in HTML | `grep "Liên hệ" out/index.html` | 1 match | PASS |
| All 5 anchor IDs in HTML | `grep id="dich-vu"/"du-an"/"nang-luc"/"doi-tac"/"lien-he"` | 5/5 present | PASS |
| No `use client` in section files | `grep -rn "use client" src/components/sections/` | 0 matches | PASS |
| No hardcoded phone/email in section files | `grep -rn "0921985599\|khangthinhinv2025" src/components/sections/` | 0 matches | PASS |
| No Phase 1 sentinel in page.tsx | `grep -rn "sentinel\|placeholder" src/app/page.tsx` | 0 matches | PASS |
| tel: link in HTML | `grep "tel:+84921985599" out/index.html` | 1 match | PASS |
| Zalo HTTPS link in HTML | `grep "zalo.me" out/index.html` | 1 match | PASS |
| @keyframes marquee in CSS | `grep "@keyframes" src/app/globals.css` | 1 match | PASS |
| prefers-reduced-motion in CSS | `grep "prefers-reduced-motion" src/app/globals.css` | 2 matches (scroll + marquee) | PASS |
| BINH ĐOÀN 12 / TRƯỜNG SƠN in marquee | `grep "BINH ĐOÀN 12\|TRƯỜNG SƠN\|BỘ QUỐC PHÒNG" out/index.html` | 1 match | PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
| ----------- | ----------- | ----------- | ------ | -------- |
| SEC-01 | 03-01 | Hero section — headline lớn + 2 CTA + CSS pattern | SATISFIED | `Hero.tsx`: `font-black uppercase`, `telHref()` + `#lien-he` CTAs, blueprint-grid background |
| SEC-02 | 03-01 | PartnersMarquee — CSS-only infinite scroll + prefers-reduced-motion | SATISFIED | `@keyframes marquee` in `globals.css`; `.marquee-track`; reduced-motion guard |
| SEC-03 | 03-01 | Services — 3 cards with Lucide icons (Truck/HardHat/Ship) | SATISFIED | `Services.tsx` with all 3 icons |
| SEC-04 | 03-01 | Projects — 4 dự án + "Xem tất cả → /du-an" | SATISFIED | `Projects.tsx` with 4 projects + `/du-an` CTA |
| SEC-05 | 03-02 | BigStats — honest numbers (3,900 / 4 / 2025 / 3) | SATISFIED | `BigStats.tsx` static STATS const |
| SEC-06 | 03-02 | Capabilities — 3 groups (đội tàu/cơ giới/đội xây lắp) | SATISFIED | `Capabilities.tsx` with Ship/Truck/HardHat icons + Check bullets |
| SEC-07 | 03-02 | CtaQuote — full-width espresso banner + prominent CTA | SATISFIED | `CtaQuote.tsx` `bg-espresso` + "YÊU CẦU BÁO GIÁ NGAY HÔM NAY" |
| SEC-08 | 03-02 | Contact — info + 3 CTAs (tel/zalo/mailto) | SATISFIED | `Contact.tsx` `id="lien-he"` + 3 CTAs + plain-text email |

All 8 SEC-01..08 requirements SATISFIED. No orphaned requirements.

### Anti-Patterns Found

| File | Pattern | Severity | Verdict |
| ---- | ------- | -------- | ------- |
| `Projects.tsx` | Years 2024 (3 construction projects) flagged as BEST-GUESS in both SUMMARY.md and D-16 | Info | Not a stub — data is intentional placeholder pending user confirmation before Phase 4. Executor documented the flag. Non-blocking for Phase 3. |

No blocker or warning anti-patterns found.

- No `return null` / `return {}` / `return []` stubs in any section file
- No `TODO`/`FIXME`/`PLACEHOLDER` comments in section files
- No hardcoded phone numbers or email addresses in section files (all via `@/lib/site`)
- No `use client` directive in any section file (D-35 satisfied)
- Phase 1 sentinel `<details>` debug card deleted from `page.tsx` (D-40 satisfied)

### Human Verification Required

#### 1. Responsive Layout at 375px / 768px / 1280px

**Test:** Open `http://localhost:3000` (or `npx serve out/`) in Chrome DevTools, switch to device mode for each breakpoint. Scroll through all 8 sections.
**Expected:** Each section displays correctly — no horizontal overflow, text readable, cards stack properly on mobile (1-col), grid on desktop (2/3/4-col per section), CTAs have adequate tap targets (≥44×44px).
**Why human:** Visual layout, typography rendering, and responsive behavior require browser rendering to confirm.

#### 2. Real-Device CTA Smoke Test

**Test:** Trên iOS Safari và Android Chrome: tap "Gọi 092 198 55 99" (Hero + CtaQuote + Contact), "Chat Zalo" (Contact), "Gửi email" (Contact).
**Expected:** Dialer opens for `tel:`, Zalo app opens for `zalo.me`, mail client opens for `mailto:`.
**Why human:** Link handler behavior is device/OS-dependent and cannot be verified programmatically.

#### 3. PartnersMarquee Animation Quality

**Test:** Open on a mid-range Android device (or emulate throttled CPU in DevTools). Observe marquee animation for 10 seconds.
**Expected:** Smooth continuous scroll, no jank or repaint flicker, seamless loop.
**Why human:** GPU compositing and animation smoothness on constrained hardware needs real observation. Per PITFALLS #12.

### Gaps Summary

No gaps found. All 7/7 observable truths verified. All 11 artifacts exist, are substantive, and correctly wired. All 8 requirements (SEC-01..08) satisfied. No blocker anti-patterns detected.

**One open item for Phase 4 (non-blocking for Phase 3):** Project years 2024 in `Projects.tsx` are BEST-GUESS per CONTEXT D-16. User must confirm or correct before Phase 4 extracts data to `lib/projects.ts`.

---

_Verified: 2026-05-28_
_Verifier: Claude (gsd-verifier)_
