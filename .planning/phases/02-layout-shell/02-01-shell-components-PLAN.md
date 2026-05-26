---
phase: 02-layout-shell
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/layout/Nav.tsx
  - src/components/layout/Footer.tsx
  - src/components/layout/FloatingZalo.tsx
  - src/app/layout.tsx
  - src/app/page.tsx
  - src/app/globals.css
autonomous: true
requirements:
  - SHELL-01
  - SHELL-02
  - SHELL-03
  - SHELL-04
  - SHELL-05

must_haves:
  truths:
    - "Nav renders sticky at top on every route with text wordmark 'KHANG THỊNH INV' + 5 Vietnamese anchor links + 'Báo giá' burgundy CTA"
    - "Desktop (≥768px) shows hotline 092 198 55 99 inline in Nav; mobile (<768px) shows hamburger that toggles a slide-down menu containing the 5 anchors + hotline + CTA"
    - "Footer renders below all content in 3-col desktop / 1-col mobile layout with Company info (MST 1102 107 064, ĐDPL Tô Thị Bích Ngọc, full address) sourced from lib/site.ts, Quick links (5 anchors + /du-an), and 3 Contact CTAs"
    - "FloatingZalo button is fixed bottom-right on every page, 56×56px, burgundy bg, bone-colored Lucide MessageCircle icon, deep-links to https://zalo.me/0921985599 with aria-label='Chat Zalo với Khang Thịnh'"
    - "Clicking any nav anchor smooth-scrolls to its target section placeholder; sticky nav does NOT cover the section heading (scroll-margin-top: 4.5rem applied)"
    - "Root layout.tsx renders <Nav />, {children}, <Footer />, <FloatingZalo /> in that order around the page tree with lang='vi' and existing metadata preserved"
  artifacts:
    - path: "src/components/layout/Nav.tsx"
      provides: "Sticky Nav component (server component) with wordmark, 5 anchor links, hotline (desktop), CTA, hamburger toggle for mobile menu"
      contains: "KHANG THỊNH INV"
    - path: "src/components/layout/Footer.tsx"
      provides: "Server-rendered Footer with legal info (MST, ĐDPL, address), quick links, contact CTAs, copyright"
      contains: "© 2025 KHANG THỊNH INV. All rights reserved."
    - path: "src/components/layout/FloatingZalo.tsx"
      provides: "Fixed bottom-right Zalo CTA button"
      contains: "aria-label=\"Chat Zalo với Khang Thịnh\""
    - path: "src/app/layout.tsx"
      provides: "Root layout wiring Nav + children + Footer + FloatingZalo"
      contains: "<Nav />"
    - path: "src/app/page.tsx"
      provides: "5 anchor placeholder sections (#dich-vu, #du-an, #nang-luc, #doi-tac, #lien-he) so smooth-scroll can be verified end-to-end"
      contains: "id=\"lien-he\""
    - path: "src/app/globals.css"
      provides: "scroll-margin-top rule on section[id] (4.5rem) so sticky nav does not cover anchor targets"
      contains: "scroll-margin-top"
  key_links:
    - from: "src/components/layout/Nav.tsx"
      to: "src/lib/site.ts"
      via: "import { company, telHref } from '@/lib/site'"
      pattern: "from ['\"]@/lib/site['\"]"
    - from: "src/components/layout/Footer.tsx"
      to: "src/lib/site.ts"
      via: "import { company, telHref, mailtoHref, zaloHref } from '@/lib/site'"
      pattern: "from ['\"]@/lib/site['\"]"
    - from: "src/components/layout/FloatingZalo.tsx"
      to: "src/lib/site.ts"
      via: "import { zaloHref } from '@/lib/site'"
      pattern: "zaloHref"
    - from: "src/app/layout.tsx"
      to: "src/components/layout/Nav.tsx"
      via: "import Nav from '@/components/layout/Nav'"
      pattern: "<Nav />"
    - from: "src/app/page.tsx"
      to: "5 anchor section placeholders"
      via: "<section id=\"dich-vu|du-an|nang-luc|doi-tac|lien-he\">"
      pattern: "id=\"(dich-vu|du-an|nang-luc|doi-tac|lien-he)\""
---

<objective>
Build the persistent shell (Nav + Footer + FloatingZalo) and wire it into the root layout so every route renders the sticky nav, footer legal block, and floating Zalo CTA. Add 5 Vietnamese anchor placeholder sections in `app/page.tsx` so the nav's smooth-scroll behavior (SHELL-04) can be verified end-to-end. All shell components MUST source company data from `src/lib/site.ts` — no hardcoded company info anywhere.

Purpose: Phase 2 of the roadmap — shell-before-sections so Phase 3 sections render inside a live layout, and the critical tel/Zalo CTAs surface immediately for Phase 2 Plan 02 smoke testing.

Output:
- `src/components/layout/Nav.tsx` (client component — uses `useState` for mobile menu + ESC-to-close hook)
- `src/components/layout/Footer.tsx` (server component)
- `src/components/layout/FloatingZalo.tsx` (server component — pure anchor)
- `src/app/layout.tsx` extended to render Nav + children + Footer + FloatingZalo
- `src/app/page.tsx` rewritten with 5 anchor placeholder sections (sentinel content preserved inside `#nang-luc` or similar as a debug aid)
- `src/app/globals.css` extended with `section[id] { scroll-margin-top: 4.5rem; }`
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/REQUIREMENTS.md
@.planning/phases/02-layout-shell/02-CONTEXT.md
@.planning/phases/01-foundation-lock-in/01-01-config-tokens-fonts-SUMMARY.md
@.planning/phases/01-foundation-lock-in/01-02-site-constants-cleanup-SUMMARY.md
@.planning/research/PITFALLS.md
@src/lib/site.ts
@src/app/layout.tsx
@src/app/page.tsx
@src/app/globals.css

