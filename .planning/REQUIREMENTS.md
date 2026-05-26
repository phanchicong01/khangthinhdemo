# Requirements: Khang Thịnh Investment Website

**Defined:** 2026-05-26
**Core Value:** Khách hàng tiềm năng — sau khi xem website — tin tưởng đủ để gọi/Zalo liên hệ tư vấn

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Foundation

- [ ] **FND-01**: `next.config.ts` configured for static export (`output: 'export'`, `images.unoptimized: true`, `trailingSlash: true`)
- [ ] **FND-02**: TypeScript strict mode enabled, build passes `npm run build` without errors
- [ ] **FND-03**: Tailwind CSS v4 design tokens defined in `globals.css` via `@theme` directive (Burgundy/Bone palette)
- [ ] **FND-04**: Be Vietnam Pro font (weights 400/500/600/700/800/900) loaded via `next/font/google` with explicit `subsets: ['vietnamese', 'latin']`
- [ ] **FND-05**: Site URL configurable via `NEXT_PUBLIC_SITE_URL` env var (default placeholder `https://khangthinhinv.vn`)
- [ ] **FND-06**: Company facts (phone, Zalo URL, email, MST, address) live in `lib/site.ts` as single source of truth
- [ ] **FND-07**: Old skeleton folders removed (`src/app/dich-vu/`, `src/app/lien-he/`, `src/components/Header.tsx`)

### Layout Shell

