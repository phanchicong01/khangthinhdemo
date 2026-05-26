# Pitfalls Research

**Domain:** Vietnamese B2B construction marketing site — Next.js 15 static export + Tailwind v4 + Vietnamese-only content
**Researched:** 2026-05-26
**Confidence:** HIGH (verified against official Next.js, Tailwind v4 docs, GitHub issues, Google for Developers, and recent migration writeups)

> **Why this document is shape-specific:** Khang Thịnh's website is a *single-page Vietnamese marketing site with one secondary list route*, deployed as static HTML, with trust + phone/Zalo CTA as the core conversion. The pitfalls below are filtered for that shape — not generic "Next.js best practices."

---

## Critical Pitfalls

### Pitfall 1: Silent feature breakage from `output: 'export'`

**What goes wrong:**
Code that compiles locally in `npm run dev` (which uses a full Node server) fails at `npm run build` — or worse, builds successfully but the deployed site silently lacks features. The biggest landmines for this project:

- **Route Handlers** (`app/api/.../route.ts`): only `GET` is included in the static export; `POST/PUT/DELETE` are stripped silently
- **Server Actions** (`"use server"` functions): completely unsupported; they appear to work in `dev` then 405/404 in production
- **`next/image` with default loader**: requires a running optimizer; without `images.unoptimized: true` builds fail
- **Middleware** (`middleware.ts`): not executed in static export — any auth gate / locale rewrite logic is silently bypassed
- **Dynamic routes without `generateStaticParams()`**: build error `Page is missing exported function generateStaticParams()`
- **`cookies()`, `headers()`, `searchParams` in server components**: forces dynamic rendering → static export errors
- **`revalidate` / ISR**: ignored in static export
- **`next/font` with `display: 'optional'` quirks** under `output: 'export'`: works but font CSS is inlined per-route which can bloat HTML

**Why it happens:**
Next.js documents these as limitations but does not always fail loud at build time. Devs assume "if `next dev` works, `next build` will work" — false under `output: 'export'`.

**How to avoid:**
1. Pin `next.config.ts` early (Phase 1) with `output: 'export'`, `images.unoptimized: true`, `trailingSlash: true` — and **never run `dev` without `output: 'export'` set** so divergence is impossible.
2. Add a CI step that runs `next build` (not just `dev`) on every PR.
3. ESLint rule: ban `"use server"` strings, `export const dynamic`, `cookies()`, `headers()` imports from `next/headers` in this repo.
4. Treat `du-an/[slug]` (currently out of scope) as a *future-only* shape — when adding it, you MUST add `generateStaticParams` returning all known slugs.

**Warning signs:**
- A button "doesn't do anything" only in production
- `next build` warns `Dynamic server usage` for a route that worked in dev
- `_next/data/*.json` 404s in network tab

**Phase to address:** Phase 1 (Setup) — bake the config and lint rule before any feature work.