<interfaces>
<!-- Key exports the executor will consume from lib/site.ts (already shipped in Phase 1). -->
<!-- DO NOT re-derive from CLAUDE.md — lib/site.ts is the single source of truth. -->

From src/lib/site.ts:
```typescript
export const siteUrl: string

export const company: {
  legalName: 'Công ty TNHH Khang Thịnh Investment'
  shortName: 'KHANG THỊNH INV'
  tagline: 'Hợp tác cùng phát triển'
  founded: 2025
  phoneDisplay: '092 198 55 99'
  phoneE164: '+84921985599'
  phoneRaw: '0921985599'
  email: 'khangthinhinv2025@gmail.com'
  zaloUrl: 'https://zalo.me/0921985599'
  taxId: '1102107064'
  taxIdDisplay: '1102 107 064'
  legalRep: 'Tô Thị Bích Ngọc'
  address: {
    street: 'A3-02 KDC Long Phú'
    locality: 'xã Bến Lức'
    region: 'Tây Ninh'
    country: 'VN'
    full: 'A3-02 KDC Long Phú, xã Bến Lức, tỉnh Tây Ninh'
  }
} as const

export const telHref: () => string      // returns "tel:+84921985599"
export const mailtoHref: () => string   // returns "mailto:khangthinhinv2025@gmail.com"
export const zaloHref: () => string     // returns "https://zalo.me/0921985599"

export type Company = typeof company
```

