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

export function TentangHero({
  judul,
  deskripsi,
  keunggulan = [],
}: {
  judul?: string
  deskripsi?: string
  keunggulan?: string[]
}) {
  const trust = keunggulan.length > 0 ? keunggulan : KEUNGGULAN

  return (
    <section className="bg-background relative overflow-hidden py-20 lg:py-24">
      {/* Dekorasi halus biar tidak kosong, bukan overlay yang menutupi konten */}
      <div
        className="blueprint-grid pointer-events-none absolute inset-0 opacity-[0.5]"
        aria-hidden
      />
      <div className="bg-accent/10 pointer-events-none absolute -top-24 -right-24 size-96 rounded-full blur-3xl" />
      <div className="bg-primary/8 pointer-events-none absolute -bottom-32 left-1/3 size-96 rounded-full blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-6 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          {/* 7/12 — konten di atas latar putih yang terbaca */}
          <div className="lg:col-span-7">
            <h1 className="text-foreground mt-0 max-w-2xl text-4xl leading-[1.08] font-bold text-balance sm:text-5xl lg:text-[3.4rem]">
              {judul}
            </h1>

            <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-8">
              {deskripsi ?? perusahaan.singkat}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="xl"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Link href="/kontak">
                  Konsultasi Sekarang
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link href="/layanan">Lihat Layanan</Link>
              </Button>
            </div>

            <ul className="border-border mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t pt-7">
              {trust.map((item) => (
                <li
                  key={item}
                  className="text-foreground/85 flex items-center gap-2.5 text-sm font-medium"
                >
                  <span className="bg-accent/15 flex size-5 items-center justify-center rounded-full">
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

          {/* 5/12 — panel foto */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:ml-auto">
              <div className="from-primary/15 to-accent/25 absolute -inset-4 rounded-[28px] bg-gradient-to-br blur-lg" />
              <div className="border-border relative overflow-hidden rounded-[24px] border shadow-[0_28px_64px_-26px_rgba(0,0,0,0.25)]">
                <Image
                  src="/images/annasr/layanan-perencanaan.jpg"
                  alt="Tim perencanaan CV. AN NASR KONSULTAN menyusun gambar kerja"
                  width={840}
                  height={640}
                  priority
                  sizes="(min-width:1024px) 42vw, 100vw"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>

              <div className="border-border absolute right-4 -bottom-6 left-4 rounded-2xl border bg-white/95 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.1)] backdrop-blur sm:right-auto sm:left-6 sm:max-w-xs">
                <p className="text-primary text-2xl font-bold">100+</p>
                <p className="text-muted-foreground mt-0.5 text-xs font-medium tracking-wide uppercase">
                  Proyek di berbagai daerah
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
