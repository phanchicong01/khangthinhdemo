'use client'

// SEC-01 Hero v2.0 — premium first-viewport with real project photo backdrop,
// logo, visible tagline, animated entrance, dual CTA. Reduced-motion aware.
import Image from 'next/image'
import { Phone, ArrowRight } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { company, telHref } from '@/lib/site'

export default function Hero() {
  const reduce = useReducedMotion()
  const ease = [0.16, 1, 0.3, 1] as const

  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease },
        }

  return (
    <section
      aria-label="Giới thiệu Khang Thịnh Investment"
      className="relative overflow-hidden bg-espresso text-bone"
    >
      {/* Background real photo (cao tốc — Bộ Quốc phòng) with burgundy overlay */}
      <div className="absolute inset-0">
        <Image
          src="/projects/cao-toc-cai-nuoc.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-espresso/95 via-burgundy/80 to-espresso/90" />
        {/* blueprint grid texture */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #F5F1EA 1px, transparent 1px), linear-gradient(to bottom, #F5F1EA 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32 lg:py-40">
        <motion.div {...fade(0)} className="max-w-3xl">
          <span className="inline-block text-terracotta font-semibold uppercase tracking-[0.2em] text-sm">
            {company.tagline}
          </span>
        </motion.div>

        <motion.h1
          {...fade(0.1)}
          className="mt-4 font-black uppercase tracking-tight text-bone text-4xl sm:text-5xl lg:text-7xl leading-[1.05] max-w-4xl"
        >
          Công trình bền vững
          <br />
          <span className="text-terracotta">Đối tác tin cậy</span>
        </motion.h1>

        <motion.p
          {...fade(0.2)}
          className="mt-6 text-base md:text-xl text-bone/85 max-w-2xl leading-relaxed"
        >
          Cung ứng Cát · Đá · San lấp — Xây dựng dân dụng — Vận chuyển đường thủy.
          Đối tác cung ứng & vận chuyển cho các dự án Bộ Quốc phòng — Binh đoàn 12 — Tổng Công ty Trường Sơn.
        </motion.p>

        <motion.div
          {...fade(0.3)}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <a
            href={telHref()}
            className="inline-flex items-center justify-center gap-2 min-h-[52px] bg-terracotta text-espresso px-7 py-3.5 rounded-sm text-base font-bold uppercase tracking-wide hover:bg-bone transition-colors"
          >
            <Phone className="w-5 h-5" aria-hidden="true" />
            Gọi {company.phoneDisplay}
          </a>
          <a
            href="/lien-he"
            className="inline-flex items-center justify-center gap-2 min-h-[52px] border-2 border-bone/40 text-bone px-7 py-3.5 rounded-sm text-base font-bold uppercase tracking-wide hover:bg-bone hover:text-espresso transition-colors"
          >
            Yêu cầu báo giá
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