From src/app/globals.css (Phase 1 — already in @theme):
- `bg-burgundy` (#6B1F1F), `bg-burgundy-dark` (#4A1414)
- `bg-bone` (#F5F1EA), `bg-bone-dark` (#EBE4D6)
- `bg-espresso` (#1A1410), `bg-taupe` (#8B7355)
- `bg-terracotta` (#B85450), `bg-coffee` (#3A1F1A)
- `text-*`, `border-*`, `ring-*` variants of all 8 palette colors
- `font-sans` (resolves to Be Vietnam Pro across weights 400/500/600/700/800/900)
- Body already has `bg-bone`, `text-espresso` set via base styles.

From lucide-react (already in package.json — verify before importing):
```typescript
import { Menu, X, Phone, Mail, MessageCircle, MapPin } from 'lucide-react'
```
</interfaces>

<canonical_decisions>
<!-- 22 locked decisions from 02-CONTEXT.md — non-negotiable. -->
- D-01: Logo = text wordmark "KHANG THỊNH INV", font-black uppercase burgundy. NO image asset.
- D-02: Mobile menu (<768px) = slide-down accordion below nav. Use useState (not CSS-only peer-checked) to support ESC-to-close + auto-close on link click for a11y.
- D-03: Hotline visibility = desktop visible in nav bar, mobile only inside expanded menu.
- D-04: CTA "Báo giá" = solid burgundy button — `bg-burgundy text-bone px-5 py-3 rounded-sm`, hover `bg-burgundy-dark`.
- D-05: Anchor slugs = Vietnamese: #dich-vu, #du-an, #nang-luc, #doi-tac, #lien-he.
- D-06: Anchor labels (in order): "Dịch vụ" → "Dự án" → "Năng lực" → "Đối tác" → "Liên hệ".
- D-07: "Báo giá" CTA target = #lien-he.
- D-08: Active section highlight = NOT implemented in Phase 2 (hover only).
- D-09: Footer 3-col desktop / 1-col mobile: Col 1 = Company info, Col 2 = Quick links, Col 3 = Contact CTAs.
- D-10: Footer quick links = same 5 anchors as Nav + `/du-an` route link (6 total).
- D-11: Copyright = "© 2025 KHANG THỊNH INV. All rights reserved." (fixed year 2025).
- D-12: NO social/external links.
- D-13: FloatingZalo icon = Lucide MessageCircle (inline SVG via lucide-react).
- D-14: FloatingZalo colors = `bg-burgundy text-bone`.
- D-15: FloatingZalo = icon-only, 56×56px round, `aria-label="Chat Zalo với Khang Thịnh"`.
- D-16: FloatingZalo animation = static — hover scale 1.05 + shadow lift, active scale 0.95. NO pulse/bounce.
- D-17: Phone link = `tel:+84921985599` (E.164, no spaces) via `telHref()`.
- D-18: Zalo URL = `https://zalo.me/0921985599` (HTTPS only) via `zaloHref()`.
- D-19: Email link = `mailto:khangthinhinv2025@gmail.com` via `mailtoHref()` + plain-text email displayed next to link.
- D-20: `scroll-margin-top: 4.5rem` on `section[id]` (apply in globals.css).
- D-21: Tap targets — Nav buttons/links ≥44×44px, FloatingZalo ≥56×56px, hamburger ≥44×44px.
- D-22: ALL shell data sources MUST import from `src/lib/site.ts`. NO hardcoded company info.

Deferred (do NOT implement):
- Active section highlight on scroll (IntersectionObserver)
- Map embed in Footer
- Scroll-to-top button
- Page transitions
- Logo image (swap from text wordmark)
- Nav dropdown for sub-services
</canonical_decisions>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create Footer + FloatingZalo (server components, no client JS)</name>
  <files>src/components/layout/Footer.tsx, src/components/layout/FloatingZalo.tsx</files>
  <read_first>
    - src/lib/site.ts (consume `company`, `telHref`, `mailtoHref`, `zaloHref`)
    - src/app/globals.css (confirm palette utilities available)
    - .planning/phases/02-layout-shell/02-CONTEXT.md §decisions D-09 through D-19 (Footer + FloatingZalo specs)
    - .planning/research/PITFALLS.md lines 235-270 (tel:/Zalo CTA rules)
    - package.json (confirm `lucide-react` is installed; if missing, install via `npm install lucide-react` — it's in the CLAUDE.md recommended stack)
  </read_first>
  <action>
Create `src/components/layout/Footer.tsx` and `src/components/layout/FloatingZalo.tsx` as **server components** (no `'use client'` directive). Both consume `lib/site.ts`. Implement per D-09..D-19.

**A) `src/components/layout/Footer.tsx`** — copy/adapt this skeleton (Tailwind classes per Phase 1 tokens, structure per D-09/D-10/D-11):

```tsx
// Server component — renders at build time. NO client JS.
// Per D-09: 3-col desktop / 1-col mobile.
// Per D-22: All company data MUST import from @/lib/site.
import Link from 'next/link'
import { Phone, Mail, MessageCircle, MapPin } from 'lucide-react'
import { company, telHref, mailtoHref, zaloHref } from '@/lib/site'

const navAnchors = [
  { href: '#dich-vu',  label: 'Dịch vụ' },
  { href: '#du-an',    label: 'Dự án' },
  { href: '#nang-luc', label: 'Năng lực' },
  { href: '#doi-tac',  label: 'Đối tác' },
  { href: '#lien-he',  label: 'Liên hệ' },
] as const

export default function Footer() {
  return (
    <footer className="bg-espresso text-bone mt-24">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Col 1: Company info (legal block) — per D-09 */}
        <div className="space-y-3">
          <p className="font-black uppercase tracking-wide text-xl text-bone">
            {company.shortName}
          </p>
          <p className="italic text-bone-dark text-sm">&quot;{company.tagline}&quot;</p>
          <dl className="text-sm space-y-1 mt-4">
            <div className="flex gap-2">
              <dt className="text-taupe min-w-[3.5rem]">Tên:</dt>
              <dd>{company.legalName}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-taupe min-w-[3.5rem]">MST:</dt>
              <dd>{company.taxIdDisplay}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-taupe min-w-[3.5rem]">ĐDPL:</dt>
              <dd>{company.legalRep}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-taupe min-w-[3.5rem]"><MapPin className="w-4 h-4 inline" aria-hidden="true" /></dt>
              <dd>{company.address.full}</dd>
            </div>
          </dl>
        </div>

        {/* Col 2: Quick links — per D-10 */}
        <nav aria-label="Liên kết nhanh" className="space-y-3">
          <p className="font-bold uppercase tracking-wide text-sm text-taupe">Liên kết</p>
          <ul className="space-y-2 text-sm">
            {navAnchors.map((a) => (
              <li key={a.href}>
                <a href={a.href} className="inline-block min-h-[44px] py-2 hover:text-terracotta">
                  {a.label}
                </a>
              </li>
            ))}
            <li>
              <Link href="/du-an" className="inline-block min-h-[44px] py-2 hover:text-terracotta">
                Tất cả dự án
              </Link>
            </li>
          </ul>
        </nav>

        {/* Col 3: Contact — per D-09 (3 CTAs) + D-19 (plain-text email fallback next to mailto) */}
        <div className="space-y-3">
          <p className="font-bold uppercase tracking-wide text-sm text-taupe">Liên hệ</p>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href={telHref()}
                className="inline-flex items-center gap-2 min-h-[44px] py-2 hover:text-terracotta"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                <span>{company.phoneDisplay}</span>
              </a>
            </li>
            <li>
              <a
                href={zaloHref()}
                rel="noopener"
                className="inline-flex items-center gap-2 min-h-[44px] py-2 hover:text-terracotta"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>Zalo: {company.phoneDisplay}</span>
              </a>
            </li>
            <li>
              <a
                href={mailtoHref()}
                className="inline-flex items-center gap-2 min-h-[44px] py-2 hover:text-terracotta"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                <span>{company.email}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright bar — per D-11 (fixed year 2025) */}
      <div className="border-t border-bone-dark/10">
        <p className="max-w-6xl mx-auto px-4 py-4 text-xs text-taupe text-center">
          © 2025 KHANG THỊNH INV. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
```

**B) `src/components/layout/FloatingZalo.tsx`** — copy/adapt this skeleton (per D-13..D-16, D-21):

```tsx
// Server component — pure <a> tag, no client JS.
// Per D-13: Lucide MessageCircle icon (NOT official Zalo logo — legal-safe).
// Per D-14/D-15: bg-burgundy text-bone, icon-only, 56×56px round.
// Per D-16: static — hover:scale-105 + shadow-lg, active:scale-95. NO pulse/bounce.
// Per D-18: HTTPS-only zalo.me URL via zaloHref().
import { MessageCircle } from 'lucide-react'
import { zaloHref } from '@/lib/site'

export default function FloatingZalo() {
  return (
    <a
      href={zaloHref()}
      rel="noopener"
      aria-label="Chat Zalo với Khang Thịnh"
      className="
        fixed bottom-4 right-4 z-50
        w-14 h-14 rounded-full
        bg-burgundy text-bone
        flex items-center justify-center
        shadow-md
        transition-transform duration-150
        hover:scale-105 hover:shadow-lg
        active:scale-95
        motion-reduce:transition-none motion-reduce:hover:scale-100
      "
    >
      <MessageCircle className="w-7 h-7" aria-hidden="true" />
    </a>
  )
}
```

Notes:
- `w-14 h-14` = 56px × 56px (matches D-15 tap target).
- `motion-reduce:` variants honor `prefers-reduced-motion: reduce` (CLAUDE.md discretion item — recommended, non-blocking).
- No `target="_blank"` per PITFALLS.md (in-app browsers can break it; HTTPS zalo.me handles routing).

Create `src/components/layout/` directory if it does not exist.
  </action>
  <verify>
    <automated>
      mkdir -p src/components/layout &amp;&amp;
      test -f src/components/layout/Footer.tsx &amp;&amp;
      test -f src/components/layout/FloatingZalo.tsx &amp;&amp;
      grep -q "from '@/lib/site'" src/components/layout/Footer.tsx &amp;&amp;
      grep -q "from '@/lib/site'" src/components/layout/FloatingZalo.tsx &amp;&amp;
      grep -q "© 2025 KHANG THỊNH INV. All rights reserved." src/components/layout/Footer.tsx &amp;&amp;
      grep -q 'aria-label="Chat Zalo với Khang Thịnh"' src/components/layout/FloatingZalo.tsx &amp;&amp;
      grep -q "MessageCircle" src/components/layout/FloatingZalo.tsx &amp;&amp;
      grep -q "w-14 h-14" src/components/layout/FloatingZalo.tsx &amp;&amp;
      ! grep -q "'use client'" src/components/layout/Footer.tsx &amp;&amp;
      ! grep -q "'use client'" src/components/layout/FloatingZalo.tsx
    </automated>
  </verify>
  <acceptance_criteria>
    - File `src/components/layout/Footer.tsx` exists.
    - File `src/components/layout/FloatingZalo.tsx` exists.
    - `Footer.tsx` contains `from '@/lib/site'` (imports from lib/site).
    - `Footer.tsx` contains literal string `© 2025 KHANG THỊNH INV. All rights reserved.`
    - `Footer.tsx` contains `{company.taxIdDisplay}` (MST sourced from lib/site, not hardcoded).
    - `Footer.tsx` contains `{company.legalRep}` (ĐDPL sourced from lib/site).
    - `Footer.tsx` contains `{company.address.full}` (address sourced from lib/site).
    - `Footer.tsx` contains `telHref()`, `mailtoHref()`, `zaloHref()` calls.
    - `Footer.tsx` contains all 5 Vietnamese anchor labels: "Dịch vụ", "Dự án", "Năng lực", "Đối tác", "Liên hệ".
    - `Footer.tsx` contains a link to `/du-an`.
    - `Footer.tsx` contains `md:grid-cols-3` (3-col desktop layout class).
    - `Footer.tsx` does NOT contain `'use client'` (must be a server component).
    - `FloatingZalo.tsx` contains literal `aria-label="Chat Zalo với Khang Thịnh"`.
    - `FloatingZalo.tsx` contains `MessageCircle` (Lucide icon import + usage).
    - `FloatingZalo.tsx` contains `w-14 h-14` (56×56px).
    - `FloatingZalo.tsx` contains `bg-burgundy` and `text-bone`.
    - `FloatingZalo.tsx` contains `fixed bottom-4 right-4`.
    - `FloatingZalo.tsx` contains `zaloHref()` (no hardcoded URL).
    - `FloatingZalo.tsx` does NOT contain `'use client'`.
    - `FloatingZalo.tsx` does NOT contain `zalo://` (PITFALLS #7).
    - `FloatingZalo.tsx` does NOT contain hardcoded `092 198 55 99` or `+84921985599` or `0921985599`.
  </acceptance_criteria>
  <done>
    Footer and FloatingZalo components exist as server components, source all company data from `@/lib/site`, comply with D-09..D-19 visual spec, and pass grep acceptance criteria.
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Create Nav (client component) with mobile-menu state + ESC/auto-close</name>
  <files>src/components/layout/Nav.tsx</files>
  <read_first>
    - src/lib/site.ts (consume `company.shortName`, `company.phoneDisplay`, `telHref`)
    - src/components/layout/Footer.tsx (mirror the same `navAnchors` array shape — DO NOT duplicate constant; declare locally with same 5 entries)
    - .planning/phases/02-layout-shell/02-CONTEXT.md §decisions D-01..D-08, D-21, D-22 (Nav specs)
    - .planning/research/PITFALLS.md lines 449-458 (sticky nav + tap target rules)
  </read_first>
  <action>
Create `src/components/layout/Nav.tsx` as a **client component** (D-02 chose useState over CSS-only for a11y — ESC to close, auto-close on link click, focus handling). Implement per D-01..D-08, D-21.

```tsx
'use client'

// Per D-02: Mobile menu uses useState (NOT CSS-only) so we can:
//   - close on ESC key
//   - close on link click
//   - manage aria-expanded for screen readers
// Per D-08: Active section highlight NOT implemented in Phase 2 — hover only.
// Per D-22: All company data MUST import from @/lib/site.
import { useEffect, useState } from 'react'
import { Menu, X, Phone } from 'lucide-react'
import { company, telHref } from '@/lib/site'

const navAnchors = [
  { href: '#dich-vu',  label: 'Dịch vụ' },
  { href: '#du-an',    label: 'Dự án' },
  { href: '#nang-luc', label: 'Năng lực' },
  { href: '#doi-tac',  label: 'Đối tác' },
  { href: '#lien-he',  label: 'Liên hệ' },
] as const

export default function Nav() {
  const [open, setOpen] = useState(false)

  // ESC to close (a11y)
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const closeMenu = () => setOpen(false)

  return (
    <header className="sticky top-0 z-40 bg-bone/95 backdrop-blur border-b border-bone-dark">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Wordmark — per D-01 (text-only, font-black uppercase burgundy) */}
        <a
          href="#"
          aria-label={`${company.shortName} — Trang chủ`}
          className="font-black uppercase tracking-wide text-burgundy text-lg md:text-xl whitespace-nowrap"
        >
          {company.shortName}
        </a>

        {/* Desktop nav — anchors + hotline + CTA. Hidden under 768px. */}
        <nav aria-label="Điều hướng chính" className="hidden md:flex items-center gap-1">
          {navAnchors.map((a) => (
            <a
              key={a.href}
              href={a.href}
              className="inline-flex items-center min-h-[44px] px-3 text-sm font-medium text-espresso hover:text-burgundy"
            >
              {a.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {/* Hotline — per D-03 desktop visible */}
          <a
            href={telHref()}
            className="inline-flex items-center gap-2 min-h-[44px] px-3 text-sm font-semibold text-burgundy hover:text-burgundy-dark"
          >
            <Phone className="w-4 h-4" aria-hidden="true" />
            <span>{company.phoneDisplay}</span>
          </a>
          {/* "Báo giá" CTA — per D-04 solid burgundy, per D-07 target #lien-he */}
          <a
            href="#lien-he"
            className="inline-flex items-center min-h-[44px] bg-burgundy text-bone px-5 py-3 rounded-sm text-sm font-bold uppercase tracking-wide hover:bg-burgundy-dark"
          >
            Báo giá
          </a>
        </div>

        {/* Hamburger — mobile only (<768px). Per D-21 tap target ≥44×44px. */}
        <button
          type="button"
          aria-label={open ? 'Đóng menu' : 'Mở menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center w-11 h-11 text-burgundy"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu — slide-down accordion per D-02. */}
      {/* Contains 5 anchors + hotline + CTA per D-03 (mobile hotline only in menu). */}
      {open && (
        <div id="mobile-menu" className="md:hidden border-t border-bone-dark bg-bone">
          <nav aria-label="Điều hướng (mobile)" className="max-w-6xl mx-auto px-4 py-3 flex flex-col">
            {navAnchors.map((a) => (
              <a
                key={a.href}
                href={a.href}
                onClick={closeMenu}
                className="min-h-[44px] flex items-center text-base font-medium text-espresso hover:text-burgundy border-b border-bone-dark/50"
              >
                {a.label}
              </a>
            ))}
            <a
              href={telHref()}
              onClick={closeMenu}
              className="min-h-[44px] flex items-center gap-2 text-base font-semibold text-burgundy border-b border-bone-dark/50"
            >
              <Phone className="w-5 h-5" aria-hidden="true" />
              <span>{company.phoneDisplay}</span>
            </a>
            <a
              href="#lien-he"
              onClick={closeMenu}
              className="mt-3 inline-flex items-center justify-center min-h-[44px] bg-burgundy text-bone px-5 py-3 rounded-sm text-sm font-bold uppercase tracking-wide hover:bg-burgundy-dark"
            >
              Báo giá
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
```

Notes:
- `sticky top-0 z-40` makes nav sticky (SHELL-01).
- `min-h-[44px]` on every interactive element satisfies D-21 / PITFALLS tap-target rule.
- `aria-expanded`, `aria-controls`, `aria-label` for screen reader support.
- Hotline NOT shown in desktop nav under md breakpoint AND in mobile menu (D-03).
- All anchors close the mobile menu on click (a11y nicety).
- No IntersectionObserver — D-08 deferred.
  </action>
  <verify>
    <automated>
      test -f src/components/layout/Nav.tsx &amp;&amp;
      grep -q "'use client'" src/components/layout/Nav.tsx &amp;&amp;
      grep -q "from '@/lib/site'" src/components/layout/Nav.tsx &amp;&amp;
      grep -q "sticky top-0" src/components/layout/Nav.tsx &amp;&amp;
      grep -q "company.shortName" src/components/layout/Nav.tsx &amp;&amp;
      grep -q "telHref()" src/components/layout/Nav.tsx &amp;&amp;
      grep -q "Báo giá" src/components/layout/Nav.tsx &amp;&amp;
      grep -q "#dich-vu" src/components/layout/Nav.tsx &amp;&amp;
      grep -q "#du-an" src/components/layout/Nav.tsx &amp;&amp;
      grep -q "#nang-luc" src/components/layout/Nav.tsx &amp;&amp;
      grep -q "#doi-tac" src/components/layout/Nav.tsx &amp;&amp;
      grep -q "#lien-he" src/components/layout/Nav.tsx &amp;&amp;
      grep -q "aria-expanded" src/components/layout/Nav.tsx &amp;&amp;
      grep -q "Escape" src/components/layout/Nav.tsx
    </automated>
  </verify>
  <acceptance_criteria>
    - File `src/components/layout/Nav.tsx` exists.
    - First non-comment line is `'use client'` directive.
    - Contains `import { useEffect, useState } from 'react'` (or similar React hook imports).
    - Contains `from '@/lib/site'` (sources data from lib/site).
    - Contains `sticky top-0` Tailwind class (SHELL-01 sticky nav).
    - Contains `{company.shortName}` (wordmark from lib/site, not hardcoded).
    - Contains `telHref()` call (hotline href from helper, not hardcoded).
    - Contains literal text `Báo giá` (CTA label).
    - Contains `href="#lien-he"` (CTA target per D-07).
    - Contains all 5 Vietnamese anchor labels: "Dịch vụ", "Dự án", "Năng lực", "Đối tác", "Liên hệ".
    - Contains all 5 Vietnamese anchor slugs: `#dich-vu`, `#du-an`, `#nang-luc`, `#doi-tac`, `#lien-he`.
    - Contains `aria-expanded` (a11y attr for mobile menu toggle).
    - Contains `Escape` (ESC key handler).
    - Contains `min-h-[44px]` (tap target).
    - Contains `Menu` and `X` icon imports from `lucide-react`.
    - Contains `md:hidden` and `hidden md:flex` (responsive show/hide).
    - Does NOT contain hardcoded `092 198 55 99` or `+84921985599` in the JSX/href (must come from helpers).
  </acceptance_criteria>
  <done>
    Nav component renders sticky on desktop with wordmark + 5 anchors + hotline + CTA, and on mobile collapses to a hamburger that toggles a slide-down menu containing the same items. All data sourced from `@/lib/site`. ESC closes menu, clicking link closes menu, aria-expanded reflects state.
  </done>
</task>

<task type="auto">
  <name>Task 3: Wire shell into root layout, add 5 anchor placeholder sections in page.tsx, add scroll-margin-top in globals.css, verify build</name>
  <files>src/app/layout.tsx, src/app/page.tsx, src/app/globals.css</files>
  <read_first>
    - src/app/layout.tsx (current root layout — must extend, NOT overwrite font/metadata wiring from Phase 1)
    - src/app/page.tsx (current Phase 1 sentinel — replace contents with 5 anchor placeholders; sentinel content can be preserved inside one placeholder section as debug aid OR removed)
    - src/app/globals.css (must add scroll-margin-top rule without touching @theme blocks)
    - src/components/layout/Nav.tsx, Footer.tsx, FloatingZalo.tsx (the components being wired)
    - .planning/phases/02-layout-shell/02-CONTEXT.md §decisions D-05, D-06, D-20 + §open_questions q3 (anchor placeholders YES per recommendation)
  </read_first>
  <action>
**A) Update `src/app/layout.tsx`** — render Nav, children, Footer, FloatingZalo. Preserve existing font + metadata + viewport exports VERBATIM. Only modify the JSX inside `<body>`.

Concrete diff (apply this exactly):

```tsx
// (top imports unchanged — keep Be_Vietnam_Pro, siteUrl, globals.css imports)
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import FloatingZalo from '@/components/layout/FloatingZalo'

// ... (beVietnamPro, metadata, viewport exports unchanged) ...

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <body className="font-sans antialiased">
        <Nav />
        {children}
        <Footer />
        <FloatingZalo />
      </body>
    </html>
  )
}
```

DO NOT touch the `metadata` or `viewport` exports — Phase 1 already set them correctly. SHELL-05 (root layout default metadata) is satisfied by the existing Phase 1 wiring; we are only adding the shell components.

**B) Rewrite `src/app/page.tsx`** — replace the current Phase 1 sentinel JSX with 5 anchor placeholder sections. Each section has `id` matching D-05, an `<h2>` with the D-06 label, and visible placeholder copy so the executor + user can confirm smooth-scroll works end-to-end. Keep the Phase 1 sentinel content inside `#nang-luc` as a "debug card" (removable in Phase 3).

```tsx
// Phase 2 — anchor placeholder sections wired to Nav anchors (D-05/D-06).
// Each section will be replaced by the real Phase 3 component:
//   #dich-vu  → Services        (SEC-03)
//   #du-an    → Projects        (SEC-04)
//   #nang-luc → Capabilities    (SEC-06)
//   #doi-tac  → PartnersMarquee (SEC-02)
//   #lien-he  → Contact         (SEC-08)
// Phase 1 sentinel content is preserved inside #nang-luc as a debug card —
// safe to delete in Phase 3.
import { company, siteUrl, telHref, zaloHref, mailtoHref } from '@/lib/site'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Top hero placeholder so sticky nav has something to scroll past */}
      <section className="bg-bone px-4 py-24 text-center">
        <p className="text-sm uppercase tracking-widest text-taupe">
          Phase 2 — Layout Shell · Anchor Placeholders
        </p>
        <h1 className="font-black uppercase tracking-wide text-4xl md:text-5xl text-burgundy mt-3">
          {company.shortName}
        </h1>
        <p className="italic text-burgundy-dark mt-2">&quot;{company.tagline}&quot;</p>
      </section>

      <section id="dich-vu" className="bg-bone-dark px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-black uppercase tracking-wide text-3xl text-burgundy">Dịch vụ</h2>
          <p className="mt-3 text-espresso">Placeholder — Phase 3 sẽ render 3 cards Services (Cung ứng VLXD · Xây dựng dân dụng · Vận chuyển đường thủy).</p>
        </div>
      </section>

      <section id="du-an" className="bg-bone px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-black uppercase tracking-wide text-3xl text-burgundy">Dự án</h2>
          <p className="mt-3 text-espresso">Placeholder — Phase 3 sẽ render 4 dự án tiêu biểu (Cao tốc Cái Nước · Cầu Cửa Lớn · Hòn Khoai · Nhà phố).</p>
        </div>
      </section>

      <section id="nang-luc" className="bg-bone-dark px-4 py-20">
        <div className="max-w-6xl mx-auto space-y-8">
          <h2 className="font-black uppercase tracking-wide text-3xl text-burgundy">Năng lực</h2>
          <p className="text-espresso">Placeholder — Phase 3 sẽ render BigStats + Capabilities (đội tàu 700–3,900 tấn, cơ giới, đội xây lắp).</p>

          {/* Phase 1 sentinel debug card — DELETE in Phase 3 */}
          <details className="bg-espresso text-bone p-4 rounded-sm">
            <summary className="cursor-pointer font-mono text-sm">Phase 1 sentinel (debug — remove in Phase 3)</summary>
            <div className="mt-3 font-mono text-xs space-y-1">
              <p>siteUrl = {siteUrl}</p>
              <p>tel = {telHref()}</p>
              <p>zalo = {zaloHref()}</p>
              <p>mail = {mailtoHref()}</p>
              <p>mst = {company.taxIdDisplay}</p>
              <p>address = {company.address.full}</p>
            </div>
          </details>
        </div>
      </section>

      <section id="doi-tac" className="bg-bone px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-black uppercase tracking-wide text-3xl text-burgundy">Đối tác</h2>
          <p className="mt-3 text-espresso">Placeholder — Phase 3 sẽ render PartnersMarquee (BINH ĐOÀN 12 · TRƯỜNG SƠN · BỘ QUỐC PHÒNG · …).</p>
        </div>
      </section>

      <section id="lien-he" className="bg-bone-dark px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-black uppercase tracking-wide text-3xl text-burgundy">Liên hệ</h2>
          <p className="mt-3 text-espresso">Placeholder — Phase 3 sẽ render Contact section với 3 CTA (Gọi · Zalo · Email).</p>
        </div>
      </section>
    </main>
  )
}
```

Notes:
- 5 sections in the exact order: dich-vu → du-an → nang-luc → doi-tac → lien-he (matches D-05/D-06).
- Tall enough vertical padding (`py-20`) so smooth-scroll is visibly testable.
- Vietnamese copy used for all user-facing text (CLAUDE.md rule).
- Phase 1 sentinel content moved into a `<details>` block inside `#nang-luc` so the env-var/palette/font readout is still inspectable without dominating the page.

**C) Update `src/app/globals.css`** — add scroll-margin-top per D-20 + PITFALLS sticky-nav rule. APPEND below the existing `@media (prefers-reduced-motion: reduce)` block; do NOT touch `@theme` or `@theme inline` or `:root`.

```css
/* Sticky-nav anchor offset (PITFALLS + D-20).
   Nav is 4rem tall (h-16); 4.5rem gives a small breathing buffer
   so section <h2> is not flush against nav bottom. */
section[id] {
  scroll-margin-top: 4.5rem;
}
```

**D) Verification build** — after the above three edits, run:

