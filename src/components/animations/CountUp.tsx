'use client'

// Count-up number animation (ANIM-03). Animates 0 → target when in view.
// Handles non-numeric prefixes/suffixes (e.g. "3,900" or "2025").
// Respects prefers-reduced-motion — shows final value immediately.
import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion, animate } from 'motion/react'

type CountUpProps = {
  /** The display string, e.g. "3,900" or "2025" */
  value: string
  className?: string
  durationMs?: number
}

export default function CountUp({ value, className, durationMs = 1600 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduce = useReducedMotion()
  const [display, setDisplay] = useState(reduce ? value : '0')

  // Parse numeric portion + thousands separator format.
  const numeric = Number(value.replace(/[^\d]/g, ''))
  const hasComma = value.includes(',')

  useEffect(() => {
    if (reduce || !inView || Number.isNaN(numeric) || numeric === 0) {
      setDisplay(value)
      return
    }
    const controls = animate(0, numeric, {
      duration: durationMs / 1000,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        const rounded = Math.round(latest)
        setDisplay(hasComma ? rounded.toLocaleString('en-US') : String(rounded))
      },
    })
    return () => controls.stop()
  }, [inView, numeric, value, hasComma, reduce, durationMs])

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  )
}