**Confidence:** HIGH — verified against [Next.js Static Exports guide](https://nextjs.org/docs/app/guides/static-exports) and [Discussion #67503 on Server Actions](https://github.com/vercel/next.js/discussions/67503).

---

### Pitfall 2: GitHub Pages subpath breaking every asset URL

**What goes wrong:**
If you deploy to `https://<user>.github.io/khangthinhdemo/`, then every `<Link href="/du-an">` resolves to `https://<user>.github.io/du-an` (404), and every `_next/static/*` asset 404s. The site loads as a blank page with a console full of 404s for chunks and CSS. Site looks "fine" locally and "broken" deployed.

**Why it happens:**
GitHub Pages serves project pages under `/<repo-name>/`. Next.js by default assumes root deployment. Without `basePath` + `assetPrefix`, every internal link is wrong.

**How to avoid:**
1. **Decide deployment target before Phase 1 starts.** The three candidates have meaningfully different configs:
   - **GitHub Pages (project pages):** requires `basePath: '/khangthinhdemo'` AND `assetPrefix: '/khangthinhdemo/'` (note trailing slash on assetPrefix). Add `.nojekyll` to `public/` (prevents Jekyll from eating files starting with `_`).
   - **GitHub Pages with custom domain:** can drop `basePath`. Add `CNAME` file in `public/`.
   - **Netlify / Vercel:** no `basePath` needed; both serve from root.
2. If GitHub Pages without custom domain is chosen, gate `basePath` on env var:
   ```ts
   const repo = 'khangthinhdemo';
   const isProd = process.env.NODE_ENV === 'production';
   const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? (isProd ? `/${repo}` : '');
   ```
3. Use `<Link href="/du-an">` (Next.js auto-prefixes); NEVER hardcode `<a href="/khangthinhdemo/du-an">`.
4. For static image refs in JSX/CSS background: use `${basePath}/images/...` via a helper, or use static imports `import logo from '@/assets/logo.png'` which Next.js auto-prefixes.

**Warning signs:**
- Deploy preview shows blank white page with no styling
- DevTools network tab: `GET /_next/static/chunks/main.js 404`
- Logo missing but text rendered

**Phase to address:** Phase 1 (Setup) before any UI work — deploy a "hello world" to chosen target FIRST.

**Confidence:** HIGH — verified against [Next.js GitHub Pages config writeup](https://wallis.dev/blog/next-js-basepath-and-assetprefix) and [Next.js Issue #73427](https://github.com/vercel/next.js/issues/73427).

---

### Pitfall 3: Vietnamese diacritics breaking layout because of wrong font subset / fallback

**What goes wrong:**
Be Vietnamese Pro loads only the `latin` subset (Google Fonts default) → diacritics like `ờ`, `ợ`, `ữ`, `ẳ` fall back to system font mid-word, causing inconsistent character heights, broken kerning, and visible CLS as the correct glyph swaps in late. On Windows, the fallback is often Arial which has poor Vietnamese composite-mark rendering — accents look detached or misplaced.

Even worse: if the font swap happens after first paint, you get **double CLS hit**: once for fallback, once for Bebas Neue/Be Vietnam Pro arriving.

**Why it happens:**
- `next/font/google` defaults to `subsets: ['latin']` — does not include Vietnamese block
- Headings using Bebas Neue: **Bebas Neue has no Vietnamese diacritics support** (only basic Latin). Any Vietnamese heading text will fall back to body font or system font.
- Devs test with English-looking words and miss the issue.

**How to avoid:**
1. `next/font/google` for Be Vietnam Pro: **explicitly include `subsets: ['latin', 'vietnamese']`**.
2. **Audit every use of `font-display` (Bebas Neue)** for Vietnamese-content text. Hero headlines, section headings, stats labels — if they contain Vietnamese, do NOT use Bebas Neue. Either:
   - Use Be Vietnam Pro Bold/Black for these (Vietnamese-safe), OR
   - Restrict Bebas Neue to numerals and ASCII-only labels (e.g. "700-3,900"), OR
   - Replace Bebas Neue with a Vietnamese-supporting display font (e.g. Bungee, Anton has limited diacritics — verify; or stick with Be Vietnam Pro Black weight).
3. Set fallback font metrics with `adjustFontFallback` (default true in `next/font`) so CLS from font-swap is minimized.
4. Self-host both fonts via `next/font` (not `<link>` to Google Fonts CDN) — gives `font-display: swap` for free and avoids third-party network hop.

**Warning signs:**
- Heading "ĐỐI TÁC TIÊU BIỂU" looks fine but "Cung ứng" in body has uneven baseline
- Lighthouse "Avoid layout shifts" flags font as cause
- Manual test on a fresh browser (no cached font) shows visible font-swap flash

**Phase to address:** Phase 1 (Setup) — choose display font BEFORE designing Hero/BigStats sections that lock in copy.

**Confidence:** HIGH — verified [Bebas Neue glyph coverage](https://fonts.google.com/specimen/Bebas+Neue) (basic Latin only), [Be Vietnam Pro Vietnamese subset](https://fonts.google.com/specimen/Be+Vietnam+Pro), [CLS web fonts impact](https://blog.sentry.io/web-fonts-and-the-dreaded-cumulative-layout-shift/).

---

### Pitfall 4: Tailwind v4 `@theme` directive — wrong variable namespace = invisible tokens

**What goes wrong:**
You write `--primary: #6B1F1F` inside `@theme`, expect `bg-primary` to work, and get nothing. Or worse, the build succeeds and renders no color (transparent). Devs then add `!important` everywhere trying to debug.

**Why it happens:**
Tailwind v4 uses *namespaced* CSS variables that map to utility classes. You MUST use prefixes matching the utility family:
- `--color-*` → `bg-*`, `text-*`, `border-*`
- `--font-*` → `font-*`
- `--spacing-*` → `p-*`, `m-*`, `gap-*`
- `--radius-*` → `rounded-*`
- `--shadow-*` → `shadow-*`
- `--breakpoint-*` → responsive variants

The design spec already gets this right (`--color-burgundy`, `--font-display`) — but devs adding new tokens later often forget the namespace.

**How to avoid:**
1. Document the namespace convention in `globals.css` as a comment at the top of `@theme { }`.
2. When adding a token, verify it generates a utility class:
   ```bash
   grep -r "bg-burgundy" .next/static/css/ # should match
   ```
3. Do not mix `@layer base` color overrides with `@theme` tokens — `@theme` is authoritative.
4. Remove old v3 leftovers: delete `tailwind.config.js` if it exists (v4 is config-via-CSS), remove `postcss-import` and `autoprefixer` from `postcss.config.*` (v4 handles internally), ensure `@tailwindcss/postcss` is the only PostCSS plugin.
5. Use `@import "tailwindcss"` not `@tailwind base; @tailwind components; @tailwind utilities;` (v3 syntax).

**Warning signs:**
- `bg-burgundy` produces no styling but no build error
- Tailwind IntelliSense doesn't autocomplete the class
- `tailwindcss` PostCSS plugin error: "It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin"

**Phase to address:** Phase 1 (Setup) — write `globals.css` with all design tokens FIRST, then verify each class renders before building sections.

**Confidence:** HIGH — verified [Tailwind v4 upgrade guide](https://tailwindcss.com/docs/upgrade-guide) and [Issue #15735 PostCSS plugin error](https://github.com/tailwindlabs/tailwindcss/issues/15735).

---

### Pitfall 5: Hero image kills LCP on rural 4G

**What goes wrong:**
A large hero JPG/PNG (1–3MB) blocks LCP. Lighthouse drops Performance below 90. Real users in Tây Ninh / Cà Mau (target market) on rural 4G see a 4+ second blank hero, bounce before reading the first headline.

Compounding: `images.unoptimized: true` is required for static export → Next.js will NOT auto-convert to WebP/AVIF or generate responsive `srcset`.

**Why it happens:**
- Static export disables Next.js image optimization
- Devs use `<Image src="/hero.jpg" />` and assume it's still optimized
- Hero often loaded WITHOUT `priority` → not preloaded
- Background images in CSS skip the `<Image>` component entirely

**How to avoid:**
1. **Pre-optimize all images at build time** (NOT runtime). Options:
   - Run `sharp` / `squoosh` script in `prebuild` to produce `.webp` + `.avif` + multiple sizes
   - Use `<picture>` with `<source type="image/avif">`, `<source type="image/webp">`, `<img>` fallback
2. Hero image target: **< 150KB after compression, < 100KB ideal**. AVIF at quality 60-70 typically achieves this for 1920x1080.
3. Spec already specifies "CSS pattern (diagonal stripes) thay vì ảnh thật ở phase 1" — **keep this discipline**. Real hero photo only when you have a properly compressed asset.
4. Add `<link rel="preload" as="image" href="/hero.avif" type="image/avif">` in `<head>` for LCP image.
5. For `next/image` with `unoptimized: true`, still use the `priority` prop on LCP image (it adds `fetchpriority="high"` and preload).
6. Test with Chrome DevTools "Slow 4G" throttling — not local dev speed.

**Warning signs:**
- Lighthouse Performance < 90, LCP > 2.5s
- DevTools network: hero image > 200KB
- PageSpeed Insights "Properly size images" warning

**Phase to address:** Phase 2 (Hero section) and revisited in final Phase (Lighthouse audit). Block real photo until optimization script exists.

**Confidence:** HIGH — verified [Next.js Image static export limitations](https://nextjs.org/docs/app/api-reference/components/image), [DebugBear LCP image guide](https://www.debugbear.com/blog/nextjs-image-optimization).

---

### Pitfall 6: Missing / wrong LocalBusiness JSON-LD — invisible to Google Vietnam local search

**What goes wrong:**
Site has correct address/phone in HTML but no structured data, OR has structured data with mismatched NAP (Name-Address-Phone) vs. what's in Google Business Profile. Result:
- Does not appear in "near me" / local pack searches
- No business rich card in SERP
- Construction buyers searching "cung cấp cát đá Tây Ninh" or "công ty xây dựng Bến Lức" can't find Khang Thịnh

**Why it happens:**
- Devs treat schema markup as optional polish
- Generic `LocalBusiness` used when more specific type (`GeneralContractor`, `Plumber`, etc.) would yield richer results
- Phone formatted differently in JSON-LD vs. footer vs. Google Business Profile
- Schema describes content not present on page (Google penalizes this)

**How to avoid:**
1. Add `LocalBusiness` JSON-LD in `app/layout.tsx` `<head>` via `<script type="application/ld+json">`:
   ```jsonc
   {
     "@context": "https://schema.org",
     "@type": "GeneralContractor",
     "name": "Công ty TNHH Khang Thịnh Investment",
     "alternateName": "KHANG THỊNH INV",
     "telephone": "+84921985599",
     "email": "khangthinhinv2025@gmail.com",
     "address": {
       "@type": "PostalAddress",
       "streetAddress": "A3-02 KDC Long Phú",
       "addressLocality": "xã Bến Lức",
       "addressRegion": "Tây Ninh",
       "addressCountry": "VN"
     },
     "areaServed": ["Tây Ninh", "Long An", "Cà Mau", "TP. Hồ Chí Minh"],
     "taxID": "1102107064"
   }
   ```
2. Use `+84` international phone format in JSON-LD (Google's recommendation), but display `092 198 55 99` in UI.
3. **Mirror exact NAP** across: JSON-LD, footer, contact section, future Google Business Profile, Zalo OA profile, Facebook page.
4. Use schema type `GeneralContractor` (more specific than `LocalBusiness`); add second `@graph` entry for `Organization` if needed.
5. Validate with [Schema Markup Validator](https://validator.schema.org/) and [Rich Results Test](https://search.google.com/test/rich-results).
6. **Register and verify Google Search Console** for the production domain on Day 1 of launch — this is the single biggest miss for small Vietnamese B2B sites.

**Warning signs:**
- Site doesn't appear in Google Search Console "Coverage" after 2 weeks of launch
- `site:khangthinhinv.vn` returns no results
- Rich Results Test shows no detected items

**Phase to address:** SEO/launch phase — but JSON-LD added in same phase as `layout.tsx` metadata.

**Confidence:** HIGH — verified [Google LocalBusiness structured data docs](https://developers.google.com/search/docs/appearance/structured-data/local-business).

---

### Pitfall 7: Phone/Zalo CTAs that don't work on mobile = lost conversions

**What goes wrong:**
The single most important user action (call or open Zalo) fails on real devices:
- `tel:` link wrapped in `<button onClick>` instead of `<a>` → desktop "doesn't do anything"
- Phone has spaces: `tel:092 198 55 99` → some Android browsers reject
- Zalo deep link uses `zalo://` scheme that fails outside the Zalo app context
- Inline `target="_blank"` on `tel:` opens about:blank then nothing
- Email button uses `<button>` with no fallback for users who don't have a default mail client configured (most office desktops in Vietnam use webmail)

**Why it happens:**
- Devs test only with desktop Chrome where `tel:` clicks open a dialog
- Vietnamese phone numbers visually have spaces; devs forget to strip
- `zalo.me/...` (https) and `zalo://` (custom scheme) confused
- WebView / in-app browsers (Facebook in-app, Zalo in-app) handle these schemes inconsistently

**How to avoid:**
1. Phone: `<a href="tel:+84921985599">092 198 55 99</a>` — use `+84` E.164 format in `href`, display formatted version as text. No spaces in `href`.
2. Zalo: use `https://zalo.me/0921985599` (HTTPS URL). This deep-links to the Zalo app on mobile (iOS Universal Link + Android intent), opens web Zalo on desktop. Do NOT use `zalo://`.
3. Email: `<a href="mailto:khangthinhinv2025@gmail.com">` — but ALSO display the email as plain selectable text next to it (so users can copy if mailto fails).
4. Track CTA clicks (Plausible/Umami event or simple `data-cta` attribute) to verify usage on real users.
5. Test on:
   - iOS Safari (real device)
   - Android Chrome (real device)
   - Facebook in-app browser (paste link in FB message, click)
   - Zalo in-app browser (paste link in Zalo chat, click)
6. **FloatingZalo** specifically — ensure `rel="noopener"` and that the icon is `aria-label="Chat Zalo với Khang Thịnh"` (Vietnamese, descriptive).

**Warning signs:**
- "User called us — actually they texted Zalo because Call button didn't work"
- Browser console: "Failed to launch 'zalo://...' because user gesture is required"
- Real-device test: button visually flashes but nothing opens

**Phase to address:** Phase implementing Contact/FloatingZalo — do a real-device smoke test as part of phase exit.

**Confidence:** MEDIUM-HIGH — `zalo.me/{phone}` HTTPS pattern is documented on [Zalo developers community](https://developers.zalo.me/community/detail/14fef113cd5624087d47); cross-device reliability inferred from general deep-link best practices.

---

### Pitfall 8: B2B-trust-killing copy and assets

**What goes wrong:**
The site loads fast, looks technically correct, but feels "off" to Vietnamese B2B construction buyers. Specific patterns that destroy trust:
- **Stock photo "Asian businessmen handshake"** → instantly clocked as generic, signals "this is a fake company"
- **English-style sentence cadence** in Vietnamese (e.g. "Chúng tôi cung cấp các giải pháp tối ưu cho..." sounds like translated Apple marketing — wrong register for VLXD industry)
- **Lorem ipsum or "Tên dự án 1"** left in any deployed build
- **No company registration info (MST)** visible → buyers can't verify
- **Vague stats like "100+ dự án"** when company was founded in 2025 → buyer does the math, loses trust permanently
- **"24/7 support"** style claims unsupported by reality (a 2-person company can't 24/7)
- **Generic CTAs** like "Get Started" / "Learn More" instead of "Gọi ngay 092 198 55 99" / "Báo giá nhanh qua Zalo"

**Why it happens:**
- Designers/devs copy patterns from US SaaS landing pages
- Stock photos are easy default
- Marketing copy written by developer or AI without industry-specific vocabulary
- Founders avoid putting "scary" facts like MST or full address (actually opposite — these BUILD trust in B2B)

**How to avoid:**
1. **Show MST 1102 107 064 prominently in footer + Contact section.** This is the single strongest trust signal for Vietnamese B2B.
2. **Use real (uncluttered) photos or no photos.** Spec already plans CSS pattern hero for phase 1 — keep that.
3. **Honest stats:** "Thành lập 2025", "4 dự án tiêu biểu". Don't fabricate numbers. The military/government partnerships (Binh đoàn 12, Trường Sơn) ARE the trust signal — lean into them.
4. **CTA copy in Vietnamese B2B register:**
   - GOOD: "Gọi ngay để tư vấn", "Báo giá VLXD", "Liên hệ Zalo"
   - BAD: "Khám phá ngay", "Bắt đầu hành trình", "Đối tác đáng tin cậy của bạn"
5. **Sector-specific vocabulary** in service descriptions: "cát san lấp", "đá 1×2", "đá mi", "khối lượng vận chuyển 700-3,900 tấn", "thi công móng cọc". Generic terms like "vật liệu chất lượng cao" mean nothing.
6. **Phương châm "Hợp tác cùng phát triển"** displayed where it doesn't compete with primary CTA.
7. **Address shown in full** — buyers verify on Google Maps. A3-02 KDC Long Phú, xã Bến Lức, tỉnh Tây Ninh.
8. **Pre-launch review:** Vietnamese-native reader (not the developer) reviews every line of copy. AI-generated Vietnamese marketing copy has a *recognizable* tone — strip it.

**Warning signs:**
- Anyone reviewing says "nghe giống dịch máy" (sounds like machine translation)
- Reviewer asks "Công ty thật không?" — that's the kill question
- Stats don't reconcile with founding year

**Phase to address:** Content/copy phase (likely woven through Hero, Services, Capabilities, Contact). Final phase: Vietnamese-native copy review as gate.

**Confidence:** MEDIUM — based on Vietnamese B2B market patterns; lower verifiability than technical pitfalls, but reasoned from industry knowledge.

---

## Moderate Pitfalls

### Pitfall 9: `trailingSlash: true` quirks across hosts

**What goes wrong:** Spec sets `trailingSlash: true`. Netlify CDN aggressively strips trailing slashes for cache optimization, causing 301 redirects that break form submissions and sometimes mismatch with internal `<Link>` hrefs.

**Mitigation:**
- Stick with `trailingSlash: true` — it produces `/du-an/index.html` directories which is what static servers want
- On Netlify: add `[[redirects]]` rules in `netlify.toml` to enforce trailing slash, OR disable Netlify's "Pretty URLs" option (counterintuitive name)
- On Vercel: `trailingSlash: true` Just Works
- On GitHub Pages: works fine with directories

**Confidence:** MEDIUM — verified [Netlify trailing slash discussion](https://answers.netlify.com/t/nextjs-trailing-slashes/38693).

---

### Pitfall 10: Sitemap and OG image breaking under basePath

**What goes wrong:** `sitemap.ts` emits URLs assuming root (`https://khangthinhinv.vn/du-an`), but the deployed URL is `https://user.github.io/khangthinhdemo/du-an/`. Submitted sitemap leads Google to 404s. OG image `<meta property="og:image" content="/og-image.png">` resolves wrong on socials.

**Mitigation:**
- Set `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://khangthinhinv.vn')` in `layout.tsx`
- In `sitemap.ts`, use absolute URLs constructed from same env var
- OG image: use absolute URL in metadata (not relative path)
- Decide production domain before final deploy; placeholder is OK during dev but MUST be set before submitting sitemap to Google Search Console

---

### Pitfall 11: Anchor-only navigation = bad SEO

**What goes wrong:** Single-page landing with `#services`, `#projects`, `#contact` anchors means Google indexes a single page. For multi-keyword targeting ("cung cấp cát đá", "xây dựng nhà phố", "vận chuyển đường thủy"), one URL competes for all keywords — weaker than dedicated pages.

**Mitigation:**
- Phase 1 acceptable: single-page is intentional simplicity. Compensate with rich h2/h3 structure (`<h2>Dịch vụ cung cấp VLXD</h2>`, etc.) and JSON-LD `Service` markup per service block.
- Phase 2 consideration: if SEO traction weak after 3 months, split into `/dich-vu/cat-da-san-lap`, `/dich-vu/xay-dung`, `/dich-vu/van-chuyen-duong-thuy`.

---

### Pitfall 12: Marquee / animations causing CLS or jank on mobile

**What goes wrong:** PartnersMarquee text scroll using CSS `animation: scroll` runs at sub-60fps on cheap Android devices common in Vietnam (Vsmart, Xiaomi entry-level). Layout flicker if animated element causes reflow.

**Mitigation:**
- Use `transform: translateX()` (GPU-composited), NOT `left` or `margin-left`
- Set `will-change: transform` on marquee track
- `prefers-reduced-motion` media query to disable animation
- Test on Chrome DevTools "CPU 4x slowdown" + "Slow 4G"

---

## Minor Pitfalls

### Pitfall 13: Forgetting `.nojekyll` on GitHub Pages

`_next/` folder treated as Jekyll-ignored if `.nojekyll` is missing → all Next.js assets 404. Add empty `public/.nojekyll` file.

### Pitfall 14: Missing 404.html fallback

GitHub Pages serves `404.html` for unknown routes. Without custom one, users see default GitHub 404 (jarring). Either include a styled 404 page or set up `app/not-found.tsx` (statically rendered in `output: 'export'`).

### Pitfall 15: `metadataBase` warning in build

Without `metadataBase`, Next.js logs warning per build and OG image URLs fail to absolutize. Set it explicitly.

### Pitfall 16: Tailwind purge missing dynamic class strings

E.g. `bg-${variant}-500` won't be picked up by Tailwind scanner. Use full class names with conditionals, or `@source "..."` directive to whitelist files.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hardcode all content in components (no CMS) | Fast to ship Phase 1 | Every typo edit needs git push + rebuild + redeploy; non-tech staff can't edit | OK for Phase 1 (spec confirms YAGNI); revisit if content edits >2/month |
| Single inline `<script>` for JSON-LD instead of generated | Simple | Schema drift between page content and JSON-LD | Acceptable for single-location small business |
| CSS pattern instead of real hero photo | Avoids large image, no compression pipeline | Looks slightly generic | Acceptable for Phase 1; replace when professional photos exist |
| Placeholder domain `khangthinhinv.vn` in metadata | Unblocks dev | Forgotten in production → broken OG/sitemap | NEVER acceptable in production deploy — must gate via env var |
| Skipping Lighthouse on every PR | Faster iteration | Performance regression undetected | OK only if final phase has full audit + GitHub Actions Lighthouse CI added |
| No analytics in Phase 1 | Simpler, no privacy banner | Can't measure if CTAs actually used | OK for Phase 1; add Plausible/Umami in launch+1 week |
| `images.unoptimized: true` with no pre-build optimization | Faster setup | Hero image kills LCP | NEVER acceptable for hero / above-fold; OK for small inline icons |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Google Fonts (Be Vietnam Pro) | Loading via `<link>` to fonts.googleapis.com | Use `next/font/google` with `subsets: ['latin', 'vietnamese']` — self-hosts, eliminates third-party request |
| Google Fonts (Bebas Neue for headings) | Using on Vietnamese text | Bebas Neue has no Vietnamese glyphs → fallback ugly. Use only on numerals/ASCII labels |
| Zalo deep link | `zalo://...` scheme | `https://zalo.me/0921985599` (HTTPS, works cross-platform) |
| Tel link | `tel:092 198 55 99` (spaces) | `tel:+84921985599` (E.164, no spaces) |
| Email link | `mailto:` without plain-text fallback | Also display plain text email next to button |
| Google Search Console | Submit sitemap before site is final | Submit only after domain locked, content reviewed, JSON-LD validated |
| GitHub Pages | Push to `gh-pages` branch with `_next/` excluded | Include `.nojekyll` + `out/` contents at branch root |
| Netlify | Default settings + Next.js plugin | For static export, disable Next.js plugin, set publish directory to `out/` |
| Vercel | Default settings | Works out of box; `output: 'export'` still respected |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Unoptimized hero image | LCP > 2.5s on 4G | Pre-build sharp/squoosh pipeline; AVIF + WebP; `<link rel="preload">` | First page load on rural mobile |
| Web font CLS | Layout jump after font swap | `next/font` + `adjustFontFallback`; Vietnamese subset | Always — but worse on slow connections |
| Animation library bloat | First Load JS > 200KB | No framer-motion/gsap in Phase 1; CSS-only animations | When animation lib added without tree-shaking awareness |
| Client component everywhere | Hydration cost, JS bundle bigger | Default to server components; mark client only when needed (`FloatingZalo` for click state, marquee if uses state) | When entire page wrapped in `"use client"` |
| Inlined SVG for every icon | HTML bloat | Use sprite or `next/image` for icons; or lucide-react which tree-shakes | When 30+ icons added |
| Anchor scroll causing reflow | Janky scroll-to-section | `scroll-behavior: smooth` on `<html>`, ensure no layout shift triggers | On long pages with lazy content |
| Loading all 4 project images upfront | LCP slow if Projects section is high on page | Lazy-load Projects section images (`loading="lazy"`); only Hero gets `priority` | Always, but more impact on slow connections |

**Scale relevance for this project:** site has perhaps 100–1000 unique visitors/month for a regional B2B service company in Year 1. None of these traps will fail due to *traffic*. They will fail due to *individual user device* being slow. Optimization is about per-user perceived speed, not server load.

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Exposing email plainly without obfuscation | Spam scrapers harvest `khangthinhinv2025@gmail.com` | Either accept (small business; spam manageable) OR obfuscate via JS-rendered text. Phase 1: accept. |
| MST/legal info on a public page | None — this is intentional trust signal | Display proudly; this is correct |
| User-uploaded content on static site | N/A — no upload feature | Out of scope; if added later requires backend, breaks static-export model |
| Embedded Google Maps iframe leaking referrer | Privacy minor concern | Use `referrerpolicy="no-referrer-when-downgrade"`; or static map image |
| Mixed content (HTTP assets on HTTPS page) | Browser blocks resources | Always HTTPS; never hardcode `http://` for fonts/images |
| Missing CSP headers | XSS risk minimal on fully static site, but defense in depth | Add `Content-Security-Policy` via host config (Netlify `_headers`, Vercel `vercel.json`) — limit `script-src 'self'`; allow inline `'unsafe-inline'` only if JSON-LD needs it (use `nonce` or hash) |
| Phone number in `tel:` link allowing toll fraud auto-dial | Theoretical | Modern browsers require user gesture to initiate call — not a real risk |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| FloatingZalo covers content on small screens | User can't read body text behind button | Position bottom-right with 16px margin; max 56×56px on mobile; never centered |
| Anchor nav not updating URL hash | User can't share "deep link" to specific section | Use `<a href="#projects">` not JS-only scroll; URL updates automatically |
| Smooth-scroll causing motion sickness | Accessibility concern | Respect `prefers-reduced-motion`; disable smooth scroll under that media query |
| CTA button colors with low contrast | Burgundy on Bone might fail AA contrast | Verify all primary text/CTA pairs hit 4.5:1 contrast (WCAG AA) |
| Tap targets < 44px on mobile | Mis-tapped buttons, missed calls | All CTAs minimum 44×44px tap area (padding even if visual element smaller) |
| No visual feedback on Zalo button hover/tap | User unsure if button registered | Add hover state + active state + slight scale on tap |
| Footer phone/email as plain text not link | User has to copy-paste | Wrap in `<a href="tel:..">` everywhere they appear |
| Hero CTA hidden below fold on landscape mobile | Primary action invisible | Hero height should fit primary CTA in viewport on iPhone SE landscape (375×667) |
| Wide Vietnamese words (`Vận chuyển đường thủy`) wrapping awkwardly | Headings break mid-word | Use `text-wrap: balance` (modern CSS) and test at multiple breakpoints |
| Sticky nav covering anchor target | Click "Liên hệ" → section header hidden under nav | Add `scroll-margin-top: 80px` to all anchor targets |

---

## "Looks Done But Isn't" Checklist

- [ ] **Hero:** has `priority` prop on LCP image AND image is < 200KB AND preloaded — verify in network tab
- [ ] **Fonts:** `subsets: ['latin', 'vietnamese']` in `next/font` config — verify diacritics render correctly in Hero
- [ ] **Bebas Neue:** is NOT used on any Vietnamese text — search code for `font-display` usage and check content
- [ ] **All CTAs:** click each on real iPhone + real Android — Tel opens dialer, Zalo opens app, mailto opens compose
- [ ] **JSON-LD:** validated with Rich Results Test — no errors, no missing required fields
- [ ] **NAP consistency:** MST, phone, email, address identical between footer, Contact section, JSON-LD
- [ ] **Sitemap:** absolute URLs with real domain (not `khangthinhinv.vn` placeholder), submitted to GSC
- [ ] **robots.txt:** allows crawl, references sitemap, NOT accidentally `Disallow: /` from a copy-paste
- [ ] **404 page:** styled (matches site), accessible at `/khong-tim-thay` or via `app/not-found.tsx`
- [ ] **Favicon:** appears in browser tab (not default Next.js or Vercel triangle)
- [ ] **OG image:** appears when URL pasted in Zalo / Facebook Messenger / Slack — actually test
- [ ] **`metadataBase`:** set in layout.tsx — no build warning
- [ ] **Production env vars:** `NEXT_PUBLIC_SITE_URL` set to real domain in deploy host
- [ ] **HTTPS enforced:** custom domain has valid SSL; no mixed content warnings
- [ ] **Lighthouse:** Performance ≥ 90, SEO ≥ 95, Accessibility ≥ 90 — on mobile profile, throttled
- [ ] **Real-device test:** opened on Samsung A-series (mid-tier Android common in Vietnam) on 4G — readable in < 3s
- [ ] **Vietnamese copy review:** native reader confirms no machine-translation feel
- [ ] **Footer:** displays MST 1102 107 064, full legal name "Công ty TNHH Khang Thịnh Investment", ĐDPL
- [ ] **GitHub Pages only:** `.nojekyll` present, `basePath` correct, all internal links work, all assets load
- [ ] **Google Search Console:** site verified, sitemap submitted (post-launch)
- [ ] **No `console.log`, no TODO comments, no `placeholder.com`, no "Lorem ipsum"** in shipped HTML — grep build output

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Deployed with wrong `basePath` (assets 404) | LOW | Update `next.config.ts`, rebuild, redeploy. < 10 min. |
| Vietnamese diacritics rendering broken | LOW | Add `'vietnamese'` to `subsets`, rebuild. |
| Hero image too large (LCP fail) | LOW | Run image through squoosh, replace, rebuild. |
| JSON-LD invalid | LOW | Fix structure, rebuild. Google re-crawls within days. |
| Wrong phone format → users can't call | LOW | One-line fix, redeploy. |
| Submitted sitemap with placeholder domain | MEDIUM | Resubmit corrected sitemap; old URLs will 404 for days; submit URL removal requests in GSC |
| Bebas Neue used on Vietnamese throughout site | MEDIUM | Replace display font references; visual regression review needed |
| Site indexed on wrong canonical (e.g. user.github.io/khangthinhdemo before custom domain) | HIGH | Set up 301 redirects from old to new URL; submit change of address in GSC; takes weeks for ranking signals to migrate |
| Stock photos / fake content shipped, harmed brand trust with first customer | HIGH | Replace assets; can't undo lost customer impression — requires manual outreach |
| Site uses server actions that worked in dev, fail in production | MEDIUM | Refactor to client-side `mailto:` / Zalo / Formspree-style approach; or switch deployment target to Vercel with `output` removed (changes hosting model) |

---

## Pitfall-to-Phase Mapping

> Assumes a roadmap roughly: **Phase 1 Setup** → **Phase 2 Shell (Nav/Footer/FloatingZalo/Layout)** → **Phase 3 Sections** → **Phase 4 Project list page** → **Phase 5 SEO/Polish/Audit** → **Launch**.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Silent feature breakage from `output: 'export'` | Phase 1 | `next build` succeeds; ESLint rule active; CI runs build |
| GitHub Pages basePath issues | Phase 1 | "Hello world" deployed to chosen target before any UI work |
| Vietnamese font subset / Bebas Neue mismatch | Phase 1 | Manual review of Hero with `ờ ợ ữ ẳ` characters; Lighthouse no font CLS warning |
| Tailwind v4 `@theme` mistakes | Phase 1 | Each color token verified as utility class; `globals.css` is single source of truth |
| Hero LCP fail | Phase 2-3 (Hero) + Phase 5 (audit) | Lighthouse mobile Performance ≥ 90; LCP image < 200KB |
| Missing LocalBusiness JSON-LD | Phase 5 (SEO) | Rich Results Test passes; GSC verified |
| Broken tel:/Zalo CTAs | Phase 2 (Shell — FloatingZalo) + Phase 3 (Contact) | Real-device test on iOS + Android |
| B2B trust copy issues | Throughout content phases + Phase 5 review gate | Vietnamese-native reviewer sign-off |
| Trailing slash quirks | Phase 1 (config) + deploy phase | Manual check: `/du-an` and `/du-an/` both resolve correctly on chosen host |
| Sitemap/OG under basePath | Phase 5 | Sitemap URLs absolute; OG image previews correctly when URL shared |
| Anchor-only SEO weakness | Acknowledged Phase 1 (intentional); Phase 5 revisit | Monitor GSC keyword performance post-launch |
| Marquee/animation jank | Phase 3 (PartnersMarquee) | Chrome DevTools 4x slowdown test passes |
| Performance traps (bundles, fonts) | Phase 5 audit | Lighthouse all green; bundle analyzer < 150KB First Load JS |
| `.nojekyll` missing | Phase 1 (if GH Pages target) | File exists in `public/` |
| 404.html / not-found | Phase 5 | Visit `/random-path` → styled 404 |
| `metadataBase` warning | Phase 1 (layout setup) | `next build` output has no warning |
| Tailwind dynamic class purge | Throughout | All shipped CSS reflects used utilities |

---

## Sources

**Official documentation (HIGH confidence):**
- [Next.js Static Exports Guide](https://nextjs.org/docs/app/guides/static-exports)
- [Next.js Image Component](https://nextjs.org/docs/app/api-reference/components/image)
- [Next.js generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
- [Next.js API Routes static export warning](https://nextjs.org/docs/messages/api-routes-static-export)
- [Tailwind CSS v4 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)
- [Google LocalBusiness Structured Data](https://developers.google.com/search/docs/appearance/structured-data/local-business)
- [Be Vietnam Pro on Google Fonts](https://fonts.google.com/specimen/Be+Vietnam+Pro)

**Issue trackers (HIGH confidence, dated):**
- [vercel/next.js Discussion #67503 — Server Actions in Static Exports](https://github.com/vercel/next.js/discussions/67503)
- [vercel/next.js Issue #56253 — generateStaticParams + dynamic + output: 'export'](https://github.com/vercel/next.js/issues/56253)
- [vercel/next.js Issue #73427 — basePath causing request issues in static export](https://github.com/vercel/next.js/issues/73427)
- [tailwindlabs/tailwindcss Issue #15735 — PostCSS plugin error](https://github.com/tailwindlabs/tailwindcss/issues/15735)
- [opennextjs/opennextjs-netlify Issue #256 — trailingSlash not working on Netlify](https://github.com/netlify/netlify-plugin-nextjs/issues/256)

**Community writeups (MEDIUM confidence):**
- [Next.js basePath and assetPrefix for GitHub Pages — James Wallis](https://wallis.dev/blog/next-js-basepath-and-assetprefix)
- [Tailwind CSS v4 Migration Guide 2026 — DEV Community](https://dev.to/pockit_tools/tailwind-css-v4-migration-guide-everything-that-changed-and-how-to-upgrade-2026-5d4)
- [Web Fonts and CLS — Sentry Blog](https://blog.sentry.io/web-fonts-and-the-dreaded-cumulative-layout-shift/)
- [Next.js Image Optimization & LCP — DebugBear](https://www.debugbear.com/blog/nextjs-image-optimization)

**Vietnam-specific (MEDIUM confidence):**
- [Zalo Developers — URL scheme for opening Zalo](https://developers.zalo.me/community/detail/14fef113cd5624087d47)
- [Vietnam Internet Speed Guide 2026 — Sparkroam](https://sparkroam.com/vietnam-internet-speed-guide/)
- Vietnamese B2B copy / trust pattern observations: industry knowledge (LOW-MEDIUM confidence; flagged for native reviewer validation)

---

*Pitfalls research for: Vietnamese B2B construction marketing site (Next.js 15 static export + Tailwind v4)*
*Researched: 2026-05-26*
