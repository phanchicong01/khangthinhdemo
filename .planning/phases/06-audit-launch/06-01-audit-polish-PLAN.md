---
phase: 6
plan_number: 1
plan_slug: audit-polish
type: execute
wave: 1
depends_on: []
files_modified:
  - next.config.ts
  - .planning/phases/06-audit-launch/lighthouse-landing.html
  - .planning/phases/06-audit-launch/lighthouse-du-an.html
  - .planning/phases/06-audit-launch/06-01-audit-polish-VERIFICATION.md
requirements: [QA-01, QA-02, QA-03, QA-04, QA-05, QA-06]
goal: "All audit gates green: Lighthouse mobile thresholds met on / and /du-an, responsive matrix clean at 375/768/1280, tap-target ≥44px and body-text ≥16px, console clean on prod build serve, outputFileTracingRoot warning eliminated. Real-device CTA matrix documented (filled during deploy)."
autonomous: false
estimated_tasks: 7
must_haves:
  truths:
    - "`npm run build` stdout contains ZERO 'inferred your workspace root' warnings (Phase 2 deferred item resolved per D-18/D-19)"
    - "`npm run build && npx serve out/ -l 3003` runs cleanly; DevTools Console shows 0 errors / 0 warnings / 0 broken-asset 404s on /, /du-an, AND a non-existent route (which renders branded 404.html) — per D-14"
    - "Lighthouse mobile audit on http://localhost:3003/ reports Performance ≥ 90, SEO ≥ 95, Accessibility ≥ 90, Best Practices ≥ 95 (per D-09/D-10)"
    - "Lighthouse mobile audit on http://localhost:3003/du-an/ reports Performance ≥ 90, SEO ≥ 95, Accessibility ≥ 90, Best Practices ≥ 95"
    - "Both pages render correctly at 375×667 / 768×1024 / 1280×800 — no horizontal scroll, no unintended text clipping, all interactive elements ≥ 44×44px tap area, all body <p> font-size ≥ 16px (per D-11/D-12/D-13)"
    - "Real-device CTA smoke-test matrix table is documented in VERIFICATION.md (4 browsers × 3 link types = 12 cells, empty pending Plan 06-02 deploy) per D-15"
    - "Aggregate AUDIT GATE verdict = PASS recorded in 06-01-audit-polish-VERIFICATION.md (blocks Wave 2 if FAIL per D-23)"
    - "`npx tsc --noEmit` exits 0"
  artifacts:
    - path: "next.config.ts"
      provides: "Workspace-root-pinned Next config eliminating Phase 2 deferred warning"
      contains: "outputFileTracingRoot"
    - path: ".planning/phases/06-audit-launch/lighthouse-landing.html"
      provides: "Saved Lighthouse mobile audit report for / (evidence per D-24 Pitfall #1)"
      contains: "Lighthouse"
    - path: ".planning/phases/06-audit-launch/lighthouse-du-an.html"
      provides: "Saved Lighthouse mobile audit report for /du-an (evidence per D-24 Pitfall #1)"
      contains: "Lighthouse"
    - path: ".planning/phases/06-audit-launch/06-01-audit-polish-VERIFICATION.md"
      provides: "Aggregate audit evidence: Lighthouse scores, responsive matrix (24 cells), console-clean note, outputFileTracingRoot grep evidence, real-device CTA matrix table (empty pending deploy), AUDIT GATE verdict"
      contains: "AUDIT GATE"
  key_links:
    - from: "next.config.ts"
      to: "Node path module"
      via: "import path from 'path'; outputFileTracingRoot: path.join(__dirname) per D-18"
      pattern: "outputFileTracingRoot"
    - from: "06-01-audit-polish-VERIFICATION.md"
      to: "lighthouse-landing.html + lighthouse-du-an.html"
      via: "VERIFICATION.md references both saved Lighthouse reports as evidence"
      pattern: "lighthouse-.*\\.html"
    - from: "06-01-audit-polish-VERIFICATION.md"
      to: "Real-device CTA matrix (filled in Plan 06-02 Task 4 post-deploy per D-15)"
      via: "Matrix table format documented in 06-01; cells filled by user during/after Plan 06-02 deploy"
      pattern: "iOS Safari.*Android Chrome.*FB in-app.*Zalo in-app"
