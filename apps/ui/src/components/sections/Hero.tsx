"use client"

import { ArrowRight, Check } from "lucide-react"

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
 * Hero homepage — latar navy gradient (konsisten dengan hero halaman
 * proyek), teks terang, rata kiri & lapang.
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
    <section className="cta-gradient relative isolate overflow-hidden">
      <div
        className="blueprint-grid pointer-events-none absolute inset-0 opacity-[0.18]"
        aria-hidden
      />
      <div
        className="bg-accent/10 pointer-events-none absolute -top-24 -right-24 size-96 rounded-full blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-6xl px-6 pt-24 pb-16 sm:pt-28 sm:pb-20 lg:px-10 lg:pt-32 lg:pb-24">
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
      </div>
    </section>
  )
}
