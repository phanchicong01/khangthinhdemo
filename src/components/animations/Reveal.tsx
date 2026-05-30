'use client'

// Scroll reveal primitive (ANIM-02). Fade + rise into view, once.
// Respects prefers-reduced-motion (ANIM-10 / NFR-A11Y-04) — renders static.
import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  /** Stagger delay in seconds */
  delay?: number
  /** Travel distance in px (default 24) */
  y?: number
  className?: string
  /** Render as a specific element wrapper; defaults to div */
  as?: 'div' | 'section' | 'article' | 'li' | 'span'
}

export default function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = 'div',
}: RevealProps) {
  const reduce = useReducedMotion()
  const MotionTag = motion[as]

  if (reduce) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  )
}
