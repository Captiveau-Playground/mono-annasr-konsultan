"use client"

import { ArrowRight, ChevronLeft, ChevronRight, MapPin } from "lucide-react"
import Image from "next/image"
import { useMemo, useState } from "react"

import { Reveal } from "@/components/site/Reveal"
import { SectionShell } from "@/components/site/SectionShell"
import { Button } from "@/components/ui/button"
import { kategoriPortfolio, portfolio } from "@/data/perusahaan"
import { Link } from "@/lib/navigation"

const PER_HALAMAN = 9

type ProyekItem = {
  nama: string
  instansi?: string
  lokasi: string
  kategori: string
  gambar: string
}

export function PortfolioSection({
  filterAktif = true,
  showAllButton = true,
  items,
}: {
  filterAktif?: boolean
  /** Tampilkan tombol "Lihat Semua Proyek" di header section (dimatikan di halaman Portfolio). */
  showAllButton?: boolean
  items?: ProyekItem[]
}) {
  const [kategori, setKategori] = useState("Semua")
  const [halaman, setHalaman] = useState(1)

  const dataSumber = items ?? portfolio

  const data = useMemo(
    () =>
      kategori === "Semua"
        ? dataSumber
        : dataSumber.filter((p) => p.kategori === kategori),
    [kategori, dataSumber]
  )

  const totalHalaman = Math.max(1, Math.ceil(data.length / PER_HALAMAN))
  const halamanAman = Math.min(halaman, totalHalaman)
  const tampil = data.slice(
    (halamanAman - 1) * PER_HALAMAN,
    halamanAman * PER_HALAMAN
  )

  const gantiKategori = (k: string) => {
    setKategori(k)
    setHalaman(1)
  }

  return (
    <SectionShell
      id="proyek"
      tone="gelap"
      judul={"Ratusan Proyek yang\nTelah Kami Kawal"}
      aksi={
        showAllButton ? (
          <Button asChild size="pill" variant="hero">
            <Link href="/portfolio">
              Lihat Semua Proyek
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        ) : undefined
      }
    >
      {filterAktif ? (
        <Reveal className="mb-8 flex flex-wrap gap-2.5">
          {kategoriPortfolio.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => gantiKategori(k)}
              className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                kategori === k
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-primary-foreground/20 bg-primary-foreground/5 text-primary-foreground/70 hover:border-accent/50 hover:text-primary-foreground"
              }`}
            >
              {k}
            </button>
          ))}
        </Reveal>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tampil.map((p, i) => (
          <Reveal key={p.nama} delay={i * 0.04}>
            <article className="group border-primary-foreground/10 relative overflow-hidden rounded-lg border">
              <Image
                src={p.gambar}
                alt={`${p.nama} — ${p.lokasi}`}
                width={800}
                height={600}
                sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="from-secondary via-secondary/25 pointer-events-none absolute inset-0 bg-gradient-to-t to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                  <span className="text-accent text-[11px] font-semibold tracking-[0.18em] uppercase">
                    {p.kategori}
                  </span>
                  {p.instansi ? (
                    <span className="text-primary-foreground/55 text-[11px] tracking-wide uppercase">
                      {p.instansi}
                    </span>
                  ) : null}
                </div>
                <h3 className="text-primary-foreground mt-1.5 text-base leading-snug">
                  {p.nama}
                </h3>
                <p className="text-primary-foreground/70 mt-1 flex items-center gap-1.5 text-xs">
                  <MapPin className="size-3.5" />
                  {p.lokasi}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <nav
        aria-label="Navigasi halaman proyek"
        className="mt-8 flex items-center justify-center gap-2"
      >
        <PagBtn
          label="Halaman sebelumnya"
          disabled={halamanAman === 1}
          onClick={() => setHalaman(halamanAman - 1)}
        >
          <ChevronLeft className="size-4" />
        </PagBtn>

        {Array.from({ length: totalHalaman }, (_, i) => {
          const n = i + 1
          const aktif = n === halamanAman

          return (
            <button
              key={n}
              type="button"
              aria-current={aktif ? "page" : undefined}
              onClick={() => setHalaman(n)}
              className={`size-9 rounded-md border text-sm font-medium transition-colors ${
                aktif
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-primary-foreground/20 bg-primary-foreground/5 text-primary-foreground/70 hover:border-accent/50 hover:text-primary-foreground"
              }`}
            >
              {n}
            </button>
          )
        })}

        <PagBtn
          label="Halaman berikutnya"
          disabled={halamanAman === totalHalaman}
          onClick={() => setHalaman(halamanAman + 1)}
        >
          <ChevronRight className="size-4" />
        </PagBtn>
      </nav>
    </SectionShell>
  )
}

function PagBtn({
  children,
  label,
  disabled,
  onClick,
}: {
  children: React.ReactNode
  label: string
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="border-primary-foreground/20 bg-primary-foreground/5 text-primary-foreground/70 hover:border-accent/50 hover:text-primary-foreground flex size-9 items-center justify-center rounded-md border transition-colors disabled:cursor-not-allowed disabled:opacity-35"
    >
      {children}
    </button>
  )
}
