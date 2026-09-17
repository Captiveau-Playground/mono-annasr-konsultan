import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"

import { JangkauanSection } from "@/components/sections/JangkauanSection"
import { KlienSection } from "@/components/sections/KlienSection"
import { PortfolioSection } from "@/components/sections/PortfolioSection"
import { CtaBanner } from "@/components/site/CtaBanner"
import { PageHero } from "@/components/site/PageHero"
import { fetchKontenSitus } from "@/lib/annasr/konten"
import { isValidLocale } from "@/lib/navigation"

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

  return (
    <>
      <PageHero
        eyebrow="Portofolio"
        judul={konten.portfolioHero.judul}
        teks={konten.portfolioHero.deskripsi}
      />
      <PortfolioSection items={konten.portfolio} showAllButton={false} />
      <KlienSection
        items={konten.klien}
        judul={konten.klienHero.judul || undefined}
      />
      <JangkauanSection
        judul={konten.tentang.jangkauanJudul}
        deskripsi={konten.tentang.jangkauanDeskripsi}
        kota={konten.tentang.kotaProyek}
        statistik={konten.tentang.statistik}
        brand={konten.situs.brandNama}
      />
      <CtaBanner
        judul={konten.beranda.cta?.judul}
        deskripsi={konten.beranda.cta?.deskripsi}
      />
    </>
  )
}
