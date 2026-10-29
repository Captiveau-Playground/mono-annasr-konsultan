"use client"

import {
  Building2,
  Handshake,
  MapPin,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { Reveal } from "@/components/site/Reveal"
import { cn } from "@/lib/styles"

const IKON: LucideIcon[] = [Building2, ShieldCheck, MapPin, Handshake]

type Alasan = { judul: string; teks: string }

const ALASAN_STATIS: Alasan[] = [
  {
    judul: "Perencanaan hingga Konstruksi",
    teks: "Empat lini layanan dalam satu koordinasi, dari desain sampai serah terima.",
  },
  {
    judul: "Tenaga Ahli Bersertifikat",
    teks: "Pekerjaan ditangani tenaga teknis dengan pengalaman struktur dan infrastruktur.",
  },
  {
    judul: "Jangkauan Luas",
    teks: "Berbasis di Jombang, proyek kami tersebar di berbagai kota di Indonesia.",
  },
  {
    judul: "Transparan & Tepat Waktu",
    teks: "Laporan berkala yang jelas, progres terdokumentasi, dan komitmen waktu.",
  },
]

/** Jarak (dalam tinggi viewport) tempat sebuah kartu dianggap "paling fokus". */
const RENTANG_FOKUS = 0.62
/** Pergeseran maksimum kartu (px) saat jauh dari pusat layar. */
const GESER_MAKS = 26

const batasi = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v))

/**
 * "Mengapa Memilih An Nasr Konsultan" — scrollytelling halus.
 *
 * Kartu tidak lagi menyala/mati mendadak: tiap kartu dihitung jaraknya ke
 * pusat viewport setiap frame (rAF) lalu digeser & diskalakan secara kontinu,
 * sehingga geraknya mengikuti scroll. Panel kiri sticky menampilkan nomor
 * aktif + progress yang juga mengalir (bukan melompat per item).
 */
