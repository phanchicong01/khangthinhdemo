---
phase: 02-layout-shell
verified: 2026-05-27T00:00:00Z
status: passed
score: 6/6 must-haves verified
---

# Phase 2: Layout Shell Verification Report

**Phase Goal:** Persistent shell (Nav + Footer + FloatingZalo) renders on every route, exposes the hotline + Zalo + email CTAs, and is real-device smoke-tested before any section work begins.
**Verified:** 2026-05-27
**Status:** PASSED
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Nav sticky, logo + 5 anchor links + "Báo giá" CTA + visible hotline desktop, mobile menu under 768px | VERIFIED | Nav.tsx: `sticky top-0 z-40`, `hidden md:flex` for desktop, `md:hidden` hamburger, 5 navAnchors const, `telHref()` hotline, `Báo giá` CTA href="#lien-he" |
| 2 | Footer full legal info (MST 1102 107 064, ĐDPL Tô Thị Bích Ngọc, address, phone, email) from lib/site.ts | VERIFIED | Footer.tsx imports `company, telHref, mailtoHref, zaloHref` from `@/lib/site`; renders `taxIdDisplay`, `legalRep`, `address.full`; grep confirms all fields in out/index.html |
| 3 | FloatingZalo fixed bottom-right, ≥56×56px, deep-link https://zalo.me/0921985599, aria-label="Chat Zalo với Khang Thịnh" | VERIFIED | FloatingZalo.tsx: `fixed bottom-4 right-4 z-50`, `w-14 h-14` (56px), `href={zaloHref()}` resolves to `https://zalo.me/0921985599`, `aria-label="Chat Zalo với Khang Thịnh"` — confirmed in built HTML |
| 4 | Nav anchors smooth-scroll with scroll-margin-top accounting for sticky nav | VERIFIED | globals.css: `html { scroll-behavior: smooth; }` + `section[id] { scroll-margin-top: 4.5rem; }` both present; 5 anchor sections in page.tsx confirmed in built HTML |
| 5 | Real-device smoke test passes (iOS Safari + Android Chrome) | VERIFIED | 02-02-real-device-smoke-test-SUMMARY.md: all 10 checklist items (5 per platform) PASS; tel/zalo.me/mailto confirmed on real devices by project owner |
| 6 | Root layout.tsx declares metadata + lang="vi" + Nav/Footer/FloatingZalo around children | VERIFIED | layout.tsx: `<html lang="vi">`, `metadataBase`, `title` template, `description`, `viewport`; Nav/Footer/FloatingZalo imported and rendered around `{children}` |

