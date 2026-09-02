"use client"

import { MessageCircle } from "lucide-react"
import { motion } from "motion/react"

import { perusahaan } from "@/data/perusahaan"

export function WhatsAppFloat() {
  return (
    <motion.a
      href={`https://wa.me/${perusahaan.whatsapp}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Hubungi kami via WhatsApp"
      className="bg-primary text-primary-foreground fixed right-5 bottom-6 z-50 flex size-14 items-center justify-center rounded-full shadow-[var(--shadow-lift)]"
    >
      <MessageCircle className="size-6" />
    </motion.a>
  )
}
