---
phase: 03-landing-sections
plan: 02
type: execute
wave: 2
depends_on: ["03-01"]
files_modified:
  - src/components/sections/BigStats.tsx
  - src/components/sections/Capabilities.tsx
  - src/components/sections/CtaQuote.tsx
  - src/components/sections/Contact.tsx
  - src/app/page.tsx
autonomous: true
requirements: [SEC-05, SEC-06, SEC-07, SEC-08]
must_haves:
  truths:
    - "BigStats shows 4 honest stats: 3,900 (Tấn — Tải trọng đội tàu), 4 (Dự án tiêu biểu), 2025 (Năm thành lập), 3 (Đối tác Quốc phòng) — no count-up animation"
    - "Capabilities renders 3 groups (Đội tàu / Cơ giới / Đội xây lắp) each with a Lucide icon and 3–4 B2B bullets"
    - "CtaQuote displays full-width espresso banner with 'YÊU CẦU BÁO GIÁ NGAY HÔM NAY' + a working tel: CTA"
    - "Contact renders company legal block + 3 working CTAs (tel/zalo/mailto) with plain-text email visible"
    - "src/app/page.tsx imports and composes all 8 sections in the locked order Hero → PartnersMarquee → Services → Projects → BigStats → Capabilities → CtaQuote → Contact"
    - "Phase 1 sentinel <details> debug card is deleted from app/page.tsx"
    - "npm run build exits 0 and the static export at out/index.html contains the Hero headline + 4 project names + the espresso CTA headline"
  artifacts:
    - path: "src/components/sections/BigStats.tsx"
      provides: "4 stat tiles, static (no count-up)"
      contains: "3,900"
    - path: "src/components/sections/Capabilities.tsx"
      provides: "3 capability groups with bullets"
      contains: "Đội tàu"
    - path: "src/components/sections/CtaQuote.tsx"
      provides: "Full-width espresso banner with single tel: CTA"
      contains: "YÊU CẦU BÁO GIÁ NGAY HÔM NAY"
    - path: "src/components/sections/Contact.tsx"
      provides: "Contact section with 3 channel CTAs + plain-text email"
      contains: "Liên hệ"
    - path: "src/app/page.tsx"
      provides: "Composed landing page with all 8 sections in order; sentinel removed"
      contains: "import Hero"
  key_links:
    - from: "src/components/sections/CtaQuote.tsx"
      to: "src/lib/site.ts"
      via: "import { telHref } from '@/lib/site'"
      pattern: "href=\\{telHref\\(\\)\\}"
    - from: "src/components/sections/Contact.tsx"
      to: "src/lib/site.ts"
      via: "import { company, telHref, zaloHref, mailtoHref } from '@/lib/site'"
      pattern: "mailtoHref\\(\\)"
    - from: "src/app/page.tsx"
      to: "src/components/sections/*"
      via: "imports + JSX composition in locked order"
      pattern: "import Hero from '@/components/sections/Hero'"
---

<objective>
Build the **close + compose** half of Phase 3 — the remaining 4 sections (**BigStats → Capabilities → CtaQuote → Contact**) plus the final wiring of `src/app/page.tsx` that composes all 8 sections in the locked order, and deletes the Phase 1 sentinel debug card.

All 4 new sections are **server components** sourcing company facts strictly through `@/lib/site`. The Contact section exposes the 3 conversion channels (tel / Zalo / email) with the plain-text email fallback per PITFALLS #7. The page composition replaces the 5 anchor placeholder `<section>` blocks created in Phase 2.

This plan **depends on Plan 03-01** because `src/app/page.tsx` imports the Hero/PartnersMarquee/Services/Projects components built there. The two plans MUST execute in wave order (03-01 first, then 03-02).

Purpose: Close the conversion path the first half opened — give numbers to back trust, capabilities to back numbers, a clear call-to-action banner, and finally a contact block where every CTA route is one tap away. Compose everything into the live page.

Output: 4 new section component files + a rewritten `src/app/page.tsx` (8-section composition with sentinel removed).
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/phases/03-landing-sections/03-CONTEXT.md
@.planning/phases/03-landing-sections/03-01-above-fold-showcase-PLAN.md
@.planning/phases/02-layout-shell/02-01-shell-components-SUMMARY.md
@.planning/phases/01-foundation-lock-in/01-02-site-constants-cleanup-SUMMARY.md
@src/lib/site.ts
@src/app/page.tsx
@src/app/layout.tsx
@src/components/layout/Nav.tsx

<interfaces>
<!-- From src/lib/site.ts — direct contracts the executor will consume. -->

