"use client"

import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { BerandaKonten } from "@/lib/annasr/beranda"
import { Link } from "@/lib/navigation"

const HERO_DEFAULT = {
  judul: "Tepat Merencanakan, Tepat Mengawasi, Tepat Membangun",
  deskripsi:
    "Menyediakan layanan perencanaan, pengawasan, perizinan, dan konstruksi dengan mengutamakan kualitas, profesionalisme, serta ketepatan dalam setiap tahap pelaksanaan proyek.",
}

const LINI_DEFAULT = [
  "Jasa Perencanaan",
  "Jasa Pengawasan",
  "Jasa Perizinan",
  "Jasa Konstruksi",
]

/**
 * Hero homepage — minimal, rata kiri, lapang.
 * Tanpa gambar latar / grid / panel: judul besar + deskripsi + CTA,
 * ditutup satu baris kecil berisi 4 lini layanan (dari CMS).
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
  /** Nama layanan utk baris lini (dari CMS layanan) */
  layanan?: string[]
}) {
  const kontenHero = hero ?? HERO_DEFAULT
  const namaBrand = brand?.trim() || "CV. An Nasr Konsultan"
  const taglineBrand = tagline?.trim() || "Konsultan Teknik & Konstruksi"
  const lini = layanan.length > 0 ? layanan : LINI_DEFAULT

  return (
    <section className="bg-background relative isolate overflow-hidden">
      {/* Halo samar — bukan gambar; sekadar memberi kedalaman pada latar putih. */}
      <div
        className="hero-halo absolute inset-x-0 top-0 -z-10 h-64"
        aria-hidden
      />

      <div className="mx-auto w-full max-w-5xl px-6 pt-24 pb-20 sm:pt-32 sm:pb-28 lg:px-10">
        <div className="hero-anim-fade-up max-w-3xl">
          <p className="text-accent text-xs font-semibold tracking-[0.24em] uppercase">
            {namaBrand}
            <span className="text-border mx-2" aria-hidden>
              •
            </span>
            {taglineBrand}
          </p>

          <h1 className="text-foreground mt-6 text-4xl leading-[1.06] font-semibold tracking-tight text-balance sm:text-6xl lg:text-[4.25rem]">
            {kontenHero.judul}
          </h1>

          {kontenHero.deskripsi ? (
            <p className="text-muted-foreground mt-6 max-w-xl text-lg leading-relaxed text-pretty">
              {kontenHero.deskripsi}
            </p>
          ) : null}

          <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row">
            <Button asChild variant="default" size="xl">
              <Link href="/kontak">
                Konsultasi Sekarang
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl">
              <a href="#layanan">Lihat Layanan</a>
            </Button>
          </div>

          {/* Satu baris tenang: 4 lini layanan — pesan yang langsung terbaca. */}
          <p className="text-muted-foreground/75 mt-14 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-sm">
            {lini.map((nama, i) => (
              <span key={nama} className="flex items-center gap-2.5">
                {i > 0 && (
                  <span className="bg-border size-1 rounded-full" aria-hidden />
                )}
                {nama}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  )
}
