// Single source of truth for site navigation (v2.0 multi-page).
// Consumed by: Navbar (desktop dropdown), MobileMenu (accordion), Footer sitemap.
//
// Top-level items may have `children` → renders as dropdown (desktop) /
// accordion (mobile). Items without children are direct links.

export type NavChild = {
  href: string
  label: string
  description?: string // shown in mega-dropdown
}

export type NavItem = {
  href: string
  label: string
  children?: readonly NavChild[]
}

export const navItems: readonly NavItem[] = [
  { href: '/ve-chung-toi', label: 'Giới thiệu' },
  {
    href: '/dich-vu',
    label: 'Dịch vụ',
    children: [
      {
        href: '/dich-vu/cung-ung-vlxd',
        label: 'Cung ứng VLXD',
        description: 'Cát · Đá · San lấp cho công trình & dân dụng',
      },
      {
        href: '/dich-vu/xay-dung',
        label: 'Xây dựng',
        description: 'Nhà phố, công trình dân dụng',
      },
      {
        href: '/dich-vu/van-chuyen-duong-thuy',
        label: 'Vận chuyển đường thủy',
        description: 'Đội tàu vận chuyển VLXD & thiết bị',
      },
    ],
  },
  { href: '/nang-luc', label: 'Năng lực' },
  { href: '/du-an', label: 'Dự án' },
  { href: '/tin-tuc', label: 'Tin tức' },
  { href: '/lien-he', label: 'Liên hệ' },
] as const

// Footer-only secondary links (legal/utility) — separate from main nav.
export const footerSecondaryLinks: readonly NavChild[] = [
  { href: '/lien-he', label: 'Yêu cầu báo giá' },
] as const
