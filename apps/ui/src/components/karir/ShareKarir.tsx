"use client"

import { Check, Link2, MessageCircle } from "lucide-react"
import { useState } from "react"

import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics/events"
import { cn } from "@/lib/styles"

/** Ikon brand minimal (lucide tidak menyediakan ikon brand). */
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.037 4.388 11.04 10.125 11.927v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796v8.437C19.612 23.113 24 18.11 24 12.073z" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231z" />
    </svg>
  )
}

/**
 * Berbagi lowongan ke WhatsApp, Facebook, X, dan salin tautan.
 * URL dibangun server-side (prop absolute) agar aman.
 */
export function ShareKarir({ url, judul }: { url: string; judul: string }) {
  const [tersalin, setTersalin] = useState(false)

  const teks = `${judul} — CV. AN NASR KONSULTAN`
  const encode = encodeURIComponent

  const tautan = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encode(`${teks}\n${url}`)}`,
      ikon: <MessageCircle className="size-4" />,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encode(url)}`,
      ikon: <FacebookIcon className="size-4" />,
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encode(teks)}&url=${encode(url)}`,
      ikon: <XIcon className="size-4" />,
    },
  ]

  const salin = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setTersalin(true)
      setTimeout(() => setTersalin(false), 2000)
    } catch {
      // abaikan bila clipboard tidak tersedia
    }
    trackEvent(ANALYTICS_EVENTS.ctaClicked, {
      cta: "karir_share",
      jaringan: "copy",
    })
  }

  const btnBase =
    "text-muted-foreground hover:text-primary flex h-9 items-center gap-2 rounded-full border border-border bg-background px-3.5 text-xs font-medium transition-colors"

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {tautan.map((t) => (
        <a
          key={t.label}
          href={t.href}
          target="_blank"
          rel="noreferrer"
          aria-label={`Bagikan ke ${t.label}`}
          onClick={() =>
            trackEvent(ANALYTICS_EVENTS.ctaClicked, {
              cta: "karir_share",
              jaringan: t.label.toLowerCase(),
            })
          }
          className={btnBase}
        >
          {t.ikon}
          {t.label}
        </a>
      ))}
      <button
        type="button"
        onClick={salin}
        className={cn(btnBase)}
        aria-label="Salin tautan"
      >
        {tersalin ? (
          <Check className="text-accent size-4" />
        ) : (
          <Link2 className="size-4" />
        )}
        {tersalin ? "Tersalin" : "Salin tautan"}
      </button>
    </div>
  )
}
