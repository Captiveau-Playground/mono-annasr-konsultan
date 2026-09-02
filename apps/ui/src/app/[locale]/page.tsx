import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"

import { ArtikelSection } from "@/components/sections/ArtikelSection"
import { FaqSection } from "@/components/sections/FaqSection"
import { FounderSection } from "@/components/sections/FounderSection"
import { Hero } from "@/components/sections/Hero"
import { KlienSection } from "@/components/sections/KlienSection"
import { LayananSection } from "@/components/sections/LayananSection"
import { PetaSection } from "@/components/sections/PetaSection"
import { PortfolioSection } from "@/components/sections/PortfolioSection"
import { CtaBanner } from "@/components/site/CtaBanner"
import { isValidLocale } from "@/lib/navigation"

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "cs" }]
}

const judul =
  "CV. AN NASR KONSULTAN — Konsultan Teknik Sipil & Konstruksi Jombang"
const deskripsi =
  "Jasa perencanaan, pengawasan, perizinan (PBG & SLF), dan konstruksi bangunan, jalan, jembatan, serta irigasi di Kabupaten Jombang, Jawa Timur."

export const metadata: Metadata = {
  title: judul,
  description: deskripsi,
}

export default async function BerandaPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  setRequestLocale(locale)

  return (
    <>
      <Hero />
      <FounderSection />
      <LayananSection />
      <PortfolioSection />
      <KlienSection />
      <PetaSection />
      <ArtikelSection />
      <FaqSection />
      <CtaBanner />
    </>
  )
}
