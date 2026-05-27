// SEC-03 Services — 3 service cards.
// Server component. Lucide icons per D-11. No per-card link per D-14.
import { Truck, HardHat, Ship } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Service = {
  title: string
  desc: string
  Icon: LucideIcon
}

const SERVICES: readonly Service[] = [
  {
    title: 'Cung ứng VLXD',
    desc: 'Cát · Đá · San lấp. Cung ứng cho công trình trọng điểm và dân dụng.',
    Icon: Truck,
  },
  {
    title: 'Xây dựng dân dụng',
    desc: 'Thi công nhà phố, công trình dân dụng. Phối hợp đa lĩnh vực.',
    Icon: HardHat,
  },
  {
    title: 'Vận chuyển đường thủy',
    desc: 'Đội tàu vận chuyển VLXD và thiết bị, hoạt động vùng ĐBSCL.',
    Icon: Ship,
  },
] as const

export default function Services() {
  return (
    <section
      id="dich-vu"
      aria-label="Dịch vụ"
      className="bg-bone-dark py-20 md:py-24"
    >
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="font-black uppercase tracking-wide text-3xl md:text-4xl text-burgundy text-center md:text-left">
          Dịch vụ
        </h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {SERVICES.map(({ title, desc, Icon }) => (
            <article
              key={title}
              className="bg-bone-dark border border-taupe p-6 hover:shadow-md transition-shadow"
            >
              <Icon className="w-12 h-12 text-burgundy" aria-hidden="true" />
              <h3 className="mt-4 font-bold uppercase tracking-wide text-2xl text-espresso">
                {title}
              </h3>
              <p className="mt-3 text-espresso leading-relaxed">{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