```ts
export const company: {
  readonly legalName: 'Công ty TNHH Khang Thịnh Investment'
  readonly shortName: 'KHANG THỊNH INV'
  readonly tagline: 'Hợp tác cùng phát triển'
  readonly phoneDisplay: '092 198 55 99'
  readonly email: 'khangthinhinv2025@gmail.com'
  readonly taxIdDisplay: '1102 107 064'
  readonly legalRep: 'Tô Thị Bích Ngọc'
  readonly address: { readonly full: 'A3-02 KDC Long Phú, xã Bến Lức, tỉnh Tây Ninh'; /* … */ }
  // … see Plan 03-01 for full interface
}
export const telHref: () => string     // 'tel:+84921985599'
export const mailtoHref: () => string  // 'mailto:khangthinhinv2025@gmail.com'
export const zaloHref: () => string    // 'https://zalo.me/0921985599'
```

<!-- From Plan 03-01 outputs (Wave 1) — components this plan imports into page.tsx -->

- `src/components/sections/Hero.tsx` — default export, server component, no anchor id
- `src/components/sections/PartnersMarquee.tsx` — default export, server component, `id="doi-tac"`
- `src/components/sections/Services.tsx` — default export, server component, `id="dich-vu"`
- `src/components/sections/Projects.tsx` — default export, server component, `id="du-an"`

<!-- Existing layout (DO NOT MODIFY per CONTEXT.md): -->
- `src/app/layout.tsx` already renders `<Nav />`, `<Footer />`, `<FloatingZalo />` around `{children}`. This plan does NOT touch layout.tsx.

