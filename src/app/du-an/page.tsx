// PROJ-02 + PROJ-03 — /du-an list route.
// Server component (static export safe). Consumes typed data from @/lib/projects.
// Metadata distinct from root layout (PITFALL #11 — 2nd indexable URL).
// Back link uses static href '/#du-an' (NOT router.back) so it works after fresh page load (SC4).
// Burgundy/Bone palette — legacy blue palette (#1a5276) + emoji icons fully removed in this rewrite.
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { projects } from '@/lib/projects'

export const metadata: Metadata = {
  title: 'Dự án tiêu biểu | Khang Thịnh Investment',
  description:
    '4 dự án tiêu biểu Khang Thịnh đã thực hiện: cao tốc Cái Nước — Đất Mũi Cà Mau, cầu Cửa Lớn, đường ra đảo Hòn Khoai (đối tác Bộ Quốc phòng — Binh đoàn 12 — Trường Sơn), nhà phố tiêu biểu Long An.',
  alternates: { canonical: '/du-an' },
}

export default function DuAnPage() {
  return (
    <main className="bg-bone min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-20 md:py-24">
        {/* Page header: back link → H1 → sub-text (D-16) */}
        <Link
          href="/#du-an"
          className="inline-flex items-center gap-2 min-h-[44px] text-burgundy hover:underline text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Về trang chủ</span>
        </Link>

        <h1 className="mt-6 font-black uppercase tracking-wide text-4xl md:text-5xl text-burgundy">
          Dự án tiêu biểu
        </h1>
        <p className="mt-4 text-base md:text-lg text-espresso max-w-3xl">
          Những công trình Khang Thịnh đã thực hiện — đối tác Bộ Quốc phòng, Binh đoàn 12, Trường Sơn.
        </p>

        {/* 2×2 desktop / 1-col mobile grid (D-17) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p) => {
            const Icon = p.icon
            return (
              <article
                key={p.slug}
                aria-label={`Dự án ${p.title} – ${p.client}`}
                className="border border-taupe bg-bone-dark"
              >
                <div
                  className={`${p.blockBg} h-[200px] flex items-center justify-center`}
                >
                  <Icon className="w-20 h-20 text-bone" aria-hidden="true" />
                </div>
                <div className="p-6">
                  <h2 className="font-bold text-xl md:text-2xl text-espresso leading-tight">
                    {p.title}
                  </h2>
                  <p className="mt-2 text-sm text-taupe">{p.client}</p>
                  <p className="mt-1 text-sm text-espresso">{p.location}</p>
                  <p className="mt-3 text-xs uppercase tracking-widest text-espresso">
                    {p.year} · {p.scope}
                  </p>
                  <p className="mt-4 text-sm md:text-base text-espresso leading-relaxed">
                    {p.summary}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </main>
  )
}
