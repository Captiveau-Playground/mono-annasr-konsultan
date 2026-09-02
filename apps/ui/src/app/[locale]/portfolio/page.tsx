import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"

import { KlienSection } from "@/components/sections/KlienSection"
import { PetaSection } from "@/components/sections/PetaSection"
import { PortfolioSection } from "@/components/sections/PortfolioSection"
import { CtaBanner } from "@/components/site/CtaBanner"
import { PageHero } from "@/components/site/PageHero"
import { fetchKontenSitus } from "@/lib/annasr/konten"
import { isValidLocale } from "@/lib/navigation"

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "cs" }]
}

const judul = "Portfolio Proyek — CV. AN NASR KONSULTAN"
const deskripsi =
  "Dokumentasi proyek bangunan, jalan, jembatan, irigasi, gedung, dan renovasi yang ditangani CV. AN NASR KONSULTAN di Jombang dan sekitarnya."

export const metadata: Metadata = {
  title: judul,
  description: deskripsi,
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
        eyebrow="Portfolio"
        judul={konten.portfolioHero.judul}
        teks={konten.portfolioHero.deskripsi}
      />
      <PortfolioSection items={konten.portfolio} />
      <KlienSection />
      <PetaSection />
      <CtaBanner />
    </>
  )
}
