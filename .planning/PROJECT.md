# Khang Thịnh Investment — Website (Milestone v2.0)

## What This Is

Mở rộng website Khang Thịnh từ **landing 1 trang (v1.0)** thành **website doanh nghiệp đa trang đầy đủ (v2.0)** — đẳng cấp đối thủ lớn cùng ngành cung ứng VLXD + xây dựng + vận chuyển đường thủy.

v1.0 (đã live trên Vercel) là MVP tối giản. v2.0 đầu tư về **chiều sâu nội dung, hệ thống điều hướng, và polish visual** để website xài lâu dài 5–10 năm.

## v1.0 Status

- Live: `https://khangthinhdemo-git-main-phanchicong01s-projects.vercel.app/`
- 6 phases complete (10 plans)
- Stack locked: Next.js 15 + React 19 + Tailwind 4 + TypeScript 5.9 + Static export
- Burgundy/Bone palette + Be Vietnam Pro

## v2.0 Vision (Why)

User feedback 2026-05-29: "web hơi không được chi tiết, dở", "hiệu ứng cũng ko, bố trí thô sơ, không có tính lâu dài".

→ Reset target từ **"MVP landing"** sang **"Full Corporate Website"**.

## Core Value (carried over)

**Khách hàng tiềm năng — sau khi xem website — tin tưởng đủ để gọi/Zalo liên hệ tư vấn.** Trust + Conversion vẫn là 2 mặt cùng một mục tiêu.

v2.0 thêm: **Depth (chiều sâu nội dung)** + **Polish (cảm giác premium)** để giữ khách lâu hơn, scroll sâu hơn, tin tưởng nhiều hơn.

## Audience (giữ nguyên v1.0)

1. Chủ đầu tư / nhà thầu lớn — verify uy tín, xem portfolio dự án Quốc phòng
2. Chủ nhà cá nhân — tìm đơn vị xây nhà phố
3. Doanh nghiệp mua VLXD số lượng lớn — verify năng lực cung ứng
4. Bên thuê vận chuyển đường thủy — verify đội tàu, tuyến đường

## Requirements (v2.0)

### Active — New scope

**Routes (mới):**

- [ ] `/` — Landing premium (giữ + nâng cấp visual + animations)
- [ ] `/ve-chung-toi` — Giới thiệu công ty (lịch sử, sứ mệnh, đội ngũ, sơ đồ tổ chức, giấy phép)
- [ ] `/dich-vu` — Hub 3 dịch vụ + link tới detail
- [ ] `/dich-vu/cung-ung-vlxd` — Cát/Đá/San lấp chi tiết + khu vực giao
- [ ] `/dich-vu/xay-dung` — Nhà phố/dân dụng + quy trình thi công
- [ ] `/dich-vu/van-chuyen-duong-thuy` — Đội tàu + tải trọng + tuyến đường ĐBSCL
- [ ] `/nang-luc` — Năng lực sâu (đội tàu, cơ giới, đội xây lắp, an toàn, chứng chỉ)
- [ ] `/du-an` — List dự án (giữ + nâng cấp filter/search)
- [ ] `/du-an/[slug]` — Detail từng dự án (ảnh placeholder, khối lượng, thời gian, vai trò)
- [ ] `/lien-he` — Trang liên hệ riêng (form báo giá + Google Maps + nhiều kênh)
- [ ] `/tin-tuc` — Blog list (MDX)
- [ ] `/tin-tuc/[slug]` — Blog post detail

**System-level features:**

- [ ] Navigation đa cấp (dropdown cho `/dich-vu/*`, `/du-an/*`)
- [ ] Breadcrumbs cho mọi deep page
- [ ] Form báo giá (Cloudflare Workers + Email Routing) — anti-spam honeypot + rate limit
- [ ] MDX blog system với frontmatter + reading time + author + tags
- [ ] Animations premium: page transitions, scroll reveal, parallax hero, count-up stats, hover micro-interactions (Motion v12)
- [ ] i18n EN (English fallback cho khách quốc tế / nhà thầu nước ngoài)
- [ ] Dark mode toggle (system preference + manual)
- [ ] Search local (Pagefind static search index)
- [ ] PWA manifest + service worker (offline-ready)
- [ ] Web Vitals tracking (Vercel Analytics)
- [ ] Newsletter signup ở footer (Cloudflare Workers + email list)
- [ ] Animated SVG logo cho hero
- [ ] FAQ schema markup (Schema.org FAQPage)
- [ ] LocalBusiness schema mở rộng (areaServed, serviceCatalog đầy đủ)

**Content depth (mỗi trang):**

- [ ] Hero variants riêng cho mỗi page (không lặp Hero landing)
- [ ] FAQ section trên mỗi service page (5–7 câu)
- [ ] Quy trình 4–6 bước trên service pages
- [ ] Cam kết chất lượng / Giấy phép trên `/ve-chung-toi` và `/nang-luc`
- [ ] CTA contextual cho mỗi page (không chỉ "Gọi/Zalo" generic)
- [ ] Related projects ở cuối mỗi service page
- [ ] Tagline "Hợp tác cùng phát triển" xuất hiện ít nhất 1 chỗ visible

**Visual polish:**

- [ ] Premium hero treatment: full-bleed, gradient mesh, parallax background
- [ ] Asymmetric grids thay cho 2/3-col đều đều
- [ ] Large typography display cho headlines
- [ ] SVG decorations / blueprint patterns lặp lại trên mọi page
- [ ] Hover lifts, magnetic buttons, smooth scrolling
- [ ] Image placeholder system tốt hơn block màu đặc (gradient + texture + icon stack)
- [ ] Loading skeletons cho client components
- [ ] 404 + 500 pages thiết kế riêng

