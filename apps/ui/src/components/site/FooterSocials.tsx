"use client"

import { MessageCircle } from "lucide-react"

import { InstagramIcon } from "@/components/ui/icons"
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics/events"

/**
 * Tombol sosial footer (mirip baris sosial pada footer modern):
 * Instagram dari CMS + WhatsApp dari data kontak.
 */
export function FooterSocials({
  instagram,
  whatsapp,
}: {
  instagram?: string
  whatsapp?: string
}) {
  const handle = instagram?.replace(/^@/, "").trim() || ""
  const nomorWa = whatsapp?.trim() || ""

  if (!handle && !nomorWa) return null

  return (
    <div className="mt-6 flex items-center gap-2">
      {handle ? (
        <a
          href={`https://instagram.com/${handle}`}
          target="_blank"
          rel="noreferrer"
          aria-label={`Instagram ${handle}`}
          onClick={() =>
            trackEvent(ANALYTICS_EVENTS.contactChannel, {
              channel: "instagram",
              location: "footer",
            })
          }
          className="border-primary-foreground/20 text-primary-foreground/80 hover:text-accent hover:border-accent flex size-9 items-center justify-center rounded-lg border transition-colors"
        >
          <InstagramIcon className="size-4" />
        </a>
      ) : null}
      {nomorWa ? (
        <a
          href={`https://wa.me/${nomorWa}`}
          target="_blank"
          rel="noreferrer"
          aria-label="WhatsApp"
          onClick={() =>
            trackEvent(ANALYTICS_EVENTS.contactChannel, {
              channel: "whatsapp",
              location: "footer",
            })
          }
          className="border-primary-foreground/20 text-primary-foreground/80 hover:text-accent hover:border-accent flex size-9 items-center justify-center rounded-lg border transition-colors"
        >
          <MessageCircle className="size-4" />
        </a>
      ) : null}
    </div>
  )
}
