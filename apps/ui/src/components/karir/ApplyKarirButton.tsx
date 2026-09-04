"use client"

import { ArrowUpRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics/events"

/**
 * CTA "Lamar Sekarang" — kirim lamaran via email (mailto:).
 * Komponen client agar onClick legal di dalam Button asChild.
 */
export function ApplyKarirButton({
  email,
  posisi,
}: {
  email: string
  posisi: string
}) {
  const href = `mailto:${email}?subject=${encodeURIComponent(
    `Lamaran: ${posisi}`
  )}&body=${encodeURIComponent(
    `Halo CV. AN NASR KONSULTAN,\n\nSaya tertarik melamar posisi ${posisi}.\nBerikut saya lampirkan CV dan dokumen pendukung.\n\nTerima kasih.`
  )}`

  return (
    <Button asChild size="lg" className="w-full rounded-full">
      <a
        href={href}
        onClick={() =>
          trackEvent(ANALYTICS_EVENTS.ctaClicked, {
            cta: "karir_apply",
            channel: "email",
            posisi,
          })
        }
      >
        Lamar Sekarang
        <ArrowUpRight className="size-4" />
      </a>
    </Button>
  )
}
