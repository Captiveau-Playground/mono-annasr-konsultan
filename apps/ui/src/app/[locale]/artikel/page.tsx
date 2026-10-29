import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"

import { ArtikelList } from "@/components/artikel/ArtikelList"
import { JsonLd } from "@/components/seo/JsonLd"
import { PageHero } from "@/components/site/PageHero"
import { fetchKontenSitus } from "@/lib/annasr/konten"
import { isValidLocale } from "@/lib/navigation"
import { breadcrumbLd, halamanLd } from "@/lib/seo/structured-data"
import { alternatesUntuk, publicBaseUrl } from "@/lib/seo/urls"

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "cs" }]
}

const judul = "Artikel — CV. AN NASR KONSULTAN"
const deskripsi =
  "Artikel dan wawasan seputar perencanaan, pengawasan, perizinan PBG & SLF, serta pelaksanaan konstruksi dari CV. AN NASR KONSULTAN Jombang."

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isValidLocale(locale)) return {}
  const konten = await fetchKontenSitus(locale)
  const seo = konten.situs.seo?.artikel

  return {
    alternates: alternatesUntuk("/artikel", locale),
    title: seo?.judul || judul,
    description: seo?.deskripsi || deskripsi,
  }
}

export default async function ArtikelPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  setRequestLocale(locale)

  const konten = await fetchKontenSitus(locale)

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
                ],
              })
            : null,
          baseUrl
            ? halamanLd({
                tipe: "Blog",
                url: `${baseUrl}/artikel`,
                nama: "Artikel — CV. An Nasr Konsultan",
              })
            : null,
        ]}
      />
      <PageHero
        eyebrow={konten.situs.artikelHeroEyebrow}
        judul={konten.artikelHero.judul}
        teks={konten.artikelHero.deskripsi}
        latar="/images/new/header/header-artikel-bg.webp"
      />

      <section className="bg-background py-20 lg:py-24">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
          <ArtikelList items={konten.artikel} />
        </div>
      </section>
    </>
  )
}
