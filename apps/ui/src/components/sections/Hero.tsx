import { ArrowRight, Check } from "lucide-react"
import Image from "next/image"

import { CtaLink } from "@/components/analytics/CtaLink"
import { HeroSlider } from "@/components/sections/HeroSlider"
import { Button } from "@/components/ui/button"
import type { BerandaKonten } from "@/lib/annasr/beranda"

const HERO_DEFAULT = {
  judul: "Tepat Merencanakan, Tepat Mengawasi, Tepat Membangun",
  deskripsi:
    "Menyediakan layanan perencanaan, pengawasan, perizinan, dan konstruksi dengan mengutamakan kualitas, profesionalisme, serta ketepatan dalam setiap tahap pelaksanaan proyek.",
  keunggulan: [],
  gambar: [],
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
    <section className="cta-gradient relative isolate -mt-16 overflow-hidden">
      {/* Latar batik hero (ornamen, alpha rendah) */}
      <Image
        src="/images/new/hero-bg.webp"
        alt=""
        aria-hidden
        fill
        priority
        sizes="100vw"
        className="pointer-events-none absolute inset-0 object-cover"
      />
      <div
        className="blueprint-grid pointer-events-none absolute inset-0 opacity-[0.18]"
        aria-hidden
      />
      <div
        className="bg-accent/10 pointer-events-none absolute -top-24 -right-24 size-96 rounded-full blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 pt-40 pb-16 sm:pt-44 sm:pb-20 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:pt-48 lg:pb-24">
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
              <CtaLink cta="hero_konsultasi" href="/kontak">
                Konsultasi Sekarang
                <ArrowRight className="size-4" />
              </CtaLink>
            </Button>
            <Button
              asChild
              size="xl"
              className="border-primary-foreground/30 text-primary-foreground rounded-full bg-transparent hover:bg-white/10"
            >
              <CtaLink cta="hero_layanan" href="#layanan">
                Lihat Layanan
              </CtaLink>
            </Button>
          </div>

          {kontenHero.keunggulan.length > 0 ? (
            <p className="text-primary-foreground/80 mt-7 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] font-medium">
              {kontenHero.keunggulan.map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <Check
                    className="text-accent size-3.5"
                    strokeWidth={3}
                    aria-hidden
                  />
                  {item}
                </span>
              ))}
            </p>
          ) : null}

          {/* Strip lini layanan — penutup tenang. Setiap poin = bullet oranye. */}
          <div className="border-primary-foreground/15 mt-14 border-t pt-5">
            <ul className="flex flex-wrap items-center gap-x-7 gap-y-2.5">
              {lini.map((nama) => (
                <li
                  key={nama}
                  className="text-primary-foreground/65 flex items-center gap-2.5 text-xs font-semibold tracking-[0.14em] uppercase"
                >
                  <span className="bg-accent size-1 rounded-full" aria-hidden />
                  {nama}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <HeroSlider gambar={kontenHero.gambar ?? []} />
      </div>
    </section>
  )
}
