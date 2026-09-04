import { ArrowLeft, CalendarDays, PenLine } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"

import { TrackArticleRead } from "@/components/analytics/TrackArticleRead"
import { ArtikelCard } from "@/components/artikel/ArtikelCard"
import { BagikanArtikel } from "@/components/artikel/BagikanArtikel"
import { JsonLd } from "@/components/seo/JsonLd"
import { CtaBanner } from "@/components/site/CtaBanner"
import { Reveal } from "@/components/site/Reveal"
import { artikel } from "@/data/perusahaan"
import { fetchKontenSitus } from "@/lib/annasr/konten"
import { isValidLocale, Link } from "@/lib/navigation"
import { articleLd, breadcrumbLd } from "@/lib/seo/structured-data"
import { publicBaseUrl } from "@/lib/seo/urls"

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

  const konten = await fetchKontenSitus(locale)
  const item = konten.artikel.find((a) => a.slug === slug)
  if (!item) notFound()

  const terkait = konten.artikel.filter((a) => a.slug !== slug).slice(0, 3)
  const baseUrl = publicBaseUrl()

  return (
    <>
      <JsonLd
        data={[
          baseUrl
            ? breadcrumbLd({
                url: baseUrl,
                items: [
                  { name: "Beranda", path: "/" },
                  { name: "Artikel", path: "/artikel" },
                  { name: item.judul, path: `/artikel/${item.slug}` },
                ],
              })
            : null,
          baseUrl
            ? articleLd({
                url: (() => {
                  const u = new URL(`/artikel/${item.slug}`, baseUrl)

                  return u.href
                })(),
                judul: item.judul,
                ringkas: item.ringkas,
                kategori: item.kategori,
              })
            : null,
        ]}
      />
      <TrackArticleRead slug={item.slug} />
      <article className="bg-background px-6 pt-24 pb-16 lg:px-8 lg:pt-28 lg:pb-20">
        <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
          <Reveal>
            <Link
              href="/artikel"
              className="text-muted-foreground hover:text-primary inline-flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <ArrowLeft className="size-4" />
              Kembali ke Artikel
            </Link>
          </Reveal>

          {/* Kepala artikel */}
          <Reveal className="mx-auto mt-8 max-w-6xl">
            <p className="text-accent text-xs font-semibold tracking-[0.22em] uppercase">
              {item.kategori}
            </p>
            <h1 className="text-foreground mt-3 text-3xl leading-[1.15] text-balance sm:text-4xl lg:text-[2.75rem]">
              {item.judul}
            </h1>
            <div className="text-muted-foreground mt-6 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm">
              <span className="flex items-center gap-2">
                <CalendarDays className="text-primary size-4" />
                {item.tanggal}
              </span>
              <span className="text-border" aria-hidden>
                •
              </span>
              <span className="flex items-center gap-2">
                <PenLine className="text-primary size-4" />
                {item.penulis}
              </span>
            </div>
            <div className="bg-border mt-6 h-px w-full" aria-hidden />
          </Reveal>

          {/* Gambar sampul */}
          <Reveal arah="scale" className="mt-10">
            <figure>
              <Image
                src={item.gambar}
                alt={item.judul}
                width={1400}
                height={875}
                priority
                sizes="90vw"
                className="border-border aspect-[16/9] w-full rounded-3xl border object-cover"
              />
              <figcaption className="text-muted-foreground mt-3 text-center text-xs">
                Ilustrasi: {item.kategori} — {item.penulis}
              </figcaption>
            </figure>
          </Reveal>

          {/* Isi artikel */}
          <div className="mx-auto mt-12 max-w-6xl">
            {item.isi.map((paragraf, i) => (
              <Reveal key={i} delay={i * 0.02}>
                <p
                  className={
                    i === 0
                      ? "bg-primary/5 border-primary/10 text-foreground border-l-2 pl-4 text-lg leading-8"
                      : "text-foreground/85 mt-6 text-base leading-8 sm:text-lg"
                  }
                >
                  {paragraf}
                </p>
              </Reveal>
            ))}
          </div>

          <BagikanArtikel />
        </div>
      </article>

      <CtaBanner />

      {terkait.length > 0 ? (
        <section className="bg-background py-20 lg:py-24">
          <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
            <Reveal className="flex items-end justify-between gap-6">
              <h2 className="text-foreground text-3xl leading-[1.12] text-balance sm:text-4xl">
                Artikel Lainnya
              </h2>
              <Link
                href="/artikel"
                className="text-primary hover:text-accent mb-1 hidden shrink-0 text-sm font-medium transition-colors sm:block"
              >
                Lihat semua →
              </Link>
            </Reveal>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {terkait.map((a) => (
                <Reveal key={a.slug}>
                  <ArtikelCard item={a} />
                </Reveal>
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link
                href="/artikel"
                className="text-primary hover:text-accent text-sm font-medium transition-colors"
              >
                Lihat semua artikel →
              </Link>
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}
