"use client"

import { ArrowRight, Check, MapPin } from "lucide-react"
import { motion } from "motion/react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import type { BerandaKonten } from "@/lib/annasr/beranda"
import { Link } from "@/lib/navigation"

const HERO_DEFAULT = {
  judul: "Tepat Merencanakan, Tepat Mengawasi, Tepat Membangun",
  deskripsi:
    "Menyediakan layanan perencanaan, pengawasan, perizinan, dan konstruksi dengan mengutamakan kualitas, profesionalisme, serta ketepatan dalam setiap tahap pelaksanaan proyek.",
  keunggulan: [],
}

const STATISTIK_DEFAULT = [
  { nilai: "15+", label: "Tahun Pengalaman" },
  { nilai: "7", label: "Tahap Kerja Terukur" },
  { nilai: "4", label: "Lini Layanan" },
]

export function Hero({
  hero,
  statistik = [],
}: {
  hero?: BerandaKonten["hero"]
  statistik?: BerandaKonten["statistik"]
}) {
  const kontenHero = hero ?? HERO_DEFAULT
  const stat = statistik.length > 0 ? statistik : STATISTIK_DEFAULT

  return (
    <section className="relative isolate flex min-h-screen items-center justify-center overflow-hidden">
      <Image
        src="/images/annasr/hero-konstruksi.jpg"
        alt="Proyek konstruksi infrastruktur berskala besar"
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-20 object-cover"
      />
      <div className="hero-overlay absolute inset-0 -z-10" />
      <div
        className="blueprint-grid absolute inset-0 -z-10 opacity-20"
        aria-hidden
      />

      <div className="mx-auto w-full max-w-4xl px-6 pt-28 pb-16 text-center lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center"
        >
          <p className="text-accent text-xs font-semibold tracking-[0.3em] uppercase">
            CV. An Nasr Konsultan
          </p>
          <p className="text-primary-foreground/70 mt-3 flex items-center gap-1.5 text-xs font-medium tracking-[0.22em] uppercase">
            <MapPin className="size-3.5" />
            Jombang, Jawa Timur
          </p>

          <h1 className="text-primary-foreground mt-7 max-w-3xl text-4xl leading-[1.1] text-balance sm:text-5xl lg:text-6xl">
            {kontenHero.judul}
          </h1>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild variant="hero" size="xl">
              <Link href="/kontak">
                Konsultasi Sekarang
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="heroGhost" size="xl">
              <a href="#layanan">Lihat Layanan</a>
            </Button>
          </div>
          <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {kontenHero.keunggulan.map((item) => (
              <li
                key={item}
                className="text-primary-foreground/90 flex items-center gap-2 text-sm font-medium"
              >
                <span className="bg-accent/90 flex size-5 items-center justify-center rounded-full">
                  <Check
                    className="text-accent-foreground size-3"
                    strokeWidth={3}
                  />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8 grid w-full max-w-lg grid-cols-3 gap-6 border-t border-white/15 pt-8">
            {stat.map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                <span className="text-primary-foreground font-[family-name:var(--font-heading)] text-2xl font-semibold sm:text-3xl">
                  {item.nilai}
                </span>
                <span className="text-primary-foreground/70 text-xs font-medium tracking-wide uppercase">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
