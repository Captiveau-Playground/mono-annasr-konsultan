import { ArrowUpRight } from "lucide-react"
import Image from "next/image"

import { CtaLink } from "@/components/analytics/CtaLink"
import { Button } from "@/components/ui/button"
import type { ItemKarir } from "@/lib/annasr/konten"
import { Link } from "@/lib/navigation"
import { cn } from "@/lib/styles"

/**
 * Kartu lowongan — seluruh kartu clickable; CTA juga menuju detail.
 * State tutup: opacity lebih rendah + CTA disabled "Lowongan Ditutup".
 */
export function JobCard({ item }: { item: ItemKarir }) {
  const tutup = item.status === "ditutup"

  return (
    <Link href={`/karir/${item.slug}`} className="group block h-full">
      <article
        className={cn(
          "border-border bg-card flex h-full flex-col rounded-2xl border p-6 shadow-[var(--shadow-soft)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[var(--shadow-lift)]"
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <Image
            src="/images/logo/logo-blue.png"
            alt="CV. An Nasr Konsultan"
            width={40}
            height={40}
            className="border-border size-10 rounded-lg border object-contain"
          />
          <span
            className={cn(
              "rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide uppercase",
              tutup
                ? "bg-muted text-muted-foreground"
                : "bg-accent text-accent-foreground"
            )}
          >
            {tutup ? "Lowongan Ditutup" : "We are hiring"}
          </span>
        </div>

        <div className="mt-5 flex flex-1 flex-col">
          <h3 className="text-foreground text-xl leading-snug font-semibold">
            {item.nama}
          </h3>
          <p className="text-muted-foreground mt-1 text-xs font-medium tracking-wide uppercase">
            {item.tipe} · {item.lokasi}
          </p>

          {item.ringkas ? (
            <div className="mt-4">
              <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.14em] uppercase">
                Kualifikasi
              </p>
              <p className="text-muted-foreground mt-1.5 line-clamp-3 text-sm leading-relaxed">
                {item.ringkas}
              </p>
            </div>
          ) : null}
        </div>

        <div className="mt-6">
          {tutup ? (
            <Button
              disabled
              variant="outline"
              size="sm"
              className="w-full rounded-full"
            >
              Lowongan Ditutup
            </Button>
          ) : (
            <Button asChild size="sm" className="w-full rounded-full">
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
