"use client"

import { ArrowRight, Check } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics/events"
import type { BerandaKonten } from "@/lib/annasr/beranda"
import { Link } from "@/lib/navigation"
import { cn } from "@/lib/styles"

const HERO_DEFAULT = {
  judul: "Tepat Merencanakan, Tepat Mengawasi, Tepat Membangun",
  deskripsi:
    "Menyediakan layanan perencanaan, pengawasan, perizinan, dan konstruksi dengan mengutamakan kualitas, profesionalisme, serta ketepatan dalam setiap tahap pelaksanaan proyek.",
  keunggulan: [],
}

const LINI_DEFAULT = [
  "Jasa Perencanaan",
  "Jasa Pengawasan",
  "Jasa Perizinan",
  "Jasa Konstruksi",
]

/**
 * Hero homepage — latar navy gradient (konsisten dengan hero halaman
 * proyek), teks terang, rata kiri & lapang.
 */

const GAMBAR_SLIDER = [
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

/** Kotak gambar hero — auto slider (crossfade), tanpa interaksi tambahan. */
function SliderGambar() {
  const [indeks, setIndeks] = useState(0)
  const [kurangiGerak] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )

  useEffect(() => {
    if (kurangiGerak) return
    const t = setInterval(
      () => setIndeks((x) => (x + 1) % GAMBAR_SLIDER.length),
      4200
    )

    return () => clearInterval(t)
  }, [kurangiGerak])

  return (
    <div className="relative hidden shrink-0 lg:block" aria-hidden="true">
      <div className="relative aspect-[4/5] w-[400px] overflow-hidden rounded-3xl border border-white/15 shadow-[var(--shadow-lift)]">
        {GAMBAR_SLIDER.map((g, i) => (
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
        {GAMBAR_SLIDER.map((g, i) => (
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

export function Hero({
  hero,
  brand,
  tagline,
  layanan = [],
}: {
  hero?: BerandaKonten["hero"]
  /** Dari situs.brandNama (CMS) */
  brand?: string
  /** Dari situs.brandTagline (CMS) */
  tagline?: string
  /** Nama layanan utk strip lini (dari CMS layanan) */
  layanan?: string[]
}) {
  const kontenHero = hero ?? HERO_DEFAULT
  const namaBrand = brand?.trim() || "CV. An Nasr Konsultan"
  const taglineBrand = tagline?.trim() || "Konsultan Teknik & Konstruksi"
  const lini = layanan.length > 0 ? layanan : LINI_DEFAULT

  return (
    <section className="cta-gradient relative isolate overflow-hidden">
      <div
        className="blueprint-grid pointer-events-none absolute inset-0 opacity-[0.18]"
        aria-hidden
      />
      <div
        className="bg-accent/10 pointer-events-none absolute -top-24 -right-24 size-96 rounded-full blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 pt-24 pb-16 sm:pt-28 sm:pb-20 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:pt-32 lg:pb-24">
        <div className="hero-anim-fade-up max-w-3xl">
          <span className="border-primary-foreground/20 text-primary-foreground/90 inline-flex items-center gap-2 rounded-full border bg-white/10 px-4 py-1.5 text-[11px] font-semibold tracking-[0.18em] uppercase backdrop-blur-sm">
            <span className="bg-accent size-1.5 rounded-full" />
            {namaBrand}
            <span className="text-primary-foreground/50" aria-hidden>
              •
            </span>
            {taglineBrand}
          </span>

          <h1 className="text-primary-foreground mt-7 text-[2.6rem] leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
            {kontenHero.judul}
          </h1>

          {kontenHero.deskripsi ? (
            <p className="text-primary-foreground/80 mt-6 max-w-xl text-base leading-relaxed text-pretty sm:text-lg">
              {kontenHero.deskripsi}
            </p>
          ) : null}

          <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row">
            <Button asChild size="xl" className="rounded-full">
              <Link
                href="/kontak"
                onClick={() =>
                  trackEvent(ANALYTICS_EVENTS.ctaClicked, {
                    cta: "hero_konsultasi",
                  })
                }
              >
                Konsultasi Sekarang
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="xl"
              className="border-primary-foreground/30 text-primary-foreground rounded-full bg-transparent hover:bg-white/10"
            >
              <Link
                href="#layanan"
                onClick={() =>
                  trackEvent(ANALYTICS_EVENTS.ctaClicked, {
                    cta: "hero_layanan",
                  })
                }
              >
                Lihat Layanan
              </Link>
            </Button>
          </div>

          {kontenHero.keunggulan.length > 0 ? (
            <p className="text-primary-foreground/80 mt-7 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] font-medium">
              {kontenHero.keunggulan.map((item, i) => (
                <span key={item} className="flex items-center gap-2">
                  {i > 0 ? (
                    <span
                      className="bg-primary-foreground/30 size-1 rounded-full"
                      aria-hidden
                    />
                  ) : (
                    <Check
                      className="text-accent size-3.5"
                      strokeWidth={3}
                      aria-hidden
                    />
                  )}
                  {item}
                </span>
              ))}
            </p>
          ) : null}

          {/* Strip lini layanan — penutup tenang. */}
          <div className="border-primary-foreground/15 mt-14 border-t pt-5">
            <ul className="flex flex-wrap items-center gap-x-7 gap-y-2.5">
              {lini.map((nama, i) => (
                <li
                  key={nama}
                  className="text-primary-foreground/65 flex items-center gap-2.5 text-xs font-semibold tracking-[0.14em] uppercase"
                >
                  {i > 0 && (
                    <span
                      className="bg-accent size-1 rounded-full"
                      aria-hidden
                    />
                  )}
                  {nama}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <SliderGambar />
      </div>
    </section>
  )
}