**Quality gates:**

- [ ] Lighthouse mọi route: Performance ≥ 85 (chấp nhận thấp hơn v1.0 vì Motion v12), SEO ≥ 95, A11y ≥ 95, Best Practices ≥ 95
- [ ] TypeScript strict, build pass
- [ ] All routes có metadata + OG image riêng
- [ ] Sitemap.xml include 12+ routes
- [ ] Form submission test end-to-end (Cloudflare Worker)
- [ ] Real device test trên iPhone Safari + Android Chrome

### Validated (carry over from v1.0)

- Stack Next.js 15 + React 19 + Tailwind 4 + TS 5.9 (locked)
- Burgundy/Bone palette
- Be Vietnam Pro font
- Static export model
- Single source of truth `lib/site.ts`
- Vercel deployment
- 2 phones (082 6553 599 primary + 0333 77 8888 secondary)

### Out of Scope (v2.0)

- **CMS / admin panel** — Content edit trực tiếp code; v3.0 nếu cần
- **E-commerce / payment** — Không bán hàng online
- **Login / user accounts** — Website thông tin, không tương tác cá nhân
- **Real-time chat** (Tawk.to / Crisp) — Zalo widget native đã đủ
- **Video CMS** — Embed YouTube nếu cần video, không host video
- **Booking system** — Form báo giá đủ cho stage này
- **Multi-tenant / sub-brand** — 1 công ty, 1 brand

## Context (Tech Stack Evolution v1.0 → v2.0)

### From v1.0 (unchanged)

- Next.js 15 App Router
- React 19
- Tailwind CSS 4 với @theme directive
- TypeScript 5.9 strict
- Be Vietnam Pro (variable font)
- Lucide React icons
- Static export `output: 'export'`
- Burgundy/Bone palette

### New for v2.0

| Library | Purpose | Why |
|---------|---------|-----|
| **`motion` v12** | Premium animations | Đã loại trong v1.0 vì "marketing site overkill" — v2.0 cần. ~50KB chấp nhận được cho corporate site |
| **`@vercel/analytics`** | Web Vitals + page tracking | Đã defer từ v1.0 |
| **Cloudflare Workers** | Form backend | Free, no brand, full control. Email Routing cho inbox notification |
| **`@next/mdx`** + `gray-matter` + `reading-time` | Blog system | MDX cho `/tin-tuc/*` |
| **`next-intl` v3** | i18n VI/EN | Type-safe, App Router native |
| **`next-themes`** | Dark mode | Standard library, SSR-safe |
| **`pagefind`** | Static search | Build-time index, ~30KB runtime, không cần backend |
| **`@formkit/auto-animate`** *(maybe)* | Tiny list animations | Drop-in `useAutoAnimate()` hook |

### Architecture Changes

- Add `src/app/[locale]/` segment cho i18n
- Add `src/content/blog/` cho MDX posts
- Add `src/lib/services.ts`, `src/lib/capabilities.ts`, `src/lib/team.ts`, `src/lib/faqs.ts` — single source of truth pattern mở rộng
- Add `src/components/nav/` (Navbar with dropdown, MobileMenu, MegaMenu)
- Add `src/components/animations/` (Reveal, Parallax, CountUp, MagneticButton)
- Add `src/components/forms/QuoteForm.tsx` + Worker endpoint
- Add `src/messages/vi.json`, `src/messages/en.json` cho i18n

## Domain & Deployment

- **Current:** `https://khangthinhdemo-git-main-phanchicong01s-projects.vercel.app/` (Vercel default)
- **Future:** Custom domain TBD — placeholder `https://khangthinhinv.vn` trong `NEXT_PUBLIC_SITE_URL`
- **Auto-deploy:** mọi push `origin/main` → Vercel build

## Constraints

- **Content thật:** Chưa có ảnh thật + giấy phép scan. v2.0 sẽ dùng **placeholder content plausible** (em tự viết dựa trên facts có sẵn) — anh edit sau khi xem live. Code structure design sao cho swap content dễ.
- **Budget:** Không hạn chế — ưu tiên chất lượng tối đa
- **Timeline:** Không gấp
- **Logo đối tác:** Vẫn không dùng image logo Binh đoàn 12 (risk bản quyền) — text-based vẫn áp dụng

## Key Decisions Locked (v2.0)

1. **Multi-page architecture** (12+ routes) thay vì single-page
2. **Motion v12** cho animations (revoked v1.0 "no-Motion" decision)
3. **Cloudflare Workers** cho form backend (revoked v1.0 "no form" decision)
4. **i18n EN fallback** (revoked v1.0 "VI only" decision)
5. **Dark mode toggle** (mới, không có ở v1.0)
6. **MDX blog** (revoked v1.0 "no blog" decision)
7. **Custom domain** vẫn pending — dùng placeholder `khangthinhinv.vn`
8. **Vercel** locked (đã deploy, không đổi sang Cloudflare Pages nữa)
9. **Vercel Analytics** thay Cloudflare Web Analytics (cùng platform)
10. **Content giả định** em viết, anh edit sau

## Workflow Notes (carry over)

- All user-facing responses in Vietnamese
- Code + comments in English
- Auto-push after every phase completes
- `auto_advance: true` trong config
- `commit_docs: true`
- Historical phase docs là point-in-time, không mass-update
