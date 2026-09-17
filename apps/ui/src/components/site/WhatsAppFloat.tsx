"use client"

import { MessageCircle } from "lucide-react"
import { motion } from "motion/react"

import { perusahaan } from "@/data/perusahaan"
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics/events"

export function WhatsAppFloat({ whatsapp }: { whatsapp?: string }) {
  const nomor = whatsapp?.trim() || perusahaan.whatsapp

  return (
    <motion.a
      href={`https://wa.me/${nomor}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Hubungi kami via WhatsApp"
      onClick={() =>
        trackEvent(ANALYTICS_EVENTS.contactChannel, {
          channel: "whatsapp",
          location: "float",
        })
      }
      className="bg-primary text-primary-foreground fixed right-5 bottom-6 z-50 flex size-14 items-center justify-center rounded-full shadow-[var(--shadow-lift)]"
    >
      <MessageCircle className="size-6" />
    </motion.a>
  )
}
