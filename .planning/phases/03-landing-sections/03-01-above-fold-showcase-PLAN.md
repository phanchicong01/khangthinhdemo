---
phase: 03-landing-sections
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/sections/Hero.tsx
  - src/components/sections/PartnersMarquee.tsx
  - src/components/sections/Services.tsx
  - src/components/sections/Projects.tsx
  - src/app/globals.css
autonomous: true
requirements: [SEC-01, SEC-02, SEC-03, SEC-04]
must_haves:
  truths:
    - "Hero displays uppercase Vietnamese headline 'CÔNG TRÌNH BỀN VỮNG · ĐỐI TÁC TIN CẬY' on a CSS blueprint-grid background"
    - "Hero shows 2 working CTAs — 'Gọi 092 198 55 99' (tel:) and 'Báo giá' (#lien-he)"
    - "PartnersMarquee scrolls horizontally with CSS-only @keyframes and pauses for prefers-reduced-motion"
    - "PartnersMarquee text content includes 'BỘ QUỐC PHÒNG · BINH ĐOÀN 12 · TRƯỜNG SƠN · CÀ MAU'"
    - "Services renders 3 cards (VLXD / Xây dựng / Vận chuyển) each with a Lucide icon (Truck / HardHat / Ship)"
    - "Projects renders 4 named projects with named clients front-and-center and a CTA linking to /du-an"
  artifacts:
    - path: "src/components/sections/Hero.tsx"
      provides: "Hero section — server component, CSS blueprint pattern, 2 CTAs using telHref/href"
      contains: "CÔNG TRÌNH BỀN VỮNG · ĐỐI TÁC TIN CẬY"
    - path: "src/components/sections/PartnersMarquee.tsx"
      provides: "Marquee section — CSS-only translateX animation, prefers-reduced-motion guard"
      contains: "BỘ QUỐC PHÒNG"
    - path: "src/components/sections/Services.tsx"
      provides: "3 service cards with Lucide icons"
      contains: "Cung ứng VLXD"
    - path: "src/components/sections/Projects.tsx"
      provides: "4-project showcase grid + 'Xem tất cả' link to /du-an"
      contains: "Cao tốc Cái Nước"
    - path: "src/app/globals.css"
      provides: "@keyframes marquee + .marquee-track utility classes (appended only — preserves @theme + scroll-margin)"
      contains: "@keyframes marquee"
  key_links:
    - from: "src/components/sections/Hero.tsx"
      to: "src/lib/site.ts"
      via: "import { telHref } from '@/lib/site'"
      pattern: "href=\\{telHref\\(\\)\\}"
    - from: "src/components/sections/PartnersMarquee.tsx"
      to: "src/app/globals.css"
      via: "className 'marquee-track' (or inline-style animation referencing @keyframes marquee)"
      pattern: "marquee"
    - from: "src/components/sections/Projects.tsx"
      to: "/du-an"
      via: "<a href=\"/du-an\">Xem tất cả dự án →</a>"
      pattern: "href=\"/du-an\""
---

<objective>
Build the **above-the-fold + showcase** half of Phase 3 — the first 4 of 8 landing sections that establish the visual trust story: **Hero → PartnersMarquee → Services → Projects**.

All 4 sections are **server components** (no `'use client'`), use the locked Burgundy/Bone palette + Be Vietnam Pro font wiring, and source any company facts strictly through `@/lib/site`. The marquee animation is pure CSS (`@keyframes` + `transform: translateX`) with a `prefers-reduced-motion` pause guard.

This plan does NOT touch `src/app/page.tsx` — composition is handled in Plan 03-02. The plan also appends marquee `@keyframes` to `src/app/globals.css` without modifying the existing `@theme`, `:root`, base styles, or `scroll-margin-top` rules.

Purpose: Trust-first messaging in the first viewport (Hero headline + military/government partners in sub-text), reinforced by the moving partner band, then concrete services and named project portfolio — the conversion path the rest of the page rests on.

Output: 4 new section component files + 1 small CSS append.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/phases/03-landing-sections/03-CONTEXT.md
@.planning/phases/02-layout-shell/02-01-shell-components-SUMMARY.md
@.planning/phases/01-foundation-lock-in/01-01-config-tokens-fonts-SUMMARY.md
@.planning/phases/01-foundation-lock-in/01-02-site-constants-cleanup-SUMMARY.md
@src/lib/site.ts
@src/app/globals.css
@src/components/layout/Nav.tsx