**Score:** 6/6 truths verified

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/components/layout/Nav.tsx` | Sticky nav with mobile menu | VERIFIED | 131 lines, 'use client', useState, ESC-close, 5 anchors, hotline, Báo giá CTA |
| `src/components/layout/Footer.tsx` | 3-col footer with legal info | VERIFIED | 117 lines, server component, 3-col grid, legal block, 3 contact CTAs |
| `src/components/layout/FloatingZalo.tsx` | Fixed FAB with zalo deep link | VERIFIED | 30 lines, server component, w-14 h-14, aria-label, zaloHref() |
| `src/app/layout.tsx` | Root layout with metadata + shell wiring | VERIFIED | lang="vi", metadataBase, title template, Nav/Footer/FloatingZalo rendered |
| `src/app/page.tsx` | 5 anchor placeholder sections | VERIFIED | All 5 section IDs present: #dich-vu, #du-an, #nang-luc, #doi-tac, #lien-he |
| `src/app/globals.css` | scroll-margin-top + smooth scroll | VERIFIED | `section[id] { scroll-margin-top: 4.5rem; }`, `html { scroll-behavior: smooth; }` |
| `src/lib/site.ts` | Single source of truth for company data | VERIFIED | All fields present: taxIdDisplay, legalRep, address.full, phoneE164, zaloUrl, email; helpers: telHref(), zaloHref(), mailtoHref() |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| Nav.tsx | lib/site.ts | `import { company, telHref }` | WIRED | company.shortName, company.phoneDisplay, telHref() used in JSX |
| Footer.tsx | lib/site.ts | `import { company, telHref, mailtoHref, zaloHref }` | WIRED | All helpers and company fields used in JSX |
| FloatingZalo.tsx | lib/site.ts | `import { zaloHref }` | WIRED | href={zaloHref()} resolves to https://zalo.me/0921985599 |
| layout.tsx | Nav/Footer/FloatingZalo | import + render | WIRED | All 3 imported and rendered around {children} |
| page.tsx | section[id] anchors | HTML id attributes | WIRED | 5 sections with matching ids for nav anchor hrefs |
| globals.css | section[id] | CSS rule | WIRED | `section[id] { scroll-margin-top: 4.5rem; }` applies to all anchored sections |

---

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| Nav.tsx | company.shortName, company.phoneDisplay, telHref() | lib/site.ts constants | Yes — typed constants, not placeholders | FLOWING |
| Footer.tsx | company.taxIdDisplay, company.legalRep, company.address.full | lib/site.ts constants | Yes — real MST, DDPL, address | FLOWING |
| FloatingZalo.tsx | zaloHref() | lib/site.ts zaloUrl constant | Yes — https://zalo.me/0921985599 | FLOWING |

---

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Build produces /out/ | `npm run build` | exit 0, 5 static pages generated | PASS |
| Wordmark in built HTML | `grep -c 'KHANG THỊNH INV' out/index.html` | 1 | PASS |
| FAB aria-label in built HTML | `grep -c 'aria-label="Chat Zalo với Khang Thịnh"' out/index.html` | 1 | PASS |
| tel: link in built HTML | `grep -c 'tel:+84921985599' out/index.html` | 1 | PASS |
| zalo.me link in built HTML | `grep -c 'https://zalo.me/0921985599' out/index.html` | 1 | PASS |
| mailto: link in built HTML | `grep -c 'mailto:khangthinhinv2025@gmail.com' out/index.html` | 1 | PASS |
| MST in built HTML | `grep -c '1102 107 064' out/index.html` | 1 | PASS |
| DDPL in built HTML | `grep -c 'Tô Thị Bích Ngọc' out/index.html` | 1 | PASS |
| lang="vi" in built HTML | `grep -c 'lang="vi"' out/index.html` | 1 | PASS |
| All 5 anchor IDs in built HTML | grep each id | 1 each | PASS |

---

### Requirements Coverage

| Requirement | Description | Status | Evidence |
|-------------|-------------|--------|----------|
| SHELL-01 | Sticky Nav: logo + 5 anchor links + CTA "Báo giá", hotline desktop, mobile collapse | SATISFIED | Nav.tsx verified; desktop hidden under 768px; mobile hamburger with useState |
| SHELL-02 | Footer: company legal info (MST, address, email, phone) + copyright | SATISFIED | Footer.tsx 3-col with all legal fields from lib/site.ts; copyright bar |
| SHELL-03 | FloatingZalo: fixed bottom-right, mobile+desktop, deep link https://zalo.me/0921985599 | SATISFIED | FloatingZalo.tsx + real-device test PASS on iOS Safari + Android Chrome |
| SHELL-04 | Smooth scroll for anchor links (#dich-vu, #du-an, #nang-luc, #doi-tac, #lien-he) | SATISFIED | globals.css scroll-behavior:smooth + scroll-margin-top:4.5rem; 5 anchor sections present; real-device PASS |
| SHELL-05 | Root layout.tsx with metadata default (title template, description, OG stub, robots, viewport) | SATISFIED | layout.tsx: metadataBase, title template, description, viewport export; lang="vi" |

---

### Context Decisions Coverage (D-01..D-22)

| Decision | Description | Verified |
|----------|-------------|---------|
| D-01 | Logo = text-only wordmark "KHANG THỊNH INV" font-black uppercase burgundy | Yes — Nav.tsx line 43-45 |
| D-02 | Mobile menu = slide-down accordion, useState (not CSS-only) | Yes — useState, useEffect ESC-close, auto-close on link click |
| D-03 | Hotline: desktop visible inline, mobile only in menu drawer | Yes — `hidden md:flex` for desktop hotline; mobile menu includes hotline |
| D-04 | CTA "Báo giá" = solid burgundy button | Yes — `bg-burgundy text-bone px-5 py-3 rounded-sm` |
| D-05 | Anchor slugs Vietnamese: #dich-vu, #du-an, #nang-luc, #doi-tac, #lien-he | Yes — both Nav.tsx and page.tsx IDs match |
| D-06 | 5 anchor labels: Dịch vụ, Dự án, Năng lực, Đối tác, Liên hệ | Yes — navAnchors const in Nav.tsx and Footer.tsx |
| D-07 | CTA "Báo giá" target = #lien-he | Yes — href="#lien-he" in both desktop and mobile CTA |
| D-08 | Active section highlight NOT in Phase 2 | Yes — hover only; no IntersectionObserver |
| D-09 | Footer grid: 3 col desktop / 1 col mobile; Col 1 legal, Col 2 quick links, Col 3 contact | Yes — `grid-cols-1 md:grid-cols-3` |
| D-10 | Quick links in footer = 5 anchors + /du-an route | Yes — navAnchors + Link href="/du-an" |
| D-11 | Copyright: "© 2025 KHANG THỊNH INV. All rights reserved." | Yes — Footer.tsx copyright bar |
| D-12 | No social/external links | Yes — no Facebook/LinkedIn anywhere |
| D-13 | FloatingZalo icon = Lucide MessageCircle (not official Zalo logo) | Yes — `import { MessageCircle }` from lucide-react |
| D-14 | FloatingZalo: bg-burgundy text-bone | Yes — className includes `bg-burgundy text-bone` |
| D-15 | FloatingZalo: icon-only 56x56px round, aria-label for screen readers | Yes — w-14 h-14 rounded-full, aria-label="Chat Zalo với Khang Thịnh" |
| D-16 | FloatingZalo: static hover scale-105, active scale-95; no pulse/bounce | Yes — `hover:scale-105 hover:shadow-lg active:scale-95` only |
| D-17 | Phone link = tel:+84921985599 (E.164) via telHref() | Yes — telHref() returns `tel:${company.phoneE164}` |
| D-18 | Zalo URL = https://zalo.me/0921985599 via zaloHref() | Yes — zaloHref() returns company.zaloUrl; no zalo:// anywhere |
| D-19 | Email link = mailto: + plain-text email next to it | Yes — Footer col 3 shows `<Mail />` icon + company.email text next to mailto link |
| D-20 | scroll-margin-top: 4.5rem on section[id] | Yes — globals.css `section[id] { scroll-margin-top: 4.5rem; }` |
| D-21 | Tap targets: Nav buttons ≥44×44px; FloatingZalo ≥56×56px; hamburger ≥44×44px | Yes — `min-h-[44px]` on all nav links; `w-14 h-14` (56px) on FAB; `w-11 h-11` (44px) hamburger |
| D-22 | All Nav/Footer/FloatingZalo data from src/lib/site.ts — no hardcoded company info | Yes — grep of components returns zero hardcoded company data |

All 22 decisions reflected in code.

---

### Anti-Patterns Found

None. Scan of `src/components/layout/` found:
- No TODO/FIXME/PLACEHOLDER comments in shell components
- No `return null` or empty implementations in shell components
- No `zalo://` scheme (the one grep hit is a comment "NEVER zalo://" in site.ts)
- No hardcoded company info in component JSX — all flows from lib/site.ts
- Phase 1 sentinel `<details>` debug card in page.tsx `#nang-luc` is an intentional, documented stub (not a shell component stub); visually hidden behind `<details>`; will be removed in Phase 3

---

### Human Verification Required

The real-device smoke test was already performed by the project owner on 2026-05-27 and recorded in `02-02-real-device-smoke-test-SUMMARY.md`. All 10 checklist items (5 per platform) passed. No further human verification required for Phase 2 sign-off.

Items deferred to Phase 6 audit (not blocking Phase 2):
- Facebook in-app browser and Zalo in-app browser CTA behavior
- Device model / OS version recording for future regression tracking

---

### Gaps Summary

No gaps. All 6 success criteria verified. All 5 requirements (SHELL-01..05) satisfied. All 22 context decisions reflected in code. Build exits 0 and produces `/out/`. No hardcoded company data. No anti-patterns in shell components.

---

_Verified: 2026-05-27_
_Verifier: Claude (gsd-verifier)_
