import { ArrowUpRight, Check } from "lucide-react"
import Image from "next/image"

import { CtaLink } from "@/components/analytics/CtaLink"
import { Button } from "@/components/ui/button"
import type { ItemKarir } from "@/lib/annasr/konten"
import { Link } from "@/lib/navigation"
import { cn } from "@/lib/styles"

/**
 * Kartu lowongan — latar biru (primary), teks putih, CTA oranye (accent),
 * logo + label status di header, dan daftar kualifikasi di depan.
 * Kartu clickable; state tutup: opacity lebih rendah + CTA disabled.
 */
export function JobCard({ item }: { item: ItemKarir }) {
  const tutup = item.status === "ditutup"
  const kualifikasi = item.kualifikasi.slice(0, 3)

  return (
    <Link href={`/karir/${item.slug}`} className="group block h-full">
      <article
        className={cn(
          "bg-primary text-primary-foreground flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 p-6 shadow-[var(--shadow-soft)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[var(--shadow-lift)]",
          tutup && "opacity-70"
        )}
      >
        {/* Header: logo + label status */}
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo/logo-white.png"
            alt="CV. An Nasr Konsultan"
            width={40}
            height={40}
            className="size-10 shrink-0 bg-white/10 object-contain"
          />
          <span className="leading-tight">
            <span className="block font-[family-name:var(--font-heading)] text-sm font-semibold">
              CV. An Nasr Konsultan
            </span>
            <span className="hidden text-[11px] tracking-wide sm:block">
              Konsultan Teknik &amp; Konstruksi
            </span>
          </span>
        </div>
        <div className="pt-4">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide uppercase",
              tutup
                ? "text-primary-foreground/70 bg-white/10"
                : "bg-accent text-accent-foreground"
            )}
          >
            {tutup ? "Lowongan Ditutup" : "We are hiring"}
          </span>
        </div>

        <div className="mt-5 flex flex-1 flex-col">
          <h3 className="text-primary-foreground text-xl leading-snug font-semibold">
            {item.nama}
          </h3>
          <p className="text-primary-foreground/70 mt-1 text-xs font-medium tracking-wide uppercase">
            {item.tipe} · {item.lokasi}
          </p>

          {/* Kualifikasi — tampil di depan kartu */}
          {kualifikasi.length > 0 ? (
            <div className="mt-5">
              <p className="text-primary-foreground/60 text-[11px] font-semibold tracking-[0.14em] uppercase">
                Kualifikasi
              </p>
              <ul className="mt-2.5 space-y-2">
                {kualifikasi.map((k) => (
                  <li key={k} className="flex items-start gap-2">
                    <span className="bg-accent/90 mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full">
                      <Check
                        className="text-accent-foreground size-2.5"
                        strokeWidth={4}
                      />
                    </span>
                    <span className="text-primary-foreground/85 line-clamp-2 text-sm leading-snug">
                      {k}
                    </span>
                  </li>
                ))}
              </ul>
              {item.kualifikasi.length > 3 ? (
                <p className="text-primary-foreground/60 mt-2 text-xs">
                  +{item.kualifikasi.length - 3} kualifikasi lainnya
                </p>
              ) : null}
            </div>
          ) : item.ringkas ? (
            <p className="text-primary-foreground/80 mt-4 text-sm leading-relaxed">
              {item.ringkas}
            </p>
          ) : null}
        </div>

        {/* CTA oranye */}
        <div className="mt-6">
          {tutup ? (
            <Button
              disabled
              variant="outline"
              size="sm"
              className="text-primary-foreground/60 w-full rounded-full border-white/20 bg-transparent"
            >
              Lowongan Ditutup
            </Button>
          ) : (
            <Button
              asChild
              size="sm"
              className="bg-accent text-accent-foreground w-full rounded-full"
            >
              <CtaLink
                cta="karir_open"
                params={{ posisi: item.nama }}
                href={`/karir/${item.slug}`}
              >
                Lihat Selengkapnya
                <ArrowUpRight className="size-4" />
              </CtaLink>
            </Button>
          )}
        </div>
      </article>
    </Link>
  )
}
