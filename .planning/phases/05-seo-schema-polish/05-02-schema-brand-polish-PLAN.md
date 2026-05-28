---
phase: 5
plan_number: 2
plan_slug: schema-brand-polish
type: execute
wave: 2
depends_on: [05-01]
files_modified:
  - src/app/page.tsx
  - src/app/not-found.tsx
  - src/app/opengraph-image.tsx
  - src/app/icon.tsx
  - src/app/apple-icon.tsx
requirements: [SEO-03, SEO-04, SEO-05, SEO-06]
goal: "Landing emits @graph JSON-LD; build emits og.png + KT favicon (32/180); /404 renders branded full-layout."
autonomous: true
estimated_tasks: 6
must_haves:
  truths:
    - "Visiting / emits a <script type=\"application/ld+json\"> containing a valid JSON.parse-able @graph with TWO nodes (Organization + GeneralContractor) linked via @id"
    - "JSON-LD telephone field equals exactly the E.164 string '+84826553599' (Pitfall #6)"
    - "JSON-LD taxID field equals exactly '1102107064' and all URLs are built from siteUrl (Pitfall #10)"
    - "Build emits a 1200×630 PNG at out/opengraph-image.png (or equivalent Next 15 emit path) — verified by `file` dims output"
    - "Build emits a 32×32 PNG at out/icon.png and a 180×180 PNG at out/apple-icon.png"
    - "Visiting /khong-ton-tai renders out/404.html with Burgundy section + 'Không tìm thấy trang' H1 + 'Về trang chủ' + 'Gọi tư vấn' CTAs + Nav + Footer + FloatingZalo"
    - "Vietnamese diacritics in OG image render correctly (visual probe) OR documented fallback applied"
    - "Build stdout has ZERO metadataBase warnings"
  artifacts:
    - path: "src/app/page.tsx"
      provides: "Landing page with JSON-LD <script> injected ABOVE <main>"
      contains: "application/ld+json"
    - path: "src/app/not-found.tsx"
      provides: "Server-component branded 404 with Burgundy block + 2 CTAs + metadata robots noindex"
      contains: "Không tìm thấy trang"
    - path: "src/app/opengraph-image.tsx"
      provides: "ImageResponse-driven 1200×630 OG image with Be Vietnam Pro font fetch"
      contains: "ImageResponse"
    - path: "src/app/icon.tsx"
      provides: "ImageResponse-driven 32×32 monogram favicon"
      contains: "size = { width: 32, height: 32 }"
    - path: "src/app/apple-icon.tsx"
      provides: "ImageResponse-driven 180×180 monogram favicon with Be Vietnam Pro 900 font fetch"
      contains: "size = { width: 180, height: 180 }"
  key_links:
    - from: "src/app/page.tsx"
      to: "src/lib/site.ts"
      via: "import { siteUrl, company } from '@/lib/site' — JSON-LD fields source from here (Pitfall #10, #6)"
      pattern: "from '@/lib/site'"
    - from: "src/app/not-found.tsx"
      to: "src/lib/site.ts"
      via: "import { telHref } from '@/lib/site' — secondary CTA href"
      pattern: "telHref"
    - from: "src/app/opengraph-image.tsx"
      to: "Google Fonts CSS2 API"
      via: "fetch Be Vietnam Pro weight 400 + 900 at build time"
      pattern: "fonts.googleapis.com/css2"
    - from: "src/app/page.tsx (JSON-LD image field)"
      to: "out/opengraph-image.png"
      via: "JSON-LD image = `${siteUrl}/og.png` references the OG artifact"
      pattern: "og.png"
---

<objective>
Inject a `@graph` JSON-LD block on the landing page (Organization + GeneralContractor nodes per CONTEXT D-04), emit a code-driven 1200×630 OG image + 32px + 180px monogram favicons via Next 15 `ImageResponse`, and ship a branded full-layout 404 page. All five outputs are static-export safe (build-time, no runtime). The Vietnamese-diacritic gate per D-13b is a mandatory step in Task 3 — visual probe before committing to ImageResponse path; fallback documented if Satori fails on Vietnamese tagline.

Purpose: Satisfy SEO-03 (OG image), SEO-04 (JSON-LD GeneralContractor on landing), SEO-05 (favicon multi-size), SEO-06 (custom 404). Provides Google Rich Results + share-card preview + branded browser tab + branded unknown-route landing — the four final SEO surfaces that turn the site from "indexable" to "presentable".

Output:
- `src/app/page.tsx` — edited (JSON-LD <script> injected before <main>)
- `src/app/not-found.tsx` — new file (Burgundy section + 2 CTAs + robots: noindex metadata)
- `src/app/opengraph-image.tsx` — new file (1200×630 ImageResponse, runtime: 'nodejs', Be Vietnam Pro fetch)
- `src/app/icon.tsx` — new file (32×32 monogram "KT" on Burgundy)
- `src/app/apple-icon.tsx` — new file (180×180 monogram with brand font)
- Build verification: out/opengraph-image.png + out/icon.png + out/apple-icon.png + out/404.html + JSON-LD in out/index.html all present and correct
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/REQUIREMENTS.md
@.planning/phases/05-seo-schema-polish/05-CONTEXT.md
@.planning/phases/05-seo-schema-polish/05-RESEARCH.md
@.planning/phases/05-seo-schema-polish/05-01-seo-infrastructure-PLAN.md
@.planning/research/PITFALLS.md
@src/lib/site.ts
@src/app/layout.tsx
@src/app/page.tsx
@src/components/layout/Nav.tsx
@src/components/layout/Footer.tsx
@src/components/layout/FloatingZalo.tsx
@src/app/globals.css
@next.config.ts
@package.json
@/Users/congphan/Workspace/my-projects/khang-thing-group/website/CLAUDE.md

<interfaces>
<!-- Key types and contracts the executor needs. No codebase exploration required. -->

From src/lib/site.ts (do NOT modify — reference only):
```typescript
export const siteUrl: string  // 'https://khangthinhinv.vn' default
export const company: {
  legalName: 'Công ty TNHH Khang Thịnh Investment'
  shortName: 'KHANG THỊNH INV'
  tagline: 'Hợp tác cùng phát triển'
  founded: 2025
  phoneDisplay: '082 6553 599'
  phoneE164: '+84826553599'          // USE THIS in JSON-LD telephone (Pitfall #6)
  phoneRaw: '0826553599'
  email: 'khangthinhinv2025@gmail.com'
  zaloUrl: 'https://zalo.me/0826553599'
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
}
export const telHref: () => string   // 'tel:+84826553599'
```

From src/app/page.tsx (CURRENT — about to be edited):
```typescript
// Imports 8 section components, renders <main> with sections in order.
// Edit point: inject <script type="application/ld+json"> JSON-LD BEFORE the <main> tag,
// as a sibling. Wrap both in a React Fragment <>...</>.
```

From src/app/layout.tsx (do NOT modify):
```typescript
// metadataBase: new URL(siteUrl)         — set Phase 1, MUST NOT regress
// title.template: '%s | Khang Thịnh Investment'
// viewport.themeColor: '#6B1F1F'
// Renders <Nav /> { children } <Footer /> <FloatingZalo /> — auto-wraps not-found.tsx
```

From src/app/globals.css (Burgundy/Bone palette tokens — Tailwind v4 @theme):
```css
/* Tailwind utilities generated by @theme block: */
/* bg-burgundy / bg-bone / text-burgundy / text-bone / border-burgundy etc. */
/* Burgundy = #6B1F1F, Bone = #F5F1EA — use these hex literals in ImageResponse JSX (Satori has no Tailwind) */
```

From next/og (Next 15 built-in — no install needed):
```typescript
import { ImageResponse } from 'next/og'
// new ImageResponse(JSX, { width, height, fonts?: { name, data: ArrayBuffer, weight, style }[] })
// Satori CSS subset: ONLY display: 'flex' or 'none'. No gap. Every multi-child element needs display:flex.
```

From next/dist/lib/metadata/types/metadata-interface:
```typescript
import type { Metadata } from 'next'
// not-found.tsx: export const metadata: Metadata = { title, robots: { index: false, follow: false } }
```

