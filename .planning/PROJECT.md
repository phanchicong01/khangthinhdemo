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
- [ ] SEO foundation: metadata, OpenGraph, sitemap.xml, robots.txt
- [ ] Responsive: mobile 375px → desktop 1440px
- [ ] Static export (`output: 'export'`) — deploy được lên GitHub Pages/Netlify/Vercel
- [ ] Type-safe (TypeScript strict) + build pass `npm run build`
- [ ] Lighthouse: Performance ≥ 90, SEO ≥ 95, Accessibility ≥ 90

### Out of Scope

- **Contact form (mailto/Formspree)** — B2B ngành VLXD/xây dựng chuộng gọi điện trực tiếp; form ít dùng và dễ spam
- **Bảng giá VLXD chi tiết** — Giá biến động theo thị trường/khối lượng/điểm giao; show giá cố định gây sai lệch + mất linh hoạt thương lượng
- **Trang `/du-an/[slug]` chi tiết dự án** — Chưa có dữ liệu chi tiết đầy đủ (ảnh, mô tả, vai trò công ty); hoãn đến khi user cung cấp content
- **i18n / tiếng Anh** — Khách hàng mục tiêu hoàn toàn nội địa Việt Nam
- **CMS / admin panel** — Content thay đổi không thường xuyên; edit trực tiếp code đủ dùng
- **Logo đối tác** (Binh đoàn 12, Trường Sơn, Bộ Quốc phòng) — Risk bản quyền; dùng text marquee thay vì image
- **JetBrains Mono font** — Chỉ dùng ít chỗ; dùng `font-mono` system stack đủ
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
| 2 font families (Be Vietnam Pro + Bebas Neue), bỏ JetBrains Mono | Giảm bundle font, dùng system mono khi cần | — Pending |

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
