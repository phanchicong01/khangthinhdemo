'use client'

// next-themes wrapper. attribute="class" → toggles `.dark` on <html>,
// which our globals.css @custom-variant + .dark token swap consume.
// enableSystem → respects OS preference by default (DARK-01).
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ComponentProps } from 'react'

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
