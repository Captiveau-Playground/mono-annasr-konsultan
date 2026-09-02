import { CalendarDays } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"

import { PageHero } from "@/components/site/PageHero"
import { Reveal } from "@/components/site/Reveal"
import { artikel } from "@/data/perusahaan"
import { isValidLocale } from "@/lib/navigation"

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "cs" }]
}

const judul = "Artikel — CV. AN NASR KONSULTAN"
const deskripsi =
  "Artikel dan wawasan seputar perencanaan, pengawasan, perizinan PBG & SLF, serta pelaksanaan konstruksi dari CV. AN NASR KONSULTAN Jombang."

export const metadata: Metadata = {
  title: judul,
  description: deskripsi,
}

export default async function ArtikelPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  setRequestLocale(locale)

  return (
    <>
      <PageHero
        eyebrow="Artikel"
        judul="Wawasan Teknik & Konstruksi"
        teks="Catatan praktis dari pengalaman kami menangani pekerjaan perencanaan, pengawasan, perizinan, dan konstruksi."
      />

      <section className="bg-background py-20 lg:py-24">
        <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {artikel.map((a, i) => (
              <Reveal key={a.slug} delay={i * 0.06} className="h-full">
                <article className="border-border bg-card flex h-full flex-col overflow-hidden rounded-xl border shadow-[var(--shadow-soft)]">
                  <Image
                    src={a.gambar}
                    alt={a.judul}
                    width={1200}
                    height={800}
                    className="aspect-[16/10] w-full object-cover"
                  />
                  <div className="flex flex-1 flex-col p-6">
                    <span className="text-accent text-xs font-semibold tracking-[0.18em] uppercase">
                      {a.kategori}
                    </span>
                    <h2 className="text-foreground mt-3 text-lg leading-snug">
                      {a.judul}
                    </h2>
                    <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                      {a.ringkas}
                    </p>
                    <p className="text-muted-foreground mt-auto flex items-center gap-2 pt-6 text-xs">
                      <CalendarDays className="text-primary size-3.5" />
                      {a.tanggal}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
