---
phase: 02-layout-shell
plan: 02
type: execute
wave: 2
depends_on:
  - "02-01"
files_modified:
  - .planning/phases/02-layout-shell/02-02-real-device-smoke-test-SUMMARY.md
autonomous: false
requirements:
  - SHELL-03
  - SHELL-04

must_haves:
  truths:
    - "On a real iOS Safari device, tapping the Nav hotline opens the iOS Phone dialer pre-filled with +84921985599"
    - "On a real iOS Safari device, tapping FloatingZalo opens the Zalo app (if installed) or zalo.me web fallback"
    - "On a real iOS Safari device, tapping the Footer email link composes a new email in the default mail app addressed to khangthinhinv2025@gmail.com"
    - "On a real Android Chrome device, the same three CTAs (tel / Zalo / mailto) trigger the equivalent native handlers"
    - "Tapping any Nav anchor smooth-scrolls the page to the matching section and the section heading is NOT hidden under the sticky nav"
    - "FloatingZalo remains visible and tappable on every scroll position and does not occlude critical content on a 375px-wide viewport"
    - "User explicitly confirms all three channels work on both platforms — recorded in the SUMMARY.md checklist"
  artifacts:
    - path: ".planning/phases/02-layout-shell/02-02-real-device-smoke-test-SUMMARY.md"
      provides: "Signed-off real-device smoke-test checklist for SHELL-03 and SHELL-04"
      contains: "iOS Safari"
  key_links:
    - from: "User device (iOS Safari)"
      to: "tel:+84921985599 / https://zalo.me/0921985599 / mailto:khangthinhinv2025@gmail.com"
      via: "tap on Nav hotline, FloatingZalo, Footer Email link"
      pattern: "manual verification"
    - from: "User device (Android Chrome)"
      to: "tel:+84921985599 / https://zalo.me/0921985599 / mailto:khangthinhinv2025@gmail.com"
      via: "tap on Nav hotline, FloatingZalo, Footer Email link"
      pattern: "manual verification"
---

<objective>
Run a real-device smoke test on iOS Safari and Android Chrome to prove the shell's three CTA channels (tel, Zalo HTTPS deep link, mailto) actually trigger the right native handlers in the wild. This is the Pitfall #7 mitigation gate — devs routinely test only desktop Chrome where `tel:` "kind of works" and miss that the production CTA path is broken on the very devices Khang Thịnh's customers use.

Purpose: Phase 2 SC5 ("Real-device smoke test passes") and the PITFALLS.md "All CTAs: click each on real iPhone + real Android — Tel opens dialer, Zalo opens app, mailto opens compose" checklist item. This is a **human verification checkpoint** — Claude cannot autonomously run iOS Safari + Android Chrome. The objective is for the user to confirm on physical hardware (or BrowserStack equivalent) that the build deployed locally / on a preview URL works.

Output:
- A signed-off `02-02-real-device-smoke-test-SUMMARY.md` checklist documenting:
  - Which devices/browsers were tested
  - Tap result for each of the 6 channel-device combinations (3 CTAs × 2 platforms)
  - Smooth-scroll behavior confirmed on both platforms
  - Any issues found → triaged into either (a) a hot-fix task added to Plan 02-01 by the user, or (b) a backlog item for Phase 6 audit
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/ROADMAP.md
@.planning/REQUIREMENTS.md
@.planning/phases/02-layout-shell/02-CONTEXT.md
@.planning/phases/02-layout-shell/02-01-shell-components-PLAN.md
@.planning/research/PITFALLS.md
@src/lib/site.ts

<interfaces>
<!-- The 3 CTA targets being verified — all sourced from src/lib/site.ts. -->
- Phone (tel): `tel:+84921985599` (E.164, no spaces) — displayed as "092 198 55 99"
- Zalo (HTTPS deep link): `https://zalo.me/0921985599` (NOT `zalo://`) — iOS Universal Link / Android intent
- Email (mailto): `mailto:khangthinhinv2025@gmail.com` — displayed as plain text next to icon

These three CTAs appear in these UI surfaces (all from Plan 02-01):
1. Nav (desktop nav bar) — Hotline link
2. Nav (mobile menu) — Hotline link
3. Footer Col 3 — Phone, Zalo, Email (3 links)
4. FloatingZalo (bottom-right FAB) — Zalo only
</interfaces>

<pre_flight>
Before the user starts tapping, Claude executes the following autonomous setup steps:

1. **Build + serve locally:**
   ```bash
   npm run build
   npx serve out/ -l 3000
   ```
   This serves the static export at http://localhost:3000.

