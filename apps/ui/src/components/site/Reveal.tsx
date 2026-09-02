"use client"

import { motion } from "motion/react"
import type { ReactNode } from "react"

type Arah = "up" | "left" | "right" | "scale"

const offset: Record<Arah, { x?: number; y?: number; scale?: number }> = {
  up: { y: 28 },
  left: { x: -32 },
  right: { x: 32 },
  scale: { scale: 0.96 },
}

export function Reveal({
  children,
  arah = "up",
  delay = 0,
  className,
}: {
  children: ReactNode
  arah?: Arah
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offset[arah] }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