---

<objective>
Phase 6 audit gate. Site must pass the full quality audit before any deploy work begins (per D-23 sequential ordering — Wave 1 must PASS before Wave 2). Resolves the only outstanding Phase 2 deferred item (`outputFileTracingRoot` warning) and produces evidence for QA-01..06 in `.planning/phases/06-audit-launch/06-01-audit-polish-VERIFICATION.md`.

Purpose:
- Eliminate the workspace-root inference warning so the build is clean (D-18, D-19)
- Prove Lighthouse mobile thresholds are met on both routes (QA-02 / D-09 / D-10)
- Prove responsive integrity + tap-target + body-text sizing across 3 viewports (QA-01 / QA-03 / QA-04 / D-11..D-13)
- Prove console-clean on production serve including the branded 404 (QA-06 / D-14)
- Document the real-device CTA matrix methodology + table so it can be filled during Plan 06-02 (QA-05 / D-15..D-17)
- Produce a single AUDIT GATE verdict that gates Wave 2

Output: One frontmatter-flagged next.config.ts edit + two saved Lighthouse HTML reports + one aggregate VERIFICATION.md with the AUDIT GATE verdict.

This plan is `autonomous: false` because Lighthouse audit + DevTools responsive verification + opening a browser to inspect Console requires a human at the keyboard (Claude cannot drive Chrome DevTools UI). All other work — config fix, `npm run build`, grep evidence, writing VERIFICATION.md — is auto.
</objective>

<context>
@.planning/phases/06-audit-launch/06-CONTEXT.md
@.planning/REQUIREMENTS.md
@.planning/ROADMAP.md
@.planning/research/PITFALLS.md
@.planning/phases/02-layout-shell/deferred-items.md
@next.config.ts
@src/lib/site.ts
@src/app/layout.tsx
@package.json
</context>

<tasks>

<task type="auto">
  <name>Task 1: Fix outputFileTracingRoot warning (resolve Phase 2 deferred item)</name>
  <files>next.config.ts</files>
  <action>
Edit `next.config.ts` to add `outputFileTracingRoot` so Next.js stops inferring the workspace root from the orphan parent-directory `pnpm-lock.yaml` (per D-18, D-19, and Phase 2 deferred-items.md).

Exact changes:

1. Add at the top of the file (after the leading comment block, before `import type { NextConfig }`):
   ```ts
   import path from 'path'
   ```
2. Inside the `nextConfig` object, add a new property `outputFileTracingRoot: path.join(__dirname),` while preserving every existing property (`output: 'export'`, `trailingSlash: true`, `images: { unoptimized: true }`). Order: keep `output` first, then `outputFileTracingRoot`, then `trailingSlash`, then `images`.

Do NOT:
- Touch `output: 'export'` (locked Phase 1; per CONTEXT critical constraints)
- Touch `trailingSlash: true` (locked Phase 1)
- Touch `images.unoptimized: true` (locked Phase 1)
- Delete the leading "Static export incompatible features" comment block

After the edit, run `npm run build` and capture stdout. The previously-seen warning ("⚠ Warning: Next.js inferred your workspace root, but it may not be correct.") must be gone. If the warning persists, double-check the property name spelling (camelCase — `outputFileTracingRoot`, not `outputFileTracingRoots` or `outputFileTracingRoot`).
  </action>
  <verify>
- `npx tsc --noEmit` exits 0
- `npm run build 2>&1 | grep -i "inferred your workspace"` returns NO matches (zero lines)
- `npm run build` exits 0 and emits `out/` with `index.html`, `du-an/index.html`, `404.html`
  </verify>
  <done>
