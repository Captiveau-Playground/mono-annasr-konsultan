import { ArrowRight, Check } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { perusahaan } from "@/data/perusahaan"
import { Link } from "@/lib/navigation"

const KEUNGGULAN = [
  "Berdiri sejak 2014",
  "Puluhan proyek daerah",
  "Tim profesional bersertifikat",
]

export function TentangHero() {
  return (
    <section className="relative isolate flex min-h-[70vh] items-center overflow-hidden">
      <Image
        src="/images/annasr/layanan-perencanaan.jpg"
        alt="Tim perencanaan CV. AN NASR KONSULTAN menyusun gambar kerja"
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-20 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[oklch(0.16_0.05_266)] via-[oklch(0.24_0.06_266)] to-[oklch(0.35_0.08_258)]" />
      <div className="bg-foreground/45 absolute inset-0 -z-10 mix-blend-multiply" />

      <div className="mx-auto w-full max-w-6xl px-6 py-24 lg:px-10">
        <div className="max-w-3xl">
          <p className="text-accent text-xs font-semibold tracking-[0.24em] uppercase">
            Tentang Kami
          </p>
          <h1 className="text-foreground mt-5 text-4xl leading-[1.1] font-bold text-balance sm:text-5xl lg:text-[3.5rem]">
            Mitra teknik yang tumbuh bersama pembangunan daerah
          </h1>
          <p className="text-foreground/85 mt-6 max-w-2xl text-lg leading-relaxed">
            {perusahaan.singkat}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="xl">
              <Link href="/kontak">
                Konsultasi Sekarang
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="heroGhost" size="xl">
              <Link href="/layanan">Lihat Layanan</Link>
            </Button>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-3">
            {KEUNGGULAN.map((item) => (
              <li
                key={item}
                className="text-foreground/90 flex items-center gap-2.5 text-sm font-medium"
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
        </div>
      </div>
    </section>
  )
}
