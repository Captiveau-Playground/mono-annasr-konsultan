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

/**
 * "Mengapa Memilih An Nasr Konsultan" — scrollytelling: panel kiri sticky
 * (judul + penghitung besar + progress), daftar alasan di kanan menyala satu
 * per satu saat scroll; item yang sedang terbaca disorot.
 */
export function KenapaKami({ alasan = [] }: { alasan?: Alasan[] }) {
  const sumber: Alasan[] = alasan.length > 0 ? alasan : ALASAN_STATIS
  const ALASAN: (Alasan & { ikon: LucideIcon })[] = sumber.map((a, i) => ({
    ...a,
    ikon: IKON[i % IKON.length] ?? Building2,
  }))

  const [aktif, setAktif] = useState(0)
  const refs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const i = refs.current.indexOf(e.target as HTMLElement)
            if (i !== -1) setAktif(i)
          }
        }
      },
      // Pita tengah — hanya item yang melewati tengah viewport dianggap aktif.
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    )

    const els = refs.current.filter(Boolean) as HTMLElement[]
    for (const el of els) io.observe(el)

    return () => io.disconnect()
  }, [])

  return (
    <section className="bg-background py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
        <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* Panel kiri — melekat (sticky) di desktop */}
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <h2 className="text-foreground max-w-xl text-3xl leading-[1.12] font-bold text-balance sm:text-4xl lg:text-5xl">
                Mengapa Memilih An Nasr Konsultan
              </h2>
              <p className="text-muted-foreground mt-5 max-w-md text-base leading-relaxed">
                Scroll untuk mengenal empat alasan utama mengapa banyak pemberi
                tugas mempercayakan proyeknya kepada kami.
              </p>
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
                  className="bg-accent h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${((aktif + 1) / ALASAN.length) * 100}%`,
                  }}
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

          {/* Panel kanan — daftar alasan yang menyala saat scroll */}
          <div className="space-y-10 lg:space-y-16">
            {ALASAN.map((item, i) => {
              const Ikon = item.ikon
              const isAktif = i === aktif
              const gelap = i % 2 === 1

              return (
                <article
                  key={item.judul}
                  ref={(el) => {
                    refs.current[i] = el
                  }}
                  aria-current={isAktif ? "step" : undefined}
                  className={cn(
                    "scroll-mt-32 rounded-[20px] border p-7 transition-all duration-500 lg:scroll-mt-24",
                    gelap
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-transparent bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)]",
                    isAktif
                      ? "border-accent shadow-[var(--shadow-lift)]"
                      : "opacity-45 saturate-50"
                  )}
                >
                  <div className="flex items-start gap-5">
                    <span
                      className={cn(
                        "flex size-12 shrink-0 items-center justify-center rounded-xl",
                        gelap
                          ? "bg-primary-foreground/10 text-accent"
                          : "bg-primary/8 text-primary"
                      )}
                    >
                      <Ikon className="size-6" strokeWidth={1.6} />
                    </span>
                    <div>
                      <p
                        className={cn(
                          "text-[11px] font-semibold tracking-[0.2em] uppercase",
                          gelap ? "text-primary-foreground/60" : "text-accent"
                        )}
                      >
                        Keunggulan {String(i + 1).padStart(2, "0")}
                      </p>
                      <h3
                        className={cn(
                          "mt-2 text-xl leading-snug font-semibold",
                          gelap ? "text-primary-foreground" : "text-foreground"
                        )}
                      >
                        {item.judul}
                      </h3>
                      <p
                        className={cn(
                          "mt-3 text-sm leading-7",
                          gelap
                            ? "text-primary-foreground/75"
                            : "text-muted-foreground"
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