JSON-LD @graph shape this plan introduces (per CONTEXT D-04):
```typescript
{
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'Organization', '@id': `${siteUrl}#organization`, name, alternateName, url, taxID, foundingDate, sameAs },
    { '@type': 'GeneralContractor', '@id': `${siteUrl}#business`, name, image, url, telephone, email,
      address: { '@type': 'PostalAddress', streetAddress, addressLocality, addressRegion, addressCountry },
      taxID, parentOrganization: { '@id': `${siteUrl}#organization` },
      areaServed: [{'@type':'AdministrativeArea', name:'Tây Ninh'}, …Long An, …Cà Mau],
      hasOfferCatalog: { '@type': 'OfferCatalog', itemListElement: [3× Offer with itemOffered Service] }
    }
  ]
}
```
</interfaces>

</context>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Inject @graph JSON-LD on landing page (src/app/page.tsx — SEO-04)</name>
  <files>src/app/page.tsx</files>
  <read_first>
    - src/app/page.tsx (current — 8 sections under <main>; this task adds JSON-LD <script> as sibling BEFORE <main>)
    - src/lib/site.ts (siteUrl + company — every JSON-LD field sources from here)
    - .planning/phases/05-seo-schema-polish/05-CONTEXT.md (D-01..D-06 — exact shape, phone format, image URL)
    - .planning/phases/05-seo-schema-polish/05-RESEARCH.md (Topic 5 — canonical @graph code example)
    - .planning/research/PITFALLS.md (#6 E.164 phone format, #10 URLs from siteUrl)
  </read_first>
  <behavior>
    - File MUST remain a server component (no `'use client'`)
    - Imports added at top: `import { siteUrl, company } from '@/lib/site'` (in addition to existing 8 section imports)
    - A `const jsonLd` constant declared inside `HomePage()` (before the return) following the exact shape in interfaces block above
    - JSON-LD `telephone` = `company.phoneE164` (literally '+84826553599' — Pitfall #6)
    - JSON-LD `taxID` = `company.taxId` (literally '1102107064')
    - JSON-LD `name` (both nodes) = `company.legalName`
    - JSON-LD `alternateName` (Organization) = `company.shortName`
    - JSON-LD `foundingDate` = `String(company.founded)` (Schema.org expects string year)
    - JSON-LD `image` = `${siteUrl}/og.png` per CONTEXT D-04 (Task 3 emits the actual file — note: actual emitted path may be `/opengraph-image.png`; per D-31 CONTEXT planner sets this string here, Task 6 verifies precise filename and updates if needed)
    - JSON-LD `address` PostalAddress object:
      - `streetAddress: company.address.street` ('A3-02 KDC Long Phú')
      - `addressLocality: 'Bến Lức'` (per D-04 — drop the 'xã ' prefix for Schema.org locality format)
      - `addressRegion: 'Tây Ninh'`
      - `addressCountry: 'VN'`
    - JSON-LD `areaServed`: array of 3 `{ '@type': 'AdministrativeArea', name: <region> }` for 'Tây Ninh', 'Long An', 'Cà Mau' (per D-04)
    - JSON-LD `hasOfferCatalog`: OfferCatalog with 3 Offer items wrapping Service `itemOffered` (names per D-04): 'Cung ứng cát, đá, vật liệu san lấp' / 'Xây dựng nhà phố và công trình dân dụng' / 'Vận chuyển đường thủy'
    - JSON-LD `parentOrganization` (on GeneralContractor) = `{ '@id': `${siteUrl}#organization` }` (object reference, NOT inline duplicate)
    - JSON-LD `sameAs` (Organization) = `[siteUrl]` (single self-link until social profiles exist — D-04)
    - Skipped fields per D-05: NO `founder`, NO `openingHours`, NO social URLs beyond siteUrl
    - Inject via `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />` placed as React Fragment sibling BEFORE `<main>` — NOT using `next/script` (per D-03 — JSON-LD parsed at HTML-parse time)
    - Wrap return in `<>...</>` fragment to hold both `<script>` and `<main>`
    - All other existing imports + sections preserved verbatim (no rename, no removal)
  </behavior>
  <action>
Overwrite `src/app/page.tsx` with this exact content (preserving Phase 3 section composition; adding JSON-LD per Phase 5 D-01..D-06):

```typescript
// Phase 3 + Phase 5 — composed landing page with embedded JSON-LD @graph.
//
// Phase 3 (locked): 8 sections rendered in order under <main>.
//   Hero → PartnersMarquee → Services → Projects → (BigStats + Capabilities, wrapped #nang-luc) → CtaQuote → Contact
//
// Phase 5 SEO-04 (D-01..D-06):
//   @graph JSON-LD with TWO nodes — Organization + GeneralContractor — linked via @id.
//   Injected as inline <script type="application/ld+json"> BEFORE <main> (D-03 — NOT next/script).
//   All NAP fields sourced from @/lib/site (Pitfall #6 phone E.164, Pitfall #10 URLs from siteUrl).
//
// Anchor coverage (matches Nav at src/components/layout/Nav.tsx):
//   #dich-vu → Services    #du-an → Projects    #nang-luc → BigStats+Capabilities wrapper
//   #doi-tac → PartnersMarquee    #lien-he → Contact
import Hero from '@/components/sections/Hero'
import PartnersMarquee from '@/components/sections/PartnersMarquee'
import Services from '@/components/sections/Services'
import Projects from '@/components/sections/Projects'
import BigStats from '@/components/sections/BigStats'
import Capabilities from '@/components/sections/Capabilities'
import CtaQuote from '@/components/sections/CtaQuote'
import Contact from '@/components/sections/Contact'
import { siteUrl, company } from '@/lib/site'