```bash
npm run build
```

Build MUST exit 0. If `lucide-react` is not installed, `npm install lucide-react` first.

After successful build, `out/index.html` must contain the 5 anchor IDs and the wordmark text. The static export must still work (no Server Action / client-only failure).
  </action>
  <verify>
    <automated>
      grep -q "import Nav from '@/components/layout/Nav'" src/app/layout.tsx &amp;&amp;
      grep -q "import Footer from '@/components/layout/Footer'" src/app/layout.tsx &amp;&amp;
      grep -q "import FloatingZalo from '@/components/layout/FloatingZalo'" src/app/layout.tsx &amp;&amp;
      grep -q "<Nav />" src/app/layout.tsx &amp;&amp;
      grep -q "<Footer />" src/app/layout.tsx &amp;&amp;
      grep -q "<FloatingZalo />" src/app/layout.tsx &amp;&amp;
      grep -q "metadataBase: new URL(siteUrl)" src/app/layout.tsx &amp;&amp;
      grep -q 'id="dich-vu"' src/app/page.tsx &amp;&amp;
      grep -q 'id="du-an"' src/app/page.tsx &amp;&amp;
      grep -q 'id="nang-luc"' src/app/page.tsx &amp;&amp;
      grep -q 'id="doi-tac"' src/app/page.tsx &amp;&amp;
      grep -q 'id="lien-he"' src/app/page.tsx &amp;&amp;
      grep -q "scroll-margin-top" src/app/globals.css &amp;&amp;
      npm run build &amp;&amp;
      test -f out/index.html &amp;&amp;
      grep -q 'id="lien-he"' out/index.html &amp;&amp;
      grep -q "KHANG THỊNH INV" out/index.html
    </automated>
  </verify>
  <acceptance_criteria>
    - `src/app/layout.tsx` contains `import Nav from '@/components/layout/Nav'`.
    - `src/app/layout.tsx` contains `import Footer from '@/components/layout/Footer'`.
    - `src/app/layout.tsx` contains `import FloatingZalo from '@/components/layout/FloatingZalo'`.
    - `src/app/layout.tsx` contains `<Nav />`, `<Footer />`, `<FloatingZalo />`.
    - `src/app/layout.tsx` still contains `metadataBase: new URL(siteUrl)` (Phase 1 wiring preserved).
    - `src/app/layout.tsx` still contains `lang="vi"` and `Be_Vietnam_Pro` import (Phase 1 wiring preserved).
    - `src/app/page.tsx` contains all 5 section IDs: `id="dich-vu"`, `id="du-an"`, `id="nang-luc"`, `id="doi-tac"`, `id="lien-he"`.
    - `src/app/page.tsx` contains all 5 section labels: "Dịch vụ", "Dự án", "Năng lực", "Đối tác", "Liên hệ".
    - `src/app/globals.css` contains `scroll-margin-top` rule applying to `section[id]`.
    - `src/app/globals.css` still contains the `@theme {` block and `@theme inline {` block (Phase 1 wiring preserved).
    - `npm run build` exits 0.
    - `out/index.html` exists and contains `id="lien-he"`.
    - `out/index.html` contains `KHANG THỊNH INV` (wordmark rendered).
    - `out/index.html` contains `aria-label="Chat Zalo với Khang Thịnh"` (FloatingZalo rendered into static output).
    - `out/index.html` contains `© 2025 KHANG THỊNH INV. All rights reserved.` (Footer rendered into static output).
    - Build does NOT emit a `metadataBase` warning.
  </acceptance_criteria>
  <done>
    Root layout renders `<Nav /> {children} <Footer /> <FloatingZalo />`. Home page (`/`) renders 5 anchor placeholder sections matching Nav anchors in order. `globals.css` includes `section[id] { scroll-margin-top: 4.5rem; }`. `npm run build` exits 0 and `out/index.html` proves all three shell components statically rendered into the page tree.
  </done>
