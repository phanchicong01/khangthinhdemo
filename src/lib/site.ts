// Single source of truth for company facts, domain, and CTA URLs.
//
// Consumers (current + planned):
// - src/app/layout.tsx           — metadataBase via siteUrl
// - src/app/sitemap.ts  (Phase 5)
// - src/app/robots.ts   (Phase 5)
// - src/components/Footer.tsx     (Phase 2) — legal block (MST, ĐDPL, address)
// - src/components/FloatingZalo.tsx (Phase 2) — zaloHref()
// - src/components/sections/Contact.tsx (Phase 3) — 3-channel CTAs
// - JSON-LD GeneralContractor block (Phase 5) — taxID, telephone, postalAddress

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://khangthinhinv.vn'

export const company = {
  legalName: 'Công ty TNHH Khang Thịnh Investment',
  shortName: 'KHANG THỊNH INV',
  tagline: 'Hợp tác cùng phát triển',
  founded: 2025,

  // Phone — primary (also Zalo)
  phoneDisplay: '082 6553 599',
  phoneE164: '+84826553599', // tel:+84826553599 — E.164, no spaces, no parens
  phoneRaw: '0826553599',    // bare digits, used to build zalo.me URL

  // Phone — secondary (additional contact line, no Zalo)
  phoneSecondaryDisplay: '0333 77 8888',
  phoneSecondaryE164: '+84333778888',
  phoneSecondaryRaw: '0333778888',

  email: 'khangthinhinv2025@gmail.com',

  // Zalo deep link — HTTPS (NEVER zalo://).
  // Works on iOS Universal Link + Android intent fallback.
  zaloUrl: 'https://zalo.me/0826553599',

  // Legal (MST + ĐDPL)
  taxId: '1102107064',
  taxIdDisplay: '1102 107 064',
  legalRep: 'Tô Thị Bích Ngọc',

  // Address (PostalAddress shape — reusable in JSON-LD)
  address: {
    street: 'A3-02 KDC Long Phú',
    locality: 'xã Bến Lức',
    region: 'Tây Ninh',
    country: 'VN',
    full: 'A3-02 KDC Long Phú, xã Bến Lức, tỉnh Tây Ninh',
  },
} as const

// Helpers (prevent typos at call sites; consumed by Footer, Contact, FloatingZalo)
export const telHref = (): string => `tel:${company.phoneE164}`
export const telSecondaryHref = (): string => `tel:${company.phoneSecondaryE164}`
export const mailtoHref = (): string => `mailto:${company.email}`
export const zaloHref = (): string => company.zaloUrl

// Type export for downstream consumers (PostalAddress JSON-LD in Phase 5)
export type Company = typeof company
