# Khang Thịnh Investment — Website

## What This Is

Website giới thiệu công ty TNHH Khang Thịnh Investment — một doanh nghiệp mới thành lập (2025) hoạt động trong 3 lĩnh vực: cung ứng vật liệu xây dựng (cát/đá/san lấp), xây dựng dân dụng, và vận chuyển đường thủy. Website phục vụ đa đối tượng: chủ đầu tư/nhà thầu lớn (verify uy tín), chủ nhà cá nhân (tìm đơn vị xây nhà phố), doanh nghiệp mua VLXD số lượng lớn, và các bên có nhu cầu thuê vận chuyển đường thủy.

## Core Value

**Khách hàng tiềm năng — sau khi xem website — tin tưởng đủ để gọi/Zalo liên hệ tư vấn.** Trust (qua portfolio dự án + đối tác Quốc phòng) + Conversion (CTA call/zalo/email rõ ràng) là hai mặt của cùng một mục tiêu.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Single-page landing với 8 sections industrial layout (Hero/Partners/Services/Projects/Stats/Capabilities/CTA-Quote/Contact)
- [ ] Trang `/du-an` danh sách dự án (list view, không có detail page ở phase 1)
- [ ] Palette Burgundy + Bone (light mode) thay tone đỏ-đen của Mẫu A gốc
- [ ] 3 CTA liên hệ: tel/zalo/mailto + FloatingZalo button cố định
- [ ] SEO foundation: metadata, OpenGraph (static PNG), sitemap.ts, robots.ts, JSON-LD `GeneralContractor`
- [ ] Responsive: mobile 375px → desktop 1440px
- [ ] Static export (`output: 'export'`) — deploy Cloudflare Pages
- [ ] Type-safe (TypeScript strict) + build pass `npm run build`
- [ ] Lighthouse: Performance ≥ 90, SEO ≥ 95, Accessibility ≥ 90
- [ ] 1 font family (Be Vietnam Pro 400-900) với subset Vietnamese qua `next/font/google`
- [ ] Site URL qua env var `NEXT_PUBLIC_SITE_URL`
- [ ] Phone/Zalo/Email là single source of truth trong `lib/site.ts`
- [ ] Cloudflare Web Analytics tích hợp

### Out of Scope

- **Contact form (mailto/Formspree)** — B2B ngành VLXD/xây dựng chuộng gọi điện trực tiếp; form ít dùng và dễ spam
- **Bảng giá VLXD chi tiết** — Giá biến động theo thị trường/khối lượng/điểm giao; show giá cố định gây sai lệch + mất linh hoạt thương lượng
- **Trang `/du-an/[slug]` chi tiết dự án** — Chưa có dữ liệu chi tiết đầy đủ (ảnh, mô tả, vai trò công ty); hoãn đến khi user cung cấp content
- **i18n / tiếng Anh** — Khách hàng mục tiêu hoàn toàn nội địa Việt Nam
- **CMS / admin panel** — Content thay đổi không thường xuyên; edit trực tiếp code đủ dùng
- **Logo đối tác** (Binh đoàn 12, Trường Sơn, Bộ Quốc phòng) — Risk bản quyền; dùng text marquee thay vì image
- **JetBrains Mono font** — Chỉ dùng ít chỗ; dùng `font-mono` system stack đủ
- **Bebas Neue font** — Không có Vietnamese diacritics; thay bằng Be Vietnam Pro 800/900 uppercase
- **GitHub Pages deploy** — ToS cấm "primarily commercial" sites
- **Framer Motion / motion v12** — Quá nặng (~34-50KB) cho marketing site; dùng CSS-only + Motion One nếu thực sự cần
- **next-sitemap package** — Next 15 built-in `app/sitemap.ts` + `app/robots.ts` đủ dùng
- **ImageResponse cho OG dynamic** — Satori CSS subset hạn chế + Vietnamese diacritic fragile; dùng static `/public/og-image.png`
- **Google Maps embed** — Phase 1 ưu tiên CTA liên hệ; map có thể thêm sau
- **Trang About `/ve-chung-toi`** — Thông tin công ty đủ trong Hero + Footer + Capabilities; thêm trang riêng nếu cần sau

## Context

