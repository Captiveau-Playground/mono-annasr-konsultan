import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"

import { JangkauanSection } from "@/components/sections/JangkauanSection"
import { KlienSection } from "@/components/sections/KlienSection"
import { PortfolioSection } from "@/components/sections/PortfolioSection"
import { JsonLd } from "@/components/seo/JsonLd"
import { CtaBanner } from "@/components/site/CtaBanner"
import { fetchKontenSitus } from "@/lib/annasr/konten"
import { isValidLocale } from "@/lib/navigation"
import { breadcrumbLd, halamanLd } from "@/lib/seo/structured-data"
import { alternatesUntuk, publicBaseUrl } from "@/lib/seo/urls"

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "cs" }]
}

const judul = "Portofolio Proyek — CV. AN NASR KONSULTAN"
const deskripsi =
  "Dokumentasi proyek bangunan, jalan, jembatan, irigasi, gedung, dan renovasi yang ditangani CV. AN NASR KONSULTAN di Jombang dan sekitarnya."

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isValidLocale(locale)) return {}
  const konten = await fetchKontenSitus(locale)
  const seo = konten.situs.seo?.portfolio

  return {
    alternates: alternatesUntuk("/portfolio", locale),
    title: seo?.judul || judul,
    description: seo?.deskripsi || deskripsi,
  }
}

export default async function PortfolioPage({
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
                  { name: "Portofolio Proyek", path: "/portfolio" },
                ],
              })
            : null,
          baseUrl
            ? halamanLd({
                tipe: "CollectionPage",
                url: `${baseUrl}/portfolio`,
                nama: "Portofolio Proyek — CV. An Nasr Konsultan",
              })
            : null,
        ]}
      />
      <PortfolioSection
        items={konten.portfolio}
        showAllButton={false}
        tanpaJudul
      />
      <KlienSection
        items={konten.klien}
        judul={konten.klienHero.judul || undefined}
        eyebrow={konten.situs.klienEyebrow}
      />
      <JangkauanSection
        judul={konten.tentang.jangkauanJudul}
        kota={konten.tentang.kotaProyek}
        statistik={konten.tentang.statistik}
        brand={konten.situs.brandNama}
      />
      <CtaBanner
        judul={konten.beranda.cta?.judul}
        deskripsi={konten.beranda.cta?.deskripsi}
        eyebrow={konten.beranda.cta?.eyebrow || konten.situs.ctaEyebrow}
      />
    </>
  )
}
