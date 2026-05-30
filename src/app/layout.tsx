// Source: https://nextjs.org/docs/app/api-reference/components/font#with-tailwind-css
// Be Vietnam Pro is NOT variable in next/font/google — `weight` array REQUIRED.
// `subsets: ['vietnamese', 'latin']` is mandatory for correct Vietnamese diacritic rendering.
import type { Metadata, Viewport } from 'next'
import { Be_Vietnam_Pro } from 'next/font/google'
import { siteUrl } from '@/lib/site'
import Navbar from '@/components/nav/Navbar'
import Footer from '@/components/layout/Footer'
import FloatingZalo from '@/components/layout/FloatingZalo'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-be-vietnam-pro',
})

// metadataBase resolved at build time from NEXT_PUBLIC_SITE_URL via lib/site.ts.
// Default fallback: https://khangthinhinv.vn. Override via .env.local for dev/preview deploys.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
    // suppressHydrationWarning: next-themes sets the `class` on <html> before
    // hydration, which would otherwise trigger a mismatch warning.
    <html lang="vi" className={beVietnamPro.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <Navbar />
          {children}
          <Footer />
          <FloatingZalo />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