export default function HomePage() {
  // Per D-04: @graph with Organization + GeneralContractor.
  // Skipped per D-05: founder, openingHours, social sameAs (no profiles yet).
  // Pitfall #6: telephone MUST be E.164 (+84826553599) — uses company.phoneE164.
  // Pitfall #10: every URL built from siteUrl — never hardcode the domain.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}#organization`,
        name: company.legalName,
        alternateName: company.shortName,
        url: siteUrl,
        taxID: company.taxId,
        foundingDate: String(company.founded),
        sameAs: [siteUrl],
      },
      {
        '@type': 'GeneralContractor',
        '@id': `${siteUrl}#business`,
        name: company.legalName,
        image: `${siteUrl}/og.png`,
        url: siteUrl,
        telephone: company.phoneE164,
        email: company.email,
        address: {
          '@type': 'PostalAddress',
          streetAddress: company.address.street,
          addressLocality: 'Bến Lức',
          addressRegion: company.address.region,
          addressCountry: company.address.country,
        },
        taxID: company.taxId,
        parentOrganization: { '@id': `${siteUrl}#organization` },
        areaServed: [
          { '@type': 'AdministrativeArea', name: 'Tây Ninh' },
          { '@type': 'AdministrativeArea', name: 'Long An' },
          { '@type': 'AdministrativeArea', name: 'Cà Mau' },
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Cung ứng cát, đá, vật liệu san lấp',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Xây dựng nhà phố và công trình dân dụng',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Vận chuyển đường thủy',
              },
            },
          ],
        },
      },
    ],
  }

  return (
    <>
      {/* JSON-LD @graph — D-03: inline <script>, NOT next/script (parsed at HTML-parse time). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
    </>
  )
}
```

Notes:
- The `addressLocality: 'Bến Lức'` is a Schema.org-friendly form (drops the 'xã ' prefix from company.address.locality 'xã Bến Lức'). Footer continues to show the full Vietnamese form via company.address.full — UI and Schema diverge intentionally.
- `image: \`${siteUrl}/og.png\`` is the JSON-LD reference. Task 6 verifies the actual OG file path emitted by Next 15. If it's `/opengraph-image.png` instead, executor must update this string and re-build.
  </action>
  <verify>
    <automated>
bash <<'EOF'
set -e
F="src/app/page.tsx"
echo "--- File exists ---" && test -f "$F"
echo "--- Server component (no 'use client') ---" && ! grep -q "'use client'" "$F"
echo "--- 8 section imports preserved ---"
for c in Hero PartnersMarquee Services Projects BigStats Capabilities CtaQuote Contact; do
  grep -q "import $c from '@/components/sections/$c'" "$F" || { echo "MISSING section import: $c"; exit 1; }
done
echo "--- siteUrl + company imported from @/lib/site ---"
grep -q "import { siteUrl, company } from '@/lib/site'" "$F"
echo "--- @graph with 2 node types ---"
grep -q "'@graph'" "$F"
grep -q "'Organization'" "$F"
grep -q "'GeneralContractor'" "$F"
echo "--- Cross-node @id references ---"
grep -q '${siteUrl}#organization' "$F"
grep -q '${siteUrl}#business' "$F"
grep -q "parentOrganization: { '@id'" "$F"
echo "--- Phone E.164 via company.phoneE164 (Pitfall #6) ---"
grep -q 'telephone: company.phoneE164' "$F"
echo "--- taxID via company.taxId (no hardcode) ---"
grep -q 'taxID: company.taxId' "$F"
echo "--- No hardcoded phone digit string in source (must use helper) ---"
! grep -E '"\+84826553599"' "$F"
echo "--- All 3 areaServed regions (D-04) ---"
grep -q "name: 'Tây Ninh'" "$F"
grep -q "name: 'Long An'" "$F"
grep -q "name: 'Cà Mau'" "$F"
echo "--- All 3 OfferCatalog services (D-04) ---"
grep -q "name: 'Cung ứng cát, đá, vật liệu san lấp'" "$F"
grep -q "name: 'Xây dựng nhà phố và công trình dân dụng'" "$F"
grep -q "name: 'Vận chuyển đường thủy'" "$F"
echo "--- PostalAddress shape ---"
grep -q "'@type': 'PostalAddress'" "$F"
grep -q "addressLocality: 'Bến Lức'" "$F"
grep -q "addressRegion: company.address.region" "$F"
grep -q "addressCountry: company.address.country" "$F"
echo "--- image field references siteUrl + og.png ---"
grep -q 'image: `${siteUrl}/og.png`' "$F"
echo "--- script type=application/ld+json with dangerouslySetInnerHTML ---"
grep -q 'type="application/ld+json"' "$F"
grep -q 'dangerouslySetInnerHTML' "$F"
grep -q 'JSON.stringify(jsonLd)' "$F"
echo "--- NOT using next/script ---"
! grep -q "from 'next/script'" "$F"
echo "--- Fragment wrap (<> ... </>) ---"
grep -q '<>' "$F"
grep -q '</>' "$F"
echo "--- <main> still present with all sections ---"
grep -q '<main className="min-h-screen">' "$F"
grep -q '<Hero />' "$F"
echo "--- foundingDate is String() ---"
grep -q 'foundingDate: String(company.founded)' "$F"
echo "--- Type check ---" && npx tsc --noEmit
echo "PASS"
EOF
    </automated>
  </verify>
  <done>
    - src/app/page.tsx contains a `jsonLd` const with @graph (Organization + GeneralContractor) sourced entirely from siteUrl + company.
    - JSON-LD telephone is `company.phoneE164` (literal '+84826553599' resolves at render — Pitfall #6).
    - All 3 areaServed regions + 3 OfferCatalog services + PostalAddress fields present.
    - <script type="application/ld+json"> injected as Fragment sibling BEFORE <main> via dangerouslySetInnerHTML.
    - Phase 3 8-section composition preserved verbatim.
    - `npx tsc --noEmit` exits 0.
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Create branded 404 page (src/app/not-found.tsx — SEO-06)</name>
  <files>src/app/not-found.tsx</files>
  <read_first>
    - src/app/layout.tsx (confirms Nav/Footer/FloatingZalo auto-wrap not-found.tsx — DO NOT re-import them)
    - src/lib/site.ts (telHref helper for secondary CTA)
    - src/components/layout/Nav.tsx + Footer.tsx + FloatingZalo.tsx (read-only — confirm they ALREADY wrap children, so 404 inherits them)
    - .planning/phases/05-seo-schema-polish/05-CONTEXT.md (D-19..D-23 — server component, Burgundy block, 2 CTAs, noindex metadata)
    - .planning/research/PITFALLS.md (#14 — ship not-found.tsx to override default Next 404)
  </read_first>
  <behavior>
    - File MUST be a server component (NO `'use client'`)
    - Imports: `Metadata` type from 'next', `Link` from 'next/link', `ArrowLeft` + `Phone` from 'lucide-react', `telHref` from '@/lib/site'
    - `export const metadata: Metadata` per D-22:
      - `title: '404 — Không tìm thấy trang'` (does NOT use root template — absolute title)
      - `robots: { index: false, follow: false }` (defensive — prevents indexing of error page)
    - Page structure per D-21:
      - Outer `<section className="bg-burgundy min-h-[60vh] grid place-items-center py-24">`
      - Inner `<div className="max-w-2xl text-bone text-center px-4">`
      - Eyebrow `<p className="font-black text-7xl opacity-60">404</p>`
      - H1 `<h1 className="font-black text-4xl md:text-5xl mt-4">Không tìm thấy trang</h1>`
      - Sub `<p className="text-lg mt-6 opacity-90">Đường dẫn bạn truy cập không tồn tại hoặc đã được di chuyển. Có thể bạn đang tìm những trang sau:</p>`
      - CTA row `<div className="mt-10 flex gap-4 flex-wrap justify-center">` with 2 buttons:
        - Primary: `<Link href="/" className="inline-flex items-center gap-2 min-h-[44px] bg-bone text-burgundy font-bold rounded-md px-6 py-3 hover:bg-bone-dark">` with `<ArrowLeft className="w-4 h-4" />` + "Về trang chủ"
        - Secondary: `<a href={telHref()} className="inline-flex items-center gap-2 min-h-[44px] border-2 border-bone text-bone font-bold rounded-md px-6 py-3 hover:bg-bone hover:text-burgundy">` with `<Phone className="w-4 h-4" />` + "Gọi tư vấn"
    - Both CTAs ≥44×44px tap target (min-h-[44px] + py-3)
    - NO additional Nav/Footer/FloatingZalo imports — root layout wraps automatically
    - NO analytics tracking code (D-23 — defer to Cloudflare Web Analytics in Phase 6)
    - NO client-side hooks
    - Top-of-file comment block matching project style
  </behavior>
  <action>
Write `src/app/not-found.tsx` with this exact content:

```typescript
// SEO-06 — Branded full-layout 404.
//
// Server component (NO 'use client'). Next 15: app/not-found.tsx renders inside root
// layout — Nav + Footer + FloatingZalo wrap automatically (no manual imports needed).
//
// Per CONTEXT D-19..D-23:
//   - Burgundy hero block, min-h-[60vh], centered card
//   - Eyebrow "404" + H1 "Không tìm thấy trang" + sub paragraph + 2 CTAs
//   - Primary CTA: ← Về trang chủ (Link to /)
//   - Secondary CTA: Gọi tư vấn (tel: via telHref helper)
//   - robots: noindex/nofollow (defensive — prevents error page indexing)
//   - No analytics tracking (deferred to Cloudflare Web Analytics in Phase 6)
//
// Pitfall #14: ship this file to override Next.js default 404.
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Phone } from 'lucide-react'
import { telHref } from '@/lib/site'

export const metadata: Metadata = {
  title: '404 — Không tìm thấy trang',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <section className="bg-burgundy min-h-[60vh] grid place-items-center py-24">
      <div className="max-w-2xl text-bone text-center px-4">
        <p className="font-black text-7xl opacity-60">404</p>
        <h1 className="font-black text-4xl md:text-5xl mt-4">
          Không tìm thấy trang
        </h1>
        <p className="text-lg mt-6 opacity-90">
          Đường dẫn bạn truy cập không tồn tại hoặc đã được di chuyển. Có thể bạn đang tìm những trang sau:
        </p>
        <div className="mt-10 flex gap-4 flex-wrap justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 min-h-[44px] bg-bone text-burgundy font-bold rounded-md px-6 py-3 hover:bg-bone-dark"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Về trang chủ</span>
          </Link>
          <a
            href={telHref()}
            className="inline-flex items-center gap-2 min-h-[44px] border-2 border-bone text-bone font-bold rounded-md px-6 py-3 hover:bg-bone hover:text-burgundy"
          >
            <Phone className="w-4 h-4" aria-hidden="true" />
            <span>Gọi tư vấn</span>
          </a>
        </div>
      </div>
    </section>
  )
}
```

Notes:
- The "Có thể bạn đang tìm những trang sau:" copy implies a navigation hint — Nav already provides this (auto-wrapped from root layout). The phrasing is acceptable as written; Phase 6 native-copy review may tweak.
- Do NOT add a third CTA to /du-an — keeps focus on the 2 most important paths (home + phone).
  </action>
  <verify>
    <automated>
bash <<'EOF'
set -e
F="src/app/not-found.tsx"
echo "--- File exists ---" && test -f "$F"
echo "--- Server component (no 'use client') ---" && ! grep -q "'use client'" "$F"
echo "--- Metadata type imported ---" && grep -q "import type { Metadata } from 'next'" "$F"
echo "--- Link imported ---" && grep -q "import Link from 'next/link'" "$F"
echo "--- ArrowLeft + Phone imported from lucide ---" && grep -q "import { ArrowLeft, Phone } from 'lucide-react'" "$F"
echo "--- telHref imported from @/lib/site ---" && grep -q "import { telHref } from '@/lib/site'" "$F"
echo "--- Metadata title exact ---" && grep -q "title: '404 — Không tìm thấy trang'" "$F"
echo "--- robots noindex ---" && grep -q 'robots: { index: false, follow: false }' "$F"
echo "--- Burgundy hero block ---" && grep -q 'className="bg-burgundy min-h-\[60vh\] grid place-items-center py-24"' "$F"
echo "--- Eyebrow 404 ---" && grep -q '<p className="font-black text-7xl opacity-60">404</p>' "$F"
echo "--- H1 Không tìm thấy trang ---" && grep -q '<h1' "$F" && grep -q 'Không tìm thấy trang' "$F"
echo "--- Sub paragraph fragment ---" && grep -q 'Đường dẫn bạn truy cập không tồn tại' "$F"
echo "--- Primary CTA: Về trang chủ, Link to / ---"
grep -q 'Về trang chủ' "$F"
grep -q '<Link' "$F"
grep -q 'href="/"' "$F"
echo "--- Secondary CTA: Gọi tư vấn, telHref ---"
grep -q 'Gọi tư vấn' "$F"
grep -q 'href={telHref()}' "$F"
echo "--- Both CTAs have min-h-[44px] ---"
[ "$(grep -c 'min-h-\[44px\]' "$F")" -ge 2 ]
echo "--- No Nav/Footer/FloatingZalo imports (auto-wrap) ---"
! grep -q "from '@/components/layout/Nav'" "$F"
! grep -q "from '@/components/layout/Footer'" "$F"
! grep -q "from '@/components/layout/FloatingZalo'" "$F"
echo "--- No analytics imports ---"
! grep -qi 'analytics' "$F"
echo "--- Type check ---" && npx tsc --noEmit
echo "PASS"
EOF
    </automated>
  </verify>
  <done>
    - src/app/not-found.tsx server component with metadata (title + robots:noindex), Burgundy section, H1 "Không tìm thấy trang", 2 CTAs (Về trang chủ + Gọi tư vấn) ≥44px tap targets.
    - No client directives, no Nav/Footer/FloatingZalo imports (auto-wrap).
    - `npx tsc --noEmit` exits 0.
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 3: Create OG image generator with Vietnamese diacritic gate (src/app/opengraph-image.tsx — SEO-03)</name>
  <files>src/app/opengraph-image.tsx</files>
  <read_first>
    - src/lib/site.ts (siteUrl reference — currently not used inside ImageResponse JSX, but kept for future per-page extension)
    - .planning/phases/05-seo-schema-polish/05-CONTEXT.md (D-07..D-13b — layout, font strategy, MANDATORY Vietnamese diacritic gate)
    - .planning/phases/05-seo-schema-polish/05-RESEARCH.md (Topic 3 — canonical ImageResponse code; Satori CSS subset; runtime: 'nodejs' requirement under output: 'export')
    - src/app/globals.css (palette hex literals — Burgundy #6B1F1F, Bone #F5F1EA. Note: D-09 spec mentions #FAF8F2 for Bone in OG — use spec value, not globals.css token, since Satori has no Tailwind)
  </read_first>
  <behavior>
    - File MUST be `src/app/opengraph-image.tsx` (.tsx required for ImageResponse JSX)
    - Required exports per Next 15 file convention:
      - `export const runtime = 'nodejs'` (REQUIRED under output: 'export' per RESEARCH Topic 3 — default 'edge' won't work with static export PNG emit)
      - `export const alt = 'Khang Thịnh Investment — Cung ứng VLXD, Xây dựng, Vận chuyển'` (D-13)
      - `export const size = { width: 1200, height: 630 }` (D-08)
      - `export const contentType = 'image/png'`
      - `export default async function OGImage()` returning `ImageResponse(<JSX>, { ...size, fonts: [...] })`
    - Font fetch helper `loadFont(weight)`:
      - Uses RESEARCH Topic 3 canonical pattern: fetch CSS2 API with `subset=vietnamese` query param, regex out the .woff2 URL, fetch and return ArrayBuffer
      - Throws on regex miss (forces visible build failure rather than silent fallback)
      - User-Agent header required (Google Fonts CSS2 returns different format without it)
    - Load BOTH weights 400 (regular) and 900 (black) via `Promise.all` — needed for tagline (400 italic) + brand name (900)
    - JSX layout per D-09 (Satori CSS subset — `display: 'flex'` on EVERY multi-child element):
      - Outer container: width '100%', height '100%', background '#6B1F1F', color '#FAF8F2', display 'flex', flexDirection 'column', padding '80px', justifyContent 'space-between', fontFamily 'Be Vietnam Pro'
      - Top block (display flex column): "KHANG THỊNH INV" (fontSize 96, fontWeight 900, letterSpacing -2px) + 60×4 white rule (marginTop 24)
      - Mid block (display flex column): "Cung ứng VLXD · Xây dựng · Vận chuyển" (fontSize 48, fontWeight 400, opacity 0.95) + italic tagline (fontSize 36, fontStyle italic, opacity 0.8, marginTop 16)
      - Bottom-right: "khangthinhinv.vn" (fontSize 28, opacity 0.6, alignSelf 'flex-end')
    - NO Tailwind classes — Satori does not parse className. Use ONLY inline `style={{ ... }}` objects.
    - NO `gap` property in flex (Satori unsupported — use marginTop/marginBottom)
    - Fonts option passes BOTH loaded fonts: `fonts: [{ name: 'Be Vietnam Pro', data: regular, weight: 400, style: 'normal' }, { name: 'Be Vietnam Pro', data: black, weight: 900, style: 'normal' }]`
    - **MANDATORY VIETNAMESE DIACRITIC PROBE (D-13b)**: This task includes a verify step that builds, opens out/opengraph-image.png (or whatever emits), and visually checks Vietnamese diacritics. If broken, executor MUST document fallback in `.planning/phases/05-seo-schema-polish/05-02-VERIFICATION.md` choosing Option A (drop tagline, ASCII-only middle row) or Option B (commit static PNG, delete .tsx).
  </behavior>
  <action>
Write `src/app/opengraph-image.tsx` with this exact content (verbatim from RESEARCH Topic 3 with project-specific tagline + brand fields):

```typescript
// SEO-03 — Open Graph 1200×630 image generated at build time.
//
// Per CONTEXT D-07..D-13b:
//   - Next 15 file convention: app/opengraph-image.tsx → ImageResponse from 'next/og'
//   - Static export safe: runtime 'nodejs', no Request-time APIs, emits PNG at build
//   - Burgundy #6B1F1F bg, Bone #FAF8F2 text — palette matches viewport.themeColor
//   - Brand name (font-weight 900) + service line (400) + italic tagline + footer URL
//   - Fonts fetched from Google Fonts CSS2 API with subset=vietnamese (Pitfall: Satori
//     won't render Vietnamese diacritics without the proper subset). Both 400 + 900
//     weights loaded — tagline 400 italic, brand name 900.
//
// Satori CSS subset gotchas (RESEARCH Topic 3 + Pitfall #14):
//   - ONLY display: 'flex' or 'none' — no 'block' / 'inline-block'
//   - Every multi-child element MUST set display: 'flex' explicitly
//   - NO 'gap' in flex — use marginTop/marginBottom
//   - NO className / NO Tailwind — inline style={{ }} only
//
// Vietnamese diacritic gate (D-13b): MANDATORY visual probe of out/opengraph-image.png
// post-build. If diacritics broken in 'Hợp tác cùng phát triển', trigger fallback:
//   Option A: drop tagline, use ASCII-only mid row ('Supply · Building · Logistics' or similar)
//   Option B: commit static PNG to public/og-image.png + delete this .tsx + update layout.tsx metadata
//   Document choice in .planning/phases/05-seo-schema-polish/05-02-VERIFICATION.md
import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const alt = 'Khang Thịnh Investment — Cung ứng VLXD, Xây dựng, Vận chuyển'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

async function loadFont(weight: 400 | 900): Promise<ArrayBuffer> {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@${weight}&subset=vietnamese`,
    { headers: { 'User-Agent': 'Mozilla/5.0' } }
  ).then((r) => r.text())
  const url = css.match(/url\((https:\/\/[^)]+\.woff2)\)/)?.[1]
  if (!url) {
    throw new Error(`Be Vietnam Pro ${weight} font URL not found in Google CSS response`)
  }
  return fetch(url).then((r) => r.arrayBuffer())
}

export default async function OGImage(): Promise<ImageResponse> {
  const [regular, black] = await Promise.all([loadFont(400), loadFont(900)])
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#6B1F1F',
          color: '#FAF8F2',
          display: 'flex',
          flexDirection: 'column',
          padding: '80px',
          justifyContent: 'space-between',
          fontFamily: 'Be Vietnam Pro',
        }}
      >
        {/* Top block — brand wordmark + rule */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 900,
              letterSpacing: '-2px',
            }}
          >
            KHANG THỊNH INV
          </div>
          <div
            style={{
              width: 60,
              height: 4,
              background: '#FAF8F2',
              opacity: 0.9,
              marginTop: 24,
            }}
          />
        </div>

        {/* Mid block — services + italic tagline */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 48, fontWeight: 400, opacity: 0.95 }}>
            Cung ứng VLXD · Xây dựng · Vận chuyển
          </div>
          <div
            style={{
              fontSize: 36,
              fontStyle: 'italic',
              opacity: 0.8,
              marginTop: 16,
            }}
          >
            Hợp tác cùng phát triển
          </div>
        </div>

        {/* Bottom-right — URL */}
        <div
          style={{
            display: 'flex',
            fontSize: 28,
            opacity: 0.6,
            alignSelf: 'flex-end',
          }}
        >
          khangthinhinv.vn
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Be Vietnam Pro', data: regular, weight: 400, style: 'normal' },
        { name: 'Be Vietnam Pro', data: black, weight: 900, style: 'normal' },
      ],
    }
  )
}
```

Notes:
- Type assertion `Promise<ImageResponse>` keeps tsc strict happy.
- The italic style on the tagline uses Satori's `fontStyle: 'italic'` — Satori synthesizes italic from the regular weight when no italic font is provided (acceptable trade-off; if synthesized italic looks bad in the probe, swap to non-italic with reduced opacity).
  </action>
  <verify>
    <automated>
bash <<'EOF'
set -e
F="src/app/opengraph-image.tsx"
echo "--- File exists ---" && test -f "$F"
echo "--- Imports ImageResponse from next/og ---" && grep -q "import { ImageResponse } from 'next/og'" "$F"
echo "--- runtime = 'nodejs' (D-07 / RESEARCH Topic 3) ---" && grep -q "export const runtime = 'nodejs'" "$F"
echo "--- alt exact (D-13) ---" && grep -q "export const alt = 'Khang Thịnh Investment — Cung ứng VLXD, Xây dựng, Vận chuyển'" "$F"
echo "--- size 1200x630 (D-08) ---" && grep -q 'export const size = { width: 1200, height: 630 }' "$F"
echo "--- contentType png ---" && grep -q "export const contentType = 'image/png'" "$F"
echo "--- Default async OGImage export ---" && grep -q 'export default async function OGImage' "$F"
echo "--- loadFont helper present ---" && grep -q 'async function loadFont' "$F"
echo "--- subset=vietnamese in CSS2 URL ---" && grep -q 'subset=vietnamese' "$F"
echo "--- Both fonts fetched (400 + 900) ---" && grep -q 'loadFont(400)' "$F" && grep -q 'loadFont(900)' "$F"
echo "--- Promise.all for fonts ---" && grep -q 'Promise.all' "$F"
echo "--- Burgundy #6B1F1F bg ---" && grep -q "background: '#6B1F1F'" "$F"
echo "--- Bone #FAF8F2 color ---" && grep -q "color: '#FAF8F2'" "$F"
echo "--- KHANG THỊNH INV present ---" && grep -q 'KHANG THỊNH INV' "$F"
echo "--- Services line present ---" && grep -q 'Cung ứng VLXD · Xây dựng · Vận chuyển' "$F"
echo "--- Tagline present ---" && grep -q 'Hợp tác cùng phát triển' "$F"
echo "--- Footer URL ---" && grep -q 'khangthinhinv.vn' "$F"
echo "--- fontFamily Be Vietnam Pro ---" && grep -q "fontFamily: 'Be Vietnam Pro'" "$F"
echo "--- No Tailwind className inside JSX ---"
! grep -qE 'className="bg-' "$F"
echo "--- No gap property (Satori unsupported) ---"
! grep -qE "gap: [0-9]" "$F"
echo "--- Type check ---" && npx tsc --noEmit
echo "PASS"
EOF
    </automated>
  </verify>
  <done>
    - src/app/opengraph-image.tsx exists with runtime='nodejs', size 1200×630, contentType 'image/png', alt text exact per D-13.
    - loadFont(400) + loadFont(900) helpers fetch Be Vietnam Pro via Google Fonts CSS2 API with subset=vietnamese.
    - JSX uses ONLY display:flex (Satori subset), no gap, no Tailwind.
    - Default export ImageResponse with both fonts registered.
    - `npx tsc --noEmit` exits 0.
    - Visual diacritic gate runs in Task 6 (post-build) — fallback documented if broken.
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 4: Create 32×32 favicon (src/app/icon.tsx — SEO-05)</name>
  <files>src/app/icon.tsx</files>
  <read_first>
    - .planning/phases/05-seo-schema-polish/05-CONTEXT.md (D-14..D-17 — monogram KT on Burgundy, 32×32 sizing)
    - .planning/phases/05-seo-schema-polish/05-RESEARCH.md (Topic 4 — icon.tsx file convention, font note: 32×32 system font OK)
  </read_first>
  <behavior>
    - File MUST be `src/app/icon.tsx` (sibling of opengraph-image.tsx)
    - Required exports:
      - `export const runtime = 'nodejs'` (parallel to OG — keeps consistency)
      - `export const size = { width: 32, height: 32 }`
      - `export const contentType = 'image/png'`
      - `export default function Icon()` returning `ImageResponse(<JSX>, { ...size })`
    - NO font fetch (RESEARCH Topic 4 note — "KT" is basic Latin, Satori bundled fallback renders fine at 32px; saves a network call per build)
    - JSX per D-15:
      - Outer div: width '100%', height '100%', background '#6B1F1F', color '#FAF8F2', display 'flex', alignItems 'center', justifyContent 'center', fontSize 18, fontWeight 900, borderRadius 5, letterSpacing '-1px'
      - Text content: "KT" (2 chars)
    - NO custom font registration — Satori system fallback is sufficient at 32px
    - If post-build inspection shows "KT" rendering as boxes (□), fallback: register Be Vietnam Pro 900 (copy loadFont from Task 3) — but RESEARCH Topic 4 explicit: system fallback OK for basic Latin
  </behavior>
  <action>
Write `src/app/icon.tsx` with this exact content:

```typescript
// SEO-05 — 32×32 favicon emitted at build time.
//
// Per CONTEXT D-14..D-17 + RESEARCH Topic 4:
//   - Monogram "KT" on Burgundy #6B1F1F block, Bone #FAF8F2 text
//   - 32×32 (browser scales for 16×16 too)
//   - No custom font — basic Latin glyphs render fine via Satori system fallback at this size
//   - borderRadius ~15% for soft-rounded square
//
// Next 15 auto-wires <link rel="icon"> in <head> — no manual layout.tsx change needed.
import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#6B1F1F',
          color: '#FAF8F2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          fontWeight: 900,
          borderRadius: 5,
          letterSpacing: '-1px',
        }}
      >
        KT
      </div>
    ),
    { ...size }
  )
}
```
  </action>
  <verify>
    <automated>
bash <<'EOF'
set -e
F="src/app/icon.tsx"
echo "--- File exists ---" && test -f "$F"
echo "--- Imports ImageResponse ---" && grep -q "import { ImageResponse } from 'next/og'" "$F"
echo "--- runtime nodejs ---" && grep -q "export const runtime = 'nodejs'" "$F"
echo "--- size 32x32 ---" && grep -q 'export const size = { width: 32, height: 32 }' "$F"
echo "--- contentType png ---" && grep -q "export const contentType = 'image/png'" "$F"
echo "--- Default export ---" && grep -q 'export default function Icon' "$F"
echo "--- Burgundy bg ---" && grep -q "background: '#6B1F1F'" "$F"
echo "--- Bone color ---" && grep -q "color: '#FAF8F2'" "$F"
echo "--- KT text content ---" && grep -q '>KT<' "$F"
echo "--- borderRadius 5 ---" && grep -q 'borderRadius: 5' "$F"
echo "--- fontWeight 900 ---" && grep -q 'fontWeight: 900' "$F"
echo "--- fontSize 18 ---" && grep -q 'fontSize: 18' "$F"
echo "--- display:flex (Satori) ---" && grep -q "display: 'flex'" "$F"
echo "--- No font fetch (per RESEARCH Topic 4) ---" && ! grep -q 'fonts.googleapis.com' "$F"
echo "--- Type check ---" && npx tsc --noEmit
echo "PASS"
EOF
    </automated>
  </verify>
  <done>
    - src/app/icon.tsx exists with size 32×32, contentType 'image/png', default-exported Icon function returning ImageResponse with Burgundy bg + Bone "KT".
    - No font fetch (system fallback sufficient at 32px per RESEARCH Topic 4).
    - `npx tsc --noEmit` exits 0.
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 5: Create 180×180 apple-icon (src/app/apple-icon.tsx — SEO-05)</name>
  <files>src/app/apple-icon.tsx</files>
  <read_first>
    - src/app/icon.tsx (Task 4 output — same structure, different dims + brand font)
    - .planning/phases/05-seo-schema-polish/05-CONTEXT.md (D-14..D-16 — 180×180 size, brand font for larger canvas)
    - .planning/phases/05-seo-schema-polish/05-RESEARCH.md (Topic 4 — font note: at 110px font size, brand font matters for readability)
  </read_first>
  <behavior>
    - File MUST be `src/app/apple-icon.tsx`
    - Same export structure as icon.tsx but:
      - `size = { width: 180, height: 180 }`
      - fontSize 110 (per Task 5 description in prompt)
      - borderRadius 28 (~15% of 180)
      - DOES fetch Be Vietnam Pro 900 via loadFont helper (per prompt — brand font needed for readability at 180px)
      - Default export is `async function AppleIcon()` (async because of font fetch)
    - loadFont helper: duplicate the helper from Task 3 inside apple-icon.tsx (Next 15 file convention isolates each route handler — no shared module needed; small duplication is fine since each file is bundled separately)
    - Only weight 900 needed (no italic/regular)
    - Otherwise identical to icon.tsx: Burgundy bg, Bone "KT", letterSpacing -1px (or scaled), centered
    - Register the loaded font under `fonts: [{ name: 'Be Vietnam Pro', data: black, weight: 900, style: 'normal' }]`
    - Add `fontFamily: 'Be Vietnam Pro'` to the outer div style so Satori uses the registered font
  </behavior>
  <action>
Write `src/app/apple-icon.tsx` with this exact content:

```typescript
// SEO-05 — 180×180 apple-touch-icon emitted at build time.
//
// Per CONTEXT D-14..D-16 + RESEARCH Topic 4:
//   - Monogram "KT" on Burgundy #6B1F1F block, Bone #FAF8F2 text
//   - 180×180 (iOS home-screen size)
//   - DOES fetch Be Vietnam Pro 900 — at 110px font size, brand font readability matters
//     (vs icon.tsx 32×32 which uses system fallback)
//   - borderRadius 28 (~15% of 180)
//
// Next 15 auto-wires <link rel="apple-touch-icon"> in <head>.
//
// Note: loadFont helper duplicated from opengraph-image.tsx — each Next 15 route
// handler is bundled separately, so sharing via @/lib is unnecessary overhead.
import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