**Tech environment:**
- Đã có Next.js 15 skeleton (App Router) trong `/website/` với 4 trang (chủ/dịch vụ/dự án/liên hệ) — sẽ rebuild
- Repo: https://github.com/phanchicong01/khangthinhdemo.git (đã init, có initial commit)
- Build output: `/out/` (static files)

**Design assets có sẵn:**
- 3 theme HTML demo (`../files (1)/khangthinh-mau-A|B|C-*.html`) — đã chọn Mẫu A (Industrial)
- File PDF profile chính thức (`../Khang Thịnh Investment Profile 03-05-26.pdf`) — chứa logo, info, dự án
- `../Illustration.png` — illustration công ty

**Design spec đã duyệt:**
- `docs/superpowers/specs/2026-05-26-khangthinh-theme-migration-design.md`
- Hybrid layout: Mẫu A industrial layout + palette Burgundy/Bone light mode

**Company facts (từ CLAUDE.md):**
- MST: 1102 107 064, ĐDPL: Tô Thị Bích Ngọc
- SĐT: 092 198 55 99, Email: khangthinhinv2025@gmail.com
- Địa chỉ: A3-02 KDC Long Phú, xã Bến Lức, tỉnh Tây Ninh
- Phương châm: "Hợp tác cùng phát triển"
- 4 dự án tiêu biểu: Cao tốc Cái Nước-Đất Mũi, Cầu Cửa Lớn, Đường ra Hòn Khoai, Nhà phố

## Constraints

- **Tech stack**: Next.js 15 (App Router) + React 19 + Tailwind CSS 4 + TypeScript 5.9 — đã set up sẵn, không đổi
- **Deployment model**: Static export (`output: 'export'`) — không có backend, không server actions
- **Timeline**: Không gấp, ưu tiên chất lượng
- **Content**: Logo công ty extract từ PDF/Illustration.png; ảnh dự án chưa có (dùng placeholder/CSS pattern)
- **Domain**: Chưa chốt — dùng placeholder `khangthinhinv.vn` trong metadata; deploy target chọn sau
- **Legal**: Không dùng logo đối tác (Binh đoàn 12, Trường Sơn) — chỉ dùng tên text

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Rebuild từ đầu theo Mẫu A (không port code Next.js cũ) | Code cũ chỉ là skeleton tạm, không theo theme đã chọn | — Pending |
| Palette Burgundy + Bone (light mode) | User chọn tone đỏ nâu sang trọng, light mode chuyên nghiệp doanh nghiệp | — Pending |
| Hybrid routing (single-page + /du-an list) | Single-page phù hợp landing, /du-an mở rộng được sau | — Pending |
| Bỏ Pricing section, thay bằng CTA báo giá | Giá VLXD biến động, show giá cố định gây risk | — Pending |
| Bỏ contact form, dùng CTA call/zalo/mailto | B2B ngành xây dựng chuộng liên hệ trực tiếp | — Pending |
| Partners marquee dùng text không dùng logo image | Tránh risk bản quyền logo Binh đoàn 12 / Trường Sơn | — Pending |
| Hoãn /du-an/[slug] detail page | Chưa có content chi tiết đủ để fill | — Pending |
| 1 font family (Be Vietnam Pro 400-900), bỏ Bebas Neue | Bebas Neue không có Vietnamese diacritics → break Hero/headings; dùng Be Vietnam Pro weight 800/900 + uppercase + letter-spacing để có industrial display feel | — Pending |
| Deploy lên Cloudflare Pages | Free, unlimited bandwidth, commercial-OK, VN edge POPs, cookieless analytics; GitHub Pages cấm commercial use | — Pending |
| Font load qua `next/font/google` với subset Vietnamese explicit | Built-in Next.js, tự động optimize, tránh CLS | — Pending |
| Site URL qua env var `NEXT_PUBLIC_SITE_URL` | Tránh hardcode domain — đổi 1 chỗ khi có domain thật | — Pending |
| Animation: CSS-only default, Motion One (4KB) nếu cần count-up | Tránh bloat bundle (Framer Motion ~34-50KB cho marketing site là overkill) | — Pending |
| Icons: lucide-react | Tree-shakable, broad set, industrial line aesthetic | — Pending |
| Analytics: Cloudflare Web Analytics | Free, cookieless, không cần consent banner (VN PDPL friendly) | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-26 after initialization*
