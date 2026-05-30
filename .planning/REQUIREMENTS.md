# Requirements — Milestone v2.0

> v1.0 requirements archived in `REQUIREMENTS-v1.0.md`. This document defines net-new requirements for v2.0 (Full Corporate Website).

## Functional Requirements

### ROUTE — Page Inventory

| ID | Route | Description | Priority |
|----|-------|-------------|----------|
| ROUTE-01 | `/` | Landing premium (upgraded from v1.0) | P0 |
| ROUTE-02 | `/ve-chung-toi` | About company page | P0 |
| ROUTE-03 | `/dich-vu` | Services hub | P0 |
| ROUTE-04 | `/dich-vu/cung-ung-vlxd` | VLXD detail page | P1 |
| ROUTE-05 | `/dich-vu/xay-dung` | Construction detail page | P1 |
| ROUTE-06 | `/dich-vu/van-chuyen-duong-thuy` | Waterway shipping detail page | P1 |
| ROUTE-07 | `/nang-luc` | Capabilities deep page | P1 |
| ROUTE-08 | `/du-an` | Projects list (upgraded) | P0 |
| ROUTE-09 | `/du-an/[slug]` | Project detail dynamic page | P1 |
| ROUTE-10 | `/lien-he` | Contact page with form | P0 |
| ROUTE-11 | `/tin-tuc` | Blog list (MDX) | P2 |
| ROUTE-12 | `/tin-tuc/[slug]` | Blog post detail | P2 |
| ROUTE-13 | `/404` | Custom 404 page | P1 |
| ROUTE-14 | `/api/quote` (Cloudflare Worker — external) | Form submission endpoint | P0 |

### NAV — Navigation

| ID | Requirement | Priority |
|----|------------|----------|
| NAV-01 | Multi-level navigation với dropdown cho `/dich-vu/*` | P0 |
| NAV-02 | Mobile hamburger menu với accordion sub-items | P0 |
| NAV-03 | Sticky header với scroll behavior (compress khi scroll xuống) | P1 |
| NAV-04 | Active route highlight (cả parent + child) | P0 |
| NAV-05 | Breadcrumbs trên mọi deep page (level 2+) | P1 |
| NAV-06 | Language switcher (VI/EN) trên header | P1 |
| NAV-07 | Dark mode toggle trên header | P2 |

### FORM — Quote Form (`/lien-he`)

| ID | Requirement | Priority |
|----|------------|----------|
| FORM-01 | Form fields: tên, SĐT, email, dịch vụ quan tâm (dropdown), nhu cầu (textarea) | P0 |
| FORM-02 | Client-side validation với react-hook-form + Zod | P0 |
| FORM-03 | Cloudflare Worker endpoint nhận POST, validate, gửi email | P0 |
| FORM-04 | Honeypot field anti-spam | P0 |
| FORM-05 | Rate limit (5 submission / IP / giờ) trên Worker | P1 |
| FORM-06 | Success state UI với CTA tiếp theo (Zalo / gọi ngay) | P0 |
| FORM-07 | Error state UI với retry + fallback (email/Zalo direct) | P0 |
| FORM-08 | Email template HTML đẹp gửi về `khangthinhinv2025@gmail.com` | P1 |
| FORM-09 | Reply-to email tự động cho khách (confirmation) | P2 |

### ANIM — Animations (Motion v12)

| ID | Requirement | Priority |
|----|------------|----------|
| ANIM-01 | Page transition (fade/slide giữa routes) | P1 |
| ANIM-02 | Scroll reveal cho mọi section (whileInView, once: true) | P0 |
| ANIM-03 | Count-up animation cho BigStats numbers | P1 |
| ANIM-04 | Parallax hero (background di chuyển chậm hơn foreground) | P1 |
| ANIM-05 | Smooth marquee cho partners | P0 |
| ANIM-06 | Hover lift cho cards (y: -4, shadow grow) | P0 |
| ANIM-07 | Magnetic button cho CTA chính | P2 |
| ANIM-08 | Logo SVG animation lúc load (path draw) | P2 |
| ANIM-09 | Loading skeleton cho async/heavy components | P1 |
| ANIM-10 | Respect `prefers-reduced-motion` — skip mọi animation | P0 (a11y) |