<interfaces>
<!-- From src/lib/site.ts — direct contracts the executor will consume. -->

```ts
export const siteUrl: string
export const company: {
  readonly legalName: 'Công ty TNHH Khang Thịnh Investment'
  readonly shortName: 'KHANG THỊNH INV'
  readonly tagline: 'Hợp tác cùng phát triển'
  readonly founded: 2025
  readonly phoneDisplay: '092 198 55 99'
  readonly phoneE164: '+84921985599'
  readonly phoneRaw: '0921985599'
  readonly email: 'khangthinhinv2025@gmail.com'
  readonly zaloUrl: 'https://zalo.me/0921985599'
  readonly taxId: '1102107064'
  readonly taxIdDisplay: '1102 107 064'
  readonly legalRep: 'Tô Thị Bích Ngọc'
  readonly address: {
    readonly street: 'A3-02 KDC Long Phú'
    readonly locality: 'xã Bến Lức'
    readonly region: 'Tây Ninh'
    readonly country: 'VN'
    readonly full: 'A3-02 KDC Long Phú, xã Bến Lức, tỉnh Tây Ninh'
  }
}
export const telHref: () => string     // returns 'tel:+84921985599'
export const mailtoHref: () => string  // returns 'mailto:khangthinhinv2025@gmail.com'
export const zaloHref: () => string    // returns 'https://zalo.me/0921985599'
export type Company = typeof company
```

Available Tailwind utilities (from globals.css @theme palette):
- Colors: `bg-burgundy`, `bg-burgundy-dark`, `bg-terracotta`, `bg-coffee`, `bg-bone`, `bg-bone-dark`, `bg-espresso`, `bg-taupe`
- Text variants: `text-*` for each color above
- Border variants: `border-*` for each color above
- Font: `font-sans` resolves to Be Vietnam Pro (subsets vietnamese + latin), weights 400-900

Lucide icons (already installed in package.json per Phase 2 SUMMARY):
- `Truck`, `HardHat`, `Ship`, `Construction`, `MapPinned`, `GitBranch`, `Waypoints`, `Anchor`, `Home`, `ArrowRight`
- Import pattern: `import { Truck, HardHat, Ship } from 'lucide-react'`

