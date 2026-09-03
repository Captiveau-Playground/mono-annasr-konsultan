"use client"

import { MessageCircle } from "lucide-react"

import { perusahaan } from "@/data/perusahaan"
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics/events"

/**
 * Ikon Instagram SVG inline (lucide tidak lagi menyediakan ikon brand).
 */
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

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