### I18N — Internationalization

| ID | Requirement | Priority |
|----|------------|----------|
| I18N-01 | Setup next-intl v3 với locales `vi` (default) + `en` | P1 |
| I18N-02 | Route segment `[locale]` với middleware | P1 |
| I18N-03 | Translation files `src/messages/vi.json` + `en.json` cho tất cả static text | P1 |
| I18N-04 | Language switcher giữ context route hiện tại | P1 |
| I18N-05 | hreflang tags trong metadata | P1 |
| I18N-06 | Translated metadata + OG cho mỗi route × locale | P2 |

### MDX — Blog System

| ID | Requirement | Priority |
|----|------------|----------|
| MDX-01 | Setup `@next/mdx` với rehype/remark plugins | P2 |
| MDX-02 | Frontmatter schema: title, slug, date, excerpt, tags, author, cover | P2 |
| MDX-03 | Blog list page `/tin-tuc` với pagination | P2 |
| MDX-04 | Blog detail page `/tin-tuc/[slug]` với reading time | P2 |
| MDX-05 | 3–5 bài viết mẫu (giả định) trên topic: VLXD, xây dựng, dự án Quốc phòng | P2 |
| MDX-06 | Tag filter trên list page | P3 |
| MDX-07 | RSS feed `/rss.xml` | P3 |
| MDX-08 | Related posts ở cuối mỗi bài | P3 |

### DARK — Dark Mode

| ID | Requirement | Priority |
|----|------------|----------|
| DARK-01 | next-themes setup với system preference default | P2 |
| DARK-02 | Dark palette: invert Burgundy/Bone (Bone-dark bg + Burgundy accents) | P2 |
| DARK-03 | All sections + cards + buttons có dark variant | P2 |
| DARK-04 | Toggle button có animation icon (sun/moon) | P2 |
| DARK-05 | Persist preference trong localStorage | P2 |

### SEARCH — Local Search

| ID | Requirement | Priority |
|----|------------|----------|
| SEARCH-01 | Pagefind build-time index include all pages + blog | P3 |
| SEARCH-02 | Search modal (Cmd/Ctrl+K) | P3 |
| SEARCH-03 | Result highlights + excerpts | P3 |

### PWA — Progressive Web App

| ID | Requirement | Priority |
|----|------------|----------|
| PWA-01 | Manifest.webmanifest với icons + theme color | P3 |
| PWA-02 | Service worker cho offline-ready (cache shell) | P3 |
| PWA-03 | Install prompt UI | P3 |

### CONTENT — Per-Page Content Depth

| ID | Requirement | Priority |
|----|------------|----------|
| CONTENT-01 | `/ve-chung-toi`: lịch sử 2 paragraphs + sứ mệnh + sơ đồ tổ chức + giấy phép placeholder | P0 |
| CONTENT-02 | `/dich-vu/*`: mỗi dịch vụ — overview + 4–6 sub-services + quy trình + FAQ 5–7 câu + related projects | P0 |
| CONTENT-03 | `/nang-luc`: 3 tabs (Đội tàu, Cơ giới, Đội xây lắp) — mỗi tab có 8+ bullet + thiết bị placeholder | P1 |
| CONTENT-04 | `/du-an/[slug]`: mỗi project — hero ảnh placeholder + khối lượng + thời gian + vai trò + ảnh gallery placeholder | P1 |
| CONTENT-05 | `/lien-he`: form + Google Maps embed + giờ làm việc + 4 kênh contact | P0 |
| CONTENT-06 | 5–7 FAQ chung trên footer/about | P1 |
| CONTENT-07 | Cam kết chất lượng section (4 cards: chất lượng, đúng hẹn, an toàn, minh bạch) | P0 |
| CONTENT-08 | Quy trình làm việc 5 bước (Tiếp nhận → Khảo sát → Báo giá → Thi công → Nghiệm thu) | P0 |
| CONTENT-09 | Testimonial section (3–5 quotes giả định từ khách hàng) | P1 |