async function loadFont(weight: 900): Promise<ArrayBuffer> {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@${weight}&subset=vietnamese`,
    { headers: { 'User-Agent': 'Mozilla/5.0' } }
  ).then((r) => r.text())
  const url = css.match(/url\((https:\/\/[^)]+\.woff2)\)/)?.[1]
  if (!url) {
    throw new Error(`Be Vietnam Pro ${weight} font URL not found in Google CSS response`)
  }
  return fetch(url).then((r) => r.arrayBuffer())
}

export default async function AppleIcon(): Promise<ImageResponse> {
  const black = await loadFont(900)
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#6B1F1F',
          color: '#FAF8F2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 110,
          fontWeight: 900,
          borderRadius: 28,
          letterSpacing: '-4px',
          fontFamily: 'Be Vietnam Pro',
        }}
      >
        KT
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Be Vietnam Pro', data: black, weight: 900, style: 'normal' },
      ],
    }
  )
}
```
  </action>
  <verify>
    <automated>
bash <<'EOF'
set -e
F="src/app/apple-icon.tsx"
echo "--- File exists ---" && test -f "$F"
echo "--- Imports ImageResponse ---" && grep -q "import { ImageResponse } from 'next/og'" "$F"
echo "--- runtime nodejs ---" && grep -q "export const runtime = 'nodejs'" "$F"
echo "--- size 180x180 ---" && grep -q 'export const size = { width: 180, height: 180 }' "$F"
echo "--- contentType png ---" && grep -q "export const contentType = 'image/png'" "$F"
echo "--- Default async export ---" && grep -q 'export default async function AppleIcon' "$F"
echo "--- loadFont helper present ---" && grep -q 'async function loadFont' "$F"
echo "--- subset=vietnamese ---" && grep -q 'subset=vietnamese' "$F"
echo "--- Burgundy bg ---" && grep -q "background: '#6B1F1F'" "$F"
echo "--- Bone color ---" && grep -q "color: '#FAF8F2'" "$F"
echo "--- KT text ---" && grep -q '>KT<' "$F"
echo "--- fontSize 110 ---" && grep -q 'fontSize: 110' "$F"
echo "--- borderRadius 28 ---" && grep -q 'borderRadius: 28' "$F"
echo "--- fontFamily Be Vietnam Pro ---" && grep -q "fontFamily: 'Be Vietnam Pro'" "$F"
echo "--- fonts array with weight 900 ---" && grep -q "weight: 900" "$F"
echo "--- Type check ---" && npx tsc --noEmit
echo "PASS"
EOF
    </automated>
  </verify>
  <done>
    - src/app/apple-icon.tsx exists with size 180×180, contentType 'image/png', async default-exported AppleIcon function.
    - loadFont(900) fetches Be Vietnam Pro Black, registered in ImageResponse fonts option.
    - JSX uses Burgundy bg + Bone "KT" at fontSize 110, borderRadius 28, fontFamily 'Be Vietnam Pro'.
    - `npx tsc --noEmit` exits 0.
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 6: Build + verify all 6 outputs (PNG dims, JSON-LD parseable, 404 content, diacritic gate)</name>
  <files>.planning/phases/05-seo-schema-polish/05-02-VERIFICATION.md</files>
  <read_first>
    - next.config.ts (output: 'export' — confirms PNG + 404 emit to out/)
    - .planning/phases/05-seo-schema-polish/05-CONTEXT.md (D-31 — exact success surface table; D-13b — mandatory Vietnamese diacritic probe + fallback options)
    - .planning/research/PITFALLS.md (#6 phone format, #10 URLs from siteUrl, #14 default 404, #15 metadataBase warning)
  </read_first>
  <behavior>
    - `npm run build` exits 0 with no errors and zero metadataBase warnings
    - All 6 build artifacts present:
      1. `out/index.html` contains `<script type="application/ld+json">` block
      2. JSON-LD parseable via `node -e` — contains both Organization + GeneralContractor nodes
      3. JSON-LD contains exact strings: `+84826553599`, `1102107064`, `Tây Ninh`, `Long An`, `Cà Mau`
      4. `out/opengraph-image.png` exists, dims 1200×630 (verify via `file` or `identify`)
      5. `out/icon.png` exists, dims 32×32
      6. `out/apple-icon.png` exists, dims 180×180
      7. `out/404.html` exists, contains: Burgundy block markers, "Không tìm thấy trang", "Về trang chủ", "Gọi tư vấn", `+84826553599` (Footer auto-wrap), `zalo.me/0826553599` (FloatingZalo auto-wrap)
    - **VIETNAMESE DIACRITIC GATE (D-13b)**: Open out/opengraph-image.png and visually verify these diacritics render correctly: ợ ù á ể ấ ầ ợ ạ ậ ự ế á ử ơ ậ. On macOS: `open out/opengraph-image.png`. If broken, executor MUST:
      - Document choice in `.planning/phases/05-seo-schema-polish/05-02-VERIFICATION.md`
      - Apply Option A (drop Vietnamese tagline, use ASCII content) by editing src/app/opengraph-image.tsx
      - OR apply Option B (commit static PNG to public/og-image.png, delete src/app/opengraph-image.tsx, update layout.tsx metadata.openGraph.images)
      - Re-run build and re-verify
    - Sanity: existing routes still emit (out/sitemap.xml, out/robots.txt, out/du-an/index.html, out/index.html — all still present)
    - TypeScript: `npx tsc --noEmit` exits 0
  </behavior>
  <action>
Run clean build, inspect all 6 outputs, run Vietnamese diacritic visual gate, and write VERIFICATION.md documenting the result.

```bash
rm -rf out .next
npm run build 2>&1 | tee /tmp/build-05-02.log
ls -la out/ | head -50
file out/opengraph-image.png out/icon.png out/apple-icon.png 2>/dev/null || file out/og.png out/favicon* out/apple-touch-icon* 2>/dev/null
```

After the automated greps pass, MANUALLY:
1. `open out/opengraph-image.png` (macOS) OR `xdg-open out/opengraph-image.png` (Linux)
2. Inspect the tagline "Hợp tác cùng phát triển" — every diacritic visible, no boxes, no missing glyphs, no stacked-on-wrong-base marks
3. Inspect "Cung ứng VLXD · Xây dựng · Vận chuyển" — same scrutiny
4. Write `.planning/phases/05-seo-schema-polish/05-02-VERIFICATION.md` with:
   - Date + verifier
   - PASS or FAIL for each of the 6 artifacts
   - Vietnamese diacritic probe result (PASS / Option A applied / Option B applied)
   - Build log excerpt showing zero metadataBase warnings
   - Final file listing of out/ relevant artifacts
  </action>
  <verify>
    <automated>
bash <<'EOF'
set -e
echo "--- Clean build ---"
rm -rf out .next
npm run build 2>&1 | tee /tmp/build-05-02.log
echo "--- npm run build exited 0 ---"

echo "--- No metadataBase warning (Pitfall #15) ---"
! grep -i 'metadataBase' /tmp/build-05-02.log || { echo "FAIL: metadataBase regression"; exit 1; }

echo "--- out/index.html JSON-LD <script> present ---"
test -f out/index.html
grep -q 'application/ld+json' out/index.html

echo "--- Extract JSON-LD content and JSON.parse it ---"
# Extract the JSON between the script tags; node parses + validates @graph
node -e "
  const fs = require('fs');
  const html = fs.readFileSync('out/index.html', 'utf8');
  const match = html.match(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/);
  if (!match) { console.error('FAIL: no JSON-LD script block'); process.exit(1); }
  const data = JSON.parse(match[1]);
  if (data['@context'] !== 'https://schema.org') { console.error('FAIL: @context wrong'); process.exit(1); }
  if (!Array.isArray(data['@graph'])) { console.error('FAIL: @graph not array'); process.exit(1); }
  const types = data['@graph'].map(n => n['@type']);
  if (!types.includes('Organization')) { console.error('FAIL: no Organization'); process.exit(1); }
  if (!types.includes('GeneralContractor')) { console.error('FAIL: no GeneralContractor'); process.exit(1); }
  const gc = data['@graph'].find(n => n['@type'] === 'GeneralContractor');
  if (gc.telephone !== '+84826553599') { console.error('FAIL: telephone not +84826553599 (Pitfall #6)'); process.exit(1); }
  if (gc.taxID !== '1102107064') { console.error('FAIL: taxID not 1102107064'); process.exit(1); }
  if (gc.address.addressLocality !== 'Bến Lức') { console.error('FAIL: addressLocality not Bến Lức'); process.exit(1); }
  const regions = gc.areaServed.map(a => a.name);
  for (const r of ['Tây Ninh', 'Long An', 'Cà Mau']) {
    if (!regions.includes(r)) { console.error('FAIL: areaServed missing ' + r); process.exit(1); }
  }
  if (gc.hasOfferCatalog.itemListElement.length !== 3) { console.error('FAIL: not 3 offers'); process.exit(1); }
  console.log('JSON-LD parse: PASS');
"

echo "--- out/opengraph-image.png exists at 1200x630 ---"
# Next 15 may emit at out/opengraph-image.png OR out/og.png OR hashed name — accept any
OG_FILE=$(ls out/ | grep -E '^(opengraph-image|og)\.(png)$' | head -1)
if [ -z "$OG_FILE" ]; then
  echo "Falling back to recursive find..."
  OG_FILE=$(find out -maxdepth 3 -name 'opengraph-image*.png' -o -name 'og.png' | head -1)
fi
test -n "$OG_FILE" || { echo "FAIL: no OG image emitted"; ls -la out/; exit 1; }
echo "OG file: $OG_FILE"
file "$OG_FILE" | grep -qE '1200 ?x ?630' || { echo "FAIL: OG not 1200x630"; file "$OG_FILE"; exit 1; }

echo "--- out/icon.png exists at 32x32 ---"
ICON_FILE=$(ls out/ | grep -E '^icon[^/]*\.png$' | head -1)
if [ -z "$ICON_FILE" ]; then
  ICON_FILE=$(find out -maxdepth 3 -name 'icon*.png' -not -name 'apple-icon*' | head -1)
fi
test -n "$ICON_FILE" || { echo "FAIL: no 32x32 icon"; exit 1; }
file "out/$ICON_FILE" 2>/dev/null | grep -qE '32 ?x ?32' || file "$ICON_FILE" | grep -qE '32 ?x ?32' || { echo "FAIL: icon not 32x32"; exit 1; }

echo "--- out/apple-icon.png exists at 180x180 ---"
APPLE_FILE=$(ls out/ | grep -E '^apple-icon[^/]*\.png$' | head -1)
if [ -z "$APPLE_FILE" ]; then
  APPLE_FILE=$(find out -maxdepth 3 -name 'apple-icon*.png' | head -1)
fi
test -n "$APPLE_FILE" || { echo "FAIL: no 180x180 apple-icon"; exit 1; }
file "out/$APPLE_FILE" 2>/dev/null | grep -qE '180 ?x ?180' || file "$APPLE_FILE" | grep -qE '180 ?x ?180' || { echo "FAIL: apple-icon not 180x180"; exit 1; }

echo "--- out/404.html exists with branded content ---"
test -f out/404.html
grep -q 'Không tìm thấy trang' out/404.html
grep -q 'Về trang chủ' out/404.html
grep -q 'Gọi tư vấn' out/404.html
grep -q 'bg-burgundy' out/404.html
echo "--- 404 includes Nav/Footer/FloatingZalo (auto-wrap proof) ---"
grep -q '+84826553599' out/404.html  # Footer telHref
grep -q 'zalo.me/0826553599' out/404.html  # FloatingZalo + Footer
grep -q 'KHANG THỊNH INV' out/404.html  # Nav wordmark + Footer

echo "--- 404 has noindex meta ---"
grep -qE 'name="robots"[^>]*content="[^"]*noindex' out/404.html

echo "--- Sanity: Phase 5-01 artifacts still emit ---"
test -f out/sitemap.xml
test -f out/robots.txt
test -f out/du-an/index.html

echo "--- TypeScript clean ---"
npx tsc --noEmit

echo ""
echo "============================================================"
echo "AUTOMATED GATES: PASS"
echo "============================================================"
echo ""
echo "MANDATORY MANUAL STEP (D-13b — Vietnamese diacritic gate):"
echo "  1. Open the OG image: open $OG_FILE  (macOS) OR xdg-open $OG_FILE  (Linux)"
echo "  2. Verify diacritics render correctly in:"
echo "     - 'Hợp tác cùng phát triển'"
echo "     - 'Cung ứng VLXD · Xây dựng · Vận chuyển'"
echo "  3. Document result in .planning/phases/05-seo-schema-polish/05-02-VERIFICATION.md:"
echo "     - PASS → record 'Vietnamese diacritic probe: PASS' + screenshot path"
echo "     - FAIL → apply Option A (drop tagline) OR Option B (static PNG), re-build, re-verify"
echo ""
EOF
    </automated>
  </verify>
  <done>
    - `npm run build` exits 0; zero metadataBase warnings.
    - JSON-LD on out/index.html JSON.parse-able; contains Organization + GeneralContractor with telephone '+84826553599', taxID '1102107064', addressLocality 'Bến Lức', 3 areaServed regions, 3 OfferCatalog services.
    - out/opengraph-image.png (or equivalent emit path) at 1200×630.
    - out/icon.png at 32×32, out/apple-icon.png at 180×180.
    - out/404.html with Burgundy section, "Không tìm thấy trang" H1, "Về trang chủ" + "Gọi tư vấn" CTAs, noindex meta, AND Nav/Footer/FloatingZalo strings (+84826553599, zalo.me/0826553599, KHANG THỊNH INV) proving auto-wrap.
    - Phase 5-01 outputs still emit (sitemap.xml + robots.txt + du-an/index.html).
    - `.planning/phases/05-seo-schema-polish/05-02-VERIFICATION.md` written with diacritic probe result (PASS or fallback chosen + applied).
  </done>
</task>

</tasks>

<verification>
After all 6 tasks complete:

1. **TypeScript clean**: `npx tsc --noEmit` exits 0
2. **Build clean**: `npm run build` exits 0; zero metadataBase warnings (Pitfall #15 held)
3. **SEO-03 satisfied**: out/opengraph-image.png exists at 1200×630, Vietnamese diacritics verified visually OR documented fallback applied (D-13b)
4. **SEO-04 satisfied**: out/index.html contains parseable JSON-LD @graph with Organization + GeneralContractor; telephone '+84826553599' (Pitfall #6), taxID '1102107064', all 3 areaServed regions, 3 OfferCatalog services, PostalAddress with 'Bến Lức'
5. **SEO-05 satisfied**: out/icon.png at 32×32 + out/apple-icon.png at 180×180 both emit
6. **SEO-06 satisfied**: out/404.html exists with branded Burgundy section, "Không tìm thấy trang" H1, 2 CTAs (Về trang chủ + Gọi tư vấn), noindex robots, AND Nav/Footer/FloatingZalo auto-wrap proven by phone/zalo strings
7. **Pitfall #6 mitigated**: JSON-LD telephone equals '+84826553599' E.164 literally — verified by node JSON.parse + string equality
8. **Pitfall #10 mitigated**: zero hardcoded domain literals in page.tsx JSON-LD (all from siteUrl); OG/icon/apple-icon source palette + brand strings, not URLs
9. **Pitfall #14 mitigated**: not-found.tsx ships and emits out/404.html
10. **Pitfall #15 held**: no metadataBase warning (Phase 1 wiring intact across page.tsx edit + new files)
11. **Phase 5-01 not regressed**: out/sitemap.xml + out/robots.txt + out/du-an/index.html all still emit
12. **Out of scope held**: no Lighthouse audit, no Rich Results Test, no Cloudflare deploy, no native-copy review, no real-device 404 tap test (all Phase 6)
</verification>

<success_criteria>
- src/app/page.tsx contains @graph JSON-LD with Organization + GeneralContractor, telephone via company.phoneE164, all URLs via siteUrl
- src/app/not-found.tsx renders branded Burgundy 404 with 2 CTAs + noindex metadata
- src/app/opengraph-image.tsx + icon.tsx + apple-icon.tsx exist; all use ImageResponse + runtime: 'nodejs'; OG + apple-icon fetch Be Vietnam Pro from Google Fonts CSS2 API with subset=vietnamese
- npm run build exits 0; emits all 6 outputs (sitemap+robots from 05-01 still intact + JSON-LD on index.html + 3 PNGs + 404.html)
- Zero metadataBase warnings (Pitfall #15)
- Vietnamese diacritic visual gate PASSED OR fallback Option A/B applied and documented in 05-02-VERIFICATION.md (D-13b)
- TypeScript strict mode passes
- No file outside listed files_modified is touched
</success_criteria>

<risks_pitfalls>
- **Pitfall #6 (PRIMARY GATE for SEO-04)**: Phone format in JSON-LD MUST be E.164. Mitigation: `telephone: company.phoneE164` (never inline string). Verify block runs `node JSON.parse` + string equality `'+84826553599'`. If executor accidentally uses `company.phoneDisplay` (with spaces), Rich Results Test will warn at Phase 6.
- **Pitfall #10 (PRIMARY GATE for SEO-03, SEO-04)**: URLs hardcoded under wrong domain. Mitigation: all JSON-LD URLs built via `${siteUrl}/...`; OG/favicon don't reference URLs (they're pure visual assets). Verify block greps for raw hardcoded `khangthinhinv.vn` literals — should be ZERO in source (only siteUrl interpolation).
- **Pitfall #14 (PRIMARY GATE for SEO-06)**: Default Next 404 ships unless not-found.tsx exists. Mitigation: Task 2 creates it. Verify block: `test -f out/404.html` + content greps for "Không tìm thấy trang".
- **Pitfall #15 (CRITICAL GATE across plan)**: metadataBase warning. Phase 1 set it correctly. This plan EDITS page.tsx (Task 1) and ADDS 4 new files with metadata implications (not-found.tsx + 3 ImageResponse routes). Verify block: `! grep -i 'metadataBase' /tmp/build-05-02.log`. Most likely trigger: not-found.tsx using `openGraph.images: ['/og.png']` (relative URL without metadataBase resolution) — but we DO NOT add openGraph metadata to not-found.tsx (only title + robots). Risk neutralized by scope discipline.

Plan-specific risks:
- **Satori Vietnamese diacritic rendering (D-13b OPEN RISK)**: MEDIUM probability of partial glyph breakage in OG tagline. Mitigation: Task 6 MANDATORY visual probe + fallback decision tree (Option A drop tagline, Option B static PNG). Executor MUST NOT skip the visual probe — automated tests cannot detect this.
- **OG image emit filename**: Next 15 may emit at `out/opengraph-image.png` (most likely under output: 'export') OR `out/og.png` OR a hashed name. JSON-LD `image: \`${siteUrl}/og.png\`` assumes /og.png — if Next emits a different filename, executor must either: (a) update JSON-LD image field to match emit path, OR (b) accept that the JSON-LD `image` and the actual og:image meta tag point to different URLs (acceptable — `image` is a hint for rich-results UI, og:image is the canonical share card).
- **Apple-icon font fetch failure in CI**: Google Fonts CSS2 API might be blocked in some CI environments. Mitigation: loadFont throws explicit error on regex miss (forces visible build failure). If recurring CI issue, executor may bundle Be Vietnam Pro 900 .woff2 to `/public/fonts/` and read via `fs.readFile` instead (deferred — current plan assumes Google Fonts reachable).
- **Satori `gap` silent fail**: Easy to accidentally write `gap: 16` in flex container. Verify block: `! grep -qE "gap: [0-9]" "$F"` for opengraph-image.tsx.
- **404 page Tailwind classes**: not-found.tsx DOES use Tailwind (it's a normal React component, NOT a Satori-rendered file). Do not confuse with ImageResponse files — only opengraph-image.tsx + icon.tsx + apple-icon.tsx have Satori restrictions.
</risks_pitfalls>

<output>
After completion, create `.planning/phases/05-seo-schema-polish/05-02-schema-brand-polish-SUMMARY.md` capturing:
- Files created (4 new: not-found.tsx, opengraph-image.tsx, icon.tsx, apple-icon.tsx) + Files edited (1: page.tsx — JSON-LD injection)
- Task commits (6 commits — one per task; Task 6 commits VERIFICATION.md + any fallback applied)
- Verbatim copy of JSON-LD block extracted from out/index.html (proves SEO-04 satisfied)
- Reference to `.planning/phases/05-seo-schema-polish/05-02-VERIFICATION.md` (the diacritic gate output)
- Final build log excerpt showing zero metadataBase warnings + all 6 artifacts present
- Phase 5 closure checklist:
  - SEO-01 [x] (Plan 05-01) — sitemap.xml emitted
  - SEO-02 [x] (Plan 05-01) — robots.txt emitted
  - SEO-03 [x] (Plan 05-02) — OG image 1200×630 + diacritic gate result
  - SEO-04 [x] (Plan 05-02) — JSON-LD @graph on landing
  - SEO-05 [x] (Plan 05-02) — favicons 32 + 180
  - SEO-06 [x] (Plan 05-02) — branded 404
- Phase 6 readiness handoff: Rich Results Test URL to paste (siteUrl), Lighthouse SEO score baseline expected ≥95, real-device 404 CTA tap test pending, Cloudflare Pages deploy pending
- Deviations from CONTEXT.md (should be zero — flag any necessary adjustments encountered during execution)
</output>
