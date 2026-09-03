"use client"

import { useEffect } from "react"

import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics/events"

/**
 * Mencatat pembacaan artikel (article_read) saat halaman detail dibuka.
 */
export function TrackArticleRead({ slug }: { slug: string }) {
  useEffect(() => {
    trackEvent(ANALYTICS_EVENTS.articleRead, { slug })
  }, [slug])

  return null
}
