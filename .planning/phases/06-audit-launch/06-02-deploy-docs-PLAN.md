---
phase: 6
plan_number: 2
plan_slug: deploy-docs
type: execute
wave: 2
depends_on: [06-01]
files_modified:
  - package.json
  - package-lock.json
  - src/app/layout.tsx
  - README.md
  - .planning/phases/06-audit-launch/06-02-deploy-docs-VERIFICATION.md
  - .planning/phases/06-audit-launch/06-01-audit-polish-VERIFICATION.md
  - .planning/STATE.md
  - .planning/ROADMAP.md
  - .planning/REQUIREMENTS.md
requirements: [DEPLOY-01, DEPLOY-02, DEPLOY-03]
goal: "Wire @vercel/analytics in layout.tsx, rewrite README.md as Vercel deploy doc, document the manual Vercel deploy walkthrough, and (after user deploys) verify live HTTPS + sitemap domain + JSON-LD domain + OG image + favicon + analytics pageview + real-device CTA matrix. Finalize STATE/ROADMAP/REQUIREMENTS to reflect v1.0 ship."
autonomous: false
estimated_tasks: 6
must_haves:
  truths:
    - "`@vercel/analytics` installed in package.json dependencies (per D-05)"
    - "`src/app/layout.tsx` imports `Analytics` from `@vercel/analytics/react` and renders `<Analytics />` inside `<body>` AFTER `<FloatingZalo />` and BEFORE `</body>` (per D-06) — NO NODE_ENV guard added (per D-07 / critical constraints)"
    - "`npm run build` exits 0 and `out/` is generated; build artifact contains an analytics script reference OR the component is statically rendered (verifiable via grep on out/index.html)"
    - "README.md rewritten with: Vietnamese-primary prose + English command names; sections Title / Tech Stack / Dev / Build / Deploy→Vercel / Custom domain / Analytics / Local prod smoke test (per D-20 / D-21)"
    - "README.md mentions Vercel (NOT Cloudflare — Cloudflare overridden per D-01 / critical constraints)"
    - "Vercel deploy walkthrough documented in 06-02-deploy-docs-VERIFICATION.md with explicit env-var step `NEXT_PUBLIC_SITE_URL` (per D-03)"
    - "Post-deploy live URL verifications complete: HTTPS reaches 200, sitemap.xml `<loc>` uses Vercel domain (NOT placeholder per D-28 Pitfall #10), JSON-LD `@id` uses Vercel domain (Pitfall #6 / #10), OG image fetches 200 + image/png, favicon + apple-icon fetch 200"
    - "Vercel Analytics dashboard records ≥ 1 pageview after manual visits (per D-08)"
    - "Real-device CTA matrix from Plan 06-01 Task 6 is FILLED — iOS Safari + Android Chrome rows have concrete PASS / FAIL / NOTE per cell (per D-15, D-16, D-17)"
    - "Phase 6 success criteria 1–7 from ROADMAP all marked PASS with evidence pointers in ROADMAP.md"
    - "REQUIREMENTS.md QA-01..06 + DEPLOY-01..03 all checked"
    - "STATE.md reflects v1.0 milestone — completed_phases=6, status='site live'"
  artifacts:
    - path: "package.json"
      provides: "Adds `@vercel/analytics` to dependencies"
      contains: "@vercel/analytics"
    - path: "src/app/layout.tsx"
      provides: "Renders <Analytics /> inside <body> after <FloatingZalo />"
      contains: "@vercel/analytics/react"
    - path: "README.md"
      provides: "Vercel-focused deploy doc (Vietnamese primary, English command names) replacing the 28-line placeholder"
      contains: "Vercel"
    - path: ".planning/phases/06-audit-launch/06-02-deploy-docs-VERIFICATION.md"
      provides: "Deploy walkthrough + post-deploy curl/dashboard evidence + filled real-device CTA matrix + final phase verdict"
      contains: "Deploy walkthrough"
  key_links:
    - from: "src/app/layout.tsx"
      to: "@vercel/analytics/react"
      via: "import { Analytics } from '@vercel/analytics/react'; <Analytics /> placed after <FloatingZalo /> inside <body> per D-06"
      pattern: "@vercel/analytics/react"
    - from: "src/app/layout.tsx <Analytics />"
      to: "Vercel-injected VERCEL_ENV"
      via: "Component fires beacons only when VERCEL_ENV === 'production' — automatic, no manual guard per D-07"
      pattern: "<Analytics"
    - from: "Vercel project Environment Variables"
      to: "src/lib/site.ts siteUrl + sitemap.ts + JSON-LD + OG"
      via: "NEXT_PUBLIC_SITE_URL set to the Vercel-assigned URL before build; propagates to metadataBase, sitemap <loc>, JSON-LD @id, OG image absolute URL per D-03 / D-28"
      pattern: "NEXT_PUBLIC_SITE_URL"
    - from: "README.md Deploy section"
      to: "Vercel dashboard import flow"
      via: "6-step walkthrough mirroring D-20"
      pattern: "vercel.com/new"
---

