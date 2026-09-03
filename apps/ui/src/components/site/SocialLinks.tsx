"use client"

import { MessageCircle } from "lucide-react"

import { InstagramIcon } from "@/components/ui/icons"
import { perusahaan } from "@/data/perusahaan"
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics/events"

/**
 * Ikon media sosial footer — Instagram diambil dari CMS (kontak.instagram),
 * WhatsApp dari data kontak statis. Posisi "location" dilacak utk analytics.
 */
export function SocialLinks({
  instagram,
  whatsapp,
}: {
  instagram?: string
  whatsapp?: string
}) {
  const handle = instagram?.replace(/^@/, "").trim() || ""
  const nomorWa = whatsapp?.trim() || perusahaan.whatsapp

  return (
    <div className="mt-6 flex items-center gap-3">
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
          className="border-primary-foreground/20 text-primary-foreground/80 hover:text-accent hover:border-accent flex size-9 items-center justify-center rounded-full border transition-colors"
        >
          <InstagramIcon />
        </a>
      ) : null}
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
        className="border-primary-foreground/20 text-primary-foreground/80 hover:text-accent hover:border-accent flex size-9 items-center justify-center rounded-full border transition-colors"
      >
        <MessageCircle className="size-4" />
      </a>
    </div>
  )
}
