// SEC-04 Projects — 4 representative projects + "Xem tất cả" link.
// Server component. Data hardcoded here in Phase 3 — Phase 4 extracts to lib/projects.ts.
// D-16 — names, clients, years, roles fixed. Years 2024/2025 best-guess;
//         executor MUST flag year uncertainty in the SUMMARY.
// Color block (200px tall) alternates burgundy/espresso per D-17.
// Client text is front-and-center per D-18 + FEATURES.md.
import { ArrowRight, Construction, GitBranch, Anchor, Home } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Project = {
  name: string
  client: string
  year: string
  role: string
  Icon: LucideIcon
  blockBg: 'bg-burgundy' | 'bg-espresso'
}

const PROJECTS: readonly Project[] = [
  {
    name: 'Cao tốc Cái Nước — Đất Mũi Cà Mau',
    client: 'Bộ Quốc phòng — Binh đoàn 12 — Trường Sơn',
    year: '2024',
    role: 'Cung ứng VLXD + vận chuyển',
    Icon: Construction,
    blockBg: 'bg-burgundy',
  },
  {
    name: 'Cầu Cửa Lớn — Đất Mũi Cà Mau',
    client: 'Bộ Quốc phòng — Binh đoàn 12 — Trường Sơn',
    year: '2024',
    role: 'Cung ứng VLXD + vận chuyển',
    Icon: GitBranch,
    blockBg: 'bg-espresso',
  },
  {
    name: 'Đường giao thông ra đảo Hòn Khoai',
    client: 'Bộ Quốc phòng — Binh đoàn 12 — Trường Sơn',
    year: '2024',
    role: 'Cung ứng VLXD + vận chuyển',
    Icon: Anchor,
    blockBg: 'bg-espresso',
  },
  {
    name: 'Nhà phố tiêu biểu',
    client: 'Cô Thúy (Thạnh Hóa) · Anh Bình (Mỹ Yên) · Chị Ngọc (Long An)',
    year: '2025',
    role: 'Thi công xây dựng',
    Icon: Home,
    blockBg: 'bg-burgundy',
  },
] as const

export default function Projects() {
  return (
    <section
      id="du-an"
      aria-label="Dự án tiêu biểu"
      className="bg-bone py-20 md:py-24"
    >
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="font-black uppercase tracking-wide text-3xl md:text-4xl text-burgundy text-center md:text-left">
          Dự án tiêu biểu
        </h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {PROJECTS.map((p) => (
            <article key={p.name} className="border border-taupe bg-bone-dark">
              <div className={`${p.blockBg} h-[200px] flex items-center justify-center`}>
                <p.Icon className="w-20 h-20 text-bone" aria-hidden="true" />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl md:text-2xl text-espresso leading-tight">
                  {p.name}
                </h3>
                <p className="mt-2 text-sm text-taupe">{p.client}</p>
                <p className="mt-4 text-xs uppercase tracking-widest text-espresso">
                  {p.year} · {p.role}
                </p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <a
            href="/du-an"
            className="inline-flex items-center gap-2 min-h-[44px] border-2 border-burgundy text-burgundy px-6 py-3 rounded-sm text-sm font-bold uppercase tracking-wide hover:bg-burgundy hover:text-bone transition-colors"
          >
            <span>Xem tất cả dự án</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
