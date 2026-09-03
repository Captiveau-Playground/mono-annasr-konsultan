"use client"

import type { ReactNode } from "react"

import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics/events"
import { Link } from "@/lib/navigation"

/**
 * Link yang mencatat event `cta_clicked` — dipakai dari Server Component
 * (server boleh mengirim prop serializable: cta + params string).
 */
export function CtaLink({
  cta,
  params,
  href,
  className,
  children,
}: {
  cta: string
  params?: Record<string, string>
  href: string
  className?: string
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() =>
        trackEvent(ANALYTICS_EVENTS.ctaClicked, { cta, ...params })
      }
    >
      {children}
    </Link>
  )
}
