// SEO-06 — Branded full-layout 404.
//
// Server component (NO 'use client'). Next 15: app/not-found.tsx renders inside root
// layout — Nav + Footer + FloatingZalo wrap automatically (no manual imports needed).
//
// Per CONTEXT D-19..D-23:
//   - Burgundy hero block, min-h-[60vh], centered card
//   - Eyebrow "404" + H1 "Không tìm thấy trang" + sub paragraph + 2 CTAs
//   - Primary CTA: ← Về trang chủ (Link to /)
//   - Secondary CTA: Gọi tư vấn (tel: via telHref helper)
//   - robots: noindex/nofollow (defensive — prevents error page indexing)
//   - No analytics tracking (deferred to Cloudflare Web Analytics in Phase 6)
//
// Pitfall #14: ship this file to override Next.js default 404.
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Phone } from 'lucide-react'
import { telHref } from '@/lib/site'

export const metadata: Metadata = {
  title: '404 — Không tìm thấy trang',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <section className="bg-burgundy min-h-[60vh] grid place-items-center py-24">
      <div className="max-w-2xl text-bone text-center px-4">
        <p className="font-black text-7xl opacity-60">404</p>
        <h1 className="font-black text-4xl md:text-5xl mt-4">
          Không tìm thấy trang
        </h1>
        <p className="text-lg mt-6 opacity-90">
          Đường dẫn bạn truy cập không tồn tại hoặc đã được di chuyển. Có thể bạn đang tìm những trang sau:
        </p>
        <div className="mt-10 flex gap-4 flex-wrap justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 min-h-[44px] bg-bone text-burgundy font-bold rounded-md px-6 py-3 hover:bg-bone-dark"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Về trang chủ</span>
          </Link>
          <a
            href={telHref()}
            className="inline-flex items-center gap-2 min-h-[44px] border-2 border-bone text-bone font-bold rounded-md px-6 py-3 hover:bg-bone hover:text-burgundy"
          >
            <Phone className="w-4 h-4" aria-hidden="true" />
            <span>Gọi tư vấn</span>
          </a>
        </div>
      </div>
    </section>
  )
}