</task>

</tasks>

<verification>
After all 3 tasks complete, run these end-to-end checks:

```bash
# All shell files exist
test -f src/components/layout/Nav.tsx &&
test -f src/components/layout/Footer.tsx &&
test -f src/components/layout/FloatingZalo.tsx

# Static export contains all shell artifacts
npm run build
grep -q "KHANG THỊNH INV"                    out/index.html  # wordmark
grep -q "© 2025 KHANG THỊNH INV"             out/index.html  # footer copyright
grep -q 'aria-label="Chat Zalo với Khang Thịnh"' out/index.html  # FAB a11y
grep -q '+84921985599'                       out/index.html  # tel href present (NOT in zalo URL — verify position)
grep -q 'https://zalo.me/0921985599'         out/index.html  # zalo URL (HTTPS only — PITFALLS #7)
grep -q '1102 107 064'                       out/index.html  # MST display
grep -q 'Tô Thị Bích Ngọc'                   out/index.html  # ĐDPL
! grep -q 'zalo://'                          out/index.html  # PITFALLS — must NEVER appear

# /du-an still builds (Phase 1 left a stripped page)
test -f out/du-an/index.html
```

Manual visual confirmation (optional, not blocking — full real-device test is Plan 02-02):
- Visit `http://localhost:3000` (after `npm run dev`) — see sticky Nav at top with wordmark, 5 links, hotline, "Báo giá" button.
- Resize browser to <768px — Nav collapses to hamburger; tap hamburger → slide-down menu with 5 anchors + hotline + CTA appears.
- Click any anchor — page scrolls smoothly to that section, heading NOT covered by sticky nav.
- See Footer at bottom with 3 columns (desktop) / 1 column (mobile) and copyright bar.
- See FloatingZalo at bottom-right of every viewport.
- Press ESC while mobile menu open — menu closes.
</verification>

