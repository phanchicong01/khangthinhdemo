'use client'

// Magnetic button effect (ANIM-07). Element drifts toward cursor on hover.
// Respects prefers-reduced-motion — static. Renders an <a> or <button>.
import { motion, useReducedMotion, useSpring } from 'motion/react'
import { useRef, type ReactNode, type MouseEvent } from 'react'

type MagneticButtonProps = {
  children: ReactNode
  href?: string
  onClick?: () => void
  className?: string
  /** Magnetic pull strength (0–1, default 0.3) */
  strength?: number
  ariaLabel?: string
}

export default function MagneticButton({
  children,
  href,
  onClick,
  className,
  strength = 0.3,
  ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const x = useSpring(0, { stiffness: 200, damping: 15 })
  const y = useSpring(0, { stiffness: 200, damping: 15 })

  function handleMove(e: MouseEvent) {
    if (reduce || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const relX = e.clientX - (rect.left + rect.width / 2)
    const relY = e.clientY - (rect.top + rect.height / 2)
    x.set(relX * strength)
    y.set(relY * strength)
  }

  function handleLeave() {
    x.set(0)
    y.set(0)
  }

  const commonProps = {
    ref: ref as never,
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
    style: reduce ? undefined : { x, y },
    className,
    'aria-label': ariaLabel,
  }

  if (href) {
    return (
      <motion.a href={href} {...commonProps}>
        {children}
      </motion.a>
    )
  }
  return (
    <motion.button type="button" onClick={onClick} {...commonProps}>
      {children}
    </motion.button>
  )
}