- [ ] **SHELL-01**: Sticky `Nav` component với logo + 5 anchor links + CTA "Báo giá", visible hotline trên desktop, mobile menu collapse
- [ ] **SHELL-02**: `Footer` component với company legal info (MST, address, email, phone) + copyright
- [ ] **SHELL-03**: `FloatingZalo` button fixed bottom-right, hiển thị trên cả mobile + desktop, deep link `https://zalo.me/0921985599`
- [ ] **SHELL-04**: Smooth scroll cho anchor links (#services, #projects, #capabilities, #contact)
- [ ] **SHELL-05**: Root `layout.tsx` với metadata default (title template, description, OG image, robots, viewport)

### Landing Sections

- [ ] **SEC-01**: `Hero` section — headline lớn (Be Vietnam Pro 900 uppercase), sub-text, 2 CTA (Gọi/Báo giá), industrial CSS pattern background
- [ ] **SEC-02**: `PartnersMarquee` — text scroll vô tận (CSS-only, no JS) hiển thị "BINH ĐOÀN 12 · TRƯỜNG SƠN · BỘ QUỐC PHÒNG · …"
- [ ] **SEC-03**: `Services` — 3 cards: Cung ứng VLXD (Cát-Đá-San lấp), Xây dựng dân dụng, Vận chuyển đường thủy với icon lucide-react
- [ ] **SEC-04**: `Projects` — 4 dự án tiêu biểu showcase (Cao tốc Cái Nước, Cầu Cửa Lớn, Hòn Khoai, Nhà phố) với CTA "Xem tất cả → /du-an"
- [ ] **SEC-05**: `BigStats` — số liệu nổi bật (tải trọng tàu 700-3,900 tấn, số dự án, năm thành lập, đối tác)
- [ ] **SEC-06**: `Capabilities` — chi tiết năng lực (đội tàu, cơ giới, đội xây lắp) với layout grid
- [ ] **SEC-07**: `CtaQuote` — full-width banner "Yêu cầu báo giá" với nền espresso đậm + CTA prominent
- [ ] **SEC-08**: `Contact` — info công ty (địa chỉ, MST, email) + 3 button CTA (tel/zalo/mailto) với icon

### Projects List Page

- [ ] **PROJ-01**: Data dự án sống trong `lib/projects.ts` với type Project (slug, title, client, location, year, scope, summary)
- [ ] **PROJ-02**: Trang `/du-an` render danh sách projects với card layout, anchor về landing sections khi click "Quay lại"
- [ ] **PROJ-03**: `/du-an` page có metadata riêng (title, description) khác với root layout

### SEO

- [ ] **SEO-01**: `app/sitemap.ts` generate sitemap với 2 routes (`/`, `/du-an`) sử dụng `NEXT_PUBLIC_SITE_URL`
- [ ] **SEO-02**: `app/robots.ts` generate robots.txt với sitemap reference
- [ ] **SEO-03**: Static OG image `/public/og-image.png` (1200x630) với logo + tagline tiếng Việt
- [ ] **SEO-04**: JSON-LD `GeneralContractor` schema embedded trong landing page (Organization name, address, telephone, areaServed, services)
- [ ] **SEO-05**: Favicon (multi-size: 16x16, 32x32, apple-touch-icon 180x180) trong `/public`
- [ ] **SEO-06**: Custom 404 page (`app/not-found.tsx`) với link về trang chủ

### Quality

- [ ] **QA-01**: Responsive build tốt ở 375px / 768px / 1280px (manual test browser DevTools)
- [ ] **QA-02**: Lighthouse mobile: Performance ≥ 90, SEO ≥ 95, Accessibility ≥ 90, Best Practices ≥ 95
- [ ] **QA-03**: Tap target ≥ 44×44px cho mọi CTA, link nav, button
- [ ] **QA-04**: Body text ≥ 16px (audience skews older male, dễ đọc trên mobile)
- [ ] **QA-05**: `tel:`, `mailto:`, `zalo.me/` links hoạt động đúng (manual test trên real device hoặc browser)
- [ ] **QA-06**: Không có console errors khi `npm run build` + `npx serve out/`

### Deployment

- [ ] **DEPLOY-01**: Build artifact `/out/` generate đúng, deploy được lên Cloudflare Pages
- [ ] **DEPLOY-02**: Cloudflare Web Analytics script tích hợp vào `layout.tsx` (production-only)
- [ ] **DEPLOY-03**: README.md updated với deploy instructions (Cloudflare Pages + env vars)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Project Detail Pages

- **PROJ-DETAIL-01**: Trang `/du-an/[slug]` với content chi tiết (ảnh, mô tả dài, role công ty, timeline, quy mô)
- **PROJ-DETAIL-02**: `generateStaticParams()` cho mỗi project
- **PROJ-DETAIL-03**: Image gallery component cho project photos

### Local SEO

- **LSEO-01**: Google Business Profile registration (Tây Ninh)
- **LSEO-02**: Google Maps embed trong Contact section (lazy-loaded)
- **LSEO-03**: Google Search Console setup + sitemap submission

### Content & Conversion

- **CONT-V2-01**: Real project photos thay CSS pattern placeholders
- **CONT-V2-02**: Testimonials section (chỉ khi có named clients đồng ý)
- **CONT-V2-03**: Vietnamese-native copy reviewer pass

### Polish

- **POLISH-01**: Subtle scroll-triggered animations (Motion One nếu cần count-up cho BigStats)
- **POLISH-02**: Dark mode toggle (palette tokens đã CSS-variable-based, swap dễ)
- **POLISH-03**: Per-page OG images (unique cho `/du-an`)

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Contact form (email submission) | B2B VLXD/xây dựng chuộng gọi điện trực tiếp; form ít dùng + spam magnet |
| Public price list (bảng giá VLXD) | Giá biến động theo thị trường/khối lượng/điểm giao; show giá cố định gây sai lệch |
| `/du-an/[slug]` detail pages | Chưa có content chi tiết đầy đủ (ảnh, mô tả); → v2 |
| i18n / Tiếng Anh | Khách hàng mục tiêu hoàn toàn nội địa Việt Nam |
| CMS / admin panel | Content thay đổi không thường xuyên; edit trực tiếp code đủ |
| Logo image của đối tác (Binh đoàn 12, Trường Sơn) | Risk bản quyền; dùng text marquee thay |
| Bebas Neue display font | Không có Vietnamese diacritics → break headings |
| JetBrains Mono font | Chỉ dùng vài chỗ; system mono stack đủ |
| GitHub Pages deployment | ToS cấm "primarily commercial" sites |
| Framer Motion / heavy animation libs | Marketing site không cần; ~34-50KB bloat |
| `next-sitemap` package | Next 15 built-in sitemap.ts đủ |
| `ImageResponse` (Satori) dynamic OG | CSS subset hạn chế + Vietnamese diacritic fragile |
| Hero video / hero slider | Lag mobile + audience không expect |
| Cookie consent banner | Cloudflare Analytics cookieless → không cần consent |
| Customer testimonials generic | "Anh Tuấn rất hài lòng" reads fake; named project clients mạnh hơn |
| Newsletter signup | No content cadence để justify; spam magnet |
| Blog / News section | Cần content commitment chưa có |
| Live chat non-Zalo | VN users distrust generic widgets |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FND-01..07 | Phase 1 | Pending |
| SHELL-01..05 | Phase 2 | Pending |
| SEC-01..08 | Phase 3 | Pending |
| PROJ-01..03 | Phase 4 | Pending |
| SEO-01..06 | Phase 5 | Pending |
| QA-01..06 | Phase 6 | Pending |
| DEPLOY-01..03 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 38 total
- Mapped to phases: 38
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-26*
*Last updated: 2026-05-26 after initial definition*
