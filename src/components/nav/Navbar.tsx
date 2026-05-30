'use client'

// Multi-level navigation (NAV-01..04, NAV-07).
// - Desktop: hover/focus dropdown for items with children
// - Mobile: hamburger → accordion (MobileMenu)
// - Active route highlight (parent + child)
// - Sticky header with scroll-compress (NAV-03)
// - Dark mode toggle (NAV-07)
// All company data from @/lib/site, nav structure from @/lib/nav.
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Phone, ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { company, telHref } from '@/lib/site'
import { navItems } from '@/lib/nav'
import ThemeToggle from '@/components/theme/ThemeToggle'
import MobileMenu from '@/components/nav/MobileMenu'

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(href + '/')
}

export default function Navbar() {
  const pathname = usePathname()
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)

  // Sticky compress on scroll (NAV-03)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 bg-[var(--color-bg)]/95 backdrop-blur border-b border-[var(--color-border)] transition-[height,box-shadow] ${
        scrolled ? 'shadow-sm' : ''
      }`}
    >
      <div
        className={`max-w-7xl mx-auto px-4 flex items-center justify-between gap-4 transition-[height] duration-300 ${
          scrolled ? 'h-14' : 'h-16'
        }`}
      >
        {/* Wordmark */}
        <Link
          href="/"
          aria-label={`${company.shortName} — Trang chủ`}
          className="inline-flex items-center min-h-[44px] font-black uppercase tracking-wide text-[var(--color-primary)] text-lg md:text-xl whitespace-nowrap"
        >
          {company.shortName}
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Điều hướng chính" className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href)
            if (!item.children) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center justify-center min-h-[44px] px-3 text-sm font-medium transition-colors ${
                    active
                      ? 'text-[var(--color-primary)] font-semibold'
                      : 'text-[var(--color-fg)] hover:text-[var(--color-primary)]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            }
            return (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.href)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={`inline-flex items-center gap-1 min-h-[44px] px-3 text-sm font-medium transition-colors ${
                    active
                      ? 'text-[var(--color-primary)] font-semibold'
                      : 'text-[var(--color-fg)] hover:text-[var(--color-primary)]'
                  }`}
                  aria-expanded={openDropdown === item.href}
                  aria-haspopup="true"
                >
                  {item.label}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openDropdown === item.href ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </Link>
                <AnimatePresence>
                  {openDropdown === item.href && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-0 top-full pt-2 w-72"
                    >
                      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md shadow-lg overflow-hidden">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`block px-4 py-3 hover:bg-[var(--color-bg-alt)] transition-colors ${
                              isActive(pathname, child.href)
                                ? 'bg-[var(--color-bg-alt)]'
                                : ''
                            }`}
                          >
                            <span className="block text-sm font-semibold text-[var(--color-fg)]">
                              {child.label}
                            </span>
                            {child.description && (
                              <span className="block mt-0.5 text-xs text-[var(--color-fg-muted)]">
                                {child.description}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </nav>

        {/* Right cluster: hotline + CTA + theme + mobile trigger */}
        <div className="flex items-center gap-2">
          <a
            href={telHref()}
            className="hidden xl:inline-flex items-center gap-2 min-h-[44px] px-3 text-sm font-semibold text-[var(--color-primary)] hover:opacity-80"
          >
            <Phone className="w-4 h-4" aria-hidden="true" />
            <span>{company.phoneDisplay}</span>
          </a>
          <Link
            href="/lien-he"
            className="hidden lg:inline-flex items-center min-h-[44px] bg-[var(--color-primary)] text-[var(--color-bone)] px-5 py-2.5 rounded-sm text-sm font-bold uppercase tracking-wide hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            Báo giá
          </Link>
          <ThemeToggle />
          <MobileMenu pathname={pathname} />
        </div>
      </div>
    </header>
  )
}