<objective>
Wave 2 of Phase 6. The audit gate (Plan 06-01) has passed; the site is ready to ship. This plan wires Vercel Analytics, rewrites README as a focused Vercel deploy doc, documents the dashboard-driven deploy walkthrough as VERIFICATION evidence, and (after the user clicks Deploy) verifies the live URL + env-var propagation + analytics + real-device CTA matrix.

Purpose:
- Cover DEPLOY-02 (analytics) — wire `<Analytics />` per D-05..D-08
- Cover DEPLOY-03 (docs) — rewrite README with Vercel walkthrough per D-20..D-21
- Cover DEPLOY-01 (deploy) — Vercel dashboard click is user-driven; agent documents the steps + verifies the live URL via curl + helps user fill the CTA matrix
- Close out Phase 6 by updating REQUIREMENTS / ROADMAP / STATE to reflect v1.0 ship

Output: Updated layout.tsx with `<Analytics />`; rewritten README.md; live Vercel URL with HTTPS + analytics live + correct env-var propagation; final phase artifacts.

This plan is `autonomous: false` because the actual Vercel "click Deploy" step happens in the Vercel dashboard UI (agent has no API key configured — agent could in principle use `vercel` CLI with token, but user has opted for dashboard flow per CONTEXT). Real-device CTA matrix fill is also user-driven (real phones in user's hand). All other tasks — npm install, code edits, README rewrite, curl verification, STATE updates — are auto.
</objective>

<context>
@.planning/phases/06-audit-launch/06-CONTEXT.md
@.planning/phases/06-audit-launch/06-01-audit-polish-PLAN.md
@.planning/REQUIREMENTS.md
@.planning/ROADMAP.md
@.planning/research/PITFALLS.md
@src/app/layout.tsx
@src/lib/site.ts
@README.md
@package.json
@next.config.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Install + wire @vercel/analytics</name>
  <files>package.json, package-lock.json, src/app/layout.tsx</files>
  <action>
Install the Vercel Analytics package and wire it into the root layout per D-05..D-08.

Steps:

1. Run `npm install @vercel/analytics`. This adds the package to `dependencies` (production runtime). Expected current latest 1.x compatible with React 19. The lockfile (`package-lock.json`) will update.

2. Edit `src/app/layout.tsx`:
   - Add import at the top alongside other component imports (after `import FloatingZalo from '@/components/layout/FloatingZalo'`):
     ```ts
     import { Analytics } from '@vercel/analytics/react'
     ```
   - Inside the `<body>` JSX, place `<Analytics />` AFTER `<FloatingZalo />` and BEFORE the closing `</body>`. Final body structure (per D-06):
     ```tsx
     <body className="font-sans antialiased">
       <Nav />
       {children}
       <Footer />
       <FloatingZalo />
       <Analytics />
     </body>
     ```

3. DO NOT (per D-07 + critical constraints):
   - Add any `process.env.NODE_ENV === 'production'` guard. The component auto-detects Vercel production via Vercel-injected `VERCEL_ENV` and is inert on localhost / preview.
   - Add `import dynamic from 'next/dynamic'` or any client-only wrapper around it. `<Analytics />` is already a client component published by the package.
   - Modify any other part of `layout.tsx` (metadata, viewport, beVietnamPro config, Nav/Footer/FloatingZalo wiring — all are Phase 5-frozen).

4. Verify build:
   - `npx tsc --noEmit` — must exit 0 (no type errors from new import)
   - `npm run build` — must exit 0; should produce `out/` with `index.html`, `du-an/index.html`, `404.html`. The `outputFileTracingRoot` warning fix from Plan 06-01 Task 1 must STILL be absent (no regression).
   - `grep -l "vercel" out/index.html out/du-an/index.html` — should match (the analytics bootstrap script is referenced or inlined). Note: on localhost the script will not actually fire beacons.

Acceptance: build clean, no type errors, `out/index.html` references Vercel analytics in some form.
  </action>
  <verify>
- `package.json` `dependencies` contains `"@vercel/analytics"` with a 1.x version
- `src/app/layout.tsx` line `import { Analytics } from '@vercel/analytics/react'` present
- `src/app/layout.tsx` JSX has `<Analytics />` placed after `<FloatingZalo />` inside `<body>`
- NO `process.env` guard anywhere around `<Analytics />`
- `npx tsc --noEmit` exits 0
- `npm run build` exits 0
- `grep -i "vercel" out/index.html` returns at least one match (the analytics script reference)
  </verify>
  <done>
- `@vercel/analytics` installed and wired in layout.tsx per D-06
- Build clean, no type errors, no NODE_ENV guard (D-07 respected)
- Phase 2 / Phase 5 deliverables (Nav, Footer, FloatingZalo, metadata, JSON-LD, OG, favicon) UNCHANGED in layout.tsx
  </done>
</task>

<task type="auto">
  <name>Task 2: Rewrite README.md as Vercel deploy doc</name>
  <files>README.md</files>
  <action>
Replace the existing 28-line README.md (which mentions GitHub Pages / Netlify / Vercel generically) with a focused Vercel deploy doc per D-20 + D-21. Vietnamese primary prose, English for command names and file paths.

Write the file contents exactly as follows:

```markdown
# Khang Thịnh Investment — Website

Website giới thiệu Công ty TNHH Khang Thịnh Investment (MST 1102 107 064) — cung ứng cát/đá/san lấp, xây dựng dân dụng, vận chuyển đường thủy. Site là static export (Next.js 15 App Router), deploy lên Vercel.

## Tech Stack

| Layer       | Tech                                        |
|-------------|---------------------------------------------|
| Framework   | Next.js 15 (App Router, `output: 'export'`) |
| UI          | React 19                                    |
| Styling     | Tailwind CSS 4 (`@theme` directive)         |
| Language    | TypeScript 5.9 (strict)                     |
| Font        | Be Vietnam Pro (subsets: vietnamese, latin) |
| Icons       | lucide-react                                |
| Analytics   | @vercel/analytics                           |
| Hosting     | Vercel (Hobby tier)                         |

## Dev

```bash
npm install
npm run dev
# http://localhost:3000
```

## Build

```bash
npm run build
# Output: out/  (static HTML — / + /du-an + 404)
```

## Local prod-mode smoke test

```bash
npm run build && npx serve out/ -l 3003
# http://localhost:3003
```

Mở DevTools → Console: 0 errors. Network: không có asset 404. Test trang 404 bằng URL bất kỳ không tồn tại (vd `/khong-ton-tai`).

## Deploy → Vercel

1. Truy cập <https://vercel.com/new>
2. Import GitHub repo `phanchicong01/khangthinhdemo`
3. Project name: tùy chọn (vd `khang-thinh-website`)
4. Framework Preset: **Next.js** (Vercel tự nhận diện)
5. Build Command: mặc định (`next build`) — không sửa
6. Output Directory: mặc định — Vercel tự nhận `out/` từ config `output: 'export'`
7. Environment Variables → Add:
   - Name: `NEXT_PUBLIC_SITE_URL`
   - Value: URL Vercel sẽ gán (vd `https://khang-thinh-website.vercel.app`) — đặt sau lần deploy đầu nếu chưa biết
   - Environment: **Production**
8. Click **Deploy**
9. Chờ build (~30–60s) → ghi nhận URL được gán

**Quan trọng:** `NEXT_PUBLIC_SITE_URL` phải được set TRƯỚC khi build chạy. Nếu set sau, sitemap.xml / JSON-LD / OG metadata sẽ dùng giá trị fallback `https://khangthinhinv.vn` (placeholder) — phải redeploy để cập nhật.

## Custom domain (post-launch)

Khi đã có domain thật (vd `khangthinhinv.vn`):

1. Vercel project → Settings → Domains → Add domain → nhập domain
2. Cập nhật DNS record (Vercel hiển thị A/CNAME cần thêm) — chờ propagate
3. Project → Settings → Environment Variables → cập nhật `NEXT_PUBLIC_SITE_URL` = `https://khangthinhinv.vn`
4. Redeploy (Deployments → ... → Redeploy)
5. SSL tự cấp qua Let's Encrypt (~1–2 phút sau khi DNS active)

## Analytics

Vercel Analytics đã wired sẵn qua component `<Analytics />` trong `src/app/layout.tsx`. Chỉ fire trên production (Vercel-injected `VERCEL_ENV`). Xem dashboard:

```
https://vercel.com/<project>/analytics
```

Pageviews sẽ xuất hiện trong ~5 phút sau khi có truy cập production thực tế.

## Repository

<https://github.com/phanchicong01/khangthinhdemo>
```

That is the complete README content. Notes for the executor:
- Write the file with the EXACT content above (Markdown code fences inside the block are part of the README — preserve them).
- Do NOT mention Cloudflare anywhere (per D-01 / critical constraints).
- Vietnamese for prose, English for command names + file paths (per D-21 + project CLAUDE.md).
- The README internally uses fenced code blocks — when writing the file, the outer triple-backtick wrapping in this action description is a markdown nesting artifact; the actual file should have proper fenced bash blocks like `\`\`\`bash` not nested fences.
  </action>
  <verify>
- `README.md` line count is between 50 and 120 (significantly longer than the 28-line original)
- `grep -i "vercel" README.md` returns multiple matches
- `grep -i "cloudflare" README.md` returns ZERO matches (per critical constraints)
- `grep "NEXT_PUBLIC_SITE_URL" README.md` returns at least 3 matches (Deploy step, post-launch custom domain, "Quan trọng" note)
- `grep "1102 107 064" README.md` returns 1 match (MST in intro)
- `grep "https://github.com/phanchicong01/khangthinhdemo" README.md` returns 1 match
  </verify>
  <done>
- README.md rewritten with Vercel-focused content per D-20
- All 8 required sections present: Title/intro, Tech Stack, Dev, Build, Local prod smoke test, Deploy→Vercel, Custom domain, Analytics, Repository
- Vietnamese primary + English command names (D-21 respected)
- Zero Cloudflare mentions (D-01 / critical constraint respected)
  </done>
</task>

<task type="auto" gate="blocking">
  <name>Task 2.5: Intermediate commit + push before Vercel deploy</name>
  <files>src/app/layout.tsx,package.json,package-lock.json,README.md</files>
  <what-build>
Stage all Task 1 + Task 2 changes and push to GitHub `main` so that Task 3's Vercel dashboard import sees the up-to-date repo (containing the wired `<Analytics />` + new README). Without this push, the Vercel build will not include the analytics component and the README in the GitHub repo will be the old version.

Per plan-checker W-2/W-3: Task 3 (Vercel deploy) reads from GitHub remote — so the commit MUST land on `origin/main` BEFORE the user clicks Import. Final docs/state commit happens later in Task 5.
  </what-build>
  <how-to-verify>
```bash
cd /Users/congphan/Workspace/my-projects/khang-thing-group/website
git add src/app/layout.tsx package.json package-lock.json README.md
git status --short  # confirm only these 4 files staged

git commit -m "feat(06-02): wire @vercel/analytics + rewrite README for Vercel deploy

- Install @vercel/analytics
- Add <Analytics /> in layout.tsx after FloatingZalo (auto production-only)
- Replace README.md with Vercel-focused deploy doc (Vietnamese prose + English commands)
- Sections: tech stack, dev, build, local prod smoke test, Deploy→Vercel walkthrough,
  custom domain, analytics, repository

Plan: 06-02-deploy-docs
Refs: DEPLOY-02, DEPLOY-03"

git push origin main 2>&1 | tail -5
```

Verify push success:
```bash
git log origin/main..HEAD --oneline  # MUST be empty (everything pushed)
git log --oneline -1  # show the new commit SHA
```
  </how-to-verify>
  <verify>
- Working tree clean (`git status --short` shows nothing)
- `git push` exits 0
- `git log origin/main..HEAD` empty (local commit reached remote)
- Latest commit on remote contains `<Analytics />` import in `src/app/layout.tsx` and Vercel-focused README
  </verify>
  <done>
- Tasks 1 + 2 changes committed locally
- Commit pushed to `origin/main` (GitHub)
- Repo on GitHub now ready for Vercel dashboard import
  </done>
</task>

<task type="checkpoint:human-action" gate="blocking">
  <name>Task 3: Manual Vercel deploy (user clicks dashboard)</name>
  <files>.planning/phases/06-audit-launch/06-02-deploy-docs-VERIFICATION.md</files>
  <what-built>
Code is ready: `<Analytics />` wired, README rewritten, build clean. Agent cannot click in the Vercel dashboard. User must execute the deploy walkthrough manually using the README (Task 2 output) as the script.

This task is `checkpoint:human-action` (not `human-verify`) because: (a) the dashboard UI flow has no equivalent CLI step the agent can run under the constraint that the user wants dashboard flow per CONTEXT — `vercel` CLI exists but is not the chosen path; (b) the env-var configuration step (`NEXT_PUBLIC_SITE_URL`) MUST be set in the dashboard BEFORE the first deploy or sitemap/JSON-LD/OG will leak the placeholder (Pitfall #10 / D-28).
  </what-built>
  <how-to-verify>
First, agent writes/initializes `06-02-deploy-docs-VERIFICATION.md` with the deploy walkthrough as the template-to-be-filled. Append this section:

```
# Plan 06-02 Verification: Deploy & Docs

## Pre-deploy state

- @vercel/analytics installed: version __ (from `npm ls @vercel/analytics`)
- src/app/layout.tsx renders <Analytics /> after <FloatingZalo />: VERIFIED
- README.md rewritten: VERIFIED (Vercel-focused, Vietnamese primary)
- Local `npm run build` exit 0, out/ generated: VERIFIED
- Audit gate (Plan 06-01) = PASS: VERIFIED (see 06-01-audit-polish-VERIFICATION.md)

## Deploy walkthrough (user executes — agent records)

1. ✅ Visit https://vercel.com/new
2. ✅ Import GitHub repo: phanchicong01/khangthinhdemo
3. ✅ Project name: [user fills: __________]
4. ✅ Framework auto-detected: Next.js (confirm)
5. ✅ Build Command: default (`next build`) — leave as is
6. ✅ Output Directory: default — Vercel auto-picks `out/` from `output: 'export'`
7. ✅ Environment Variables → Add:
   - Name: `NEXT_PUBLIC_SITE_URL`
   - Value: `https://[user fills assigned URL].vercel.app`
   - Environment: Production
   *(If the user doesn't know the assigned URL before first deploy — Vercel auto-assigns from project name — they may need to: deploy with placeholder, see the assigned URL, update env var, redeploy. Two-step flow is fine.)*
8. ✅ Click Deploy
9. ✅ Wait for build to complete (~30–60s)
10. ✅ Assigned URL: `https://__________.vercel.app`

## Two-deploy flow (if needed for env var)

If user must deploy twice (first to learn the URL, second after setting env var correctly):

- Deploy #1: with placeholder env var or none → site live but sitemap.xml may have wrong domain
- Update env var with the correct assigned URL
- Vercel → Deployments → ... → Redeploy
- Deploy #2: sitemap.xml / JSON-LD / OG now use Vercel domain

Mark below which flow happened:
- [ ] Single deploy with correct env var
- [ ] Two-deploy flow (deploy #1 placeholder → fix env var → redeploy)
```

Then prompt the user with the walkthrough. The user reports back:
- The assigned Vercel URL
- Whether single or two-deploy flow was needed
- Build success (yes/no — should be yes since local build is clean)

Agent records the URL + flow in the verification file. The URL becomes the input to Task 4.
  </how-to-verify>
  <resume-signal>Reply with the assigned Vercel URL (format: `https://something.vercel.app`) and confirm "deploy success". If the build failed on Vercel: describe the error so the agent can diagnose (most likely cause: env var not set → sitemap absolutize error, OR @vercel/analytics package not detected). Then re-execute.</resume-signal>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 4: Post-deploy live verification + fill real-device CTA matrix</name>
  <files>.planning/phases/06-audit-launch/06-02-deploy-docs-VERIFICATION.md, .planning/phases/06-audit-launch/06-01-audit-polish-VERIFICATION.md</files>
  <what-built>
Site is live at the user-reported Vercel URL (call it `$VERCEL_URL`). Now verify (a) HTTPS reachable, (b) env-var propagation worked (sitemap + JSON-LD + OG use the Vercel domain, NOT the placeholder), (c) image artifacts reachable, (d) Vercel Analytics records a pageview, (e) Rich Results Test passes, (f) Real-device CTA matrix from Plan 06-01 Task 6 is filled.
  </what-built>
  <how-to-verify>
Use the URL the user reported in Task 3. Substitute it for `$VERCEL_URL` in the commands below. Run each, paste output (or summary) into `06-02-deploy-docs-VERIFICATION.md`.

### (a) HTTPS reachable
```bash
curl -sI "$VERCEL_URL/" | head -3
```
Expect: `HTTP/2 200`. If 301/302 → follow with `-L` and confirm final 200. If 404 → deploy didn't include `out/` correctly — check Vercel build logs.

### (b) Env-var propagation — sitemap (Pitfall #10 / D-28)
```bash
curl -s "$VERCEL_URL/sitemap.xml"
```
Expect: every `<loc>` element starts with `$VERCEL_URL` (e.g. `https://khang-thinh-website.vercel.app/`). If any `<loc>` starts with `https://khangthinhinv.vn` (the local fallback placeholder), the env var wasn't set before Vercel ran the build. **Fix:** Vercel dashboard → Settings → Environment Variables → set `NEXT_PUBLIC_SITE_URL` to `$VERCEL_URL` → Deployments → Redeploy. Re-curl.

### (c) Env-var propagation — JSON-LD (Pitfall #6 / #10)
```bash
curl -s "$VERCEL_URL/" | grep -o 'application/ld+json[^<]*' | head -1
# Then inspect manually OR:
curl -s "$VERCEL_URL/" | python3 -c "import sys,re,json; html=sys.stdin.read(); m=re.search(r'<script type=\"application/ld\\+json\">(.+?)</script>', html, re.S); print(json.dumps(json.loads(m.group(1)), indent=2))"
```
Expect: `@id` URLs in the `@graph` nodes (Organization + GeneralContractor) use `$VERCEL_URL` as the base. Also check `image` field references `$VERCEL_URL/...`.

### (d) OG image
```bash
curl -sI "$VERCEL_URL/opengraph-image" | head -5
```
Expect: `HTTP/2 200` + `content-type: image/png`. Optionally `-L` if there's a redirect to a hashed filename.

### (e) Favicon + apple-icon
```bash
curl -sI "$VERCEL_URL/icon" | head -3
curl -sI "$VERCEL_URL/apple-icon" | head -3
```
Expect: both 200 with `image/png`.

### (f) Vercel Analytics pageview
User-driven (agent cannot drive a real browser session for analytics beacons):
1. User opens `$VERCEL_URL/` in a normal browser (not the Vercel preview iframe). Reload 2–3 times.
2. User opens `$VERCEL_URL/du-an/`. Reload once.
3. Wait 5 minutes (per D-08 — Vercel analytics ingests with a short delay).
4. User visits Vercel dashboard → project → Analytics tab → Pageviews.
5. Expect: ≥ 1 pageview recorded. Report the count.

If 0: check that `<Analytics />` is in `out/index.html` (`grep -i "vercel" out/index.html` — should match). Common causes of 0: ad-blocker on user's browser blocked the beacon; user is on Vercel's `*.vercel.app` domain in a preview context (analytics only fires on actual deployments); or `VERCEL_ENV` was somehow not "production".

### (g) Rich Results Test (per ROADMAP risk callouts + CONTEXT)
User-driven:
1. Open <https://search.google.com/test/rich-results>
2. Paste `$VERCEL_URL/` → click "Test URL"
3. Expect: JSON-LD parses without errors. "GeneralContractor" item detected. "Organization" item detected.
4. Screenshot or copy the result summary into VERIFICATION.md.

### (h) Real-device CTA matrix fill (per Plan 06-01 Task 6 / D-15..D-17)

Refer to `06-01-audit-polish-VERIFICATION.md` "Real-Device CTA Smoke Test Matrix" section. Replace each `[pending deploy]` cell with the test result. User executes on real devices using the live $VERCEL_URL:

For each of the 4 browser environments (iOS Safari, Android Chrome, FB in-app, Zalo in-app):
1. Open `$VERCEL_URL/` in that browser
2. Tap a `tel:` CTA (Hero "Gọi" button is fine) → does the dialer open?
3. Tap the FloatingZalo FAB → does Zalo open?
4. Scroll to Contact section → tap `mailto:` → does mail composer open?

Record PASS / FAIL / NOTE per cell. Acceptable NOTEs per D-17:
- "FB in-app strips tel: handler" → NOTE (accepted risk)
- "Zalo in-app strips mailto: handler" → NOTE (accepted risk)

iOS Safari + Android Chrome cells MUST be PASS for the deploy to be considered complete. In-app browsers are informational.

Update `06-01-audit-polish-VERIFICATION.md` in place (this Plan 06-02 task edits the Plan 06-01 verification file — that's expected; the matrix lives there per D-15 reference structure).

### Aggregate

Append a final section to `06-02-deploy-docs-VERIFICATION.md`:

```
## Post-deploy verification summary

- Live URL: $VERCEL_URL
- HTTPS 200 on /: ✅ / ❌
- HTTPS 200 on /du-an/: ✅ / ❌
- Sitemap loc uses Vercel domain (NOT placeholder): ✅ / ❌
- JSON-LD @id uses Vercel domain: ✅ / ❌
- OG image fetches 200 image/png: ✅ / ❌
- /icon + /apple-icon fetch 200: ✅ / ❌
- Vercel Analytics pageviews ≥ 1 (after 5 min): ✅ / ❌
- Rich Results Test passes (no errors): ✅ / ❌
- Real-device CTA matrix (iOS Safari + Android Chrome cells): ✅ / ❌ (in-app cells informational)

## DEPLOY GATE Verdict

PASS if all ✅. FAIL → diagnose + fix + redeploy + re-verify.
```
  </how-to-verify>
  <resume-signal>Reply with the live URL + ✅/❌ status for each of the 9 items + the filled matrix cells (at minimum iOS Safari + Android Chrome rows). Type "DEPLOY GATE PASS" when all hard items are ✅.</resume-signal>
</task>

<task type="auto">
  <name>Task 5: Finalize STATE.md / ROADMAP.md / REQUIREMENTS.md + commit</name>
  <files>.planning/STATE.md, .planning/ROADMAP.md, .planning/REQUIREMENTS.md, .planning/phases/06-audit-launch/06-02-deploy-docs-VERIFICATION.md</files>
  <action>
Final task of the final phase. Update all status-tracking docs to reflect v1.0 ship.

### 1. REQUIREMENTS.md

Mark these checkboxes by changing `- [ ]` → `- [x]`:
- QA-01, QA-02, QA-03, QA-04, QA-05, QA-06 (Quality section — lines 56–61)
- DEPLOY-01, DEPLOY-02, DEPLOY-03 (Deployment section — lines 65–67)

Note the actual hosting decision changed from Cloudflare Pages to Vercel — update the text of DEPLOY-01..03 to reflect Vercel (per D-01..D-04 override). Example replacement:
- DEPLOY-01: "Build artifact `/out/` generate đúng, deploy được lên **Vercel** (Hobby tier)"
- DEPLOY-02: "**`@vercel/analytics`** tích hợp vào `layout.tsx` qua `<Analytics />` component (production-only auto-detected via VERCEL_ENV)"
- DEPLOY-03: "README.md updated với deploy instructions (**Vercel** + env vars NEXT_PUBLIC_SITE_URL)"

Update the Traceability table at the bottom: status column for QA-01..06 and DEPLOY-01..03 should now read "Complete".

### 2. ROADMAP.md

In the Phases list (top), change:
- `- [ ] **Phase 6: Audit + Launch**` → `- [x] **Phase 6: Audit + Launch**`

In the Phase 6 detail section:
- Update text to reflect Vercel deploy (currently says "Cloudflare Pages deploy, Web Analytics, README")
- Replace `**Plans**: TBD (estimated 2 plans for coarse granularity — audit/QA pass + deploy/docs)` with:
  ```
  **Plans**: 2 plans (Wave 1 then Wave 2 — sequential per audit-gate-then-deploy)
  - [x] 06-01-audit-polish-PLAN.md — Lighthouse mobile + responsive matrix + tap-target + body-text + console-clean + outputFileTracingRoot fix + real-device matrix template (Wave 1, QA-01..06)
  - [x] 06-02-deploy-docs-PLAN.md — @vercel/analytics wire + README rewrite + Vercel deploy walkthrough + post-deploy live verify + final phase status updates (Wave 2, DEPLOY-01..03)
  ```
- Mark each of Success Criteria 1–7 as PASS with a short evidence pointer. Example formatting:
  ```
  **Success Criteria** (verified):
  1. ✅ Responsive 375/768/1280 — see 06-01-audit-polish-VERIFICATION.md "Responsive Matrix"
  2. ✅ Lighthouse mobile thresholds — see lighthouse-landing.html + lighthouse-du-an.html
  3. ✅ Tap target ≥ 44×44px + body text ≥ 16px — see 06-01 matrix
  4. ✅ Real-device CTA — see 06-01 filled matrix (iOS Safari + Android Chrome PASS; in-app browser cells informational per D-17)
  5. ✅ Zero console errors on `npm run build && npx serve out/` — see 06-01 Console/Network section
  6. ✅ Production on Vercel HTTPS + analytics live — see 06-02-deploy-docs-VERIFICATION.md
  7. ✅ README.md documents deploy workflow — see committed README.md
  ```
  Note: Criterion 6 originally said "Cloudflare Pages" — replace with "Vercel" per D-01 override.

In the Progress Table (bottom):
- Phase 6 row: `0/TBD | Not started | -` → `2/2 | Complete | 2026-05-28` (or whatever today's date is; per CLAUDE.md project context the working date is 2026-05-28)

### 3. STATE.md

(Read current STATE.md first to preserve unrelated content — only update phase progress fields.)

Update progress fields to reflect milestone:
- `completed_phases: 6`
- `completed_plans: 11` (Phase 1: 2 + Phase 2: 2 + Phase 3: 2 + Phase 4: 1 + Phase 5: 2 + Phase 6: 2 = 11)
- `current_phase: null` or `"v1.0 — site live"` per local convention
- `status: "v1.0 milestone complete — site live on Vercel"`

If STATE.md uses different field names, preserve the local schema — just update the analogous fields.

### 4. SUMMARY.md (this plan)

Create `.planning/phases/06-audit-launch/06-02-deploy-docs-SUMMARY.md` capturing:
- What was wired (analytics)
- What was rewritten (README — list sections)
- Vercel URL deployed to
- Evidence of env-var propagation (sitemap loc + JSON-LD @id sample)
- Real-device matrix outcome summary
- Final phase verdict + v1.0 milestone marker
- Deferred-to-post-launch items (Vietnamese copy review, GSC, GBP, Maps embed, custom domain)

### 5. Commit + tag (optional)

```bash
git add package.json package-lock.json src/app/layout.tsx README.md \
  .planning/phases/06-audit-launch/06-02-deploy-docs-VERIFICATION.md \
  .planning/phases/06-audit-launch/06-02-deploy-docs-SUMMARY.md \
  .planning/phases/06-audit-launch/06-01-audit-polish-VERIFICATION.md \
  .planning/STATE.md .planning/ROADMAP.md .planning/REQUIREMENTS.md
git commit -m "feat(06-02): wire vercel analytics + ship v1.0 (deploy + docs + status)"
```

Commit message keeps the project convention (no AI co-author trailer per project's commit-style observed in Phase 5 commits).

Optionally — only if user asks — tag `git tag v1.0` and `git push --tags`. Default: do NOT tag without explicit user request (per critical constraint and git safety protocol — tag is an explicit-action operation).
  </action>
  <verify>
- REQUIREMENTS.md: `grep "^- \[x\] \*\*\(QA\|DEPLOY\)-" .planning/REQUIREMENTS.md` returns 9 lines (QA-01..06 + DEPLOY-01..03)
- REQUIREMENTS.md: zero remaining `- [ ]` lines in QA + Deployment sections
- REQUIREMENTS.md: DEPLOY-01..03 text mentions Vercel (not Cloudflare)
- ROADMAP.md: Phase 6 line at top is `- [x]` (checked)
- ROADMAP.md: Phase 6 detail section Plans block has `- [x] 06-01-...` and `- [x] 06-02-...`
- ROADMAP.md: Progress Table Phase 6 row shows `2/2 | Complete`
- STATE.md: status mentions "v1.0" or "complete" or "live"
- `.planning/phases/06-audit-launch/06-02-deploy-docs-SUMMARY.md` exists, >= 30 lines
- `git log -1 --oneline` shows the feat(06-02) commit
- `git status` clean
  </verify>
  <done>
- All 9 requirement IDs (QA-01..06 + DEPLOY-01..03) checked in REQUIREMENTS.md with Vercel-correct text
- ROADMAP Phase 6 marked complete with all 7 success criteria PASS + evidence pointers
- STATE.md reflects v1.0 ship
- SUMMARY.md committed
- One feat(06-02) commit captures the full Wave 2 work
- v1.0 milestone is recorded; site is live; phase is closed
  </done>
</task>

</tasks>

<verification>
End-of-plan verification (all must pass):

1. `git status` — clean working tree
2. `git log -2 --oneline` — shows chore(06-01) and feat(06-02) commits in order
3. `npx tsc --noEmit` — exit 0
4. `npm run build` — exit 0, `out/` generated, no warnings
5. `curl -sI "$VERCEL_URL/"` — 200
6. `curl -s "$VERCEL_URL/sitemap.xml" | grep -o '<loc>[^<]*' | head -1` — starts with $VERCEL_URL (not khangthinhinv.vn)
7. Vercel dashboard → Analytics → Pageviews ≥ 1
8. `grep -c "^- \[x\]" .planning/REQUIREMENTS.md` — at least 38 (all v1 requirements ticked)
9. `grep -c "^- \[x\] \*\*Phase" .planning/ROADMAP.md` — equals 6 (all phases complete)
10. `.planning/phases/06-audit-launch/06-02-deploy-docs-SUMMARY.md` exists
</verification>

<success_criteria>
Plan 06-02 + Phase 6 is COMPLETE when:
- Site is live at a Vercel HTTPS URL
- `<Analytics />` renders and records pageviews on the live URL (≥ 1 confirmed)
- README.md is the Vercel deploy doc (Vietnamese primary)
- Env-var propagation verified (sitemap.xml + JSON-LD + OG use Vercel domain, not placeholder)
- Real-device CTA matrix iOS Safari + Android Chrome rows = PASS (in-app rows informational per D-17)
- REQUIREMENTS.md / ROADMAP.md / STATE.md reflect v1.0 ship
- All commits clean; no untracked planning files

Plan 06-02 has FAILED if:
- Vercel deploy fails after one fix loop and cause is not env-var or analytics related
- Sitemap.xml leaks the placeholder domain after explicit env-var redeploy
- Vercel Analytics records 0 pageviews after 10 minutes of confirmed live traffic
- iOS Safari OR Android Chrome CTA tests FAIL (in-app browser limitations are accepted; mainstream mobile is not)
</success_criteria>

<risks>
- **Pitfall #1 (Looks Done But Isn't)**: every deploy item needs evidence (curl output, dashboard screenshot, analytics count) per D-24. — MITIGATED by Task 4 explicit curl + dashboard checks.
- **Pitfall #2 (assets 404 on deploy)**: Vercel does NOT need basePath (root deploy) per D-25. If `_next/static/*` 404s, Task 4 curl on a few asset URLs will catch it; fix = redeploy. — Expected to be moot.
- **Pitfall #6 (LocalBusiness JSON-LD)**: validated post-deploy via Rich Results Test in Task 4. Telephone E.164 and taxID already encoded by Phase 5; deploy just needs domain to propagate. — MITIGATED.
- **Pitfall #7 (broken tel/Zalo)**: full real-device matrix fill in Task 4. iOS Safari + Android Chrome MUST pass; FB/Zalo in-app NOTE-accepted per D-17. — MITIGATED via documented matrix.
- **Pitfall #8 (Vietnamese-native copy review)**: DEFERRED post-deploy per D-27 / user explicit decision. Tracked in 06-01 VERIFICATION.md "Deferred / Out of Scope". Not a Phase 6 blocker. — MITIGATED via deferral documentation.
- **Pitfall #10 (sitemap/OG wrong domain)**: PRIMARY risk. If `NEXT_PUBLIC_SITE_URL` env var is missing OR set AFTER first build on Vercel, sitemap.xml and JSON-LD will leak the `https://khangthinhinv.vn` placeholder. — MITIGATED: Task 3 walkthrough emphasizes "set env var BEFORE deploy"; Task 4 explicit `curl sitemap.xml | grep` validates. Two-deploy fix flow documented.
- **Analytics 0 pageviews**: most likely cause = ad-blocker on user's test browser; second cause = `<Analytics />` not in `out/index.html` (would have been caught Task 1). Mitigation: try a different browser or incognito mode without extensions.
- **Vercel build fails on `@vercel/analytics` not found**: unlikely (package is first-party), but if so → `npm ci` locally and recommit lockfile; ensure lockfile is included in the deploy. — MITIGATED by Task 1 npm install + lockfile commit in Task 5.
</risks>

<out_of_scope>
Explicitly NOT in this plan (post-launch v1.x or never):

- Custom domain registration + DNS configuration (user has no domain; README documents how when user is ready)
- Google Search Console sitemap submission (defer until real domain + native copy review per CONTEXT)
- Google Business Profile registration (LSEO-01 — v1.x)
- Google Maps embed in Contact section (LSEO-02 — v1.x)
- Vietnamese-native copy review (DEFERRED per D-27 — user reviews post-launch + reports fixes)
- Per-project OG images for `/du-an/[slug]` (out-of-scope — `/du-an/[slug]` itself is v2)
- Project detail pages `/du-an/[slug]` (out-of-scope per PROJECT.md)
- Cloudflare Pages deploy / Cloudflare Web Analytics (overridden by Vercel per D-01 / D-05)
- Conditional rendering / NODE_ENV guards around `<Analytics />` (forbidden per D-07 + critical constraints)
- Lighthouse CI in GitHub Actions (post-launch nice-to-have, not required)
</out_of_scope>

<output>
After completion, this plan produces:
1. `package.json` + `package-lock.json` with `@vercel/analytics` dependency
2. `src/app/layout.tsx` with `<Analytics />` rendered after `<FloatingZalo />`
3. `README.md` rewritten as Vercel-focused deploy doc (Vietnamese primary)
4. `.planning/phases/06-audit-launch/06-02-deploy-docs-VERIFICATION.md` — deploy walkthrough + post-deploy curl/dashboard evidence + DEPLOY GATE = PASS
5. `.planning/phases/06-audit-launch/06-01-audit-polish-VERIFICATION.md` — real-device CTA matrix cells FILLED (modified by this plan post-deploy)
6. Updated `.planning/REQUIREMENTS.md` (QA-01..06 + DEPLOY-01..03 checked, Vercel text)
7. Updated `.planning/ROADMAP.md` (Phase 6 complete with evidence pointers)
8. Updated `.planning/STATE.md` (v1.0 milestone recorded)
9. `.planning/phases/06-audit-launch/06-02-deploy-docs-SUMMARY.md` summarizing the deploy work

Followed by: Phase 6 is closed. Project status = v1.0 site live on Vercel. Tracked post-launch backlog items: Vietnamese-native copy review, GSC submission, custom domain, GBP, Maps embed.
</output>