### TRUST — Trust Signals

| ID | Requirement | Priority |
|----|------------|----------|
| TRUST-01 | Giấy phép kinh doanh placeholder (image card + MST) | P0 |
| TRUST-02 | Số liệu năng lực honest hơn (bỏ "3 đối tác Quốc phòng" misleading) | P0 |
| TRUST-03 | Tagline "Hợp tác cùng phát triển" visible ở Hero | P0 |
| TRUST-04 | Schema.org LocalBusiness mở rộng (areaServed, openingHours, serviceCatalog) | P1 |
| TRUST-05 | FAQPage schema cho mỗi service page | P2 |
| TRUST-06 | BreadcrumbList schema cho deep pages | P2 |

### SEO — Search Engine Optimization

| ID | Requirement | Priority |
|----|------------|----------|
| SEO-01 | Mỗi route có metadata riêng (title, description, OG) | P0 |
| SEO-02 | Mỗi blog post có metadata + article schema | P2 |
| SEO-03 | Sitemap.xml include tất cả 12+ routes + blog posts + locales | P1 |
| SEO-04 | Robots.txt cho phép crawling (carry v1.0) | P0 |
| SEO-05 | Canonical URLs với custom domain placeholder | P1 |
| SEO-06 | hreflang cho VI/EN versions | P1 |

### ANALYTICS

| ID | Requirement | Priority |
|----|------------|----------|
| ANALYTICS-01 | Vercel Analytics tích hợp (`@vercel/analytics`) | P1 |
| ANALYTICS-02 | Web Vitals tracking | P1 |
| ANALYTICS-03 | Custom events: form submit, CTA click, Zalo click, phone click | P2 |

## Non-Functional Requirements

### NFR — Performance

| ID | Requirement |
|----|------------|
| NFR-PERF-01 | Lighthouse Performance ≥ 85 mọi route (accept lower than v1.0 90 vì Motion v12) |
| NFR-PERF-02 | LCP < 2.5s trên 4G simulation |
| NFR-PERF-03 | INP < 200ms |
| NFR-PERF-04 | CLS < 0.1 |
| NFR-PERF-05 | Bundle JS first-load < 200KB (vs v1.0 ~110KB) |

### NFR — Accessibility

| ID | Requirement |
|----|------------|
| NFR-A11Y-01 | Lighthouse A11y ≥ 95 mọi route |
| NFR-A11Y-02 | WCAG 2.1 AA color contrast |
| NFR-A11Y-03 | Keyboard navigation đầy đủ + focus visible |
| NFR-A11Y-04 | `prefers-reduced-motion` respect |
| NFR-A11Y-05 | Semantic HTML + ARIA labels đúng |
| NFR-A11Y-06 | Form errors announced cho screen readers |

### NFR — SEO

| ID | Requirement |
|----|------------|
| NFR-SEO-01 | Lighthouse SEO ≥ 95 mọi route |
| NFR-SEO-02 | Structured data valid (Schema.org validator) |

### NFR — Quality

| ID | Requirement |
|----|------------|
| NFR-Q-01 | TypeScript strict mode pass |
| NFR-Q-02 | `npm run build` thành công |
| NFR-Q-03 | ESLint không error |
| NFR-Q-04 | Single source of truth pattern (lib/*) cho mọi data |
| NFR-Q-05 | Component naming consistent với v1.0 |

### NFR — Browser Support

| ID | Requirement |
|----|------------|
| NFR-BROW-01 | Chrome / Safari / Firefox latest 2 versions |
| NFR-BROW-02 | iOS Safari 16+, Android Chrome 100+ |
| NFR-BROW-03 | Test thật trên iPhone + Android device khi launch |

## Out of Scope (v2.0)

- CMS / admin panel (v3.0)
- E-commerce / payment
- User accounts / login
- Real-time chat widget (Zalo native đủ)
- Video hosting (embed YouTube nếu cần)
- Booking system
- Multi-tenant
- Server-rendered pages (giữ static export)
