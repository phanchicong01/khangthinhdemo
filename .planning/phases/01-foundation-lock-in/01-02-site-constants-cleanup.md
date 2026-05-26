---
phase: 01-foundation-lock-in
plan: 02
type: execute
wave: 2
depends_on:
  - 01-01-config-tokens-fonts
files_modified:
  - src/lib/site.ts
  - src/app/layout.tsx
  - src/app/page.tsx
  - .env.example
  - .gitignore
autonomous: true
requirements:
  - FND-05
  - FND-06
  - FND-07
user_setup: []

must_haves:
  truths:
    - "Company facts (phone, Zalo URL, email, MST, address, legal rep, tagline) are importable from a SINGLE module: src/lib/site.ts"
    - "Changing NEXT_PUBLIC_SITE_URL in .env.local propagates to siteUrl at build time; default fallback is https://khangthinhinv.vn"
    - "metadataBase warning no longer appears in npm run build output (layout.tsx now imports siteUrl from lib/site.ts)"
    - "Old skeleton folders src/app/dich-vu/, src/app/lien-he/, src/components/Header.tsx, src/components/Footer.tsx are deleted; npm run build still passes"
    - "Phase 1 sentinel in app/page.tsx is replaced by a minimal env-var sanity readout (still placeholder — real Hero arrives in Phase 3)"
    - "tel: href uses E.164 format (+84921985599, no spaces); display format uses 092 198 55 99; Zalo deep link uses HTTPS (https://zalo.me/0921985599)"
  artifacts:
    - path: "src/lib/site.ts"
      provides: "Single source of truth — siteUrl, company object (legalName, phoneDisplay, phoneE164, phoneRaw, email, zaloUrl, taxId, address, legalRep, founded, tagline), helper functions (telHref, mailtoHref, zaloHref), Company type"
      exports: ["siteUrl", "company", "telHref", "mailtoHref", "zaloHref", "Company"]
    - path: ".env.example"
      provides: "Documents the NEXT_PUBLIC_SITE_URL contract for the team"
      contains: "NEXT_PUBLIC_SITE_URL"
    - path: ".gitignore"
      provides: "Ensures .env.local, /out/, /.next/ are NOT committed"
      contains: ".env.local"
  key_links:
    - from: "src/app/layout.tsx"
      to: "src/lib/site.ts"
      via: "import { siteUrl } from '@/lib/site'; metadataBase: new URL(siteUrl)"
      pattern: "from '@/lib/site'"
    - from: "src/lib/site.ts"
      to: "process.env.NEXT_PUBLIC_SITE_URL"
      via: "?? nullish coalescing with default 'https://khangthinhinv.vn'"
      pattern: "process\\.env\\.NEXT_PUBLIC_SITE_URL"
---

<objective>
Lock company facts as a single source of truth in `src/lib/site.ts`, wire `NEXT_PUBLIC_SITE_URL` env var through `metadataBase`, delete the old skeleton folders (FND-07), and replace the Phase-1 visual sentinel with a minimal env-var sanity check.

