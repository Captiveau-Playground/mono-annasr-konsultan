import { ArrowRight, Check } from "lucide-react"
import Image from "next/image"

import { Reveal } from "@/components/site/Reveal"
import { Button } from "@/components/ui/button"
import { Link } from "@/lib/navigation"

const POIN_PENDEK = [
  "Perencanaan hingga konstruksi dalam satu koordinasi",
  "Pengawasan berlapis dengan laporan berkala",
  "Pendampingan perizinan PBG & SLF sampai terbit",
]

const METRIK = [
  { nilai: "2014", label: "Berdiri" },
  { nilai: "100+", label: "Proyek Daerah" },
  { nilai: "20+", label: "Kota Dijangkau" },
  { nilai: "98%", label: "Kepuasan Klien" },
]

export function TentangInti() {
  return (
    <section className="bg-background py-[72px] lg:py-[120px]">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          {/* 7/12 — teks */}
          <div className="lg:col-span-7">
            <Reveal>
              <p className="text-primary text-xs font-semibold tracking-[0.22em] uppercase">
                Tentang Kami
              </p>
              <h2 className="text-foreground mt-4 max-w-xl text-3xl leading-[1.12] font-bold text-balance sm:text-4xl">
                Konsultan sipil yang mengawal mutu dari gambar hingga serah
                terima
              </h2>
              <div className="text-muted-foreground mt-6 max-w-[42rem] space-y-4 text-lg leading-8">
                <p>
                  Kami adalah penyedia jasa konsultansi teknik sipil dan
                  arsitektur di Kabupaten Jombang, Jawa Timur, dengan pengalaman
                  lapangan di berbagai kota di Indonesia.
                </p>
                <p>
                  Tujuan kami sederhana: memastikan setiap rencana pembangunan
                  berjalan tepat mutu, tepat biaya, dan tepat waktu — dengan
                  tenaga ahli struktur, jalan, jembatan, dan sumber daya air.
                </p>
              </div>

              <ul className="mt-8 flex flex-col gap-3">
                {POIN_PENDEK.map((p) => (
                  <li
                    key={p}
                    className="text-foreground/85 flex items-start gap-3"
                  >
                    <span className="bg-accent/15 text-accent-foreground mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full">
                      <Check className="size-3.5" strokeWidth={3} />
                    </span>
                    <span className="text-base font-medium">{p}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-9">
                <Button asChild size="pill">
                  <Link href="/portfolio">
                    Lihat Portfolio Proyek
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </Reveal>
          </div>

          {/* 5/12 — gambar */}
          <div className="lg:col-span-5">
            <Reveal arah="right">
              <div className="border-border overflow-hidden rounded-[20px] border shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                <Image
                  src="/images/annasr/tim-perusahaan.jpg"
                  alt="Tim CV. AN NASR KONSULTAN — Jombang, Jawa Timur"
                  width={1000}
                  height={760}
                  sizes="(min-width:1024px) 42vw, 100vw"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                />
              </div>
              <p className="text-muted-foreground mt-3 text-sm">
                Tim CV. AN NASR KONSULTAN — Jombang, Jawa Timur
              </p>
            </Reveal>
          </div>
        </div>

        {/* Metrik */}
        <div className="mt-20 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {METRIK.map((m, i) => (
            <Reveal key={m.label} delay={i * 0.05}>
              <div className="border-border bg-card rounded-[20px] border p-6 text-center transition-all duration-200 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(0,0,0,0.12)] lg:p-8">
                <p className="text-foreground text-3xl font-bold sm:text-4xl lg:text-[2.75rem]">
                  {m.nilai}
                </p>
                <p className="text-muted-foreground mt-2 text-sm font-medium tracking-wide uppercase">
                  {m.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
