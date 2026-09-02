import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"

import { KlienSection } from "@/components/sections/KlienSection"
import { PetaSection } from "@/components/sections/PetaSection"
import { CtaBanner } from "@/components/site/CtaBanner"
import { PageHero } from "@/components/site/PageHero"
import { isValidLocale } from "@/lib/navigation"

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "cs" }]
}

const judul = "Klien Kami — CV. AN NASR KONSULTAN"
const deskripsi =
  "Instansi pemerintah, lembaga pendidikan, dan mitra usaha yang telah bekerja sama dengan CV. AN NASR KONSULTAN di Jombang dan berbagai kota di Indonesia."

export const metadata: Metadata = {
  title: judul,
  description: deskripsi,
}

export default async function KlienPage({
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
        eyebrow="Klien Kami"
        judul="Kepercayaan yang terjalin di banyak pintu"
        teks="Instansi pemerintah, lembaga pendidikan, dan mitra usaha mempercayakan pekerjaan tekniknya kepada kami."
      />
      <KlienSection />
      <PetaSection />
      <CtaBanner />
    </>
  )
}
