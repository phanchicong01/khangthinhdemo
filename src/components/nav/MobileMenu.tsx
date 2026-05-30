'use client'

// Mobile hamburger menu with accordion sub-items (NAV-02).
// Slide-down panel; items with children expand inline.
// ESC + link-click close. Body scroll lock while open.
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown, Phone } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { company, telHref } from '@/lib/site'
import { navItems } from '@/lib/nav'

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(href + '/')
}

export default function MobileMenu({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  // Close on route change
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // ESC to close + body scroll lock
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        aria-label={open ? 'Đóng menu' : 'Mở menu'}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
        className="lg:hidden inline-flex items-center justify-center w-11 h-11 text-[var(--color-primary)]"
      >
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden absolute left-0 right-0 top-full border-t border-[var(--color-border)] bg-[var(--color-bg)] overflow-hidden"
          >
            <nav
              aria-label="Điều hướng (mobile)"
              className="max-w-7xl mx-auto px-4 py-3 flex flex-col"
            >
              {navItems.map((item) => {
                const active = isActive(pathname, item.href)
                if (!item.children) {
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`min-h-[48px] flex items-center text-base font-medium border-b border-[var(--color-border)]/50 ${
                        active ? 'text-[var(--color-primary)] font-semibold' : 'text-[var(--color-fg)]'
                      }`}
                    >
                      {item.label}
                    </Link>
                  )
                }
                const isExpanded = expanded === item.href
                return (
                  <div key={item.href} className="border-b border-[var(--color-border)]/50">
                    <div className="flex items-center justify-between">
                      <Link
                        href={item.href}
                        className={`min-h-[48px] flex items-center flex-1 text-base font-medium ${
                          active ? 'text-[var(--color-primary)] font-semibold' : 'text-[var(--color-fg)]'
                        }`}
                      >
                        {item.label}
                      </Link>
                      <button
                        type="button"
                        aria-label={isExpanded ? `Thu gọn ${item.label}` : `Mở rộng ${item.label}`}
                        aria-expanded={isExpanded}
                        onClick={() => setExpanded(isExpanded ? null : item.href)}
                        className="w-11 h-11 inline-flex items-center justify-center text-[var(--color-fg-muted)]"
                      >
                        <ChevronDown
                          className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>
                    </div>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="pb-2 pl-4">
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className={`min-h-[44px] flex items-center text-sm ${
                                  isActive(pathname, child.href)
                                    ? 'text-[var(--color-primary)] font-semibold'
                                    : 'text-[var(--color-fg-muted)]'
                                }`}
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}

              <a
                href={telHref()}
                className="min-h-[48px] flex items-center gap-2 text-base font-semibold text-[var(--color-primary)] border-b border-[var(--color-border)]/50"
              >
                <Phone className="w-5 h-5" aria-hidden="true" />
                <span>{company.phoneDisplay}</span>
              </a>
              <Link
                href="/lien-he"
                className="mt-3 inline-flex items-center justify-center min-h-[48px] bg-[var(--color-primary)] text-[var(--color-bone)] px-5 py-3 rounded-sm text-sm font-bold uppercase tracking-wide hover:bg-[var(--color-primary-hover)]"
              >
                Báo giá
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
