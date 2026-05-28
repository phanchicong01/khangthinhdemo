// SEC-04 Projects — 4 representative projects + "Xem tất cả" link.
// Server component. Data source: @/lib/projects (Phase 4 D-10).
// Visual unchanged from Phase 3 — only the data import path changed.
// `summary` field is NOT rendered here (kept compact per D-11) — used on /du-an only.
import { ArrowRight } from 'lucide-react'
import { projects } from '@/lib/projects'

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
          {projects.map((p) => {
            const Icon = p.icon
            return (
              <article key={p.slug} className="border border-taupe bg-bone-dark">
                <div className={`${p.blockBg} h-[200px] flex items-center justify-center`}>
                  <Icon className="w-20 h-20 text-bone" aria-hidden="true" />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl md:text-2xl text-espresso leading-tight">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-taupe">{p.client}</p>
                  <p className="mt-4 text-xs uppercase tracking-widest text-espresso">
                    {p.year} · {p.scope}
                  </p>
                </div>
              </article>
            )
          })}
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
