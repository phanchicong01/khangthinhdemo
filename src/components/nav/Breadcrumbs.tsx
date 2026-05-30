// Breadcrumbs (NAV-05) + BreadcrumbList schema (TRUST-06).
// Server component — pass items explicitly from each deep page.
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { siteUrl } from '@/lib/site'

export type Crumb = { href: string; label: string }

export default function Breadcrumbs({ items }: { items: readonly Crumb[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: `${siteUrl}${c.href}`,
    })),
  }

  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ol className="flex flex-wrap items-center gap-1 text-[var(--color-fg-muted)]">
        {items.map((c, i) => {
          const last = i === items.length - 1
          return (
            <li key={c.href} className="flex items-center gap-1">
              {last ? (
                <span className="text-[var(--color-fg)] font-medium" aria-current="page">
                  {c.label}
                </span>
              ) : (
                <>
                  <Link href={c.href} className="hover:text-[var(--color-primary)] transition-colors">
                    {c.label}
                  </Link>
                  <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
