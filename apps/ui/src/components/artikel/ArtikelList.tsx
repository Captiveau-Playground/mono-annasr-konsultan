"use client"

import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { useMemo, useState } from "react"

import { ArtikelCard } from "@/components/artikel/ArtikelCard"
import { artikel } from "@/data/perusahaan"
import { cn } from "@/lib/styles"

const PER_HALAMAN = 6

const kategoriArtikel = [
  "Semua",
  ...Array.from(new Set(artikel.map((a) => a.kategori))),
]

export function ArtikelList() {
  const [cari, setCari] = useState("")
  const [kategori, setKategori] = useState("Semua")
  const [halaman, setHalaman] = useState(1)

  const hasil = useMemo(() => {
    const q = cari.trim().toLowerCase()

    return artikel.filter((a) => {
      const cocokKategori = kategori === "Semua" || a.kategori === kategori
      const cocokCari =
        !q || `${a.judul} ${a.ringkas} ${a.kategori}`.toLowerCase().includes(q)

      return cocokKategori && cocokCari
    })
  }, [cari, kategori])

  const totalHalaman = Math.max(1, Math.ceil(hasil.length / PER_HALAMAN))
  const halamanAman = Math.min(halaman, totalHalaman)
  const tampil = hasil.slice(
    (halamanAman - 1) * PER_HALAMAN,
    halamanAman * PER_HALAMAN
  )

  const gantiKategori = (k: string) => {
    setKategori(k)
    setHalaman(1)
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Pencarian + filter kategori */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative block w-full max-w-sm">
          <span className="sr-only">Cari artikel</span>
          <Search className="text-muted-foreground absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
          <input
            type="search"
            value={cari}
            onChange={(e) => {
              setCari(e.target.value)
              setHalaman(1)
            }}
            placeholder="Cari judul, topik, atau kategori…"
            className="border-border bg-card text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-11 w-full rounded-full border pr-4 pl-10 text-sm shadow-[var(--shadow-soft)] outline-none focus-visible:ring-1"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          {kategoriArtikel.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => gantiKategori(k)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                kategori === k
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary"
              )}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* Daftar artikel */}
      {tampil.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tampil.map((a) => (
            <ArtikelCard key={a.slug} item={a} />
          ))}
        </div>
      ) : (
        <div className="border-border bg-card rounded-2xl border border-dashed py-20 text-center">
          <p className="text-foreground font-[family-name:var(--font-heading)] text-base font-semibold">
            Tidak ada artikel yang cocok
          </p>
          <p className="text-muted-foreground mt-1 text-sm">
            Coba ubah kata kunci atau pilih kategori lain.
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalHalaman > 1 ? (
        <nav
          aria-label="Navigasi halaman artikel"
          className="flex items-center justify-center gap-2"
        >
          <TombolHal
            label="Halaman sebelumnya"
            disabled={halamanAman === 1}
            onClick={() => setHalaman(halamanAman - 1)}
          >
            <ChevronLeft className="size-4" />
          </TombolHal>

          {Array.from({ length: totalHalaman }, (_, i) => {
            const n = i + 1

            return (
              <button
                key={n}
                type="button"
                aria-current={n === halamanAman ? "page" : undefined}
                onClick={() => setHalaman(n)}
                className={cn(
                  "size-9 rounded-md border text-sm font-medium transition-colors",
                  n === halamanAman
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-accent/50 hover:text-primary"
                )}
              >
                {n}
              </button>
            )
          })}

          <TombolHal
            label="Halaman berikutnya"
            disabled={halamanAman === totalHalaman}
            onClick={() => setHalaman(halamanAman + 1)}
          >
            <ChevronRight className="size-4" />
          </TombolHal>
        </nav>
      ) : null}
    </div>
  )
}

function TombolHal({
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
      className="border-border bg-card text-muted-foreground hover:border-accent/50 hover:text-primary flex size-9 items-center justify-center rounded-md border transition-colors disabled:cursor-not-allowed disabled:opacity-35"
    >
      {children}
    </button>
  )
}
