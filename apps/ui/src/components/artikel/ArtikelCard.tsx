"use client"

import { CalendarDays } from "lucide-react"
import Image from "next/image"

import type { Artikel } from "@/data/perusahaan"
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics/events"
import { Link } from "@/lib/navigation"

export function ArtikelCard({
  item,
  tone = "terang",
  prioritas = false,
}: {
  item: Artikel
  /** true untuk kartu pertama yang terlihat tanpa scroll (LCP). */
  prioritas?: boolean
  /** "primary" = kartu navy (dipakai di beranda), "terang" = kartu putih. */
  tone?: "terang" | "primary"
}) {
  const primary = tone === "primary"

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-xl border transition-shadow hover:shadow-[var(--shadow-soft)] ${
        primary ? "bg-navy border-white/10 text-white" : "border-border bg-card"
      }`}
    >
      <Link href={`/artikel/${item.slug}`} className="block overflow-hidden">
        <Image
          src={item.gambar}
          alt={item.judul}
          width={1200}
          height={800}
          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          priority={prioritas}
          className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <span className="text-accent-teks text-xs font-semibold tracking-[0.18em] uppercase">
          {item.kategori}
        </span>
        <Link
          href={`/artikel/${item.slug}`}
          onClick={() =>
            trackEvent(ANALYTICS_EVENTS.ctaClicked, {
              cta: "artikel_card",
              slug: item.slug,
            })
          }
          className={`mt-3 text-lg leading-snug transition-colors ${
            primary
              ? "hover:text-accent text-white"
              : "hover:text-primary text-foreground"
          }`}
        >
          {item.judul}
        </Link>
        <p
          className={`mt-3 text-sm leading-relaxed ${
            primary ? "text-white/75" : "text-muted-foreground"
          }`}
        >
          {item.ringkas}
        </p>
        <p
          className={`mt-auto flex items-center gap-2 pt-6 text-xs ${
            primary ? "text-white/70" : "text-muted-foreground"
          }`}
        >
          <CalendarDays
            className={`size-3.5 ${primary ? "text-accent" : "text-primary"}`}
          />
          {item.tanggal}
        </p>
      </div>
    </article>
  )
}