Purpose: Prevent NAP drift (Pitfall #6 — phone/MST/address inconsistencies between Footer, Contact, JSON-LD, OG metadata all kill local SEO), close the `metadataBase` warning (Pitfall #4 / #15), and remove orphan skeleton code that would block Phase 2 from cleanly building the new Nav/Footer.

Output: A repo where every later phase (Nav from Phase 2, Contact from Phase 3, sitemap/robots/JSON-LD from Phase 5) imports company facts from one typed module, AND the old skeleton (`dich-vu/`, `lien-he/`, `Header.tsx`, `Footer.tsx`) is gone.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/research/SUMMARY.md
@.planning/phases/01-foundation-lock-in/01-RESEARCH.md
@.planning/phases/01-foundation-lock-in/01-01-SUMMARY.md

<!-- Files that will be modified or whose current state matters -->
@src/app/layout.tsx
@src/app/page.tsx
@package.json

<interfaces>
<!-- Locked decisions from 01-RESEARCH.md Focus Area 4 — executor MUST use these exact constants. -->

Company constants (verbatim from PROJECT.md + RESEARCH.md TL;DR §4 + Focus Area 4):
```
legalName:    'Công ty TNHH Khang Thịnh Investment'
shortName:    'KHANG THỊNH INV'
tagline:      'Hợp tác cùng phát triển'
founded:      2025

phoneDisplay: '092 198 55 99'   // display only
phoneE164:    '+84921985599'    // tel: href ONLY (E.164, no spaces, no parens)
phoneRaw:     '0921985599'      // bare digits — used to build zalo.me URL

email:        'khangthinhinv2025@gmail.com'
zaloUrl:      'https://zalo.me/0921985599'   // HTTPS — NEVER zalo://

taxId:        '1102107064'      // JSON-LD taxID (no spaces, schema convention)
taxIdDisplay: '1102 107 064'    // visible MST format
legalRep:     'Tô Thị Bích Ngọc'

address.street:   'A3-02 KDC Long Phú'
address.locality: 'xã Bến Lức'
address.region:   'Tây Ninh'
address.country:  'VN'
address.full:     'A3-02 KDC Long Phú, xã Bến Lức, tỉnh Tây Ninh'
```

Env var contract (from RESEARCH.md Focus Area 4):
```typescript
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://khangthinhinv.vn'
// Must use ?? (nullish coalescing), NOT || — empty string in .env.local must NOT fall through
```

Files to DELETE (from FND-07, RESEARCH.md Pitfall #6):
- `src/app/dich-vu/` (entire folder including page.tsx)
- `src/app/lien-he/` (entire folder including page.tsx)
- `src/components/Header.tsx`
- `src/components/Footer.tsx` (NOT in FND-07 text, but currently imported by page.tsx skeleton — must remove alongside Header to avoid orphan import)

Deletion sequence (per RESEARCH.md Pitfall #6 — order matters):
1. Remove imports of Header/Footer from `src/app/page.tsx` FIRST
2. Verify `npm run build` still passes (no orphan imports)
3. Delete the orphan files
4. Verify `npm run build` again (proves nothing else imported them)
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create src/lib/site.ts + .env.example + .gitignore verification</name>
  <files>src/lib/site.ts, .env.example, .gitignore</files>
  <action>
**Goal:** Establish the single source of truth for company facts BEFORE wiring it into layout.tsx (Task 2) and page.tsx (Task 3).

**Step 1 — Create `src/lib/site.ts`** (new file; directory `src/lib/` does not yet exist — create it). Write EXACTLY this content (verbatim from RESEARCH.md TL;DR §4 + Focus Area 4):

```typescript
// Single source of truth for company facts, domain, and CTA URLs.
//
// Consumers (current + planned):
// - src/app/layout.tsx           — metadataBase via siteUrl
// - src/app/sitemap.ts  (Phase 5)
// - src/app/robots.ts   (Phase 5)
// - src/components/Footer.tsx     (Phase 2) — legal block (MST, ĐDPL, address)
// - src/components/FloatingZalo.tsx (Phase 2) — zaloHref()
// - src/components/sections/Contact.tsx (Phase 3) — 3-channel CTAs
// - JSON-LD GeneralContractor block (Phase 5) — taxID, telephone, postalAddress

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://khangthinhinv.vn'

export const company = {
  legalName: 'Công ty TNHH Khang Thịnh Investment',
  shortName: 'KHANG THỊNH INV',
  tagline: 'Hợp tác cùng phát triển',
  founded: 2025,

  // Phone — display vs tel: href vs zalo URL building block
  phoneDisplay: '092 198 55 99',
  phoneE164: '+84921985599', // tel:+84921985599 — E.164, no spaces, no parens
  phoneRaw: '0921985599',    // bare digits, used to build zalo.me URL

  email: 'khangthinhinv2025@gmail.com',

  // Zalo deep link — HTTPS (NEVER zalo://).
  // Works on iOS Universal Link + Android intent fallback.
  zaloUrl: 'https://zalo.me/0921985599',

  // Legal (MST + ĐDPL)
  taxId: '1102107064',
  taxIdDisplay: '1102 107 064',
  legalRep: 'Tô Thị Bích Ngọc',

  // Address (PostalAddress shape — reusable in JSON-LD)
  address: {
    street: 'A3-02 KDC Long Phú',
    locality: 'xã Bến Lức',
    region: 'Tây Ninh',
    country: 'VN',
    full: 'A3-02 KDC Long Phú, xã Bến Lức, tỉnh Tây Ninh',
  },
} as const

// Helpers (prevent typos at call sites; consumed by Footer, Contact, FloatingZalo)
export const telHref = (): string => `tel:${company.phoneE164}`
export const mailtoHref = (): string => `mailto:${company.email}`
export const zaloHref = (): string => company.zaloUrl

// Type export for downstream consumers (PostalAddress JSON-LD in Phase 5)
export type Company = typeof company
```

**Why this exact shape (per RESEARCH.md Focus Area 4):**
- `as const` freezes literal types — consumers get autocomplete on `company.phoneE164` as `'+84921985599'` not generic `string`
- Three phone formats (`phoneDisplay`, `phoneE164`, `phoneRaw`) are needed because they appear in 3 different contexts (visible text / tel href / zalo URL construction) and conflating them creates Pitfall #7 (broken `tel:` from spaces)
- `taxId` (no spaces) vs `taxIdDisplay` (with spaces) — JSON-LD `taxID` schema requires no spaces; UI display uses Vietnamese convention
- `??` (nullish coalescing) not `||` — see Gotchas below

**Gotchas (per RESEARCH.md):**
- DO NOT use `||` instead of `??` — `NEXT_PUBLIC_SITE_URL=""` (empty string) is a real failure mode; `||` would fall through to the default, masking config errors; `??` only falls through on `null`/`undefined`
- DO NOT omit `as const` — without it, `company.phoneE164` widens to `string` and breaks downstream type narrowing
- DO NOT add Zalo OA app ID, Google Business Profile place ID, etc. yet — defer to Phase 5/6
- DO NOT export raw constants without the `company` namespace object — keeping them grouped on `company.*` keeps imports clean (`import { company, telHref } from '@/lib/site'`)

**Step 2 — Create `.env.example`** at repo root:
```bash
# Production site URL — must include protocol (https://).
# Used by:
#   - layout.tsx metadataBase (OG image absolutization)
#   - sitemap.ts (Phase 5) — every <loc> entry
#   - robots.ts (Phase 5) — Sitemap directive
#   - JSON-LD url field
# Default fallback (if unset): https://khangthinhinv.vn
NEXT_PUBLIC_SITE_URL=https://khangthinhinv.vn
```

**Step 3 — Verify `.gitignore`** at repo root contains entries for `.env.local`, `/out/`, `/.next/`, `node_modules/`. If `.gitignore` is missing any of these, ADD them (append at end). Standard Next.js `.gitignore` should already cover these; this is just an audit.

Minimum required entries (verify present):
```
# Next.js build output
/.next/
/out/

# Local env overrides
.env.local
.env*.local

# Dependencies
/node_modules/
```

**Rollback note:** Trivial — `rm src/lib/site.ts .env.example` (the `.gitignore` audit only appends if missing). New file creation, no overwrites.

Implements: FND-05 (`NEXT_PUBLIC_SITE_URL` env var), FND-06 (`lib/site.ts` single source of truth).
  </action>
  <verify>
    <automated>cd /Users/congphan/Workspace/my-projects/khang-thing-group/website && test -f src/lib/site.ts && grep -E "process\.env\.NEXT_PUBLIC_SITE_URL\s*\?\?" src/lib/site.ts && grep -E "phoneE164:\s*'\+84921985599'" src/lib/site.ts && grep -E "phoneDisplay:\s*'092 198 55 99'" src/lib/site.ts && grep -E "zaloUrl:\s*'https://zalo\.me/0921985599'" src/lib/site.ts && grep -E "taxId:\s*'1102107064'" src/lib/site.ts && grep -E "legalRep:\s*'Tô Thị Bích Ngọc'" src/lib/site.ts && grep -E "as const" src/lib/site.ts && grep -E "export const telHref" src/lib/site.ts && grep -E "export type Company" src/lib/site.ts && test -f .env.example && grep -E "NEXT_PUBLIC_SITE_URL=https://khangthinhinv\.vn" .env.example && grep -E "^\.env\.local$|\.env\*\.local" .gitignore && grep -E "^/\.next/?$|^/out/?$" .gitignore && npx tsc --noEmit && echo "OK: lib/site.ts + .env.example + .gitignore verified"</automated>
  </verify>
  <done>
- `src/lib/site.ts` exists with `siteUrl`, `company`, `telHref`, `mailtoHref`, `zaloHref`, `Company` type exports
- All constants match RESEARCH.md Focus Area 4 verbatim (phone E.164, MST, ĐDPL Tô Thị Bích Ngọc, address fields, Zalo HTTPS URL)
- `as const` applied to `company` object
- `siteUrl` uses `??` (not `||`) with default `https://khangthinhinv.vn`
- `.env.example` exists with `NEXT_PUBLIC_SITE_URL=https://khangthinhinv.vn` and explanatory comment
- `.gitignore` covers `.env.local`, `/.next/`, `/out/`, `node_modules/`
- `npx tsc --noEmit` exits 0 (lib/site.ts type-checks clean; no consumers yet — that's Task 2)
  </done>
</task>

<task type="auto">
  <name>Task 2: Wire siteUrl into layout.tsx metadataBase (closes Pitfall #4 / #15)</name>
  <files>src/app/layout.tsx</files>
  <action>
**Goal:** Close the `metadataBase` warning that Plan 01 Task 4 surfaced. Now that `lib/site.ts` exists (Task 1), import `siteUrl` and pass to `metadataBase`.

**Edit `src/app/layout.tsx`** — surgical change to two locations only (do NOT rewrite the whole file):

1. Add the import at the top of the imports block (after the `Be_Vietnam_Pro` import, before `import './globals.css'`):
   ```typescript
   import { siteUrl } from '@/lib/site'
   ```

2. Add `metadataBase: new URL(siteUrl),` as the FIRST property of the `metadata` object (before `title:`). The full `metadata` block after this change should be:
   ```typescript
   export const metadata: Metadata = {
     metadataBase: new URL(siteUrl),
     title: {
       default: 'Khang Thịnh Investment — Cung ứng VLXD, Xây dựng, Vận chuyển',
       template: '%s | Khang Thịnh Investment',
     },
     description:
       'Cung ứng cát, đá, san lấp. Xây dựng nhà phố & công trình dân dụng. Vận chuyển đường thủy. Đối tác Bộ Quốc phòng - Binh đoàn 12 - Trường Sơn.',
   }
   ```

Also remove the placeholder comment from Plan 01 Task 3:
```typescript
// NOTE: metadataBase intentionally omitted in this task — added in Plan 02 once
// `lib/site.ts` exposes `siteUrl`. Until then, build will log a metadataBase
// warning; Plan 02 closes that gap (Pitfall #4 / FND-05).
```
Replace with:
```typescript
// metadataBase resolved at build time from NEXT_PUBLIC_SITE_URL via lib/site.ts.
// Default fallback: https://khangthinhinv.vn. Override via .env.local for dev/preview deploys.
```

**Why `new URL(siteUrl)` not raw string (per RESEARCH.md):**
- Next.js `Metadata.metadataBase` requires a `URL` instance (per Next.js docs)
- `new URL(...)` will THROW if `siteUrl` lacks a protocol (e.g., user sets `NEXT_PUBLIC_SITE_URL=khangthinhinv.vn` without `https://`) — this is the desired loud-failure behavior; documented in `.env.example`

**Gotchas (per RESEARCH.md Focus Area 4):**
- DO NOT inline `process.env.NEXT_PUBLIC_SITE_URL` here — that bypasses the `??` fallback and creates a second source of truth
- DO NOT add `siteName` / `openGraph` blocks here yet — that's Phase 5 (SEO + OG image)
- The path alias `@/lib/site` resolves via `tsconfig.json` `paths: { "@/*": ["./src/*"] }` — already set up (verified in inspection)

**Rollback note:** `git diff src/app/layout.tsx` will show 2-3 small edits — easy to revert manually or via `git checkout`.

Implements: FND-05 (NEXT_PUBLIC_SITE_URL propagation), closes RESEARCH.md Pitfall #4 / #15.
  </action>
  <verify>
    <automated>cd /Users/congphan/Workspace/my-projects/khang-thing-group/website && grep -E "import \{ siteUrl \} from '@/lib/site'" src/app/layout.tsx && grep -E "metadataBase:\s*new URL\(siteUrl\)" src/app/layout.tsx && rm -rf .next && npm run build 2>&1 | tee /tmp/build-01-02-task2.log && test -f out/index.html && ! grep -i "metadatabase" /tmp/build-01-02-task2.log && echo "OK: metadataBase wired; warning gone"</automated>
  </verify>
  <done>
- `layout.tsx` imports `{ siteUrl }` from `@/lib/site`
- `metadata` object has `metadataBase: new URL(siteUrl)` as first property
- Old "intentionally omitted" comment removed; new explanatory comment in place
- `npm run build` clean rebuild exits 0
- Build log NO LONGER contains the `metadataBase` warning (RESEARCH.md Pitfall #4 / #15 closed)
  </done>
</task>

<task type="auto">
  <name>Task 3: Replace page.tsx skeleton with Phase-1 sentinel + env-var sanity readout</name>
  <files>src/app/page.tsx</files>
  <action>
**Goal:** Remove the old skeleton imports (Header, Footer) from `src/app/page.tsx`, replace its content with a minimal Phase-1 sentinel that proves env var wiring AND covers the visual diacritic check carried over from Plan 01 Task 4. This unblocks Task 4 to safely delete the orphan files.

**⚠️ Rewrite from scratch — current `page.tsx` is ~170 lines of skeleton including the Plan-01 sentinel. Replace entirely with this:**

```tsx
// ⚠️ Phase 1 sentinel — placeholder until real Hero arrives in Phase 3.
// Purpose:
//   1. Prove lib/site.ts → siteUrl wiring works (FND-05).
//   2. Prove Burgundy/Bone palette utilities render (FND-03).
//   3. Prove Be Vietnam Pro Vietnamese diacritics render correctly across weights (FND-04).
// DELETE this entire file body in Phase 3 (replaced by composed sections).
import { company, siteUrl, telHref, zaloHref, mailtoHref } from '@/lib/site'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-bone text-espresso p-8">
      <section className="max-w-3xl mx-auto space-y-6">
        <header className="border-b-4 border-burgundy pb-4">
          <p className="font-sans text-sm uppercase tracking-widest text-taupe">
            Phase 1 — Foundation Lock-In · Sentinel
          </p>
          <h1 className="font-sans font-black uppercase tracking-wide text-4xl md:text-5xl text-burgundy mt-2">
            {company.shortName} — Đội tàu 3,900 tấn
          </h1>
          <p className="font-sans italic text-burgundy-dark mt-2">
            "{company.tagline}"
          </p>
        </header>

        {/* Vietnamese diacritic stress test — all weights 400→900 */}
        <div className="bg-bone-dark p-4 space-y-1 border border-taupe">
          <p className="font-sans font-normal">400 — Cao tốc Cái Nước · Đất Mũi Cà Mau · Hợp tác cùng phát triển</p>
          <p className="font-sans font-medium">500 — Cầu Cửa Lớn · Đường ra đảo Hòn Khoai</p>
          <p className="font-sans font-semibold">600 — Cung ứng cát, đá, san lấp · Xây dựng dân dụng</p>
          <p className="font-sans font-bold">700 — Vận chuyển đường thủy · Trường Sơn · Binh đoàn 12</p>
          <p className="font-sans font-extrabold uppercase">800 — KHANG THỊNH ĐẦU TƯ — TÂY NINH</p>
          <p className="font-sans font-black uppercase tracking-wide">900 — KHANG THỊNH ĐỘI TÀU 3,900 TẤN — BỘ QUỐC PHÒNG</p>
        </div>

        {/* Palette swatch — proves all 8 @theme tokens generate utilities */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-burgundy text-bone p-3 text-xs">burgundy</div>
          <div className="bg-burgundy-dark text-bone p-3 text-xs">burgundy-dark</div>
          <div className="bg-terracotta text-bone p-3 text-xs">terracotta</div>
          <div className="bg-coffee text-bone p-3 text-xs">coffee</div>
          <div className="bg-bone text-espresso p-3 text-xs border border-taupe">bone</div>
          <div className="bg-bone-dark text-espresso p-3 text-xs border border-taupe">bone-dark</div>
          <div className="bg-espresso text-bone p-3 text-xs">espresso</div>
          <div className="bg-taupe text-bone p-3 text-xs">taupe</div>
        </div>

        {/* Env-var sanity — proves NEXT_PUBLIC_SITE_URL propagates (FND-05) */}
        <div className="bg-espresso text-bone p-4 font-mono text-sm space-y-1">
          <p>siteUrl = {siteUrl}</p>
          <p>tel = {telHref()}</p>
          <p>zalo = {zaloHref()}</p>
          <p>mail = {mailtoHref()}</p>
          <p>mst = {company.taxIdDisplay}</p>
          <p>address = {company.address.full}</p>
        </div>

        <p className="font-sans text-sm text-taupe italic">
          Phase 1 only — real Hero, Services, Projects, Contact sections arrive in Phase 3.
        </p>
      </section>
    </main>
  )
}
```

**Why this exact structure (per RESEARCH.md Open Questions #3):**
- One sentinel covers all of Plan 01's visual checks PLUS Plan 02's env-var verification — no need to maintain two
- Imports from `@/lib/site` exercise the type-checker on the new module
- 6 paragraphs at weights 400/500/600/700/800/900 prove FND-04 across the FULL weight range (Plan 01 only tested 900)
- 8 palette swatches prove every `@theme` token generates a utility (FND-03)
- `<p>siteUrl = {siteUrl}</p>` renders the env var at build time → user can change `.env.local` and observe the value flip on next build

**Gotchas:**
- DO NOT keep ANY imports from `@/components/Header` or `@/components/Footer` — those files are deleted in Task 4 and any lingering import would break the build
- DO NOT add a `metadata` export here (`<head>` is owned by root layout.tsx per Next.js App Router conventions)
- This sentinel WILL be entirely replaced in Phase 3 — do not over-invest in styling/copy
- `font-mono` works without configuration (Tailwind's built-in mono stack — JetBrains Mono explicitly NOT used per PROJECT.md anti-libraries list)

**Rollback note:** `git checkout src/app/page.tsx` restores the skeleton with Header/Footer imports. After Task 4 deletes those files, however, restoring `page.tsx` alone would leave broken imports — rollback must include reverting Task 4 too.

Implements: FND-05 (env-var sanity), FND-06 (lib/site.ts consumer proof), Phase 1 success criterion #4.
  </action>
  <verify>
    <automated>cd /Users/congphan/Workspace/my-projects/khang-thing-group/website && grep -E "from '@/lib/site'" src/app/page.tsx && ! grep -E "from '@/components/Header'|from '@/components/Footer'" src/app/page.tsx && grep -E "siteUrl =" src/app/page.tsx && grep -E "font-black uppercase tracking-wide" src/app/page.tsx && grep -E "bg-burgundy|bg-bone|bg-espresso|bg-terracotta|bg-coffee|bg-bone-dark|bg-burgundy-dark|bg-taupe" src/app/page.tsx | wc -l | awk '$1 >= 8 { exit 0 } { exit 1 }' && rm -rf .next && npm run build && test -f out/index.html && echo "OK: sentinel renders; build clean"</automated>
  </verify>
  <done>
- `src/app/page.tsx` imports `company`, `siteUrl`, `telHref`, `zaloHref`, `mailtoHref` from `@/lib/site`
- No imports from `@/components/Header` or `@/components/Footer` remain
- 6 weight stress-test paragraphs (400, 500, 600, 700, 800, 900) with Vietnamese diacritics
- 8 palette swatches covering every `--color-*` token in `@theme`
- Env-var readout block prints `siteUrl`, `tel`, `zalo`, `mail`, `mst`, `address` so user can visually confirm
- `npm run build` exits 0 from clean state; `out/index.html` exists; no errors
  </done>
</task>

<task type="auto">
  <name>Task 4: Delete skeleton folders + components (FND-07) — sequenced for safe rollback</name>
  <files>src/app/dich-vu/, src/app/lien-he/, src/components/Header.tsx, src/components/Footer.tsx</files>
  <action>
**Goal:** Remove all old skeleton code so Phase 2 starts from a clean slate. Order matters (per RESEARCH.md Pitfall #6) — verify nothing imports them BEFORE deletion.

**Step 1 — Pre-deletion import audit:**
```bash
cd /Users/congphan/Workspace/my-projects/khang-thing-group/website
# Verify nothing in src/ still imports the to-be-deleted modules
grep -rE "from '@/components/Header'|from '@/components/Footer'|from '@/app/dich-vu'|from '@/app/lien-he'" src/ 2>/dev/null
# Expected output: NO MATCHES (page.tsx was cleaned in Task 3; no other consumers)
```
If ANY matches appear, STOP — Task 3 was incomplete. Do not proceed until the import grep is empty.

**Step 2 — Delete the orphan paths:**
```bash
rm -rf src/app/dich-vu/
rm -rf src/app/lien-he/
rm -f src/components/Header.tsx
rm -f src/components/Footer.tsx

# If src/components/ becomes empty, leave the empty directory in place
# (Phase 2 will populate it with Nav.tsx, Footer.tsx, FloatingZalo.tsx).
# If it has nothing else, optionally remove it — but git doesn't track empty dirs anyway.
ls src/components/ 2>/dev/null  # Should be empty or non-existent
```

**FND-07 explicit list** (verify each path is gone):
- `src/app/dich-vu/` (entire folder)
- `src/app/lien-he/` (entire folder)
- `src/components/Header.tsx`

**Additional cleanup** (NOT in FND-07 text but required by Task 3's import removal):
- `src/components/Footer.tsx` — also a skeleton; Phase 2 builds a new one consuming `lib/site.ts`

If there are OTHER files in `src/app/` or `src/components/` not listed above that are NOT used by `layout.tsx` or `page.tsx`, leave them alone (out of scope for FND-07). Do NOT delete `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `src/app/favicon.ico` (if present), or anything in `public/`.

**Step 3 — Verification build:**
```bash
rm -rf .next out
npm run build 2>&1 | tee /tmp/build-01-02-task4.log
```
Must exit 0. Any "Cannot find module" or "Module not found" error means a hidden import survived — investigate before proceeding.

**Step 4 — Final phase gate (covers Phase 1 success criteria #5):**
```bash
# All FND-07 paths must be gone
test ! -d src/app/dich-vu
test ! -d src/app/lien-he
test ! -f src/components/Header.tsx
test ! -f src/components/Footer.tsx

# Build must still pass
test -f out/index.html
```

**Rollback note:** This is the most destructive task in Phase 1. If something goes wrong:
- `git status` will show the deletions
- `git checkout -- src/app/dich-vu src/app/lien-he src/components/Header.tsx src/components/Footer.tsx` restores them (only if NOT committed yet)
- After commit, recovery is `git revert <task-4-commit-sha>` — single commit per task makes this clean
- ⚠️ The old `src/app/page.tsx` (skeleton with Header/Footer) cannot be restored alone — Task 3 already overwrote it. If full rollback needed, revert Task 3 commit too.

**Why a SEPARATE atomic commit:**
- File deletion is irreversible after `git gc` — isolating it lets `git revert` undo cleanly
- If verification fails in Task 5 below, this commit is the rollback target

Implements: FND-07 (skeleton cleanup), Phase 1 success criterion #5 (build still passes after deletion).
  </action>
  <verify>
    <automated>cd /Users/congphan/Workspace/my-projects/khang-thing-group/website && test ! -d src/app/dich-vu && test ! -d src/app/lien-he && test ! -f src/components/Header.tsx && test ! -f src/components/Footer.tsx && ! grep -rE "from '@/components/Header'|from '@/components/Footer'" src/ 2>/dev/null && rm -rf .next out && npm run build 2>&1 | tee /tmp/build-01-02-task4.log && test -f out/index.html && ! grep -Ei "Module not found|Cannot find module" /tmp/build-01-02-task4.log && echo "OK: skeleton deleted; build clean"</automated>
  </verify>
  <done>
- `src/app/dich-vu/` does NOT exist
- `src/app/lien-he/` does NOT exist
- `src/components/Header.tsx` does NOT exist
- `src/components/Footer.tsx` does NOT exist
- No remaining imports of the deleted modules anywhere in `src/`
- `npm run build` clean rebuild exits 0
- `out/index.html` exists
- Build log shows no "Module not found" / "Cannot find module" errors
- Single atomic git commit isolates the deletion for clean revert
  </done>
</task>

<task type="auto">
  <name>Task 5: Env var propagation proof — verify NEXT_PUBLIC_SITE_URL flips at build (Phase 1 exit gate)</name>
  <files>(no code changes — verification only; creates and removes .env.local)</files>
  <action>
**Goal:** Phase 1 success criterion #4 demands proof that `NEXT_PUBLIC_SITE_URL` flips at build time. This is the final verification gate; if it passes, Phase 1 is complete.

**Step 1 — Baseline build (no .env.local):**
```bash
cd /Users/congphan/Workspace/my-projects/khang-thing-group/website
rm -f .env.local
rm -rf .next out
npm run build > /tmp/phase1-build-default.log 2>&1
# Verify out/index.html exists
test -f out/index.html

# Sentinel renders the literal default fallback in HTML
grep -E "siteUrl = https://khangthinhinv\.vn" out/index.html && echo "OK: default fallback rendered"
```

**Step 2 — Override build with .env.local:**
```bash
echo 'NEXT_PUBLIC_SITE_URL=https://test.example.com' > .env.local
rm -rf .next out
npm run build > /tmp/phase1-build-override.log 2>&1
test -f out/index.html

# Sentinel should now render the override value
grep -E "siteUrl = https://test\.example\.com" out/index.html && echo "OK: override propagated"

# Confirm the default fallback is GONE
! grep -E "siteUrl = https://khangthinhinv\.vn" out/index.html && echo "OK: default not present when overridden"

# Also confirm metadataBase absolute URL in <head> now reflects override
# (metadataBase only affects OG image URL absolutization, not raw <html>; but the og:image
# meta tag — added in Phase 5 — will use it. For now we verify siteUrl propagation only.)
```

**Step 3 — Cleanup:**
```bash
rm -f .env.local
rm -rf .next out
# Run one final clean build with default config to leave the repo in a known-good state
npm run build > /tmp/phase1-build-final.log 2>&1
test -f out/index.html
grep -E "siteUrl = https://khangthinhinv\.vn" out/index.html
```

**Step 4 — Phase 1 master verification checklist:**

Run this verbatim checklist (each line must pass):
```bash
# FND-01: static export config
grep -E "output:\s*['\"]export['\"]" next.config.ts
grep -E "trailingSlash:\s*true" next.config.ts
grep -E "unoptimized:\s*true" next.config.ts

# FND-02: TS strict + build clean
grep -E '"strict":\s*true' tsconfig.json
npx tsc --noEmit
test -f out/index.html

# FND-03: Tailwind v4 @theme palette
grep -E "^@theme" src/app/globals.css
grep -E -- "--color-burgundy:" src/app/globals.css
grep -E -- "--color-bone:" src/app/globals.css
find out/_next/static/css -name "*.css" -exec grep -l "burgundy" {} \; | head -1

# FND-04: Be Vietnam Pro Vietnamese subset
grep -E "Be_Vietnam_Pro" src/app/layout.tsx
grep -E "subsets:\s*\['vietnamese',\s*'latin'\]" src/app/layout.tsx
grep -E "weight:\s*\['400'" src/app/layout.tsx

# FND-05: NEXT_PUBLIC_SITE_URL contract
grep -E "process\.env\.NEXT_PUBLIC_SITE_URL\s*\?\?" src/lib/site.ts
test -f .env.example
grep -E "metadataBase:\s*new URL\(siteUrl\)" src/app/layout.tsx

# FND-06: lib/site.ts single source of truth
test -f src/lib/site.ts
grep -E "phoneE164:\s*'\+84921985599'" src/lib/site.ts
grep -E "zaloUrl:\s*'https://zalo\.me/0921985599'" src/lib/site.ts
grep -E "taxId:\s*'1102107064'" src/lib/site.ts

# FND-07: skeleton cleanup
test ! -d src/app/dich-vu
test ! -d src/app/lien-he
test ! -f src/components/Header.tsx

# Final: no metadataBase warning, no orphan imports
! grep -i "metadatabase" /tmp/phase1-build-final.log
! grep -Ei "Module not found|Cannot find module" /tmp/phase1-build-final.log
```

If any line fails, the failing requirement ID is the rollback target.

**Manual visual gate** (Claude SHOULD run dev server and ASK user to confirm — but no checkpoint task here because the visual checks are baked into the sentinel; executor can `npm run dev` and inspect):
1. Open `http://localhost:3000/`
2. Confirm 6 weight paragraphs visually differ (400 thin → 900 ultra-bold)
3. Confirm Vietnamese diacritics (`Đ`, `Ầ`, `Ị`, `Ộ`, `Ữ`, `Ấ`) render with stacked accents — no fallback
4. Confirm 8 palette swatches each show a different color
5. Confirm env-var readout shows `siteUrl = https://khangthinhinv.vn` (or override if `.env.local` set)
6. DevTools Network: NO requests to `fonts.googleapis.com` / `fonts.gstatic.com`

**Rollback note:** If env-var propagation fails:
- Re-read Task 1 — `lib/site.ts` must use `??` not `||`
- Re-read Task 2 — `metadataBase` must call `new URL(siteUrl)`, importing from `@/lib/site`
- Re-read Task 3 — `page.tsx` must `import { siteUrl } from '@/lib/site'` and render `{siteUrl}` in JSX

Implements: Phase 1 success criterion #4 (env-var propagation), all 7 FND requirements verified end-to-end.
  </action>
  <verify>
    <automated>cd /Users/congphan/Workspace/my-projects/khang-thing-group/website && rm -f .env.local && rm -rf .next out && npm run build > /tmp/phase1-default.log 2>&1 && grep -E "siteUrl = https://khangthinhinv\.vn" out/index.html && echo 'NEXT_PUBLIC_SITE_URL=https://test.example.com' > .env.local && rm -rf .next out && npm run build > /tmp/phase1-override.log 2>&1 && grep -E "siteUrl = https://test\.example\.com" out/index.html && ! grep -E "siteUrl = https://khangthinhinv\.vn" out/index.html && rm -f .env.local && rm -rf .next out && npm run build > /tmp/phase1-final.log 2>&1 && test -f out/index.html && ! grep -i "metadatabase" /tmp/phase1-final.log && test ! -d src/app/dich-vu && test ! -d src/app/lien-he && test ! -f src/components/Header.tsx && npx tsc --noEmit && echo "OK: Phase 1 exit gate PASSED"</automated>
  </verify>
  <done>
- Build with no `.env.local` → `out/index.html` contains `siteUrl = https://khangthinhinv.vn` (default fallback)
- Build with `NEXT_PUBLIC_SITE_URL=https://test.example.com` in `.env.local` → `out/index.html` contains `siteUrl = https://test.example.com` AND does NOT contain the default
- After cleanup (`.env.local` removed), final clean build returns to default
- `npx tsc --noEmit` exits 0 (whole `src/` type-checks clean)
- No `metadataBase` warning in any of the three build logs
- All 7 FND requirements pass the master checklist grep-by-grep
- Repository left in known-good state (no leftover `.env.local`, no leftover `.next`/`out` is fine — they're git-ignored)
  </done>
</task>

</tasks>

<verification>
**Phase 1 Success Criteria — completion map:**

| Criterion | Plan 01 | Plan 02 | Status |
|-----------|---------|---------|--------|
| #1: `npm run build` produces `/out/` with static HTML | Task 4 (build) | Task 5 (re-verified after cleanup) | ✓ |
| #2: Burgundy/Bone utilities render | Task 2/3/4 | Task 3 (sentinel exercises all 8) | ✓ |
| #3: Vietnamese diacritics across weights 400-900 | Task 3/4 | Task 3 (6-weight stress test) + Task 5 visual | ✓ |
| #4: `NEXT_PUBLIC_SITE_URL` propagates from `lib/site.ts`; phone/Zalo/email importable | — | Tasks 1, 2, 3, 5 | ✓ |
| #5: Skeleton folders deleted; build still passes | — | Task 4 + Task 5 | ✓ |

**Requirement coverage (this plan):**
- FND-05 → Task 1 (lib/site.ts siteUrl), Task 2 (metadataBase wiring), Task 5 (propagation proof)
- FND-06 → Task 1 (lib/site.ts company facts), Task 3 (page.tsx consumer)
- FND-07 → Task 4 (skeleton deletion) + Task 5 (post-deletion build verification)

**Atomic commits for clean rollback:**
- Commit 1: `feat(01): add lib/site.ts + .env.example + verify .gitignore` (Task 1)
- Commit 2: `feat(01): wire metadataBase from lib/site.ts siteUrl` (Task 2)
- Commit 3: `chore(01): replace page.tsx skeleton with phase-1 sentinel` (Task 3)
- Commit 4: `chore(01): delete skeleton folders (dich-vu, lien-he, Header, Footer)` (Task 4)
- Commit 5: (verification only — no commit) OR `chore(01): phase 1 verification gate` if a SUMMARY.md is added
</verification>

<success_criteria>
- [ ] `src/lib/site.ts` exists with `siteUrl`, `company`, helpers, and `Company` type — every constant matches RESEARCH.md verbatim (E.164 phone, HTTPS Zalo, MST without spaces, full address, ĐDPL)
- [ ] `.env.example` exists and documents `NEXT_PUBLIC_SITE_URL` contract
- [ ] `.gitignore` covers `.env.local`, `/.next/`, `/out/`, `node_modules/`
- [ ] `src/app/layout.tsx` imports `siteUrl` from `@/lib/site` and sets `metadataBase: new URL(siteUrl)`
- [ ] `src/app/page.tsx` is now the Phase-1 sentinel (no Header/Footer imports; exercises all palette utilities; shows env-var readout)
- [ ] `src/app/dich-vu/`, `src/app/lien-he/`, `src/components/Header.tsx`, `src/components/Footer.tsx` are DELETED
- [ ] Clean `npm run build` succeeds with NO `metadataBase` warning, NO `Module not found` errors
- [ ] Env var override proven: setting `NEXT_PUBLIC_SITE_URL=https://test.example.com` in `.env.local` makes the next build emit `siteUrl = https://test.example.com` in `out/index.html`
- [ ] `npx tsc --noEmit` passes clean across the entire `src/` tree
- [ ] Five atomic commits (Tasks 1-4 + optional Task 5 summary) for granular rollback
</success_criteria>

<output>
After completion, create `.planning/phases/01-foundation-lock-in/01-02-SUMMARY.md` capturing:
- Files created (`src/lib/site.ts`, `.env.example`)
- Files modified (`src/app/layout.tsx`, `src/app/page.tsx`, `.gitignore` if updated)
- Files deleted (`src/app/dich-vu/*`, `src/app/lien-he/*`, `src/components/Header.tsx`, `src/components/Footer.tsx`)
- Build artifacts verified (`out/index.html` exists; `out/_next/static/css/*` has palette utilities)
- Phase 1 master checklist results (all 7 FND requirements pass)
- **Critical handoff to Phase 2:** The Phase-1 sentinel in `src/app/page.tsx` MUST be removed when Phase 3 composes the real sections. Phase 2 (Nav/Footer/FloatingZalo) should leave `page.tsx` alone; only Phase 3 replaces it.
- Open notes for Phase 2: `lib/site.ts` is ready to consume; Tailwind utilities (`bg-burgundy`, `text-bone`, etc.) are confirmed working; font wiring complete; metadataBase resolved.
</output>
