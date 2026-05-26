// Source: https://nextjs.org/docs/app/api-reference/components/font#with-tailwind-css
// Be Vietnam Pro is NOT variable in next/font/google — `weight` array REQUIRED.
// `subsets: ['vietnamese', 'latin']` is mandatory for correct Vietnamese diacritic rendering.
import type { Metadata, Viewport } from 'next'
import { Be_Vietnam_Pro } from 'next/font/google'
import './globals.css'

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-be-vietnam-pro',
})

// NOTE: metadataBase intentionally omitted in this task — added in Plan 02 once
// `lib/site.ts` exposes `siteUrl`. Until then, build will log a metadataBase
// warning; Plan 02 closes that gap (Pitfall #4 / FND-05).
export const metadata: Metadata = {
  title: {
    default: 'Khang Thịnh Investment — Cung ứng VLXD, Xây dựng, Vận chuyển',
    template: '%s | Khang Thịnh Investment',
  },
  description:
    'Cung ứng cát, đá, san lấp. Xây dựng nhà phố & công trình dân dụng. Vận chuyển đường thủy. Đối tác Bộ Quốc phòng - Binh đoàn 12 - Trường Sơn.',
}

export const viewport: Viewport = {
  themeColor: '#6B1F1F',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
