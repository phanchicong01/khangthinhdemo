// Single source of truth for project data.
//
// Consumers:
// - src/components/sections/Projects.tsx — landing 4-card showcase (visual locked from Phase 3)
// - src/app/du-an/page.tsx               — /du-an list route (adds location + summary per card)
// - src/app/sitemap.ts                    (Phase 5) — optional URL inclusion if /du-an/[slug] added later
//
// Field map from Phase 3 Projects.tsx → this module:
//   name  → title      role → scope      Icon → icon (lowercase)
// New fields added in Phase 4: slug, location, summary
//
// Per CONTEXT.md D-01..D-09 — do NOT split 'Nhà phố tiêu biểu' into 3 entries.
import { Construction, GitBranch, Anchor, Home } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type Project = {
  slug: string                              // kebab-case URL fragment + stable identifier (D-04)
  title: string                             // public display name (Phase 3 'name')
  client: string                            // named client(s) — front-and-center
  location: string                          // D-05
  year: string                              // '2024' | '2025' (D-07)
  scope: string                             // role description (Phase 3 'role')
  summary: string                           // D-06 — 1–2 sentences; shown on /du-an only
  icon: LucideIcon                          // Lucide React icon
  blockBg: 'bg-burgundy' | 'bg-espresso'    // color block bg
}

export const projects: readonly Project[] = [
  {
    slug: 'cao-toc-cai-nuoc-dat-mui',
    title: 'Cao tốc Cái Nước — Đất Mũi Cà Mau',
    client: 'Bộ Quốc phòng — Binh đoàn 12 — Trường Sơn',
    location: 'Đất Mũi, Cà Mau',
    year: '2024',
    scope: 'Cung ứng VLXD + vận chuyển',
    summary:
      'Cung ứng khối lượng lớn cát, đá, vật liệu san lấp và vận chuyển bằng đường thủy đến công trường cao tốc — dự án trọng điểm thuộc Bộ Quốc phòng — Binh đoàn 12 — Trường Sơn.',
    icon: Construction,
    blockBg: 'bg-burgundy',
  },
  {
    slug: 'cau-cua-lon-dat-mui',
    title: 'Cầu Cửa Lớn — Đất Mũi Cà Mau',
    client: 'Bộ Quốc phòng — Binh đoàn 12 — Trường Sơn',
    location: 'Đất Mũi, Cà Mau',
    year: '2024',
    scope: 'Cung ứng VLXD + vận chuyển',
    summary:
      'Cung cấp vật liệu xây dựng và vận chuyển đường thủy phục vụ thi công cầu Cửa Lớn — Đất Mũi Cà Mau — dự án thuộc Binh đoàn 12 — Trường Sơn.',
    icon: GitBranch,
    blockBg: 'bg-espresso',
  },
  {
    slug: 'duong-ra-dao-hon-khoai',
    title: 'Đường giao thông ra đảo Hòn Khoai',
    client: 'Bộ Quốc phòng — Binh đoàn 12 — Trường Sơn',
    location: 'Đảo Hòn Khoai, Cà Mau',
    year: '2024',
    scope: 'Cung ứng VLXD + vận chuyển',
    summary:
      'Vận chuyển đường thủy cát, đá và vật liệu thi công phục vụ tuyến giao thông ra đảo Hòn Khoai — công trình do Binh đoàn 12 — Trường Sơn triển khai.',
    icon: Anchor,
    blockBg: 'bg-espresso',
  },
  {
    slug: 'nha-pho-tieu-bieu',
    title: 'Nhà phố tiêu biểu',
    client: 'Cô Thúy (Thạnh Hóa) · Anh Bình (Mỹ Yên) · Chị Ngọc (Long An)',
    location: 'Long An · Thạnh Hóa · Mỹ Yên',
    year: '2025',
    scope: 'Thi công xây dựng',
    summary:
      'Thi công xây dựng nhà phố dân dụng tại Long An (Thạnh Hóa, Mỹ Yên) — các công trình tiêu biểu của Cô Thúy, Anh Bình, Chị Ngọc.',
    icon: Home,
    blockBg: 'bg-burgundy',
  },
] as const

// Helper — Phase 4 passthrough (D-09). Future-proofing for when project count > featured-4.
export const getFeaturedProjects = (): readonly Project[] => projects
