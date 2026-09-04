import { ArrowRight } from "lucide-react"

import { ArtikelCard } from "@/components/artikel/ArtikelCard"
import { Reveal } from "@/components/site/Reveal"
import { SectionHeading } from "@/components/site/SectionHeading"
import { artikel, type Artikel } from "@/data/perusahaan"
import { Link } from "@/lib/navigation"

/** Section ringkas artikel terbaru — diletakkan sebelum CTA banner. */
export function ArtikelSection({ items }: { items?: Artikel[] }) {
  const terbaru = (items ?? artikel).slice(0, 3)

  return (
    <section className="bg-background py-16 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Artikel"
            judul={"Wawasan teknik dari\npengalaman di lapangan"}
            deskripsi="Catatan praktis seputar perencanaan, pengawasan, perizinan, dan konstruksi."
            align="left"
          />
          <Link
            href="/artikel"
            className="text-primary hover:text-accent mb-1 inline-flex shrink-0 items-center gap-1.5 text-sm font-medium transition-colors"
          >
            Lihat semua artikel
            <ArrowRight className="size-4" />
          </Link>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {terbaru.map((a, i) => (
            <Reveal key={a.slug} delay={i * 0.05} className="h-full">
              <ArtikelCard item={a} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