export function KenapaKami({
  alasan = [],
  judul = "Mengapa Memilih An Nasr Konsultan",
  eyebrow = "Keunggulan",
}: {
  alasan?: Alasan[]
  /** Judul section — dari CMS beranda.keunggulanJudul (via situs). */
  judul?: string
  /** Label kecil di atas judul — dari CMS situs.keunggulanEyebrow. */
  eyebrow?: string
}) {
  const sumber: Alasan[] = alasan.length > 0 ? alasan : ALASAN_STATIS
  const ALASAN: (Alasan & { ikon: LucideIcon })[] = sumber.map((a, i) => ({
    ...a,
    ikon: IKON[i % IKON.length] ?? Building2,
  }))

  const [aktif, setAktif] = useState(0)
  const kartuRefs = useRef<(HTMLElement | null)[]>([])
  const barRef = useRef<HTMLDivElement | null>(null)
  const aktifRef = useRef(0)

  useEffect(() => {
    const els = kartuRefs.current.filter(Boolean) as HTMLElement[]
    if (els.length === 0) return

    const kurangiGerak = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    let raf = 0

    const hitung = () => {
      raf = 0
      const vh = window.innerHeight || 1
      const pusat = vh / 2
      let terdekat = 0
      let jarakTerdekat = Infinity

      for (const [i, el] of els.entries()) {
        const r = el.getBoundingClientRect()
        const tengahKartu = r.top + r.height / 2
        const jarak = (tengahKartu - pusat) / vh

        // 1 = tepat di pusat layar, 0 = jauh di luar rentang fokus.
        const fokus = batasi(1 - Math.abs(jarak) / RENTANG_FOKUS)

        if (!kurangiGerak) {
          const geser = batasi(jarak, -1, 1) * GESER_MAKS
          const skala = 0.975 + 0.025 * fokus

          el.style.transform = `translate3d(0, ${geser.toFixed(2)}px, 0) scale(${skala.toFixed(4)})`
          el.style.setProperty("--fokus", fokus.toFixed(3))
        }

        if (Math.abs(jarak) < jarakTerdekat) {
          jarakTerdekat = Math.abs(jarak)
          terdekat = i
        }
      }

      // Progress mengalir: dari kartu pertama menyentuh pusat layar sampai
      // kartu terakhir melewatinya.
      const pertama = els[0]
      const akhir = els.at(-1)
      if (!pertama || !akhir) return

      const r1 = pertama.getBoundingClientRect()
      const r2 = akhir.getBoundingClientRect()
      const atas = r1.top + r1.height / 2
      const bawah = r2.top + r2.height / 2
      const progres = batasi((pusat - atas) / Math.max(1, bawah - atas))

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progres.toFixed(4)})`
      }

      if (terdekat !== aktifRef.current) {
        aktifRef.current = terdekat
        setAktif(terdekat)
      }
    }

    const jadwalkan = () => {
      if (raf) return
      raf = requestAnimationFrame(hitung)
    }

    hitung()
    window.addEventListener("scroll", jadwalkan, { passive: true })
    window.addEventListener("resize", jadwalkan)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", jadwalkan)
      window.removeEventListener("resize", jadwalkan)
    }
  }, [])

  return (
    <section className="bg-background py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
        <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* Panel kiri — melekat (sticky) di desktop */}
          <div className="lg:sticky lg:top-28">
            <Reveal>
              {eyebrow ? (
                <p className="text-primary text-xs font-semibold tracking-[0.22em] uppercase">
                  {eyebrow}
                </p>
              ) : null}
              <h2 className="text-foreground mt-4 max-w-xl text-3xl leading-[1.12] font-bold text-balance sm:text-4xl lg:text-5xl">
                {judul}
              </h2>
            </Reveal>

            <Reveal delay={0.05} className="mt-10 hidden lg:block">
              <p aria-hidden="true" className="flex items-baseline gap-2">
                <span className="text-primary text-6xl font-bold tracking-tight tabular-nums">
                  {String(aktif + 1).padStart(2, "0")}
                </span>
                <span className="text-muted-foreground text-2xl font-semibold">
                  / {String(ALASAN.length).padStart(2, "0")}
                </span>
              </p>
              <div className="bg-primary/10 mt-5 h-1 w-48 overflow-hidden rounded-full">
                <div
                  ref={barRef}
                  className="bg-accent h-full origin-left rounded-full will-change-transform"
                  style={{ transform: "scaleX(0)" }}
                />
              </div>
              <p className="text-muted-foreground mt-5 max-w-xs text-sm">
                Memperhatikan:{" "}
                <span className="text-foreground font-semibold">
                  {ALASAN[aktif]?.judul}
                </span>
              </p>
            </Reveal>
          </div>

          {/* Panel kanan — kartu bergerak mengikuti scroll */}
          <div className="space-y-10 lg:space-y-16">
            {ALASAN.map((item, i) => {
              const Ikon = item.ikon
              const isAktif = i === aktif
              const gelap = i % 2 === 1

              return (
                <article
                  key={item.judul}
                  ref={(el) => {
                    kartuRefs.current[i] = el
                  }}
                  aria-current={isAktif ? "step" : undefined}
                  className={cn(
                    "scroll-mt-32 rounded-2xl border p-7 will-change-transform",
                    "transition-[border-color,box-shadow,background-color] duration-500 ease-out",
                    "motion-reduce:transform-none motion-reduce:transition-none",
                    gelap
                      ? "bg-navy text-white"
                      : "bg-card text-foreground shadow-[0_10px_30px_rgba(0,0,0,0.06)]",
                    isAktif
                      ? "border-accent shadow-[var(--shadow-lift)]"
                      : gelap
                        ? "border-white/10"
                        : "border-border"
                  )}
                >
                  <div className="flex items-start gap-5">
                    <span
                      className={cn(
                        "flex size-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-500",
                        gelap
                          ? "text-accent bg-white/10"
                          : "bg-primary/8 text-primary"
                      )}
                    >
                      <Ikon className="size-6" strokeWidth={1.6} />
                    </span>
                    <div>
                      <p
                        className={cn(
                          "text-[11px] font-semibold tracking-[0.2em] uppercase",
                          gelap ? "text-white/70" : "text-primary"
                        )}
                      >
                        Keunggulan {String(i + 1).padStart(2, "0")}
                      </p>
                      <h3
                        className={cn(
                          "mt-2 text-xl leading-snug font-semibold",
                          gelap ? "text-white" : "text-foreground"
                        )}
                      >
                        {item.judul}
                      </h3>
                      <p
                        className={cn(
                          "mt-3 text-sm leading-7",
                          gelap ? "text-white/80" : "text-muted-foreground"
                        )}
                      >
                        {item.teks}
                      </p>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
