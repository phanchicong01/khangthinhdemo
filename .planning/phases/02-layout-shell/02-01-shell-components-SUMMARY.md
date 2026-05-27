---
phase: 02-layout-shell
plan: 01
subsystem: ui
tags: [next15, react19, tailwind4, lucide-react, app-router, accessibility, sticky-nav, floating-cta]

# Dependency graph
requires:
  - phase: 01-foundation-lock-in
    provides: lib/site.ts (company facts, telHref/zaloHref/mailtoHref helpers), globals.css Tailwind v4 @theme palette + Be Vietnam Pro wiring, root layout.tsx metadata + viewport
provides:
  - Sticky Nav (client) with text wordmark, 5 Vietnamese anchors, hotline (desktop), Báo giá CTA, hamburger mobile menu (useState + ESC-to-close + auto-close)
  - Footer (server) 3-col desktop / 1-col mobile with legal block (MST, ĐDPL, address) + quick links + 3 contact CTAs
  - FloatingZalo (server) fixed bottom-right 56x56 burgundy round button with MessageCircle icon
  - Root layout wired with Nav + children + Footer + FloatingZalo around every route
  - 5 anchor placeholder sections in app/page.tsx (#dich-vu, #du-an, #nang-luc, #doi-tac, #lien-he)
  - scroll-margin-top: 4.5rem on section[id] so sticky nav does not cover anchor headings
affects: [03-sections, 04-projects-page, 05-seo]

# Tech tracking
tech-stack:
  added:
    - lucide-react ^1.16 (tree-shakable icon set; Phone, Mail, MessageCircle, MapPin, Menu, X)
  patterns:
    - Server components by default; client component only when needed (Nav uses useState for ESC/auto-close a11y)
    - Components nested under src/components/layout/ (anticipates src/components/sections/ in Phase 3)
    - All company data flows from src/lib/site.ts — never hardcoded in JSX
    - Tap targets enforced via min-h-[44px] on Nav links / w-14 h-14 (56px) on FloatingZalo
    - prefers-reduced-motion honored via motion-reduce:* Tailwind variants on FloatingZalo

key-files:
  created:
    - src/components/layout/Nav.tsx
    - src/components/layout/Footer.tsx
    - src/components/layout/FloatingZalo.tsx
  modified:
    - src/app/layout.tsx
    - src/app/page.tsx
    - src/app/globals.css
    - package.json
    - package-lock.json

key-decisions:
  - "Picked useState for Nav mobile menu (over CSS-only peer-checked) so ESC closes menu, links auto-close menu, and aria-expanded reflects state — a11y wins outweigh client-component cost"
  - "Placed shell components at src/components/layout/ (nested) to anticipate Phase 3 src/components/sections/ — per CONTEXT.md open_questions q1 recommendation"
  - "Preserved Phase 1 sentinel content as a <details> debug card inside #nang-luc instead of deleting — keeps env-var/palette readout inspectable until Phase 3 replaces the section"
  - "Used motion-reduce: Tailwind variants on FloatingZalo to honor prefers-reduced-motion: reduce (CONTEXT.md discretion item)"

patterns-established:
  - "Pattern: Layout components live in src/components/layout/; section components will live in src/components/sections/ (Phase 3)"
  - "Pattern: Single navAnchors constant defined locally in both Nav.tsx and Footer.tsx (intentionally duplicated — 5 items, low churn risk, avoids creating a shared util just for two consumers)"
  - "Pattern: Client component opt-in is explicit and minimal — only Nav.tsx carries 'use client' because of mobile-menu state; Footer + FloatingZalo remain server-rendered"
  - "Pattern: aria-label uses Vietnamese for user-facing voice ('Chat Zalo với Khang Thịnh', 'Mở menu' / 'Đóng menu', 'Điều hướng chính')"

requirements-completed: [SHELL-01, SHELL-02, SHELL-03, SHELL-04, SHELL-05]

# Metrics
duration: 3min
completed: 2026-05-27
---

# Phase 2 Plan 1: Shell Components Summary

**Sticky Nav + 3-col Footer + bottom-right FloatingZalo CTA wired into root layout; 5 Vietnamese anchor placeholders in app/page.tsx; static export produces all shell artifacts in out/index.html.**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-05-27T02:00:13Z
- **Completed:** 2026-05-27T02:03:49Z
- **Tasks:** 3
- **Files modified:** 8 (3 created, 5 modified)

## Accomplishments
- Persistent shell renders on every route: sticky Nav (top) + Footer (bottom) + FloatingZalo (fixed bottom-right)
- Mobile-responsive Nav with hamburger drawer that closes on ESC, link click, and toggle
- All shell components source company data from `@/lib/site` — zero hardcoded MST/phone/email
- Static export passes: `npm run build` exits 0, `out/index.html` contains wordmark + 5 anchor IDs + footer copyright + FAB aria-label
- HTTPS-only Zalo deep link (`https://zalo.me/0921985599`); E.164 tel link (`tel:+84921985599`); no `zalo://` scheme anywhere

## Task Commits

Each task was committed atomically:

1. **Task 1: Footer + FloatingZalo (server components)** — `6426da2` (feat)
2. **Task 2: Nav (client component with useState mobile menu)** — `d3c3bcc` (feat)
3. **Task 3: Wire shell into root layout + anchor placeholders + scroll-margin-top + build verification** — `e1beb02` (feat)

## Files Created/Modified

**Created:**
- `src/components/layout/Footer.tsx` — Server-rendered footer: 3-col desktop / 1-col mobile with legal block (legalName, taxIdDisplay, legalRep, full address), 5 quick anchor links + /du-an route link, 3 contact CTAs (tel/zalo/mailto), copyright bar
- `src/components/layout/FloatingZalo.tsx` — Server-rendered fixed `<a>` tag, 56×56px burgundy round, Lucide MessageCircle icon, `aria-label="Chat Zalo với Khang Thịnh"`, motion-reduce honored
- `src/components/layout/Nav.tsx` — Client component (`'use client'`) with useState mobile menu, useEffect ESC-to-close hook, sticky top-0 z-40, wordmark + 5 anchors + hotline (desktop) + Báo giá CTA + hamburger toggle

**Modified:**
- `src/app/layout.tsx` — Added Nav/Footer/FloatingZalo imports; rendered `<Nav />` `{children}` `<Footer />` `<FloatingZalo />` inside `<body>`; preserved Phase 1 font + metadata + viewport exports verbatim
- `src/app/page.tsx` — Replaced Phase 1 sentinel JSX with 5 anchor placeholder sections (Dịch vụ, Dự án, Năng lực, Đối tác, Liên hệ); Phase 1 sentinel content preserved inside `#nang-luc` as `<details>` debug card
- `src/app/globals.css` — Appended `section[id] { scroll-margin-top: 4.5rem; }` below the prefers-reduced-motion block; did NOT touch `@theme` or `@theme inline` or `:root`
- `package.json`, `package-lock.json` — Added `lucide-react` dependency

## Decisions Made
- **Nav mobile menu = useState (client component)** instead of CSS-only `peer-checked`. Reason: ESC-to-close + auto-close on link click + accurate `aria-expanded` for screen readers — a11y wins outweigh the small bundle cost of a client component. (CONTEXT.md D-02 left this open; planner + executor chose useState.)
- **Component path = `src/components/layout/`** (nested) instead of `src/components/`. Reason: Phase 3 will add `src/components/sections/`; nesting now prevents a future move. (CONTEXT.md open_questions q1 recommended.)
- **Phase 1 sentinel preserved** in `#nang-luc` `<details>` instead of deleted. Reason: env-var/palette/font readout still useful during Phase 2/3 development; visually unobtrusive behind a `<details>` element.
- **`motion-reduce:` variants on FloatingZalo** even though plan listed it as discretionary. Reason: cheap to add, complies with WCAG 2.1 SC 2.3.3.
- **`navAnchors` const duplicated** in Nav.tsx and Footer.tsx (5 entries each) instead of extracted to a shared module. Reason: only 2 consumers, 5 entries, very low churn — shared util would be premature abstraction.

## Deviations from Plan

None — plan executed exactly as written. All skeleton code, Tailwind classes, ARIA attributes, anchor slugs, file paths, and import patterns ship verbatim from the plan. The `lucide-react` install was anticipated by the plan ("if missing, install via `npm install lucide-react`"); it was not in `package.json` at plan start, so it was installed once before Task 1 ran.

## Issues Encountered

- **Next.js workspace-root warning:** Build emits `⚠ Warning: Next.js inferred your workspace root, but it may not be correct. We detected multiple lockfiles and selected the directory of /Users/congphan/pnpm-lock.yaml as the root directory.` This is caused by a parent-directory `pnpm-lock.yaml` outside the project root. **Out of scope** for this plan — does NOT block the build (exit 0, all 5 static pages generated). Logged to `.planning/phases/02-layout-shell/deferred-items.md` for future cleanup (set `outputFileTracingRoot` in `next.config.ts`).

## User Setup Required

None — no external service configuration required for this plan. Phase 2 Plan 02 (real-device smoke test) will require user action on iOS Safari + Android Chrome devices.

## Known Stubs

- **Phase 1 sentinel debug card** inside `app/page.tsx` `#nang-luc` section — intentionally preserved as a `<details>` block; will be deleted in Phase 3 when the real Capabilities section replaces this placeholder. Not a blocker because the rest of `#nang-luc` already has a placeholder heading + copy that the smooth-scroll smoke test (Plan 02-02) can verify.
- **5 anchor placeholder sections** in `app/page.tsx` (`#dich-vu`, `#du-an`, `#nang-luc`, `#doi-tac`, `#lien-he`) render headings + placeholder Vietnamese copy only. Intentional per CONTEXT.md open_questions q3 — Phase 3 plans will replace each placeholder with the real section component (SEC-02..SEC-08).

## Next Phase Readiness

- Shell is built and statically rendered. Plan 02-02 (real-device CTA smoke test) can now run against `npm run dev` (or `npm run start` after a build) to verify:
  - Sticky Nav behavior on iOS Safari + Android Chrome
  - Mobile hamburger drawer opens/closes; ESC closes menu; tap-outside does NOT close (acceptable per D-02)
  - `tel:+84921985599` opens the native dialer on both platforms
  - `https://zalo.me/0921985599` opens the Zalo app (or browser fallback if Zalo not installed)
  - `mailto:khangthinhinv2025@gmail.com` opens the native mail composer
  - FloatingZalo is reachable and not occluded by browser chrome
  - Smooth-scroll lands each anchor heading 4.5rem below the sticky nav (not flush)
- No blockers. No pending Rule-4 architectural questions.

## Self-Check: PASSED

- src/components/layout/Footer.tsx — FOUND
- src/components/layout/FloatingZalo.tsx — FOUND
- src/components/layout/Nav.tsx — FOUND
- src/app/layout.tsx — FOUND (modified)
- src/app/page.tsx — FOUND (modified)
- src/app/globals.css — FOUND (modified)
- Commit 6426da2 (Task 1) — FOUND in git log
- Commit d3c3bcc (Task 2) — FOUND in git log
- Commit e1beb02 (Task 3) — FOUND in git log
- out/index.html — FOUND (contains wordmark + 5 anchor IDs + FAB aria-label + footer copyright; no `zalo://`)

---
*Phase: 02-layout-shell*
*Completed: 2026-05-27*