Existing globals.css contract (DO NOT MODIFY in this plan):
- `@theme { … }`, `@theme inline { … }`, `:root { … }`, `section[id] { scroll-margin-top: 4.5rem; }`, plus the marquee `@keyframes` appended in Plan 03-01.
</interfaces>
</context>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Build BigStats.tsx + Capabilities.tsx (SEC-05 + SEC-06)</name>
  <files>src/components/sections/BigStats.tsx, src/components/sections/Capabilities.tsx</files>
  <read_first>
    - .planning/phases/03-landing-sections/03-CONTEXT.md (D-20..D-25)
    - .planning/research/FEATURES.md (anti-features — NO count-up animation)
    - src/app/globals.css (palette tokens available)
  </read_first>
  <action>
    **Step A — Create `src/components/sections/BigStats.tsx`** (server component, SEC-05 per D-20..D-22):

    ```tsx
    // SEC-05 BigStats — 4 honest tiles. NO count-up animation per D-22 + FEATURES.md.
    // Server component. No state, no client.
    // No anchor id of its own — BigStats lives inside the #nang-luc section wrapper
    // in page.tsx alongside Capabilities (see Plan 03-02 Task 3 composition note).

    type Stat = {
      number: string
      label: string
    }

    const STATS: readonly Stat[] = [
      { number: '3,900', label: 'Tấn — Tải trọng đội tàu' },
      { number: '4',     label: 'Dự án tiêu biểu' },
      { number: '2025',  label: 'Năm thành lập' },
      { number: '3',     label: 'Đối tác Quốc phòng' },
    ] as const

    export default function BigStats() {
      return (
        <section
          aria-label="Số liệu nổi bật"
          className="bg-bone-dark py-20 md:py-24"
        >
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {STATS.map((s) =&gt; (
                <div
                  key={s.label}
                  className="bg-bone-dark border-l-4 border-burgundy pl-4 md:pl-6 py-4"
                >
                  <div className="font-black text-5xl md:text-6xl text-burgundy leading-none">
                    {s.number}
                  </div>
                  <div className="mt-3 text-xs md:text-sm uppercase tracking-widest text-espresso">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )
    }
    ```

    **Step B — Create `src/components/sections/Capabilities.tsx`** (server component, SEC-06 per D-23..D-25):

    ```tsx
    // SEC-06 Capabilities — 3 capability groups with B2B bullet copy.
    // Server component. No anchor id of its own — shares #nang-luc with BigStats
    // (the wrapping <section id="nang-luc"> lives in page.tsx).
    // Icon for "Cơ giới" chosen as `Truck` from D-23 candidates (Truck vs Wrench) —
    // matches the Services VLXD icon and reinforces fleet-mobility visual cue.
    import { Ship, Truck, HardHat, Check } from 'lucide-react'
    import type { LucideIcon } from 'lucide-react'

    type Capability = {
      title: string
      bullets: readonly string[]
      Icon: LucideIcon
    }

    const CAPABILITIES: readonly Capability[] = [
      {
        title: 'Đội tàu',
        bullets: [
          'Tải trọng tối đa 3,900 tấn',
          'Hoạt động vùng Đồng bằng Sông Cửu Long',
          'Đăng kiểm + giấy phép đầy đủ',
          'Vận chuyển VLXD + thiết bị công trình',
        ],
        Icon: Ship,
      },
      {
        title: 'Cơ giới',
        bullets: [
          'Đội xe vận tải + máy san lấp',
          'Trang thiết bị thi công công trình',
          'Bảo dưỡng định kỳ',
          'Sẵn sàng huy động 24/7',
        ],
        Icon: Truck,
      },
      {
        title: 'Đội xây lắp',
        bullets: [
          'Đội ngũ có kinh nghiệm dự án quốc gia',
          'Thi công nhà phố + công trình dân dụng',
          'Phối hợp đa lĩnh vực: cung ứng + thi công + vận chuyển',
          'Tuân thủ tiêu chuẩn an toàn xây dựng',
        ],
        Icon: HardHat,
      },
    ] as const

    export default function Capabilities() {
      return (
        <section
          aria-label="Năng lực"
          className="bg-bone py-20 md:py-24"
        >
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="font-black uppercase tracking-wide text-3xl md:text-4xl text-burgundy text-center md:text-left">
              Năng lực
            </h2>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
              {CAPABILITIES.map(({ title, bullets, Icon }) =&gt; (
                <article key={title}>
                  <Icon className="w-12 h-12 text-burgundy" aria-hidden="true" />
                  <h3 className="mt-4 font-bold uppercase tracking-wide text-2xl text-espresso">
                    {title}
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {bullets.map((b) =&gt; (
                      <li key={b} className="flex items-start gap-2 text-espresso leading-relaxed">
                        <Check className="w-5 h-5 text-burgundy flex-shrink-0 mt-1" aria-hidden="true" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>
      )
    }
    ```

    Notes:
    - **Both sections are server components** — NO `'use client'`.
    - **No anchor `id` on either component** — both live inside a wrapping `<section id="nang-luc">` in `page.tsx` (Task 3). This satisfies the Nav `#nang-luc` link (which means "năng lực" / capabilities) by aiming the user at the combined block.
    - BigStats has NO `<script>`, no `useEffect`, no `motion` import — static numbers per D-22.
    - Capabilities bullet rows use the Lucide `Check` icon as the marker per D-24.
    - "Cơ giới" icon = `Truck` (chosen from D-23 candidates Truck vs Wrench) — keeps icon vocabulary tight and avoids tooling-shop misread.
    - No `<img>` anywhere.
  </action>
  <verify>
    <automated>
      cd /Users/congphan/Workspace/my-projects/khang-thing-group/website &amp;&amp;
      test -f src/components/sections/BigStats.tsx &amp;&amp;
      test -f src/components/sections/Capabilities.tsx &amp;&amp;
      ! grep -q "'use client'" src/components/sections/BigStats.tsx &amp;&amp;
      ! grep -q "'use client'" src/components/sections/Capabilities.tsx &amp;&amp;
      grep -q "3,900" src/components/sections/BigStats.tsx &amp;&amp;
      grep -q "Tấn — Tải trọng đội tàu" src/components/sections/BigStats.tsx &amp;&amp;
      grep -q "Dự án tiêu biểu" src/components/sections/BigStats.tsx &amp;&amp;
      grep -q "2025" src/components/sections/BigStats.tsx &amp;&amp;
      grep -q "Đối tác Quốc phòng" src/components/sections/BigStats.tsx &amp;&amp;
      grep -q "border-l-4" src/components/sections/BigStats.tsx &amp;&amp;
      ! grep -q "useEffect\|motion\|count" src/components/sections/BigStats.tsx &amp;&amp;
      grep -q "Đội tàu" src/components/sections/Capabilities.tsx &amp;&amp;
      grep -q "Cơ giới" src/components/sections/Capabilities.tsx &amp;&amp;
      grep -q "Đội xây lắp" src/components/sections/Capabilities.tsx &amp;&amp;
      grep -qE "import \\{[^}]*Ship[^}]*Truck[^}]*HardHat[^}]*\\} from 'lucide-react'" src/components/sections/Capabilities.tsx &amp;&amp;
      ! grep -qE "&lt;img |&lt;picture |&lt;video " src/components/sections/BigStats.tsx &amp;&amp;
      ! grep -qE "&lt;img |&lt;picture |&lt;video " src/components/sections/Capabilities.tsx
    </automated>
  </verify>
  <acceptance_criteria>
    - `src/components/sections/BigStats.tsx` exists, server component (no `'use client'`)
    - BigStats contains all 4 numbers as literal strings: `3,900`, `4`, `2025`, `3` (the `2025` and `3,900` already verified by grep; `4` and `3` are present inside the const literal array)
    - BigStats contains the labels: `Tấn — Tải trọng đội tàu`, `Dự án tiêu biểu`, `Đối tác Quốc phòng`
    - BigStats uses `border-l-4` (left burgundy border per D-21)
    - BigStats does NOT contain `useEffect`, `motion`, or `count` (no count-up animation — D-22)
    - `src/components/sections/Capabilities.tsx` exists, server component (no `'use client'`)
    - Capabilities contains all 3 group titles: `Đội tàu`, `Cơ giới`, `Đội xây lắp`
    - Capabilities imports `{ Ship, Truck, HardHat }` from `lucide-react`
    - Neither file uses `<img>`, `<picture>`, `<video>` (D-38)
  </acceptance_criteria>
  <done>BigStats renders 4 static stat tiles (no animation) on a bone-dark band; Capabilities renders 3 capability groups with Lucide icons and bulleted B2B copy on a bone band. Neither has an `id` (the `#nang-luc` wrapper comes in Task 3).</done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Build CtaQuote.tsx + Contact.tsx (SEC-07 + SEC-08)</name>
  <files>src/components/sections/CtaQuote.tsx, src/components/sections/Contact.tsx</files>
  <read_first>
    - .planning/phases/03-landing-sections/03-CONTEXT.md (D-26..D-32)
    - src/lib/site.ts (company shape + telHref/zaloHref/mailtoHref)
    - .planning/research/PITFALLS.md (Pitfall #7 — plain-text email fallback next to mailto button)
  </read_first>
  <action>
    **Step A — Create `src/components/sections/CtaQuote.tsx`** (server component, SEC-07 per D-26..D-29):

    ```tsx
    // SEC-07 CtaQuote — full-width espresso banner with a single tel: CTA.
    // Server component. NO anchor id per D-29 (Nav "Báo giá" CTA targets #lien-he).
    // Banner is a conversion strip between Capabilities and Contact.
    import { Phone } from 'lucide-react'
    import { telHref } from '@/lib/site'

    export default function CtaQuote() {
      return (
        <section
          aria-label="Yêu cầu báo giá"
          className="bg-espresso text-bone py-20 md:py-24"
        >
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="font-black uppercase tracking-wide text-3xl md:text-5xl text-bone">
              YÊU CẦU BÁO GIÁ NGAY HÔM NAY
            </h2>
            <p className="mt-5 text-base md:text-lg text-bone-dark max-w-3xl mx-auto leading-relaxed">
              Tư vấn miễn phí · Phản hồi trong 24 giờ · Báo giá theo khối lượng + điểm giao
            </p>
            <div className="mt-8 flex justify-center">
              <a
                href={telHref()}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] bg-burgundy text-bone px-8 py-4 rounded-sm text-base md:text-lg font-bold uppercase tracking-wide hover:bg-burgundy-dark transition-colors"
              >
                <Phone className="w-5 h-5" aria-hidden="true" />
                <span>Gọi 092 198 55 99</span>
              </a>
            </div>
          </div>
        </section>
      )
    }
    ```

    **Step B — Create `src/components/sections/Contact.tsx`** (server component, SEC-08 per D-30..D-32):

    ```tsx
    // SEC-08 Contact — company info (left) + 3 channel CTAs (right).
    // Server component. Anchor id="lien-he" (Nav "Báo giá" + Hero CTA2 target).
    // All CTA hrefs flow through @/lib/site helpers — never hardcoded.
    // Plain-text email is rendered next to the mailto button per PITFALLS #7.
    import { Phone, MessageCircle, Mail } from 'lucide-react'
    import { company, telHref, zaloHref, mailtoHref } from '@/lib/site'

    export default function Contact() {
      return (
        <section
          id="lien-he"
          aria-label="Liên hệ Khang Thịnh"
          className="bg-bone-dark py-20 md:py-24"
        >
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
              {/* Left column — info + legal block */}
              <div>
                <h2 className="font-black uppercase tracking-wide text-3xl md:text-4xl text-burgundy">
                  Liên hệ
                </h2>
                <p className="mt-2 italic text-burgundy-dark">
                  &quot;{company.tagline}&quot;
                </p>
                <dl className="mt-8 space-y-3 text-espresso">
                  <div>
                    <dt className="sr-only">Tên công ty</dt>
                    <dd className="font-bold">{company.legalName}</dd>
                  </div>
                  <div>
                    <dt className="sr-only">Mã số thuế</dt>
                    <dd>MST: {company.taxIdDisplay}</dd>
                  </div>
                  <div>
                    <dt className="sr-only">Đại diện pháp luật</dt>
                    <dd>ĐDPL: {company.legalRep}</dd>
                  </div>
                  <div>
                    <dt className="sr-only">Địa chỉ</dt>
                    <dd>Địa chỉ: {company.address.full}</dd>
                  </div>
                </dl>
              </div>

              {/* Right column — 3 stacked CTAs */}
              <div className="flex flex-col gap-4">
                <a
                  href={telHref()}
                  className="inline-flex items-center justify-center gap-2 min-h-[44px] w-full bg-burgundy text-bone px-6 py-4 rounded-sm text-base font-bold uppercase tracking-wide hover:bg-burgundy-dark transition-colors"
                >
                  <Phone className="w-5 h-5" aria-hidden="true" />
                  <span>Gọi 092 198 55 99</span>
                </a>
                <a
                  href={zaloHref()}
                  className="inline-flex items-center justify-center gap-2 min-h-[44px] w-full bg-burgundy text-bone px-6 py-4 rounded-sm text-base font-bold uppercase tracking-wide hover:bg-burgundy-dark transition-colors"
                >
                  <MessageCircle className="w-5 h-5" aria-hidden="true" />
                  <span>Chat Zalo</span>
                </a>
                <a
                  href={mailtoHref()}
                  className="inline-flex items-center justify-center gap-2 min-h-[44px] w-full border-2 border-burgundy text-burgundy px-6 py-4 rounded-sm text-base font-bold uppercase tracking-wide hover:bg-burgundy hover:text-bone transition-colors"
                >
                  <Mail className="w-5 h-5" aria-hidden="true" />
                  <span>Gửi email</span>
                </a>
                {/* Plain-text email fallback per PITFALLS #7 — visible even if */}
                {/* the mailto handler is missing on the user's device.        */}
                <p className="text-center text-sm text-espresso">
                  Hoặc gửi trực tiếp đến: <span className="font-semibold">{company.email}</span>
                </p>
              </div>
            </div>
          </div>
        </section>
      )
    }
    ```

    Notes:
    - **Both sections are server components** — NO `'use client'`.
    - CtaQuote has NO `id` (D-29).
    - Contact has `id="lien-he"` (target of Nav "Báo giá" + Hero CTA2 + Hero/CtaQuote secondary nav).
    - All 4 CTAs (1 in CtaQuote + 3 in Contact) route through helper functions: `telHref()`, `zaloHref()`, `mailtoHref()` — no hardcoded URLs.
    - Plain-text email `{company.email}` is rendered as text below the "Gửi email" button — PITFALLS #7 fallback.
    - "Giờ làm việc" line is NOT included (D-31 left as Claude's Discretion; planner declines because committing to fixed hours without business confirmation is a risk).
    - `<dl>/<dt>/<dd>` is used for the legal block so screen readers announce these as definition pairs while sighted users see the `dd` lines.
  </action>
  <verify>
    <automated>
      cd /Users/congphan/Workspace/my-projects/khang-thing-group/website &amp;&amp;
      test -f src/components/sections/CtaQuote.tsx &amp;&amp;
      test -f src/components/sections/Contact.tsx &amp;&amp;
      ! grep -q "'use client'" src/components/sections/CtaQuote.tsx &amp;&amp;
      ! grep -q "'use client'" src/components/sections/Contact.tsx &amp;&amp;
      grep -q "YÊU CẦU BÁO GIÁ NGAY HÔM NAY" src/components/sections/CtaQuote.tsx &amp;&amp;
      grep -q "Tư vấn miễn phí · Phản hồi trong 24 giờ · Báo giá theo khối lượng" src/components/sections/CtaQuote.tsx &amp;&amp;
      grep -q "bg-espresso" src/components/sections/CtaQuote.tsx &amp;&amp;
      grep -q "href={telHref()}" src/components/sections/CtaQuote.tsx &amp;&amp;
      ! grep -q 'id="' src/components/sections/CtaQuote.tsx &amp;&amp;
      grep -q 'id="lien-he"' src/components/sections/Contact.tsx &amp;&amp;
      grep -q "href={telHref()}" src/components/sections/Contact.tsx &amp;&amp;
      grep -q "href={zaloHref()}" src/components/sections/Contact.tsx &amp;&amp;
      grep -q "href={mailtoHref()}" src/components/sections/Contact.tsx &amp;&amp;
      grep -q "{company.email}" src/components/sections/Contact.tsx &amp;&amp;
      grep -q "{company.legalName}" src/components/sections/Contact.tsx &amp;&amp;
      grep -q "{company.taxIdDisplay}" src/components/sections/Contact.tsx &amp;&amp;
      grep -q "{company.legalRep}" src/components/sections/Contact.tsx &amp;&amp;
      grep -q "{company.address.full}" src/components/sections/Contact.tsx &amp;&amp;
      ! grep -q "0921985599" src/components/sections/Contact.tsx &amp;&amp;
      ! grep -q "0921985599" src/components/sections/CtaQuote.tsx &amp;&amp;
      ! grep -q "khangthinhinv2025@gmail.com" src/components/sections/Contact.tsx
    </automated>
  </verify>
  <acceptance_criteria>
    - `src/components/sections/CtaQuote.tsx` exists, server component (no `'use client'`)
    - CtaQuote contains `YÊU CẦU BÁO GIÁ NGAY HÔM NAY`
    - CtaQuote contains `Tư vấn miễn phí · Phản hồi trong 24 giờ · Báo giá theo khối lượng + điểm giao`
    - CtaQuote uses `bg-espresso` (full-width espresso banner per D-26)
    - CtaQuote contains `href={telHref()}` (single CTA wired through helper)
    - CtaQuote does NOT contain `id="..."` (no anchor per D-29)
    - `src/components/sections/Contact.tsx` exists, server component (no `'use client'`)
    - Contact contains `id="lien-he"` (target of Nav "Báo giá" + Hero CTA2)
    - Contact contains `href={telHref()}`, `href={zaloHref()}`, `href={mailtoHref()}` (all 3 channels via helpers)
    - Contact contains `{company.email}` — plain-text email fallback rendered next to button (PITFALLS #7)
    - Contact renders legal block from `company.legalName`, `company.taxIdDisplay`, `company.legalRep`, `company.address.full`
    - Neither file contains hardcoded phone digits `0921985599`
    - Contact does NOT contain hardcoded email string (must template through `{company.email}`)
  </acceptance_criteria>
  <done>CtaQuote renders a full-width espresso banner with a single tel: CTA; Contact renders the legal block (sourced from `lib/site.ts`) plus 3 channel CTA buttons (tel/zalo/mailto) with the plain-text email visible per PITFALLS #7.</done>
</task>

<task type="auto" tdd="false">
  <name>Task 3: Rewrite app/page.tsx — compose all 8 sections, delete sentinel, verify build</name>
  <files>src/app/page.tsx</files>
  <read_first>
    - src/app/page.tsx (current 5 anchor placeholders + Phase 1 sentinel debug card to delete)
    - .planning/phases/03-landing-sections/03-CONTEXT.md (D-33..D-40, especially D-40 sentinel removal)
    - src/components/layout/Nav.tsx (anchor IDs that must continue to resolve: #dich-vu, #du-an, #nang-luc, #doi-tac, #lien-he)
  </read_first>
  <action>
    **Rewrite `src/app/page.tsx`** in full. Replace the entire current file body with the 8-section composition. Do NOT touch `src/app/layout.tsx`, `src/app/globals.css`, or any layout shell file.

    Anchor-ID strategy per CONTEXT.md anchor mapping:
    - `#dich-vu` lives on `<Services>` (set by Plan 03-01)
    - `#du-an`   lives on `<Projects>` (set by Plan 03-01)
    - `#doi-tac` lives on `<PartnersMarquee>` (set by Plan 03-01)
    - `#lien-he` lives on `<Contact>` (set by Task 2 of this plan)
    - `#nang-luc` is created HERE in `page.tsx` as a wrapping `<section id="nang-luc">` around `<BigStats />` + `<Capabilities />` so the Nav "Năng lực" link lands at the combined block.

    Background alternation per CONTEXT.md suggested baseline (which has been honored by each component):
    - Hero(bone) · Partners(espresso) · Services(bone-dark) · Projects(bone) · BigStats(bone-dark) · Capabilities(bone) · CtaQuote(espresso) · Contact(bone-dark)
    - No two adjacent espresso bands → confirmed.

    Final file content (replace the entire body):

    ```tsx
    // Phase 3 — composed landing page. Renders 8 sections in locked order:
    //   Hero → PartnersMarquee → Services → Projects → (BigStats + Capabilities, wrapped #nang-luc) → CtaQuote → Contact
    // Anchor coverage (matches Nav at src/components/layout/Nav.tsx):
    //   #dich-vu  → Services
    //   #du-an    → Projects
    //   #nang-luc → wrapping section around BigStats + Capabilities (set here)
    //   #doi-tac  → PartnersMarquee
    //   #lien-he  → Contact
    // All sections are server components and run under the Nav/Footer/FloatingZalo
    // shell wired in src/app/layout.tsx.
    import Hero from '@/components/sections/Hero'
    import PartnersMarquee from '@/components/sections/PartnersMarquee'
    import Services from '@/components/sections/Services'
    import Projects from '@/components/sections/Projects'
    import BigStats from '@/components/sections/BigStats'
    import Capabilities from '@/components/sections/Capabilities'
    import CtaQuote from '@/components/sections/CtaQuote'
    import Contact from '@/components/sections/Contact'

    export default function HomePage() {
      return (
        <main className="min-h-screen">
          <Hero />
          <PartnersMarquee />
          <Services />
          <Projects />
          {/* #nang-luc wraps BigStats + Capabilities so the Nav "Năng lực" link */}
          {/* lands on the combined capability block. Neither child carries an id. */}
          <section id="nang-luc" aria-label="Năng lực">
            <BigStats />
            <Capabilities />
          </section>
          <CtaQuote />
          <Contact />
        </main>
      )
    }
    ```

    **Then run the static build and verify the live HTML:**

    ```bash
    cd /Users/congphan/Workspace/my-projects/khang-thing-group/website
    npm run build
    # Expected: exit code 0, "/" route generated under out/index.html
    ```

    Verification spot-checks against `out/index.html`:
    - Hero headline string `CÔNG TRÌNH BỀN VỮNG` present
    - Marquee text `BỘ QUỐC PHÒNG` present
    - Project name `Cao tốc Cái Nước` present
    - CTA banner headline `YÊU CẦU BÁO GIÁ NGAY HÔM NAY` present
    - Legal address fragment `A3-02 KDC Long Phú` present
    - 5 Nav anchor IDs (`id="dich-vu"`, `id="du-an"`, `id="nang-luc"`, `id="doi-tac"`, `id="lien-he"`) all present
    - Phase 1 sentinel text "Phase 1 sentinel" / "debug — remove in Phase 3" is ABSENT (sentinel deleted per D-40)
    - No `zalo://` scheme (HTTPS-only Zalo per Phase 2)
    - tel link `tel:+84921985599` present (telHref() resolved at build)
  </action>
  <verify>
    <automated>
      cd /Users/congphan/Workspace/my-projects/khang-thing-group/website &amp;&amp;
      grep -q "import Hero from '@/components/sections/Hero'" src/app/page.tsx &amp;&amp;
      grep -q "import PartnersMarquee from '@/components/sections/PartnersMarquee'" src/app/page.tsx &amp;&amp;
      grep -q "import Services from '@/components/sections/Services'" src/app/page.tsx &amp;&amp;
      grep -q "import Projects from '@/components/sections/Projects'" src/app/page.tsx &amp;&amp;
      grep -q "import BigStats from '@/components/sections/BigStats'" src/app/page.tsx &amp;&amp;
      grep -q "import Capabilities from '@/components/sections/Capabilities'" src/app/page.tsx &amp;&amp;
      grep -q "import CtaQuote from '@/components/sections/CtaQuote'" src/app/page.tsx &amp;&amp;
      grep -q "import Contact from '@/components/sections/Contact'" src/app/page.tsx &amp;&amp;
      grep -q 'id="nang-luc"' src/app/page.tsx &amp;&amp;
      ! grep -q "Phase 1 sentinel" src/app/page.tsx &amp;&amp;
      ! grep -q "debug — remove in Phase 3" src/app/page.tsx &amp;&amp;
      ! grep -q "&lt;details" src/app/page.tsx &amp;&amp;
      npm run build &amp;&amp;
      grep -q "CÔNG TRÌNH BỀN VỮNG" out/index.html &amp;&amp;
      grep -q "BỘ QUỐC PHÒNG" out/index.html &amp;&amp;
      grep -q "Cao tốc Cái Nước" out/index.html &amp;&amp;
      grep -q "YÊU CẦU BÁO GIÁ NGAY HÔM NAY" out/index.html &amp;&amp;
      grep -q "A3-02 KDC Long Phú" out/index.html &amp;&amp;
      grep -q 'id="dich-vu"' out/index.html &amp;&amp;
      grep -q 'id="du-an"' out/index.html &amp;&amp;
      grep -q 'id="nang-luc"' out/index.html &amp;&amp;
      grep -q 'id="doi-tac"' out/index.html &amp;&amp;
      grep -q 'id="lien-he"' out/index.html &amp;&amp;
      grep -q "tel:+84921985599" out/index.html &amp;&amp;
      ! grep -q "zalo://" out/index.html &amp;&amp;
      ! grep -q "Phase 1 sentinel" out/index.html
    </automated>
  </verify>
  <acceptance_criteria>
    - `src/app/page.tsx` imports all 8 section components from `@/components/sections/*` (one import line per section)
    - `src/app/page.tsx` contains `id="nang-luc"` on the wrapping section that contains BigStats + Capabilities
    - `src/app/page.tsx` does NOT contain `Phase 1 sentinel` or `debug — remove in Phase 3` text (sentinel deleted per D-40)
    - `src/app/page.tsx` does NOT contain `<details` element (the Phase 2 debug card pattern is fully removed)
    - `npm run build` exits 0
    - `out/index.html` contains `CÔNG TRÌNH BỀN VỮNG` (Hero rendered to static export)
    - `out/index.html` contains `BỘ QUỐC PHÒNG` (PartnersMarquee rendered)
    - `out/index.html` contains `Cao tốc Cái Nước` (Projects rendered)
    - `out/index.html` contains `YÊU CẦU BÁO GIÁ NGAY HÔM NAY` (CtaQuote rendered)
    - `out/index.html` contains `A3-02 KDC Long Phú` (Contact legal block rendered)
    - `out/index.html` contains all 5 anchor IDs: `id="dich-vu"`, `id="du-an"`, `id="nang-luc"`, `id="doi-tac"`, `id="lien-he"`
    - `out/index.html` contains `tel:+84921985599` (telHref helper resolved at build time)
    - `out/index.html` does NOT contain `zalo://` (Phase 2 HTTPS-only contract preserved — PITFALLS #7 mitigation persists)
    - `out/index.html` does NOT contain `Phase 1 sentinel` (sentinel removed end-to-end)
  </acceptance_criteria>
  <done>`src/app/page.tsx` renders all 8 sections in locked order under a single wrapping `#nang-luc` for BigStats + Capabilities; the Phase 1 sentinel debug card is fully removed; `npm run build` succeeds and `out/index.html` contains every section's signature content + all 5 Nav anchor IDs + a working `tel:+84921985599` link.</done>
</task>

</tasks>

<verification>
**Plan-level verification (run after all 3 tasks complete):**

```bash
cd /Users/congphan/Workspace/my-projects/khang-thing-group/website

# All 8 section files exist and are server components.
for f in Hero PartnersMarquee Services Projects BigStats Capabilities CtaQuote Contact; do
  test -f "src/components/sections/$f.tsx" || { echo "MISSING: $f.tsx"; exit 1; }
  if grep -q "'use client'" "src/components/sections/$f.tsx"; then
    echo "FAIL: $f.tsx unexpectedly client component"; exit 1
  fi
done

# No hardcoded phone digits anywhere in the section files.
! grep -r "0921985599" src/components/sections/ || { echo "FAIL: hardcoded phone digits"; exit 1; }
# No hardcoded email anywhere except via {company.email} template.
! grep -r '"khangthinhinv2025@gmail.com"' src/components/sections/ || { echo "FAIL: hardcoded email string literal"; exit 1; }
# No <img>/<picture>/<video> across all section components.
! grep -rE "<img |<picture |<video " src/components/sections/ || { echo "FAIL: photo/video found"; exit 1; }

# layout.tsx untouched.
grep -q "<Nav />" src/app/layout.tsx
grep -q "<Footer />" src/app/layout.tsx
grep -q "<FloatingZalo />" src/app/layout.tsx

# Final build + static-export smoke.
npm run build
test -f out/index.html
grep -q "CÔNG TRÌNH BỀN VỮNG" out/index.html
grep -q "tel:+84921985599" out/index.html
! grep -q "zalo://" out/index.html
! grep -q "Phase 1 sentinel" out/index.html
```

Build must exit 0; all section signature strings must appear in `out/index.html`; no `zalo://` scheme; sentinel debug card fully removed.
</verification>

<success_criteria>
- 4 new section files created in `src/components/sections/`: BigStats, Capabilities, CtaQuote, Contact (in addition to the 4 from Plan 03-01)
- All 8 section files in `src/components/sections/` are server components (no `'use client'` anywhere)
- `src/app/page.tsx` composes all 8 sections in the locked order Hero → PartnersMarquee → Services → Projects → BigStats → Capabilities → CtaQuote → Contact
- The 5 Nav anchor IDs (`#dich-vu`, `#du-an`, `#nang-luc`, `#doi-tac`, `#lien-he`) are all live in `out/index.html`
- Phase 1 sentinel `<details>` debug card is deleted from `app/page.tsx`
- `src/app/layout.tsx` and `src/components/layout/*` are untouched (Phase 2 shell intact)
- All CTA hrefs (Hero, CtaQuote, Contact ×3) flow through `telHref()` / `zaloHref()` / `mailtoHref()` — never hardcoded
- No `<img>`, `<picture>`, `<video>`, count-up animation, or fake testimonials in any section
- `npm run build` exits 0 and `out/index.html` contains every section's signature string
</success_criteria>

<output>
After completion, create `.planning/phases/03-landing-sections/03-02-stats-close-compose-SUMMARY.md` documenting:
- 4 new section files created (BigStats, Capabilities, CtaQuote, Contact)
- `src/app/page.tsx` rewritten — 8-section composition + sentinel removed
- Final background alternation pattern in use (Hero bone → Partners espresso → Services bone-dark → Projects bone → BigStats bone-dark → Capabilities bone → CtaQuote espresso → Contact bone-dark)
- Capabilities "Cơ giới" icon decision: `Truck` (chosen from Truck-vs-Wrench candidate)
- Contact "Giờ làm việc" decision: omitted (D-31 Claude's Discretion declined — no confirmed business hours commitment)
- Build exit code from `npm run build`
- Confirmation `src/app/layout.tsx` and `src/components/layout/*` were untouched
- Pointer: Phase 3 complete; next is Phase 4 (`lib/projects.ts` extraction + `/du-an` list page).
</output>