- `next.config.ts` has `outputFileTracingRoot: path.join(__dirname)` set
- Build stdout no longer contains the workspace-root inference warning
- All other Phase 1 locked config values preserved exactly
  </done>
</task>

<task type="auto">
  <name>Task 2: Local production smoke test (console-clean verify)</name>
  <files>.planning/phases/06-audit-launch/06-01-audit-polish-VERIFICATION.md</files>
  <action>
Run the full production build and serve it locally, then have the user open Chrome and inspect Console + Network across three URLs (per D-14, QA-06).

Steps:

1. `npm run build` — must exit 0, no warnings (Task 1 already verified)
2. Start `npx serve out/ -l 3003` in the background. Note: `out/` is generated by `output: 'export'`; trailingSlash means routes are `/` and `/du-an/`.
3. Wait for `serve` to report "Accepting connections at http://localhost:3003" (typically < 2 seconds).
4. Prompt the user to:
   - Open Chrome at `http://localhost:3003/`. Open DevTools (Cmd+Option+I on macOS). Console tab — run `console.clear()`. Network tab — clear. Hit Cmd+Shift+R (hard refresh).
   - Confirm: zero red errors in Console, zero yellow warnings caused by site code (third-party browser-extension noise is acceptable but must be noted), zero failed requests in Network tab.
   - Navigate to `http://localhost:3003/du-an/` — repeat checks.
   - Navigate to `http://localhost:3003/khong-ton-tai` (non-existent route) — must render branded 404 from `out/404.html` (Burgundy block + "Không tìm thấy trang" H1 + "Về trang chủ" + "Gọi tư vấn" CTAs per Phase 5 SUMMARY). Console must still be clean.

5. Initialize `.planning/phases/06-audit-launch/06-01-audit-polish-VERIFICATION.md` with a header section + the Console / Network smoke test results table. Per page record: console errors (count), console warnings (count + site-origin?), network 404s (count + which assets).

