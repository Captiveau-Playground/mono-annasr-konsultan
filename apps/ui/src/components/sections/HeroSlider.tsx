"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

import { cn } from "@/lib/styles"

/** Gambar slider bawaan bila CMS belum mengisi `beranda.hero.gambar`. */
export const GAMBAR_SLIDER = [
  {
    src: "/images/annasr/hero-konstruksi.jpg",
    alt: "Proyek konstruksi infrastruktur",
  },
  {
    src: "/images/annasr/layanan-perencanaan.jpg",
    alt: "Perencanaan teknis proyek",
  },
  { src: "/images/annasr/proyek-gedung.jpg", alt: "Pembangunan gedung" },
  { src: "/images/annasr/tim-engineer.jpg", alt: "Tim konsultan di lapangan" },
]

/**
 * Kotak gambar hero — auto slider (crossfade), tanpa interaksi tambahan.
 *
 * Dipisah ke Client Component sendiri supaya teks hero (H1) tetap dirender
 * server: kalau seluruh hero jadi client, hidrasi menunda paint H1 dan
 * menaikkan LCP beberapa detik.
 */
export function HeroSlider({ gambar }: { gambar: string[] }) {
  const daftar =
    gambar.length > 0
      ? gambar.map((src, i) => ({
          src,
          alt: `Gambar hero ${i + 1} CV. AN NASR KONSULTAN`,
        }))
      : GAMBAR_SLIDER
  const [indeks, setIndeks] = useState(0)
  const [kurangiGerak] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )

  useEffect(() => {
    if (kurangiGerak) return
    const t = setInterval(() => setIndeks((x) => (x + 1) % daftar.length), 4200)

    return () => clearInterval(t)
  }, [kurangiGerak, daftar.length])

  return (
    <div className="relative hidden shrink-0 lg:block" aria-hidden="true">
      <div className="relative aspect-[4/5] w-[400px] overflow-hidden rounded-3xl border border-white/15 shadow-[var(--shadow-lift)]">
        {daftar.map((g, i) => (
          <Image
            key={g.src}
            src={g.src}
            alt={g.alt}
            fill
            priority={i === 0}
            sizes="400px"
            className={cn(
              "object-cover transition-opacity duration-1000",
              kurangiGerak
                ? i === 0
                  ? "opacity-100"
                  : "opacity-0"
                : i === indeks
                  ? "opacity-100"
                  : "opacity-0"
            )}
          />
        ))}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
      <div className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {daftar.map((g, i) => (
          <span
            key={g.src}
            className={cn(
              "size-1.5 rounded-full transition-colors duration-300",
              i === indeks ? "bg-accent" : "bg-white/40"
            )}
          />
        ))}
      </div>
    </div>
  )
}