<success_criteria>
- [x] SHELL-01: Sticky Nav with text wordmark + 5 anchors + hotline (desktop) + "Báo giá" CTA + mobile hamburger menu — implemented in Nav.tsx, wired in layout.tsx.
- [x] SHELL-02: Footer with full legal info (MST, ĐDPL, address, phone, email) sourced from `lib/site.ts` — implemented in Footer.tsx.
- [x] SHELL-03: FloatingZalo button fixed bottom-right, 56×56px, burgundy bg, MessageCircle icon, `aria-label="Chat Zalo với Khang Thịnh"`, links to `https://zalo.me/0921985599` — implemented in FloatingZalo.tsx.
- [x] SHELL-04: Smooth-scroll anchors — 5 sections placeholders in page.tsx with `id="dich-vu|du-an|nang-luc|doi-tac|lien-he"`, `scroll-margin-top: 4.5rem` in globals.css, `html { scroll-behavior: smooth }` from Phase 1 already in place.
- [x] SHELL-05: Root `layout.tsx` declares default metadata (title template, description, OG image stub via metadataBase, viewport, `lang="vi"`) AND renders Nav/Footer/FloatingZalo around `{children}` — Phase 1 already set metadata/viewport/lang; this plan adds the shell wiring.
- [x] Build passes: `npm run build` exits 0, `out/index.html` contains wordmark + 5 anchor IDs + footer copyright + FloatingZalo aria-label.
- [x] No hardcoded company info in Nav/Footer/FloatingZalo — all consumed from `@/lib/site`.
- [x] No `zalo://` scheme anywhere — only `https://zalo.me/0921985599` (PITFALLS #7).
- [x] All tap targets ≥44×44px (Nav links/buttons via `min-h-[44px]`); FloatingZalo 56×56px via `w-14 h-14`.

Per ROADMAP Phase 2 SC1-SC6:
- SC1 (sticky nav with logo + 5 anchors + CTA + hotline): YES
- SC2 (Footer legal info from lib/site.ts): YES
- SC3 (FloatingZalo with aria-label + 56×56px): YES
- SC4 (anchors smooth-scroll with scroll-margin-top): YES — placeholders + CSS rule shipped
- SC5 (real-device smoke test): DEFERRED to Plan 02-02 (autonomous: false)
- SC6 (root layout metadata + shell wiring): YES
</success_criteria>

<output>
After completion, create `.planning/phases/02-layout-shell/02-01-shell-components-SUMMARY.md` per the standard summary template, documenting:
- Files created (3 component files in src/components/layout/)
- Files modified (src/app/layout.tsx, src/app/page.tsx, src/app/globals.css)
- requirements-completed: [SHELL-01, SHELL-02, SHELL-03, SHELL-04, SHELL-05]
- Decisions: Picked `useState` for Nav mobile menu (over CSS-only) for ESC + auto-close a11y (CONTEXT.md discretion).
- Decisions: Placed components at `src/components/layout/` (nested, per CONTEXT.md open_questions q1 recommendation — anticipates Phase 3 `src/components/sections/`).
- Known stubs: Phase 1 sentinel content moved into `#nang-luc` `<details>` debug card — to be deleted in Phase 3.
- Handoff to Plan 02-02: shell is built; real-device smoke test on iOS Safari + Android Chrome is next.
</output>
