'use client'

// Parallax wrapper (ANIM-04). Element moves slower than scroll for depth.
// Respects prefers-reduced-motion — renders static.
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'
import { useRef, type ReactNode } from 'react'

type ParallaxProps = {
  children: ReactNode
  /** Max travel in px across the scroll range (default 60) */
  offset?: number
  className?: string
}

export default function Parallax({ children, offset = 60, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset])

  if (reduce) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    )
  }

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  )
}
