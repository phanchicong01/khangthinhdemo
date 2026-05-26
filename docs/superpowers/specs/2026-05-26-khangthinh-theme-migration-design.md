# Khang Thịnh Website — Theme Migration Design

**Date:** 2026-05-26
**Status:** Approved
**Repo:** https://github.com/phanchicong01/khangthinhdemo.git
**Working dir:** `/Users/congphan/Workspace/my-projects/khang-thing-group/website/`

## Context

Công ty Khang Thịnh Investment (thành lập 2025) cần website giới thiệu công ty với 3 lĩnh vực: cung ứng VLXD (cát-đá-san lấp), xây dựng dân dụng, vận chuyển đường thủy.

Hiện trạng:
- Next.js 15 project skeleton với 4 trang (chủ/dịch vụ/dự án/liên hệ) — sẽ rebuild
- 3 theme HTML demo (A-industrial, B-corporate, C-modern) trong `files (1)/`
- Đã chọn **Mẫu A (Industrial)** làm base layout, **rebuild từ đầu** sang Next.js
- Palette gốc của mẫu A (đỏ tươi + đen) sẽ thay bằng **Burgundy + Bone** light mode

## Goals

- Migrate layout industrial của Mẫu A sang Next.js component-based
- Áp palette đỏ nâu (Burgundy/Bone) thay tone đỏ-đen gốc
- Output: static export (`output: 'export'`) deploy được lên GitHub Pages/Netlify/Vercel
- Phase 1 scope: landing page + danh sách dự án (chưa làm detail dự án)

## Non-Goals (Phase 1)

- Chi tiết từng dự án (`/du-an/[slug]`) — hoãn đến khi có đủ data
- Contact form — chỉ dùng CTA call/zalo/email
- Bảng giá VLXD — bỏ, thay bằng CTA báo giá
- i18n (tiếng Anh) — chỉ tiếng Việt
- CMS / admin panel
- Logo image của đối tác (Binh đoàn 12, Trường Sơn) — dùng text để tránh risk bản quyền

## Architecture

### Stack
- Next.js 15 (App Router, static export)
- React 19
- Tailwind CSS 4 (sử dụng `@theme` directive cho design tokens)
- TypeScript 5.9

### Routing
```
/                       → Single-page landing với anchor scroll
  ├── #services
  ├── #projects
  ├── #capabilities
  └── #contact
/du-an                  → Trang danh sách dự án (list view)
```

### File Structure
```
src/
├── app/
│   ├── layout.tsx              # Root layout, fonts, metadata
│   ├── page.tsx                # Landing - compose tất cả sections
│   ├── globals.css             # Tailwind v4 + @theme tokens
│   ├── sitemap.ts              # Sitemap generator
│   └── du-an/
│       └── page.tsx            # Project list page
├── components/
│   ├── Nav.tsx                 # Sticky nav with anchor links
│   ├── Footer.tsx
│   ├── FloatingZalo.tsx        # Fixed bottom-right Zalo button
│   └── sections/
│       ├── Hero.tsx
│       ├── PartnersMarquee.tsx # Text-based marquee
│       ├── Services.tsx
│       ├── Projects.tsx
│       ├── BigStats.tsx
│       ├── Capabilities.tsx
│       ├── CtaQuote.tsx        # Full-width "Yêu cầu báo giá" banner
│       └── Contact.tsx         # Info + 3 CTA buttons
└── lib/
    └── projects.ts             # 4 dự án tiêu biểu data
```

## Design System

### Color Tokens
```css
@theme {
  --color-burgundy: #6B1F1F;       /* Primary */
  --color-burgundy-dark: #4A1414;  /* Primary hover/active */
  --color-terracotta: #B85450;     /* Accent */
  --color-coffee: #3A1F1A;         /* Dark element */
  --color-bone: #F5F1EA;           /* Background light */
  --color-bone-dark: #EBE4D6;      /* Section alt bg */
  --color-espresso: #1A1410;       /* Text primary */
  --color-taupe: #8B7355;          /* Text muted */
}
```

### Typography
```css
@theme {
  --font-display: "Bebas Neue", sans-serif;     /* Headings, big numbers */
  --font-body: "Be Vietnam Pro", sans-serif;    /* Body text */
}
```
- Bỏ JetBrains Mono — dùng `font-mono` system stack khi cần code-like text

### Usage Patterns
- Page background: `bg-bone`
- Body text: `text-espresso`
- Muted text: `text-taupe`
- Primary CTA: `bg-burgundy text-bone hover:bg-burgundy-dark`
- Secondary CTA: `border border-burgundy text-burgundy hover:bg-burgundy hover:text-bone`
- Accent hover/highlight: `text-terracotta`
- Dark sections (Hero, CTA banner): `bg-espresso text-bone`

## Sections (Landing Page)