Per D-24 (Pitfall #1 — Looks Done But Isn't): a "tested OK" note is NOT acceptable. Record explicit counts. If user cannot capture a screenshot, the explicit `0/0/0` per route is acceptable.

After test: stop the `npx serve` background process.

Acceptance: zero console errors on all three routes; any non-zero counts are FAIL and must be fixed before proceeding to Task 3.
  </action>
  <verify>
- `out/index.html`, `out/du-an/index.html`, `out/404.html` all exist post-build
- VERIFICATION.md has a "Console / Network Smoke Test" section with per-route rows (`/`, `/du-an/`, `/khong-ton-tai` → 404) each listing console error count, warning count, network 404 count
- All counts are 0 (or any non-zero is annotated as fixed)
  </verify>
  <done>
- 3 routes serve cleanly via `npx serve out/`
- VERIFICATION.md "Console / Network Smoke Test" section initialized with concrete counts (not vague "OK")
- Branded 404 confirmed to render for unknown route
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 3: Lighthouse mobile audit on `/` (QA-02 gate 1 of 2)</name>
  <files>.planning/phases/06-audit-launch/lighthouse-landing.html, .planning/phases/06-audit-launch/06-01-audit-polish-VERIFICATION.md</files>
  <what-built>
Production build is serving at `http://localhost:3003` from Task 2. Branded 404 confirmed, console clean. Ready for Lighthouse audit.
  </what-built>
  <how-to-verify>
Restart `npx serve out/ -l 3003` if it was stopped. Then in Chrome:

1. Navigate to `http://localhost:3003/` (the landing page).
2. Open DevTools → Lighthouse tab.
3. Configure (per D-09):
   - **Mode**: Navigation (Default)
   - **Device**: Mobile
   - **Categories**: Performance + SEO + Accessibility + Best Practices (UNCHECK PWA — out of scope for static marketing site)
   - **Throttling**: Simulated throttling (default)
4. Click "Analyze page load". Wait ~30-60 seconds for audit to complete.
5. Verify thresholds (per D-10):
   - Performance ≥ 90
   - SEO ≥ 95
   - Accessibility ≥ 90
   - Best Practices ≥ 95
6. **Save the report**: click the "..." menu (top right of Lighthouse panel) → "Save as HTML" → save to `.planning/phases/06-audit-launch/lighthouse-landing.html` (overwrite if exists).
7. Add a section to `06-01-audit-polish-VERIFICATION.md`:
   ```
   ## Lighthouse Mobile Audit — Landing (/)
   - Date/time: [user-fill]
   - Performance: __ / 100 (target ≥ 90)
   - SEO: __ / 100 (target ≥ 95)
   - Accessibility: __ / 100 (target ≥ 90)
   - Best Practices: __ / 100 (target ≥ 95)
   - Saved report: `lighthouse-landing.html`
   - Verdict: PASS / FAIL
   ```

If ANY of the four categories falls below threshold:
- Investigate the Lighthouse "Opportunities" + "Diagnostics" sections.
- Common fixes: missing `alt` attrs on imagery, missing `aria-label` on icon-only buttons, color contrast violations (Burgundy on Bone — verify 4.5:1), missing `lang="vi"` (already set Phase 1 — confirm), oversized images, missing `width`/`height` attrs causing CLS.
- Fix in code (THIS task — no separate task — because we need to re-audit immediately).
- Re-run Lighthouse, re-save report, update VERIFICATION numbers.

Report results to agent: "Performance X, SEO Y, Accessibility Z, Best Practices W — PASS" or "FAIL on [category]; fixed by [change]; re-audited; new scores: …"
  </how-to-verify>
  <resume-signal>Reply with the 4 scores + verdict. If FAIL → describe the fix and the re-audit scores. Type "PASS" only when ALL 4 thresholds met.</resume-signal>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 4: Lighthouse mobile audit on `/du-an` (QA-02 gate 2 of 2)</name>
  <files>.planning/phases/06-audit-launch/lighthouse-du-an.html, .planning/phases/06-audit-launch/06-01-audit-polish-VERIFICATION.md</files>
  <what-built>
Landing page Lighthouse PASS captured in lighthouse-landing.html. Now audit the second route.
  </what-built>
  <how-to-verify>
Same procedure as Task 3, but URL `http://localhost:3003/du-an/` (trailing slash — Phase 1 `trailingSlash: true`).

1. Navigate to `http://localhost:3003/du-an/`.
2. DevTools → Lighthouse → same config (Mobile, Performance + SEO + Accessibility + Best Practices, Simulated throttling).
3. Run audit.
4. Verify thresholds: Performance ≥ 90, SEO ≥ 95, Accessibility ≥ 90, Best Practices ≥ 95.
5. Save HTML report to `.planning/phases/06-audit-launch/lighthouse-du-an.html`.
6. Add to `06-01-audit-polish-VERIFICATION.md`:
   ```
   ## Lighthouse Mobile Audit — Du An (/du-an)
   - Date/time: [user-fill]
   - Performance: __ / 100 (target ≥ 90)
   - SEO: __ / 100 (target ≥ 95)
   - Accessibility: __ / 100 (target ≥ 90)
   - Best Practices: __ / 100 (target ≥ 95)
   - Saved report: `lighthouse-du-an.html`
   - Verdict: PASS / FAIL
   ```

Fix-loop same as Task 3 if any threshold misses. The /du-an page has its own metadata (Phase 4), so SEO score should be very close to landing.
  </how-to-verify>
  <resume-signal>Reply with the 4 scores + verdict. Type "PASS" only when ALL 4 thresholds met.</resume-signal>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 5: Responsive + tap-target + body-text audit matrix (24 cells)</name>
  <files>.planning/phases/06-audit-launch/06-01-audit-polish-VERIFICATION.md</files>
  <what-built>
Lighthouse PASS on both pages. Now verify responsive integrity at the three locked viewports (per D-11) and audit tap targets + body text (per D-12, D-13).
  </what-built>
  <how-to-verify>
In Chrome DevTools → Device toolbar (Cmd+Shift+M).

Three viewports per D-11:
- **375 × 667** — iPhone SE
- **768 × 1024** — iPad
- **1280 × 800** — laptop

Two pages: `/` and `/du-an/`.

Four audit dimensions per viewport+page:
1. **No horizontal scroll**: in Console run `document.documentElement.scrollWidth === window.innerWidth` — must return `true`.
2. **No unintended text overflow**: visually inspect Hero/Services/Projects/BigStats/Capabilities/CtaQuote/Contact (landing) and project card grid (du-an). Vietnamese long phrases like "Vận chuyển đường thủy" must not clip.
3. **Tap targets ≥ 44×44px**: inspect Nav links, Nav CTA "Báo giá", FloatingZalo FAB, Footer link items, Hero CTAs ("Gọi" + "Báo giá"), Services card links, Projects "Xem tất cả", Contact CTAs (tel/zalo/mailto), 404 CTAs (only relevant on 404 route — not part of this matrix but spot-check). Use DevTools "Inspect" → check bounding box in the Layout panel (right-click element → "Inspect" → see "Box model"). The clickable area (including padding) must be ≥ 44×44 px.
4. **Body text ≥ 16px**: inspect a representative `<p>` in each major section. DevTools → Computed tab → look at `font-size`. Headings can be larger; this checks body paragraphs only.

Build a 3×2 (viewport × page) matrix with 4 audit cells each = 24 total cells. Add this section to `06-01-audit-polish-VERIFICATION.md`:

```
## Responsive + Tap-Target + Body-Text Matrix

| Viewport     | Page    | No horiz scroll | No text overflow | Tap targets ≥44px | Body text ≥16px |
|--------------|---------|-----------------|------------------|-------------------|-----------------|
| 375×667 SE   | /       | PASS/FAIL+note  | PASS/FAIL+note   | PASS/FAIL+note    | PASS/FAIL+note  |
| 375×667 SE   | /du-an/ | …               | …                | …                 | …               |
| 768×1024 iPad| /       | …               | …                | …                 | …               |
| 768×1024 iPad| /du-an/ | …               | …                | …                 | …               |
| 1280×800 lap | /       | …               | …                | …                 | …               |
| 1280×800 lap | /du-an/ | …               | …                | …                 | …               |
```

For any FAIL cell, fix the issue in code (THIS task), re-verify, update the matrix to PASS. Common fixes per Pitfall #12 and CONTEXT D-12: add `min-w-[44px] min-h-[44px]` to small icon-only buttons, use `text-base` (16px) on body `<p>`, add `overflow-wrap: break-word` or `text-wrap: balance` for long Vietnamese phrases.

Report verdict: 24/24 PASS or list any FAIL cells that needed remediation.
  </how-to-verify>
  <resume-signal>Reply with matrix PASS count (e.g. "24/24 PASS" or "20/24 PASS — fixed 4 FAIL cells: …"). Type "PASS" only when all 24 cells are PASS.</resume-signal>
</task>

<task type="auto">
  <name>Task 6: Document real-device CTA smoke-test matrix table (filled during Plan 06-02)</name>
  <files>.planning/phases/06-audit-launch/06-01-audit-polish-VERIFICATION.md</files>
  <action>
Agent cannot actually test on real iOS Safari + Android Chrome + Facebook in-app + Zalo in-app devices, and `tel:` / `mailto:` / `zalo.me` handlers do NOT always trigger correctly from `localhost`. The user wants to test on the LIVE Vercel URL post-deploy.

This task documents the matrix table + methodology in VERIFICATION.md so Plan 06-02 Task 4 can fill it. Per D-15..D-17.

Append this section to `.planning/phases/06-audit-launch/06-01-audit-polish-VERIFICATION.md`:

```
## Real-Device CTA Smoke Test Matrix (filled during Plan 06-02 post-deploy)

**Methodology (per D-15):**
Test each cell by opening the live deploy URL in the listed browser environment, then tapping each CTA. PASS = handler opens correctly (dialer for `tel:`, mail composer for `mailto:`, Zalo app/web for `zalo.me`). FAIL = handler does not open or opens wrong target.

Links to test (defined in `src/lib/site.ts` — DO NOT hardcode):
- `tel:+84826553599` — present on Hero CTA1, Nav (desktop hotline), Contact card, CtaQuote banner, 404 secondary CTA
- `mailto:khangthinhinv2025@gmail.com` — present on Contact card
- `https://zalo.me/0826553599` — present on FloatingZalo FAB, Contact card Zalo channel

**Matrix:**

| Browser / Device       | tel: opens dialer? | mailto: opens mail composer? | zalo.me/0826553599 opens Zalo? |
|------------------------|--------------------|------------------------------|--------------------------------|
| iOS Safari (iPhone)    | [pending deploy]   | [pending deploy]             | [pending deploy]               |
| Android Chrome         | [pending deploy]   | [pending deploy]             | [pending deploy]               |
| Facebook in-app browser| [pending deploy]   | [pending deploy]             | [pending deploy]               |
| Zalo in-app browser    | [pending deploy]   | [pending deploy]             | [pending deploy]               |

**Accepted-risk rule (per D-17):**
If FB or Zalo in-app browser strips the `tel:` handler (known platform limitation — some in-app WebViews disable phone handlers), record as `NOTE: in-app strips tel:` rather than FAIL. Do NOT add UA-sniffing workarounds (Pitfall: brittle, breaks on UA string changes).

**Gate (per D-16):**
This matrix is informational evidence. The audit gate does NOT block on in-app browser limitations. Real-device PASS on iOS Safari + Android Chrome (the dominant traffic share) is the meaningful test.
```

After writing the section, run `git status` (read-only) to confirm VERIFICATION.md is staged for the eventual phase commit. Do not commit yet — final commit happens after Task 7.
  </action>
  <verify>
- `06-01-audit-polish-VERIFICATION.md` contains the "Real-Device CTA Smoke Test Matrix" section with the 4×3 = 12-cell table, all cells marked `[pending deploy]`
- The "Methodology" + "Accepted-risk rule" + "Gate" paragraphs are present
- Three link strings appear verbatim: `tel:+84826553599`, `mailto:khangthinhinv2025@gmail.com`, `https://zalo.me/0826553599`
  </verify>
  <done>
- Matrix table documented and ready for Plan 06-02 Task 4 fill-in
- Methodology + accepted-risk + gate rules captured per D-15..D-17
  </done>
</task>

<task type="auto">
  <name>Task 7: Aggregate AUDIT GATE verdict + commit</name>
  <files>.planning/phases/06-audit-launch/06-01-audit-polish-VERIFICATION.md</files>
  <action>
Finalize `06-01-audit-polish-VERIFICATION.md` with the AUDIT GATE verdict. The file at this point should already contain:
- Console / Network Smoke Test section (Task 2)
- Lighthouse Mobile Audit — Landing (Task 3)
- Lighthouse Mobile Audit — Du An (Task 4)
- Responsive + Tap-Target + Body-Text Matrix (Task 5)
- Real-Device CTA Smoke Test Matrix (Task 6)

Add a final section:

```
## OutputFileTracingRoot Warning Resolution Evidence (D-18 / D-19)

Phase 2 deferred-items.md flagged the "inferred your workspace root" warning. Resolved in Task 1 (`next.config.ts` + `outputFileTracingRoot: path.join(__dirname)`).

Grep evidence:
```
$ npm run build 2>&1 | grep -i "inferred your workspace"
$ # (no output — warning gone)
```

Build exit status: 0. Static export confirmed at `out/` with `index.html`, `du-an/index.html`, `404.html`.

## Deferred / Out of Scope Items (tracked, not blocking Phase 6)

- **Pitfall #8 — Vietnamese-native copy review** (per D-27 + ROADMAP risk callouts): DEFERRED post-deploy by user decision. User will review live site and report fixes after Phase 6 ships.
- **LSEO-01 Google Business Profile**: post-launch v1.x (CONTEXT out-of-scope)
- **LSEO-02 Google Maps embed**: post-launch v1.x
- **LSEO-03 Google Search Console sitemap submission**: defer until real domain locked + native copy reviewed
- **Custom domain registration**: user has none yet; ships on *.vercel.app

## AUDIT GATE Verdict

The AUDIT GATE is PASS if and only if ALL of the following are true:
- [ ] outputFileTracingRoot warning gone (grep returns no matches)
- [ ] All 4 Lighthouse categories meet threshold on `/` (Performance ≥ 90, SEO ≥ 95, Accessibility ≥ 90, Best Practices ≥ 95)
- [ ] All 4 Lighthouse categories meet threshold on `/du-an/`
- [ ] 24/24 cells in the responsive matrix are PASS
- [ ] Zero console errors on `/`, `/du-an/`, and the 404 route
- [ ] Real-device CTA matrix section is documented (cells empty; filled during Plan 06-02)
- [ ] `npx tsc --noEmit` exits 0

**Final verdict:** PASS / FAIL

(If FAIL, Wave 2 — Plan 06-02 Deploy & Docs — is BLOCKED per D-23 until all FAIL items remediated and this verdict updated to PASS.)
```

Tick every checkbox based on the evidence already in the document above. If any item is unchecked → verdict = FAIL, and the user must remediate before Plan 06-02 starts.

After writing: run `npx tsc --noEmit` one last time (must exit 0). Then commit:

```
git add next.config.ts .planning/phases/06-audit-launch/lighthouse-landing.html .planning/phases/06-audit-launch/lighthouse-du-an.html .planning/phases/06-audit-launch/06-01-audit-polish-VERIFICATION.md
git commit -m "chore(06-01): audit gate pass + resolve outputFileTracingRoot warning"
```

Note: the commit message MUST NOT use AI co-author trailers per project convention (skip the Co-Authored-By line for this project — keep commit message minimal).
  </action>
  <verify>
- VERIFICATION.md contains all 6 sections (Console/Network, Lighthouse landing, Lighthouse du-an, Responsive matrix, Real-device matrix, outputFileTracingRoot evidence, deferred items, AUDIT GATE verdict)
- AUDIT GATE checkbox list has every box ticked AND final verdict = PASS
- `npx tsc --noEmit` exits 0
- `git log -1 --oneline` shows the chore(06-01) commit
  </verify>
  <done>
- AUDIT GATE = PASS recorded in VERIFICATION.md with every sub-item ticked
- Phase 2 deferred item closed with grep evidence
- All evidence committed
- Wave 2 (Plan 06-02) is now unblocked
  </done>
</task>

</tasks>

<verification>
End-of-plan verification (all must pass):

1. `git status` — clean working tree (commit happened)
2. `npm run build 2>&1 | grep -i "inferred your workspace"` — no matches
3. `npm run build` — exit 0, `out/` generated
4. `npx tsc --noEmit` — exit 0
5. `.planning/phases/06-audit-launch/06-01-audit-polish-VERIFICATION.md` exists and contains "AUDIT GATE Verdict" section with "**Final verdict:** PASS"
6. `.planning/phases/06-audit-launch/lighthouse-landing.html` exists, file size > 100KB (Lighthouse reports are heavy)
7. `.planning/phases/06-audit-launch/lighthouse-du-an.html` exists, file size > 100KB
8. `next.config.ts` contains `outputFileTracingRoot` AND preserves `output: 'export'`, `trailingSlash: true`, `images.unoptimized: true`
</verification>

<success_criteria>
Plan 06-01 is COMPLETE when:
- AUDIT GATE = PASS (per Task 7 final verdict)
- Phase 2 deferred-items.md "1. Next.js workspace-root inference warning" can be marked resolved (closure noted in 06-01 VERIFICATION.md)
- Wave 2 (Plan 06-02) is unblocked per D-23

Plan 06-01 has FAILED if:
- Any Lighthouse category falls below threshold AND cannot be remediated within this plan
- Any responsive matrix cell remains FAIL
- Console errors on any route remain
- AUDIT GATE = FAIL → Plan 06-02 MUST NOT start until fix loop completes
</success_criteria>

<risks>
- **Pitfall #1 (Looks Done But Isn't)**: every audit checklist item MUST have evidence (Lighthouse HTML report, matrix cell, grep output) per D-24. No "tested OK" notes. — MITIGATED via VERIFICATION.md evidence requirements in every task.
- **Pitfall #2 (deploy 404 assets)**: not in scope of Plan 06-01 (no deploy yet). Will verify on live Vercel in Plan 06-02 per D-25.
- **Pitfall #7 (broken tel/zalo CTAs)**: full real-device matrix is documented in Task 6 (empty) and filled in Plan 06-02 Task 4 per D-15. — DEFERRED to Plan 06-02 due to localhost handler limitations.
- **Pitfall #8 (Vietnamese-native copy review)**: DEFERRED post-deploy per D-27 user decision. Tracked in VERIFICATION.md "Deferred / Out of Scope" section. NOT a Phase 6 gate.
- **Pitfall #10 (sitemap/OG wrong domain)**: not relevant to Plan 06-01 (no deploy). Verified in Plan 06-02 Task 4 via curl on live URL per D-28.
- **Lighthouse non-determinism**: scores can vary ±2-3 points across runs even with simulated throttling. If a score is borderline (e.g. Performance = 88), re-run 2-3 times — take the median. If still below 90, then fix.
- **DevTools tap-target inspection accuracy**: Box-model inspection in DevTools shows content box + padding. The 44×44 rule applies to the full clickable area (including padding), NOT the visual content. Inspect the outermost clickable bounding box.
</risks>

<out_of_scope>
Explicitly NOT in this plan (handled by Plan 06-02 or post-launch):

- `@vercel/analytics` install + wire (Plan 06-02 Task 1)
- README.md rewrite (Plan 06-02 Task 2)
- Vercel deploy walkthrough (Plan 06-02 Task 3)
- Live HTTPS / sitemap / JSON-LD / OG / favicon curl verification (Plan 06-02 Task 4)
- Real-device CTA matrix CELL FILL (Plan 06-02 Task 4 — Plan 06-01 only documents the empty table)
- Vietnamese-native copy review (DEFERRED post-deploy per D-27)
- Google Search Console submission (DEFERRED — needs locked domain)
- Custom domain registration (no domain owned)
- Google Business Profile, Google Maps embed (post-launch v1.x)
- STATE.md / ROADMAP.md / REQUIREMENTS.md status updates (Plan 06-02 Task 5)
</out_of_scope>

<output>
After completion, this plan produces:
1. `next.config.ts` with `outputFileTracingRoot` set
2. `.planning/phases/06-audit-launch/lighthouse-landing.html` — saved Lighthouse mobile report
3. `.planning/phases/06-audit-launch/lighthouse-du-an.html` — saved Lighthouse mobile report
4. `.planning/phases/06-audit-launch/06-01-audit-polish-VERIFICATION.md` — aggregate evidence + AUDIT GATE = PASS

Followed by: create `.planning/phases/06-audit-launch/06-01-audit-polish-SUMMARY.md` summarizing what was done, what was deferred, and confirming Wave 2 is unblocked.
</output>
