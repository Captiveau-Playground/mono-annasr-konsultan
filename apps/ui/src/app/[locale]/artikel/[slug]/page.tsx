import { ArrowLeft, CalendarDays, PenLine } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"

import { ArtikelCard } from "@/components/artikel/ArtikelCard"
import { CtaBanner } from "@/components/site/CtaBanner"
import { Reveal } from "@/components/site/Reveal"
import { artikel } from "@/data/perusahaan"
import { isValidLocale, Link } from "@/lib/navigation"

export function generateStaticParams() {
  const locales = ["en", "cs"]

  return artikel.flatMap((a) =>
    locales.map((locale) => ({ locale, slug: a.slug }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const item = artikel.find((a) => a.slug === slug)

  return {
    title: `${item?.judul ?? "Artikel"} — CV. AN NASR KONSULTAN`,
    description: item?.ringkas,
  }
}

export default async function DetailArtikel({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!isValidLocale(locale)) notFound()
  setRequestLocale(locale)

  const item = artikel.find((a) => a.slug === slug)
  if (!item) notFound()

  const terkait = artikel.filter((a) => a.slug !== slug).slice(0, 3)

  return (
    <>
      <article className="bg-background px-6 pt-32 pb-16 lg:px-8 lg:pt-40 lg:pb-20">
        <div className="mx-auto w-full max-w-6xl px-0">
          <Link
            href="/artikel"
            className="text-muted-foreground hover:text-primary inline-flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="size-4" />
            Kembali ke Artikel
          </Link>

          <Reveal className="mx-auto mt-8 max-w-3xl text-center">
            <span className="text-accent text-xs font-semibold tracking-[0.22em] uppercase">
              {item.kategori}
            </span>
            <h1 className="text-foreground mt-4 text-3xl leading-tight text-balance sm:text-4xl">
              {item.judul}
            </h1>
            <div className="text-muted-foreground mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
              <span className="flex items-center gap-2">
                <CalendarDays className="text-primary size-4" />
                {item.tanggal}
              </span>
              <span className="flex items-center gap-2">
                <PenLine className="text-primary size-4" />
                {item.penulis}
              </span>
            </div>
          </Reveal>

          <Reveal arah="scale" className="mt-10">
            <Image
              src={item.gambar}
              alt={item.judul}
              width={1400}
              height={875}
              priority
              className="border-border mx-auto aspect-[16/9] w-full rounded-[1.5rem] border object-cover shadow-[var(--shadow-soft)]"
            />
          </Reveal>

          <div className="mx-auto mt-12 max-w-3xl">
            {item.isi.map((paragraf, i) => (
              <Reveal key={i} delay={i * 0.03}>
                <p
                  className={`text-muted-foreground leading-relaxed ${
                    i === 0
                      ? "first-letter:text-primary text-lg first-letter:float-left first-letter:mr-3 first-letter:font-[family-name:var(--font-heading)] first-letter:text-5xl first-letter:leading-[0.85] first-letter:font-bold"
                      : "mt-6 text-base"
                  }`}
                >
                  {paragraf}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </article>

      <CtaBanner />

      {terkait.length > 0 ? (
        <section className="bg-surface py-20 lg:py-24">
          <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
            <Reveal className="flex flex-col gap-3">
              <h2 className="text-foreground text-3xl leading-[1.12] text-balance sm:text-4xl">
                Artikel Lainnya
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {terkait.map((a) => (
                <Reveal key={a.slug}>
                  <ArtikelCard item={a} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}