| Section | Purpose | Key Content |
|---------|---------|-------------|
| **Nav** | Sticky navigation | Logo + 5 anchor links + CTA "Báo giá" |
| **Hero** | First impression | Headline lớn, sub-text, 2 CTA (Gọi/Báo giá) |
| **PartnersMarquee** | Trust signal | Text scroll: "BINH ĐOÀN 12 · TRƯỜNG SƠN · BỘ QUỐC PHÒNG · …" |
| **Services** | 3 lĩnh vực | 3 cards: VLXD / Xây dựng / Vận chuyển đường thủy |
| **Projects** | Showcase | 4 dự án tiêu biểu (Cao tốc Cái Nước, Cầu Cửa Lớn, Hòn Khoai, Nhà phố) + link `/du-an` |
| **BigStats** | Năng lực số liệu | 700-3,900 tấn, X dự án, năm thành lập, X đối tác |
| **Capabilities** | Chi tiết năng lực | Đội tàu, cơ giới, đội xây lắp |
| **CtaQuote** | Conversion banner | "Yêu cầu báo giá" full-width banner đen |
| **Contact** | Liên hệ | Info công ty + 3 button (Gọi/Zalo/Email) |
| **Footer** | Bottom info | Logo + thông tin pháp lý + links |
| **FloatingZalo** | Always-visible CTA | Fixed bottom-right, mobile + desktop |

## Data

### `lib/projects.ts`
```ts
export type Project = {
  slug: string;
  title: string;
  client: string;
  location: string;
  year: string;
  scope: string;
  summary: string;
};

export const projects: Project[] = [
  { slug: 'cao-toc-cai-nuoc-dat-mui', title: 'Cao tốc Cái Nước - Đất Mũi', client: 'Bộ Quốc phòng - Binh đoàn 12 - Trường Sơn', location: 'Cà Mau', ... },
  { slug: 'cau-cua-lon', title: 'Cầu Cửa Lớn - Đất Mũi', ... },
  { slug: 'duong-ra-hon-khoai', title: 'Đường giao thông ra đảo Hòn Khoai', ... },
  { slug: 'nha-pho-tieu-bieu', title: 'Nhà phố tiêu biểu', client: 'Cá nhân', ... },
];
```

### Services / Stats / Capabilities
Inline trong component tương ứng — không tách lib file (YAGNI).

## SEO

### Root `layout.tsx` metadata
```ts
export const metadata: Metadata = {
  title: 'Khang Thịnh Investment — Cung ứng VLXD & Xây dựng & Vận chuyển',
  description: 'Cung ứng cát, đá, san lấp. Xây dựng nhà phố & công trình dân dụng. Vận chuyển đường thủy. Đối tác Bộ Quốc phòng - Binh đoàn 12 - Trường Sơn.',
  openGraph: { ... },
  metadataBase: new URL('https://khangthinhinv.vn'),  // placeholder until real domain
};
```

### `sitemap.ts` outputs
- `/`
- `/du-an`

### `public/robots.txt`
```
User-agent: *
Allow: /
Sitemap: https://khangthinhinv.vn/sitemap.xml
```

## Contact Mechanism

3 CTA — **không có form**:
- Gọi: `tel:0921985599`
- Zalo: `https://zalo.me/0921985599`
- Email: `mailto:khangthinhinv2025@gmail.com`

FloatingZalo: fixed bottom-right, icon Zalo + tooltip "Chat với chúng tôi", luôn hiển thị trên mọi page.

## Static Export Config

```ts
// next.config.ts
const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
};
```

## Assets

- `/public/images/` — chứa ảnh dự án (placeholder lúc đầu)
- `/public/logo.png` — extract từ `../Illustration.png`
- `/public/og-image.png` — OpenGraph image (1200x630)
- `/public/favicon.ico`
- Hero background: CSS pattern (diagonal stripes) thay vì ảnh thật ở phase 1

## Cleanup Tasks

Xoá khỏi codebase hiện tại:
- `src/app/dich-vu/` (merged vào landing)
- `src/app/lien-he/` (merged vào landing)
- `src/components/Header.tsx` (thay bằng `Nav.tsx`)

Rewrite:
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/globals.css`
- `src/components/Footer.tsx`
- `src/app/du-an/page.tsx`

## Testing

- **Build test:** `npm run build` phải sinh `/out/` không lỗi
- **Type check:** `npx tsc --noEmit` pass
- **Lighthouse target:** Performance ≥ 90, SEO ≥ 95, Accessibility ≥ 90
- **Responsive:** mobile 375px, tablet 768px, desktop 1280px+
- **Manual test:** anchor links cuộn đúng section, CTA buttons mở đúng tel/zalo/mailto

## Migration Order

1. Setup: palette + fonts + globals.css + layout metadata
2. Layout shell: Nav + Footer + FloatingZalo
3. Sections (theo thứ tự): Hero → PartnersMarquee → Services → Projects → BigStats → Capabilities → CtaQuote → Contact
4. Compose vào `app/page.tsx`
5. Build `lib/projects.ts` + `app/du-an/page.tsx`
6. SEO: `sitemap.ts` + `robots.txt` + OG image
7. Cleanup folders cũ
8. Build test + Lighthouse audit

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Chưa có ảnh dự án thật | Dùng CSS pattern + placeholder, replace sau |
| Chưa có logo công ty chuẩn | Extract tạm từ `Illustration.png`, dùng text logo nếu cần |
| Domain chưa chốt | Dùng placeholder `khangthinhinv.vn` trong metadata, update sau |
| Font load chậm trên 3G | Preconnect Google Fonts + `display=swap` |
| Static export limit (no API) | Contact dùng tel/zalo/mailto thuần — không cần backend |

## Open Questions (defer)

- Có nên thêm Google Maps embed ở section Contact không?
- Có cần thêm trang `/ve-chung-toi` (About) sau phase 1?
- Có làm bản tiếng Anh không?
