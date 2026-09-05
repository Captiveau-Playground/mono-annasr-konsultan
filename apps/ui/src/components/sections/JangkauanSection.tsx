import { ChevronDown } from "lucide-react"

import { PetaMap } from "@/components/sections/PetaMap"
import { Reveal } from "@/components/site/Reveal"
import { kotaProyek } from "@/data/perusahaan"

const RINGKAS_STATIS = [
  { nilai: "20+", label: "Kota Dijangkau" },
  { nilai: "40+", label: "Proyek Selesai" },
  { nilai: "Jawa Timur", label: "Basis Operasi" },
]

/**
 * Section peta jangkauan proyek — dipakai di Beranda, Proyek, dan Tentang
 * Kami. Komposisi: judul + deskripsi, kartu statistik, peta Leaflet
 * interaktif, dan daftar kota yang bisa dibuka.
 */
export function JangkauanSection({
  judul,
  deskripsi,
  kota = [],
}: {
  judul?: string
  deskripsi?: string
  kota?: { nama: string; lat: number; lng: number }[]
}) {
  const daftarKota = kota.length > 0 ? kota : kotaProyek

  return (
    <section className="bg-surface py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="text-primary text-xs font-semibold tracking-[0.22em] uppercase">
                Jangkauan Proyek
              </p>
              <h2 className="text-foreground mt-4 max-w-xl text-3xl leading-[1.12] font-bold text-balance sm:text-4xl">
                {judul}
              </h2>
              {deskripsi ? (
                <p className="text-muted-foreground mt-5 max-w-[42rem] text-lg leading-8">
                  {deskripsi}
                </p>
              ) : null}
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <div className="grid grid-cols-3 gap-4">
              {RINGKAS_STATIS.map((r, i) => (
                <Reveal key={r.label} delay={i * 0.05}>
                  <div className="border-border bg-card rounded-[20px] border p-5 text-center transition-all duration-200 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(0,0,0,0.12)]">
                    <p className="text-foreground text-xl font-bold sm:text-2xl">
                      {r.nilai}
                    </p>
                    <p className="text-muted-foreground mt-1.5 text-xs font-medium tracking-wide uppercase">
                      {r.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        <Reveal className="mt-12">
          <PetaMap kota={daftarKota} />
        </Reveal>

        <div className="mt-10">
          <details className="group">
            <summary className="text-primary hover:text-accent inline-flex cursor-pointer list-none items-center gap-1.5 text-sm font-semibold transition-colors">
              Lihat daftar kota
              <ChevronDown className="size-4 transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <ul className="mt-4 flex flex-wrap gap-2.5">
              {daftarKota.map((k) => (
                <li
                  key={k.nama}
                  className="border-border bg-card text-muted-foreground rounded-full border px-4 py-1.5 text-sm font-medium"
                >
                  {k.nama}
                </li>
              ))}
            </ul>
          </details>
        </div>
      </div>
    </section>
  )
}