Existing globals.css contract (DO NOT modify these blocks — only APPEND new rules below):
- `@theme { … 8 colors … }` — preserve verbatim
- `@theme inline { --font-sans: var(--font-be-vietnam-pro); }` — preserve verbatim
- `:root { … semantic aliases … }` — preserve verbatim
- `html { scroll-behavior: smooth; }` + `@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }`
- `section[id] { scroll-margin-top: 4.5rem; }` — preserve verbatim
</interfaces>
</context>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Build Hero.tsx (SEC-01) — blueprint-grid bg, headline, sub-text, 2 CTAs</name>
  <files>src/components/sections/Hero.tsx</files>
  <read_first>
    - src/lib/site.ts (telHref signature)
    - .planning/phases/03-landing-sections/03-CONTEXT.md (D-01..D-05)
    - .planning/research/PITFALLS.md (Pitfall #5 Hero LCP — NO real photos, CSS pattern only)
    - src/app/globals.css (palette tokens available)
  </read_first>
  <action>
    Create `src/components/sections/Hero.tsx` as a **server component** (do NOT add `'use client'`). Implement per D-01..D-05:

    Component skeleton (use exactly these strings + structure; executor may polish Tailwind class composition but must keep the explicit strings, hrefs, and structure):

    ```tsx
    // SEC-01 Hero — first-viewport trust messaging.
    // Server component. Blueprint-grid CSS pattern background (no images per PITFALLS #5).
    // CTAs MUST use telHref() — D-04 / D-36. Never hardcode phone or zalo URLs.
    import { Phone } from 'lucide-react'
    import { telHref } from '@/lib/site'

    export default function Hero() {
      return (
        <section
          aria-label="Giới thiệu Khang Thịnh Investment"
          className="relative bg-bone py-20 md:py-24 overflow-hidden"
          style={{
            // Blueprint grid — D-03: linear-gradient lines 1px @ ~30% opacity espresso on bone, 40×40px tile.
            // CSS-only, no <img>; safe for LCP.
            backgroundImage:
              'linear-gradient(to right, rgba(26,20,16,0.30) 1px, transparent 1px), linear-gradient(to bottom, rgba(26,20,16,0.30) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        >
          <div className="relative max-w-6xl mx-auto px-4 text-center md:text-left">
            <h1 className="font-black uppercase tracking-wide text-burgundy text-4xl md:text-6xl leading-tight">
              CÔNG TRÌNH BỀN VỮNG · ĐỐI TÁC TIN CẬY
            </h1>
            <p className="mt-6 text-base md:text-xl text-espresso max-w-3xl mx-auto md:mx-0 leading-relaxed">
              Cung ứng VLXD · Xây dựng · Vận chuyển đường thủy. Đối tác Bộ Quốc phòng — Binh đoàn 12 — Trường Sơn.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center md:items-start gap-3 justify-center md:justify-start">
              {/* CTA1 — solid burgundy, primary. D-04. */}
              <a
                href={telHref()}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] bg-burgundy text-bone px-6 py-3 rounded-sm text-sm md:text-base font-bold uppercase tracking-wide hover:bg-burgundy-dark transition-colors"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                <span>Gọi 092 198 55 99</span>
              </a>
              {/* CTA2 — outline burgundy, secondary. D-04. Target #lien-he. */}
              <a
                href="#lien-he"
                className="inline-flex items-center justify-center min-h-[44px] border-2 border-burgundy text-burgundy px-6 py-3 rounded-sm text-sm md:text-base font-bold uppercase tracking-wide hover:bg-burgundy hover:text-bone transition-colors"
              >
                Báo giá
              </a>
            </div>
          </div>
        </section>
      )
    }
    ```

    Notes:
    - **Server component** — NO `'use client'`. Hero has no state.
    - Phone display text `092 198 55 99` is literal — D-04 calls for the exact label. The actual `href` MUST be `telHref()` (not hardcoded).
    - Background pattern is **inline `style`** rather than Tailwind because the linear-gradient pair is one-off and not a reusable utility.
    - Hero has NO anchor `id` (it's the top of the page, no Nav link points to it).
    - `aria-label` provided in Vietnamese per project convention.
    - Do NOT add `<img>`, `<picture>`, hero-video, or carousel — all are anti-features (FEATURES.md, PITFALLS #5).
  </action>
  <verify>
    <automated>
      cd /Users/congphan/Workspace/my-projects/khang-thing-group/website &amp;&amp;
      test -f src/components/sections/Hero.tsx &amp;&amp;
      ! grep -q "'use client'" src/components/sections/Hero.tsx &amp;&amp;
      grep -q "CÔNG TRÌNH BỀN VỮNG · ĐỐI TÁC TIN CẬY" src/components/sections/Hero.tsx &amp;&amp;
      grep -q "Cung ứng VLXD · Xây dựng · Vận chuyển đường thủy" src/components/sections/Hero.tsx &amp;&amp;
      grep -q "Bộ Quốc phòng — Binh đoàn 12 — Trường Sơn" src/components/sections/Hero.tsx &amp;&amp;
      grep -q "href={telHref()}" src/components/sections/Hero.tsx &amp;&amp;
      grep -q 'href="#lien-he"' src/components/sections/Hero.tsx &amp;&amp;
      grep -q "Báo giá" src/components/sections/Hero.tsx &amp;&amp;
      grep -q "linear-gradient" src/components/sections/Hero.tsx &amp;&amp;
      ! grep -qE "&lt;img |&lt;picture |&lt;video " src/components/sections/Hero.tsx &amp;&amp;
      ! grep -q "0921985599" src/components/sections/Hero.tsx
    </automated>
  </verify>
  <acceptance_criteria>
    - `src/components/sections/Hero.tsx` exists
    - File does NOT contain `'use client'`
    - File contains `CÔNG TRÌNH BỀN VỮNG · ĐỐI TÁC TIN CẬY`
    - File contains `Cung ứng VLXD · Xây dựng · Vận chuyển đường thủy`
    - File contains `Bộ Quốc phòng — Binh đoàn 12 — Trường Sơn`
    - File contains `href={telHref()}` (CTA1 wired through helper)
    - File contains `href="#lien-he"` (CTA2 wired to Contact anchor)
    - File contains `Báo giá`
    - File contains `linear-gradient` (blueprint grid CSS-only)
    - File does NOT contain `<img`, `<picture`, or `<video` (PITFALLS #5 — no LCP image hazard)
    - File does NOT contain hardcoded phone digits `0921985599` (must go through `telHref()` helper)
  </acceptance_criteria>
  <done>Hero.tsx renders as a server component with the exact Vietnamese headline + sub-text, CSS blueprint-grid background, and 2 CTAs wired through `telHref()` and `#lien-he`.</done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Build PartnersMarquee.tsx + append @keyframes marquee to globals.css (SEC-02)</name>
  <files>src/components/sections/PartnersMarquee.tsx, src/app/globals.css</files>
  <read_first>
    - .planning/phases/03-landing-sections/03-CONTEXT.md (D-06..D-10)
    - .planning/research/PITFALLS.md (Pitfall #12 — marquee jank: transform only, will-change, reduced-motion)
    - src/app/globals.css (current rules — must preserve @theme, :root, scroll-margin-top)
  </read_first>
  <action>
    **Step A — Append marquee CSS to `src/app/globals.css`** (do NOT modify any existing rule; APPEND below the existing `section[id] { scroll-margin-top: 4.5rem; }` block):

    ```css
    /* ------------------------------------------------------------------ */
    /* PartnersMarquee — SEC-02 / D-06..D-10.                             */
    /* CSS-only horizontal scroll. Uses transform: translateX (PITFALLS   */
    /* #12) so the GPU can composite without paint/layout work. The track */
    /* contains duplicated content so the loop is seamless: translating   */
    /* from 0 to -50% lands the second copy where the first copy began.   */
    /* Reduced-motion guard pauses the animation per WCAG 2.3.3 / D-09.   */
    /* ------------------------------------------------------------------ */
    @keyframes marquee {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }
    .marquee-track {
      display: inline-flex;
      gap: 2rem;
      white-space: nowrap;
      will-change: transform;
      animation: marquee 40s linear infinite;
    }
    @media (prefers-reduced-motion: reduce) {
      .marquee-track {
        animation: none;
      }
    }
    ```

    **Step B — Create `src/components/sections/PartnersMarquee.tsx`** (server component):

    ```tsx
    // SEC-02 PartnersMarquee — infinite horizontal scroll of trust signals.
    // Server component. Pure CSS animation (no JS, no client component).
    // Per D-09 + PITFALLS #12 — prefers-reduced-motion handled in globals.css.
    // Per D-06 — token list: BỘ QUỐC PHÒNG · BINH ĐOÀN 12 · TRƯỜNG SƠN · CÀ MAU
    // Per D-08 — mask-image fades both edges (~8% width each side).

    const PARTNER_TOKENS = [
      'BỘ QUỐC PHÒNG',
      'BINH ĐOÀN 12',
      'TRƯỜNG SƠN',
      'CÀ MAU',
    ] as const

    const SEPARATOR = '·' // \u00B7 middle dot per D-06

    // Repeat tokens 3× per copy → 12 items per copy → 24 items total in track
    // so the visible viewport is comfortably shorter than half the track width.
    const ONE_COPY = Array.from({ length: 3 }, () =&gt; PARTNER_TOKENS).flat()

    export default function PartnersMarquee() {
      return (
        <section
          id="doi-tac"
          aria-label="Đối tác tiêu biểu"
          className="bg-espresso text-bone py-12 md:py-16 overflow-hidden"
          style={{
            // Fade edges per D-08 — ~8% width each side.
            maskImage:
              'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          }}
        >
          {/* Two identical copies inside one inline-flex track → translating */}
          {/* the track by -50% creates a seamless loop. */}
          <div className="marquee-track font-black uppercase tracking-widest text-2xl md:text-4xl">
            {[0, 1].map((copyIndex) =&gt; (
              <span key={copyIndex} className="inline-flex items-center gap-8" aria-hidden={copyIndex === 1}>
                {ONE_COPY.map((token, i) =&gt; (
                  <span key={`${copyIndex}-${i}`} className="inline-flex items-center gap-8">
                    <span>{token}</span>
                    <span className="text-burgundy" aria-hidden="true">{SEPARATOR}</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </section>
      )
    }
    ```

    Notes:
    - **Server component** — NO `'use client'`.
    - Section has `id="doi-tac"` per existing Nav anchor mapping (Phase 2).
    - Animation is CSS-only — no `requestAnimationFrame`, no `useEffect`, no library import.
    - The visible second copy of tokens is `aria-hidden="true"` so screen readers do not read the same content twice.
    - Tailwind v4 understands `font-black`, `uppercase`, `tracking-widest`, `text-2xl`/`md:text-4xl`, `text-bone`, `bg-espresso`, `text-burgundy`.
    - `will-change: transform` lives in the CSS class — NOT inline — to keep markup clean.
  </action>
  <verify>
    <automated>
      cd /Users/congphan/Workspace/my-projects/khang-thing-group/website &amp;&amp;
      test -f src/components/sections/PartnersMarquee.tsx &amp;&amp;
      ! grep -q "'use client'" src/components/sections/PartnersMarquee.tsx &amp;&amp;
      grep -q 'id="doi-tac"' src/components/sections/PartnersMarquee.tsx &amp;&amp;
      grep -q "BỘ QUỐC PHÒNG" src/components/sections/PartnersMarquee.tsx &amp;&amp;
      grep -q "BINH ĐOÀN 12" src/components/sections/PartnersMarquee.tsx &amp;&amp;
      grep -q "TRƯỜNG SƠN" src/components/sections/PartnersMarquee.tsx &amp;&amp;
      grep -q "CÀ MAU" src/components/sections/PartnersMarquee.tsx &amp;&amp;
      grep -q "marquee-track" src/components/sections/PartnersMarquee.tsx &amp;&amp;
      grep -q "maskImage" src/components/sections/PartnersMarquee.tsx &amp;&amp;
      grep -q "bg-espresso" src/components/sections/PartnersMarquee.tsx &amp;&amp;
      grep -q "@keyframes marquee" src/app/globals.css &amp;&amp;
      grep -q "translateX" src/app/globals.css &amp;&amp;
      grep -q "will-change: transform" src/app/globals.css &amp;&amp;
      grep -q "prefers-reduced-motion" src/app/globals.css &amp;&amp;
      grep -q "scroll-margin-top: 4.5rem" src/app/globals.css &amp;&amp;
      grep -q "@theme {" src/app/globals.css
    </automated>
  </verify>
  <acceptance_criteria>
    - `src/components/sections/PartnersMarquee.tsx` exists, server component (no `'use client'`)
    - File contains `id="doi-tac"` (anchor matches Nav)
    - File contains all 4 partner tokens: `BỘ QUỐC PHÒNG`, `BINH ĐOÀN 12`, `TRƯỜNG SƠN`, `CÀ MAU`
    - File contains class `marquee-track`
    - File contains `maskImage` (or `WebkitMaskImage`) for edge fade
    - File contains `bg-espresso` (dark band per D-10)
    - `src/app/globals.css` contains `@keyframes marquee` (CSS animation defined)
    - `src/app/globals.css` contains `translateX` (transform-based animation per PITFALLS #12)
    - `src/app/globals.css` contains `will-change: transform`
    - `src/app/globals.css` contains `prefers-reduced-motion` (a guard rule pausing or disabling `.marquee-track`)
    - `src/app/globals.css` PRESERVES existing `scroll-margin-top: 4.5rem` rule
    - `src/app/globals.css` PRESERVES existing `@theme {` block
  </acceptance_criteria>
  <done>PartnersMarquee is a server component rendering 4 trust tokens in an espresso band; CSS `@keyframes marquee` + `.marquee-track` class is appended to globals.css with a `prefers-reduced-motion` pause guard. Existing `@theme`, `:root`, and `scroll-margin-top` rules are unchanged.</done>
</task>

<task type="auto" tdd="false">
  <name>Task 3: Build Services.tsx + Projects.tsx (SEC-03 + SEC-04)</name>
  <files>src/components/sections/Services.tsx, src/components/sections/Projects.tsx</files>
  <read_first>
    - .planning/phases/03-landing-sections/03-CONTEXT.md (D-11..D-19, including the D-16 project data table)
    - .planning/research/PITFALLS.md (Pitfall #8 B2B trust copy)
    - .planning/research/FEATURES.md (anti-features — no per-card "Tìm hiểu thêm" link)
  </read_first>
  <action>
    **Step A — Create `src/components/sections/Services.tsx`** (server component, SEC-03 per D-11..D-14):

    ```tsx
    // SEC-03 Services — 3 service cards.
    // Server component. Lucide icons per D-11. No per-card link per D-14.
    import { Truck, HardHat, Ship } from 'lucide-react'
    import type { LucideIcon } from 'lucide-react'

    type Service = {
      title: string
      desc: string
      Icon: LucideIcon
    }

    const SERVICES: readonly Service[] = [
      {
        title: 'Cung ứng VLXD',
        desc: 'Cát · Đá · San lấp. Cung ứng cho công trình trọng điểm và dân dụng.',
        Icon: Truck,
      },
      {
        title: 'Xây dựng dân dụng',
        desc: 'Thi công nhà phố, công trình dân dụng. Phối hợp đa lĩnh vực.',
        Icon: HardHat,
      },
      {
        title: 'Vận chuyển đường thủy',
        desc: 'Đội tàu vận chuyển VLXD và thiết bị, hoạt động vùng ĐBSCL.',
        Icon: Ship,
      },
    ] as const

    export default function Services() {
      return (
        <section
          id="dich-vu"
          aria-label="Dịch vụ"
          className="bg-bone-dark py-20 md:py-24"
        >
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="font-black uppercase tracking-wide text-3xl md:text-4xl text-burgundy text-center md:text-left">
              Dịch vụ
            </h2>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {SERVICES.map(({ title, desc, Icon }) =&gt; (
                <article
                  key={title}
                  className="bg-bone-dark border border-taupe p-6 hover:shadow-md transition-shadow"
                >
                  <Icon className="w-12 h-12 text-burgundy" aria-hidden="true" />
                  <h3 className="mt-4 font-bold uppercase tracking-wide text-2xl text-espresso">
                    {title}
                  </h3>
                  <p className="mt-3 text-espresso leading-relaxed">{desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )
    }
    ```

    **Step B — Create `src/components/sections/Projects.tsx`** (server component, SEC-04 per D-15..D-19):

    ```tsx
    // SEC-04 Projects — 4 representative projects + "Xem tất cả" link.
    // Server component. Data hardcoded here in Phase 3 — Phase 4 extracts to lib/projects.ts.
    // D-16 — names, clients, years, roles fixed. Years 2024/2025 best-guess;
    //         executor MUST flag year uncertainty in the SUMMARY.
    // Color block (200px tall) alternates burgundy/espresso per D-17.
    // Client text is front-and-center per D-18 + FEATURES.md.
    import { ArrowRight, Construction, GitBranch, Anchor, Home } from 'lucide-react'
    import type { LucideIcon } from 'lucide-react'

    type Project = {
      name: string
      client: string
      year: string
      role: string
      Icon: LucideIcon
      blockBg: 'bg-burgundy' | 'bg-espresso'
    }

    const PROJECTS: readonly Project[] = [
      {
        name: 'Cao tốc Cái Nước — Đất Mũi Cà Mau',
        client: 'Bộ Quốc phòng — Binh đoàn 12 — Trường Sơn',
        year: '2024',
        role: 'Cung ứng VLXD + vận chuyển',
        Icon: Construction,
        blockBg: 'bg-burgundy',
      },
      {
        name: 'Cầu Cửa Lớn — Đất Mũi Cà Mau',
        client: 'Bộ Quốc phòng — Binh đoàn 12 — Trường Sơn',
        year: '2024',
        role: 'Cung ứng VLXD + vận chuyển',
        Icon: GitBranch,
        blockBg: 'bg-espresso',
      },
      {
        name: 'Đường giao thông ra đảo Hòn Khoai',
        client: 'Bộ Quốc phòng — Binh đoàn 12 — Trường Sơn',
        year: '2024',
        role: 'Cung ứng VLXD + vận chuyển',
        Icon: Anchor,
        blockBg: 'bg-espresso',
      },
      {
        name: 'Nhà phố tiêu biểu',
        client: 'Cô Thúy (Thạnh Hóa) · Anh Bình (Mỹ Yên) · Chị Ngọc (Long An)',
        year: '2025',
        role: 'Thi công xây dựng',
        Icon: Home,
        blockBg: 'bg-burgundy',
      },
    ] as const

    export default function Projects() {
      return (
        <section
          id="du-an"
          aria-label="Dự án tiêu biểu"
          className="bg-bone py-20 md:py-24"
        >
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="font-black uppercase tracking-wide text-3xl md:text-4xl text-burgundy text-center md:text-left">
              Dự án tiêu biểu
            </h2>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              {PROJECTS.map((p) =&gt; (
                <article key={p.name} className="border border-taupe bg-bone-dark">
                  <div className={`${p.blockBg} h-[200px] flex items-center justify-center`}>
                    <p.Icon className="w-20 h-20 text-bone" aria-hidden="true" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl md:text-2xl text-espresso leading-tight">
                      {p.name}
                    </h3>
                    <p className="mt-2 text-sm text-taupe">{p.client}</p>
                    <p className="mt-4 text-xs uppercase tracking-widest text-espresso">
                      {p.year} · {p.role}
                    </p>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <a
                href="/du-an"
                className="inline-flex items-center gap-2 min-h-[44px] border-2 border-burgundy text-burgundy px-6 py-3 rounded-sm text-sm font-bold uppercase tracking-wide hover:bg-burgundy hover:text-bone transition-colors"
              >
                <span>Xem tất cả dự án</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      )
    }
    ```

    Notes:
    - **Both sections are server components** — NO `'use client'`.
    - Services has `id="dich-vu"` matching Nav.
    - Projects has `id="du-an"` matching Nav.
    - Icons chosen from the D-16 candidate list: Project 1 = `Construction` (highway), Project 2 = `GitBranch` (bridge), Project 3 = `Anchor` (island/sea), Project 4 = `Home`.
    - Color-block alternation: Project 1 burgundy → Project 2 espresso → Project 3 espresso → Project 4 burgundy. (In a 2-col grid: row 1 = [burgundy, espresso], row 2 = [espresso, burgundy] — diagonal variety, no two adjacent blocks same color either horizontally or vertically.)
    - Card content order per D-18: Name (largest, font-bold) → Client (text-taupe) → Year + Role (smallest, uppercase tracking-widest).
    - "Xem tất cả dự án →" is rendered as a single outline-burgundy button BELOW the grid (D-19), linking to `/du-an` (Phase 4 will populate that route).
    - **No per-card "Tìm hiểu thêm" link** per D-14.
    - **No `<img>`** anywhere — color block + Lucide icon per D-17 / D-38.
    - Year guesses (2024 / 2025) MUST be flagged in the SUMMARY for the user to confirm or correct in Phase 4.
  </action>
  <verify>
    <automated>
      cd /Users/congphan/Workspace/my-projects/khang-thing-group/website &amp;&amp;
      test -f src/components/sections/Services.tsx &amp;&amp;
      test -f src/components/sections/Projects.tsx &amp;&amp;
      ! grep -q "'use client'" src/components/sections/Services.tsx &amp;&amp;
      ! grep -q "'use client'" src/components/sections/Projects.tsx &amp;&amp;
      grep -q 'id="dich-vu"' src/components/sections/Services.tsx &amp;&amp;
      grep -q 'id="du-an"' src/components/sections/Projects.tsx &amp;&amp;
      grep -q "Cung ứng VLXD" src/components/sections/Services.tsx &amp;&amp;
      grep -q "Xây dựng dân dụng" src/components/sections/Services.tsx &amp;&amp;
      grep -q "Vận chuyển đường thủy" src/components/sections/Services.tsx &amp;&amp;
      grep -qE "import \\{[^}]*Truck[^}]*HardHat[^}]*Ship[^}]*\\} from 'lucide-react'" src/components/sections/Services.tsx &amp;&amp;
      grep -q "Cao tốc Cái Nước" src/components/sections/Projects.tsx &amp;&amp;
      grep -q "Cầu Cửa Lớn" src/components/sections/Projects.tsx &amp;&amp;
      grep -q "Hòn Khoai" src/components/sections/Projects.tsx &amp;&amp;
      grep -q "Nhà phố tiêu biểu" src/components/sections/Projects.tsx &amp;&amp;
      grep -q "Bộ Quốc phòng — Binh đoàn 12 — Trường Sơn" src/components/sections/Projects.tsx &amp;&amp;
      grep -q 'href="/du-an"' src/components/sections/Projects.tsx &amp;&amp;
      grep -q "Xem tất cả dự án" src/components/sections/Projects.tsx &amp;&amp;
      ! grep -q "Tìm hiểu thêm" src/components/sections/Services.tsx &amp;&amp;
      ! grep -qE "&lt;img |&lt;picture |&lt;video " src/components/sections/Services.tsx &amp;&amp;
      ! grep -qE "&lt;img |&lt;picture |&lt;video " src/components/sections/Projects.tsx
    </automated>
  </verify>
  <acceptance_criteria>
    - `src/components/sections/Services.tsx` + `src/components/sections/Projects.tsx` both exist as server components (no `'use client'`)
    - Services contains `id="dich-vu"`, Projects contains `id="du-an"` (anchors match Nav)
    - Services contains all 3 titles: `Cung ứng VLXD`, `Xây dựng dân dụng`, `Vận chuyển đường thủy`
    - Services imports `{ Truck, HardHat, Ship }` from `lucide-react`
    - Projects contains all 4 project names: `Cao tốc Cái Nước`, `Cầu Cửa Lớn`, `Hòn Khoai`, `Nhà phố tiêu biểu`
    - Projects contains client string `Bộ Quốc phòng — Binh đoàn 12 — Trường Sơn` (front-and-center per D-18)
    - Projects contains `href="/du-an"` (CTA "Xem tất cả dự án →" wired)
    - Projects contains `Xem tất cả dự án`
    - Services does NOT contain `Tìm hiểu thêm` (D-14 — no per-card link)
    - Neither file contains `<img`, `<picture`, or `<video` (D-38 — no photos in Phase 3)
  </acceptance_criteria>
  <done>Services renders 3 cards with Lucide icons in the bone-dark band; Projects renders 4 cards in a 2×2 grid with named clients prominent and a single "Xem tất cả dự án →" outline CTA linking to `/du-an`.</done>
</task>

</tasks>

<verification>
**Plan-level checks (run after all 3 tasks complete):**

```bash
cd /Users/congphan/Workspace/my-projects/khang-thing-group/website

# All 4 components exist and are server components.
for f in Hero PartnersMarquee Services Projects; do
  test -f "src/components/sections/$f.tsx" || { echo "MISSING: $f.tsx"; exit 1; }
  if grep -q "'use client'" "src/components/sections/$f.tsx"; then
    echo "FAIL: $f.tsx unexpectedly client component"; exit 1
  fi
done

# No hardcoded phone digits anywhere in the new section files.
! grep -r "0921985599" src/components/sections/ || { echo "FAIL: hardcoded phone"; exit 1; }

# No real photos.
! grep -rE "<img |<picture |<video " src/components/sections/ || { echo "FAIL: image element present"; exit 1; }

# globals.css invariants preserved.
grep -q "@theme {" src/app/globals.css
grep -q "scroll-margin-top: 4.5rem" src/app/globals.css
grep -q "@keyframes marquee" src/app/globals.css

# Build still passes.
npm run build
```

`npm run build` MUST exit 0. The sections are not yet composed into `page.tsx` (that happens in Plan 03-02) so the build verifies only that the new components compile and Tailwind classes resolve.
</verification>

<success_criteria>
- 4 section component files created in `src/components/sections/` — Hero, PartnersMarquee, Services, Projects
- All 4 are **server components** (no `'use client'` directive)
- All CTA `href`s use `telHref()` or anchor IDs (`#lien-he`) or route paths (`/du-an`) — NEVER hardcoded phone/email/zalo URLs
- `src/app/globals.css` is appended with `@keyframes marquee` + `.marquee-track` + `prefers-reduced-motion` pause guard; existing `@theme`, `:root`, base styles, and `scroll-margin-top` rules are preserved verbatim
- Vietnamese B2B trust copy (PITFALLS #8): headline + sub-text + named partners + named clients — no fake testimonials, no "20 năm kinh nghiệm"
- No `<img>`, `<picture>`, `<video>`, carousel, or count-up animation (FEATURES.md anti-features)
- `npm run build` exits 0
</success_criteria>

<output>
After completion, create `.planning/phases/03-landing-sections/03-01-above-fold-showcase-SUMMARY.md` documenting:
- 4 files created in `src/components/sections/` + 1 CSS append to `src/app/globals.css`
- Confirmation all 4 sections are server components
- Final Lucide icon choices made for Projects 1–4 (the D-16 candidates — Construction / GitBranch / Anchor / Home)
- **Year flag:** "Project years 2024 (3 construction) and 2025 (nhà phố) are best-guess per CONTEXT.md D-16 — user MUST confirm before Phase 4 lib/projects.ts extraction."
- Confirmation `@theme`, `:root`, and `scroll-margin-top: 4.5rem` rules in `globals.css` were preserved
- Build exit code from `npm run build`
- Pointer to Plan 03-02 for compose/cleanup
</output>
