// SEC-06 Capabilities — 3 capability groups with B2B bullet copy.
// Server component. No anchor id of its own — shares #nang-luc with BigStats
// (the wrapping <section id="nang-luc"> lives in page.tsx).
// Icon for "Cơ giới" chosen as `Truck` from D-23 candidates (Truck vs Wrench) —
// matches the Services VLXD icon and reinforces fleet-mobility visual cue.
import { Ship, Truck, HardHat, Check } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Capability = {
  title: string
  bullets: readonly string[]
  Icon: LucideIcon
}

const CAPABILITIES: readonly Capability[] = [
  {
    title: 'Đội tàu',
    bullets: [
      'Tải trọng tối đa 3,900 tấn',
      'Hoạt động vùng Đồng bằng Sông Cửu Long',
      'Đăng kiểm + giấy phép đầy đủ',
      'Vận chuyển VLXD + thiết bị công trình',
    ],
    Icon: Ship,
  },
  {
    title: 'Cơ giới',
    bullets: [
      'Đội xe vận tải + máy san lấp',
      'Trang thiết bị thi công công trình',
      'Bảo dưỡng định kỳ',
      'Sẵn sàng huy động 24/7',
    ],
    Icon: Truck,
  },
  {
    title: 'Đội xây lắp',
    bullets: [
      'Đội ngũ có kinh nghiệm dự án quốc gia',
      'Thi công nhà phố + công trình dân dụng',
      'Phối hợp đa lĩnh vực: cung ứng + thi công + vận chuyển',
      'Tuân thủ tiêu chuẩn an toàn xây dựng',
    ],
    Icon: HardHat,
  },
] as const

export default function Capabilities() {
  return (
    <section
      aria-label="Năng lực"
      className="bg-bone py-20 md:py-24"
    >
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="font-black uppercase tracking-wide text-3xl md:text-4xl text-burgundy text-center md:text-left">
          Năng lực
        </h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {CAPABILITIES.map(({ title, bullets, Icon }) => (
            <article key={title}>
              <Icon className="w-12 h-12 text-burgundy" aria-hidden="true" />
              <h3 className="mt-4 font-bold uppercase tracking-wide text-2xl text-espresso">
                {title}
              </h3>
              <ul className="mt-4 space-y-3">
                {bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-espresso leading-relaxed">
                    <Check className="w-5 h-5 text-burgundy flex-shrink-0 mt-1" aria-hidden="true" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
