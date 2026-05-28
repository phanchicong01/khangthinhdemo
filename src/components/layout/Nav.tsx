'use client'

// Per D-02: Mobile menu uses useState (NOT CSS-only) so we can:
//   - close on ESC key
//   - close on link click
//   - manage aria-expanded for screen readers
// Per D-08: Active section highlight NOT implemented in Phase 2 — hover only.
// Per D-22: All company data MUST import from @/lib/site.
import { useEffect, useState } from 'react'
import { Menu, X, Phone } from 'lucide-react'
import { company, telHref } from '@/lib/site'

const navAnchors = [
  { href: '#dich-vu',  label: 'Dịch vụ' },
  { href: '#du-an',    label: 'Dự án' },
  { href: '#nang-luc', label: 'Năng lực' },
  { href: '#doi-tac',  label: 'Đối tác' },
  { href: '#lien-he',  label: 'Liên hệ' },
] as const

export default function Nav() {
  const [open, setOpen] = useState(false)

  // ESC to close (a11y)
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const closeMenu = () => setOpen(false)

  return (
    <header className="sticky top-0 z-40 bg-bone/95 backdrop-blur border-b border-bone-dark">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Wordmark — per D-01 (text-only, font-black uppercase burgundy) */}
        {/* min-h-[44px] ensures WCAG 2.5.5 tap target on mobile (Plan 06-01 Task 5 fix) */}
        <a
          href="#"
          aria-label={`${company.shortName} — Trang chủ`}
          className="inline-flex items-center min-h-[44px] font-black uppercase tracking-wide text-burgundy text-lg md:text-xl whitespace-nowrap"
        >
          {company.shortName}
        </a>

        {/* Desktop nav — anchors + hotline + CTA. Hidden under 768px. */}
        <nav aria-label="Điều hướng chính" className="hidden md:flex items-center gap-1">
          {navAnchors.map((a) => (
            <a
              key={a.href}
              href={a.href}
              className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] px-3 text-sm font-medium text-espresso hover:text-burgundy"
            >
              {a.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {/* Hotline — per D-03 desktop visible */}
          <a
            href={telHref()}
            className="inline-flex items-center gap-2 min-h-[44px] px-3 text-sm font-semibold text-burgundy hover:text-burgundy-dark"
          >
            <Phone className="w-4 h-4" aria-hidden="true" />
            <span>{company.phoneDisplay}</span>
          </a>
          {/* "Báo giá" CTA — per D-04 solid burgundy, per D-07 target #lien-he */}
          <a
            href="#lien-he"
            className="inline-flex items-center min-h-[44px] bg-burgundy text-bone px-5 py-3 rounded-sm text-sm font-bold uppercase tracking-wide hover:bg-burgundy-dark"
          >
            Báo giá
          </a>
        </div>

        {/* Hamburger — mobile only (<768px). Per D-21 tap target ≥44×44px. */}
        <button
          type="button"
          aria-label={open ? 'Đóng menu' : 'Mở menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center w-11 h-11 text-burgundy"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu — slide-down accordion per D-02. */}
      {/* Contains 5 anchors + hotline + CTA per D-03 (mobile hotline only in menu). */}
      {open && (
        <div id="mobile-menu" className="md:hidden border-t border-bone-dark bg-bone">
          <nav
            aria-label="Điều hướng (mobile)"
            className="max-w-6xl mx-auto px-4 py-3 flex flex-col"
          >
            {navAnchors.map((a) => (
              <a
                key={a.href}
                href={a.href}
                onClick={closeMenu}
                className="min-h-[44px] flex items-center text-base font-medium text-espresso hover:text-burgundy border-b border-bone-dark/50"
              >
                {a.label}
              </a>
            ))}
            <a
              href={telHref()}
              onClick={closeMenu}
              className="min-h-[44px] flex items-center gap-2 text-base font-semibold text-burgundy border-b border-bone-dark/50"
            >
              <Phone className="w-5 h-5" aria-hidden="true" />
              <span>{company.phoneDisplay}</span>
            </a>
            <a
              href="#lien-he"
              onClick={closeMenu}
              className="mt-3 inline-flex items-center justify-center min-h-[44px] bg-burgundy text-bone px-5 py-3 rounded-sm text-sm font-bold uppercase tracking-wide hover:bg-burgundy-dark"
            >
              Báo giá
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
