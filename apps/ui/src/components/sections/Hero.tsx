"use client"

import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics/events"
import type { BerandaKonten } from "@/lib/annasr/beranda"
import { Link } from "@/lib/navigation"

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
 * Hero homepage — profesional, rata kiri, lapang.
 * Latar terang + halo halus, badge, tesis, CTA, trust line, dan strip
 * layanan sebagai penutup; dekorasi vertikal tipis di desktop.
 */
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
    <section className="bg-background relative isolate overflow-hidden">
      {/* Halo sangat halus — kedalaman tanpa gambar. */}
      <div
        className="hero-halo absolute inset-x-0 top-0 -z-10 h-72"
        aria-hidden
      />
      <div
        className="via-border absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent"
        aria-hidden
      />

      {/* Dekorasi vertikal editorial (desktop) — tanda harga diri, bukan isi. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-8 hidden -translate-y-1/2 lg:block"
      >
        <span
          className="text-muted-foreground/35 block text-[10px] font-semibold tracking-[0.45em] whitespace-nowrap uppercase"
          style={{ transform: "rotate(90deg)", transformOrigin: "center" }}
        >
          Sejak 2014 — Konsultan Teknik &amp; Konstruksi
        </span>
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 pt-24 pb-20 sm:pt-32 sm:pb-24 lg:px-10">
        <div className="hero-anim-fade-up max-w-3xl">
          <span className="border-border bg-muted/50 text-muted-foreground inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-semibold tracking-[0.18em] uppercase">
            <span className="bg-accent size-1.5 rounded-full" />
            {namaBrand}
            <span className="text-border" aria-hidden>
              •
            </span>
            {taglineBrand}
          </span>

          <h1 className="text-foreground mt-7 text-[2.6rem] leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
            {kontenHero.judul}
          </h1>

          {kontenHero.deskripsi ? (
            <p className="text-muted-foreground mt-6 max-w-xl text-base leading-relaxed text-pretty sm:text-lg">
              {kontenHero.deskripsi}
            </p>
          ) : null}

          <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row">
            <Button asChild size="xl">
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
            <Button asChild variant="outline" size="xl">
              <a
                href="#layanan"
                onClick={() =>
                  trackEvent(ANALYTICS_EVENTS.ctaClicked, {
                    cta: "hero_layanan",
                  })
                }
              >
                Lihat Layanan
              </a>
            </Button>
          </div>

          {kontenHero.keunggulan.length > 0 ? (
            <p className="text-muted-foreground/80 mt-7 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] font-medium">
              {kontenHero.keunggulan.map((item, i) => (
                <span key={item} className="flex items-center gap-2">
                  {i > 0 && (
                    <span
                      className="bg-border size-1 rounded-full"
                      aria-hidden
                    />
                  )}
                  {item}
                </span>
              ))}
            </p>
          ) : null}

          {/* Strip lini layanan — penutup professional, bukan isi yang ramai. */}
          <div className="border-border/70 mt-14 border-t pt-5">
            <ul className="flex flex-wrap items-center gap-x-7 gap-y-2.5">
              {lini.map((nama, i) => (
                <li
                  key={nama}
                  className="text-muted-foreground flex items-center gap-2.5 text-xs font-semibold tracking-[0.14em] uppercase"
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
      </div>
    </section>
  )
}