2. **Expose to LAN so a real phone can reach it.** Provide the user with the LAN URL (`http://<host-IP>:3000`). The exact discovery command depends on platform:
   - macOS: `ipconfig getifaddr en0` (Wi-Fi) — print result.
   - The user's iPhone + Android phone must be on the same Wi-Fi network.

3. **Confirm the LAN URL renders the shell** by `curl`ing it from the dev machine and grepping the expected markers:
   ```bash
   curl -s http://localhost:3000/ | grep -c 'KHANG THỊNH INV'   # > 0
   curl -s http://localhost:3000/ | grep -c 'aria-label="Chat Zalo với Khang Thịnh"'  # > 0
   curl -s http://localhost:3000/ | grep -c 'tel:+84921985599'  # > 0
   curl -s http://localhost:3000/ | grep -c 'https://zalo.me/0921985599'  # > 0
   curl -s http://localhost:3000/ | grep -c 'mailto:khangthinhinv2025@gmail.com'  # > 0
   ```

4. **Print the smoke-test checklist** (below) to the user with the LAN URL and the resume-signal instruction.
</pre_flight>
</context>

<tasks>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 1: Real-device CTA smoke test — iOS Safari + Android Chrome</name>
  <files>.planning/phases/02-layout-shell/02-02-real-device-smoke-test-SUMMARY.md</files>
  <read_first>
    - .planning/research/PITFALLS.md §"Pitfall 7" (lines 235-270) — the exact failure modes being checked
    - .planning/phases/02-layout-shell/02-01-shell-components-PLAN.md (the shell that just shipped)
    - src/lib/site.ts (the canonical CTA targets — confirms what should fire)
  </read_first>
  <action>
    1. Run the pre-flight build + serve described in the <pre_flight> context block: `npm run build && npx serve out/ -l 3000` (background), then `ipconfig getifaddr en0` to get the LAN IP, then curl-verify the 5 markers (KHANG THỊNH INV / aria-label / tel: / zalo.me / mailto:).
    2. Print the LAN URL (http://<IP>:3000) to the user, then present the <how-to-verify> test matrix below.
    3. Wait for the user to perform the manual taps on iOS Safari + Android Chrome and reply with one of the resume signals.
    4. On resume: scaffold .planning/phases/02-layout-shell/02-02-real-device-smoke-test-SUMMARY.md using the template in <how-to-verify>, fill in the PASS/FAIL entries from the user's reply, stop the npx serve background process.
    5. If all PASS: commit the SUMMARY.md, mark Phase 2 complete in ROADMAP.md (Phase 2 [ ] → [x]). If any FAIL: commit SUMMARY.md with issues recorded and recommend `/gsd:plan-phase 2 --gaps`.
  </action>
  <verify>
    <automated>test -f .planning/phases/02-layout-shell/02-02-real-device-smoke-test-SUMMARY.md && grep -q 'requirements-verified' .planning/phases/02-layout-shell/02-02-real-device-smoke-test-SUMMARY.md && grep -q 'iOS Safari' .planning/phases/02-layout-shell/02-02-real-device-smoke-test-SUMMARY.md && grep -q 'Android Chrome' .planning/phases/02-layout-shell/02-02-real-device-smoke-test-SUMMARY.md && grep -qE 'PASS|FAIL' .planning/phases/02-layout-shell/02-02-real-device-smoke-test-SUMMARY.md</automated>
  </verify>
  <what-built>
    Plan 02-01 just shipped a static-exported Next.js build containing:
    - Sticky Nav with hotline link (`tel:+84921985599`) — visible on desktop, in mobile menu on <768px
    - Footer with three CTAs (`tel:`, `https://zalo.me/0921985599`, `mailto:khangthinhinv2025@gmail.com`)
    - FloatingZalo FAB (bottom-right, 56×56px) linking to `https://zalo.me/0921985599`
    - 5 Vietnamese anchor placeholder sections with `scroll-margin-top: 4.5rem`

    Claude has built + served the static export at `http://localhost:3000` and printed the LAN URL.
  </what-built>
  <how-to-verify>
    **Prerequisites:**
    1. Your iPhone (iOS Safari) and an Android device (Chrome) must be on the same Wi-Fi as the dev machine.
    2. Open `http://<LAN-IP>:3000` (provided by Claude in pre-flight) in **iOS Safari** on the iPhone and in **Chrome** on the Android device.
    3. Recommended: also test inside the **Facebook in-app browser** and **Zalo in-app browser** (paste the LAN URL into a Messenger / Zalo chat to yourself and tap it). These in-app webviews handle deep links inconsistently and are real customer touchpoints — per PITFALLS.md §7.

    **Test Matrix — tick each box below. Record results in the SUMMARY.md template at the end.**

    ### iOS Safari (iPhone)
    - [ ] **Nav hotline (desktop nav OR mobile menu)** — Tap the "092 198 55 99" link. Expected: iOS Phone app opens with `+84 92 198 55 99` pre-filled; tapping the green call button would place the call. Confirm WITHOUT placing the call.
    - [ ] **FloatingZalo FAB (bottom-right)** — Tap the round burgundy button. Expected: if Zalo app is installed, it opens the chat with `0921985599`. If not installed, Safari opens `https://zalo.me/0921985599` web page. EITHER outcome is acceptable; what is NOT acceptable is "about:blank", "page can't be loaded", or no response.
    - [ ] **Footer Email link** — Scroll to Footer Col 3, tap the email row. Expected: iOS Mail (or default mail app) opens a new email composer addressed to `khangthinhinv2025@gmail.com`. Confirm WITHOUT sending.
    - [ ] **Nav anchor smooth-scroll** — Tap "Dịch vụ" then "Liên hệ" in the Nav (mobile menu opens, tap the link). Expected: page smooth-scrolls to each section AND the section heading is NOT hidden under the sticky nav.
    - [ ] **FloatingZalo visibility while scrolling** — Scroll from top to bottom of page; the FAB must remain visible bottom-right at all scroll positions. It must not occlude any text in a way that makes content unreadable on 375px width.

    ### Android Chrome
    - [ ] **Nav hotline** — Tap "092 198 55 99". Expected: Chrome shows a "Call +84921985599?" prompt OR opens the Phone app directly. Either works — what we are checking is that a tel: handler is invoked at all.
    - [ ] **FloatingZalo FAB** — Tap. Expected: Android intent picker shows Zalo app (if installed) OR Chrome opens zalo.me web page. Any outcome other than "no response" / "ERR_UNKNOWN_URL_SCHEME" passes. CRITICAL: if you see `zalo://` in the URL bar or error message, the link is wrong — FAIL and report.
    - [ ] **Footer Email link** — Tap. Expected: Gmail (or default mail) composer opens with `khangthinhinv2025@gmail.com` in the To: field.
    - [ ] **Nav anchor smooth-scroll** — Same as iOS test above; tap "Liên hệ" → smooth scroll, heading visible below sticky nav.
    - [ ] **FloatingZalo visibility** — Same as iOS test above.

    ### Optional but recommended (in-app browsers)
    - [ ] **Facebook in-app browser (iOS or Android)** — Paste LAN URL in a Messenger chat to yourself, tap it. Test tel + Zalo + mailto. Note: in-app browsers can block deep links — if they fail HERE but pass in Safari/Chrome, document it as "known FB-webview limitation" — NOT a blocker for shipping Phase 2.
    - [ ] **Zalo in-app browser** — Paste LAN URL in a Zalo chat to yourself, tap it. Test the same three CTAs.

    ### Fill in the smoke-test summary

    Create `/Users/congphan/Workspace/my-projects/khang-thing-group/website/.planning/phases/02-layout-shell/02-02-real-device-smoke-test-SUMMARY.md` with this template (Claude will scaffold it on resume — user just provides the result columns):

    ```markdown
    ---
    phase: 02-layout-shell
    plan: 02
    type: smoke-test
    requirements-verified: [SHELL-03, SHELL-04]
    completed: <DATE>
    tester: <USER NAME>
    devices:
      - iOS Safari: <iPhone model, iOS version>
      - Android Chrome: <device model, Android version, Chrome version>
    ---

    # Phase 02 Plan 02: Real-Device CTA Smoke Test Summary

    ## Results

    | Channel       | iOS Safari | Android Chrome | FB in-app | Zalo in-app | Notes |
    |---------------|------------|----------------|-----------|-------------|-------|
    | tel:          | PASS / FAIL | PASS / FAIL    | -         | -           |       |
    | zalo.me/      | PASS / FAIL | PASS / FAIL    | -         | -           |       |
    | mailto:       | PASS / FAIL | PASS / FAIL    | -         | -           |       |
    | Smooth scroll | PASS / FAIL | PASS / FAIL    | -         | -           |       |
    | FAB visibility| PASS / FAIL | PASS / FAIL    | -         | -           |       |

    ## Issues Found

    <If any FAIL or anomaly: list here. Each issue includes: device/browser, channel, exact behavior observed, expected behavior.>

    ## Disposition

    <Either:
     - "All channels PASS — SHELL-03, SHELL-04 verified. Phase 2 complete."
     - "Issues filed: <list>. Hot-fix added to Plan 02-01? Or deferred to Phase 6 audit?">

    ## Sign-off

    Tested by: <name>
    Date: <date>
    ```

    ### Resume signal
    Once the test matrix is complete:
  </how-to-verify>
  <resume-signal>
    Reply with ONE of:
    - **"approved"** — all checked boxes pass; Claude will scaffold the SUMMARY.md from your results and mark Phase 2 complete.
    - **"approved with issues: <list>"** — most channels pass but some non-blocking issues; Claude will record them in SUMMARY.md "Issues Found" and disposition them per your direction (hot-fix in Plan 02-01 vs defer to Phase 6).
    - **"failed: <which channel(s)>"** — one or more CRITICAL channels broken (e.g., FloatingZalo opens about:blank); Claude will open a gap-closure plan to fix Plan 02-01.
    - **"need help: <description>"** — anything unclear about the test steps; Claude will clarify and you can re-test.
  </resume-signal>
  <acceptance_criteria>
    - File `.planning/phases/02-layout-shell/02-02-real-device-smoke-test-SUMMARY.md` exists.
    - SUMMARY.md frontmatter contains `requirements-verified: [SHELL-03, SHELL-04]`.
    - SUMMARY.md contains a results table with PASS/FAIL entries for at least: tel, zalo.me, mailto, smooth scroll, FAB visibility — on both iOS Safari and Android Chrome.
    - SUMMARY.md contains a "Disposition" line that is either "All channels PASS" OR a non-empty list of filed issues with their disposition (hot-fix or defer).
    - SUMMARY.md contains a "Sign-off" block with tester name + date.
    - If any channel marked FAIL: a follow-up gap-closure plan (per `/gsd:plan-phase --gaps`) is recommended in the disposition.
  </acceptance_criteria>
  <done>
    User has run all 5 test cases (tel, zalo, mailto, smooth-scroll, FAB visibility) on at least iOS Safari and Android Chrome, recorded results in SUMMARY.md, and replied with one of the resume signals. If "approved", SHELL-03 and SHELL-04 are independently verified beyond the static-export grep checks from Plan 02-01.
  </done>
</task>

</tasks>

<verification>
After the user replies with the resume signal, Claude:

1. Reads the user's reply and updates the SUMMARY.md accordingly.
2. Greps the SUMMARY.md to confirm all required fields are present:
   ```bash
   grep -q "requirements-verified" .planning/phases/02-layout-shell/02-02-real-device-smoke-test-SUMMARY.md &&
   grep -q "iOS Safari" .planning/phases/02-layout-shell/02-02-real-device-smoke-test-SUMMARY.md &&
   grep -q "Android Chrome" .planning/phases/02-layout-shell/02-02-real-device-smoke-test-SUMMARY.md &&
   grep -qE "PASS|FAIL" .planning/phases/02-layout-shell/02-02-real-device-smoke-test-SUMMARY.md
   ```
3. Stops the `npx serve` dev process.
4. If "approved": commits SUMMARY.md, declares Phase 2 complete, recommends `/gsd:plan-phase 3`.
5. If "approved with issues" or "failed": commits SUMMARY.md with issues recorded, recommends `/gsd:plan-phase 2 --gaps` to close the verification gaps.
</verification>

<success_criteria>
- [x] Real-device smoke test executed on iOS Safari (iPhone) AND Android Chrome (Android device) — at minimum.
- [x] All 5 test cases (tel, zalo, mailto, smooth-scroll, FAB visibility) results recorded per platform.
- [x] SUMMARY.md committed with a clear disposition.
- [x] If all PASS: SHELL-03 ("FloatingZalo deep-links to https://zalo.me/0921985599") and SHELL-04 ("Smooth scroll for anchor links") are independently verified beyond the build-time grep checks.
- [x] If any FAIL: a gap-closure plan is requested (not silently shipped).

Per ROADMAP Phase 2 SC5: "Real-device smoke test passes: on iOS Safari and Android Chrome, tapping the Nav hotline opens the dialer, tapping FloatingZalo opens Zalo app/web, mailto link composes an email" — this plan IS that gate.
</success_criteria>

<output>
After completion, the SUMMARY.md (already created by the user with PASS/FAIL entries) IS the deliverable. Claude additionally ensures:
- The SUMMARY.md has correct frontmatter (`requirements-verified: [SHELL-03, SHELL-04]`, `completed: <date>`, tester + devices).
- A git commit `docs(02): record real-device CTA smoke test results` is created with the SUMMARY.md.
- ROADMAP.md Phase 2 line is updated from `[ ]` to `[x]` if all channels PASS.
- STATE.md is updated: `current focus` → `Phase 03 — landing-sections` (only on full PASS).
</output>
