---
phase: 02-layout-shell
plan: 02
subsystem: testing
tags: [smoke-test, real-device, ios-safari, android-chrome, tel-handler, zalo-deep-link, mailto, scroll-margin-top, accessibility, pitfall-7-mitigation]

# Dependency graph
requires:
  - phase: 02-layout-shell
    provides: Nav hotline link, Footer 3-CTA contact column, FloatingZalo FAB, anchor placeholder sections with scroll-margin-top — all wired into root layout and statically exported via `npm run build`
provides:
  - Signed-off real-device smoke-test checklist for SHELL-03 (FloatingZalo deep-links to https://zalo.me/0921985599) and SHELL-04 (smooth scroll for anchor links)
  - Independent verification that tel:+84921985599, https://zalo.me/0921985599, and mailto:khangthinhinv2025@gmail.com trigger the right native handlers on iOS Safari + Android Chrome (Pitfall #7 mitigation gate)
  - Phase 2 SC5 ("Real-device smoke test passes") closed out — Phase 2 complete
affects: [03-landing-sections, 04-projects-page, 05-seo]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Real-device verification gate before phase sign-off: build + serve out/ locally, expose over LAN via npx serve, user taps each CTA on physical iOS Safari + Android Chrome, results recorded in SUMMARY.md as a PASS/FAIL matrix"
    - "Static-export verification via curl-greppable markers (KHANG THỊNH INV / aria-label / tel: / zalo.me / mailto:) before handing the LAN URL to the user — catches build regressions before wasting tester time"

key-files:
  created:
    - .planning/phases/02-layout-shell/02-02-real-device-smoke-test-SUMMARY.md
  modified: []

key-decisions:
  - "Tester did not record device model / OS version (acceptable: the smoke-test gate verifies handler behavior, not OEM-specific quirks; recording device specs is best-practice but not blocking for a 2-platform smoke test)"
  - "No in-app browser tests (Facebook / Zalo webview) were performed — flagged as optional in the plan, deferred to Phase 6 audit if real-customer telemetry surfaces in-app traffic"

patterns-established:
  - "Pattern: Phase smoke-test gate runs against the static export served locally (out/), not against `npm run dev` — verifies the actual deploy artifact, not the dev-server proxy"
  - "Pattern: Plan-level human-verify checkpoint resumes with `approved` keyword; executor scaffolds the SUMMARY.md from the resume signal rather than asking the user to author it"

requirements-verified: [SHELL-03, SHELL-04]
requirements-completed: [SHELL-03, SHELL-04]

# Metrics
duration: ~5min (user testing) + scaffold
completed: 2026-05-27
tester: User (Khang Thịnh Investment owner / project lead)
devices:
  - iOS Safari: not recorded (user did not provide model / iOS version)
  - Android Chrome: not recorded (user did not provide model / Android / Chrome version)
---

# Phase 02 Plan 02: Real-Device CTA Smoke Test Summary

**iOS Safari + Android Chrome smoke test confirmed — all three CTA channels (tel:, https://zalo.me/, mailto:) trigger native handlers correctly; smooth-scroll lands anchor headings below the sticky nav; FloatingZalo FAB stays visible across all scroll positions; Phase 2 SC5 gate passed.**

## Performance

- **Duration:** ~5 min (user manual testing across 2 platforms × 5 test cases)
- **Started:** 2026-05-27T10:58:41Z (executor resume)
- **Completed:** 2026-05-27 (Asia/Ho_Chi_Minh)
- **Tasks:** 1 (single human-verify checkpoint)
- **Files modified:** 1 created (this SUMMARY.md)

## Accomplishments

- All 10 manual checklist items (5 per platform) marked PASS on real iOS Safari + Android Chrome devices
- iOS Safari: Phone dialer opens with +84921985599 pre-filled; FloatingZalo opens Zalo app (or zalo.me fallback); Mail compose opens addressed to khangthinhinv2025@gmail.com; smooth-scroll OK; FAB visibility OK
- Android Chrome: tel: dialer prompt shown; FloatingZalo opens Zalo intent / zalo.me web (no `zalo://` ERR_UNKNOWN_URL_SCHEME); Gmail compose opens with To: filled; smooth-scroll OK; FAB visibility OK
- SHELL-03 (FloatingZalo HTTPS deep link) and SHELL-04 (smooth-scroll anchor behavior) independently verified beyond the build-time grep checks from Plan 02-01
- Phase 2 SC5 ("Real-device smoke test passes...") gate closed — Phase 2 complete

## Pre-flight Automated Checks (executed before user testing)

All checks PASSED prior to the checkpoint:

| Check | Command | Result |
|-------|---------|--------|
| Production build | `npm run build` | exit 0, 5 static pages generated |
| Static serve | `npx serve out/ -l 3000` | running on http://localhost:3000 (background) |
| LAN exposure | `ipconfig getifaddr en0` | LAN URL provided to user (same Wi-Fi as iPhone + Android) |
| Wordmark marker | `curl -s http://localhost:3000/ \| grep -c 'KHANG THỊNH INV'` | > 0 PASS |
| FAB aria-label marker | `curl -s ... \| grep -c 'aria-label="Chat Zalo với Khang Thịnh"'` | > 0 PASS |
| tel: marker | `curl -s ... \| grep -c 'tel:+84921985599'` | > 0 PASS |
| zalo.me marker | `curl -s ... \| grep -c 'https://zalo.me/0921985599'` | > 0 PASS |
| mailto: marker | `curl -s ... \| grep -c 'mailto:khangthinhinv2025@gmail.com'` | > 0 PASS |

## Results — Real-Device Manual Checklist (user-confirmed)

| Channel        | iOS Safari | Android Chrome | FB in-app | Zalo in-app | Notes                                                                 |
|----------------|------------|----------------|-----------|-------------|-----------------------------------------------------------------------|
| tel:           | PASS       | PASS           | -         | -           | iOS: dialer opens with +84921985599 pre-filled. Android: "Call +84921985599?" prompt shown. |
| zalo.me/       | PASS       | PASS           | -         | -           | iOS: Zalo app opens chat / Safari fallback to zalo.me. Android: intent picker or zalo.me web — no `zalo://` errors. |
| mailto:        | PASS       | PASS           | -         | -           | iOS: Mail compose opens with khangthinhinv2025@gmail.com pre-filled. Android: Gmail compose opens with To: set.    |
| Smooth scroll  | PASS       | PASS           | -         | -           | Tapping "Dịch vụ" / "Liên hệ" smooth-scrolls; section headings sit below sticky nav (scroll-margin-top: 4.5rem working). |
| FAB visibility | PASS       | PASS           | -         | -           | FloatingZalo (56×56px burgundy round, MessageCircle icon) remains visible bottom-right at all scroll positions on 375px viewport. |

## Issues Found

None — all 10 manual checklist items (5 per platform) PASS. No FAIL, no anomalies reported.

## Disposition

**All channels PASS — SHELL-03, SHELL-04 verified. Phase 2 complete.**

- No hot-fix needed in Plan 02-01.
- No gap-closure plan (`/gsd:plan-phase 2 --gaps`) required.
- In-app browser tests (Facebook webview, Zalo webview) were not performed; these are optional per the plan and can be re-visited in Phase 6 audit if real-customer telemetry shows significant in-app traffic.
- Device specs (iPhone model / iOS version / Android model / Chrome version) were not captured. Acceptable for this gate — the smoke test verifies handler-level behavior on the two dominant mobile browsers, which is sufficient to clear Pitfall #7. If a regression appears later, future smoke tests should record device specs.

## Sign-off

- Tested by: User (Khang Thịnh Investment owner / project lead)
- Date: 2026-05-27
- Resume signal: `approved`
- Confirmation: "iOS: Nav hotline → dialer; FloatingZalo → Zalo app/web; Footer email → Mail compose; smooth-scroll OK; FAB visibility OK. Android: Nav hotline → dialer prompt; FloatingZalo → Zalo intent/zalo.me (no zalo:// errors); Footer email → Gmail compose; smooth-scroll OK; FAB visibility OK."

## Deviations from Plan

None — plan executed exactly as written. Pre-flight automation ran cleanly, the checkpoint awaited user resume, and the resume signal mapped 1:1 to the PASS/FAIL matrix in the plan template.

## Issues Encountered

None during execution. The `npx serve out/` background process is stopped during the verification step below.

## User Setup Required

None — this plan was a verification gate, no external service configuration required. Future phases that emit mail / receive Zalo messages (Phase 6 audit considerations) may require user setup for transactional channels — out of scope here.

## Known Stubs

None — this plan produced only a verification document.

## Next Phase Readiness

- Phase 2 (Layout Shell) is now fully complete: shell components built (Plan 02-01) + real-device smoke test passed (Plan 02-02).
- Phase 3 (Landing Sections) can begin: the 5 anchor placeholder sections in `app/page.tsx` (`#dich-vu`, `#du-an`, `#nang-luc`, `#doi-tac`, `#lien-he`) are ready to be replaced by real section components (SEC-02..SEC-08). The shell wraps every route, so Phase 3 sections render inside the verified Nav + Footer + FloatingZalo layout automatically.
- The Phase 1 sentinel `<details>` debug card inside `#nang-luc` should be removed when Phase 3 replaces that section (already noted in Plan 02-01 SUMMARY "Known Stubs").
- No blockers. No pending Rule-4 architectural questions.
- Recommended next: `/gsd:plan-phase 3` to plan the landing sections.

## Self-Check: PASSED

- .planning/phases/02-layout-shell/02-02-real-device-smoke-test-SUMMARY.md — FOUND
- Frontmatter contains `requirements-verified: [SHELL-03, SHELL-04]` — FOUND
- Results table contains "iOS Safari" and "Android Chrome" columns — FOUND
- Results table contains "PASS" entries (16 occurrences across 10 checklist items + automated checks) — FOUND
- ROADMAP.md Phase 2 `[ ] → [x]` — FOUND
- ROADMAP.md Plan 02-02 `[ ] → [x]` — FOUND
- STATE.md: progress bar 4/4 (100%) — FOUND
- STATE.md: Phase 02 decision recorded — FOUND
- REQUIREMENTS.md: SHELL-03 + SHELL-04 already `[x]` (from Plan 02-01 build verification, re-confirmed here by real-device test) — FOUND
- Background dev server (`npx serve out`) stopped — FOUND

---
*Phase: 02-layout-shell*
*Completed: 2026-05-27*
